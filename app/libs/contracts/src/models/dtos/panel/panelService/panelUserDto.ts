export default interface PanelUserDto {
    id: string
    username: string
    expireStrategy: string
    expireDate?: string
    usageDuration?: number
    activationDeadline: string
    key: string
    dataLimit: number
    dataLimitResetStrategy: string
    note: string
    subUpdatedAt: string
    subLastUserAgent: string
    onlineAt: string
    activated: boolean
    isActive: boolean
    expired: boolean
    dataLimitReached: boolean
    enabled: boolean
    usedTraffic: number
    lifetimeUsedTraffic: number
    subRevokedAt: string
    createdAt: string
    serviceIds: number[]
    subscriptionUrl: string
    ownerUsername: string
    trafficResetAt: string

    links?: string[]
}