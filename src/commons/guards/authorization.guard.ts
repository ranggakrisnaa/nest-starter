import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/resources/auth/auth.service';
import { AccessTokenData } from '../shared/entities/access-token-data.entity';
import { UserData } from '../shared/entities/user-data.entity';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: UserData = request.user;

        if (!user) throw new HttpException('Unauthenticated user.', HttpStatus.FORBIDDEN);

        const hasRole = this.checkUserRole(user);
        if (hasRole) throw new HttpException('User role is unauthorize.', HttpStatus.FORBIDDEN);

        return true;
    }

    private checkUserRole(user: UserData): boolean {
        return user.role && user.role.includes('ADMIN');
    }
}
