import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { ReportingService } from './reporting.service';
import { REPORTING_PATTERNS } from '@app/contracts/patterns/reportingPattern';
import { USER_PATTERNS } from '@app/contracts/patterns/userPattern';
import OrderDto from '@app/contracts/models/dtos/order/orderDto';
import UserDto from '@app/contracts/models/dtos/user/userDto';
import DataResultDto from '@app/contracts/models/dtos/dataResultDto';
import ListDto from '@app/contracts/models/dtos/listDto';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ReportingController {
	private readonly logger = new Logger(ReportingController.name);

	constructor(
		private readonly reportingService: ReportingService,
		@Inject(USER_PATTERNS.CLIENT) private userClient: ClientProxy,
	) { }

	private async getAdmins(): Promise<UserDto[]> {
		try {
			const adminsResult = await firstValueFrom(
				this.userClient.send<DataResultDto<ListDto<UserDto[]>>>(USER_PATTERNS.GET_ADMINS, {})
			);
			if (adminsResult.success && adminsResult.data) {
				return adminsResult.data.items;
			}
			this.logger.error('Could not fetch admins:', adminsResult.message);
			return [];
		} catch (error) {
			this.logger.error('Error fetching admins:', error);
			return [];
		}
	}

	// --- SUCCESS EVENTS ---

	@MessagePattern(REPORTING_PATTERNS.ORDER_PURCHASED)
	async handleOrderPurchased(@Payload() data: { order: OrderDto; user: UserDto }) {
		this.logger.log(`Received ORDER_PURCHASED event for user ${data.user.username}`);
		const { order, user } = data;
		const message = `<b>New Purchase Report</b> 🛍️<br><br>
<b>User:</b> ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})<br>
<b>Order Name:</b><br>${order.name}<br>
<b>Price:</b><br>${order.finalPrice}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}
    `;

		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.SERVICE_REVOKED)
	async handleServiceRevoked(@Payload() data: { order: OrderDto; user: UserDto }) {
		this.logger.log(`Received SERVICE_REVOKED event for user ${data.user.username}`);
		const { order, user } = data;

		const message = `<b>Service Revocation Report</b> 🔄<br><br>
<b>User:</b> ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})<br>
<b>Service Name:</b><br>${order.name}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}`;

		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.SERVICE_RENEWED)
	async handleServiceRenewed(@Payload() data: { order: OrderDto; user: UserDto }) {
		this.logger.log(`Received SERVICE_RENEWED event for user ${data.user.username}`);
		const { order, user } = data;

		const message = `<b>Service Renewal Report</b> 🔄<br><br>
<b>User:</b> ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})<br>
<b>Service Name:</b><br>${order.name}<br>
<b>New Price:</b><br>${order.finalPrice}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}
    `;

		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.PAYMENT_VERIFIED)
	async handlePaymentVerified(@Payload() data: { payment: any; user: UserDto; amount: number }) {
		this.logger.log(`Received PAYMENT_VERIFIED event for user ${data.user.username}`);
		const { user, amount } = data;

		const message = `<b>Successful Payment Report</b> 💰<br><br>
<b>User:</b> ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})<br>
<b>Amount:</b><br>${amount.toLocaleString()}<br>
<b>Payment Method:</b> TRX<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}
    `;

		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.ADMIN_INCREASED_BALANCE)
	async handleAdminIncreasedBalance(@Payload() data: { admin: UserDto; user: UserDto; amount: number }) {
		this.logger.log(`Received ADMIN_INCREASED_BALANCE event by ${data.admin.username}`);
		const { admin, user, amount } = data;

		const message = `<b>Admin Action: Balance Increased</b> 📈<br><br>
<b>Admin:</b> ${admin.firstName || ''} (@${admin.username || 'N/A'})<br>
<b>Target User:</b> ${user.firstName || ''} (@${user.username || 'N/A'})<br>
<b>Amount Increased:</b><br>${amount.toLocaleString()}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}
    `;

		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.ADMIN_DECREASED_BALANCE)
	async handleAdminDecreasedBalance(@Payload() data: { admin: UserDto; user: UserDto; amount: number }) {
		this.logger.log(`Received ADMIN_DECREASED_BALANCE event by ${data.admin.username}`);
		const { admin, user, amount } = data;

		const message = `<b>Admin Action: Balance Decreased</b> 📉<br><br>
<b>Admin:</b> ${admin.firstName || ''} (@${admin.username || 'N/A'})<br>
<b>Target User:</b> ${user.firstName || ''} (@${user.username || 'N/A'})<br>
<b>Amount Decreased:</b><br>${amount.toLocaleString()}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}
    `;

		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.TEST_ACCOUNT_RECEIVED)
	async handleTestAccountReceived(@Payload() data: { order: OrderDto; user: UserDto }) {
		this.logger.log(`Received TEST_ACCOUNT_RECEIVED event for user ${data.user.username}`);
		const { order, user } = data;
		const message = `<b>Test Account Report</b> 🧪<br><br>
<b>User:</b> ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})<br>
<b>Order Name:</b><br>${order.name}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}`;
		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.NEW_USER_REGISTERED)
	async handleNewUserRegistered(@Payload() data: { user: UserDto }) {
		this.logger.log(`Received NEW_USER_REGISTERED event for user ${data.user.username}`);
		const { user } = data;
		const message = `<b>New User Registered</b> ✨<br><br>
<b>User:</b> ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}`;
		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.ADMIN_LOGGED_IN)
	async handleAdminLoggedIn(@Payload() data: { user: UserDto }) {
		this.logger.log(`Received ADMIN_LOGGED_IN event for admin ${data.user.username}`);
		const { user } = data;
		const message = `<b>Admin Login Alert</b> 🛡️<br><br>
<b>Admin:</b> ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}`;
		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	// --- FAILURE EVENTS ---

	@MessagePattern(REPORTING_PATTERNS.INSUFFICIENT_BALANCE)
	async handleInsufficientBalance(@Payload() data: { user: UserDto; order: OrderDto; balance: number }) {
		this.logger.log(`Received INSUFFICIENT_BALANCE event for user ${data.user.username}`);
		const { user, order, balance } = data;
		const message = `<b>ALERT: Insufficient Balance</b> ⚠️<br><br>
<b>User:</b> ${user.firstName || ''} (@${user.username || 'N/A'})<br>
<b>Attempted Order:</b><br>${order.name}<br>
<b>Order Price:</b><br>${order.finalPrice}<br>
<b>User Balance:</b><br>${balance}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}`;
		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.PANEL_INTEGRATION_FAILED)
	async handlePanelIntegrationFailed(@Payload() data: { user: UserDto; order: OrderDto; error: string }) {
		this.logger.log(`Received PANEL_INTEGRATION_FAILED event for user ${data.user.username}`);
		const { user, order, error } = data;
		const message = `<b>CRITICAL: Panel Integration Failed</b> ❌<br><br>
<b>User:</b> ${user.firstName || ''} (@${user.username || 'N/A'})<br>
<b>Order:</b><br>${order.name}<br>
<b>Error:</b><br>${error}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}`;
		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}

	@MessagePattern(REPORTING_PATTERNS.PAYMENT_VERIFICATION_FAILED)
	async handlePaymentVerificationFailed(@Payload() data: { user: UserDto; reason: string; details: string }) {
		this.logger.log(`Received PAYMENT_VERIFICATION_FAILED event for user ${data.user.username}`);
		const { user, reason, details } = data;
		const message = `<b>ALERT: Payment Verification Failed</b> ❗<br><br>
<b>User:</b> ${user.firstName || ''} (@${user.username || 'N/A'})<br>
<b>Reason:</b> ${reason}<br>
<b>Details:</b><br>${details}<br>
<b>Date:</b><br>${new Date().toLocaleString('en-CA')}`;
		const admins = await this.getAdmins();
		await this.reportingService.sendReport(message, admins);
	}
}
