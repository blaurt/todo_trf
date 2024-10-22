import { MigrationInterface, QueryRunner } from 'typeorm';

export class Add_todolist_tables_1729603001793 implements MigrationInterface {
  name = 'Add_todolist_tables_1729603001793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "todo_lists" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "title" character varying NOT NULL, 
            "isPublic" boolean NOT NULL, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "deletedAt" TIMESTAMP, 
            "userId" uuid, 
            CONSTRAINT "PK_1a5448d48035763b9dbab86555b" PRIMARY KEY ("id")
        )`);
    await queryRunner.query(
      `CREATE TABLE "tasks" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "title" character varying NOT NULL, 
            "description" character varying, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "completedAt" TIMESTAMP, "deletedAt" TIMESTAMP, 
            "todoListId" uuid, 
            CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_lists" ADD CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_ed2187c496930a6950777fd8f6d" FOREIGN KEY ("todoListId") REFERENCES "todo_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_ed2187c496930a6950777fd8f6d"`);
    await queryRunner.query(`ALTER TABLE "todo_lists" DROP CONSTRAINT "FK_0ccba8168dcb33ca73fd63e0c73"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "todo_lists"`);
  }
}
