import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SecurityService } from '../services/security.service';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private readonly securityService: SecurityService,
        private prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;

        if (!authHeader) throw new HttpException('User token is not found.', HttpStatus.FORBIDDEN);

        const token = authHeader.split(' ')[1];

        const decoded: any = await this.securityService.verifyJwt(token);

        if (!decoded) throw new HttpException('Invalid user token.', HttpStatus.FORBIDDEN);

        const userData = decoded.sub;

        const foundUser = await this.prismaService.user.findFirst({ where: { id: userData.id } });

        if (!foundUser) throw new HttpException('Unauthenticated User.', HttpStatus.FORBIDDEN);

        if (!foundUser.isActive) throw new HttpException('Account user is not activated.', HttpStatus.FORBIDDEN);

        request.user = userData;

        return true;
    }
}
