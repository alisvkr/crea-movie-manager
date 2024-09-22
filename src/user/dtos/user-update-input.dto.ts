import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateUserInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  age: number;
}
