import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchTransactions = (page = 1, filters = {}) => ({
    type: types.FETCH_TRANSACTIONS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/transactions?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchTransaction = (id) => ({
    type: types.FETCH_TRANSACTION,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`)
})

export const deleteTransaction = id => ({
    type: types.DELETE_TRANSACTION,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`),
    meta: { id }
});

export const createTransaction = (data) => ({
    type: types.CREATE_TRANSACTION,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/transactions`, data),
});


export const updateTransaction = (id, data) => ({
    type: types.UPDATE_TRANSACTION,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, data),
});


