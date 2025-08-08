import { Global, Module, Scope } from '@nestjs/common';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Panel, { PanelSchema } from './models/concrete/panel';
import { PanelType } from './patterns/panelType';
import MarzneshinPanel from './panelServices/concrete/marzneshinPanel';
import { HttpModule } from '@nestjs/axios';
import { PanelServiceModule } from './panel-service/panel-service.module';
import PanelAuthBase from './panelAuthService/abstract/panelAuthBase';
import PanelAuthService from './panelAuthService/concrete/panelAuthService';
import MarzbanPanel from './panelServices/concrete/marzbanPanel';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_STRING?.toString() ?? '', { dbName: 'paneldb' }),
    MongooseModule.forFeature([{ name: Panel.name, schema: PanelSchema }]),
    HttpModule,
    PanelServiceModule
  ],
  controllers: [PanelController],
  providers: [
    PanelService,
    {
      provide: PanelType.marzneshin,
      useClass: MarzneshinPanel
    },
    {
      provide: PanelType.marzban,
      useClass: MarzbanPanel
    },
    {
      provide: PanelAuthBase,
      useClass: PanelAuthService
    }
  ],
  exports: [
    PanelService, PanelType.marzneshin, PanelType.marzban, PanelAuthBase
  ]
})
export class PanelModule { }
