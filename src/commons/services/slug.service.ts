import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
    constructor() {}

    slugify(text: string): string {
        return text
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    }

    slugifyObject(data: { [key: string]: any }, keysToSlugify: string[]): { [key: string]: any } {
        const result = { ...data };

        keysToSlugify.forEach((key) => {
            if (result[key]) {
                result[key] = this.slugify(result[key]);
            }
        });

        return result;
    }
}
