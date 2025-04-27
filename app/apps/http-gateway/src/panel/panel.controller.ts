import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PanelService } from './panel.service';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';

@Controller('panel')
export class PanelController {
    constructor(private panelService: PanelService) { }

    @Post('test_connection')
    async testConnection(@Body() panelDto: AddPanelDto) {
        return await this.panelService.testConnection(panelDto)
    }

    @Post('add')
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Body() panelDto: AddPanelDto, @Req() req) {
        return await this.panelService.add(panelDto, req.user['sub'])
    }
}
