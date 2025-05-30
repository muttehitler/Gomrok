import { Test, TestingModule } from '@nestjs/testing';
import { PanelServiceController } from './panel-service.controller';

describe('PanelServiceController', () => {
  let controller: PanelServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelServiceController],
    }).compile();

    controller = module.get<PanelServiceController>(PanelServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
