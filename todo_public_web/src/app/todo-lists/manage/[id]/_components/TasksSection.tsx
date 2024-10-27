import { Add } from '@mui/icons-material';
import { Typography, List, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksByTodoListIdQuery,
  useUpdateTaskMutation,
} from '../../../../../lib/store/task/TaskSlice';
import { TaskListItem } from './TaskListItem';
import { toast } from 'react-toastify';
import { Task } from '../../../../../lib/store/task/task.types';

export function TasksSection({ todoListId }: { todoListId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const { data: fetchedTasks, isLoading } = useGetTasksByTodoListIdQuery(todoListId);

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  const handleUpsertTask = async (task: Partial<Task>) => {
    try {
      if (task.id) {
        await updateTask(task as Task);
        toast.success('Task updated', { autoClose: 700 });
      } else {
        await createTask(task as Task);
        toast.success('Task created', { autoClose: 700 });
      }
    } catch (error) {
      toast.error('Error updating task', { autoClose: 700 });
      console.error('Error updating task', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success('Task removed', { autoClose: 700 });
    } catch (error) {
      toast.error('Error removing task', { autoClose: 700 });
      console.error('Error removing task', error);
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
      >
        Tasks
      </Typography>
      <List>
        {tasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            handleUpdateTask={handleUpsertTask}
            handleDeleteTask={handleDeleteTask}
            setCurrentTask={setCurrentTask}
            setIsTaskDialogOpen={setIsTaskDialogOpen}
          />
        ))}
      </List>
      <Button
        startIcon={<Add />}
        onClick={() => setIsTaskDialogOpen(true)}
      >
        Add Task
      </Button>

      <TaskDialog
        task={currentTask}
        open={isTaskDialogOpen}
        onClose={() => {
          setCurrentTask(null);
          setIsTaskDialogOpen(false);
        }}
        todoListId={todoListId}
        onSave={handleUpsertTask}
      />
    </>
  );
}

interface TaskDialogProps {
  task: Task | null;
  open: boolean;
  todoListId: string;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ todoListId, task, open, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSave = () => {
    if (task) {
      onSave({ ...task, title, description, todoListId });
    } else {
      onSave({ title, description, createdAt: new Date(), todoListId, isCompleted: false });
    }
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Task Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
