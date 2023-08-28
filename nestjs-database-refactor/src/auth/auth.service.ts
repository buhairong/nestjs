import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserDto } from '../user/dto/get-user.dto';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private userSerivce: UserService, private jwt: JwtService) {}

  async signin(username: string, password: string) {
    const user = await this.userSerivce.find(username);
    console.log('signin1', user);
    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }
    console.log('signin2', user.password, password);
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }

    return await this.jwt.signAsync({
      username: user.username,
      sub: user.id,
    });

    // if (user && user.password === password) {
    //   return await this.jwt.signAsync(
    //     {
    //       username: user.username,
    //       sub: user.id,
    //     },
    //     {
    //       expiresIn: '1d',
    //     },
    //   );
    // }
  }

  async signup(username: string, password: string) {
    const user = await this.userSerivce.find(username);

    if (user) {
      throw new ForbiddenException('用户已存在');
    }

    const res = await this.userSerivce.create({
      username,
      password,
    });
    return res;
  }
}
