import AddPanelDto from "@app/contracts/models/dtos/panel/addPanelDto";
import PanelAddUserDto from "@app/contracts/models/dtos/panel/panelService/panelAddUserDto";
import PanelModifyUserDto from "@app/contracts/models/dtos/panel/panelService/panelModifyUserDto";

export default abstract class PanelBase {
    abstract testConnection(panelDto: AddPanelDto): any
    abstract addUser(user: PanelAddUserDto, panel: string)
    abstract getUser(user: string, panelId: string)
    abstract modifyUser(user: PanelModifyUserDto, panelId: string)
    abstract revokeSubscription(user: string, panelId: string)
    abstract resetUsage(user: string, panelId: string)
}