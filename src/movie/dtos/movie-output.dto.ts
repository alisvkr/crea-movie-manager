import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { MovieSessionOutput } from './movie-session-output.dto';
import { MovieSession } from '../entities/movieSession.entity';
import { IsArray, IsNotEmpty } from 'class-validator';

export class MovieOutput {
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
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @Type(() => Array<MovieSessionOutput>)
  @ApiProperty()
  sessions: MovieSessionOutput[];

  fillSessions(sessions: MovieSession[]) {
    this.sessions = sessions.map((session) => {
      var newSession = new MovieSessionOutput();
      newSession.date = session.date;
      newSession.id = session.id;
      newSession.timeSlot = session.timeSlot;
      newSession.totalTicketCount = session.tickets.length;
      return newSession;
    });
  }
}

export class MovieOutputBulk {
  @Type(() => Array<MovieOutput>)
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(MovieOutput) }],
    type: () => Array<MovieOutput>,
  })
  @IsNotEmpty()
  @IsArray()
  movies: MovieOutput[];
}
