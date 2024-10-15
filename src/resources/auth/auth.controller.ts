import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('v1/auth')

export class AuthController {
    constructor(private readonly authService: AuthService) { }
}
