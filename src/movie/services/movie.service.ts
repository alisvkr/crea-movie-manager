import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import {
  CreateMovieInputBulk,
  UpdateMovieInput,
} from '../dtos/movie-input.dto';
import { MovieOutput, MovieOutputBulk } from '../dtos/movie-output.dto';
import { Movie } from '../entities/movie.entity';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieAclService } from './movie-acl.service';
import { MovieSession } from '../entities/movieSession.entity';
import { Ticket } from '../entities/ticket.entity';
import { BuyTicketsOutput } from '../dtos/buy-tickets-output.dto';
import { TicketRepository } from '../repositories/ticket.repository';
import { BuyTicketsInput } from '../dtos/buy-tickets-input.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { WatchMovieInput } from '../dtos/watch-movie-input.dto';
import { WatchedMoviesOutput } from '../dtos/watched-movies-output.dto';

@Injectable()
export class MovieService {
  constructor(
    private repository: MovieRepository,
    private ticketRepository: TicketRepository,
    private userService: UserService,
    private aclService: MovieAclService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MovieService.name);
  }

  async createMovies(
    ctx: RequestContext,
    input: CreateMovieInputBulk,
  ): Promise<MovieOutputBulk> {
    this.logger.log(ctx, `${this.createMovies.name} was called`);

    const movies = input.movies.map((movie) => {
      let movieEntity = new Movie();
      movieEntity.fillFromDto(movie);
      return movieEntity;
    });

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, movies);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${MovieRepository.name}.save`);
    const savedMovies = await this.repository.save(movies);
    let movieOutputBulk = new MovieOutputBulk();
    movieOutputBulk.movies = savedMovies.map((savedMovie) => {
      var newOutput = new MovieOutput();
      newOutput.fillFromDto(savedMovie);
      return newOutput;
    });
    return movieOutputBulk;
  }

  async getMovies(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<MovieOutputBulk> {
    this.logger.log(ctx, `${this.getMovies.name} was called`);

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService.forActor(actor).canDoAction(Action.List);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    this.logger.log(ctx, `calling ${MovieRepository.name}.findAndCount`);
    const [movies, count] = await this.repository.findAndCount({
      where: {},
      take: limit,
      skip: offset,
    });

    let moviesOutput = new MovieOutputBulk();
    moviesOutput.movies = movies.map((movie) => {
      var outputObject = new MovieOutput();
      outputObject.fillFromDto(movie);
      return outputObject;
    });
    return moviesOutput;
  }

  async getMovieById(ctx: RequestContext, id: number): Promise<MovieOutput> {
    this.logger.log(ctx, `${this.getMovieById.name} was called`);

    const actor: Actor = ctx.user!;

    this.logger.log(ctx, `calling ${MovieRepository.name}.getById`);
    const movie = await this.repository.getById(id);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Read, movie);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    return plainToClass(MovieOutput, movie, {
      excludeExtraneousValues: true,
    });
  }

  async updateMovie(
    ctx: RequestContext,
    movieId: number,
    input: UpdateMovieInput,
  ): Promise<MovieOutput> {
    this.logger.log(ctx, `${this.updateMovie.name} was called`);

    this.logger.log(ctx, `calling ${MovieRepository.name}.getById`);
    const movie = await this.repository.getById(movieId);
    if (!movie) {
      throw new NotFoundException();
    }
    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, movie);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    const updatedMovie = Object.assign(movie, input);

    this.logger.log(ctx, `calling ${MovieRepository.name}.save`);
    const savedMovie = await this.repository.save(updatedMovie);

    return plainToClass(MovieOutput, savedMovie, {
      excludeExtraneousValues: true,
    });
  }

  async deleteMovies(ctx: RequestContext, ids: Array<number>): Promise<void> {
    this.logger.log(ctx, `${this.deleteMovies.name} was called`);

    this.logger.log(ctx, `calling ${MovieRepository.name}.getById`);
    const movies = await this.repository.getByIds(ids);

    const actor: Actor = ctx.user!;

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Delete, movies);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }
    this.logger.log(ctx, `calling ${MovieRepository.name}.remove`);
    await this.repository.remove(movies);
  }

  async buyTickets(
    ctx: RequestContext,
    input: BuyTicketsInput,
  ): Promise<BuyTicketsOutput> {
    this.logger.log(ctx, `${this.buyTickets.name} was called`);

    const actor: Actor = ctx.user!;

    this.logger.log(ctx, `calling ${TicketRepository.name}.buyTickets`);
    const user = await this.userService.getDbUserById(actor.id);
    const soldTickets = await this.ticketRepository.buyTickets(
      user,
      input.movieSessionId,
      input.amount,
    );

    let ticketOutput = new BuyTicketsOutput();
    ticketOutput.fillFromEntity(soldTickets);
    return ticketOutput;
  }

  async watchMovie(
    ctx: RequestContext,
    input: WatchMovieInput,
  ): Promise<boolean> {
    this.logger.log(ctx, `${this.watchMovie.name} was called`);

    const actor: Actor = ctx.user!;

    this.logger.log(ctx, `calling ${UserRepository.name}.watchMovie`);

    const ticket = await this.ticketRepository.setTicketUsed(
      actor.id,
      input.ticketId,
    );

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Read, ticket);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }
    return ticket != null;
  }

  async getWatchedMovies(
    ctx: RequestContext,
    limit: number,
    offset: number,
  ): Promise<WatchedMoviesOutput> {
    this.logger.log(ctx, `${this.getWatchedMovies.name} was called`);

    const actor: Actor = ctx.user!;

    this.logger.log(ctx, `calling ${UserRepository.name}.getWatchedMovies`);

    const tickets = await this.ticketRepository.getUsedTickets(actor.id);
    let moviesOutput = new WatchedMoviesOutput();
    moviesOutput.fillFromEntity(tickets);

    return moviesOutput;
  }
}
