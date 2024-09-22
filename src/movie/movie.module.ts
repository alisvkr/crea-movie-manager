import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { MovieController } from './controllers/movie.controller';
import { Movie } from './entities/movie.entity';
import { MovieRepository } from './repositories/movie.repository';
import { MovieService } from './services/movie.service';
import { MovieAclService } from './services/movie-acl.service';
import { TicketRepository } from './repositories/ticket.repository';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Movie]), UserModule],
  providers: [
    MovieService,
    JwtAuthStrategy,
    MovieAclService,
    MovieRepository,
    TicketRepository,
  ],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
