import { BASE_API_URL } from "@/constants/env";
import { AppConfigInterface } from "@/types/configuration.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ConfigurationApi = createApi({
  reducerPath: "ConfigurationApi",
  tagTypes: ["Configuration"],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access");
      if (token) {
        headers.set("authorization", `Bearer ${JSON.parse(token)}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getConfiguration: builder.query<AppConfigInterface, void>({
      query: () => "core/configuration/",
      providesTags: ["Configuration"],
    }),
    updateConfiguration: builder.mutation<AppConfigInterface, FormData>({
      query: (data) => ({
        url: "core/configuration/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Configuration"],
    }),
    resetConfiguration: builder.mutation<AppConfigInterface, void>({
      query: () => ({
        url: "core/configuration/reset/",
        method: "POST",
      }),
      invalidatesTags: ["Configuration"],
    }),
  }),
});

export const {
  useGetConfigurationQuery,
  useUpdateConfigurationMutation,
  useResetConfigurationMutation,
} = ConfigurationApi;
