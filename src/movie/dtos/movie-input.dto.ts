import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  MovieSessionInput,
  UpdateMovieSessionInput,
} from './movie-session-input.dto';
import { Expose, Type } from 'class-transformer';

export class CreateMovieInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minAge: number;

  @ApiProperty({ isArray: true, type: MovieSessionInput })
  @IsNotEmpty()
  sessions: MovieSessionInput[];
}

export class CreateMovieInputBulk {
  @ApiProperty({ isArray: true, type: CreateMovieInput })
  @IsNotEmpty()
  movies: CreateMovieInput[];
}

export class UpdateMovieInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minAge: number;

  @Type(() => MovieSessionInput)
  @ApiProperty()
  @IsNotEmpty()
  sessions: UpdateMovieSessionInput;
}
