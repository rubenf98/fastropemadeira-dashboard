import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchTransactionPartners = (filters = {}) => ({
    type: types.FETCH_TRANSACTION_PARTNERS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/transaction-partners?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}`)
})

export const fetchTransactionPartner = (id) => ({
    type: types.FETCH_TRANSACTION_PARTNER,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/transaction-partners/${id}`)
})

export const deleteTransactionPartner = id => ({
    type: types.DELETE_TRANSACTION_PARTNER,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/transaction-partners/${id}`),
    meta: { id }
});

export const createTransactionPartner = (data) => ({
    type: types.CREATE_TRANSACTION_PARTNER,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/transaction-partners`, data),
});

export const liquidateTransactionPartner = (id, data) => ({
    type: types.LIQUIDATE_TRANSACTION_PARTNER,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/transaction-partners/liquidate/${id}`, data),
});


export const updateTransactionPartner = (id, data) => ({
    type: types.UPDATE_TRANSACTION_PARTNER,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/transaction-partners/${id}`, data),
});


