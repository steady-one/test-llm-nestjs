import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LlmConfigService } from '../../config/llm-config.service';
import { ChatRequestDto } from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';
import { LlmProvider } from '../../common/enums/llm-provider.enum';
import { ILlmProvider } from '../../common/interfaces/llm-provider.interface';

interface ClaudeContentBlock {
  type: string;
  text?: string;
}

interface ClaudeResponse {
  content: ClaudeContentBlock[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

@Injectable()
export class ClaudeHttpService implements ILlmProvider {
  private config;

  constructor(
    private httpService: HttpService,
    private llmConfigService: LlmConfigService,
  ) {
    this.config = this.llmConfigService.getConfig(LlmProvider.CLAUDE);
  }

  async chat(request: ChatRequestDto): Promise<ChatResponseDto> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel;

    const response = await firstValueFrom(
      this.httpService.post<ClaudeResponse>(
        `${this.config.baseUrl}/messages`,
        {
          model,
          max_tokens: request.options?.maxTokens ?? 1000,
          messages: [{ role: 'user', content: request.message }],
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const data = response.data;
    const textContent = data.content.find((c) => c.type === 'text');

    return {
      success: true,
      provider: LlmProvider.CLAUDE,
      model,
      method: 'http',
      content: textContent?.text || '',
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
