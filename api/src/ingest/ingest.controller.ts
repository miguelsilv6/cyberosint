import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngestService } from './ingest.service';

@UseGuards(JwtAuthGuard)
@Controller('cases/:id/ingest')
export class IngestController {
  constructor(private ingestService: IngestService) {}

  @Post('url')
  ingestUrl(@Param('id') caseId: string, @Body() body: { url: string }, @Req() req: any) {
    return this.ingestService.ingestUrl(caseId, body.url, req.user.userId);
  }

  @Post('text')
  ingestText(@Param('id') caseId: string, @Body() body: { text: string; title?: string }, @Req() req: any) {
    return this.ingestService.ingestText(caseId, body.text, req.user.userId, body.title);
  }
}
