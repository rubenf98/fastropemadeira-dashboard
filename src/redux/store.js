import { reducer } from "./reducer";
import promise from "redux-promise-middleware";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from '@reduxjs/toolkit'




export const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(promise),
    devTools: true,
});

// export const persistor = persistStore(store);
