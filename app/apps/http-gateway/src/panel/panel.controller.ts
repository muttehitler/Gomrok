import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PanelService } from './panel.service';
import AddPanelDto from '@app/contracts/models/dtos/panel/addPanelDto';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import PanelDto from '@app/contracts/models/dtos/panel/panelDto';
import { promises } from 'dns';
import ResultDto from '@app/contracts/models/dtos/resultDto';

@Controller('panel')
export class PanelController {
    constructor(private panelService: PanelService) { }

    @Post('test_connection')
    @UseGuards(new JwtAuthGuard(['admin']))
    async testConnection(@Body() panelDto: AddPanelDto) {
        return await this.panelService.testConnection(panelDto)
    }

    @Post('add')
    @UseGuards(new JwtAuthGuard(['admin']))
    async add(@Body() panelDto: AddPanelDto, @Req() req) {
        return await this.panelService.add(panelDto, req.user['sub'])
    }

    @Get()
    @UseGuards(new JwtAuthGuard(['admin']))
    async getList(): Promise<PanelDto[]> {
        return await this.panelService.getList()
    }

    @Get(':id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async get(@Param('id') id: string): Promise<PanelDto> {
        return await this.panelService.get(id)
    }

    @Put(':id')
    @UseGuards(new JwtAuthGuard(['admin']))
    async update(@Param('id') id: string, @Body() panel: PanelDto): Promise<ResultDto> {
        return await this.panelService.update(id, panel)
    }
}
