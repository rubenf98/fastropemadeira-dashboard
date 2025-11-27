import { types } from "./types";
import axios from "axios";
import queryString from "query-string";


export const fetchCalendars = (filters = {}) => ({
    type: types.FETCH_CALENDARS,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/calendars?${queryString.stringify(filters, {
        arrayFormat: "index"
    })}`)
})

export const fetchCalendar = (id) => ({
    type: types.FETCH_CALENDAR,
    payload: axios.get(`${import.meta.env.VITE_API_URL}/api/calendars/${id}`)
})

export const deleteCalendar = id => ({
    type: types.DELETE_CALENDAR,
    payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/calendars/${id}`),
    meta: { id }
});

export const createCalendar = (data) => ({
    type: types.CREATE_CALENDAR,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/calendars`, data),
});

export const updateSelfCalendar = (id) => ({
    type: types.UPDATE_SELF_CALENDAR,
    payload: axios.post(`${import.meta.env.VITE_API_URL}/api/update-calendar/${id}`),
});

export const updateCalendar = (id, data) => ({
    type: types.UPDATE_CALENDAR,
    payload: axios.put(`${import.meta.env.VITE_API_URL}/api/calendars/${id}`, data),
});


