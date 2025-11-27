import { types } from "./types";

export function setLightTheme() {
    return {
        type: types.SET_LIGHT_THEME, payload: "light"
    };
}

export function setDarkTheme() {
    return {
        type: types.SET_DARK_THEME, payload: "dark"
    };
}

export function setHasAction(value) {
    return {
        type: types.SET_HAS_ACTION, payload: value
    };
}

export function setHasClickedAction(value = true) {
    return {
        type: types.SET_HAS_CLICKED_ACTION, payload: value
    };
}


export function setNotifications(data) {
    return {
        type: types.SET_NOTIFICATIONS, payload: data
    };
}