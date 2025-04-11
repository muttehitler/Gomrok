import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import UserDal from './db/abstract/userDal';
import MUserDal from './db/mongoose/mUserDal';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h'
      }
    })
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
