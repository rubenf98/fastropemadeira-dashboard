import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchForms = (filters = {}) => ({
    type: types.FETCH_FORMS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/forms?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}`)
})

export const fetchForm = (id) => ({
    type: types.FETCH_FORM,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/forms/${id}`)
})

export const deleteForm = id => ({
    type: types.DELETE_FORM,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/forms/${id}`),
    meta: { id }
});

export const createForm = (data) => ({
    type: types.CREATE_FORM,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/forms`, data),
});


export const updateForm = (id, data) => ({
    type: types.UPDATE_FORM,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, data),
});


