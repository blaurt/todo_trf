import { Task } from '../task/task.types';

export interface TodoList {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
  tasks?: Task[]; 
}
