import { Module } from '@nestjs/common';

import { AppLogger } from './logger.service';
import { AuditLogRepository } from './repositories/audit.repository';
import { ExceptionLogRepository } from './repositories/exception.repository';
import { SharedModule } from '../shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { Exception } from './entities/exception.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audit, Exception])],
  providers: [AppLogger, AuditLogRepository, ExceptionLogRepository],
  exports: [AppLogger],
})
export class AppLoggerModule {}
