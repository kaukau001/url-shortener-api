import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export function validateQuery<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(dtoClass, req.query, {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      });
      const errors = await validate(dto);
      if (errors.length > 0) {
        const errorMessages = errors
          .map(error => {
            const constraints = error.constraints;
            return constraints ? Object.values(constraints) : ['Erro de validação'];
          })
          .flat();

        return res.status(400).json({
          message: 'Parâmetros de consulta inválidos',
          errors: errorMessages,
        });
      }
      const cleanedDto = Object.keys(dto).reduce((acc, key) => {
        const value = (dto as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          (acc as any)[key] = value;
        }
        return acc;
      }, {} as T);
      req.query = cleanedDto as any;
      next();
    } catch (error: any) {
      return res.status(400).json({
        message: 'Erro na validação dos parâmetros',
        error: error.message,
      });
    }
  };
}
