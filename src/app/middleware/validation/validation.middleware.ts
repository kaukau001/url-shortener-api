import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function validationMiddleware<T extends object>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(type, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors
          .map(error => {
            return Object.values(error.constraints || {}).join(', ');
          })
          .join('; ');

        return res.status(400).json({
          message: 'Dados inválidos',
          errors: errorMessages,
        });
      }
      req.body = dto;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}

export function paramsValidationMiddleware<T extends object>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(type, req.params);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors
          .map(error => {
            return Object.values(error.constraints || {}).join(', ');
          })
          .join('; ');

        return res.status(400).json({
          message: 'Parâmetros inválidos',
          errors: errorMessages,
        });
      }
      req.params = dto as any;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}
