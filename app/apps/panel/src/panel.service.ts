import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import PanelBase from './panelServices/abstract/panelBase';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import Panel, { PanelDocument } from './models/concrete/panel';
import { Model, SortOrder, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Messages } from '@app/contracts/messages/messages';
import PanelDto from '@app/contracts/models/dtos/panel/panelDto';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import ListDto from '@app/contracts/models/dtos/listDto';

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

  async getList({ startIndex, limit, order }: FilterDto): Promise<DataResultDto<ListDto<PanelDto[]>>> {
    const query = this.panelModel.find({ status: true })
    const list = (await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<PanelDto>(x => { return { id: String(x._id), name: x.name, type: x.type, url: x.url, weight: x.weight } })

    return {
      success: true,
      message: Messages.PANEL.PANEL_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.PANEL.PANEL_LISTED_SUCCESSFULLY.code,
      data: {
        items: list,
        length: (await this.panelModel.find({ status: true })).length
      }
    }
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

  async update(id: string, panel: PanelDto): Promise<ResultDto> {
    const p = await this.panelModel.updateOne({ _id: id }, {
      $set: {
        name: panel.name,
        url: panel.url,
        type: panel.type,
        username: panel.username,
        password: panel.password,
        weight: panel.weight
      }
    })
    return {
      success: true,
      message: Messages.PANEL.PANEL_UPDATED_SUCCESSFULLY.message,
      statusCode: Messages.PANEL.PANEL_UPDATED_SUCCESSFULLY.code
    }
  }

  async delete(id: string): Promise<ResultDto> {
    await this.panelModel.deleteOne({ _id: new Types.ObjectId(id) })
    return {
      success: true,
      message: Messages.PANEL.PANEL_DELETED_SUCCESSFULLY.message,
      statusCode: Messages.PANEL.PANEL_DELETED_SUCCESSFULLY.code
    }
  }

  async getLocations({ startIndex, limit, order }: FilterDto): Promise<DataResultDto<ListDto<PanelDto[]>>> {
    const query = this.panelModel.find({ status: true })
    const list = (await query.skip(startIndex).limit(limit).sort({ createdAt: order == 1 ? 1 : -1 })).map<PanelDto>(x => { return { id: String(x._id), name: x.name, type: x.type, url: x.url, weight: x.weight } })

    return {
      success: true,
      message: Messages.PANEL.PANEL_LISTED_SUCCESSFULLY.message,
      statusCode: Messages.PANEL.PANEL_LISTED_SUCCESSFULLY.code,
      data: {
        items: list,
        length: (await this.panelModel.find({ status: true })).length
      }
    }
  }
}