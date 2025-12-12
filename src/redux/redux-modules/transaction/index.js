import { types } from "./types";

export const initialState = {
  data: [],
  statistics: [],
  meta: {},
  links: {},
  loading: false,
  current: {},
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case `${types.DELETE_TRANSACTION}_PENDING`:
    case `${types.CREATE_TRANSACTION}_PENDING`:
    case `${types.UPDATE_TRANSACTION}_PENDING`:
    case `${types.FETCH_TRANSACTIONS}_PENDING`:
    case `${types.FETCH_TRANSACTION}_PENDING`:
    case `${types.FETCH_TRANSACTION_STATISTICS}_PENDING`:
      return {
        ...state,
        loading: true,
      };

    case `${types.UPDATE_TRANSACTION}_REJECTED`:
    case `${types.DELETE_TRANSACTION}_REJECTED`:
    case `${types.CREATE_TRANSACTION}_REJECTED`:
    case `${types.FETCH_TRANSACTION_STATISTICS}_REJECTED`:
      return {
        ...state,
        loading: false,
      };

    case `${types.CREATE_TRANSACTION}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: [action.payload.data.data, ...state.data],
      };

    case `${types.DELETE_TRANSACTION}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: state.data.filter((record) => record.id !== action.meta.id),
      };

    case `${types.UPDATE_TRANSACTION}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: state.data.map((record) =>
          record.id === action.payload.data.data.id
            ? action.payload.data.data
            : record
        ),
      };

    case `${types.FETCH_TRANSACTION}_REJECTED`:
      return {
        ...state,
        loading: false,
        current: {},
      };
    case `${types.FETCH_TRANSACTIONS}_REJECTED`:
      return {
        ...state,
        loading: false,
        data: [],
      };
    case `${types.FETCH_TRANSACTION}_FULFILLED`:
      return {
        ...state,
        loading: false,
        current: action.payload.data.data,
      };

    case `${types.FETCH_TRANSACTIONS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: action.payload.data.data,
        meta: action.payload.data.meta,
      };

    case `${types.FETCH_TRANSACTION_STATISTICS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        statistics: action.payload.data,
      };

    default:
      return state;
  }
};
