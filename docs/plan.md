# TypedLoom 구현 기능 명세

현재까지 구현된 TypedLoom의 주요 기능과, 향후 확장 방향을 함께 정리한 문서입니다.

---

## 0. 제품 개요 / 타깃 / 가치 제안

### 0.1. 제품 한 줄 소개

> **TypedLoom**은 JSON 한 번 붙여넣으면  
> TypeScript 타입, Zod 스키마, React Query 훅, React Hook Form 템플릿까지  
> 한 번에 뽑아주는 “타입 안전 프론트엔드 코드 제너레이터”입니다.

### 0.2. 타깃 유저

- Next.js / React / TypeScript 를 사용하는 프론트엔드 개발자
- Zod + React Hook Form + React Query(TanStack Query)를 함께 사용하는 실무 개발자
- “API JSON 응답을 보고 매번 타입/폼/쿼리 코드를 손으로 짜는” 반복 작업에 지친 사람

### 0.3. 해결하고 싶은 문제

- 백엔드에서 JSON 응답이 바뀔 때마다:
  - TS 타입 정의
  - Zod 스키마
  - React Query 훅 타입
  - React Hook Form 필드 정의
- 를 각각 손으로 맞춰야 하는 반복·수동 작업

### 0.4. TypedLoom이 제공하는 핵심 가치

- **한 번의 JSON 입력 → 네 가지 코드 산출물**
  - TypeScript 타입/인터페이스
  - Zod 스키마
  - React Query 훅 템플릿
  - React Hook Form 템플릿
- **인터랙티브 트리 뷰를 통한 미세 조정**
  - 키 이름, optional 여부, 타입을 시각적으로 조정하면
  - 우측 코드 전체가 실시간으로 반영

---

## 1. 에디터 코어 (Editor Core)

- **JSON 입력 및 실시간 파싱**
  - 좌측 패널에 JSON을 입력하면 실시간으로 파싱되어 트리 뷰와 코드 결과에 반영됩니다.
- **에러 핸들링**
  - 유효하지 않은 JSON 입력 시 에러 메시지를 표시합니다.
  - 파싱 오류가 날 경우, 기존 트리/코드는 유지하면서 오류 상태만 알려줍니다.
- **상태 저장**
  - `localStorage`를 사용하여 새로고침 후에도 작업 내용이 유지됩니다.
  - 저장 대상: JSON 입력 값, 트리에서의 rename/optional/type override 상태 등.

---

## 2. 인터랙티브 트리 뷰 (Interactive Tree View)

JSON 구조를 시각적으로 확인하고 조작할 수 있는 중앙 패널입니다.  
여기서 이루어진 모든 조작은 우측 코드 생성 결과에 즉시 반영됩니다.

### 2.1. 노드 조작

- **키 이름 변경 (Rename)**
  - 키 이름을 더블 클릭하여 수정할 수 있습니다.
  - 변경된 이름은 다음에 모두 반영됩니다.
    - TypeScript 타입 필드 이름
    - Zod 스키마의 키 이름
    - React Hook Form의 `register("...")` 경로
    - React Query 결과 타입 구조

- **옵셔널 토글 (Optional Toggle)**
  - 각 필드의 체크박스를 통해 필수(Required) / 선택(Optional, `?`) 여부를 설정할 수 있습니다.
  - 토글 결과는 다음과 같이 반영됩니다.
    - TypeScript: `field?: Type` 형태로 `?` 추가 또는 제거
    - Zod: `.optional()` 부착 또는 제거 (향후 null 전략에 따라 `.nullable()`과 조합)
    - React Hook Form: 필수/선택 여부에 따라 기본 폼 검증 로직/표현에 활용 가능

