export class TokenUsageDto {
  promptTokens!: number;
  completionTokens!: number;
  totalTokens!: number;
}

export class ChatResponseDto {
  success!: boolean;
  provider!: string;
  model!: string;
  method!: 'sdk' | 'http';
  content!: string;
  usage?: TokenUsageDto;
  responseTime!: number;
  timestamp!: string;
}

export class ErrorResponseDto {
  success!: boolean;
  provider!: string;
  method!: 'sdk' | 'http';
  error!: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp!: string;
}
