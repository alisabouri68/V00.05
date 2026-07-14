import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "qs";

export const plugSlice = createApi({
  reducerPath: "plug",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_NPAN_OBRO_URL +
      ":" +
      import.meta.env.VITE_NPAN_OBRO_PORT +
      "/",
    prepareHeaders: (headers) => {
      const accessToken = window?.localStorage?.getItem("access_token");
      if (accessToken) headers.set("authorization", accessToken);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAction: builder.query<any, any>({
      query: ({ path, query = {} }) => {
        return path + "?" + qs.stringify(query);
      },
      keepUnusedDataFor: 0,
    }),
    postAction: builder.mutation<any, any>({
      query: ({ path, body, query = {} }) => ({
        url: path + "?" + qs.stringify(query),
        method: "POST",
        body,
      }),
    }),
    putAction: builder.mutation<any, any>({
      query: ({ path, body, query = {}, headers = {} }) => ({
        url: path + "?" + qs.stringify(query),
        method: "PUT",
        body,
        headers,
      }),
    }),
    deleteAction: builder.query<any, any>({
      query: ({ path, query = {} }) => ({
        url: path + "?" + qs.stringify(query),
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetActionQuery,
  useLazyGetActionQuery,
  usePostActionMutation,
  usePutActionMutation,
  useDeleteActionQuery,
  useLazyDeleteActionQuery,
} = plugSlice;
