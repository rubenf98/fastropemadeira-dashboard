import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchSessions = (filters = {}) => ({
    type: types.FETCH_PROGRAM_SESSIONS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/program-sessions?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}`)
})

export const fetchSession = (id) => ({
    type: types.FETCH_PROGRAM_SESSION,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/program-sessions/${id}`)
})

export const deleteSession = id => ({
    type: types.DELETE_PROGRAM_SESSION,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/program-sessions/${id}`),
    meta: { id }
});

export const createSession = (data) => ({
    type: types.CREATE_PROGRAM_SESSION,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/program-sessions`, data),
});


export const updateSession = (id, data) => ({
    type: types.UPDATE_PROGRAM_SESSION,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/program-sessions/${id}`, data),
});


