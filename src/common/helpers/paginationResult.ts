import {
  Repository,
  FindManyOptions,
  ObjectLiteral,
  Not,
  IsNull,
  SelectQueryBuilder,
} from 'typeorm';
import {
  IPaginationDto,
  IPaginationResponse,
  IPaginationResult,
} from '../interfaces';
import {} from 'typeorm';
export async function paginationResult<T extends ObjectLiteral>(
  repository: Repository<T>,
  pagination: IPaginationDto<T>,
): Promise<IPaginationResult<T>> {
  const { limit = 10, page = 1, all = false, options = {} } = pagination;
  const skip = page > 0 ? (page - 1) * limit : 0;

  const _options: FindManyOptions<T> = {
    ...options,
    order: { id: 'ASC' } as unknown as FindManyOptions<T>['order'],
  };

  if (!all) {
    _options.take = limit;
    _options.skip = skip;
  }

  const [data, totalResult] = await repository.findAndCount(_options);

  const totalPages = all ? 1 : Math.ceil(totalResult / limit);

  return {
    page: Number(all ? 1 : page),
    limit: Number(all ? totalResult : limit),
    totalResult,
    totalPages,
    data,
  };
}

export async function paginateQuery<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  page: number = 1,
  limit: number = 10,
): Promise<IPaginationResponse<T>> {
  const skip = (page - 1) * limit;

  const countQuery = query.clone();
  const total = (await countQuery.getRawMany()).length;

  const data = await query.limit(limit).offset(skip).getRawMany();

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function paginationArray(
  query: any[],
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const total = query.length;

  const data = query.slice(skip, skip + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
