import { Module } from '@nestjs/common';
import { NormalizeService } from './normalize.service';
import { NormalizeController } from './normalize.controller';

@Module({ providers: [NormalizeService], controllers: [NormalizeController] })
export class NormalizeModule {}
