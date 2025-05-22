import PanelTokenFuncDto from "@app/contracts/models/dtos/panel/panelAuth/panelTokenFuncDto";
import Panel from "../../models/concrete/panel";

export default abstract class PanelAuthBase{
    abstract getAuthToken(panelId:string, getTokenFunc: (panel: Panel) => Promise<PanelTokenFuncDto>)
}