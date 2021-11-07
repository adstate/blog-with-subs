import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostLikesColumn1629469671008 implements MigrationInterface {
  name = 'AddPostLikesColumn1629469671008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "likes" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "likes"`,
    );
  }
}
