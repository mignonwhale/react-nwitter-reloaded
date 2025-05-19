# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# installation

- npm create vite@latest
  - react + typescrtipt + vite
- git
- npm i react-router-dom@6.14.2
- npm i styled-reset
- npm i styled-components@6.0.7
- npm i @types/styled-components -D
- npm i firebase@10.1.0

# 이메일 인증

- firebase > Authentication > 로그인 방법 선택

# 소셜 인증 추가

- firebase > Authentication > 로그인 방법 > 원하는 소셜 선택
- 깃허브 선택 시
  - 깃허브 OAuth app 생성 https://github.com/settings/developers
  - 생성 정보를 firebase에 입력
