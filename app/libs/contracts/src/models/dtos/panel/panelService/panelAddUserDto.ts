import IDto from "@app/contracts/models/abstract/iDto";

export default interface PanelAddUserDto extends IDto {
    username:string
    activationDeadline?: string
    dataLimit: number
    dataLimitResetStrategy: string
    expireStrategy: string
    note: string
    services?: number[]
    usageDuration:number
}