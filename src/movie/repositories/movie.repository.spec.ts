import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Movie } from '../entities/movie.entity';
import { MovieRepository } from './movie.repository';

describe('MovieRepository', () => {
  let repository: MovieRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MovieRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<MovieRepository>(MovieRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get movie by id', () => {
    it('should call findOne with correct id', () => {
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(new Movie());
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return movie if found', async () => {
      const expectedOutput: any = {
        id: 1,
        name: 'Movie1',
        description: 'thriller movie!',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedOutput);

      expect(await repository.getById(1)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when movie not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      try {
        await repository.getById(1);
      } catch (error: any) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
