import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PanelBase from './panelServices/abstract/panelBase';
import { PanelType } from './patterns/panelType';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import Panel, { PanelDocument } from './models/concrete/panel';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Messages } from '@app/contracts/messages/messages';
import PanelDto from '@app/contracts/models/dtos/panel/panelDto';
import { url } from 'inspector';

@Injectable()
export class PanelService {
  constructor(private moduleRef: ModuleRef, @InjectModel(Panel.name) private panelModel: Model<PanelDocument>) { }

  async testConnection(panelDto: AddPanelDto) {
    const panelService = await this.moduleRef.resolve<PanelBase>(panelDto.type)
    return await panelService.testConnection(panelDto)
  }

  async add(panelDto: AddPanelDto, authorUser: string) {
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
      weight: panelDto.weight,
      user: new Types.ObjectId(authorUser),
      url: panelDto.url,
      username: panelDto.username,
      password: panelDto.password,
    })
    await model.save()

    return {
      success: true,
      message: Messages.PANEL.PANEL_ADDED_SUCCESSFULLY.message,
      statusCode: Messages.PANEL.PANEL_ADDED_SUCCESSFULLY.code
    }
  }

  async getList(): Promise<PanelDto[]> {
    return (await this.panelModel.find({ status: true })).map<PanelDto>(x => { return { id: String(x._id), name: x.name, type: x.type, url: x.url, weight: x.weight } })
  }

  async get(id: string): Promise<PanelDto> {
    const panel = await this.panelModel.findById(new Types.ObjectId(id))
    const panelDto: PanelDto = {
      id: String(panel?._id),
      name: panel?.name!,
      url: panel?.url!,
      type: panel?.type!,
      username: panel?.username,
      password: panel?.password,
      weight: panel?.weight!
    }
    return panelDto
  }
}