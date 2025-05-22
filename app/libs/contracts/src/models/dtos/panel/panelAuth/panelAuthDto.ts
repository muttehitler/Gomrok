import IDto from "@app/contracts/models/abstract/iDto";

export default interface PanelAuthDto extends IDto {
    panelId: string
    authKey: string
    expiration: Date
}