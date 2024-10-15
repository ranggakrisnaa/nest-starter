import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { PrismaService } from './commons/services/prisma.service';
import { PaginationService } from './commons/services/pagination.service';
import { RequestContextService } from './commons/services/request-context.service';
import { PrismaServiceProvider } from './commons/providers/prisma-service.provider';
import { PaginationServiceProvider } from './commons/providers/pagination-service.provider';
import { RequestContextServiceProvider } from './commons/providers/request-context-service.provider';
import { SecurityService } from './commons/services/security.service';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { BootstrapService } from './commons/services/bootstrap.service';

@Module({
    imports: [
        AuthModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        AppService,
        PrismaService,
        JwtService,
        PrismaServiceProvider,
        SecurityService,
        ConfigService,
        PaginationService,
        PaginationServiceProvider,
        RequestContextService,
        BootstrapService,
        RequestContextServiceProvider,
    ],
})
export class AppModule implements OnModuleInit {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly paginationService: PaginationService,
        private readonly requestContextService: RequestContextService,
    ) { }

    onModuleInit(): void {
        PaginationServiceProvider.setService(this.paginationService);
        RequestContextServiceProvider.setService(this.requestContextService);
        PrismaServiceProvider.setService(this.prismaService);
    }
}
