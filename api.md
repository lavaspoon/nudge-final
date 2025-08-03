# Nudge API 설계 문서

## 1. 개요

넛지(Nudge) 시스템의 API 설계 문서입니다. 고객 상담 데이터를 분석하고 넛지 효과를 측정하는 시스템입니다.

## 2. API 구조

### 2.1 기본 URL 구조
```
Base URL: /api/v1
```

### 2.2 API 엔드포인트

#### 대시보드 API
- `GET /dashboard` - 대시보드 메인 데이터 조회
- `GET /dashboard/analytics` - 분석 데이터 조회
- `GET /dashboard/trends` - 트렌드 데이터 조회

#### 상담 데이터 API
- `GET /consultations` - 상담 데이터 목록 조회
- `GET /consultations/{id}` - 상담 데이터 상세 조회
- `POST /consultations` - 상담 데이터 등록
- `PUT /consultations/{id}` - 상담 데이터 수정
- `DELETE /consultations/{id}` - 상담 데이터 삭제

#### 넛지 분석 API
- `GET /nudge/analytics` - 넛지 분석 데이터 조회
- `GET /nudge/analytics/monthly` - 월별 넛지 분석
- `GET /nudge/analytics/daily` - 일별 넛지 분석
- `GET /nudge/analytics/group` - 그룹별 넛지 분석

#### 마케팅 타입 API
- `GET /marketing-types` - 마케팅 타입 목록 조회
- `GET /marketing-types/{id}` - 마케팅 타입 상세 조회

#### 부적절 응대 API
- `GET /inappropriate-responses` - 부적절 응대 데이터 조회
- `POST /inappropriate-responses` - 부적절 응대 데이터 등록

## 3. DTO 설계

### 3.1 공통 DTO

#### BaseResponseDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponseDto<T> {
    private boolean success;
    private String message;
    private T data;
    private String timestamp;
    private int statusCode;
}
```

#### PageResponseDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponseDto<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;
}
```

### 3.2 대시보드 DTO

#### DashDto (현재 구현된 구조 개선)
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashDto {
    private MonthAnalyzeDto monthAnalyze;
    private CurrentAnalyzeDto currentAnalyze;
    private List<ConsultationDto> monthDatas;
    private List<ConsultationDto> currentDatas;
}
```

#### MonthAnalyzeDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthAnalyzeDto {
    private int totalCount;
    private long nudgeCount;
    private double nudgePercentage;
    private long group1Count;
    private long group2Count;
    private long group3Count;
    private String period; // "2025-07"
}
```

#### CurrentAnalyzeDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrentAnalyzeDto {
    private int totalCount;
    private long nudgeCount;
    private double nudgePercentage;
    private long group1Count;
    private long group2Count;
    private long group3Count;
    private String group1Growth;
    private String group2Growth;
    private String group3Growth;
    private String date; // "2025-07-29"
}
```

### 3.3 상담 데이터 DTO

#### ConsultationDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDto {
    private Long id;
    private String consultationDate;
    private String skid;
    private String customerInquiry;
    private String nudgeYn;
    private String marketingType;
    private String marketingMessage;
    private String customerConsentYn;
    private String inappropriateResponseYn;
    private String inappropriateResponseMessage;
    private String createdAt;
    private String updatedAt;
}
```

#### ConsultationRequestDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequestDto {
    private String consultationDate;
    private String skid;
    private String customerInquiry;
    private String nudgeYn;
    private String marketingType;
    private String marketingMessage;
    private String customerConsentYn;
    private String inappropriateResponseYn;
    private String inappropriateResponseMessage;
}
```

### 3.4 넛지 분석 DTO

#### NudgeAnalyticsDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NudgeAnalyticsDto {
    private String period;
    private int totalConsultations;
    private int nudgeCount;
    private double nudgeRate;
    private List<GroupAnalyticsDto> groupAnalytics;
    private List<MarketingTypeAnalyticsDto> marketingTypeAnalytics;
}
```

#### GroupAnalyticsDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupAnalyticsDto {
    private String groupName;
    private int count;
    private double percentage;
    private String growth;
}
```

#### MarketingTypeAnalyticsDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketingTypeAnalyticsDto {
    private String marketingType;
    private int count;
    private double successRate;
    private double consentRate;
}
```

