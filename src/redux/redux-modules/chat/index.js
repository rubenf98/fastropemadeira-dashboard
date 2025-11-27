import { types } from "./types";

export const initialState = {
    data: [],
    meta: {},
    links: {},
    loading: false,
    current: {},
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case `${types.DELETE_CHAT}_PENDING`:
        case `${types.CREATE_CHAT}_PENDING`:
        case `${types.UPDATE_CHAT}_PENDING`:
        case `${types.FETCH_CHATS}_PENDING`:
        case `${types.FETCH_CHAT}_PENDING`:
            return {
                ...state,
                loading: true,
            };

        case `${types.UPDATE_CHAT}_REJECTED`:
        case `${types.DELETE_CHAT}_REJECTED`:
        case `${types.CREATE_CHAT}_REJECTED`:
            return {
                ...state,
                loading: false,
            };

        case `${types.CREATE_CHAT}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: [action.payload.data.data, ...state.data]
            };

        case `${types.DELETE_CHAT}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: state.data.filter(
                    record => record.id !== action.meta.id
                )
            };

        case `${types.UPDATE_CHAT}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: state.data.map(
                    (record) =>
                        record.id === action.payload.data.data.id
                            ? action.payload.data.data
                            : record
                )
            };

        case `${types.FETCH_CHAT}_REJECTED`:
            return {
                ...state,
                loading: false,
                current: {},
            };
        case `${types.FETCH_CHATS}_REJECTED`:
            return {
                ...state,
                loading: false,
                data: []
            };
        case `${types.FETCH_CHAT}_FULFILLED`:
            return {
                ...state,
                loading: false,
                current: action.payload.data.data,
            };

        case `${types.FETCH_CHATS}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: action.payload.data.data,
                meta: action.payload.data.meta,
                links: action.payload.data.links
            };

        default:
            return state
    }
}