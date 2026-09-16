import { BASE_API_URL } from "@/constants/env";
import {
  Project,
  ProjectCategory,
  ProjectCategoryPagination,
  ProjectCategoryPayload,
  ProjectDetail,
  ProjectPagination,
} from "@/types/project.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const prepareHeaders = (headers: Headers) => {
  const raw = localStorage.getItem("access");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      headers.set("authorization", `Bearer ${parsed}`);
    } catch {
      headers.set("authorization", `Bearer ${raw}`);
    }
  }
  return headers;
};

export const ProjectApi = createApi({
  reducerPath: "ProjectApi",
  refetchOnFocus: false,
  keepUnusedDataFor: 60,
  tagTypes: ["Projects", "ProjectCategories"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL, prepareHeaders }),
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectPagination, string | void>({
      query: (params) => (params ? `projects/?${params}` : "projects/"),
      providesTags: ["Projects"],
    }),
    getProject: builder.query<ProjectDetail, string>({
      query: (id) => `projects/${id}/`,
      providesTags: ["Projects"],
    }),
    getProjectBySlug: builder.query<ProjectDetail, string>({
      query: (slug) => `projects/by-slug/${slug}/`,
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation<Project, FormData>({
      query: (data) => ({ url: "projects/", method: "POST", body: data }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation<Project, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `projects/${id}/`, method: "PUT", body: data }),
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `projects/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Projects"],
    }),
    publishProject: builder.mutation<ProjectDetail, string>({
      query: (id) => ({ url: `projects/${id}/publish/`, method: "POST" }),
      invalidatesTags: ["Projects"],
    }),
    archiveProject: builder.mutation<void, string>({
      query: (id) => ({ url: `projects/${id}/archive/`, method: "POST" }),
      invalidatesTags: ["Projects"],
    }),
    unarchiveProject: builder.mutation<void, string>({
      query: (id) => ({ url: `projects/${id}/unarchive/`, method: "POST" }),
      invalidatesTags: ["Projects"],
    }),
    duplicateProject: builder.mutation<void, string>({
      query: (id) => ({ url: `projects/${id}/duplicate/`, method: "POST" }),
      invalidatesTags: ["Projects"],
    }),
    getProjectCategories: builder.query<ProjectCategoryPagination, string | void>({
      query: (params) => (params ? `projects/categories/?${params}` : "projects/categories/"),
      providesTags: ["ProjectCategories"],
    }),
    getProjectCategory: builder.query<ProjectCategory, string>({
      query: (id) => `projects/categories/${id}/`,
      providesTags: ["ProjectCategories"],
    }),
    createProjectCategory: builder.mutation<ProjectCategory, ProjectCategoryPayload>({
      query: (data) => ({ url: "projects/categories/", method: "POST", body: data }),
      invalidatesTags: ["ProjectCategories"],
    }),
    updateProjectCategory: builder.mutation<ProjectCategory, { id: string; data: ProjectCategoryPayload }>({
      query: ({ id, data }) => ({ url: `projects/categories/${id}/`, method: "PUT", body: data }),
      invalidatesTags: ["ProjectCategories"],
    }),
    deleteProjectCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `projects/categories/${id}/`, method: "DELETE" }),
      invalidatesTags: ["ProjectCategories"],
    }),
    archiveProjectCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `projects/categories/${id}/archive/`, method: "POST" }),
      invalidatesTags: ["ProjectCategories"],
    }),
    duplicateProjectCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `projects/categories/${id}/duplicate/`, method: "POST" }),
      invalidatesTags: ["ProjectCategories"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetProjectBySlugQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  usePublishProjectMutation,
  useArchiveProjectMutation,
  useUnarchiveProjectMutation,
  useDuplicateProjectMutation,
  useGetProjectCategoriesQuery,
  useGetProjectCategoryQuery,
  useCreateProjectCategoryMutation,
  useUpdateProjectCategoryMutation,
  useDeleteProjectCategoryMutation,
  useArchiveProjectCategoryMutation,
  useDuplicateProjectCategoryMutation,
} = ProjectApi;
