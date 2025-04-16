import { Module } from '@nestjs/common';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';

@Module({
  imports: [],
  controllers: [PanelController],
  providers: [PanelService],
})
export class PanelModule {}
