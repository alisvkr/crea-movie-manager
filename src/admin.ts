import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { ROLE } from './auth/constants/role.constant';
import { RequestContext } from './shared/request-context/request-context.dto';
import { CreateUserInput } from './user/dtos/user-create-input.dto';
import { UserService } from './user/services/user.service';
import { INestApplicationContext } from '@nestjs/common';

export async function addDefaultAdmin(app: INestApplicationContext) {
  const configService = app.get(ConfigService);
  const defaultAdminUserPassword = configService.get<string>(
    'defaultAdminUserPassword',
  )!;

  const userService = app.get(UserService);

  const defaultAdmin: CreateUserInput = {
    username: 'crea',
    password: defaultAdminUserPassword,
    age: 30,
    roles: [ROLE.ADMIN],
    isAccountDisabled: false,
  };

  const ctx = new RequestContext();

  // Create the default admin user if it doesn't already exist.
  const user = await userService.findByUsername(ctx, defaultAdmin.username);
  if (!user) {
    await userService.createUser(ctx, defaultAdmin);
  }
}
