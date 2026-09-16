import AuthSlice from "@/store/slices/authslice";
import configSlice from "@/store/slices/configSlice";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import themeSlice from "@/store/slices/themeSlice";
import { AuthenticationApi } from "./apis/auth/authentication.api";
import { NotificationApi } from "./apis/core/notification.api";
import { ProjectApi } from "./apis/core/project.api";
import { ConfigurationApi } from "./apis/core/configuration.api";
import { PaymentApi } from "./apis/payment/payment.api";
import { OrderApi } from "./apis/payment/order.api";

export const store = configureStore({
  reducer: {
    auth: AuthSlice,
    theme: themeSlice,
    config: configSlice.reducer,
    [AuthenticationApi.reducerPath]: AuthenticationApi.reducer,
    [NotificationApi.reducerPath]: NotificationApi.reducer,
    [ProjectApi.reducerPath]: ProjectApi.reducer,
    [ConfigurationApi.reducerPath]: ConfigurationApi.reducer,
    [PaymentApi.reducerPath]: PaymentApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthenticationApi.middleware,
      NotificationApi.middleware,
      ProjectApi.middleware,
      ConfigurationApi.middleware,
      PaymentApi.middleware,
      OrderApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
