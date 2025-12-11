✅ 📌 MyFlix – TMDB 기반 영화 정보 서비스

Netflix UI 스타일을 기반으로 제작된 React + TypeScript 영화 정보 서비스입니다.
사용자가 입력한 TMDB API Key의 실제 유효성을 검증하여 로그인하며,
영화 검색 / 인기 영화 / 상세 정보 / 찜(Wishlist) / 추천 콘텐츠 등 다양한 기능을 제공합니다.

⭐ 1. 주요 기능 (필수 요구사항 + 가산점 포함)
🔐 인증 기능

회원가입 (email + TMDB API Key 저장)

로그인 시 TMDB API Key 실제 검증 (/configuration 호출)

keepLogin으로 자동 로그인 지원

ProtectedRoute로 페이지 접근 보호

🎬 영화 기능 전체

HomePage

넷플릭스처럼 Hero 영상(YouTube) 자동 재생

4종 슬라이드: Popular / Now Playing / Top Rated / Upcoming

PopularPage

Table View (페이지 이동 버튼)

Infinite Scroll View (스크롤 시 자동 로드)

Top 버튼 제공

SearchPage

검색 + TMDB Search API 사용

필터: 최소 평점

정렬: 기본/평점순/인기순

최근 검색어 5개 저장

Skeleton Loading

MovieDetailPage

영화 상세 정보 표시

넷플릭스 스타일 Hero Banner

찜하기 버튼

추천 콘텐츠(Recommendations)

WishlistPage

찜한 영화 localStorage 저장

모든 화면에서 찜 기능 연동

✨ UI / UX 가산점 기능

페이지 전환 글로벌 애니메이션

Hover Overlay (상세보기 / 찜하기 버튼)

Skeleton Loading UI

반응형 모바일 UI

확대 시 가로 스크롤 방지 (overflow-x: hidden)

Hero 영상이 헤더에 가려지지 않도록 레이아웃 조정

🛠 2. 기술 스택
분야	기술
프론트엔드	React + Vite + TypeScript
UI	CSS, Swiper.js
라우팅	React Router DOM
데이터 요청	Fetch, Axios
상태 관리	useState, useEffect, LocalStorage
외부 API	TMDB API
📁 3. 폴더 구조
src/
│
├── components/
│   └── layout/
│       ├── Header.tsx
│       ├── Layout.tsx
│       └── Header.css
│
├── pages/
│   ├── HomePage.tsx
│   ├── PopularPage.tsx
│   ├── SearchPage.tsx
│   ├── MovieDetailPage.tsx
│   ├── WishlistPage.tsx
│   └── SigninPage.tsx
│
├── libs/
│   ├── Authentication.ts      # 로그인 + TMDB Key 검증
│   ├── URL.ts                 # TMDB API URL 생성기
│   └── useWishlist.ts         # 찜(Wishlist) 관리 로직
│
├── router/
│   └── ProtectedRoute.tsx
│
└── styles/
└── route-transition.css   # 페이지 전환 애니메이션

🚀 4. 실행 방법
1) 패키지 설치
   npm install

2) 개발 서버 실행
   npm run dev

3) (선택) .env 설정
   VITE_TMDB_API_KEY=YOUR_DEFAULT_TMDB_KEY


로그인 시 입력한 Key가 최우선 적용됨.

🔐 5. 로그인 / 인증 구조
로그인 과정 요약

사용자가 email + TMDB Key 입력

Authentication.ts에서 TMDB Key를 /configuration API로 검증

성공 시:

TMDb-Key 저장

현재 사용자 정보 저장

keepLogin 옵션 저장

인증된 사용자만 접근 가능한 라우트:

/popular  
/search  
/movie/:id  
/wishlist

🎨 6. 상세 화면 설명
🏠 HomePage

넷플릭스풍 Hero 영상 + 어두운 그라데이션

영화 슬라이더 4종 제공

Hover 시 “상세보기 / 찜하기” 버튼 등장

카드 확대 시 자연스러운 애니메이션 적용

📈 PopularPage
두 가지 보기 제공:

Table View

Prev / Next 버튼으로 페이지 이동

Infinite Scroll

화면 끝 근처에서 자동 로딩

Top 버튼 자동 노출

공통 기능:

Hover Overlay

찜 상태 실시간 반영(LocalStorage)

🔍 SearchPage

검색 API 기반 영화 검색

필터(최소 평점), 정렬 지원

최근 검색어 5개 저장 및 클릭 검색

Skeleton Loading UI 적용

페이지네이션 지원

영화 Hover 시 Overlay 표시

🎬 MovieDetailPage

Hero Banner (Backdrop 이미지 기반)

장르 / 평점 / 개봉일 / 줄거리 표시

넷플릭스 UI처럼 좌우 레이아웃 구성

비슷한 콘텐츠 추천 제공

추천 카드 Hover Overlay

❤️ WishlistPage

찜한 영화 localStorage 저장

모든 페이지와 상태 연동

삭제/추가 UI 구현

✨ 7. 가산점 기능 정리 (Checklist)
기능	구현 여부
API Key 유효성 검증	✔
Protected Routes	✔
최근 검색어	✔
Skeleton Loading	✔
Route Transition Animation	✔
Hover Overlay	✔
반응형 UI	✔
Infinite Scroll	✔
Table / Grid 동일 스타일	✔
Hero 영상 & 배너	✔
추천 콘텐츠	✔
🙋 8. 개발 중 중요 개선 사항

Hero 영상이 헤더에 가리지 않도록 레이아웃 수정

카드 hover 확대 시 스크롤이 튀지 않도록 overflow-x 처리

인기/검색/추천 UI를 통합된 스타일로 통일

추천 콘텐츠 오버레이 스타일 Home/Popular/Search와 동일하게 맞춤

전체 애니메이션을 route-transition.css로 통합

📌 마무리

본 프로젝트는 Netflix 스타일 UX를 기반으로 완성된 영화 정보 서비스입니다.