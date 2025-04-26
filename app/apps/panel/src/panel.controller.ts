import { Controller, Get } from '@nestjs/common';
import { PanelService } from './panel.service';
import { MessagePattern } from '@nestjs/microservices';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';

@Controller()
export class PanelController {
  constructor(private readonly panelService: PanelService) { }

  @MessagePattern(PANEL_PATTERNS.TEST_CONNECTION)
  async testConnection(): Promise<string> {
    return await this.panelService.testConnection();
  }
}
