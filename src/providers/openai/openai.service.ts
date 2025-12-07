import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LlmConfigService } from '../../config/llm-config.service';
import { ChatRequestDto } from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';
import { LlmProvider } from '../../common/enums/llm-provider.enum';
import { ILlmProvider } from '../../common/interfaces/llm-provider.interface';

@Injectable()
export class OpenAiService implements ILlmProvider {
  private client: OpenAI;
  private config;

  constructor(private llmConfigService: LlmConfigService) {
    this.config = this.llmConfigService.getConfig(LlmProvider.OPENAI);
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseUrl,
    });
  }

  async chat(request: ChatRequestDto): Promise<ChatResponseDto> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel;

    const completion = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: request.message }],
      temperature: request.options?.temperature ?? 0.7,
      max_tokens: request.options?.maxTokens ?? 1000,
    });

    const choice = completion.choices[0];

    return {
      success: true,
      provider: LlmProvider.OPENAI,
      model,
      method: 'sdk',
      content: choice.message.content || '',
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
