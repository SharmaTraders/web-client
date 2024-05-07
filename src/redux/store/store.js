import storage from 'redux-persist/lib/storage'
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {baseApi} from "../features/api/setup";
import authReducer from "../features/state/authstate";
import {setupListeners} from "@reduxjs/toolkit/query";
import {persistReducer} from "redux-persist";
import itemReducer from '../features/state/itemState';


const persistConfig = {
    storage,
    key: 'root',
    version: 1,
}

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    item: itemReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);
export default store;