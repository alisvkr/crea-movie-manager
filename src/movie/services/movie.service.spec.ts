import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ROLE } from '../../auth/constants/role.constant';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import {
  CreateMovieInputBulk,
  UpdateMovieInput,
} from '../dtos/movie-input.dto';
import { MovieOutput, MovieOutputBulk } from '../dtos/movie-output.dto';
import { Movie } from '../entities/movie.entity';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieService } from './movie.service';
import { MovieAclService } from './movie-acl.service';
import {
  MovieSessionInput,
  UpdateMovieSessionInput,
} from '../dtos/movie-session-input.dto';
import { MovieSessionOutput } from '../dtos/movie-session-output.dto';
import { TIME_SLOT } from '../constants/time-slot.constant';
import { TicketRepository } from '../repositories/ticket.repository';
import { plainToClass } from 'class-transformer';
import { MovieSession } from '../entities/movieSession.entity';

describe('MovieService', () => {
  let service: MovieService;
  let mockedRepository: any;
  let mockedTicketRepository: any;
  let mockedUserService: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MovieRepository,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            getById: jest.fn(),
            getByIds: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: TicketRepository,
          useValue: {},
        },
        { provide: MovieAclService, useValue: new MovieAclService() },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<MovieService>(MovieService);
    mockedRepository = moduleRef.get(MovieRepository);
    mockedUserService = moduleRef.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create Movie', () => {
    it('should call repository save with proper movie input and return proper output', async () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };

      const currentDate = new Date();
      const movieInput: CreateMovieInputBulk = {
        movies: [
          {
            name: 'Movie1',
            description: 'Sci-fi movie',
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
      const entityInput = movieInput.movies.map((movie) => {
        let movieEntity = new Movie();
        movieEntity.fillFromDto(movie);
        return movieEntity;
      });

      const repoOutput = [
        {
          id: 1,
          name: 'Movie1',
          description: 'Sci-fi movie',
          minAge: 12,
          sessions: [
            {
              id: 1,
              roomNumber: 4,
              tickets: [1, 2, 3],
              date: new Date(),
              timeSlot: TIME_SLOT.SLOT_1,
            },
          ],
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      mockedRepository.save.mockResolvedValue(repoOutput);

      const output = await service.createMovies(ctx, movieInput);
      expect(mockedRepository.save).toHaveBeenCalledWith(entityInput);
      expect(output.movies.length).toEqual(repoOutput.length); //fix this
    });
  });

  describe('getMovies', () => {
    const limit = 10;
    const offset = 0;
    const currentDate = new Date();

    it('should return movies when found', async () => {
      ctx.user = {
        id: 2,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      const expectedOutput = [
        {
          id: 1,
          name: 'Movie1',
          description: 'Thriller Movie',
          minAge: 12,
          sessions: [
            {
              id: 1,
              roomNumber: 4,
              tickets: [1, 2, 3],
              date: new Date(),
              timeSlot: TIME_SLOT.SLOT_1,
            },
          ],
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      const serviceOutput = await service.getMovies(ctx, limit, offset);
      expect(serviceOutput.movies.length).toEqual(expectedOutput.length);
    });

    it('should return empty array when movies are not found', async () => {
      ctx.user = {
        id: 2,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      const expectedOutput: MovieOutput[] = [];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(
        (await service.getMovies(ctx, limit, offset)).movies.length,
      ).toEqual(expectedOutput.length);
    });
  });

  describe('getMovie', () => {
    it('should return movie by id when movie is found', async () => {
      ctx.user = {
        id: 2,
        roles: [ROLE.ADMIN],
        username: 'testuser',
      };
      const id = 1;
      const currentDate = new Date();

      const expectedOutput: MovieOutput = {
        id: 1,
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        fillFromDto: () => {},
        sessions: [
          {
            id: 1,
            roomNumber: 4,
            totalTicketCount: 3,
            date: new Date(),
            timeSlot: TIME_SLOT.SLOT_2,
          },
        ],
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedRepository.getById.mockResolvedValue(expectedOutput);

      expect((await service.getMovieById(ctx, id)).name).toEqual(
        expectedOutput.name,
      );
    });

    it('should fail when movie is not found and return the repository error', async () => {
      const id = 1;

      mockedRepository.getById.mockRejectedValue({
        message: 'error',
      });

      try {
        await service.getMovieById(ctx, id);
      } catch (error: any) {
        expect(error.message).toEqual('error');
      }
    });
  });

  describe('Update Movie', () => {
    ctx.user = {
      id: 2,
      roles: [ROLE.ADMIN],
      username: 'testuser',
    };
    it('should get movie by id', () => {
      const movieId = 1;
      const input: UpdateMovieInput = {
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        sessions: new MovieSessionOutput(),
      };

      mockedRepository.getById.mockResolvedValue({
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        sessions: new MovieSessionOutput(),
      });

      service.updateMovie(ctx, movieId, input);
      expect(mockedRepository.getById).toHaveBeenCalledWith(movieId);
    });

    it('should save movie with updated title and post', async () => {
      const movieId = 1;
      const input: UpdateMovieInput = {
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        sessions: new MovieSessionOutput(),
      };

      const expected = {
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        sessions: new MovieSessionOutput(),
      };
      mockedRepository.getById.mockResolvedValue(expected);

      await service.updateMovie(ctx, movieId, input);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
    });

    it('should throw unauthorized exception when someone other than resource owner tries to update movie', async () => {
      ctx.user = {
        id: 2,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      const movieId = 1;
      const input: UpdateMovieInput = {
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        sessions: new MovieSessionOutput(),
      };
      const author = new User();
      author.id = 1;

      mockedRepository.getById.mockResolvedValue({
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        sessions: new MovieSessionOutput(),
      });

      try {
        await service.updateMovie(ctx, movieId, input);
      } catch (error: any) {
        expect(error.constructor).toEqual(UnauthorizedException);
        expect(mockedRepository.save).not.toHaveBeenCalled();
      }
    });
  });

  describe('deleteMovies', () => {
    const movieIds = [1];

    it('should call repository.remove with correct parameter', async () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.ADMIN],
        username: 'adminuser',
      };

      const foundMovies = [
        {
          id: movieIds[0],
          name: 'Movie1',
          description: 'Thriller Movie',
          minAge: 12,
          sessions: new MovieSessionOutput(),
        },
      ];

      mockedRepository.getByIds.mockResolvedValue(foundMovies);

      await service.deleteMovies(ctx, movieIds);
      expect(mockedRepository.remove).toHaveBeenCalledWith(foundMovies);
    });

    it('should throw not found exception if movie not found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.deleteMovies(ctx, movieIds);
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw unauthorized exception when someone other than admin requested', async () => {
      ctx.user = {
        id: 2,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      mockedRepository.getById.mockResolvedValue({
        id: 1,
        name: 'Movie1',
        description: 'Thriller Movie',
        minAge: 12,
        sessions: new MovieSessionOutput(),
      });

      try {
        await service.deleteMovies(ctx, movieIds);
      } catch (error: any) {
        expect(error.message).toEqual('Resource is required for ruleCallback');
        expect(mockedRepository.save).not.toHaveBeenCalled();
      }
    });
  });
});
