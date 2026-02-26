import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class IngestService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private audit: AuditService,
  ) {}

  // Gera hash SHA-256 do conteúdo bruto/normalizado.
  private sha(data: string) {
    return createHash('sha256').update(data).digest('hex');
  }

  // Restringe protocolos permitidos para reduzir risco em conectores.
  private validateProtocol(url: string) {
    const allowed = (process.env.INGEST_ALLOWED_PROTOCOLS || 'http,https').split(',');
    const p = new URL(url).protocol.replace(':', '');
    if (!allowed.includes(p)) throw new BadRequestException('Protocol not allowed');
  }

  // Ingestão de URL: recolhe HTML, guarda raw no MinIO e regista trilha de auditoria.
  async ingestUrl(caseId: string, url: string, operatorId: string) {
    this.validateProtocol(url);
    const startedAt = new Date();
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(Number(process.env.INGEST_FETCH_TIMEOUT_MS || 15000)),
    });
    const html = await response.text();
    const artifactId = randomUUID();
    const key = `${caseId}/${process.env.S3_PREFIX_RAW || 'raw'}/${artifactId}.html`;
    await this.storage.putObject(process.env.S3_BUCKET_EVIDENCE!, key, html, 'text/html');
    const hash = this.sha(html);

    const artifact = await this.prisma.artifact.create({
      data: {
        id: artifactId,
        caseId,
        sourceType: 'url',
        sourceUri: url,
        connector: 'url-fetch',
        rawObjectKey: key,
        rawSha256: hash,
        operatorId,
      },
    });
    await this.prisma.collectionRun.create({
      data: {
        caseId,
        artifactId,
        connector: 'url-fetch',
        parameters: { url },
        startedAt,
        endedAt: new Date(),
        operatorId,
      },
    });
    await this.audit.append({ caseId, artifactId, eventType: 'ingest.url', actorId: operatorId, payload: { url }, currentHash: hash });
    return artifact;
  }

  // Ingestão manual de texto, preservando proveniência e hash do raw.
  async ingestText(caseId: string, text: string, operatorId: string, title?: string) {
    const artifactId = randomUUID();
    const key = `${caseId}/${process.env.S3_PREFIX_RAW || 'raw'}/${artifactId}.txt`;
    await this.storage.putObject(process.env.S3_BUCKET_EVIDENCE!, key, text, 'text/plain');
    const hash = this.sha(text);
    const artifact = await this.prisma.artifact.create({
      data: {
        id: artifactId,
        caseId,
        sourceType: 'text',
        sourceUri: 'manual:text',
        connector: 'text-import',
        title,
        rawObjectKey: key,
        rawSha256: hash,
        operatorId,
      },
    });
    await this.audit.append({ caseId, artifactId, eventType: 'ingest.text', actorId: operatorId, payload: { title }, currentHash: hash });
    return artifact;
  }
}
