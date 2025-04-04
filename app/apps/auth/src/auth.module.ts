import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import UserDal from './db/abstract/userDal';
import MUserDal from './db/mongoose/mUserDal';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UserDal,
      useClass: MUserDal
    }
  ],
})
export class AuthModule { }
