import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PanelBase from './panelServices/abstract/panelBase';
import { PanelType } from './patterns/panelType';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';

@Injectable()
export class PanelService {
  constructor(private moduleRef: ModuleRef) { }

  async testConnection(panelDto: AddPanelDto) {
    const panelService = await this.moduleRef.resolve<PanelBase>(panelDto.type)
    return await panelService.testConnection(panelDto)
  }
}
