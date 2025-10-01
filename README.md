# Storiz 📚

일상의 이야기를 시간순으로 기록하고 관리할 수 있는 모던한 스토리 관리 애플리케이션입니다.

## ✨ 주요 기능

- **스토리 생성**: 제목, 설명, 시간 범위와 함께 스토리 작성
- **시간 관리**: 사용자 친화적인 날짜/시간 선택기로 스토리의 시작과 끝 시간 설정
- **구글 인증**: 구글 OAuth를 통한 안전한 로그인
- **모던 UI**: Tailwind CSS와 shadcn/ui 컴포넌트로 구성된 세련된 인터페이스
- **데이터베이스 연동**: Neon PostgreSQL 데이터베이스 활용
- **반응형 디자인**: 데스크톱과 모바일에서 완벽하게 작동

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15.5.2 (React 19)
- **인증**: NextAuth.js (구글 프로바이더)
- **데이터베이스**: Neon PostgreSQL
- **스타일링**: Tailwind CSS v4, shadcn/ui
- **폼 관리**: React Hook Form + Zod 검증
- **날짜/시간**: dayjs

## 🚀 시작하기

### 필요 조건

- Node.js 18+ 및 npm/yarn
- 구글 OAuth 인증 정보
- 데이터베이스 연결 문자열

### 설치 방법

1. **저장소 복제**
   ```bash
   git clone https://github.com/dcyoo777/storiz.git
   cd storiz
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   
   루트 디렉토리에 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.
   

4. **데이터베이스 설정**
   
   데이터베이스에 다음 테이블을 생성하세요


5. **개발 서버 실행**
   ```bash
   npm run dev
   ```

   브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

## 📱 사용 방법

### 스토리 작성하기

1. 홈페이지에서 "Create New" 버튼 클릭
2. 스토리 폼 작성:
   - **제목**: 스토리의 제목을 입력
   - **설명**: 스토리에 대한 상세 설명 (선택사항)
   - **시작 시간**: 스토리가 시작된 시간
   - **종료 시간**: 스토리가 끝난 시간
3. "등록하기" 버튼을 클릭하여 스토리 저장

### 로그인

- 헤더의 "Sign In" 버튼 클릭
- 구글 계정으로 인증
- 로그인 후 스토리 작성 및 관리 가능

## 🏗️ 프로젝트 구조

```
src/
├── app/
│   ├── actions/          # 서버 액션
│   │   ├── createNewStory.ts
│   │   └── signIn.ts
│   ├── api/auth/         # NextAuth API 라우트
│   ├── new/             # 스토리 생성 페이지
│   ├── schema/          # Zod 스키마
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 홈페이지
├── components/
│   ├── custom/          # 커스텀 컴포넌트
│   │   ├── datetimepicker.tsx
│   │   ├── datepicker.tsx
│   │   └── Flex.tsx
│   └── ui/             # shadcn/ui 컴포넌트들
├── lib/
│   ├── timeUtil.ts     # 시간 유틸리티 함수
│   └── utils.ts        # 일반 유틸리티
├── auth.ts             # NextAuth 설정
└── middleware.ts       # 인증 미들웨어
```

## 🔧 개발

### 사용 가능한 스크립트

- `npm run dev` - Turbopack을 사용한 개발 서버 실행
- `npm run build` - Turbopack을 사용한 프로덕션 빌드
- `npm start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

### 주요 컴포넌트

- **DateTimePicker**: 5분 간격으로 날짜와 시간을 선택할 수 있는 커스텀 컴포넌트
- **Story Form**: React Hook Form과 Zod를 사용한 검증 기능이 포함된 종합 폼
- **Flex Component**: 일관된 flexbox 레이아웃을 위한 유틸리티 컴포넌트

## 🌟 상세 기능

### 시간 관리
- 시간 범위(시작 및 종료 시간)별 스토리 정리
- 5분 간격 정밀도의 커스텀 날짜/시간 선택기
- dayjs를 사용한 자동 시간대 처리

### 폼 검증
- Zod 스키마를 사용한 클라이언트 측 검증
- 실시간 폼 피드백
- 성공/오류 상태에 대한 토스트 알림

### 인증 흐름
- 구글 OAuth 통합
- 인증된 라우트에 대한 미들웨어 보호
- NextAuth.js를 사용한 세션 관리

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/새로운기능`)
3. 변경사항 커밋 (`git commit -m '새로운 기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/새로운기능`)
5. Pull Request 생성


---
## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.