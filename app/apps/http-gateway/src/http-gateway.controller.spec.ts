import { Test, TestingModule } from '@nestjs/testing';
import { HttpGatewayController } from './http-gateway.controller';
import { HttpGatewayService } from './http-gateway.service';

describe('HttpGatewayController', () => {
  let httpGatewayController: HttpGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HttpGatewayController],
      providers: [HttpGatewayService],
    }).compile();

    httpGatewayController = app.get<HttpGatewayController>(HttpGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(httpGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
