import { Controller, Post, Body, Query } from '@nestjs/common';
import { GrokService } from './grok.service';
import { GrokHttpService } from './grok-http.service';
import {
  ChatRequestDto,
  ChatMethodQueryDto,
} from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';

@Controller('grok')
export class GrokController {
  constructor(
    private readonly grokService: GrokService,
    private readonly grokHttpService: GrokHttpService,
  ) {}

  @Post('chat')
  async chat(
    @Body() request: ChatRequestDto,
    @Query() query: ChatMethodQueryDto,
  ): Promise<ChatResponseDto> {
    if (query.method === 'http') {
      return this.grokHttpService.chat(request);
    }
    return this.grokService.chat(request);
  }
}
