import { ChatRequestDto } from '../dto/chat-request.dto';
import { ChatResponseDto } from '../dto/chat-response.dto';

export interface ILlmProvider {
  chat(request: ChatRequestDto): Promise<ChatResponseDto>;
}

export interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
}
