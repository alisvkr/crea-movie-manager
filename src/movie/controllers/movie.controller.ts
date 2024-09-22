import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ROLE } from '../../auth/constants/role.constant';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  CreateMovieInputBulk,
  UpdateMovieInput,
} from '../dtos/movie-input.dto';
import { MovieOutput, MovieOutputBulk } from '../dtos/movie-output.dto';
import { MovieService } from '../services/movie.service';
import { IsNumber } from 'class-validator';
import { BuyTicketsOutput } from '../dtos/buy-tickets-output.dto';
import { BuyTicketsInput } from '../dtos/buy-tickets-input.dto';
import { bool, boolean } from 'joi';
import { WatchMovieInput } from '../dtos/watch-movie-input.dto';
import { WatchMovieOutput } from '../dtos/watch-movie-output.dto';
import { plainToClass } from 'class-transformer';
import { WatchedMoviesOutput } from '../dtos/watched-movies-output.dto';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MovieController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create movies API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MovieOutputBulk,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createMovies(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateMovieInputBulk,
  ): Promise<MovieOutputBulk> {
    const response = await this.movieService.createMovies(ctx, input);
    return response;
  }

  @Get()
  @ApiOperation({
    summary: 'Get movies as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MovieOutputBulk,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMovies(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<MovieOutputBulk> {
    this.logger.log(ctx, `${this.getMovies.name} was called`);

    const response = await this.movieService.getMovies(
      ctx,
      query.limit,
      query.offset,
    );

    return response;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get movie by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(MovieOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMovie(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<MovieOutput>> {
    this.logger.log(ctx, `${this.getMovie.name} was called`);

    const movie = await this.movieService.getMovieById(ctx, id);
    return { data: movie, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update movie API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(MovieOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateMovie(
    @ReqContext() ctx: RequestContext,
    @Param('id') movieId: number,
    @Body() input: UpdateMovieInput,
  ): Promise<BaseApiResponse<MovieOutput>> {
    const movie = await this.movieService.updateMovie(ctx, movieId, input);
    return { data: movie, meta: {} };
  }

  @Delete(':ids')
  @ApiOperation({
    summary: 'Delete movie by id API',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteMovies(
    @ReqContext() ctx: RequestContext,
    @Param('ids') ids: string,
  ): Promise<void> {
    this.logger.log(ctx, `${this.deleteMovies.name} was called`);
    let idNumbers = ids.split(',').map((numStr) => +numStr);
    if (!idNumbers.every((id) => typeof id === 'number'))
      throw new BadRequestException('Invalid input');
    return this.movieService.deleteMovies(ctx, idNumbers);
  }

  @Post('/buyTickets')
  @ApiOperation({
    summary: 'Buy tickets to movie session API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: BuyTicketsOutput,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async buyTicket(
    @ReqContext() ctx: RequestContext,
    @Body() input: BuyTicketsInput,
  ): Promise<BuyTicketsOutput> {
    const response = await this.movieService.buyTickets(ctx, input);
    return response;
  }

  @Post('watchMovie')
  @ApiOperation({
    summary: 'watch movie API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WatchMovieOutput,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async watchMovie(
    @ReqContext() ctx: RequestContext,
    @Body() input: WatchMovieInput,
  ): Promise<WatchMovieOutput> {
    const status = await this.movieService.watchMovie(ctx, input);
    var response = new WatchMovieOutput();
    response.isSuccess = status;
    return response;
  }

  @Post('/movieHistory')
  @ApiOperation({
    summary: 'Movie History API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WatchedMoviesOutput,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async movieHistory(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<WatchedMoviesOutput> {
    return await this.movieService.getWatchedMovies(
      ctx,
      query.limit,
      query.offset,
    );
  }
}
