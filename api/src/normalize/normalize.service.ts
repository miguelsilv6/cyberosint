import { Injectable } from '@nestjs/common';
import { htmlToText } from 'html-to-text';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class NormalizeService {
  constructor(private prisma: PrismaService, private storage: StorageService, private audit: AuditService) {}

  // Hash do conteúdo normalizado para prova de integridade.
  private sha(data: string) {
    return createHash('sha256').update(data).digest('hex');
  }

  // Normaliza artefacto (HTML -> texto), persiste e audita transformação.
  async normalize(artifactId: string, actorId: string) {
    const artifact = await this.prisma.artifact.findUniqueOrThrow({ where: { id: artifactId } });
    const raw = await this.storage.getObjectAsString(process.env.S3_BUCKET_EVIDENCE!, artifact.rawObjectKey);
    const normalized = artifact.sourceType === 'url' ? htmlToText(raw, { wordwrap: 130 }) : raw;
    const key = `${artifact.caseId}/${process.env.S3_PREFIX_NORMALIZED || 'normalized'}/${artifact.id}.txt`;
    await this.storage.putObject(process.env.S3_BUCKET_EVIDENCE!, key, normalized, 'text/plain');
    const hash = this.sha(normalized);

    const updated = await this.prisma.artifact.update({
      where: { id: artifactId },
      data: { normalizedObjectKey: key, normalizedSha256: hash, status: 'NORMALIZED' },
    });

    await this.audit.append({
      caseId: artifact.caseId,
      artifactId: artifact.id,
      eventType: 'normalize.completed',
      actorId,
      payload: { from: artifact.rawObjectKey, to: key },
      currentHash: hash,
    });

    return updated;
  }
}
