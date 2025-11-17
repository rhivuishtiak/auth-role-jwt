import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokens1763386857223 implements MigrationInterface {
  name = 'AddRefreshTokens1763386857223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // create refresh_tokens with userId as UUID (matches users.id from InitAuthSchema)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "revokedAt" TIMESTAMPTZ,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_tokens_token" UNIQUE ("token"),
        CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // If your first migration already added users.isActive, skip; otherwise ensure it exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='users' AND column_name='isActive'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "isActive" boolean NOT NULL DEFAULT true;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
  }
}
