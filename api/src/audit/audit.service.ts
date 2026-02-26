import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  private sha(input: string) {
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
    const last = await this.prisma.auditEvent.findFirst({
      where: { caseId: input.caseId },
      orderBy: { createdAt: 'desc' },
    });
    const metadataDigest = this.sha(JSON.stringify({
      eventType: input.eventType,
      actorId: input.actorId,
      payload: input.payload,
    }));
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
