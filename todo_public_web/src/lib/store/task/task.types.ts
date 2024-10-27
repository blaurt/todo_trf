export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  todoListId: string;
}
