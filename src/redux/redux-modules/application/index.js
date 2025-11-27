import { notification } from "antd";
import { types } from "./types";

export const initialState = {
    theme: "light",
    hasAction: false,
    hasClickedAction: false,
    notifications: {},
    notificationTitle: "",
    notificationType: "info"
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case `${types.SET_DARK_THEME}`:
        case `${types.SET_LIGHT_THEME}`:
            return {
                ...state,
                theme: action.payload,
            };

        case `${types.SET_HAS_ACTION}`:
            return {
                ...state,
                hasAction: action.payload,
            };

        case `${types.SET_HAS_CLICKED_ACTION}`:
            return {
                ...state,
                hasClickedAction: action.payload,
            };

        case `${types.SET_NOTIFICATIONS}`:
            return {
                ...state,
                notificationTitle: action.payload.title,
                notifications: action.payload.notifications,
                notificationType: action.payload.type,
            };


        default:
            return state
    }
}