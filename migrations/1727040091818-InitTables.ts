import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1727040091818 implements MigrationInterface {
    name = 'InitTables1727040091818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auditLog" ("id" SERIAL NOT NULL, "requestId" character varying NOT NULL, "userId" integer NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_34466746a1486ee722a21b63287" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exceptionLog" ("id" SERIAL NOT NULL, "requestId" character varying NOT NULL, "userId" integer NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_366b48c5c2186f2d62e2b07b660" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exceptionLog"`);
        await queryRunner.query(`DROP TABLE "auditLog"`);
    }

}
