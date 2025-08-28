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
  ) {}

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

  @MessagePattern(REPORTING_PATTERNS.ORDER_PURCHASED)
  async handleOrderPurchased(@Payload() data: { order: OrderDto; user: UserDto }) {
    this.logger.log(`Received ORDER_PURCHASED event for user ${data.user.username}`);
    const { order, user } = data;

    const message = `
*New Purchase Report* 🛍️

*User:* ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})
*Order Name:* 
${order.name}
*Price:* 
${order.finalPrice}
*Date:* 
${new Date().toLocaleString('en-CA')}
    `;

    const admins = await this.getAdmins();
    await this.reportingService.sendReport(message, admins);
  }

  @MessagePattern(REPORTING_PATTERNS.SERVICE_DELETED)
  async handleServiceDeleted(@Payload() data: { order: OrderDto; user: UserDto }) {
    this.logger.log(`Received SERVICE_DELETED event for user ${data.user.username}`);
    const { order, user } = data;

    const message = `
*Service Deletion Report* 🗑️

*User:* ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})
*Service Name:* 
${order.name}
*Date:* 
${new Date().toLocaleString('en-CA')}
    `;

    const admins = await this.getAdmins();
    await this.reportingService.sendReport(message, admins);
  }

  @MessagePattern(REPORTING_PATTERNS.SERVICE_RENEWED)
  async handleServiceRenewed(@Payload() data: { order: OrderDto; user: UserDto }) {
    this.logger.log(`Received SERVICE_RENEWED event for user ${data.user.username}`);
    const { order, user } = data;

    const message = `
*Service Renewal Report* 🔄

*User:* ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})
*Service Name:* 
${order.name}
*New Price:* 
${order.finalPrice}
*Date:* 
${new Date().toLocaleString('en-CA')}
    `;

    const admins = await this.getAdmins();
    await this.reportingService.sendReport(message, admins);
  }

  @MessagePattern(REPORTING_PATTERNS.PAYMENT_VERIFIED)
  async handlePaymentVerified(@Payload() data: { payment: any; user: UserDto; amount: number }) {
    this.logger.log(`Received PAYMENT_VERIFIED event for user ${data.user.username}`);
    const { user, amount } = data;

    const message = `*Successful Payment Report* 💰

*User:* ${user.firstName || ''} ${user.lastName || ''} (@${user.username || 'N/A'})
*Amount:* 
${amount.toLocaleString()}
*Payment Method:* TRX
*Date:* 
${new Date().toLocaleString('en-CA')}
    `;

    const admins = await this.getAdmins();
    await this.reportingService.sendReport(message, admins);
  }

  @MessagePattern(REPORTING_PATTERNS.ADMIN_INCREASED_BALANCE)
  async handleAdminIncreasedBalance(@Payload() data: { admin: UserDto; user: UserDto; amount: number }) {
    this.logger.log(`Received ADMIN_INCREASED_BALANCE event by ${data.admin.username}`);
    const { admin, user, amount } = data;

    const message = `*Admin Action: Balance Increased* 📈

*Admin:* ${admin.firstName || ''} (@${admin.username || 'N/A'})
*Target User:* ${user.firstName || ''} (@${user.username || 'N/A'})
*Amount Increased:* 
${amount.toLocaleString()}
*Date:* 
${new Date().toLocaleString('en-CA')}
    `;

    const admins = await this.getAdmins();
    await this.reportingService.sendReport(message, admins);
  }

  @MessagePattern(REPORTING_PATTERNS.ADMIN_DECREASED_BALANCE)
  async handleAdminDecreasedBalance(@Payload() data: { admin: UserDto; user: UserDto; amount: number }) {
    this.logger.log(`Received ADMIN_DECREASED_BALANCE event by ${data.admin.username}`);
    const { admin, user, amount } = data;

    const message = `*Admin Action: Balance Decreased* 📉

*Admin:* ${admin.firstName || ''} (@${admin.username || 'N/A'})
*Target User:* ${user.firstName || ''} (@${user.username || 'N/A'})
*Amount Decreased:* 
${amount.toLocaleString()}
*Date:* 
${new Date().toLocaleString('en-CA')}
    `;

    const admins = await this.getAdmins();
    await this.reportingService.sendReport(message, admins);
  }
}
