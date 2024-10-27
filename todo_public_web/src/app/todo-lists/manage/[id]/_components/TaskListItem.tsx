import { Edit, Delete } from '@mui/icons-material';
import { ListItem, Checkbox, Typography, IconButton } from '@mui/material';
import { Task } from '../../../../../lib/store/task/task.types';
import { update } from 'lodash';

interface Props {
  task: Task;
  setCurrentTask: (task: Task) => void;
  setIsTaskDialogOpen: (state: boolean) => void;
  handleDeleteTask: (taskId: string) => void;
  handleUpdateTask: (updatedTask: Task) => void;
}

export const TaskListItem = ({
  handleDeleteTask,
  handleUpdateTask,
  task,
  setIsTaskDialogOpen,
  setCurrentTask,
}: Props) => {
  return (
    <ListItem
      key={task.id}
      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
    >
      <Checkbox
        checked={task.isCompleted}
        onChange={() => handleUpdateTask({ ...task, isCompleted: !task.isCompleted })}
      />
      <Typography sx={{ flexGrow: 1, textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
        {task.title || 'Untitled Task'}
      </Typography>
      <IconButton
        onClick={() => {
          setCurrentTask(task);
          setIsTaskDialogOpen(true);
        }}
      >
        <Edit />
      </IconButton>
      <IconButton onClick={() => handleDeleteTask(task.id)}>
        <Delete />
      </IconButton>
    </ListItem>
  );
};
