import { Controller, Post, Body, Query } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { OpenAiHttpService } from './openai-http.service';
import {
  ChatRequestDto,
  ChatMethodQueryDto,
} from '../../common/dto/chat-request.dto';
import { ChatResponseDto } from '../../common/dto/chat-response.dto';

@Controller('openai')
export class OpenAiController {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly openAiHttpService: OpenAiHttpService,
  ) {}

  @Post('chat')
  async chat(
    @Body() request: ChatRequestDto,
    @Query() query: ChatMethodQueryDto,
  ): Promise<ChatResponseDto> {
    if (query.method === 'http') {
      return this.openAiHttpService.chat(request);
    }
    return this.openAiService.chat(request);
  }
}
