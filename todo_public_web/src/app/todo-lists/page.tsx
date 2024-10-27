'use client';
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, IconButton, Badge, Tooltip } from '@mui/material';

import {
  useCreateTodoListMutation,
  useDeleteTodoListMutation,
  useGetTodoListsQuery,
} from '../../lib/store/todo-lists/TodoListSlice';
import TodoListModal from './_components/modal';
import { Preloader } from '../_components/Preloader';
import { TodoListCard } from './_components/TodoListCard';

const TodoListView = () => {
  const {
    data = {
      todoLists: [],
      total: 0,
    },
    isLoading,
  } = useGetTodoListsQuery();
  const { todoLists, total } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [createTodoList] = useCreateTodoListMutation();
  const [removeTodoList] = useDeleteTodoListMutation();
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateTodoList = async (data: { title: string; isPublic: boolean }) => {
    await createTodoList(data);
  };

  const handleRemove = async (id: string) => {
    await removeTodoList(id);
  };

  if (isLoading) {
    <Preloader />;
  }

  return (
    <Box width={'80%'}>
      <Typography
        variant="h4"
        gutterBottom
      >
        Todo Lists
      </Typography>
      <Tooltip title="Add new todo-list">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
        >
          Add Todo List
        </Button>
      </Tooltip>
      <TodoListModal
        open={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateTodoList}
      />

      {todoLists.length === 0 ? (
        <Typography
          variant="h4"
          gutterBottom
        >
          You don't have any todo-lists yet
        </Typography>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          sx={{ mt: 2 }}
        >
          {todoLists.map((todoList) => (
            <TodoListCard
              key={todoList.id}
              todoList={todoList}
              onRemove={handleRemove}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TodoListView;
