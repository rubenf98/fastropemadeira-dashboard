import { types } from "./types";
import axios from "axios";
import queryString from "query-string";

export const fetchPosts = (page = 1, filters = {}) => ({
  type: types.FETCH_POSTS,
  payload: axios.get(
    `${import.meta.env.VITE_API_URL}/api/posts?${queryString.stringify(
      filters,
      {
        arrayFormat: "index",
      }
    )}&page=${page}`
  ),
});

export const createPost = (data) => ({
  type: types.CREATE_POST,
  payload: axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
});
