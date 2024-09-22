import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auditLog')
export class Audit {
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
