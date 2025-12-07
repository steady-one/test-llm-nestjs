import { Injectable, BadRequestException } from '@nestjs/common';
import { UnifiedChatRequestDto } from '../common/dto/chat-request.dto';
import { ChatResponseDto } from '../common/dto/chat-response.dto';
import { LlmProvider } from '../common/enums/llm-provider.enum';
import { OpenAiService } from '../providers/openai/openai.service';
import { OpenAiHttpService } from '../providers/openai/openai-http.service';
import { ClaudeService } from '../providers/claude/claude.service';
import { ClaudeHttpService } from '../providers/claude/claude-http.service';
import { GeminiService } from '../providers/gemini/gemini.service';
import { GeminiHttpService } from '../providers/gemini/gemini-http.service';
import { GrokService } from '../providers/grok/grok.service';
import { GrokHttpService } from '../providers/grok/grok-http.service';

@Injectable()
export class LlmService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly openAiHttpService: OpenAiHttpService,
    private readonly claudeService: ClaudeService,
    private readonly claudeHttpService: ClaudeHttpService,
    private readonly geminiService: GeminiService,
    private readonly geminiHttpService: GeminiHttpService,
    private readonly grokService: GrokService,
    private readonly grokHttpService: GrokHttpService,
  ) {}

  async chat(
    request: UnifiedChatRequestDto,
    method: 'sdk' | 'http' = 'sdk',
  ): Promise<ChatResponseDto> {
    const chatRequest = {
      message: request.message,
      model: request.model,
      options: request.options,
    };

    switch (request.provider) {
      case LlmProvider.OPENAI:
        return method === 'http'
          ? this.openAiHttpService.chat(chatRequest)
          : this.openAiService.chat(chatRequest);

      case LlmProvider.CLAUDE:
        return method === 'http'
          ? this.claudeHttpService.chat(chatRequest)
          : this.claudeService.chat(chatRequest);

      case LlmProvider.GEMINI:
        return method === 'http'
          ? this.geminiHttpService.chat(chatRequest)
          : this.geminiService.chat(chatRequest);

      case LlmProvider.GROK:
        return method === 'http'
          ? this.grokHttpService.chat(chatRequest)
          : this.grokService.chat(chatRequest);

      default:
        throw new BadRequestException(`Unknown provider: ${request.provider}`);
    }
  }
}
