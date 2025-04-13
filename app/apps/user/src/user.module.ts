import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import UserDal from './db/abstract/userDal';
import MUserDal from './db/mongoose/mUserDal';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Global()
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION
      },
      global:true
    }),
  ],
  controllers: [UserController],
  providers: [UserService,
    {
      provide: UserDal,
      useClass: MUserDal
    }
  ],
  exports: [ UserDal]
})
export class UserModule { }
