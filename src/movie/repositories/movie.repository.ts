import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { Movie } from '../entities/movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Movie> {
    const movie = await this.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException();
    }

    return movie;
  }
  async getByIds(ids: Array<number>): Promise<Movie[]> {
    const movies = await this.find({ where: { id: In(ids) } });
    if (!movies || movies.length === 0) {
      throw new NotFoundException();
    }
    return movies;
  }
}
