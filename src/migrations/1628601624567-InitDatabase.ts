import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1628601624567 implements MigrationInterface {
  name = 'InitDatabase1628601624567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "publishers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "avatar" character varying NOT NULL, "subscribersCount" integer NOT NULL DEFAULT '0', "sponsorsCount" integer NOT NULL DEFAULT '0', "created" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_2061c985cc2681bd0a1efc86d6" UNIQUE ("userId"), CONSTRAINT "PK_9d73f23749dca512efc3ccbea6a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "likes" integer NOT NULL DEFAULT '0', "dislikes" integer NOT NULL DEFAULT '0', "created" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, "userId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "likes" integer NOT NULL DEFAULT '0', "previewContent" character varying NOT NULL, "content" character varying NOT NULL, "mediaType" character varying NOT NULL, "mediaUrl" character varying NOT NULL, "isForSponsors" boolean, "created" TIMESTAMP NOT NULL DEFAULT now(), "publisherId" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "profileId" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "avatar" character varying NOT NULL, "accessToken" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b1bda35cdb9a2c1b777f5541d87" UNIQUE ("profileId"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donates" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "currentSum" integer NOT NULL DEFAULT '0', "targetSum" integer NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "publisherId" integer, CONSTRAINT "PK_57600cb0d8b826cdee36328d420" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donate_history" ("id" SERIAL NOT NULL, "sum" integer NOT NULL, "comment" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "donateId" integer, "userId" integer, CONSTRAINT "PK_ff20eaf90b0fcf9315652f97eec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sponsorships" ("id" SERIAL NOT NULL, "title" character varying, "preview" character varying NOT NULL, "description" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "publisherId" integer, CONSTRAINT "PK_393571b62d6dd0f63c6d3eb154b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sponsorship_levels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "features" text, "price" integer NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "sponsorshipId" integer, CONSTRAINT "PK_29b8488011f19d5f6086ebe6259" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "publisherId" integer, "userId" integer, "sponsorshipLevelId" integer, CONSTRAINT "UQ_PUBLISHER_SUBSCRIBER" UNIQUE ("publisherId", "userId", "sponsorshipLevelId"), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "FK_2061c985cc2681bd0a1efc86d61" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_b6e9936dde403ddf87687f1b941" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donates" ADD CONSTRAINT "FK_73d24092c955023041b887d36e1" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate_history" ADD CONSTRAINT "FK_33005305450ad8c67b3e3e7f0f1" FOREIGN KEY ("donateId") REFERENCES "donates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate_history" ADD CONSTRAINT "FK_8dc36e5af9544f1508c8ae5db5f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sponsorships" ADD CONSTRAINT "FK_946dea1905dfa21921d0304ed47" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sponsorship_levels" ADD CONSTRAINT "FK_b9de08ae9b3b3dac7fc8ba26396" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_e55a319db21153a60970eb4b4e1" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_2e9fee596eff836b4662eff2f03" FOREIGN KEY ("sponsorshipLevelId") REFERENCES "sponsorship_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_2e9fee596eff836b4662eff2f03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_e55a319db21153a60970eb4b4e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sponsorship_levels" DROP CONSTRAINT "FK_b9de08ae9b3b3dac7fc8ba26396"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sponsorships" DROP CONSTRAINT "FK_946dea1905dfa21921d0304ed47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate_history" DROP CONSTRAINT "FK_8dc36e5af9544f1508c8ae5db5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate_history" DROP CONSTRAINT "FK_33005305450ad8c67b3e3e7f0f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donates" DROP CONSTRAINT "FK_73d24092c955023041b887d36e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_b6e9936dde403ddf87687f1b941"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "FK_2061c985cc2681bd0a1efc86d61"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "sponsorship_levels"`);
    await queryRunner.query(`DROP TABLE "sponsorships"`);
    await queryRunner.query(`DROP TABLE "donate_history"`);
    await queryRunner.query(`DROP TABLE "donates"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "publishers"`);
  }
}
