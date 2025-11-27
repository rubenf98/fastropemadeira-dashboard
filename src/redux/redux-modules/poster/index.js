import { types } from "./types";

export const initialState = {
  data: [],
  meta: {},
  links: {},
  loading: false,
  current: {},
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case `${types.FETCH_POSTERS}_PENDING`:
    case `${types.CREATE_POSTER}_PENDING`:
      return {
        ...state,
        loading: true,
      };
    case `${types.CREATE_POSTER}_REJECTED`:
      return {
        ...state,
        loading: false,
      };

    case `${types.FETCH_POSTERS}_REJECTED`:
      return {
        ...state,
        loading: false,
        data: [],
      };
    case `${types.CREATE_POSTER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: [action.payload.data.data, ...state.data],
      };

    case `${types.FETCH_POSTERS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data:
          action.payload.data.meta?.current_page === 1
            ? action.payload.data.data
            : [...state.data, ...action.payload.data.data],
        meta: action.payload.data.meta,
        links: action.payload.data.links,
      };

    case `${types.FETCH_POSTER}_FULFILLED`:
      return {
        ...state,
        loading: false,
        current: action.payload.data.data,
      };

    default:
      return state;
  }
};
