import { Module } from '@nestjs/common';
import { PanelServiceController } from './panel-service.controller';
import { PanelServiceService } from './panel-service.service';

@Module({
  imports:[],
  controllers: [PanelServiceController],
  providers: [PanelServiceService]  
})
export class PanelServiceModule {}
