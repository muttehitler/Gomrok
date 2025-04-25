import { Module } from '@nestjs/common';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';

@Module({
  controllers: [PanelController],
  providers: [PanelService]
})
export class PanelModule {}
