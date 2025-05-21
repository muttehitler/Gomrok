import { Test, TestingModule } from '@nestjs/testing';
import { BalanceLogService } from './balance-log.service';

describe('BalanceLogService', () => {
  let service: BalanceLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceLogService],
    }).compile();

    service = module.get<BalanceLogService>(BalanceLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
