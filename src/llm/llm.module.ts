import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { OpenAiModule } from '../providers/openai/openai.module';
import { ClaudeModule } from '../providers/claude/claude.module';
import { GeminiModule } from '../providers/gemini/gemini.module';
import { GrokModule } from '../providers/grok/grok.module';

@Module({
  imports: [OpenAiModule, ClaudeModule, GeminiModule, GrokModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
