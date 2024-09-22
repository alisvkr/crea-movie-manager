import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { MovieSession } from './movieSession.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isUsed: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tickets, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user?: User | null;

  @ManyToOne(() => MovieSession, (session) => session.tickets, {
    onDelete: 'CASCADE',
  })
  session: MovieSession;
}
