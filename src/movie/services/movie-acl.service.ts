import { Injectable } from '@nestjs/common';

import { ROLE } from '../../auth/constants/role.constant';
import { BaseAclService } from '../../shared/acl/acl.service';
import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MovieAclService extends BaseAclService<Movie> {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.Create, Action.List, Action.Read]);
    this.canDo(ROLE.USER, [Action.Update, Action.Delete], this.isUserAdmin);
  }

  isUserAdmin(movie: Movie, user: Actor): boolean {
    return user.roles.includes(ROLE.ADMIN);
  }
}
