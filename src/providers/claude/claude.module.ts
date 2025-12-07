import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClaudeController } from './claude.controller';
import { ClaudeService } from './claude.service';
import { ClaudeHttpService } from './claude-http.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  controllers: [ClaudeController],
  providers: [ClaudeService, ClaudeHttpService],
  exports: [ClaudeService, ClaudeHttpService],
})
export class ClaudeModule {}
