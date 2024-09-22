import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TIME_SLOT } from '../constants/time-slot.constant';

export class MovieSessionInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  totalTicketCount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({ example: [TIME_SLOT.SLOT_1] })
  @IsNotEmpty()
  @IsDate()
  timeSlot: TIME_SLOT;
}

export class UpdateMovieSessionInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({ example: [TIME_SLOT.SLOT_1] })
  @IsNotEmpty()
  @IsDate()
  timeSlot: TIME_SLOT;
}
