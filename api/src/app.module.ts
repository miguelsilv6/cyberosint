import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CasesModule } from './cases/cases.module';
import { ArtifactsModule } from './artifacts/artifacts.module';
import { IngestModule } from './ingest/ingest.module';
import { NormalizeModule } from './normalize/normalize.module';
import { AuditModule } from './audit/audit.module';
import { StorageModule } from './storage/storage.module';
import { GraphModule } from './graph/graph.module';
import { EnrichModule } from './enrich/enrich.module';
import { ValidationModule } from './validation/validation.module';
import { ReportsModule } from './reports/reports.module';
import { JobsModule } from './jobs/jobs.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    StorageModule,
    AuditModule,
    AuthModule,
    CasesModule,
    ArtifactsModule,
    IngestModule,
    NormalizeModule,
    GraphModule,
    EnrichModule,
    ValidationModule,
    ReportsModule,
    JobsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
