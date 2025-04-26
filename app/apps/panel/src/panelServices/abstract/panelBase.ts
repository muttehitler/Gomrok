import AddPanelDto from "@app/contracts/models/dtos/panel/addPanelDto";

export default abstract class PanelBase {
    abstract testConnection(panelDto: AddPanelDto): any
}