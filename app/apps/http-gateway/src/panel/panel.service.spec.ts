import { Test, TestingModule } from '@nestjs/testing';
import { PanelService } from './panel.service';

describe('PanelService', () => {
  let service: PanelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelService],
    }).compile();

    service = module.get<PanelService>(PanelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
