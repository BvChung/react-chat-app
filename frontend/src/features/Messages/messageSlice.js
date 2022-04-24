import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "./messageService";
import {
	errorMessage,
	filterDuplicateMessages,
	deleteData,
	addMessageHistoryToEmptyArr,
	addMessageDateHistoryDisplay,
} from "../helperFunc/helperFunctions";

// Is useState() but for all in redux
const initialState = {
	userMessages: {},
	newMessageToSocket: {},
	deletedMessageToSocket: {},
	isLoading: false,
	loadInitialMessages: false,
	isSuccess: false,
	isError: false,
	errorMessage: "",
};

export const getChatMessage = createAsyncThunk(
	"message/getAll",
	async (_, thunkAPI) => {
		try {
			// thunkAPI has a method to get any state value from the redux store
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.groupInfo;
			return await chatService.getMessage(groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const createChatMessage = createAsyncThunk(
	"message/create",
	async (messageData, thunkAPI) => {
		try {
			// thunkAPI has a method to get any state value from the redux store
			const token = thunkAPI.getState().auth.user.token;
			return await chatService.createMessage(messageData, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const deleteChatMessage = createAsyncThunk(
	"message/delete",
	async (messageId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await chatService.deleteMessage(messageId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateDeletedMessageWithSocket = createAsyncThunk(
	"message/deletedWithSocket",
	async (socketData, thunkAPI) => {
		try {
			return socketData;
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateChatMessage = createAsyncThunk(
	"message/update",
	async (message) => {
		try {
			return message;
		} catch (error) {
			console.error(error);
		}
	}
);

export const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {
		resetMessageState: (state) => initialState,
		resetMessagesWithGroupRemoval: (state) => {
			state.userMessages.groupMessages = [];
		},
	},
	extraReducers: (builder) => {
		builder.addCase(createChatMessage.pending, (state) => {
			state.isLoading = true;
			state.newMessageToSocket = {};
		});
		builder.addCase(createChatMessage.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.userMessages.groupMessages = addMessageHistoryToEmptyArr(
				state.userMessages.groupMessages,
				action.payload
			);
			// state.userMessages.groupMessages.push(action.payload);
			state.newMessageToSocket = action.payload;
		});
		builder.addCase(createChatMessage.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		});
		builder.addCase(getChatMessage.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getChatMessage.fulfilled, (state, action) => {
			state.isLoading = false;
			state.loadInitialMessages = true;
			state.userMessages = action.payload;
			state.userMessages.groupMessages = addMessageDateHistoryDisplay(
				action.payload.groupMessages
			);
		});
		builder.addCase(getChatMessage.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		});
		builder.addCase(updateChatMessage.fulfilled, (state, action) => {
			state.userMessages.groupMessages.push(action.payload);
			state.userMessages.groupMessages = filterDuplicateMessages(
				state.userMessages.groupMessages
			);
		});
		builder.addCase(deleteChatMessage.fulfilled, (state, action) => {
			console.log(action.payload);
			state.userMessages.groupMessages = deleteData(
				state.userMessages.groupMessages,
				action.payload
			);
			state.deletedMessageToSocket = action.payload;
		});
		builder.addCase(
			updateDeletedMessageWithSocket.fulfilled,
			(state, action) => {
				state.userMessages.groupMessages = deleteData(
					state.userMessages.groupMessages,
					action.payload
				);
			}
		);
	},
});

export const { resetMessageState, resetMessagesWithGroupRemoval } =
	messageSlice.actions;
export default messageSlice.reducer;
