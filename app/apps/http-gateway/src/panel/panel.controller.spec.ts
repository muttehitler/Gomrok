import { Test, TestingModule } from '@nestjs/testing';
import { PanelController } from './panel.controller';

describe('PanelController', () => {
  let controller: PanelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelController],
    }).compile();

    controller = module.get<PanelController>(PanelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
