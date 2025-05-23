import PanelAuthDto from "@app/contracts/models/dtos/panel/panelAuth/panelAuthDto";
import PanelAuthBase from "../abstract/panelAuthBase";
import Panel, { PanelDocument } from "../../models/concrete/panel";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MARZNESHIN_PANEL_PATTERNS } from "@app/contracts/patterns/marzneshinPanelPattern";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import PanelTokenFuncDto from "@app/contracts/models/dtos/panel/panelAuth/panelTokenFuncDto";

@Injectable()
export default class PanelAuthService extends PanelAuthBase {
    panels: PanelAuthDto[]

    constructor(private httpService: HttpService, @InjectModel(Panel.name) private panelModel: Model<PanelDocument>) {
        super()
        this.panels = []
    }

    async getAuthToken(panelId: string, getTokenFunc: (httpService: HttpService, panel: Panel) => Promise<PanelTokenFuncDto>) {
        const result = this.panels.find(x => x.panelId == panelId && x.expiration > new Date())
        if (!result) {
            const panel = await this.panelModel.findById(new Types.ObjectId(panelId))
            if (!panel)
                throw new NotFoundException("panel not found")

            const funcResult = await getTokenFunc(this.httpService, panel)

            this.panels.push({ authKey: funcResult.accessToken, expiration: funcResult.expiration, panelId: panelId })

            return funcResult.accessToken
        }
        return result?.authKey
    }
}