- **타입 변경 (Type Override)**
  - 각 노드 우측의 **타입 배지**를 클릭하여 타입을 변경할 수 있습니다.
    - 예: `string` → `number`, `string` → `UserId` 같은 커스텀 타입 이름 등
  - 타입 변경 시 반영:
    - TypeScript: 필드 타입이 해당 타입으로 바로 교체
    - Zod: 해당 타입에 맞는 기본 스키마로 교체 (향후 커스텀 매핑 확장 예정)
  - **UI 개선 사항**
    - 타입 배지는 Outline, Hover 효과를 적용하여 “클릭 가능 요소”로 인지하기 쉽게 디자인했습니다.
  - **루트 노드 타입 배지 숨김**
    - 최상위 루트 노드에는 타입 선택기를 표시하지 않아 UI를 간소화했습니다.

### 2.2. 뷰 제어

- **Expand All / Collapse All**
  - 상단 버튼으로 모든 노드를 한 번에 펼치거나 접을 수 있습니다.
- **개별 토글**
  - 각 노드의 화살표를 클릭하여 개별적으로 펼치거나 접을 수 있습니다.
- **향후 계획**
  - 깊이 기준으로 자동 접기(예: 깊이 3 이상 자동 접기)
  - 특정 키 이름/타입으로 검색 및 하이라이트 기능

---

## 3. 코드 생성 (Code Generation)

우측 패널에서 다양한 포맷의 코드를 실시간으로 생성합니다.  
트리 뷰에서의 변경 사항(키 이름, optional, 타입 변경)은 여기 결과에 즉시 반영됩니다.

### 3.1. 지원 포맷

- **TypeScript**
  - 인터페이스(`interface`) 또는 타입 정의(`type`)를 생성합니다.
- **Zod Schema**
  - 런타임 검증을 위한 Zod 스키마를 생성합니다.
- **React Query**
  - 데이터 페칭을 위한 커스텀 훅 템플릿을 생성합니다.
  - 예: `const useUser = () => useQuery<UserResponse>(...)`
- **React Hook Form**
  - 폼 관리를 위한 `useForm` 훅 템플릿을 생성합니다.
  - `zodResolver`와 결합된 기본 구조를 제공합니다.

### 3.2. 생성 옵션 (공통 툴바)

- **Interface / Type 토글**
  - TypeScript 생성 시 `interface` 키워드와 `type` 키워드 중 선택할 수 있습니다.
  - 탭 하단의 전용 툴바에서 원클릭으로 전환 가능합니다.
- **Separate Nested (중첩 분리)**
  - 깊게 중첩된 객체를 인라인으로 정의하는 대신, 별도의 타입으로 분리하는 옵션입니다.
  - 예:
    - 인라인 모드:  
      `user: { address: { street: string; city: string } }`
    - 분리 모드:  
      `user: User;`  
      `interface User { address: Address; }`  
      `interface Address { street: string; city: string; }`

### 3.3. 코드 생성 규칙 (v0 기준 설계 요약)

현재 구현 및 설계 기준에서, 각 포맷은 다음 규칙을 따르는 것을 목표로 합니다.

#### 3.3.1. TypeScript

- 필드 타입 매핑:
  - JSON primitive → `string`, `number`, `boolean`
  - 배열 → `Type[]` 형태
  - 객체 → 별도의 타입/인터페이스로 분리 (또는 인라인, Separate Nested 옵션에 따라)
- optional / null:
  - 기본: 트리 뷰에서 optional 체크 시 `field?: Type`
  - 향후: Global Null Strategy에 따라 `null` 값도 optional로 승격 가능
- 네이밍:
  - 루트 타입: 기본값 `Root`, 사용자가 상단에서 변경 가능
  - 중첩 타입: 상위 키 이름을 기반으로 `User`, `UserProfile`, `UserAddress` 등으로 생성 (구체 규칙은 차후 문서화 예정)

#### 3.3.2. Zod Schema

- 타입 매핑:
  - `string` → `z.string()`
  - `number` → `z.number()`
  - `boolean` → `z.boolean()`
  - 배열 → `z.array(...)`
  - 객체 → `z.object({ ... })`
