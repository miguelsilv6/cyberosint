import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Evita incompatibilidades de tipagem do Prisma Client no evento beforeExit.
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
