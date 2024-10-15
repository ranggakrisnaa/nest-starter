import { User } from '@prisma/client';
import { UserData } from './user-data.entity';

export class AccessTokenData {
    sub: UserData;
}
