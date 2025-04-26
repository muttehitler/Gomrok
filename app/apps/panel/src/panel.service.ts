import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PanelBase from './panelServices/abstract/panelBase';
import { PanelType } from './patterns/panelType';

@Injectable()
export class PanelService {
  constructor(private moduleRef: ModuleRef) { }

  async testConnection(): Promise<string> {
    const panelService = await this.moduleRef.resolve<PanelBase>(PanelType.marzneshin)
    panelService.testConnection()
    return 'Hello World!';
  }
}