- optional / null:
  - optional 필드 → `.optional()` 부착
  - null 허용 → 기본적으로 `.nullable()`를 조합하는 방향을 목표
  - Global Null Strategy 도입 후:
    - “null을 optional로 간주” 모드에서 `.nullable()` 대신 `.optional()` 위주로 생성
- 스키마 네이밍:
  - 타입 이름을 기반으로 `userSchema`, `userProfileSchema` 등 생성 (구현/정제 과정 진행 중)

#### 3.3.3. React Query 템플릿

- 루트 응답 타입이 `GetUserResponse`라면:
  - `type GetUserResponse = ...`
  - `const useGetUser = () => useQuery<GetUserResponse>({ ... });` 형태의 기본 훅 템플릿
- 현재 v0 단계에서는:
  - queryKey, queryFn 등은 예시 수준의 기본값
  - 실제 URL/쿼리키는 사용자가 직접 수정하는 것을 전제로 함

#### 3.3.4. React Hook Form 템플릿

- Zod 스키마와 결합:
  - `type FormValues = z.infer<typeof someSchema>;`
  - `const form = useForm<FormValues>({ resolver: zodResolver(someSchema) });`
- 필드 템플릿:
  - v0에서는 `register("fieldName")` 중심의 기본 `<input />` 템플릿을 생성
  - 향후 타입별로 `number` / `checkbox` / `select` 등의 매핑을 확장할 계획

---

## 4. 기술적 개선 사항

- **Hydration Error 해결**
  - `next/dynamic`을 사용하여 CodeMirror를 클라이언트 사이드에서만 렌더링.
  - `suppressHydrationWarning` 적용으로 서버/클라이언트 초기 HTML 불일치 경고 완화.
  - 브라우저 확장 프로그램이 DOM을 조작할 때 발생하는 문제를 고려하여 구조를 단순화.
- **다크 모드 지원**
  - 시스템 설정 또는 클래스 기반의 다크 모드 스타일링을 적용.
  - 에디터, 트리 뷰, 코드 패널이 일관된 다크 모드 테마를 공유.

---

## 5. 현재 구현 상태 레이블 (Stable / Beta / Experimental)

각 기능의 안정도를 구분해, 향후 리팩터링/우선순위 판단에 도움을 주기 위한 분류입니다.

### 5.1. Stable (안정)

- 에디터 코어
  - JSON 입력/파싱
  - 기본 에러 핸들링
  - `localStorage` 기반 상태 저장
- 트리 뷰의 기본 구조
  - 노드 렌더링, Expand/Collapse All
- TypeScript 타입 생성
  - 기본 primitive/객체/배열 매핑
  - interface/type 토글의 동작

### 5.2. Beta (중간 안정)

- 트리 뷰 인터랙션
  - 키 이름 변경 (Rename)
  - Optional 토글
  - 타입 Override UI 및 기본 동작
- Separate Nested 옵션
  - 중첩 객체를 별도 타입으로 분리하는 로직
- Zod 스키마 생성
  - 기본 매핑은 동작하지만, null/optional 조합 및 네이밍 규칙은 추가 정제 필요

### 5.3. Experimental (실험적)

- React Query 템플릿 생성
  - 훅 이름/쿼리 키/쿼리 함수 등 패턴 정립 중
- React Hook Form 템플릿 생성
  - 필드 타입별 컴포넌트 매핑, 기본값 처리 등은 향후 개선 대상
- 향후 LLM/고급 타입(예: Date, Enum) 지원

---

## 6. 향후 추가 예정 기능 (Roadmap)

`docs/현실적인제안_02.md` 및 `docs/review_and_suggestions.md`에서 논의된 내용을 기반으로,  
엔진/UX/플랜 차별화 관점에서 정리한 로드맵입니다.

### 6.1. 엔진 및 타입 추론 기능 (Free/Basic 공통 기반)

