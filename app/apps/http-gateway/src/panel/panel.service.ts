import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import FilterDto from '@app/contracts/models/dtos/filterDto';
import ListDto from '@app/contracts/models/dtos/listDto';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import PanelDto from '@app/contracts/models/dtos/panel/panelDto';
import ResultDto from '@app/contracts/models/dtos/resultDto';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import { REPORTING_PATTERNS } from '@app/contracts/patterns/reportingPattern';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PanelService {
    constructor(
        @Inject(PANEL_PATTERNS.CLIENT) private panelClient: ClientProxy,
        @Inject(USER_PATTERNS.CLIENT) private userClient: ClientProxy,
        @Inject(REPORTING_PATTERNS.CLIENT) private reportingClient: ClientProxy,
    ) { }

    async testConnection(panelDto: AddPanelDto) {
        return await this.panelClient.send(PANEL_PATTERNS.TEST_CONNECTION, panelDto).toPromise()
    }

    async add(panelDto: AddPanelDto, authorId: string) {
        const result = await this.panelClient.send(PANEL_PATTERNS.ADD, { panelDto: panelDto, authorUser: authorId }).toPromise();
        if (result.success) {
            const author = await this.userClient.send(USER_PATTERNS.GET_USER_FOR_REPORTING, authorId).toPromise();
            this.reportingClient.emit(REPORTING_PATTERNS.NEW_PANEL, { panel: panelDto, author: author.data });
        }
        return result;
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

    async update(id: string, panel: PanelDto, authorId: string): Promise<ResultDto> {
        const result = await this.panelClient.send(PANEL_PATTERNS.UPDATE, { id: id, panel: panel }).toPromise();
        if (result.success) {
            const author = await this.userClient.send(USER_PATTERNS.GET_USER_FOR_REPORTING, authorId).toPromise();
            this.reportingClient.emit(REPORTING_PATTERNS.EDIT_PANEL, { panel, author: author.data });
        }
        return result;
    }

    async delete(id: string, authorId: string): Promise<ResultDto> {
        const panel = await this.get(id);
        const result = await this.panelClient.send(PANEL_PATTERNS.DELETE, id).toPromise();
        if (result.success) {
            const author = await this.userClient.send(USER_PATTERNS.GET_USER_FOR_REPORTING, authorId).toPromise();
            this.reportingClient.emit(REPORTING_PATTERNS.DELETE_PANEL, { panel, author: author.data });
        }
        return result;
    }

    async getLocations(filter: FilterDto) {
        return await this.panelClient.send(PANEL_PATTERNS.GET_LOCATION, filter)
    }
}