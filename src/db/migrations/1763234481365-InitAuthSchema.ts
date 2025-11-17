import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuthSchema1763234481365 implements MigrationInterface {
    name = 'InitAuthSchema1763234481365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_23ed6f04fe43066df08379fd034"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_b23c65e50a758245a33ee35fda1" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("role_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_23ed6f04fe43066df08379fd034"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_87b8888186ca9769c960e926870" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_23ed6f04fe43066df08379fd034"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_87b8888186ca9769c960e926870" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "role_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("role_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_23ed6f04fe43066df08379fd034"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_b23c65e50a758245a33ee35fda1" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
