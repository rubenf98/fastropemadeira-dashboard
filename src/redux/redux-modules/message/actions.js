import { types } from "./types";
import axios from "axios";
import queryString from "query-string";
const url = "http://localhost:8000";

export const fetchMessages = (page = 1, filters = {}) => ({
    type: types.FETCH_MESSAGES,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/messages?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchMessage = (id) => ({
    type: types.FETCH_MESSAGE,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${id}`)
})

export const deleteMessage = id => ({
    type: types.DELETE_MESSAGE,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/messages/${id}`),
    meta: { id }
});

export const createMessage = (data) => ({
    type: types.CREATE_MESSAGE,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, data),
});

export const addMessage = (data) => ({
    type: types.ADD_MESSAGE,
    payload: data,
});


export const updateMessage = (id, data) => ({
    type: types.UPDATE_MESSAGE,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/messages/${id}`, data),
});


export const markAsRead = (data) => ({
    type: types.MARK_AS_READ,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/mark-as-read/`, data),
});

