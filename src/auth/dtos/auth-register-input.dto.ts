import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import { ROLE } from '../constants/role.constant';

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @MaxLength(200)
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  // These keys can only be set by ADMIN user.
  roles: ROLE[] = [ROLE.USER];
  isAccountDisabled: boolean;
}
