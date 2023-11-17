# MALL-MIDDLEWARE

# 프로젝트 소개
- RDB(MySQL) 데이터 모델링, JWT, Express Middleware를 이용한 **인증 로직** 추가

# API 테스트 방법
먼저 app.js를 실행해주세요.
```
      node app.js
```
app.js 실행중 새로운 터미널을 열어주시고 아래 명령어를 입력해주세요.
```
      cd tests/api
      node authTest.js 
      node userTest.js
      node productTest.js
```

# 기술 스택
1. **API 명세서를 작성**하여, ****최종적 결과물****을 미리 파악합니다.
2. **MySQL, Sequelize를** 이용해 데이터베이스를 설계하고 활용합니다.
    - 데이터 모델링을 통해 **ERD 작성**
    - Sequelize를 이용한 **마이그레이션 코드 및 스키마 코드 작성**
    - **JOIN**을 통해 다른 Table의 데이터와 결합
3. **인증 관련 기능을 구현**합니다.
    - **JWT**(AccessToken)의 이해
    - 회원가입 API, 로그인 API, 내 정보 조회 API, 인증 **Middleware** 구현
    - 상품 관련 기능에 인증 로직 추가
4. AWS EC2 와 Gabia를 사용한 배포 IP 주소: http://apploadbalancer-381603911.ap-northeast-2.elb.amazonaws.com/
   
# 주요 기능
### **회원가입 API**

1. 이메일, 비밀번호, 비밀번호 확인, 이름을 데이터로 넘겨서 **회원가입을 요청**합니다.
    - 보안을 위해 비밀번호는 평문(Plain Text)으로 저장하지 않고 Hash 된 값을 저장합니다.
2. 아래 사항에 대한 **유효성 체크**를 해야 되며, 유효하지 않은 경우 알맞은 Http Status Code와 에러 메세지를 반환해야 합니다.
    - **이메일**: 중복될 수 없으며, 이메일 형식에 맞아야 합니다.
    - **비밀번호:** 최소 6자 이상이며, 비밀번호 확인과 일치해야 합니다.
3. **회원가입 성공 시**, 비밀번호를 제외 한 사용자의 정보를 반환합니다.

### **로그인 API**

1. 이메일, 비밀번호로 **로그인을 요청**합니다.
2. 이메일 또는 비밀번호 중 **하나라도 일치하지 않는다면,** 알맞은 Http Status Code와 에러 메세지를 반환해야 합니다.
3. **로그인 성공 시**, JWT AccessToken을 생성하여 반환합니다.
    - Access Token
        - Payload: userId를 담고 있습니다.
        - 유효기한: 12시간

### 인증 Middleware

1. Request Header의 Authorization 정보에서 JWT를 가져와서, 인증 된 사용자인지 확인하는 Middleware를 구현합니다.
2. 인증에 실패하는 경우에는 알맞은 Http Status Code와 에러 메세지를 반환 해야 합니다.
    - Authorization에 담겨 있는 값의 형태가 표준(Authorization: Bearer <JWT Value>)과 일치하지 않는 경우
    - JWT의 유효기한이 지난 경우
    - JWT 검증(JWT Secret 불일치, 데이터 조작으로 인한 Signature 불일치 등)에 실패한 경우
3. 인증에 성공하는 경우에는 req.locals.user에 인증 된 사용자 정보를 담고, 다음 동작을 진행합니다.

### 사용자 관련 ###
1. 내 정보 조회 API (인증 필요 - 인증 Middleware 사용)
    - 인증에 성공했다면, **비밀번호를 제외한 내 정보**를 반환합니다.

### 상품 관련 ###
- 인증 필요 API 호출 시 **Request Header**의 ****Authorization**** 값으로 **JWT**를 함께 넘겨줘야 합니다.
- 인증에 실패한 경우, 알맞은 **Http Status Code**와 **로그인이 필요합니다** 라는 에러 메세지를 반환합니다.

### 인증 기능 추가

- 인증 필요 API 호출 시 **Request Header**의 ****Authorization**** 값으로 **JWT**를 함께 넘겨줘야 합니다.
- 인증에 실패한 경우, 알맞은 **Http Status Code**와 **로그인이 필요합니다** 라는 에러 메세지를 반환합니다.

### 상품 생성 API (인증 필요 - 인증 Middleware 사용)

