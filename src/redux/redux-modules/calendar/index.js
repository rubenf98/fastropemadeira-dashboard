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
        case `${types.DELETE_CALENDAR}_PENDING`:
        case `${types.CREATE_CALENDAR}_PENDING`:
        case `${types.UPDATE_CALENDAR}_PENDING`:
        case `${types.FETCH_CALENDARS}_PENDING`:
        case `${types.FETCH_CALENDAR}_PENDING`:
        case `${types.UPDATE_SELF_CALENDAR}_PENDING`:
            return {
                ...state,
                loading: true,
            };

        case `${types.UPDATE_CALENDAR}_REJECTED`:
        case `${types.DELETE_CALENDAR}_REJECTED`:
        case `${types.CREATE_CALENDAR}_REJECTED`:
        case `${types.UPDATE_SELF_CALENDAR}_REJECTED`:
            return {
                ...state,
                loading: false,
            };


        case `${types.UPDATE_SELF_CALENDAR}_FULFILLED`: {
            var currentCalendar = { ...state.data };
            var newRecord = action.payload.data.data;
            var array = currentCalendar[newRecord.from]

            if (array) {
                for (let index = 0; index < array.length; index++) {
                    if (array[index].id === newRecord.id) {
                        array[index] = newRecord;
                        break;
                    }
                }
            } else {
                currentCalendar = []
            }



            return {
                ...state,
                loading: false,
                data: currentCalendar
            };
        }
        case `${types.CREATE_CALENDAR}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: [action.payload.data.data, ...state.data]
            };

        case `${types.DELETE_CALENDAR}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: state.data.filter(
                    record => record.id !== action.meta.id
                )
            };

        case `${types.UPDATE_CALENDAR}_FULFILLED`:
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

        case `${types.FETCH_CALENDAR}_REJECTED`:
            return {
                ...state,
                loading: false,
                current: {},
            };
        case `${types.FETCH_CALENDARS}_REJECTED`:
            return {
                ...state,
                loading: false,
                data: []
            };
        case `${types.FETCH_CALENDAR}_FULFILLED`:
            return {
                ...state,
                loading: false,
                current: action.payload.data.data,
            };

        case `${types.FETCH_CALENDARS}_FULFILLED`:
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