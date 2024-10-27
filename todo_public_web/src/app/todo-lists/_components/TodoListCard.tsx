import { Card, CardContent, Typography, Box, IconButton, Badge, Button, Tooltip } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TaskIcon from '@mui/icons-material/Task';
import { TodoList } from '../../../lib/store/todo-lists/todo-list.types';

interface TodoListCardProps {
  todoList: TodoList;
  onRemove: (id: string) => void;
}

export const TodoListCard: React.FC<TodoListCardProps> = ({ todoList, onRemove }) => {
  const taskCount = todoList.tasks?.length || 0; // Get the count of tasks

  return (
    <Card
      variant="outlined"
      sx={{ mb: 2 }}
    >
      <CardContent>
        <Link href={`/todo-lists/manage/${todoList.id}`}>
          <Typography variant="h6">{todoList.title}</Typography>
        </Link>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
        >
          <Typography
            variant="body2"
            color="textSecondary"
          >
            Created on: {new Date(todoList.createdAt).toLocaleDateString()}
          </Typography>
          <Tooltip title="Shows if a list has public access">
            <IconButton
              color="primary"
              aria-label={todoList.isPublic ? 'Public' : 'Private'}
            >
              {todoList.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          mt={1}
        >
          <Badge
            badgeContent={taskCount}
            color="secondary"
          >
            <TaskIcon />
          </Badge>
          <Typography
            variant="body2"
            ml={1}
          >
            &nbsp; {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'end' }}>
        <Tooltip title="Delete this todo-list">

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => {
              onRemove(todoList.id);
            }}
            sx={{ mt: 2 }}
          >
            Remove
          </Button>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};
