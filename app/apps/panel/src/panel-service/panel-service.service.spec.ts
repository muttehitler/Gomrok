import { Test, TestingModule } from '@nestjs/testing';
import { PanelServiceService } from './panel-service.service';

describe('PanelServiceService', () => {
  let service: PanelServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelServiceService],
    }).compile();

    service = module.get<PanelServiceService>(PanelServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
