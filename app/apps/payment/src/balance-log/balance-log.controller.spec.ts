import { Test, TestingModule } from '@nestjs/testing';
import { BalanceLogController } from './balance-log.controller';

describe('BalanceLogController', () => {
  let controller: BalanceLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceLogController],
    }).compile();

    controller = module.get<BalanceLogController>(BalanceLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
