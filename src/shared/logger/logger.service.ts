import { Injectable, Scope } from '@nestjs/common';
import { createLogger, Logger, transports } from 'winston';

import { RequestContext } from '../request-context/request-context.dto';
import { ExceptionLogRepository } from './repositories/exception.repository';
import { AuditLogRepository } from './repositories/audit.repository';
import { Exception } from './entities/exception.entity';
import { Audit } from './entities/audit.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor(
    private exceptionLogRepository: ExceptionLogRepository,
    private auditLogRepository: AuditLogRepository,
  ) {
    this.logger = createLogger({
      transports: [new transports.Console()],
    });
  }

  error(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    const errorObj = {
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    };
    //
    this.logToErrorsDB(ctx.user?.id, ctx.requestID, errorObj);
    return this.logger.error(errorObj);
  }

  warn(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    const warnObj = {
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    };
    //
    this.logToErrorsDB(ctx.user?.id, ctx.requestID, warnObj);
    return this.logger.warn(warnObj);
  }

  debug(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  verbose(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    const verboseObj = {
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    };
    //
    this.logToAuditsDB(ctx.user?.id, ctx.requestID, verboseObj);
    return this.logger.verbose(verboseObj);
  }

  log(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    const logObj = {
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    };
    //
    this.logToAuditsDB(ctx.user?.id, ctx.requestID, logObj);
    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  private logToErrorsDB(userId?: number, requestId?: string, message?: Object) {
    var exceptionEntity = new Exception();
    exceptionEntity.message = JSON.stringify(message);
    exceptionEntity.requestId = requestId || '';
    exceptionEntity.userId = userId || -1;
    this.exceptionLogRepository.save(exceptionEntity);
  }
  private logToAuditsDB(userId?: number, requestId?: string, message?: Object) {
    var auditEntity = new Audit();
    auditEntity.message = JSON.stringify(message);
    auditEntity.requestId = requestId || '';
    auditEntity.userId = userId || -1;
    this.auditLogRepository.save(auditEntity);
  }
}
