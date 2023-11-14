import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * UpdateCascadingForeignKeyInfoharvest1699932891474.
 *
 * @author dafengzhen
 */
export class UpdateCascadingForeignKeyInfoharvest1699932891474
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`excerpt_name\` DROP FOREIGN KEY \`FK_6c9d212d39f76c76c1c815fcea9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_link\` DROP FOREIGN KEY \`FK_108075acb69d8351575a0fea05c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_state\` DROP FOREIGN KEY \`FK_9fc4d7a39435ab2b05845e5b3e4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` DROP FOREIGN KEY \`FK_7bc2557baf1af9a24978c79c552\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` DROP FOREIGN KEY \`FK_894c4acac070863783d48b46201\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_ea92daa642af67e2a924a5547d5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_ff4c964ae802a459b52e47e5ac1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_4f925485b013b52e32f43d430f6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_name\` ADD CONSTRAINT \`FK_6c9d212d39f76c76c1c815fcea9\` FOREIGN KEY (\`excerpt_id\`) REFERENCES \`excerpt\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_link\` ADD CONSTRAINT \`FK_108075acb69d8351575a0fea05c\` FOREIGN KEY (\`excerpt_id\`) REFERENCES \`excerpt\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_state\` ADD CONSTRAINT \`FK_9fc4d7a39435ab2b05845e5b3e4\` FOREIGN KEY (\`excerpt_id\`) REFERENCES \`excerpt\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` ADD CONSTRAINT \`FK_7bc2557baf1af9a24978c79c552\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` ADD CONSTRAINT \`FK_894c4acac070863783d48b46201\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collection\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` ADD CONSTRAINT \`FK_ea92daa642af67e2a924a5547d5\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` ADD CONSTRAINT \`FK_ff4c964ae802a459b52e47e5ac1\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collection\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_4f925485b013b52e32f43d430f6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collection\` DROP FOREIGN KEY \`FK_4f925485b013b52e32f43d430f6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_ff4c964ae802a459b52e47e5ac1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_ea92daa642af67e2a924a5547d5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` DROP FOREIGN KEY \`FK_894c4acac070863783d48b46201\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` DROP FOREIGN KEY \`FK_7bc2557baf1af9a24978c79c552\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_state\` DROP FOREIGN KEY \`FK_9fc4d7a39435ab2b05845e5b3e4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_link\` DROP FOREIGN KEY \`FK_108075acb69d8351575a0fea05c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_name\` DROP FOREIGN KEY \`FK_6c9d212d39f76c76c1c815fcea9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD CONSTRAINT \`FK_4f925485b013b52e32f43d430f6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` ADD CONSTRAINT \`FK_ff4c964ae802a459b52e47e5ac1\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collection\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`history\` ADD CONSTRAINT \`FK_ea92daa642af67e2a924a5547d5\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` ADD CONSTRAINT \`FK_894c4acac070863783d48b46201\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collection\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt\` ADD CONSTRAINT \`FK_7bc2557baf1af9a24978c79c552\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_state\` ADD CONSTRAINT \`FK_9fc4d7a39435ab2b05845e5b3e4\` FOREIGN KEY (\`excerpt_id\`) REFERENCES \`excerpt\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_link\` ADD CONSTRAINT \`FK_108075acb69d8351575a0fea05c\` FOREIGN KEY (\`excerpt_id\`) REFERENCES \`excerpt\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`excerpt_name\` ADD CONSTRAINT \`FK_6c9d212d39f76c76c1c815fcea9\` FOREIGN KEY (\`excerpt_id\`) REFERENCES \`excerpt\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
