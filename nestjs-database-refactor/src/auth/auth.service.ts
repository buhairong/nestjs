import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserDto } from '../user/dto/get-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userSerivce: UserService, private jwt: JwtService) {}

  async signin(username: string, password: string) {
    const user = await this.userSerivce.find(username);
    if (user && user.password === password) {
      return await this.jwt.signAsync(
        {
          username: user.username,
          sub: user.id,
        },
        {
          expiresIn: '1d',
        },
      );
    }
    throw new UnauthorizedException();
  }

  async signup(username: string, password: string) {
    const res = await this.userSerivce.create({
      username,
      password,
    });
    return res;
  }
}
