import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class WatchMovieInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ticketId: number;
}
