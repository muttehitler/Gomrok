import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import UserDto from '@app/contracts/models/dtos/user/userDto';

@Injectable()
export class ReportingService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(ReportingService.name);

  onModuleInit() {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      this.logger.error('BOT_TOKEN is not configured.');
      return;
    }
    this.bot = new Telegraf(token);
    this.logger.log('Telegraf bot initialized.');
  }

  async sendReport(message: string, admins: UserDto[]): Promise<void> {
    if (!this.bot) {
      this.logger.error('Bot is not initialized. Cannot send report.');
      return;
    }

    const reportChannelId = process.env.TELEGRAM_REPORT_CHANNEL_ID;
    if (!reportChannelId) {
      this.logger.warn('TELEGRAM_REPORT_CHANNEL_ID is not configured. Skipping channel report.');
    } else {
      try {
        await this.bot.telegram.sendMessage(reportChannelId, message, { parse_mode: 'Markdown' });
        this.logger.log(`Report sent to channel ${reportChannelId}`);
      } catch (error) {
        this.logger.error(`Failed to send report to channel ${reportChannelId}:`, error);
      }
    }

    if (!admins || admins.length === 0) {
      this.logger.log('No admins found to send private reports.');
      return;
    }

    this.logger.log(`Sending private reports to ${admins.length} admin(s).`);
    for (const admin of admins) {
      try {
        await this.bot.telegram.sendMessage(admin.chatId, message, { parse_mode: 'Markdown' });
      } catch (error) {
        this.logger.error(`Failed to send report to admin ${admin.username} (chatId: ${admin.chatId}):`, error);
      }
    }
  }
}
