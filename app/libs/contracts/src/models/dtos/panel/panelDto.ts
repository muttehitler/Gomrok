import IDto from "../../abstract/iDto";

export default interface PanelDto extends IDto {
    name: string
    type: string
    url: string
    weight: number
}