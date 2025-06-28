import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsUUID,
  Min,
  Max,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UrlStatusEnum } from '../../repository/url/url-status.enum';

function IsEndDateValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEndDateValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as ListUrlsQueryDto;

          if (value && !dto.startDate) {
            return false;
          }

          if (value && dto.startDate) {
            const startDate = new Date(dto.startDate);
            const endDate = new Date(value);
            return endDate >= startDate;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const dto = args.object as ListUrlsQueryDto;
          if (args.value && !dto.startDate) {
            return 'EndDate só pode ser passado junto com startDate';
          }
          if (args.value && dto.startDate) {
            const startDate = new Date(dto.startDate);
            const endDate = new Date(args.value);
            if (endDate < startDate) {
              return 'EndDate não pode ser menor que startDate';
            }
          }
          return 'EndDate inválido';
        },
      },
    });
  };
}

export class ListUrlsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page deve ser um número inteiro válido' })
  @Min(1, { message: 'Page deve ser maior que 0' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit deve ser um número inteiro válido' })
  @Min(1, { message: 'Limit deve ser maior que 0' })
  @Max(100, { message: 'Limit deve ser menor ou igual a 100' })
  limit?: number;

  @IsOptional()
  @IsEnum(UrlStatusEnum, { message: 'Status deve ser ACTIVE ou DELETED' })
  status?: UrlStatusEnum;

  @IsOptional()
  @IsString({ message: 'Code deve ser uma string válida' })
  code?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID deve ser um UUID válido' })
  id?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'StartDate deve estar no formato ISO 8601 (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)' }
  )
  startDate?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'EndDate deve estar no formato ISO 8601 (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)' }
  )
  @IsEndDateValid()
  endDate?: string;
}
