import bcrypt from 'bcrypt';

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserStatus } from './user-status.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column()
  status: UserStatus;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  public encryptPassword = async (password: string) => {
    const encryptedPassword = await bcrypt.hash(password, 8);
    return encryptedPassword;
  };

  public isPasswordMatch = async (passwordInput: string) => {
    return bcrypt.compare(passwordInput, this.passwordHash);
  };
}