- **Smart Paste**
  - 표준 JSON뿐 아니라 JS Object(따옴표 생략), URL, cURL 명령어 등을 붙여넣으면 자동으로 JSON으로 파싱.
  - 예: `curl https://api.example.com/users` → 내부에서 요청 or 예제만 추출 후 JSON 파싱.
- **Global Null Strategy**
  - 모든 `null` 값을 `Optional`(`?`)로 일괄 변환하거나, `| null`로 유지하는 전략을 글로벌 스위치로 설정.
  - 예: “null은 optional로 취급” / “null을 명시적으로 유지” 모드.
- **Superset Merge (배열 객체 병합)**
  - 배열 내 객체들의 구조가 서로 다를 때, 공통 필드 + optional 필드로 합쳐 하나의 superset 타입을 생성.
  - 예: `{ a }`, `{ a, b }` → `Array<{ a: number; b?: string }>`
- **CamelCase 변환**
  - 스네이크 케이스(`user_id`)를 카멜 케이스(`userId`)로 일괄 변환하는 버튼.
  - 옵션에 따라:
    - 타입/코드 상 이름만 camelCase로 바꾸고,
    - 원본 JSON 키와의 매핑은 별도 레이어로 유지할 수 있도록 설계.

### 6.2. UX / 에디터 기능

- **Smart Paste UI 강화**
  - 붙여넣기 타입(plain JSON / JS Object / URL / cURL)을 자동 감지하고, 인식 결과를 작은 배지로 표시.
- **Copy All**
  - TypeScript / Zod / React Query / React Hook Form 네 탭의 결과 코드를 한 번에 복사하는 버튼.
  - Basic 플랜의 대표적인 “편의 기능”으로 배치.
- **히스토리 (작업 이력)**
  - 이전 작업을 저장하고 불러오는 기능.
  - 우선은 IndexedDB 또는 localStorage 기반으로 구현.
  - 항목별 이름 지정 가능:
    - 예: “User API v1”, “Payment Response 2025-12-01”
  - 장기적으로 계정 기반 서버 저장으로 확장 가능.

### 6.3. 플랜 차별화 기능 (Free vs Basic)

- **Free 버전**
  - JSON → TypeScript 타입/인터페이스 변환
  - 기본 트리 편집 기능(Rename, Optional, Type Override)
  - 제한된 호출 수(예: 하루 50회)
  - Zod / Query / Form 탭은 “미리보기 + 업그레이드 유도” 역할로 일부 잠금
  - Smart Paste, CamelCase 변환 등은 기본 수준에서 제공 가능

- **Basic 버전 (예상 4,900원/월)**
  - 무제한 변환
  - Zod / React Query / RHF 템플릿 전체 코드 접근 권한
  - Global Null Strategy 고급 옵션
  - Superset Merge 전략 선택(“정확한 union 유지” vs “superset 타입으로 병합”)
  - History (작업 이력) 최대 50개 저장 + 이름 변경/삭제
  - “Copy All” 버튼: 네 포맷 코드를 한 번에 복사

---

## 7. 정리

- 현재 TypedLoom은:
  - JSON 입력/파싱
  - 트리 기반 타입 편집(Rename, Optional, Type Override)
  - TypeScript / Zod / React Query / RHF 코드 생성
  를 모두 포함한 **v0 프로토타입**이자, 이미 실 사용 가능한 수준의 도구입니다.
- 문서 상으로는:
  - 제품 목표/타깃/가치(0장),
  - 기능별 구현 상태(Stable/Beta/Experimental),
  - 엔진/UX/플랜별 로드맵
  을 함께 명시함으로써,  
  앞으로 어떤 방향으로 확장할지까지 한눈에 볼 수 있도록 정리했습니다.

이 문서는 “현재 구현된 기능”과 “가까운 미래의 설계 방향”을 함께 담은 작업용 기준서로 사용합니다.