### 3.5 마케팅 타입 DTO

#### MarketingTypeDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketingTypeDto {
    private Long id;
    private String name;
    private String description;
    private String category;
    private boolean active;
}
```

### 3.6 부적절 응대 DTO

#### InappropriateResponseDto
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InappropriateResponseDto {
    private Long id;
    private Long consultationId;
    private String responseType;
    private String message;
    private String severity;
    private String reportedBy;
    private String reportedAt;
}
```

## 4. API 응답 예시

### 4.1 대시보드 API 응답
```json
{
    "success": true,
    "message": "대시보드 데이터 조회 성공",
    "data": {
        "monthAnalyze": {
            "totalCount": 500,
            "nudgeCount": 20,
            "nudgePercentage": 4.0,
            "group1Count": 8,
            "group2Count": 7,
            "group3Count": 5,
            "period": "2025-07"
        },
        "currentAnalyze": {
            "totalCount": 25,
            "nudgeCount": 3,
            "nudgePercentage": 12.0,
            "group1Count": 1,
            "group2Count": 1,
            "group3Count": 1,
            "group1Growth": "+1",
            "group2Growth": "0",
            "group3Growth": "+1",
            "date": "2025-07-29"
        },
        "monthDatas": [...],
        "currentDatas": [...]
    },
    "timestamp": "2025-01-27T10:30:00Z",
    "statusCode": 200
}
```

### 4.2 상담 데이터 목록 API 응답
```json
{
    "success": true,
    "message": "상담 데이터 목록 조회 성공",
    "data": {
        "content": [...],
        "page": 0,
        "size": 20,
        "totalElements": 500,
        "totalPages": 25,
        "hasNext": true,
        "hasPrevious": false
    },
    "timestamp": "2025-01-27T10:30:00Z",
    "statusCode": 200
}
```

## 5. 에러 처리

### 5.1 에러 응답 형식
```json
{
    "success": false,
    "message": "에러 메시지",
    "data": null,
    "timestamp": "2025-01-27T10:30:00Z",
    "statusCode": 400,
    "errorCode": "VALIDATION_ERROR",
    "errors": [
        {
            "field": "consultationDate",
            "message": "상담일은 필수입니다"
        }
    ]
}
```

### 5.2 HTTP 상태 코드
- `200` - 성공
- `201` - 생성 성공
- `400` - 잘못된 요청
- `401` - 인증 실패
- `403` - 권한 없음
- `404` - 리소스 없음
- `500` - 서버 오류

## 6. 개선 사항

### 6.1 현재 구조 개선점
1. **타이핑 오류 수정**: `gourp1Count` → `group1Count`
2. **일관성 있는 네이밍**: `curnetDatas` → `currentDatas`
3. **날짜 형식 표준화**: ISO 8601 형식 사용
4. **에러 처리 강화**: 상세한 에러 메시지와 코드 제공
5. **페이지네이션 추가**: 대용량 데이터 처리 개선

### 6.2 추가 기능 제안
1. **필터링 기능**: 날짜, 사번, 마케팅 타입별 필터링
2. **정렬 기능**: 날짜, 넛지율, 동의율별 정렬
3. **통계 API**: 다양한 차원의 통계 데이터 제공
4. **엑셀 다운로드**: 데이터 내보내기 기능
5. **실시간 알림**: 부적절 응대 실시간 알림

## 7. 보안 고려사항

1. **인증/인가**: JWT 토큰 기반 인증
2. **데이터 암호화**: 민감한 고객 정보 암호화
3. **API 레이트 리미팅**: 요청 제한 설정
4. **로깅**: API 호출 로그 기록
5. **CORS 설정**: 프론트엔드 도메인 허용

## 8. 성능 최적화

1. **캐싱**: Redis를 활용한 데이터 캐싱
2. **인덱싱**: 데이터베이스 인덱스 최적화
3. **페이징**: 대용량 데이터 페이징 처리
4. **비동기 처리**: 대용량 데이터 처리 시 비동기 처리
5. **CDN**: 정적 리소스 CDN 활용 