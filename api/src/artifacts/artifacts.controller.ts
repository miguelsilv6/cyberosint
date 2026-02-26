import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArtifactsService } from './artifacts.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class ArtifactsController {
  constructor(private artifactsService: ArtifactsService) {}

  @Get('cases/:id/artifacts')
  list(@Param('id') id: string) {
    return this.artifactsService.listByCase(id);
  }

  @Get('artifacts/:artifactId')
  get(@Param('artifactId') artifactId: string) {
    return this.artifactsService.getById(artifactId);
  }
}
