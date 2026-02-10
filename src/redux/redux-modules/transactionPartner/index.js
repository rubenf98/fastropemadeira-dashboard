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
    case `${types.DELETE_TRANSACTION_PARTNER}_PENDING`:
    case `${types.CREATE_TRANSACTION_PARTNER}_PENDING`:
    case `${types.UPDATE_TRANSACTION_PARTNER}_PENDING`:
    case `${types.FETCH_TRANSACTION_PARTNERS}_PENDING`:
    case `${types.FETCH_TRANSACTION_PARTNER}_PENDING`:
    case `${types.LIQUIDATE_TRANSACTION_PARTNER}_PENDING`:

      return {
        ...state,
        loading: true,
      };

    case `${types.UPDATE_TRANSACTION_PARTNER}_REJECTED`:
    case `${types.DELETE_TRANSACTION_PARTNER}_REJECTED`:
    case `${types.CREATE_TRANSACTION_PARTNER}_REJECTED`:
    case `${types.LIQUIDATE_TRANSACTION_PARTNER}_REJECTED`:
      return {
        ...state,
        loading: false,
      };

    case `${types.LIQUIDATE_TRANSACTION_PARTNER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: state.data.map((record) =>
          record.id === action.payload.data.data.id
            ? action.payload.data.data
            : record
        ),
        current: state.current.id === action.payload.data.data.id
          ? action.payload.data.data
          : state.current,
      };

    case `${types.CREATE_TRANSACTION_PARTNER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: [action.payload.data.data, ...state.data],
      };

    case `${types.DELETE_TRANSACTION_PARTNER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: state.data.filter((record) => record.id !== action.meta.id),
      };

    case `${types.UPDATE_TRANSACTION_PARTNER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: state.data.map((record) =>
          record.id === action.payload.data.data.id
            ? action.payload.data.data
            : record
        ),
      };

    case `${types.FETCH_TRANSACTION_PARTNER}_REJECTED`:
      return {
        ...state,
        loading: false,
        current: {},
      };
    case `${types.FETCH_TRANSACTION_PARTNERS}_REJECTED`:
      return {
        ...state,
        loading: false,
        data: [],
      };
    case `${types.FETCH_TRANSACTION_PARTNER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        current: action.payload.data.data,
      };

    case `${types.FETCH_TRANSACTION_PARTNERS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: action.payload.data.data,
        meta: action.payload.data.meta,
      };



    default:
      return state;
  }
};
