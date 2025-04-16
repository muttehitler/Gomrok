import { Controller, Get } from '@nestjs/common';
import { PanelService } from './panel.service';

@Controller()
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @Get()
  getHello(): string {
    return this.panelService.getHello();
  }
}
