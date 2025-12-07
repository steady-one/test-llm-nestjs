# LLM Test API (NestJS)

4가지 LLM(ChatGPT, Claude, Gemini, Grok)을 테스트하기 위한 NestJS API 서버입니다.

## 지원 LLM

| Provider | 기본 모델 | SDK 방식 | HTTP 방식 |
|----------|----------|----------|-----------|
| OpenAI | gpt-4o | O | O |
| Claude | claude-sonnet-4-20250514 | O | O |
| Gemini | gemini-2.0-flash | O | O |
| Grok | grok-3 | O | O |

## 설치

```bash
npm install
```

## 환경변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 API 키를 입력합니다.

```bash
cp .env.example .env
```

```env
PORT=3000

OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key
XAI_API_KEY=xai-your-xai-api-key
```

## 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

서버가 실행되면 `http://localhost:3000`에서 접근 가능합니다.

---

## API 엔드포인트

### 헬스 체크

```
GET /health
```

**응답:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-07T12:00:00.000Z"
}
```

---

### 사용 가능한 Provider 목록

```
GET /llm/providers
```

**응답:**
```json
{
  "providers": ["openai", "claude", "gemini", "grok"]
}
```

---

### 통합 채팅 API

모든 LLM을 하나의 엔드포인트에서 호출할 수 있습니다.

```
POST /llm/chat?method=sdk|http
```

**Query Parameters:**
| 파라미터 | 필수 | 기본값 | 설명 |
|---------|------|--------|------|
| method | X | sdk | `sdk` 또는 `http` |

**Request Body:**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| provider | string | O | `openai`, `claude`, `gemini`, `grok` |
| message | string | O | 사용자 메시지 |
| model | string | X | 사용할 모델명 (기본값: Provider별 기본 모델) |
| options.temperature | number | X | 0~2 (기본값: 0.7) |
| options.maxTokens | number | X | 최대 토큰 수 (기본값: 1000) |

**예시 요청:**

```bash
# SDK 방식 (기본)
curl -X POST http://localhost:3000/llm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "message": "안녕하세요! 자기소개 해주세요."
  }'

# HTTP 방식
curl -X POST "http://localhost:3000/llm/chat?method=http" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "claude",
    "message": "안녕하세요!",
    "options": {
      "temperature": 0.5,
      "maxTokens": 500
    }
  }'

# 특정 모델 지정
curl -X POST http://localhost:3000/llm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "message": "Hello!",
    "model": "gpt-4o-mini"
  }'
```

---

### 개별 Provider API

각 LLM을 개별 엔드포인트로 호출할 수 있습니다.

#### OpenAI

```
POST /openai/chat?method=sdk|http
```

```bash
curl -X POST http://localhost:3000/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is NestJS?"
  }'
```

#### Claude

```
POST /claude/chat?method=sdk|http
```

```bash
curl -X POST http://localhost:3000/claude/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "NestJS가 뭐야?"
  }'
```

#### Gemini

```
POST /gemini/chat?method=sdk|http
```

```bash
curl -X POST http://localhost:3000/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "TypeScript의 장점을 설명해줘"
  }'
```

#### Grok

```
POST /grok/chat?method=sdk|http
```

```bash
curl -X POST http://localhost:3000/grok/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me a joke"
  }'
```

---

## 응답 형식

모든 채팅 API는 동일한 응답 형식을 반환합니다.

**성공 응답:**
```json
{
  "success": true,
  "provider": "openai",
  "model": "gpt-4o",
  "method": "sdk",
  "content": "안녕하세요! 저는 OpenAI의 GPT입니다...",
  "usage": {
    "promptTokens": 15,
    "completionTokens": 45,
    "totalTokens": 60
  },
  "responseTime": 1234,
  "timestamp": "2025-12-07T12:00:00.000Z"
}
```

| 필드 | 설명 |
|------|------|
| success | 요청 성공 여부 |
| provider | 사용된 LLM Provider |
| model | 사용된 모델명 |
| method | 사용된 방식 (sdk/http) |
| content | LLM 응답 내용 |
| usage | 토큰 사용량 |
| responseTime | 응답 시간 (ms) |
| timestamp | 응답 시간 (ISO 8601) |

---

## SDK vs HTTP 방식

| 방식 | 설명 | 장점 |
|------|------|------|
| **SDK** | OpenAI SDK를 사용하여 호출 | 타입 안전, 자동 재시도, 에러 핸들링 |
| **HTTP** | 각 LLM의 Native HTTP API 직접 호출 | 최신 API 기능 즉시 사용 가능 |

- **OpenAI, Grok**: OpenAI SDK 또는 OpenAI 호환 HTTP API
- **Claude**: OpenAI SDK(호환 모드) 또는 Anthropic Native API
- **Gemini**: OpenAI SDK(호환 모드) 또는 Google Generative AI API

---

## 프로젝트 구조

```
src/
├── main.ts                      # 앱 진입점
├── app.module.ts                # 루트 모듈
├── common/
│   ├── dto/                     # 요청/응답 DTO
│   ├── enums/                   # LlmProvider enum
│   └── interfaces/              # 공통 인터페이스
├── config/
│   └── llm-config.service.ts    # LLM 설정 관리
├── llm/
│   ├── llm.controller.ts        # 통합 엔드포인트
│   └── llm.service.ts           # Provider 라우팅
├── providers/
│   ├── openai/                  # OpenAI Provider
│   ├── claude/                  # Claude Provider
│   ├── gemini/                  # Gemini Provider
│   └── grok/                    # Grok Provider
└── health/                      # 헬스체크
```

---

## 라이선스

MIT
