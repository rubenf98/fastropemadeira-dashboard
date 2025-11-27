import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchNotifications = (page = 1, filters = {}) => ({
    type: types.FETCH_NOTIFICATIONS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/notifications?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}&page=${page}`)
})

export const countNotifications = () => ({
    type: types.COUNT_NOTIFICATIONS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/count-notifications`)
})


export const fetchNotification = (id) => ({
    type: types.FETCH_NOTIFICATION,
    payload: axios.get(`${import.meta.env.VITE_API_URL} / api / notifications / ${id}`)
})

export const deleteNotification = id => ({
    type: types.DELETE_NOTIFICATION,
    payload: axios.delete(`${import.meta.env.VITE_API_URL} / api / notifications / ${id}`),
    meta: { id }
});

export const createNotification = (data) => ({
    type: types.CREATE_NOTIFICATION,
    payload: axios.post(`${import.meta.env.VITE_API_URL} / api / notifications`, data),
});


export const updateNotification = (id, data) => ({
    type: types.UPDATE_NOTIFICATION,
    payload: axios.put(`${import.meta.env.VITE_API_URL} / api / notifications / ${id}`, data),
});


