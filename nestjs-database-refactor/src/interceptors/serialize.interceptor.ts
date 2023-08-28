import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, {
          // 设置为true之后，所有经过该interceptor的接口都需要设置Expose或Exclude
          // Expose就是设置哪些字段需要暴露，Exclude就是设置哪些字段不需要暴露
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
