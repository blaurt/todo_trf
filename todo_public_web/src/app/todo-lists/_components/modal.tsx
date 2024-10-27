import React from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

interface TodoListModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; isPublic: boolean }) => void;
}

const schema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  isPublic: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const TodoListModal: React.FC<TodoListModalProps> = ({ open, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    onCreate(data);
    reset();
    toast.success('Todo list created', { autoClose: 700 });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
        >
          Create Todo List
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('title')}
            label="Title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <div>
            <label>
              <input
                type="checkbox"
                {...register('isPublic')}
              />
              Is Public
            </label>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Create Todo List
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TodoListModal;
