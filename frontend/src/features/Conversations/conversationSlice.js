import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import conversationService from "./conversationService";
import {
	filterMembers,
	errorMessage,
	updateGroup,
} from "../helperFunc/helperFunctions";

const initialState = {
	registeredMembers: {},
	groups: {},
	groupInfo: {
		groupId: "Global",
		groupOwner: "",
		members: [],
	},
	sendGroupToSocket: {},
	sendMembersToSocket: {},
	filteredMembers: {},
	isLoading: false,
	isSuccess: false,
	isError: false,
};

export const createChatGroups = createAsyncThunk(
	"conversation/create",
	async (conversationData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await conversationService.createGroup(conversationData, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getChatGroups = createAsyncThunk(
	"conversation/get",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await conversationService.getGroup(token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getRegisteredMembers = createAsyncThunk(
	"group/getMembers",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await conversationService.getMembers(token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const addGroupMembers = createAsyncThunk(
	"group/addMembers",
	async (memberId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.groupInfo;
			return await conversationService.addMembers(memberId, groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const removeGroupMembers = createAsyncThunk(
	"group/removeMembers",
	async (memberId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.groupInfo;
			return await conversationService.removeMembers(memberId, groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateActiveChatGroup = createAsyncThunk(
	"group/active",
	async (groupInfo, thunkAPI) => {
		try {
			return groupInfo;
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateMembersWithSocket = createAsyncThunk(
	"group/updateWithSocket",
	async (membersData, thunkAPI) => {
		try {
			return membersData;
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const conversationSlice = createSlice({
	name: "conversation",
	initialState,
	reducers: {
		resetGroupState: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder.addCase(createChatGroups.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(createChatGroups.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.groups.push(action.payload);
			// state.sendGroupToSocket = action.payload;
		});
		builder.addCase(createChatGroups.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(getChatGroups.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getChatGroups.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.groups = action.payload.userConversations;
		});
		builder.addCase(getChatGroups.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(addGroupMembers.fulfilled, (state, action) => {
			state.isSuccess = true;
			state.groupInfo.members = action.payload.members;
			state.filteredMembers = filterMembers(
				state.registeredMembers,
				state.groupInfo.members
			);

			state.sendGroupToSocket = action.payload;
			state.sendMembersToSocket = action.payload.members;

			// Update users groups when group owner adds member
			const currentGroup = current(state.groupInfo);
			state.groups = updateGroup(state.groups, currentGroup, action.payload);
		});
		builder.addCase(addGroupMembers.rejected, (state) => {
			state.isError = true;
		});
		builder.addCase(removeGroupMembers.fulfilled, (state, action) => {
			state.isSuccess = true;
			state.groupInfo.members = action.payload.members;
			state.filteredMembers = filterMembers(
				state.registeredMembers,
				state.groupInfo.members
			);

			state.sendGroupToSocket = action.payload;
			state.sendMembersToSocket = action.payload.members;

			// Updates users groups when group owner removes member
			const currentGroup = current(state.groupInfo);
			state.groups = updateGroup(state.groups, currentGroup, action.payload);
		});
		builder.addCase(removeGroupMembers.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(getRegisteredMembers.fulfilled, (state, action) => {
			state.registeredMembers = action.payload;
		});
		builder.addCase(updateActiveChatGroup.fulfilled, (state, action) => {
			state.groupInfo = action.payload;
			state.filteredMembers = filterMembers(
				state.registeredMembers,
				state.groupInfo.members
			);
		});
		builder.addCase(updateMembersWithSocket.fulfilled, (state, action) => {
			state.groupInfo.members = action.payload;
		});
	},
});

export const { resetGroupState } = conversationSlice.actions;
export default conversationSlice.reducer;
