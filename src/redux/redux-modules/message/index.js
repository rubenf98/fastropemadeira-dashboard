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
        case `${types.DELETE_MESSAGE}_PENDING`:
        case `${types.CREATE_MESSAGE}_PENDING`:
        case `${types.UPDATE_MESSAGE}_PENDING`:
        case `${types.FETCH_MESSAGES}_PENDING`:
        case `${types.FETCH_MESSAGE}_PENDING`:
        case `${types.MARK_AS_READ}_PENDING`:
            return {
                ...state,
                loading: true,
            };

        case `${types.UPDATE_MESSAGE}_REJECTED`:
        case `${types.DELETE_MESSAGE}_REJECTED`:
        case `${types.MARK_AS_READ}_REJECTED`:
        case `${types.CREATE_MESSAGE}_REJECTED`:
            return {
                ...state,
                loading: false,
            };

        case `${types.MARK_AS_READ}_FULFILLED`:
            return {
                ...state,
                loading: false,
            };

        case `${types.ADD_MESSAGE}`: {
            var currentMessages = [...state.data];
            var newRecord = action.payload;
            if (currentMessages.some(message => message.date === newRecord.date)) {
                currentMessages.forEach(element => {
                    if (element.date === newRecord.date) {
                        element.messages.push(newRecord.message);
                    }
                });
            } else {
                currentMessages.push({ date: newRecord.date, messages: [newRecord.message] });
            }
            return {
                ...state,
                loading: false,
                data: currentMessages
            };
        }

        case `${types.CREATE_MESSAGE}_FULFILLED`: {
            var currentMessages = [...state.data];
            var newRecord = action.payload.data.data;
            var formattedDate = new Date(newRecord.created_at).toISOString().split("T")[0];

            if (currentMessages.some(message => message.date === formattedDate)) {
                currentMessages.forEach(element => {
                    if (element.date === formattedDate) {
                        element.messages.push(newRecord);
                    }
                });
            } else {
                currentMessages.push({ date: formattedDate, messages: [newRecord] });
            }
            return {
                ...state,
                loading: false,
                data: currentMessages
            };
        }

        case `${types.DELETE_MESSAGE}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: state.data.filter(
                    record => record.id !== action.meta.id
                )
            };

        case `${types.UPDATE_MESSAGE}_FULFILLED`:
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

        case `${types.FETCH_MESSAGE}_REJECTED`:
            return {
                ...state,
                loading: false,
                current: {},
            };
        case `${types.FETCH_MESSAGES}_REJECTED`:
            return {
                ...state,
                loading: false,
                data: []
            };
        case `${types.FETCH_MESSAGE}_FULFILLED`:
            return {
                ...state,
                loading: false,
                current: action.payload.data.data,
            };

        case `${types.FETCH_MESSAGES}_FULFILLED`:
            return {
                ...state,
                loading: false,
                data: action.payload.data,
                meta: action.payload.data.meta,
                links: action.payload.data.links
            };

        default:
            return state
    }
}