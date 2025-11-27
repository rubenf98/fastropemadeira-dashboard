import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchSponsors = (page = 1, filters = {}) => ({
    type: types.FETCH_SPONSORS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/sponsors?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchSponsor = (id) => ({
    type: types.FETCH_SPONSOR,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/sponsors/${id}`)
})

export const deleteSponsor = id => ({
    type: types.DELETE_SPONSOR,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/sponsors/${id}`),
    meta: { id }
});

export const createSponsor = (data) => ({
    type: types.CREATE_SPONSOR,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/sponsors`, data),
});


export const updateSponsor = (id, data) => ({
    type: types.UPDATE_SPONSOR,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/sponsors/${id}`, data),
});


