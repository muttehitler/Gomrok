import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PanelBase from './panelServices/abstract/panelBase';
import { PanelType } from './patterns/panelType';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import Panel, { PanelDocument } from './models/concrete/panel';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import PanelConfig, { PanelConfigDocument } from './models/concrete/panelConfig';
import { Messages } from '@app/contracts/messages/messages';

@Injectable()
export class PanelService {
  constructor(private moduleRef: ModuleRef, @InjectModel(Panel.name) private panelModel: Model<PanelDocument>,
    @InjectModel(PanelConfig.name) private panelConfigModel: Model<PanelConfigDocument>) { }

  async testConnection(panelDto: AddPanelDto) {
    const panelService = await this.moduleRef.resolve<PanelBase>(panelDto.type)
    return await panelService.testConnection(panelDto)
  }

  async add(panelDto: AddPanelDto) {
    const panelService = await this.moduleRef.resolve<PanelBase>(panelDto.type)
    const testResult = await panelService.testConnection(panelDto)

    if (testResult != 200)
      throw new BadRequestException(Messages.PANEL.PANEL_ISNT_VALID.message)

    if (await this.panelModel.findOne({ name: panelDto.name }))
      throw new BadRequestException({
        message: Messages.PANEL.PANEL_HAS_EXISTS.message
      })

    const model = new this.panelModel({
      name: panelDto.name,
      type: panelDto.type,
      weight: panelDto.weight
    })
    await model.save()

    const configModel = new this.panelConfigModel({
      url: panelDto.url,
      username: panelDto.username,
      password: panelDto.password,
      panel: model._id
    })
    await configModel.save()

    return {
      success: true,
      message: Messages.PANEL.PANEL_ADDED_SUCCESSFULLY.message,
      statusCode: Messages.PANEL.PANEL_ADDED_SUCCESSFULLY.code
    }
  }
}
