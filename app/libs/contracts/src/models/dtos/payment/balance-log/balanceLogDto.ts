export default interface BalanceLogDto {
    id?: string
    type: string
    amount: number
    order?: string
    payment?: string
    user: string
}