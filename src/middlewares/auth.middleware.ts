import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'];
    if (!token) {
      return res.status(403).json({
        message: 'Vous ne pouvez pas accéder à cette ressource. Pas de token',
      });
    }

    try {
      const decoded = verify(token as string, process.env.JWT_SECRET);
      req['userId'] = decoded['id'];
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token invalide.' });
    }
  }
}
