import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1727011786385 implements MigrationInterface {
    name = 'InitTables1727011786385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movieSessions" DROP CONSTRAINT "FK_2b7a0cd8d2200a9f648d6f40d52"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4bb45e096f521845765f657f5c8"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_d175b024857bfa9676f6a06368f"`);
        await queryRunner.query(`ALTER TABLE "movieSessions" ADD CONSTRAINT "FK_2b7a0cd8d2200a9f648d6f40d52" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4bb45e096f521845765f657f5c8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_d175b024857bfa9676f6a06368f" FOREIGN KEY ("sessionId") REFERENCES "movieSessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_d175b024857bfa9676f6a06368f"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4bb45e096f521845765f657f5c8"`);
        await queryRunner.query(`ALTER TABLE "movieSessions" DROP CONSTRAINT "FK_2b7a0cd8d2200a9f648d6f40d52"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_d175b024857bfa9676f6a06368f" FOREIGN KEY ("sessionId") REFERENCES "movieSessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4bb45e096f521845765f657f5c8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movieSessions" ADD CONSTRAINT "FK_2b7a0cd8d2200a9f648d6f40d52" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
