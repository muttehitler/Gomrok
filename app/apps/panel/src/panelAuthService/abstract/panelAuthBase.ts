import PanelTokenFuncDto from "@app/contracts/models/dtos/panel/panelAuth/panelTokenFuncDto";
import Panel from "../../models/concrete/panel";
import { HttpService } from "@nestjs/axios";

export default abstract class PanelAuthBase {
    abstract getAuthToken(panelId: string, getTokenFunc: (httpService: HttpService, panel: Panel) => Promise<PanelTokenFuncDto>)
}