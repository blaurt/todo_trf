'use client';

import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { Box, Typography, TextField, Checkbox } from '@mui/material';
import { useGetTodoListByIdQuery, useUpdateTodoListMutation } from '../../../../lib/store/todo-lists/TodoListSlice';
import { useParams } from 'next/navigation';
import { Preloader } from '../../../_components/Preloader';
import { toast } from 'react-toastify';
import { TasksSection } from './_components/TasksSection';

const DEBOUNCE_DELAY = 500;

const TodoListView = () => {
  const params = useParams<{ id: string }>();
  const { data: todoList, isLoading, refetch } = useGetTodoListByIdQuery(params.id);
  const [dirty, setDirty] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [updateTodoList] = useUpdateTodoListMutation();

  useEffect(() => {
    if (todoList) {
      setEditingTitle(todoList.title);
      setIsPublic(todoList.isPublic);
    }
  }, [todoList]);

  const debouncedSaveTitle = useCallback(
    _.debounce((newTitle) => {
      if (!todoList || !dirty) return;
      updateTodoList({ ...todoList, title: newTitle }).then(() =>
        toast.success('List updated', { autoClose: 700, toastId: 'update-todo-list' }),
      );
    }, DEBOUNCE_DELAY),
    [todoList, updateTodoList, dirty],
  );

  const debouncedSaveIsPublic = useCallback(
    _.debounce((newIsPublic) => {
      if (!todoList || !dirty) return;

      updateTodoList({ ...todoList, isPublic: newIsPublic }).then(() =>
        toast.success('List updated', { autoClose: 700, toastId: 'update-todo-list' }),
      );
    }, DEBOUNCE_DELAY),
    [todoList, updateTodoList, dirty],
  );

  useEffect(() => {
    debouncedSaveTitle(editingTitle);
  }, [editingTitle, debouncedSaveTitle]);

  useEffect(() => {
    debouncedSaveIsPublic(isPublic);
  }, [isPublic, debouncedSaveIsPublic]);

  if (!todoList || isLoading) {
    return <Preloader />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
      >
        Edit Todo List
      </Typography>
      <TextField
        fullWidth
        label="Title"
        value={editingTitle}
        onChange={(e) => {
          setDirty(true);
          setEditingTitle(e.target.value);
        }}
        sx={{ mb: 2 }}
      />
      <Box
        display="flex"
        alignItems="center"
        mb={2}
      >
        <Checkbox
          checked={isPublic}
          onChange={(e) => {
            setDirty(true);
            setIsPublic(e.target.checked);
          }}
        />
        <Typography>Is Public</Typography>
      </Box>
      <TasksSection todoListId={todoList.id}  />
    </Box>
  );
};

export default TodoListView;
