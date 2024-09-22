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

export class WatchedMoviesOutput {
  @Expose()
  @ApiProperty()
  movies: Movie[];

  fillFromEntity(tickets: Ticket[]) {
    //
    this.movies = tickets.map((ticket) => {
      var movie = new Movie();
      movie.id = ticket.session.movie.id;
      movie.name = ticket.session.movie.name;
      movie.description = ticket.session.movie.description;
      movie.minAge = ticket.session.movie.minAge;
      movie.date = ticket.session.date;
      movie.roomNumber = ticket.session.roomNumber;
      movie.timeSlot = ticket.session.timeSlot;

      return movie;
    });
  }
}
