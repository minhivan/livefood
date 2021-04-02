import {createSlice} from "@reduxjs/toolkit"
import { getDefaultMiddleware } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatID: null,
        recipient: null,
    },
    reducers: {
        setChat: (state, action) => {
            state.chatID = action.payload.roomID;
            state.recipient = action.payload.recipient;
        },
        removeChat: state => {
            state.chatID = null;
            state.recipient = null
        }

    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    }),
})

export const {setChat, removeChat} = chatSlice.actions;

export const selectChatID = (state) => state.chat.chatID;
export const selectChatRecipient = (state) => state.chat.recipient;
export default chatSlice.reducer;