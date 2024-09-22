import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1727032251468 implements MigrationInterface {
    name = 'InitTables1727032251468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" RENAME COLUMN "isActive" TO "isUsed"`);
        await queryRunner.query(`ALTER TABLE "tickets" ALTER COLUMN "isUsed" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ALTER COLUMN "isUsed" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "tickets" RENAME COLUMN "isUsed" TO "isActive"`);
    }

}
