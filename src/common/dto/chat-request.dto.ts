import {
  IsEnum,
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LlmProvider } from '../enums/llm-provider.enum';

export class ChatOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxTokens?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  topP?: number;
}

export class UnifiedChatRequestDto {
  @IsEnum(LlmProvider)
  provider!: LlmProvider;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChatOptionsDto)
  options?: ChatOptionsDto;
}

export class ChatRequestDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChatOptionsDto)
  options?: ChatOptionsDto;
}

export class ChatMethodQueryDto {
  @IsOptional()
  @IsIn(['sdk', 'http'])
  method?: 'sdk' | 'http' = 'sdk';
}
