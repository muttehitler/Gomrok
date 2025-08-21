export default interface BalanceLogDto {
    id?: string
    type: string
    amount: number
    order?: string
    payment?: string
    admin?: string
    user: string
}