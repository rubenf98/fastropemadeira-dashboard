import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchTrackers = (page = 1, filters = {}) => ({
    type: types.FETCH_TRACKERS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/trackers?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchTracker = (id) => ({
    type: types.FETCH_TRACKER,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/trackers/${id}`)
})

export const deleteTracker = id => ({
    type: types.DELETE_TRACKER,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/trackers/${id}`),
    meta: { id }
});

export const createTracker = (data) => ({
    type: types.CREATE_TRACKER,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/trackers`, data),
});


export const updateTracker = (id, data) => ({
    type: types.UPDATE_TRACKER,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/trackers/${id}`, data),
});


