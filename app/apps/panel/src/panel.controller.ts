import { Controller, Get } from '@nestjs/common';
import { PanelService } from './panel.service';
import { MessagePattern } from '@nestjs/microservices';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';

@Controller()
export class PanelController {
  constructor(private readonly panelService: PanelService) { }

  @MessagePattern(PANEL_PATTERNS.TEST_CONNECTION)
  async testConnection(panelDto: AddPanelDto) {
    return await this.panelService.testConnection(panelDto);
  }

  @MessagePattern(PANEL_PATTERNS.ADD)
  async add(panelDto: AddPanelDto) {
    return await this.panelService.add(panelDto)
  }
}
