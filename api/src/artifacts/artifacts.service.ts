import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtifactsService {
  constructor(private prisma: PrismaService) {}

  listByCase(caseId: string) {
    return this.prisma.artifact.findMany({ where: { caseId }, orderBy: { collectedAt: 'desc' } });
  }

  async getById(artifactId: string) {
    const artifact = await this.prisma.artifact.findUnique({ where: { id: artifactId } });
    if (!artifact) throw new NotFoundException('Artifact not found');
    return artifact;
  }
}
