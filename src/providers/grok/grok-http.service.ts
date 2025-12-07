import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LlmConfigService } from '../../config/llm-config.service';
import { ChatRequestDto } from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';
import { LlmProvider } from '../../common/enums/llm-provider.enum';
import { ILlmProvider } from '../../common/interfaces/llm-provider.interface';

@Injectable()
export class GrokHttpService implements ILlmProvider {
  private config;

  constructor(
    private httpService: HttpService,
    private llmConfigService: LlmConfigService,
  ) {
    this.config = this.llmConfigService.getConfig(LlmProvider.GROK);
  }

  async chat(request: ChatRequestDto): Promise<ChatResponseDto> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel;

    const response = await firstValueFrom(
      this.httpService.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model,
          messages: [{ role: 'user', content: request.message }],
          temperature: request.options?.temperature ?? 0.7,
          max_tokens: request.options?.maxTokens ?? 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const data = response.data;
    const choice = data.choices[0];

    return {
      success: true,
      provider: LlmProvider.GROK,
      model,
      method: 'http',
      content: choice.message.content || '',
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
