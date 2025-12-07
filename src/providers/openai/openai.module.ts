import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAiController } from './openai.controller';
import { OpenAiService } from './openai.service';
import { OpenAiHttpService } from './openai-http.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  controllers: [OpenAiController],
  providers: [OpenAiService, OpenAiHttpService],
  exports: [OpenAiService, OpenAiHttpService],
})
export class OpenAiModule {}
