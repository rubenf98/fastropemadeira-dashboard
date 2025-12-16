import { types } from "./types";
// import api from "../api/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";



// export const createUser = (data) => ({
//     type: types.CREATE_USER,
//     payload: api.createUser(data),
// });

// export const login = (data) => {
//     return (dispatch) => {
//         return axios.post(`${import.meta.env.VITE_PROD_API_URL}/api/login`, data).then((res) => {
//             console.log(res.data.token);
//             const token = res.data.token.token;
//             localStorage.setItem("token", token);
//             setAuthorizationToken(token);
//             dispatch(loginSuccess(jwtDecode(token), res.data.user.user));
//         });
//     };
// };

export const login = (data) => ({
    type: types.LOGIN,
    payload: axios.post(`${import.meta.env.VITE_PROD_API_URL}/api/login`, data),
});

export const me = () => ({
    type: types.ME,
    payload: axios.post(`${import.meta.env.VITE_PROD_API_URL}/api/me`),
});

export function loginSuccess(token, user) {
    return {
        type: types.LOGIN_SUCCESS,
        payload: token,
        user: user,
    };
}

export const logout = () => {
    return (dispatch) => {
        const response = dispatch({
            type: types.LOGOUT,
            payload: axios.post(`${import.meta.env.VITE_PROD_API_URL}/api/logout`),
        });
        response.then((res) => {
            resetToken();
        });
    };
};

export function refreshAuthorizationToken(token) {
    return (dispatch) => {
        return axios
            .get({
                url: `${import.meta.env.VITE_PROD_API_URL}/api/refresh`,
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const token = res.data.data.access_token;
                localStorage.setItem("token", token);
                setAuthorizationToken(token);
                dispatch(loginSuccess(jwtDecode(token)));
            })
            .catch((err) => {
                resetToken();
            });
    };
}
export function setAuthorizationToken(token) {
    token
        ? (axios.defaults.headers.common["Authorization"] = `Bearer ${token}`)
        : delete axios.defaults.headers.common["Authorization"];
}

export function resetToken() {
    localStorage.removeItem("token");
    setAuthorizationToken(false);
}

export const updateUser = (data) => ({
    type: types.UPDATE_USER,
    payload: axios.post(`${import.meta.env.VITE_PROD_API_URL}/api/users`, data),
});


export const deleteUser = (data) => ({
    type: types.DELETE_USER,
    payload: axios.delete(`${import.meta.env.VITE_PROD_API_URL}/api/deleteUser`, data),
});
// export const updateProfilePicture = (id, data) => ({
//     type: types.UPDATE_PROFILE_PICTURE,
//     payload: api.updateProfilePicture(id, data),
//     meta: { globalError: true },
// });
