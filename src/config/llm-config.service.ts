import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmProvider } from '../common/enums/llm-provider.enum';
import { LlmConfig } from '../common/interfaces/llm-provider.interface';

@Injectable()
export class LlmConfigService {
  private readonly configs: Record<LlmProvider, LlmConfig>;

  constructor(private configService: ConfigService) {
    this.configs = {
      [LlmProvider.OPENAI]: {
        apiKey: this.configService.get<string>('OPENAI_API_KEY') || '',
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o',
      },
      [LlmProvider.CLAUDE]: {
        apiKey: this.configService.get<string>('ANTHROPIC_API_KEY') || '',
        baseUrl: 'https://api.anthropic.com/v1',
        defaultModel: 'claude-sonnet-4-20250514',
      },
      [LlmProvider.GEMINI]: {
        apiKey: this.configService.get<string>('GOOGLE_API_KEY') || '',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        defaultModel: 'gemini-3-pro-preview',
      },
      [LlmProvider.GROK]: {
        apiKey: this.configService.get<string>('XAI_API_KEY') || '',
        baseUrl: 'https://api.x.ai/v1',
        defaultModel: 'grok-3',
      },
    };
  }

  getConfig(provider: LlmProvider): LlmConfig {
    return this.configs[provider];
  }

  getAllConfigs(): Record<LlmProvider, LlmConfig> {
    return this.configs;
  }
}
