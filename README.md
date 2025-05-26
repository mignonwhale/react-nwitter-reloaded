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

# 아이콘 참고

[https://heroicons.com/](https://heroicons.com/)

# 데이터베이스

- Cloud Firestore = NoSQL database
- [Cloud Firestore 시작](https://firebase.google.com/docs/firestore/quickstart?hl=ko&authuser=0&_gl=1*acs4dw*_ga*MTg4NTA3MjY2MC4xNzQ3NjQ1NzY5*_ga_CW55HF8NVT*czE3NDc3MzI4OTQkbzckZzEkdDE3NDc3MzM1ODQkajUyJGwwJGgwJGRUSkNHeUlUbzJyTXdZU0J6dVMtWmhpMGYwTmt3R0VJNVZR)

# 파일저장소

- Storage
- 2025.05.20 현재는 유료버전만 사용가능하므로 무료크레딧으로 사용 추천
- [Storage 시작](https://firebase.google.com/docs/storage/?hl=ko&authuser=0&_gl=1*cu8u7v*_ga*MTg4NTA3MjY2MC4xNzQ3NjQ1NzY5*_ga_CW55HF8NVT*czE3NDc3MzI4OTQkbzckZzEkdDE3NDc3MzM3NzMkajI4JGwwJGgwJGRUSkNHeUlUbzJyTXdZU0J6dVMtWmhpMGYwTmt3R0VJNVZR#implementation_path)

# 빌드 & 배포

- Build > Hosting

- [Hosting 시작](https://console.firebase.google.com/project/nwitter-reloaded-a595b/hosting/sites/nwitter-reloaded-a595b)
- node version 20 이상이어야 firebase hosting을 사용할 수 있음

```
nvm install 20
nvm use 20.19.2
node -v
```

- 설치

```
npm install -g firebase-tools
```

- 로그인 명령어를 치면 웹으로 firebase hosting cli를 사용할 수 있도록 로그인 화면이 연결된다.

```
firebase login
```

- 빌드 폴더 초기화 작업

```
> firebase init

✔ Which Firebase features do you want to set up for this directory?
  - Hosting 선택

? Please select an option
 - Use an existing project 선택 후 내 프로젝트 선택

? What do you want to use as your public directory? (public)
- `npm run build`를 하면 생성되는 디렉토리인 dist를 입력

? Configure as a single-page app (rewrite all urls to /index.html)?
- Y

? Set up automatic builds and deploys with GitHub? (Y/n)
- n 필요할때 추가

✔ File dist/index.html already exists. Overwrite?
- Y

```

- 배포스크립트 추가, package.json

```
    "predeploy": "npm run build",
    "deploy": "firebase deploy"
```

- 배포 실행 및 확인

```
npm run deploy

Hosting URL: https://nwitter-reloaded-a595b.web.app
```

# Security Rules

- database나 storage에 rule을 생성하여 보안 및 제약 생성
- 읽기, 쓰기, 저장 조건을 넣을 수 있음
- [database rules](https://console.firebase.google.com/project/nwitter-reloaded-a595b/firestore/databases/-default-/rules)
- [storage rules](https://console.firebase.google.com/project/nwitter-reloaded-a595b/storage/nwitter-reloaded-a595b.firebasestorage.app/rules)

# API Key Security

- [cloud> 사용자인증정보](https://console.cloud.google.com/apis/credentials?inv=1&invt=Abya3g&project=nwitter-reloaded-a595b)

- 해당 프로젝트의 API 키 클릭
- 애플리케이션 제한사항: 웹사이트로만 제한
- 웹사이트 제한사항: 현재 프로젝트의 hosting url입력 => 이렇게 하면 local 접속은 제한이 되므로 개발기간에는 local url도 추가
