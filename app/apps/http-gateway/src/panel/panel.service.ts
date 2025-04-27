import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PanelService {
    constructor(@Inject(PANEL_PATTERNS.CLIENT) private paymentClient: ClientProxy) { }

    async testConnection(panelDto: AddPanelDto) {
        return await this.paymentClient.send(PANEL_PATTERNS.TEST_CONNECTION, panelDto).toPromise()
    }

    async add(panelDto: AddPanelDto, authorUser: string) {
        return await this.paymentClient.send(PANEL_PATTERNS.ADD, { panelDto: panelDto, authorUser: authorUser }).toPromise()
    }
}
