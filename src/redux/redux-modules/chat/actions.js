import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchChats = (page = 1, filters = {}) => ({
    type: types.FETCH_CHATS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/chats?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchChat = (id) => ({
    type: types.FETCH_CHAT,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${id}`)
})

export const deleteChat = id => ({
    type: types.DELETE_CHAT,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/chats/${id}`),
    meta: { id }
});

export const createChat = (data) => ({
    type: types.CREATE_CHAT,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/chats`, data),
});


export const updateChat = (id, data) => ({
    type: types.UPDATE_CHAT,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, data),
});


