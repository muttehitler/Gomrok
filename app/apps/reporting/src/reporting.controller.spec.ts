import { Test, TestingModule } from '@nestjs/testing';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';

describe('ReportingController', () => {
  let reportingController: ReportingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReportingController],
      providers: [ReportingService],
    }).compile();

    reportingController = app.get<ReportingController>(ReportingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(reportingController.getHello()).toBe('Hello World!');
    });
  });
});
