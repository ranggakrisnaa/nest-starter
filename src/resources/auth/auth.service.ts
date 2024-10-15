import { HttpException, HttpStatus, Inject, Injectable, Post } from '@nestjs/common';
import { BaseCRUDService } from 'src/commons/services/base-crud.service';

@Injectable()
export class AuthService extends BaseCRUDService<any> {
    constructor(
        @Inject('MODEL_MAPPING') modelName: string,
    ) {
        super(modelName);
    }


}
