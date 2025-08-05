import { Controller } from '@nestjs/common';
import { PanelService } from '../panel.service';
import { MessagePattern } from '@nestjs/microservices';
import { PANEL_PATTERNS } from '@app/contracts/patterns/panelPattern';
import PanelAddUserDto from '@app/contracts/models/dtos/panel/panelService/panelAddUserDto';
import { ModuleRef } from '@nestjs/core';
import PanelBase from '../panelServices/abstract/panelBase';
import PanelModifyUserDto from '@app/contracts/models/dtos/panel/panelService/panelModifyUserDto';

@Controller()
export class PanelServiceController {
    constructor(private panelService: PanelService, private moduleRef: ModuleRef) { }

    @MessagePattern(PANEL_PATTERNS.PANEL_SERVICE.ADD_USER)
    async addUser(data: { user: PanelAddUserDto, panel: string }) {
        return await (await this.moduleRef.get<PanelBase>(await this.panelService.getPanelType(data.panel) ?? '', { strict: false })).addUser(data.user, data.panel)
    }

    @MessagePattern(PANEL_PATTERNS.PANEL_SERVICE.GET_USER)
    async getUser(data: { user: string, panel: string }) {
        return await (await this.moduleRef.get<PanelBase>(await this.panelService.getPanelType(data.panel) ?? '', { strict: false })).getUser(data.user, data.panel)
    }

    @MessagePattern(PANEL_PATTERNS.PANEL_SERVICE.REVOKE_SUB)
    async revokeSub(data: { user: string, panel: string }) {
        return await ((await this.moduleRef.get<PanelBase>(await this.panelService.getPanelType(data.panel) ?? '', { strict: false })).revokeSubscription(data.user, data.panel))
    }

    @MessagePattern(PANEL_PATTERNS.PANEL_SERVICE.MODIFY_USER)
    async modifyUser(data: { user: PanelModifyUserDto, panel: string }) {
        return await (await this.moduleRef.get<PanelBase>(await this.panelService.getPanelType(data.panel) ?? '', { strict: false })).modifyUser(data.user, data.panel)
    }

    @MessagePattern(PANEL_PATTERNS.PANEL_SERVICE.RESET)
    async resetUser(data: { user: string, panel: string }) {
        return await (await this.moduleRef.get<PanelBase>(await this.panelService.getPanelType(data.panel) ?? '', { strict: false })).resetUsage(data.user, data.panel)
    }

    @MessagePattern(PANEL_PATTERNS.PANEL_SERVICE.ENABLE)
    async enableUser(data: { user: string, panel: string }) {
        return await (await this.moduleRef.get<PanelBase>(await this.panelService.getPanelType(data.panel) ?? '', { strict: false })).enableUser(data.user, data.panel)
    }

    @MessagePattern(PANEL_PATTERNS.PANEL_SERVICE.DISABLE)
    async disableUser(data: { user: string, panel: string }) {
        return await (await this.moduleRef.get<PanelBase>(await this.panelService.getPanelType(data.panel) ?? '', { strict: false })).disableUser(data.user, data.panel)
    }
}
