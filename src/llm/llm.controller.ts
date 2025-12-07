import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { LlmService } from './llm.service';
import {
  UnifiedChatRequestDto,
  ChatMethodQueryDto,
} from '../common/dto/chat-request.dto';
import { ChatResponseDto } from '../common/dto/chat-response.dto';
import { LlmProvider } from '../common/enums/llm-provider.enum';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('chat')
  async chat(
    @Body() request: UnifiedChatRequestDto,
    @Query() query: ChatMethodQueryDto,
  ): Promise<ChatResponseDto> {
    return this.llmService.chat(request, query.method || 'sdk');
  }

  @Get('providers')
  getProviders(): { providers: LlmProvider[] } {
    return { providers: Object.values(LlmProvider) };
  }
}
