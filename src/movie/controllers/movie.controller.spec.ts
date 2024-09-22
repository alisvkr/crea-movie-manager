import { Test, TestingModule } from '@nestjs/testing';

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import {
  CreateMovieInputBulk,
  UpdateMovieInput,
} from '../dtos/movie-input.dto';
import { MovieOutput, MovieOutputBulk } from '../dtos/movie-output.dto';
import { MovieService } from '../services/movie.service';
import { MovieController } from './movie.controller';
import { MovieSessionInput } from '../dtos/movie-session-input.dto';
import { MovieSessionOutput } from '../dtos/movie-session-output.dto';
import { TIME_SLOT } from '../constants/time-slot.constant';

describe('MovieController', () => {
  let controller: MovieController;
  const mockedMovieService = {
    getMovies: jest.fn(),
    getMovieById: jest.fn(),
    updateMovie: jest.fn(),
    createMovies: jest.fn(),
    deleteMovie: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        { provide: MovieService, useValue: mockedMovieService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = moduleRef.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create movie', () => {
    let input: CreateMovieInputBulk;

    beforeEach(() => {
      input = {
        movies: [
          {
            name: 'Movie1',
            description: 'Thriller Movie',
            minAge: 12,
            sessions: [
              {
                roomNumber: 4,
                totalTicketCount: 3,
                date: new Date(),
                timeSlot: TIME_SLOT.SLOT_1,
              },
            ],
          },
        ],
      };
    });

    it('should call movieService.createMovies with correct input', () => {
      controller.createMovies(ctx, input);
      expect(mockedMovieService.createMovies).toHaveBeenCalledWith(ctx, input);
    });

    it('should return data which includes info from movieService.createMovies', async () => {
      const currentDate = new Date();
      const expectedOutput: MovieOutputBulk = {
        movies: [
          {
            fillSessions: () => {},
            id: 1,
            name: 'Test',
            description: 'Hello, world!',
            minAge: 12,
            sessions: [
              {
                id: 1,
                roomNumber: 4,
                totalTicketCount: 3,
                date: new Date(),
                timeSlot: TIME_SLOT.SLOT_1,
              },
            ],
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        ],
      };

      mockedMovieService.createMovies.mockResolvedValue(expectedOutput);

      expect(await controller.createMovies(ctx, input)).toEqual(expectedOutput);
    });

    it('should throw error when movieService.createMovie throws an error', async () => {
      mockedMovieService.createMovies.mockRejectedValue({
        message: 'rejected',
      });

      try {
        await controller.createMovies(ctx, input);
      } catch (error: any) {
        expect(error.message).toEqual('rejected');
      }
    });
  });

  describe('Get movies', () => {
    it('should call service method getMovies', () => {
      mockedMovieService.getMovies.mockResolvedValue(new MovieOutputBulk());
      const queryParams: PaginationParamsDto = {
        limit: 100,
        offset: 0,
      };

      controller.getMovies(ctx, queryParams);
      expect(mockedMovieService.getMovies).toHaveBeenCalledWith(
        ctx,
        queryParams.limit,
        queryParams.offset,
      );
    });
  });

  describe('Get movie by id', () => {
    it('should call service method getMovieById with id', () => {
      const id = 1;

      controller.getMovie(ctx, id);
      expect(mockedMovieService.getMovieById).toHaveBeenCalledWith(ctx, id);
    });
  });

  describe('Update movie', () => {
    it('should call movieService.updateMovie with correct parameters', () => {
      const movieId = 1;
      const input: UpdateMovieInput = {
        name: 'UpdatedMovie',
        description: 'Thriller Updated Movie',
        minAge: 15,
        sessions: {
          id: 1,
          roomNumber: 4,
          date: new Date(),
          timeSlot: TIME_SLOT.SLOT_2,
        },
      };
      controller.updateMovie(ctx, movieId, input);
      expect(mockedMovieService.updateMovie).toHaveBeenCalledWith(
        ctx,
        movieId,
        input,
      );
    });
  });

  describe('Delete movie', () => {
    it('should call movieService.deleteMovie with correct id', () => {
      const movieIds = '1';
      controller.deleteMovies(ctx, movieIds);
      expect(mockedMovieService.deleteMovie).toHaveBeenCalledWith(
        ctx,
        movieIds,
      );
    });
  });
});
