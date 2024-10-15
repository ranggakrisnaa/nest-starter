import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
    constructor() {}

    randomArray(array: any[], length: number): any[] {
        const randomArray = [];
        for (let i = 0; i < length; i++) {
            randomArray.push(array[Math.floor(Math.random() * array.length)]);
        }
        return randomArray;
    }

    randomBoolean(): boolean {
        return Math.random() >= 0.5;
    }

    randomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomOtp(length: number): string {
        const characters = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return otp;
    }

    randomToken(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return token;
    }
}
