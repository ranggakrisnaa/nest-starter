import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {
    private saltRounds: number;
    private secretKey: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.saltRounds = +this.configService.get('SALT_ROUNDS') || 10;
        this.secretKey = this.configService.get('SECRET_KEY') || 'secret';
    }

    hashPassword(plainTextPassword: string): string {
        return bcrypt.hashSync(plainTextPassword, this.saltRounds);
    }

    comparePassword(plainTextPassword: string, hashPassword: string): boolean {
        return bcrypt.compareSync(plainTextPassword, hashPassword);
    }

    signJwt(data: any, expiresIn: string): string {
        return this.jwtService.sign(data, { secret: this.secretKey, expiresIn });
    }

    async verifyJwt(token: string): Promise<any> {
        try {
            return this.jwtService.verifyAsync(token, { secret: this.secretKey });
        } catch (error) {
            return null;
        }
    }
}
