import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalReviewController } from './clinical-review.controller';
import { ClinicalReviewService } from './clinical-review.service';

describe('ClinicalReviewController', () => {
  let controller: ClinicalReviewController;
  let clinicalReviewService: DeepMocked<ClinicalReviewService>;

  beforeEach(async () => {
    clinicalReviewService = createMock<ClinicalReviewService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalReviewController],
      providers: [
        {
          provide: ClinicalReviewService,
          useValue: clinicalReviewService,
        },
      ],
    }).compile();

    controller = module.get<ClinicalReviewController>(ClinicalReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getClinicalReviews', () => {
    it('passes the default pageNumber and pageSize to service', async () => {
      await controller.getClinicalReviews(['admin']);

      expect(clinicalReviewService.getClinicalReviews).toHaveBeenCalledWith(
        1,
        10,
        ['admin'],
      );
    });

    it.each([
      [0, 10],
      [-1, 10],
      [1, 0],
      [1, -1],
      [0, 0],
    ])(
      'throws exception when query params are invalid: pageNumber = %s, pageSize = %d',
      async (pageNumber, pageSize) => {
        const action = async () =>
          await controller.getClinicalReviews(['admin'], pageNumber, pageSize);

        await expect(action).rejects.toThrow(BadRequestException);
      },
    );

    it('throws exception when no roles are found', async () => {
      const action = async () =>
        await controller.getClinicalReviews(null, 2, 10);

      await expect(action).rejects.toThrow(BadRequestException);
    });

    it('passes the pageNumber and pageSize to service', async () => {
      await controller.getClinicalReviews(['admin'], 2, 10);

      expect(clinicalReviewService.getClinicalReviews).toHaveBeenCalledWith(
        2,
        10,
        ['admin'],
      );
    });
  });
});