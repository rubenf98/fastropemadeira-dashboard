import { types } from "./types";
import axios from "axios";
import queryString from "query-string";

export const fetchPosters = (page = 1, filters = {}) => ({
  type: types.FETCH_POSTERS,
  payload: axios.get(
    `${import.meta.env.VITE_API_URL}/api/posters?${queryString.stringify(
      filters,
      {
        arrayFormat: "index",
      }
    )}&page=${page}`
  ),
});

export const fetchPoster = (id) => ({
  type: types.FETCH_POSTER,
  payload: axios.get(`${import.meta.env.VITE_API_URL}/api/posters/${id}`)
})


export const createPoster = (data) => ({
  type: types.CREATE_POSTER,
  payload: axios.post(`${import.meta.env.VITE_API_URL}/api/posters`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
});
