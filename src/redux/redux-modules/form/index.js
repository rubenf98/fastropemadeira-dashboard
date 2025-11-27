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
        case `${types.DELETE_FORM}_PENDING`:
        case `${types.CREATE_FORM}_PENDING`:
        case `${types.UPDATE_FORM}_PENDING`:
        case `${types.FETCH_FORMS}_PENDING`:
        case `${types.FETCH_FORM}_PENDING`:
            return {
                ...state,
                loading: true,
            };

        case `${types.UPDATE_FORM}_REJECTED`:
        case `${types.DELETE_FORM}_REJECTED`:
        case `${types.CREATE_FORM}_REJECTED`:
            return {
                ...state,
                loading: false,
            };

        case `${types.CREATE_FORM}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: [action.payload.data.data, ...state.data]
            };

        case `${types.DELETE_FORM}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: state.data.filter(
                    record => record.id !== action.meta.id
                )
            };

        case `${types.UPDATE_FORM}_FULFILLED`:
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

        case `${types.FETCH_FORM}_REJECTED`:
            return {
                ...state,
                loading: false,
                current: {},
            };
        case `${types.FETCH_FORMS}_REJECTED`:
            return {
                ...state,
                loading: false,
                data: []
            };
        case `${types.FETCH_FORM}_FULFILLED`:
            return {
                ...state,
                loading: false,
                current: action.payload.data.data,
            };

        case `${types.FETCH_FORMS}_FULFILLED`:
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