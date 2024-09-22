import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { Ticket } from './ticket.entity';
import { Movie } from './movie.entity';
import { TIME_SLOT } from '../constants/time-slot.constant';

@Entity('movieSessions')
export class MovieSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: number;

  @Column()
  date: Date;

  @Column()
  timeSlot: TIME_SLOT;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.session, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  tickets: Ticket[];

  @ManyToOne(() => Movie, (movie) => movie.sessions, {
    onDelete: 'CASCADE',
  })
  movie: Movie;
}
