import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { LifecycleService } from './commons/lifecycles/LifecycleService';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization, captcha-key, Wave-Signature'],
        credentials: true,
    });

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.use(bodyParser.json());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: false,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    new LifecycleService(app);

    app.enableShutdownHooks();

    await app.listen(3000);
}
bootstrap();
