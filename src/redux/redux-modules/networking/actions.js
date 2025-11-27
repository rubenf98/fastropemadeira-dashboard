import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchNetworkings = (page = 1, filters = {}) => ({
    type: types.FETCH_NETWORKINGS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/networkings?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchNetworking = (id) => ({
    type: types.FETCH_NETWORKING,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/networkings/${id}`)
})

export const deleteNetworking = id => ({
    type: types.DELETE_NETWORKING,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/networkings/${id}`),
    meta: { id }
});

export const createNetworking = (data) => ({
    type: types.CREATE_NETWORKING,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/networkings`, data),
});


export const updateNetworking = (id, data) => ({
    type: types.UPDATE_NETWORKING,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/networkings/${id}`, data),
});


