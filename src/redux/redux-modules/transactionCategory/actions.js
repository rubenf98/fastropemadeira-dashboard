import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchTransactionCategories = (filters = {}) => ({
    type: types.FETCH_TRANSACTION_CATEGORIES,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/transaction-categories?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}`)
})

export const fetchTransactionCategory = (id) => ({
    type: types.FETCH_TRANSACTION_CATEGORY,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/transaction-categories/${id}`)
})

export const deleteTransactionCategory = id => ({
    type: types.DELETE_TRANSACTION_CATEGORY,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/transaction-categories/${id}`),
    meta: { id }
});

export const createTransactionCategory = (data) => ({
    type: types.CREATE_TRANSACTION_CATEGORY,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/transaction-categories`, data),
});


export const updateTransactionCategory = (id, data) => ({
    type: types.UPDATE_TRANSACTION_CATEGORY,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/transaction-categories/${id}`, data),
});


