import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { BaseCRUDService } from './base-crud.service';
import { PrismaService } from './prisma.service';

@Injectable()
export class NodeMailerService {
    private readonly transporter: Mail;
    private readonly otpResendInterval: number;
    private readonly otpTryDailyLimit: number;
    private readonly otpExpiredAt: number;

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: +this.configService.get('MAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
        this.otpResendInterval = +configService.get('OTP_RESEND_INTERVAL') || 3;
        this.otpTryDailyLimit = +configService.get('OTP_TRY_DAYLY_LIMIT');
        this.otpExpiredAt = +configService.get('OTP_EXPIRED_AT');
    }

    async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const from = this.configService.get('MAIL_FROM');
        const mailOptions = {
            from,
            to,
            subject,
            text,
            html,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendOtpEmail(to: string, otp: number, userName: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get('MAIL_FROM'),
            to,
            subject: 'Your OTP Code',
            text: null,
            html: this.getOtpHtmlTemplate(otp, userName),
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new HttpException('Failed to send OTP, please try again later.', HttpStatus.FORBIDDEN);
        }
    }

    private getOtpHtmlTemplate(otp: number, userName: string): string {
        return `
        <p>Hi <strong>${userName}</strong>,</p>

        <p>Your OTP code is: <strong>${otp}</strong>.</p>

        <p>Please enter this code to complete your verification. This code is valid for the next 5 minutes.</p>

        <p>If you did not request this, please ignore this email.</p>

        <p>Best regards,<br>Rangga Krisna</p>
        `;
    }

    async limitAndThrottleOtp(email: string): Promise<boolean> {
        const foundUser = await this.prismaService.user.findFirst({ where: { email } });

        if (!foundUser) throw new HttpException('User account is not found.', HttpStatus.NOT_FOUND);

        const now = new Date();
        const lastOtpSentAt = foundUser.otpReceivedAt ? new Date(foundUser.otpReceivedAt) : null;

        if (
            !lastOtpSentAt ||
            lastOtpSentAt.getDate() < now.getDate() ||
            lastOtpSentAt.getMonth() < now.getMonth() ||
            lastOtpSentAt.getFullYear() < now.getFullYear()
        ) {
            await this.prismaService.user.update({
                where: { id: foundUser.id },
                data: {
                    otpTryDaily: 0,
                },
            });
        }

        const canResendOtp = (new Date().getTime() - lastOtpSentAt?.getTime()) / 60000 < this.otpResendInterval;

        if (!canResendOtp) {
            throw new HttpException(
                `OTP has been sent, please try again in ${this.otpResendInterval} minutes.`,
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        const limitSendOtp = foundUser.otpTryDaily >= this.otpTryDailyLimit;

        if (limitSendOtp) {
            throw new HttpException(
                'Limit send OTP daily is reached. Please try again tomorrow.',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        return false;
    }
}
