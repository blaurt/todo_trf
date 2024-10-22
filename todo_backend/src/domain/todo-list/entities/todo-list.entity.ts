import { User } from '../../user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity({ name: 'todo_lists' })
export class TodoList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Task, (task) => task.todoList)
  tasks: Task[];

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  constructor(partial: Partial<TodoList>) {
    Object.assign(this, partial);
  }
}
