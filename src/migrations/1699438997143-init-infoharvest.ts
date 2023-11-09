import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * v1_1__init.
 *
 * @author dafengzhen
 */
export class InitInfoharvest1699438997143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = fs.readFileSync(
      path.join(__dirname, '../resource/ddl/v1_1__init.sql'),
      {
        encoding: 'utf8',
      },
    );

    await queryRunner.query(query);
  }

  public async down(): Promise<void> {
    console.log(
      'There is nothing to restore, if necessary consider deleting the database and starting over',
    );
  }
}
