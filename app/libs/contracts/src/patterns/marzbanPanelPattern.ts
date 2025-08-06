export const MARZBAN_PANEL_PATTERNS = {
    USER: {
        ADD: '/api/user',
        GET: '/api/user/',
        MODIFY: '/api/user/',
        REVOKE_SUB: '/api/user/{username}/revoke_sub',
        RESET: '/api/user/{username}/reset',
        ENABLE: '/api/user/{username}/enable',
        DISABLE: '/api/user/{username}/disable'
    },
    ADMIN: {
        TOKEN: "/api/admin/token"
    },
    SERVICES: {
        GET: ''
    },
    SYSTEM: {
        INBOUNDS: '/api/inbounds'
    }
}