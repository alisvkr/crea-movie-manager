import { ExecutionContext } from '@nestjs/common';

import { AppLogger } from '../logger/logger.service';
import * as utils from '../request-context/util';
import { LoggingInterceptor } from './logging.interceptor';
import { AuditLogRepository } from '../logger/repositories/audit.repository';
import { ExceptionLogRepository } from '../logger/repositories/exception.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('LoggingInterceptor', () => {
  let loggingInterceptor: LoggingInterceptor;

  const mockRequest = {
    headers: {},
    url: 'mock-url',
    header: jest.fn(),
  };

  const mockRepo = {
    save: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnThis(),
  } as unknown as ExecutionContext;

  const mockCallHandler = {
    handle: jest.fn(),
    pipe: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuditLogRepository,
          useValue: mockRepo,
        },
        {
          provide: ExceptionLogRepository,
          useValue: mockRepo,
        },
        AppLogger,
      ],
    }).compile();
    const appLogger = await moduleRef.resolve<AppLogger>(AppLogger);
    loggingInterceptor = new LoggingInterceptor(appLogger);
  });

  it('should be defined', () => {
    expect(loggingInterceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('intercept', async () => {
      (
        mockExecutionContext.switchToHttp().getRequest as jest.Mock<any, any>
      ).mockReturnValueOnce(mockRequest);
      mockCallHandler.handle.mockReturnValueOnce({
        pipe: jest.fn(),
      });

      const createRequestContext = jest.spyOn(utils, 'createRequestContext');

      loggingInterceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
      expect(createRequestContext).toHaveBeenCalledWith(mockRequest);
    });
  });
});