- API 호출 시 상품명, 작성 내용, ~~작성자명, 비밀번호~~를 전달 받습니다.
→ 작성자명, 비밀번호 대신 인증에 성공한 사용자의 userId를 저장합니다.
- 상품은 두 가지 상태, 판매 중(`FOR_SALE`)및 판매 완료(`SOLD_OUT`) 를 가질 수 있습니다.
- 상품 등록 시 기본 상태는 판매 중(`FOR_SALE`) 입니다.

### 상품 수정 API (인증 필요 - 인증 Middleware 사용)

- 상품명, 작성 내용, 상품 상태, ~~비밀번호~~를 데이터로 넘겨 상품 수정을 요청합니다.
→ 인증 기능으로 인해 비밀번호는 필요가 없습니다.
- 수정할 상품과 ~~비밀번호 일치 여부를 확인~~한 후, 동일할 때에만 글이 수정되어야 합니다.
→ 인증에 성공한 사용자의 userId와 상품을 등록한 사용자의 userId가 일치할 때에만 **수정**되어야 합니다.
- 선택한 상품이 존재하지 않을 경우, “상품 조회에 실패하였습니다." 메시지를 반환합니다.

### 상품 삭제 API (인증 필요 - 인증 Middleware 사용)

- ~~비밀번호~~를 데이터로 넘겨 상품 삭제를 요청합니다.
→ 인증 기능으로 인해 비밀번호는 필요가 없습니다.
- 수정할 상품과 ~~비밀번호 일치 여부를 확인~~한 후, 동일할 때만 글이 삭제되어야 합니다.
→ 인증에 성공한 사용자의 userId와 상품을 등록한 사용자의 userId가 일치할 때에만 **삭제**되어야 합니다.
- 선택한 상품이 존재하지 않을 경우, “상품 조회에 실패하였습니다." 메시지를 반환합니다.

### 상품 목록 조회 API

- 상품 ID, 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜 조회하기
    - 상품 ID, 작성 내용 항목이 지난 과제에 실수로 빠져있었습니다.
    - 작성자명을 표시하기 위해서는 상품, 사용자 Table의 JOIN이 필요합니다.
- 상품 목록은 작성 날짜를 기준으로 ~~**내림차순(최신순)** 정렬하기~~
    - QueryString으로 sort 항목을 받아서 정렬 방식을 결정합니다.
    - 들어올 수 있는 값은 ASC, DESC 두가지 값으로 대소문자 구분을 하지 않습니다.
    - ASC는 과거순, DESC는 최신순 그리고 둘 다 해당하지 않거나 값이 없는 경우에는 최신순 정렬을 합니다.

### 상품 상세 조회 API

- 상품 ID, 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜 조회하기
    - 상품 ID 항목이 지난 과제에 실수로 빠져있었습니다.
    - 작성자명을 표시하기 위해서는 상품, 사용자 Table의 JOIN이 필요합니다.    

# 환경변수 (.env) 
- DB_HOST=
- DB_USER=
- DB_PASSWORD=
- DB_DATABASE=
- DB_DIALECT=
- JWT_SECRET=

# API 명세서 URL

- https://docs.google.com/spreadsheets/d/16ou3REvbLL4OqWi5ADrPBlHaQloZMLV2qSzsZr1kjV0/edit#gid=0

# ERD URL

- https://www.erdcloud.com/d/bqkE8XLxX7guv6vB9

# 더 고민해 보기

1. **암호화 방식**
- 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 `단방향 암호화`와 `양방향 암호화` 중 어떤 암호화 방식에 해당할까요?
- 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?

=> Hash는 주로 단방향 암호화에 해당합니다. 단방향 암호화는 원래 데이터를 암호화된 값으로 바꾸는 것이지만, 암호화된 값을 다시 원래 데이터로 돌리는 것은 어려운 것이 특징입니다. 따라서 비밀번호를 저장할 때 원본 비밀번호를 저장하지 않고 그에 대한 해시값을 저장함으로써 보안을 강화할 수 있습니다. 이는 해시 충돌이 발생할 수 있으나, 안전한 해시 함수를 사용하면 이를 크게 감소시킬 수 있습니다.

2. **인증 방식**
- JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
- 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?

=> JWT의 Access Token이 노출되면 해당 토큰을 가로채어 사용자의 권한을 도용할 수 있습니다. 이는 토큰 자체에 사용자 정보가 포함되어 있기 때문입니다. 이를 방지하기 위해서는 토큰의 유효 기간을 짧게 유지하고, Refresh Token을 사용하여 새로운 Access Token을 발급하는 방법을 사용할 수 있습니다.

