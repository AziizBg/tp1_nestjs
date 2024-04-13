import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing or invalid JWT token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Check if the user is authenticated
      if (!payload) {
        throw new UnauthorizedException('Invalid JWT token');
      }

      // Attach the user payload to the request object
      request.user = payload;

      // Check if the user has the 'admin' role
      const isAdmin = payload.role === 'admin';
      if (!isAdmin) {
        throw new UnauthorizedException(
          'Unauthorized access: Admin role required',
        );
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access: Invalid JWT token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.split(' ')[1];
  }
}
 'Bearer' ? token : undefined;
    }
}