import { Controller, Get } from '@nestjs/common';
import { PanelService } from './panel.service';
import { MessagePattern } from '@nestjs/microservices';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import PanelDto from '@app/contracts/models/dtos/panel/panelDto';
import ResultDto from '@app/contracts/models/dtos/resultDto';

@Controller()
export class PanelController {
  constructor(private readonly panelService: PanelService) { }

  @MessagePattern(PANEL_PATTERNS.TEST_CONNECTION)
  async testConnection(panelDto: AddPanelDto) {
    return await this.panelService.testConnection(panelDto);
  }

  @MessagePattern(PANEL_PATTERNS.ADD)
  async add(data: { panelDto: AddPanelDto, authorUser: string }) {
    return await this.panelService.add(data.panelDto, data.authorUser)
  }

  @MessagePattern(PANEL_PATTERNS.GET_LIST)
  async getList(): Promise<PanelDto[]> {
    return await this.panelService.getList()
  }

  @MessagePattern(PANEL_PATTERNS.GET)
  async get(id: string): Promise<PanelDto> {
    return await this.panelService.get(id)
  }

  @MessagePattern(PANEL_PATTERNS.UPDATE)
  async update(data: { id: string, panel: PanelDto }): Promise<ResultDto> {
    return await this.panelService.update(data.id, data.panel)
  }

  @MessagePattern(PANEL_PATTERNS.DELETE)
  async delete(id: string): Promise<ResultDto> {
    return await this.panelService.delete(id)
  }
}
