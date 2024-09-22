import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import { ROLE } from '../../auth/constants/role.constant';

export class CreateUserInput {
  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsAlphanumeric()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ROLE, { each: true })
  roles: ROLE[];

  @ApiProperty()
  @IsBoolean()
  isAccountDisabled: boolean;
}
