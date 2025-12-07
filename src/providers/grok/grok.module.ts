import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GrokController } from './grok.controller';
import { GrokService } from './grok.service';
import { GrokHttpService } from './grok-http.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  controllers: [GrokController],
  providers: [GrokService, GrokHttpService],
  exports: [GrokService, GrokHttpService],
})
export class GrokModule {}