3. **인증과 인가**
- 인증과 인가가 무엇인지 각각 설명해 주세요.
- 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.

=> 인증(Authentication)은 사용자가 누구인지 확인하는 과정입니다. 반면에 인가(Authorization)는 특정 자원이나 기능에 대한 접근 권한을 부여하는 것입니다. 두 용어의 차이를 간단히 말하면, "누구인지 확인하고" vs "무엇을 할 권한이 있는지 확인하고" 입니다. 과제에서 Middleware는 인증과 인가 둘다에 쓰입니다.

4. **Http Status Code**
- 과제를 진행하면서 `사용한 Http Status Code`를 모두 나열하고, 각각이 `의미하는 것`과 `어떤 상황에 사용`했는지 작성해 주세요.

=> 사용한 Http Status Code:
200 OK: 성공적으로 처리됨
201 Created: 새로운 리소스가 성공적으로 생성됨
204 No Content: 요청은 성공했지만 응답으로 반환할 데이터가 없음
400 Bad Request: 잘못된 요청
401 Unauthorized: 인증이 필요한 상태, 인증 정보가 부족하거나 유효하지 않음
403 Forbidden: 인가 실패, 리소스에 대한 권한이 없음 
404 Not Found: 요청한 리소스를 찾을 수 없음
500 Internal Server Error: 서버 내부 오류

5. **리팩토링**
- MongoDB, Mongoose를 이용해 구현되었던 코드를 MySQL, Sequelize로 변경하면서, 많은 코드 변경이 있었나요? 주로 어떤 코드에서 변경이 있었나요?
- 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.

=> 주로 데이터베이스 관련 코드와 쿼리문이 변경되었습니다. MongoDB와 MySQL은 다른 데이터베이스 시스템이므로, 데이터베이스 연결 및 쿼리 부분이 변경되어야 합니다. 리팩토링 시에는 데이터베이스 관련 코드를 모듈화하고 추상화하여 유지보수성을 높일 수 있습니다.

6. **서버 장애 복구**
- 현재는 PM2를 이용해 Express 서버의 구동이 종료 되었을 때에 Express 서버를 재실행 시켜 장애를 복구하고 있습니다. 만약 단순히 Express 서버가 종료 된 것이 아니라, AWS EC2 인스턴스(VM, 서버 컴퓨터)가 재시작 된다면, Express 서버는 재실행되지 않을 겁니다. AWS EC2 인스턴스가 재시작 된 후에도 자동으로 Express 서버를 실행할 수 있게 하려면 어떤 조치를 취해야 할까요?
(Hint: PM2에서 제공하는 기능 중 하나입니다.)

=> AWS EC2 인스턴스가 재시작될 때 자동으로 Express 서버를 실행하려면 PM2의 startup 명령을 사용할 수 있습니다. 이 명령은 서버 부팅 시 자동으로 실행될 수 있도록 설정하는데 도움을 줍니다. 예를 들면 pm2 startup 명령을 사용하여 초기화할 수 있습니다.

7. **개발 환경**
- nodemon은 어떤 역할을 하는 패키지이며, 사용했을 때 어떤 점이 달라졌나요?
- npm을 이용해서 패키지를 설치하는 방법은 크게 일반, 글로벌(`--global, -g`), 개발용(`--save-dev, -D`)으로 3가지가 있습니다. 각각의 차이점을 설명하고, nodemon은 어떤 옵션으로 설치해야 될까요?

=> nodemon은 파일 변경을 감지하여 자동으로 서버를 재시작해주는 도구입니다. 이를 통해 코드 수정 후 매번 서버를 재시작하지 않아도 됩니다.
npm을 이용한 패키지 설치 방법의 차이:
일반: 프로젝트에 필요한 패키지를 설치합니다.
글로벌: 시스템 전역에 패키지를 설치하며 해당 패키지가 시스템 어디서든 사용 가능합니다.
개발용: 프로젝트 개발에 필요한 패키지로, 프로덕션 환경에서는 필요하지 않을 수 있습니다.
nodemon은 개발 환경에서 사용되므로, -D 또는 --save-dev 옵션을 통해 개발 의존성으로 설치하는 것이 적절합니다.
