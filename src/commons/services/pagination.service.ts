import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IPaginationParams } from '../interfaces/pagination-params';
import { PaginateOptions } from '../interfaces/services/pagination/paginate-option';
import { PaginationVm } from '../interfaces/pagination-vm';

@Injectable()
export class PaginationService {
    constructor(private prisma: PrismaService) {}

    async paginate(options: PaginateOptions): Promise<PaginationVm> {
        let { params, where, include, searchables, select, orderBy, model } = options;

        const DEFAULT_LIMIT = 10;
        const DEFAULT_PAGE = 1;

        const limit = params?.limit || DEFAULT_LIMIT;
        const page = params?.page || DEFAULT_PAGE;

        if (params?.is_deleted_too !== undefined && where.deleted_at && params?.is_deleted_too) {
            delete where.deleted_at;
        }

        if (params?.is_deleted_only !== undefined && params?.is_deleted_only) {
            where = {
                ...where,
                deleted_at: {
                    not: null,
                },
            };
        }

        if (params?.order) {
            const generateOrderBy = this.generateOrderBy(params);
            orderBy = [...orderBy, ...generateOrderBy];
        }

        if (params?.search && searchables) {
            where = this.generateSearchQuery(params?.search, searchables, where);
        }

        const skip = params?.load_previous_pages ? 0 : (page - 1) * limit;

        const take = params?.load_previous_pages ? page * limit : limit;

        if (params?.all) {
            const data = await this.prisma[model].findMany({
                where,
                include,
                orderBy,
            });

            const result = {
                currentPage: 1,
                previousPage: null,
                nextPage: null,
                count: data.length,
                totalCount: data.length,
                totalPages: 1,
                result: data,
            };

            return result;
        }

        Logger.log(`
      Pagination service:
      model: ${model},
      where: ${JSON.stringify(where)},
      include: ${JSON.stringify(include)},
      orderBy: ${JSON.stringify(orderBy)},
      page: ${params?.page},
      Select: ${JSON.stringify(select)},
      limit: ${limit},
      skip: ${skip},
      take: ${take},
    `);

        const data = await this.prisma[model].findMany({
            where,
            include,
            orderBy,
            skip,
            select: !include ? select : undefined,
            take,
        });

        const totalCount = await this.prisma[model].count({ where });

        const result: PaginationVm = {
            currentPage: params?.page,
            previousPage: page > 1 ? page - 1 : null,
            nextPage: skip + data.length < totalCount ? page + 1 : null,
            count: data.length,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            result: data,
        };

        return result;
    }

    generateOrderBy(params: IPaginationParams): any[] {
        let orderBy: any[] = [];

        const order = params.order.split(',');
        orderBy = order.map((item) => {
            const [key, value] = item.split(':');
            const keys = key.split('.');
            if (keys.length === 1) {
                return { [keys[0]]: value };
            } else {
                let nestedObject = {};
                let currentLevel = nestedObject;
                keys.forEach((k, index) => {
                    if (index === keys.length - 1) {
                        currentLevel[k] = value;
                    } else {
                        currentLevel[k] = {};
                        currentLevel = currentLevel[k];
                    }
                });
                return nestedObject;
            }
        });

        return orderBy;
    }

    createNestedSearchObject(path: string[], value: string): any {
        if (path.length === 1) {
            return {
                [path[0]]: {
                    contains: value,
                    mode: 'insensitive',
                },
            };
        }
        const key = path.shift();
        return {
            [key]: this.createNestedSearchObject(path, value),
        };
    }

    mergeORWhereClauses(initialWhere: any, anotherWhere: any): any {
        if (!initialWhere || Object.keys(anotherWhere).length === 0) {
            return initialWhere;
        }

        if (!initialWhere.OR) {
            return {
                ...initialWhere,
                OR: anotherWhere.OR,
            };
        }

        return {
            ...initialWhere,
            OR: [...initialWhere.OR, ...anotherWhere.OR],
        };
    }

    generateSearchQuery(search: string, searchables: string[], currentWhere: any): any {
        Logger.log(`Searching for ${search} in ${searchables.join(', ')}`);
        const searchConditions = searchables.map((searchable) => {
            const path = searchable.split('.');
            return this.createNestedSearchObject(path, search);
        });

        const searchWhereClause = { OR: searchConditions };

        Logger.log(`Search where clause: ${JSON.stringify(searchWhereClause)}`);
        return this.mergeORWhereClauses(currentWhere, searchWhereClause);
    }
}
