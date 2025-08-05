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
import DataResultDto from "@app/contracts/models/dtos/dataResultDto";
import PanelUserDto from "@app/contracts/models/dtos/panel/panelService/panelUserDto";
import PanelModifyUserDto from "@app/contracts/models/dtos/panel/panelService/panelModifyUserDto";

@Injectable()
export default class MarzneshinPanel extends PanelBase {
    constructor(private httpService: HttpService, private panelAuth: PanelAuthBase,
        @InjectModel(Panel.name) private panelModel: Model<PanelDocument>
    ) {
        super()
    }

    async resetUsage(user: string, panelId: string) {
        const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
        if (!panel)
            throw new NotFoundException("Panel not fount")

        const auth = await this.panelAuth.getAuthToken(panelId, this.getToken)

        const response = await firstValueFrom(this.httpService.post(panel.url + MARZNESHIN_PANEL_PATTERNS.USERS.RESET.replace('{username}', user), {}, {
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
                message: Messages.PANEL.PANEL_SERVICE.CANNOT_RESET_USER.message + ": " + response.data.detail,
                statusCode: Messages.PANEL.PANEL_SERVICE.CANNOT_RESET_USER.code
            }

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_RESETED_SUCCESSFULLY.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_RESETED_SUCCESSFULLY.code
        }
    }

    async modifyUser(user: PanelModifyUserDto, panelId: string) {
        const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
        if (!panel)
            throw new NotFoundException("Panel not fount")

        const auth = await this.panelAuth.getAuthToken(panelId, this.getToken)

        const response = await firstValueFrom(this.httpService.put(panel.url + MARZNESHIN_PANEL_PATTERNS.USERS.MODIFY + user.username, {
            activation_deadline: user.activationDeadline,
            data_limit: user.dataLimit,
            data_limit_reset_strategy: user.dataLimitResetStrategy,
            expire_strategy: user.expireStrategy,
            note: user.note,
            service_ids: user.serviceIds,
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
                message: Messages.PANEL.PANEL_SERVICE.CANNOT_MODIFY_USER.message + ": " + response.data.detail,
                statusCode: Messages.PANEL.PANEL_SERVICE.CANNOT_MODIFY_USER.code
            }

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_UPDATED.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_UPDATED.code
        }
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

        user.services = (await firstValueFrom(this.httpService.get(panel.url + MARZNESHIN_PANEL_PATTERNS.SERVICES.GET, {
            headers: {
                'Authorization': 'Bearer ' + auth,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            validateStatus: () => true
        }))).data.items.map(x => x.id)

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
                statusCode: Messages.PANEL.PANEL_SERVICE.CANNOT_CREATE_USER.code
            }

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_CREATED_SUCCESSFULLY.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_CREATED_SUCCESSFULLY.code
        }
    }

    async getUser(user: string, panelId: string): Promise<DataResultDto<PanelUserDto>> {
        const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
        if (!panel)
            throw new NotFoundException("Panel not fount")

        const auth = await this.panelAuth.getAuthToken(panelId, this.getToken)

        const response = await firstValueFrom(this.httpService.get(panel.url + MARZNESHIN_PANEL_PATTERNS.USERS.GET + user, {
            headers: {
                'Authorization': 'Bearer ' + auth,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            validateStatus: () => true
        }))

        if (response.status != 200)
            throw new NotFoundException("User not found")

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_GOT_SUCCESSFULLY.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_GOT_SUCCESSFULLY.code,
            data: {
                id: response.data.id,
                username: response.data.username,
                expireStrategy: response.data.expire_strategy,
                expireDate: response.data.expire_date,
                usageDuration: response.data.usage_duration,
                activationDeadline: response.data.activation_deadline,
                key: response.data.key,
                dataLimit: response.data.data_limit,
                dataLimitResetStrategy: response.data.data_limit_reset_strategy,
                note: response.data.note,
                subUpdatedAt: response.data.sub_updated_at,
                subLastUserAgent: response.data.sub_last_user_agent,
                onlineAt: response.data.online_at,
                activated: response.data.activated,
                isActive: response.data.is_active,
                expired: response.data.expired,
                dataLimitReached: response.data.data_limit_reached,
                enabled: response.data.enabled,
                usedTraffic: response.data.used_traffic,
                lifetimeUsedTraffic: response.data.lifetime_used_traffic,
                subRevokedAt: response.data.sub_revoked_at,
                createdAt: response.data.created_at,
                serviceIds: response.data.service_ids,
                subscriptionUrl: response.data.subscription_url,
                ownerUsername: response.data.owner_username,
                trafficResetAt: response.data.traffic_reset_at
            }
        }
    }

    async revokeSubscription(user: string, panelId: string): Promise<DataResultDto<PanelUserDto>> {
        const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
        if (!panel)
            throw new NotFoundException("Panel not fount")

        const auth = await this.panelAuth.getAuthToken(panelId, this.getToken)

        const response = await firstValueFrom(this.httpService.post(panel.url + MARZNESHIN_PANEL_PATTERNS.USERS.REVOKE_SUB.replace('{username}', user), {
        }, {
            headers: {
                'Authorization': 'Bearer ' + auth,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            validateStatus: () => true
        }))

        if (response.status != 200)
            throw new NotFoundException(Messages.PANEL.PANEL_SERVICE.USER_REVOKE_UNSUCCESSFULLY.message + ": " + response.data.detail)

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_REVOKED_SUCCESSFULLY.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_REVOKED_SUCCESSFULLY.code,
            data: {
                id: response.data.id,
                username: response.data.username,
                expireStrategy: response.data.expire_strategy,
                expireDate: response.data.expire_date,
                usageDuration: response.data.usage_duration,
                activationDeadline: response.data.activation_deadline,
                key: response.data.key,
                dataLimit: response.data.data_limit,
                dataLimitResetStrategy: response.data.data_limit_reset_strategy,
                note: response.data.note,
                subUpdatedAt: response.data.sub_updated_at,
                subLastUserAgent: response.data.sub_last_user_agent,
                onlineAt: response.data.online_at,
                activated: response.data.activated,
                isActive: response.data.is_active,
                expired: response.data.expired,
                dataLimitReached: response.data.data_limit_reached,
                enabled: response.data.enabled,
                usedTraffic: response.data.used_traffic,
                lifetimeUsedTraffic: response.data.lifetime_used_traffic,
                subRevokedAt: response.data.sub_revoked_at,
                createdAt: response.data.created_at,
                serviceIds: response.data.service_ids,
                subscriptionUrl: response.data.subscription_url,
                ownerUsername: response.data.owner_username,
                trafficResetAt: response.data.traffic_reset_at
            }
        }
    }

    async enableUser(user: string, panelId: string): Promise<ResultDto> {
        const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
        if (!panel)
            throw new NotFoundException("Panel not fount")

        const auth = await this.panelAuth.getAuthToken(panelId, this.getToken)

        const response = await firstValueFrom(this.httpService.post(panel.url + MARZNESHIN_PANEL_PATTERNS.USERS.ENABLE.replace('{username}', user), {
        }, {
            headers: {
                'Authorization': 'Bearer ' + auth,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            validateStatus: () => true
        }))

        if (response.status != 200)
            throw new NotFoundException(Messages.PANEL.PANEL_SERVICE.USER_ENABLE_UNSUCCESSFULLY.message + ": " + response.data.detail)

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_ENABLED_SUCCESSFULLY.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_ENABLED_SUCCESSFULLY.code
        }
    }

    async disableUser(user: string, panelId: string): Promise<ResultDto> {
        const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
        if (!panel)
            throw new NotFoundException("Panel not fount")

        const auth = await this.panelAuth.getAuthToken(panelId, this.getToken)

        const response = await firstValueFrom(this.httpService.post(panel.url + MARZNESHIN_PANEL_PATTERNS.USERS.DISABLE.replace('{username}', user), {
        }, {
            headers: {
                'Authorization': 'Bearer ' + auth,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            validateStatus: () => true
        }))

        if (response.status != 200)
            throw new NotFoundException(Messages.PANEL.PANEL_SERVICE.USER_DISABLE_UNSUCCESSFULLY.message + ": " + response.data.detail)

        return {
            success: true,
            message: Messages.PANEL.PANEL_SERVICE.USER_DISABLED_SUCCESSFULLY.message,
            statusCode: Messages.PANEL.PANEL_SERVICE.USER_DISABLED_SUCCESSFULLY.code
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