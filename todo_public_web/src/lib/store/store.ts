import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './auth/AuthSlice';
import { todoListApi } from './todo-lists/TodoListSlice';
import { taskApi } from './task/TaskSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [todoListApi.reducerPath]: todoListApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, todoListApi.middleware, taskApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
