import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import ListDto from '@app/contracts/models/dtos/listDto';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import PanelDto from '@app/contracts/models/dtos/panel/panelDto';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PanelService {
    constructor(@Inject(PANEL_PATTERNS.CLIENT) private panelClient: ClientProxy) { }

    async testConnection(panelDto: AddPanelDto) {
        return await this.panelClient.send(PANEL_PATTERNS.TEST_CONNECTION, panelDto).toPromise()
    }

    async add(panelDto: AddPanelDto, authorUser: string) {
        return await this.panelClient.send(PANEL_PATTERNS.ADD, { panelDto: panelDto, authorUser: authorUser }).toPromise()
    }

    async getForUser(id: string): Promise<PanelDto> {
        return await this.panelClient.send(PANEL_PATTERNS.GET_FOR_USER, { id }).toPromise()
    }

    async getList(filter: FilterDto): Promise<DataResultDto<ListDto<PanelDto[]>>> {
        return await this.panelClient.send(PANEL_PATTERNS.GET_LIST, filter).toPromise()
    }

    async get(id: string): Promise<PanelDto> {
        return await this.panelClient.send(PANEL_PATTERNS.GET, { id }).toPromise()
    }

    async update(id: string, panel: PanelDto): Promise<ResultDto> {
        return await this.panelClient.send(PANEL_PATTERNS.UPDATE, { id: id, panel: panel }).toPromise()
    }

    async delete(id: string): Promise<ResultDto> {
        return await this.panelClient.send(PANEL_PATTERNS.DELETE, id).toPromise()
    }

    async getLocations(filter: FilterDto) {
        return await this.panelClient.send(PANEL_PATTERNS.GET_LOCATION, filter)
    }
}
