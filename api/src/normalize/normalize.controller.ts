import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NormalizeService } from './normalize.service';

@UseGuards(JwtAuthGuard)
@Controller('artifacts/:artifactId/normalize')
export class NormalizeController {
  constructor(private service: NormalizeService) {}

  @Post()
  normalize(@Param('artifactId') artifactId: string, @Req() req: any) {
    return this.service.normalize(artifactId, req.user.userId);
  }
}
