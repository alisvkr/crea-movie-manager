import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TIME_SLOT } from '../constants/time-slot.constant';

export class MovieSessionOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  roomNumber: number;

  @Expose()
  @ApiProperty()
  totalTicketCount: number;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose()
  @ApiProperty({ example: TIME_SLOT.SLOT_1 })
  timeSlot: TIME_SLOT;
}
