import { Global, Module } from '@nestjs/common';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Panel, { PanelSchema } from './models/concrete/panel';
import { PanelType } from './patterns/panelType';
import MarzneshinPanel from './panelServices/concrete/marzneshinPanel';
import { HttpModule } from '@nestjs/axios';
import PanelConfig, { PanelConfigSchema } from './models/concrete/panelConfig';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.AUTH_MONGO_STRING?.toString() ?? '', { dbName: 'paneldb' }),
    MongooseModule.forFeature([{ name: Panel.name, schema: PanelSchema }]),
    MongooseModule.forFeature([{ name: PanelConfig.name, schema: PanelConfigSchema }]),
    HttpModule
  ],
  controllers: [PanelController],
  providers: [
    PanelService,
    {
      provide: PanelType.marzneshin,
      useClass: MarzneshinPanel
    }
  ],
})
export class PanelModule { }
