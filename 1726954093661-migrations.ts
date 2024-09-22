import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1726954093661 implements MigrationInterface {
    name = 'Migrations1726954093661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(200) NOT NULL, "password" character varying NOT NULL, "age" integer NOT NULL, "roles" text NOT NULL, "isAccountDisabled" boolean NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "username" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "sessionId" integer, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movieSessions" ("id" SERIAL NOT NULL, "roomNumber" integer NOT NULL, "date" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "movieId" integer, CONSTRAINT "PK_6256399806cc2d755cb4e097dc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "minAge" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_watched_movies_movie" ("usersId" integer NOT NULL, "movieId" integer NOT NULL, CONSTRAINT "PK_20b6a35cf7161178bf279c860ab" PRIMARY KEY ("usersId", "movieId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cfd1e9cd5b73a07f5dc4907792" ON "users_watched_movies_movie" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cbd87719fe699ab57e0472a8b2" ON "users_watched_movies_movie" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4bb45e096f521845765f657f5c8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_d175b024857bfa9676f6a06368f" FOREIGN KEY ("sessionId") REFERENCES "movieSessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movieSessions" ADD CONSTRAINT "FK_2b7a0cd8d2200a9f648d6f40d52" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_watched_movies_movie" ADD CONSTRAINT "FK_cfd1e9cd5b73a07f5dc49077924" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_watched_movies_movie" ADD CONSTRAINT "FK_cbd87719fe699ab57e0472a8b24" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_watched_movies_movie" DROP CONSTRAINT "FK_cbd87719fe699ab57e0472a8b24"`);
        await queryRunner.query(`ALTER TABLE "users_watched_movies_movie" DROP CONSTRAINT "FK_cfd1e9cd5b73a07f5dc49077924"`);
        await queryRunner.query(`ALTER TABLE "movieSessions" DROP CONSTRAINT "FK_2b7a0cd8d2200a9f648d6f40d52"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_d175b024857bfa9676f6a06368f"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4bb45e096f521845765f657f5c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cbd87719fe699ab57e0472a8b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfd1e9cd5b73a07f5dc4907792"`);
        await queryRunner.query(`DROP TABLE "users_watched_movies_movie"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "movieSessions"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
