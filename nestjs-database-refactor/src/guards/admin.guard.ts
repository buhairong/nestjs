import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = (await this.userService.find(req.user.username)) as User;
    if (user.roles.filter((o) => o.id === 2).length > 0) {
      return true;
    }
    return false;
  }
}
