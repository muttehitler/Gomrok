export default interface FilterDto {
    startIndex: number
    limit: number
    order: number

    search?: string
    payed?: boolean
}