import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Get()
  list() {
    return this.casesService.list();
  }

  @Post()
  create(@Body() body: { name: string; description?: string }, @Req() req: any) {
    return this.casesService.create({ ...body, createdById: req.user.userId });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.casesService.get(id);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() body: { name?: string; description?: string }) {
    return this.casesService.patch(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
