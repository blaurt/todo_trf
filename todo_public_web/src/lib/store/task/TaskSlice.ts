import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosRtkAdapter } from '../../utils/http-client';
import { Task } from './task.types';

interface CreateTaskRequest {
  title: string;
  description?: string;
  todoListId: string;
}

interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  completedAt?: Date;
}

// Define the API service
export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: axiosRtkAdapter(),
  tagTypes: ['Task', 'TodoList'],
  endpoints: (builder) => ({
    getTasksByTodoListId: builder.query<Task[], string>({
      query: (todoListId) => ({
        url: `/tasks?todoListId=${todoListId}`,
      }),
      providesTags: (result, error, todoListId) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Task' as const, id })), { type: 'TodoList', id: todoListId }]
          : [{ type: 'TodoList', id: todoListId }],
    }),

    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (newTask) => ({
        url: `/tasks`,
        method: 'POST',
        data: newTask,
      }),
      invalidatesTags: (result, error, { todoListId }) => [{ type: 'TodoList', id: todoListId }],
    }),

    updateTask: builder.mutation<Task, UpdateTaskRequest>({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        data: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, taskId) => [{ type: 'Task', id: taskId }],
    }),
  }),
});

export const { useGetTasksByTodoListIdQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } =
  taskApi;
