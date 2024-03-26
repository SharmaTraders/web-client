import storage from 'redux-persist/lib/storage'
import {combineReducers, configureStore, isRejected} from "@reduxjs/toolkit";
import {baseApi} from "../features/api/setup";
import authReducer from "../features/state/authstate";
import billingPartyReducer from "../features/state/billingPartyState";
import {setupListeners} from "@reduxjs/toolkit/query";
import {persistReducer} from "redux-persist";
import {toast} from "react-toastify";


const persistConfig = {
    storage,
    key: 'root',
    version: 1,
    whitelist: ["auth"]
}

export const rtkQueryErrorLogger = (store) => (next) => (action) => {
    // isRejectedWithValue Or isRejected
    if (isRejected(action)) {
        console.log(action); // get all data from rejected request
        if (action.payload && action.payload.status === 401) {
            toast.error("You need to login to perform the action", {
                toastId: "loadingBillingParty",
                autoClose: 8000
            })
        }
    }

    return next(action);
};

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    billingParty: billingPartyReducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware, rtkQueryErrorLogger)
});

setupListeners(store.dispatch);
export default store;