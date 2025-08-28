export const REPORTING_PATTERNS = {
    CLIENT: 'reporting_client',
    // Success Events
    ORDER_PURCHASED: 'reporting.order_purchased',
    SERVICE_REVOKED: 'reporting.service_revoked',
    SERVICE_RENEWED: 'reporting.service_renewed',
    PAYMENT_VERIFIED: 'reporting.payment_verified',
    ADMIN_INCREASED_BALANCE: 'reporting.admin_increased_balance',
    ADMIN_DECREASED_BALANCE: 'reporting.admin_decreased_balance',
    TEST_ACCOUNT_RECEIVED: 'reporting.test_account_received',
    NEW_USER_REGISTERED: 'reporting.new_user_registered',
    ADMIN_LOGGED_IN: 'reporting.admin_logged_in',

    // Failure Events
    INSUFFICIENT_BALANCE: 'reporting.insufficient_balance',
    PANEL_INTEGRATION_FAILED: 'reporting.panel_integration_failed',
    PAYMENT_VERIFICATION_FAILED: 'reporting.payment_verification_failed',
}
