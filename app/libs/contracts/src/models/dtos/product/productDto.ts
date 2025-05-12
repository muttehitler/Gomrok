export default interface ProductDto {
    id: string
    name: string
    panel: string
    payAsYouGo: boolean
    usageDuration: number
    dataLimit: number
    userLimit: number
    onHold: boolean
    price: number
    weight: number
    code: string
}