import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchSpeakers = (page = 1, filters = {}) => ({
    type: types.FETCH_SPEAKERS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/speakers?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchSpeaker = (id) => ({
    type: types.FETCH_SPEAKER,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/speakers/${id}`)
})

export const deleteSpeaker = id => ({
    type: types.DELETE_SPEAKER,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/speakers/${id}`),
    meta: { id }
});

export const createSpeaker = (data) => ({
    type: types.CREATE_SPEAKER,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/speakers`, data),
});


export const updateSpeaker = (id, data) => ({
    type: types.UPDATE_SPEAKER,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/speakers/${id}`, data),
});


