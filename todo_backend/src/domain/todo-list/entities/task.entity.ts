import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TodoList } from './todo-list.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => TodoList, (todoList) => todoList.tasks)
  todoList: TodoList;

  isCompleted(): boolean {
    return !!this.completedAt;
  }

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
