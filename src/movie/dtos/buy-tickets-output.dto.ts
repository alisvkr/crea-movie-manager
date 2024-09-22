import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TIME_SLOT } from '../constants/time-slot.constant';
import { Ticket } from '../entities/ticket.entity';

class Movie {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  minAge: number;
}

class Session {
  @Expose()
  @ApiProperty()
  sessionId: number;

  @Expose()
  @ApiProperty()
  roomNumber: number;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty()
  timeSlot: TIME_SLOT;
}

export class BuyTicketsOutput {
  @Expose()
  @ApiProperty()
  ticketIds: number[];

  @Expose()
  @ApiProperty()
  session: Session;

  @Expose()
  @ApiProperty()
  movie: Movie;

  fillFromEntity(tickets: Ticket[]) {
    this.ticketIds = tickets.map((ticket) => ticket.id);
    //
    this.session = new Session();
    this.session.date = tickets[0].session.date;
    this.session.roomNumber = tickets[0].session.roomNumber;
    this.session.sessionId = tickets[0].session.id;
    this.session.timeSlot = tickets[0].session.timeSlot;
    //
    this.movie = new Movie();
    this.movie.id = tickets[0].session.movie.id;
    this.movie.name = tickets[0].session.movie.name;
    this.movie.description = tickets[0].session.movie.description;
    this.movie.minAge = tickets[0].session.movie.minAge;
  }
}
