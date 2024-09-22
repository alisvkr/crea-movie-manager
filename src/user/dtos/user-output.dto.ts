import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ROLE } from '../../auth/constants/role.constant';

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  age: number;

  @Expose()
  @ApiProperty({ example: [ROLE.USER] })
  roles: ROLE[];

  @Expose()
  @ApiProperty()
  isAccountDisabled: boolean;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}
