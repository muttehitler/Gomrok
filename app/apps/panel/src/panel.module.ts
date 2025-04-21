import { Global, Module } from '@nestjs/common';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Panel, { PanelSchema } from './models/concrete/panel';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.AUTH_MONGO_STRING?.toString() ?? '', { dbName: 'paneldb' }),
    MongooseModule.forFeature([{ name: Panel.name, schema: PanelSchema }])
  ],
  controllers: [PanelController],
  providers: [PanelService],
})
export class PanelModule { }
