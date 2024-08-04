## 가계부 웹앱 만들기

### 조원

- 신승현 선임
- 황현 선임

### API Document

#### 가계부 입력

HTTP Request

```http
POST /accounts HTTP/1.1
Content-Type: application/json
Content-Length: 88
Host: localhost:3001

{
	"date": "2017-03-16",
	"time": "23:07",
	"bank": "카카오뱅크",
	"category": "food",
	"amount": 5000,
	"content": "김밥 냠냠",
	"transactionType": "expense"
}
```

<br>

HTTP Response

```http
HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Content-Type: application/json
Content-Length: 96

{
    "status": 201,
    "result": "가계부 입력 성공",
    "data": {
        "totalExpense": 5000,
        "totalRevenue": 0
    }
}
```

- 가계부 입력 시, 지출(`expense`)인지 수입(`revenue`)인지 타입을 선택합니다.
- 입력된 가계부 저장에 성공하면, 타입을 바탕으로 이번 달의 총 지출과 총 수입을 업데이트하여 응답합니다.

<br>

#### 가계부 목록 조회

HTTP Request

```http
GET /accounts?year=2023&month=07&sort=date&order=desc HTTP/1.1
Host: localhost:3001
```

> optional query parameter
>
> - sort=date
> - order=desc, order=asc

<br>

HTTP Response

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json
Content-Length: 671

{
    "status": 200,
    "result": "가계부 조회 성공",
    "data": [
        {
            "date": "2017-11-27",
            "time": "23:07",
            "bank": "토스뱅크",
            "category": "transportation",
            "amount": 1500,
            "content": "교통비 냠냠",
            "transactionType": "expension"
        },
        {
            "date": "2017-11-17",
            "time": "23:07",
            "bank": "카카오뱅크",
            "category": "food",
            "amount": 3000,
            "content": "김밥 냠냠",
            "transactionType": "expension"
        },
        {
            "date": "2017-11-17",
            "time": "11:07",
            "bank": "카카오뱅크",
            "category": "travel",
            "amount": 10000,
            "content": "여행 냠냠",
            "transactionType": "expension"
        },
        {
            "date": "2017-11-03",
            "time": "23:07",
            "bank": "국민은행",
            "category": "salary",
            "amount": 1000000,
            "content": "월급 냠냠",
            "transactionType": "revenue"
        }
    ]
}
```

- 가계부 목록 조회 시의 query parameter를 바탕으로 해당 달의 가계부 목록들을 조회할 수 있습니다.

- year와 month는 반드시 지정해야 합니다.
- sort와 order를 추가하여 날짜순으로 정렬할 수 있습니다.

  - sort와 order를 추가하지 않은 경우, 가계부 목록은 date 필드와 상관없이 저장 순서대로 데이터를 응답합니다.

  <br>

#### 손익계산서 조회

HTTP Request

```http
GET /statements?year=2023&month=07 HTTP/1.1
Host: localhost:3001
```

<br>

HTTP Response

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json
Content-Length: 244

{
    "status": 200,
    "result": "손익계산서 조회 성공",
    "data": {
        "expense": {
            "food": 3000,
            "travel": 10000,
            "transportation": 1500,
            "housing": 0,
            "education": 0,
            "tax": 0
        },
        "revenue": {
            "salary": 1000000,
            "pension": 0
        },
        "totalExpense": 14500,
        "totalRevenue": 1000000
    }
}
```

- 사용자가 가계부 입력 시, 기입한 category를 바탕으로 손익계산서를 갱신합니다.

<br>

### Entity Diagram

- 메모리 데이터베이스(JS의 Map)를 사용하였습니다.

#### Accounts

```JSON
accounts = {
    "2023-11": [account_obj1, account_obj2, ...]
}
```

> - 가계부 목록은 "년도-월" 을 key로 하여 저장됩니다.
> - 가계부 목록은 배열로 관리됩니다.
>   - 배열의 요소는 account 객체입니다.

```JSON
account_obj = {
    "date": "2017-11-27",
    "time": "23:07",
    "bank": "토스뱅크",
    "category": "transportation",
    "amount": 1500,
    "content": "교통비 냠냠",
    "transactionType": "expension"
}
```

<br>

#### Statements

```JSON
statements = {
    "2023-11": statement_obj
}
```

> - 손익계산서는 "년도-월" 을 key로 하여 저장됩니다.
> - 손익계산서 value는 statement 객체입니다.

```JSON
statements_obj = {
    "expense": {
        "food": 1000,
        "travel": 2000,
        "transportation": 3000,
        "housing": 5000,
        "education": 1000,
        "tax": 2000
    },
    "totalExpense" : 14000,

    "revenue": {
        "salary": 3000,
        "pension": 5000,
        "total": 8000
    },
    "totalRevenue": 8000
}
```
