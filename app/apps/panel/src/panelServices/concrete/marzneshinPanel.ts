import AddPanelDto from "@app/contracts/models/dtos/panel/addPanelDto";
import PanelBase from "../abstract/panelBase";
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from "rxjs";
import { Injectable, NotFoundException } from "@nestjs/common";
import PanelAddUserDto from "@app/contracts/models/dtos/panel/panelService/panelAddUserDto";
import { MARZNESHIN_PANEL_PATTERNS } from "@app/contracts/patterns/marzneshinPanelPattern";
import PanelAuthBase from "../../panelAuthService/abstract/panelAuthBase";
import Panel, { PanelDocument } from "../../models/concrete/panel";
import PanelTokenFuncDto from "@app/contracts/models/dtos/panel/panelAuth/panelTokenFuncDto";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import ResultDto from "@app/contracts/models/dtos/resultDto";
import { Messages } from "@app/contracts/messages/messages";

@Injectable()
export default class MarzneshinPanel extends PanelBase {
    constructor(private httpService: HttpService, private panelAuth: PanelAuthBase,
        @InjectModel(Panel.name) private panelModel: Model<PanelDocument>
    ) {
        super()
    }

    async testConnection(panelDto: AddPanelDto) {
        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const data = new URLSearchParams({
            username: panelDto.username,
            password: panelDto.password,
        });

        const response = this.httpService.post(panelDto.url + MARZNESHIN_PANEL_PATTERNS.ADMINS.TOKEN, data, { headers, validateStatus: () => true })
        return (await firstValueFrom(response)).status
    }

    async addUser(user: PanelAddUserDto, panelId: string): Promise<ResultDto> {
        const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
        if (!panel)
            throw new NotFoundException("Panel not fount")

        const auth = await this.panelAuth.getAuthToken(panelId, this.getToken)

        const response = await firstValueFrom(this.httpService.post(panel.url + MARZNESHIN_PANEL_PATTERNS.USERS.ADD, {
            activation_deadline: user.activationDeadline,
            data_limit: user.dataLimit,
            data_limit_reset_strategy: user.dataLimitResetStrategy,
            expire_strategy: user.expireStrategy,
            note: user.note,
            service_ids: user.services,
            usage_duration: user.usageDuration,
            username: user.username
        }, {
            headers: {
                'Authorization': 'Bearer ' + auth,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            validateStatus: () => true
        }))

        if (response.status != 200)
            return {
                success: false,
                message: Messages.PANEL.PANEL_SERVICE.CANNOT_CREATE_USER.message + ": " + response.data.detail,
                statusCode: Messages.PANEL.PANEL_SERVICE.USER_CREATED_SUCCESSFULLY.code
            }

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_CREATED_SUCCESSFULLY.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_CREATED_SUCCESSFULLY.code
        }
    }

    async getToken(httpService: HttpService, panel: Panel): Promise<PanelTokenFuncDto> {
        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const data = new URLSearchParams({
            username: panel.username,
            password: panel.password,
        });

        const response = (await firstValueFrom(httpService.post(panel.url + MARZNESHIN_PANEL_PATTERNS.ADMINS.TOKEN, data, { headers, validateStatus: () => true })))

        return {
            accessToken: response.data.access_token,
            expiration: (new Date(new Date().getTime() + 60 * 60 * 1000)),
            tokenType: 'Bearer'
        }
    }
}