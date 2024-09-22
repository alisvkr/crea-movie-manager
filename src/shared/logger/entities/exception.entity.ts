import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exceptionLog')
export class Exception {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestId: string;

  @Column()
  userId: number;

  @Column()
  message: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
