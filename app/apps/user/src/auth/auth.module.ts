import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import UserDal from '../db/abstract/userDal';
import MUserDal from '../db/mongoose/mUserDal';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user.module';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
  // exports: [AuthController]
})
export class AuthModule { }
