import AddPanelDto from "@app/contracts/models/dtos/panel/addPanelDto";
import PanelBase from "../abstract/panelBase";
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class MarzneshinPanel extends PanelBase {
    constructor(private httpService: HttpService) {
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

        const response = this.httpService.post(panelDto.url + '/api/admins/token', data, { headers, validateStatus: () => true })
        return (await firstValueFrom(response)).status
    }
}