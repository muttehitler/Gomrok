import IDto from "../../abstract/iDto";

export default interface PanelDto extends IDto {
    id: string
    name: string
    type: string
    url: string
    username?: string
    password?: string
    weight: number
}