import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchQuestions = (filters = {}) => ({
    type: types.FETCH_QUESTIONS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/questions?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}`)
})

export const fetchQuestion = (id) => ({
    type: types.FETCH_QUESTION,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/questions/${id}`)
})

export const deleteQuestion = id => ({
    type: types.DELETE_QUESTION,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/questions/${id}`),
    meta: { id }
});

export const createQuestion = (data) => ({
    type: types.CREATE_QUESTION,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, data),
});


export const updateQuestion = (id, data) => ({
    type: types.UPDATE_QUESTION,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/questions/${id}`, data),
});


