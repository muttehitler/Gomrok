import AddPanelDto from "@app/contracts/models/dtos/panel/addPanelDto";
import PanelAddUserDto from "@app/contracts/models/dtos/panel/panelService/panelAddUserDto";

export default abstract class PanelBase {
    abstract testConnection(panelDto: AddPanelDto): any
    abstract addUser(user: PanelAddUserDto, panel: string)
}