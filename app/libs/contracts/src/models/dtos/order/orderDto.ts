import IDto from "../../abstract/iDto";

export default interface OrderDto extends IDto {
    name: string
    payed: boolean
    price: number
    finalPrice: number
    product: string
}