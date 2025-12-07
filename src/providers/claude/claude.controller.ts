import { Controller, Post, Body, Query } from '@nestjs/common';
import { ClaudeService } from './claude.service';
import { ClaudeHttpService } from './claude-http.service';
import {
  ChatRequestDto,
  ChatMethodQueryDto,
} from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';

@Controller('claude')
export class ClaudeController {
  constructor(
    private readonly claudeService: ClaudeService,
    private readonly claudeHttpService: ClaudeHttpService,
  ) {}

  @Post('chat')
  async chat(
    @Body() request: ChatRequestDto,
    @Query() query: ChatMethodQueryDto,
  ): Promise<ChatResponseDto> {
    if (query.method === 'http') {
      return this.claudeHttpService.chat(request);
    }
    return this.claudeService.chat(request);
  }
}
