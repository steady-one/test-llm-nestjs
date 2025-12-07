import { Controller, Post, Body, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiHttpService } from './gemini-http.service';
import {
  ChatRequestDto,
  ChatMethodQueryDto,
} from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';

@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly geminiHttpService: GeminiHttpService,
  ) {}

  @Post('chat')
  async chat(
    @Body() request: ChatRequestDto,
    @Query() query: ChatMethodQueryDto,
  ): Promise<ChatResponseDto> {
    if (query.method === 'http') {
      return this.geminiHttpService.chat(request);
    }
    return this.geminiService.chat(request);
  }
}
