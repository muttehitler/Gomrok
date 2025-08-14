import IDto from "../../abstract/iDto";

export default interface AddOrderDto extends IDto {
    name?: string
    product: string
}