import { BadGatewayException, ForbiddenException, Injectable } from '@nestjs/common';
import UserDal from './db/abstract/userDal';
import User from './models/concrete/user';
import { Types } from 'mongoose';
import { HashHelper } from '@app/contracts/utils/hashing/hashHelper';

@Injectable()
export class AuthService {
  constructor(private userDal: UserDal) { }

  async login(): Promise<User> {
    // let user: User = {
    //   _id: undefined,
    //   name: 'taha2',
    //   passwordHash: 'password123',
    //   __v: 5
    // }
    // await this.userDal.add(user)
    if (HashHelper.comparePassword('password1234', (await this.userDal.findOne({ name: 'taha2' }))!.passwordHash, () => { }))
      return await this.userDal.find({}).then((r) => { r.reverse(); return r[0] });
    throw new BadGatewayException();
  }
}
