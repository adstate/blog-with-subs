import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostIsForSponsorsField1629541765553
  implements MigrationInterface
{
  name = 'AddPostIsForSponsorsField1629541765553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "isForSponsors" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "isForSponsors"`,
    );
  }
}
