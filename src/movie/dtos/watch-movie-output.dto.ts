import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WatchMovieOutput {
  @Expose()
  @ApiProperty()
  isSuccess: boolean;
}
