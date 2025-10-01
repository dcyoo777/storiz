# Google OAuth 회원 관리 시스템 구현 완료

이 문서는 구현된 Google OAuth 기반 회원 관리 시스템에 대한 설명입니다.

## 구현된 기능들

### 1. 인증 시스템 (Authentication)

#### auth.ts 개선
- ✅ Google OAuth Provider 환경변수 설정 (AUTH_GOOGLE_ID, AUTH_GOOGLE_CLIENT_SECRET)
- ✅ NextAuth 5.0 callbacks 구현:
  - `signIn`: 사용자 로그인 시 데이터베이스에 사용자 정보 저장/업데이트
  - `jwt`: JWT 토큰에 사용자 ID 추가
  - `session`: 세션 객체에 사용자 ID 추가

#### 타입 확장 (src/types/next-auth.d.ts)
- NextAuth의 Session과 JWT 타입을 확장하여 사용자 ID 포함

### 2. 데이터베이스 스키마 (schema.sql)

#### Users 테이블
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,          -- OAuth provider의 사용자 ID
    email TEXT UNIQUE NOT NULL,   -- 이메일 (고유값)
    name TEXT,                    -- 이름
    image TEXT,                   -- 프로필 사진 URL
    created_at TIMESTAMP,         -- 생성일
    updated_at TIMESTAMP          -- 수정일
);
```

#### Stories 테이블
- user_id 컬럼이 users 테이블의 id를 참조
- CASCADE DELETE 설정으로 사용자 삭제 시 관련 스토리도 삭제

### 3. 사용자 관리 액션 (src/app/actions/userActions.ts)

- `findOrCreateUser()`: 로그인 시 사용자 조회 또는 생성
- `getUserById()`: ID로 사용자 조회
- `getUserByEmail()`: 이메일로 사용자 조회

### 4. 스토리 생성 개선 (src/app/actions/createNewStory.ts)

**변경 전:**
```typescript
// UUID로 하드코딩
VALUES (..., ${uuidv4()})
```

**변경 후:**
```typescript
// 실제 로그인한 사용자 ID 사용
const session = await auth();
if (!session?.user?.id) {
  throw new Error("Unauthorized");
}
VALUES (..., ${session.user.id})
```

### 5. UI 개선

#### HeaderAuth 컴포넌트 (src/components/custom/HeaderAuth.tsx)
- 로그인 전: "Sign In" 버튼 표시
- 로그인 후:
  - 사용자 프로필 사진 표시
  - 사용자 이름 또는 이메일 표시
  - "Sign Out" 버튼 표시

#### Layout 업데이트 (src/app/layout.tsx)
- HeaderAuth 컴포넌트 통합
- 서버 컴포넌트로 세션 상태 자동 확인

#### 스토리 생성 폼 (src/app/new/page.tsx)
- 인증 오류 시 명확한 메시지 표시
- "로그인이 필요합니다" 안내

### 6. 환경 설정

#### .env.example 파일
필요한 모든 환경변수 문서화:
- `AUTH_SECRET`: NextAuth 암호화 키
- `AUTH_URL`: 애플리케이션 URL
- `AUTH_GOOGLE_ID`: Google OAuth Client ID
- `AUTH_GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `DATABASE_URL`: Neon PostgreSQL 연결 문자열

#### next.config.ts
Google 프로필 이미지 도메인 허용 설정

## 설정 방법

### 1단계: 데이터베이스 설정

1. Neon 대시보드에서 SQL 에디터 열기
2. `schema.sql` 파일의 내용을 복사하여 실행
3. users와 stories 테이블이 생성됨

### 2단계: Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. "API 및 서비스" → "사용자 인증 정보" 이동
4. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형: 웹 애플리케이션
6. 승인된 리디렉션 URI 추가:
   - 개발: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/google`
7. 클라이언트 ID와 클라이언트 보안 비밀번호 복사

### 3단계: 환경 변수 설정

1. `.env.example`을 `.env.local`로 복사
2. 환경 변수 입력:

```bash
# AUTH_SECRET 생성
openssl rand -base64 32

# .env.local 파일에 추가
AUTH_SECRET=생성된_시크릿_키
AUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=구글_클라이언트_ID
AUTH_GOOGLE_CLIENT_SECRET=구글_클라이언트_시크릿
DATABASE_URL=postgresql://...
```

### 4단계: 애플리케이션 실행

```bash
npm install
npm run dev
```

## 테스트 시나리오

### 1. 로그인 테스트
1. 애플리케이션 실행 (http://localhost:3000)
2. 헤더의 "Sign In" 버튼 클릭
3. Google 계정으로 로그인
4. 로그인 성공 후:
   - 헤더에 프로필 사진과 이름 표시됨
   - "Sign Out" 버튼 표시됨

### 2. 스토리 생성 테스트 (로그인 상태)
1. "New Story" 메뉴 클릭
2. 스토리 정보 입력:
   - 제목: "테스트 스토리"
   - 설명: "첫 번째 스토리입니다"
   - 시작/종료 시간 선택
3. "등록하기" 버튼 클릭
4. 성공 메시지 확인
5. 데이터베이스에서 user_id가 로그인한 사용자 ID인지 확인

### 3. 스토리 생성 테스트 (비로그인 상태)
1. 로그아웃 상태에서 "New Story" 접근
2. 스토리 정보 입력 후 등록 시도
3. "로그인이 필요합니다" 오류 메시지 확인

### 4. 로그아웃 테스트
1. 로그인 상태에서 "Sign Out" 버튼 클릭
2. 홈페이지로 리디렉션
3. 헤더에 "Sign In" 버튼만 표시됨

## 해결된 문제들

### ✅ redirect_uri_mismatch 오류
- **해결책**: 환경변수로 Google OAuth 설정 분리, AUTH_URL 명시적 설정

### ✅ 사용자 데이터베이스 연동
- **해결책**: users 테이블 생성, signIn callback에서 findOrCreateUser 호출

### ✅ 세션 관리
- **해결책**: JWT와 session callbacks로 사용자 ID를 세션에 포함

### ✅ UI 개선
- **해결책**: HeaderAuth 컴포넌트로 로그인 상태에 따른 동적 UI

### ✅ 사용자별 스토리 관리
- **해결책**: createNewStoryAction에서 auth() 호출하여 실제 사용자 ID 사용

## 주의사항

### 1. 환경 변수
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- 프로덕션 배포 시 Vercel 등의 플랫폼에서 환경 변수 설정

### 2. Google OAuth 설정
- 리디렉션 URI는 정확히 일치해야 합니다
- localhost는 `http://localhost:3000` 형식 사용 (127.0.0.1 아님)

### 3. 데이터베이스
- Neon 데이터베이스가 활성 상태인지 확인
- 무료 플랜은 일정 기간 미사용 시 중지될 수 있음

### 4. AUTH_SECRET
- 최소 32자 이상의 랜덤 문자열 사용
- 프로덕션과 개발 환경에서 다른 값 사용 권장

## 다음 단계 제안

1. **사용자 대시보드**: 내가 작성한 스토리 목록 보기
2. **스토리 편집/삭제**: 소유자만 수정 가능하도록 권한 확인
3. **프로필 페이지**: 사용자 정보 표시 및 수정
4. **소셜 기능**: 다른 사용자의 스토리 보기 (공개 설정 시)

## 참고 링크

- [NextAuth.js 5.0 Documentation](https://authjs.dev/getting-started/introduction)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
