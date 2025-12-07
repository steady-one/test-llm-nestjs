import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmConfigModule } from './config/config.module';
import { LlmModule } from './llm/llm.module';
import { OpenAiModule } from './providers/openai/openai.module';
import { ClaudeModule } from './providers/claude/claude.module';
import { GeminiModule } from './providers/gemini/gemini.module';
import { GrokModule } from './providers/grok/grok.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LlmConfigModule,
    LlmModule,
    OpenAiModule,
    ClaudeModule,
    GeminiModule,
    GrokModule,
    HealthModule,
  ],
})
export class AppModule {}
