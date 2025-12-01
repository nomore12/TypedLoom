# TypedLoom 구현 기능 명세

현재까지 구현된 TypedLoom의 주요 기능들을 정리한 문서입니다.

## 1. 에디터 코어 (Editor Core)
- **JSON 입력 및 실시간 파싱**: 좌측 패널에 JSON을 입력하면 실시간으로 파싱되어 트리 뷰와 결과물에 반영됩니다.
- **에러 핸들링**: 유효하지 않은 JSON 입력 시 에러 메시지를 표시합니다.
- **상태 저장**: `localStorage`를 사용하여 새로고침 후에도 작업 내용(JSON 입력, 수정 사항)이 유지됩니다.

## 2. 인터랙티브 트리 뷰 (Interactive Tree View)
JSON 구조를 시각적으로 확인하고 조작할 수 있는 중앙 패널입니다.

### 2.1. 노드 조작
- **키 이름 변경 (Rename)**: 키 이름을 더블 클릭하여 수정할 수 있습니다.
- **옵셔널 토글 (Optional Toggle)**: 체크박스를 통해 해당 필드를 필수(Required) 또는 선택(Optional, `?`)으로 설정할 수 있습니다.
- **타입 변경 (Type Override)**:
    - 각 노드 우측의 **타입 배지**를 클릭하여 타입을 변경할 수 있습니다. (예: `string` -> `number` 또는 커스텀 타입)
    - **UI 개선**: 클릭 가능한 배지 스타일(Outline, Hover 효과)을 적용하여 직관성을 높였습니다.
    - **루트 노드 숨김**: 최상위 루트 노드에는 타입 선택기를 표시하지 않아 UI를 간소화했습니다.

### 2.2. 뷰 제어
- **Expand All / Collapse All**: 상단 버튼을 통해 모든 노드를 한 번에 펼치거나 접을 수 있습니다.
- **개별 토글**: 각 노드의 화살표를 클릭하여 개별적으로 펼치거나 접을 수 있습니다.

## 3. 코드 생성 (Code Generation)
우측 패널에서 다양한 포맷의 코드를 실시간으로 생성합니다.

### 3.1. 지원 포맷
- **TypeScript**: 인터페이스 또는 타입 정의.
- **Zod Schema**: 런타임 검증을 위한 Zod 스키마.
- **React Query**: 데이터 페칭을 위한 커스텀 훅 템플릿.
- **React Hook Form**: 폼 관리를 위한 `useForm` 훅 템플릿.

### 3.2. 생성 옵션
- **Interface / Type 토글**:
    - TypeScript 생성 시 `interface` 키워드와 `type` 키워드 중 선택할 수 있습니다.
    - 탭 하단의 전용 툴바에서 원클릭으로 전환 가능합니다.
- **Separate Nested (중첩 분리)**:
    - 깊게 중첩된 객체를 인라인으로 정의하는 대신, 별도의 인터페이스/타입으로 분리하여 추출하는 옵션입니다.
    - 예: `user: { address: { ... } }` -> `user: User;` + `interface User { address: Address; }`

## 4. 기술적 개선 사항
- **Hydration Error 해결**:
    - `next/dynamic`을 사용한 CodeMirror 클라이언트 렌더링.
    - `suppressHydrationWarning` 적용.
    - 브라우저 확장 프로그램 충돌 방지 가이드 마련.
- **다크 모드 지원**: 시스템 설정 또는 클래스 기반의 다크 모드 스타일링이 적용되어 있습니다.

---

## 5. 향후 추가 예정 기능 (Roadmap)

`docs/현실적인제안_02.md` 및 `docs/review_and_suggestions.md`를 기반으로 한 플랜별 추가 기능입니다.

### 5.1. Free 버전 (무료)
- **Smart Paste**:
    - 표준 JSON 외에도 JS Object(따옴표 생략), URL, cURL 명령어 등을 붙여넣으면 자동으로 JSON으로 파싱하는 기능.
- **Global Null Strategy**:
    - 모든 `null` 값을 `Optional`(`?`)로 일괄 변환하는 스위치.
- **Superset Merge**:
    - 배열 내 객체들의 구조가 다를 때, 이를 모두 포함하는(Superset) 형태로 병합하는 기능 (예: `(A & B partial)[]`).
- **CamelCase 변환**:
    - 스네이크 케이스(`user_id`) 등을 카멜 케이스(`userId`)로 일괄 변환하는 버튼.

### 5.2. Basic 버전 (유료 - 월 4,900원 예상)
- **Full Code Gen 접근 권한**:
    - 현재는 모든 탭이 열려있으나, 향후 **React Query**, **React Hook Form** 탭은 유료 플랜 전용으로 전환될 수 있습니다.
- **History (작업 이력)**:
    - 최근 작업 내용을 IndexedDB 등에 저장하고 불러오는 기능.
- **고급 Type Override**:
    - 단순 기본 타입 외에 `Date`, `Enum` 등 고급 타입으로의 강제 변환 기능.
- **Copy All**:
    - 모든 탭의 생성된 코드를 한 번에 복사하는 기능.

