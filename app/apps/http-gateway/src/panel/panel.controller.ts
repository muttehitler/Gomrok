import { Controller, Get } from '@nestjs/common';
import { PanelService } from './panel.service';

@Controller('panel')
export class PanelController {
    constructor(private panelService: PanelService) { }

    @Get('testConnection')
    async testConnection() {
        return await this.panelService.testConnection()
    }
}
