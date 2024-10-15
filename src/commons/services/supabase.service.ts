import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseService {
    private readonly supabase: SupabaseClient;
    private supabaseUrl: string;
    private bucketName: string;
    private baseUrl: string;
    private supabaseKey: string;

    constructor(private readonly configService: ConfigService) {
        this.supabaseUrl = this.configService.get('SUPABASE_URL');
        this.supabaseKey = this.configService.get('SUPABASE_KEY');
        this.baseUrl = this.configService.get('BASE_URL_SUPABASE');
        this.bucketName = 'images';
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }

    async uploadImage(file: Express.Multer.File): Promise<String> {
        const filePath = `${uuidv4()}-${file.originalname}`;

        const { data, error } = await this.getClient().storage.from(this.bucketName).upload(filePath, file.buffer);

        if (error) throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);

        return `${this.baseUrl}${data.path}`;
    }

    async updateImage(file: Express.Multer.File, oldFilePath: string): Promise<String> {
        const newFilePath = `${uuidv4()}-${file.originalname}`;

        const { error: removeError } = await this.getClient().storage.from(this.bucketName).remove([oldFilePath]);
        if (removeError && removeError.message !== 'The resource was not found')
            throw new HttpException(removeError.message, HttpStatus.INTERNAL_SERVER_ERROR);

        const { data: uploadData, error: uploadError } = await this.getClient()
            .storage.from(this.bucketName)
            .upload(newFilePath, file.buffer, {
                contentType: file.mimetype,
            });

        if (uploadError) throw new HttpException(uploadError.message, HttpStatus.INTERNAL_SERVER_ERROR);

        return `${this.baseUrl}${uploadData.path}`;
    }
}
