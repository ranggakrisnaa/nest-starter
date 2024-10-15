import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
    constructor(private readonly prismaService: PrismaService) {}

    async onApplicationBootstrap() {
        await this.createCategory();
    }

    async createCategory() {
        const foundCategories = await this.prismaService.category.findMany();

        if (foundCategories.length === 0)
            await this.prismaService.category.createMany({
                data: [
                    { name: 'Elektronik' },
                    { name: 'Pakaian' },
                    { name: 'Peralatan Rumah Tangga' },
                    { name: 'Buku' },
                    { name: 'Makanan & Minuman' },
                    { name: 'Kesehatan & Kecantikan' },
                ],
            });
    }
}
