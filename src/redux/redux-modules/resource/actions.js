import { types } from "./types";
import axios from "axios";
import queryString from "query-string";
import { download } from "../../../helper";

export const fetchResources = (filters = {}) => ({
  type: types.FETCH_RESOURCES,
  payload: axios.get(
    `${import.meta.env.VITE_API_URL}/api/medias?${queryString.stringify(
      filters,
      {
        arrayFormat: "index",
      }
    )}`
  ),
});

// export const fetchResource = (id) => ({
//     type: types.FETCH_RESOURCE,
//     payload: axios.get(`${import.meta.env.VITE_API_URL}/api/medias/${id}`)
// })

export const deleteResource = (id) => ({
  type: types.DELETE_RESOURCE,
  payload: axios.delete(`${import.meta.env.VITE_API_URL}/api/medias/${id}`),
  meta: { id },
});

export const createResource = (data) => ({
  type: types.CREATE_RESOURCE,
  payload: axios.post(`${import.meta.env.VITE_API_URL}/api/medias`, data),
});

export const updateResource = (id, data) => ({
  type: types.UPDATE_RESOURCE,
  payload: axios.put(`${import.meta.env.VITE_API_URL}/api/medias/${id}`, data),
});

export const fetchResource = (resource) => ({
  type: types.FETCH_RESOURCE,
  payload: axios({
    url: resource.url,
    method: "GET",
    responseType: "blob",
  }).then(
    (response) => {
      download(response, "file" + resource.id);
    },
    (error) => {
      return error.data;
    }
  ),
  meta: { globalError: true },
});
