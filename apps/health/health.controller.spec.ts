import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HealthCheckService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let mockHealthService: DeepMocked<HealthCheckService>;

  beforeEach(async () => {
    mockHealthService = createMock<HealthCheckService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthService,
        },
      ],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
