import { createApi } from '@reduxjs/toolkit/query/react';
import { TodoList } from './todo-list.types';
import { axiosRtkAdapter } from '../../utils/http-client';

type GetListsResult = {
  todoLists: TodoList[];
  total: number;
};

export const todoListApi = createApi({
  reducerPath: 'todoListApi',
  baseQuery: axiosRtkAdapter(),
  tagTypes: ['TodoList'],
  endpoints: (builder) => ({
    createTodoList: builder.mutation<TodoList, Partial<TodoList>>({
      query: (newTodoList) => ({
        url: '/todo-lists',
        method: 'POST',
        data: newTodoList,
      }),
      invalidatesTags: [{ type: 'TodoList', id: 'LIST' }],
    }),
    getTodoListById: builder.query<TodoList, string>({
      query: (id) => ({ url: `/todo-lists/${id}` }),
      providesTags: (result) => [{ type: 'TodoList', id: result?.id }],
    }),
    getTodoLists: builder.query<GetListsResult, void>({
      query: () => ({ url: '/todo-lists' }),
      providesTags: (result) =>
        result
          ? [...result.todoLists.map(({ id }) => ({ type: 'TodoList', id }) as const), { type: 'TodoList', id: 'LIST' }]
          : [{ type: 'TodoList', id: 'LIST' }],
    }),
    updateTodoList: builder.mutation<TodoList, Partial<TodoList> & Pick<TodoList, 'id'>>({
      query: (updatedTodoList) => ({
        url: `/todo-lists/${updatedTodoList.id}`,
        method: 'PATCH',
        data: updatedTodoList,
      }),
    }),
    deleteTodoList: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/todo-lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'TodoList', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateTodoListMutation,
  useGetTodoListByIdQuery,
  useGetTodoListsQuery,
  useUpdateTodoListMutation,
  useDeleteTodoListMutation,
} = todoListApi;

export default todoListApi.reducer;
