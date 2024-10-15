import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: 'MODEL_MAPPING',
            useValue: ModelMappingTable.USER,
        },
    ],
})
export class AuthModule { }
