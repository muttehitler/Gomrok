import { Body, Controller, Get, Post } from '@nestjs/common';
import { PanelService } from './panel.service';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';

@Controller('panel')
export class PanelController {
    constructor(private panelService: PanelService) { }

    @Post('test_connection')
    async testConnection(@Body() panelDto: AddPanelDto) {
        return await this.panelService.testConnection(panelDto)
    }

    @Post('add')
    async add(@Body() panelDto: AddPanelDto) {
        return await this.panelService.add(panelDto)
    }
}
