import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Audit } from '../entities/audit.entity';

@Injectable()
export class AuditLogRepository extends Repository<Audit> {
  constructor(private dataSource: DataSource) {
    super(Audit, dataSource.createEntityManager());
  }
}
