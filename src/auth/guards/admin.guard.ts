import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRoleEnum } from '../../Generics/Enums/role-user.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();
    const user = request.user;
    //console.log(user);
    if (!user || user.role !== UserRoleEnum.ADMIN) {
      throw new UnauthorizedException(
        'Unauthorized access: Admin role required',
      );
    }

    return true;
  }
}
