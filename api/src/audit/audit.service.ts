import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  private sha(input: string) {
    // Hash SHA-256 usado para integridade e encadeamento.
    return createHash('sha256').update(input).digest('hex');
  }

  async append(input: {
    caseId: string;
    artifactId?: string;
    eventType: string;
    actorId: string;
    payload: unknown;
    currentHash: string;
  }) {
    // Obtém o último evento do mesmo caso para manter segregação por case_id.
    const last = await this.prisma.auditEvent.findFirst({
      where: { caseId: input.caseId },
      orderBy: { createdAt: 'desc' },
    });
    // Digest dos metadados do evento atual para compor cadeia forense.
    const metadataDigest = this.sha(JSON.stringify({
      eventType: input.eventType,
      actorId: input.actorId,
      payload: input.payload,
    }));
    // Fórmula: chained_hash = sha256(prev + current_hash + metadata_digest).
    const chainedHash = this.sha(`${last?.chainedHash || ''}${input.currentHash}${metadataDigest}`);
    return this.prisma.auditEvent.create({
      data: {
        caseId: input.caseId,
        artifactId: input.artifactId,
        eventType: input.eventType,
        actorId: input.actorId,
        payload: input.payload as any,
        currentHash: input.currentHash,
        prevChainedHash: last?.chainedHash,
        chainedHash,
      },
    });
  }
}
