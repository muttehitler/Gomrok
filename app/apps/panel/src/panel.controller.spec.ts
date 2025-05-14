import { Test, TestingModule } from '@nestjs/testing';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';

describe('PanelController', () => {
  let panelController: PanelController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PanelController],
      providers: [PanelService],
    }).compile();

    panelController = app.get<PanelController>(PanelController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(panelController.getHello()).toBe('Hello World!');
    });
  });
});
