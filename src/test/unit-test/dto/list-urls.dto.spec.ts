import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ListUrlsQueryDto } from '../../../app/dto/url/list-urls.dto';

describe('ListUrlsQueryDto', () => {
  describe('endDate validation', () => {
    it('should fail when endDate is provided without startDate', async () => {
      const dto = plainToClass(ListUrlsQueryDto, {
        endDate: '2024-01-02',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('endDate');
      expect(errors[0].constraints?.isEndDateValid).toBe(
        'EndDate só pode ser passado junto com startDate'
      );
    });

    it('should fail when endDate is before startDate', async () => {
      const dto = plainToClass(ListUrlsQueryDto, {
        startDate: '2024-01-02',
        endDate: '2024-01-01',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('endDate');
      expect(errors[0].constraints?.isEndDateValid).toBe(
        'EndDate não pode ser menor que startDate'
      );
    });

    it('should pass when endDate is same as startDate', async () => {
      const dto = plainToClass(ListUrlsQueryDto, {
        startDate: '2024-01-01',
        endDate: '2024-01-01',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass when endDate is after startDate', async () => {
      const dto = plainToClass(ListUrlsQueryDto, {
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass when neither startDate nor endDate are provided', async () => {
      const dto = plainToClass(ListUrlsQueryDto, {
        page: 1,
        limit: 10,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass when only startDate is provided', async () => {
      const dto = plainToClass(ListUrlsQueryDto, {
        startDate: '2024-01-01',
        page: 1,
        limit: 10,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
