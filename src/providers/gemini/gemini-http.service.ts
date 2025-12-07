import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LlmConfigService } from '../../config/llm-config.service';
import { ChatRequestDto } from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';
import { LlmProvider } from '../../common/enums/llm-provider.enum';
import { ILlmProvider } from '../../common/interfaces/llm-provider.interface';

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
    role: string;
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

@Injectable()
export class GeminiHttpService implements ILlmProvider {
  private config;

  constructor(
    private httpService: HttpService,
    private llmConfigService: LlmConfigService,
  ) {
    this.config = this.llmConfigService.getConfig(LlmProvider.GEMINI);
  }

  async chat(request: ChatRequestDto): Promise<ChatResponseDto> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel;

    const response = await firstValueFrom(
      this.httpService.post<GeminiResponse>(
        `${this.config.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: request.message }],
            },
          ],
          generationConfig: {
            temperature: request.options?.temperature ?? 0.7,
            maxOutputTokens: request.options?.maxTokens ?? 1000,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const data = response.data;
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.find((p) => p.text);

    return {
      success: true,
      provider: LlmProvider.GEMINI,
      model,
      method: 'http',
      content: textPart?.text || '',
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokens: data.usageMetadata.totalTokenCount,
          }
        : undefined,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
