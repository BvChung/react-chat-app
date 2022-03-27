import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "./messageService";

// Is useState() but for all in redux
const initialState = {
	messageArr: [],
	isLoading: false,
	isSuccess: false,
	isError: false,
	errorMessage: "",
	newMessage: {},
};

export const createChatMessage = createAsyncThunk(
	"message/create",
	async (messageData, thunkAPI) => {
		try {
			// thunkAPI has a method to get any state value from the redux store
			const token = thunkAPI.getState().auth.user.token;
			return await chatService.createMessage(messageData, token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const getChatMessage = createAsyncThunk(
	"message/getAll",
	async (_, thunkAPI) => {
		try {
			// thunkAPI has a method to get any state value from the redux store
			const token = thunkAPI.getState().auth.user.token;
			return await chatService.getMessage(token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const updateChatMessage = createAsyncThunk(
	"message/update",
	async (message) => {
		try {
			return message;
		} catch (err) {
			console.error(err);
		}
	}
);

const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {
		resetState: (state) => initialState,
		messageFromSender: (state, message) =>
			state.messageArr.allMessages.push(message),
	},
	extraReducers: (builder) => {
		builder.addCase(createChatMessage.pending, (state) => {
			state.isLoading = true;
			state.newMessage = {};
		});
		builder.addCase(createChatMessage.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.messageArr.allMessages.push(action.payload);
			state.newMessage = action.payload;
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
			state.isSuccess = true;
			state.messageArr = action.payload;
		});
		builder.addCase(getChatMessage.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		});
		builder.addCase(updateChatMessage.fulfilled, (state, action) => {
			state.messageArr.allMessages.push(action.payload);
		});
	},
});

export const { resetState } = messageSlice.actions;
export default messageSlice.reducer;
