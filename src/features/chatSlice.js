import {createSlice} from "@reduxjs/toolkit"

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatID: null,
        chatName: null,
    },
    reducers: {
        setChat: (state, action) => {
            state.chatID = action.payload.chatID;
            state.chatName = action.payload.chatName;
        },

    }
})

export const {setChat} = chatSlice.actions;

export const selectChatName = (state) => state.chat.chatName;
export const selectChatID = (state) => state.chat.chatID;


export default chatSlice.reducer;