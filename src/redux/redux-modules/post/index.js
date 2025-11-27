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
    case `${types.FETCH_POSTS}_PENDING`:
    case `${types.CREATE_POST}_PENDING`:
      return {
        ...state,
        loading: true,
      };
    case `${types.CREATE_POST}_REJECTED`:
      return {
        ...state,
        loading: false,
      };

    case `${types.FETCH_POSTS}_REJECTED`:
      return {
        ...state,
        loading: false,
        data: [],
      };
    case `${types.CREATE_POST}_FULFILLED`:
      return {
        ...state,
        loading: false,
        data: [action.payload.data.data, ...state.data],
      };

    case `${types.FETCH_POSTS}_FULFILLED`:
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

    default:
      return state;
  }
};
