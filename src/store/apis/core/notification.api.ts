import { BASE_API_URL } from "@/constants/env";
import {
  NotificationInterfacePagination,
  NotifMarkInterface,
} from "@/types/notification.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const NotificationApi = createApi({
  reducerPath: "NotificationApi",
  refetchOnFocus: true,
  tagTypes: ["Notifications"],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access");
      if (token) {
        const userParsed = JSON.parse(token);
        headers.set("authorization", `Bearer ${userParsed}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserNotifications: builder.query<
      NotificationInterfacePagination,
      void | string
    >({
      query: (params) => `core/notifications/${params ?? ""}`,
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation<
      void,
      { data: Partial<NotifMarkInterface> }
    >({
      query: ({ data }) => ({
        url: `core/notifications/mark-as-read`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = NotificationApi;
