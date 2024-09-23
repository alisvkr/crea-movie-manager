import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MovieSession } from './movieSession.entity';
import { MovieSessionInput } from '../dtos/movie-session-input.dto';
import { Ticket } from './ticket.entity';
import { CreateMovieInput } from '../dtos/movie-input.dto';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  minAge: number;

  @OneToMany(() => MovieSession, (session) => session.movie, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  sessions: MovieSession[];

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  fillFromDto(movie: CreateMovieInput) {
    this.name = movie.name;
    this.description = movie.description;
    this.minAge = movie.minAge;
    this.sessions = movie.sessions.map((session, index) => {
      var sessionEntity = new MovieSession();
      sessionEntity.date = session.date;
      sessionEntity.roomNumber = session.roomNumber;
      sessionEntity.timeSlot = session.timeSlot;
      sessionEntity.tickets = [];
      for (
        let ticketCounter = 0;
        ticketCounter < session.totalTicketCount;
        ticketCounter++
      ) {
        var newTicket = new Ticket();
        newTicket.user = null;
        newTicket.session = sessionEntity;
        sessionEntity.tickets.push(newTicket);
      }
      return sessionEntity;
    });
  }
}
