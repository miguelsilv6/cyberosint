import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  // Lista casos por ordem temporal (mais recentes primeiro).
  list() {
    return this.prisma.case.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // Cria um caso segregado por identificador único.
  create(data: { name: string; description?: string; createdById: string }) {
    return this.prisma.case.create({ data });
  }

  async get(id: string) {
    const c = await this.prisma.case.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Case not found');
    return c;
  }

  async patch(id: string, data: { name?: string; description?: string }) {
    await this.get(id);
    return this.prisma.case.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.case.delete({ where: { id } });
    return { ok: true };
  }
}
