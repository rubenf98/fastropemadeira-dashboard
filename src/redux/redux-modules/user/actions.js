import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchUsers = (page = 1, filters = {}) => ({
    type: types.FETCH_USERS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/users?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const fetchUser = (id) => ({
    type: types.FETCH_USER,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`)
})

export const deleteUser = id => ({
    type: types.DELETE_USER,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`),
    meta: { id }
});

export const createUser = (data) => ({
    type: types.CREATE_USER,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/users`, data),
});


export const updateUser = (data) => ({
    type: types.UPDATE_USER,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/users`, data),
});


