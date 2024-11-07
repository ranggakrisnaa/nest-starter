import { MigrationInterface, QueryRunner } from "typeorm";

export class MyNewMigration1731001649846 implements MigrationInterface {
    name = 'MyNewMigration1731001649846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sampletable1" (
                "id" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL,
                "content" text,
                "tags" text NOT NULL,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4685a69ad019990e4071c5d5af7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "sampletable2" (
                "id" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL,
                "content" text,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_92c54d7a473051b2527b1656084" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "sampletable2"
        `);
        await queryRunner.query(`
            DROP TABLE "sampletable1"
        `);
    }

}
