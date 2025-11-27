import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchFaqs = (filters = {}) => ({
    type: types.FETCH_FAQS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/faqs?${queryString.stringify(filters, {
        arrayFaqat: "index"
    })}`)
})

export const fetchFaq = (id) => ({
    type: types.FETCH_FAQ,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/faqs/${id}`)
})

export const deleteFaq = id => ({
    type: types.DELETE_FAQ,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/faqs/${id}`),
    meta: { id }
});

export const createFaq = (data) => ({
    type: types.CREATE_FAQ,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/faqs`, data),
});


export const updateFaq = (id, data) => ({
    type: types.UPDATE_FAQ,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/faqs/${id}`, data),
});


