import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { GeminiHttpService } from './gemini-http.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  controllers: [GeminiController],
  providers: [GeminiService, GeminiHttpService],
  exports: [GeminiService, GeminiHttpService],
})
export class GeminiModule {}
