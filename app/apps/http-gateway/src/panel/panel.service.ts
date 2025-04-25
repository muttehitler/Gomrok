import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PanelService {
    constructor(@Inject(PANEL_PATTERNS.CLIENT) private paymentClient: ClientProxy) { }

    async testConnection() {
        return await this.paymentClient.send(PANEL_PATTERNS.TEST_CONNECTION, {}).toPromise()
    }
}
