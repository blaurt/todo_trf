import { MigrationInterface, QueryRunner } from 'typeorm';

export class Add_Users_table_1729522566867 implements MigrationInterface {
  name = 'Add_Users_table_1729522566867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "email" character varying NOT NULL, 
        "firstName" character varying NOT NULL, 
        "lastName" character varying NOT NULL, 
        "passwordHash" character varying NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP DEFAULT now(), 
        "deletedAt" TIMESTAMP, 
        "status" character varying NOT NULL, 
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
