import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Exception } from '../entities/exception.entity';

@Injectable()
export class ExceptionLogRepository extends Repository<Exception> {
  constructor(private dataSource: DataSource) {
    super(Exception, dataSource.createEntityManager());
  }
}
