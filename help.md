# API 규격 변경 가이드

## 개요
현재 대시보드에서 사용하는 데이터 구조를 기반으로 API 규격을 개선하여 더 효율적이고 확장 가능한 구조로 변경합니다.

## 주요 변경 사항

### 1. 기존 API 구조 유지
현재 `DashDto` 구조는 그대로 유지하되, 일부 필드명 오타 수정 및 추가 필드 도입

### 2. 필드명 오타 수정
```java
// 변경 전
private long gourp1Count; // 오타
private long gourp2Count; // 오타  
private long gourp3Count; // 오타

// 변경 후
private long group1Count; // 수정
private long group2Count; // 수정
private long group3Count; // 수정
```

### 3. 새로운 API 엔드포인트 추가

#### 3.1 포인트 시스템 API
```java
// GET /api/points/summary
public class PointsSummaryDto {
    private int currentPoints;           // 현재 보유 포인트
    private String currentGrade;         // 현재 등급 (브론즈, 실버, 골드, 플래티넘)
    private int teamRank;                // 팀 내 순위
    private int pointsToNextRank;        // 다음 등급까지 필요한 포인트
    private int weeklyEarnedPoints;      // 이번주 획득 포인트
    private List<PointsHistoryDto> recentHistory; // 최근 포인트 내역 (최대 10개)
}

public class PointsHistoryDto {
    private Long id;
    private String title;                // 포인트 획득/사용 제목
    private int points;                  // 포인트 (+/-)
    private String type;                 // EARN/USE
    private String date;                 // 날짜
    private String description;          // 상세 설명
}
```

#### 3.2 AI 피드백 API
```java
// GET /api/feedback/my
public class MyFeedbackDto {
    private List<FeedbackItemDto> feedbacks;
    private int totalCount;
}

// GET /api/feedback/colleagues  
public class ColleagueFeedbackDto {
    private List<ColleagueStoryDto> stories;
    private int totalCount;
}

public class FeedbackItemDto {
    private Long id;
    private String consultationDate;
    private String marketingType;        // GIGA 전환, CRM 전환, TDS 전환
    private String marketingMessage;     // 실제 멘트
    private String customerConsentYn;    // Y/N
    private String aiComment;            // AI 분석 코멘트
    private String status;               // success/warning
}

public class ColleagueStoryDto {
    private Long id;
    private String consultantName;       // 상담원 이름
    private String consultantLevel;      // 등급 (브론즈, 실버, 골드, 플래티넘)
    private String marketingType;        // 마케팅 유형
    private String marketingMessage;     // 성공 멘트
    private String customerConsentYn;    // Y/N
    private boolean bookmarked;          // 북마크 여부
    private String successTip;           // 성공 포인트
}
```

#### 3.3 차트 데이터 API (선택적)
```java
// GET /api/charts/monthly-nudge (별도 API로 분리하는 경우)
public class MonthlyNudgeChartDto {
    private List<DailyNudgeData> data;
    private int totalCount;
    private String currentMonth;         // 현재 월 (YYYY-MM)
}
```

### 4. 기존 API 개선 사항

#### 4.1 DashDto 개선
```java
public class DashDto {
    private MonthAnalyze monthAnalyze;
    private CurrentAnalyze currentAnalyze;
    private List<NudgeResponseDto> monthDatas;
    private List<NudgeResponseDto> currentDatas;  // curnetDatas -> currentDatas로 수정
    
    // 추가 필드
    private TeamComparisonDto teamComparison;     // 팀 평균 비교
    private GoalProgressDto goalProgress;         // 목표 달성률
    private MonthlyComparisonDto monthlyComparison; // 전월 대비 성과
    private List<DailyNudgeData> monthlyNudgeData; // 이달 날짜별 넛지건수
}

public class TeamComparisonDto {
    private int teamAverage;             // 팀 평균 넛지 건수
    private int myRank;                  // 내 순위
    private int totalTeamMembers;        // 전체 팀원 수
}

public class GoalProgressDto {
    private int monthlyGoal;             // 월 목표
    private int currentProgress;         // 현재 달성률 (%)
    private int remainingDays;           // 남은 일수
}

public class MonthlyComparisonDto {
    private double previousMonthRate;    // 전월 넛지율
    private double currentMonthRate;     // 이번달 넛지율
    private double improvementRate;      // 개선률
}
```

### 5. 새로운 상수 정의
```java
public class MarketingType {
    public static final String GIGA = "GIGA 전환";
    public static final String CRM = "CRM 전환";
    public static final String TDS = "TDS 전환";
}

public class Grade {
    public static final String BRONZE = "브론즈";
    public static final String SILVER = "실버";
    public static final String GOLD = "골드";
    public static final String PLATINUM = "플래티넘";
}
```

## API 엔드포인트 목록

### 기존 API
- `GET /api/dashboard` - 대시보드 메인 데이터

### 새로운 API
- `GET /api/points/summary` - 포인트 요약 정보
- `GET /api/points/history` - 포인트 내역 (페이지네이션)
- `GET /api/feedback/my` - 내 피드백 목록
- `GET /api/feedback/colleagues` - 동료 성공사례 목록
- `POST /api/feedback/bookmark/{id}` - 동료 사례 북마크 토글

## 데이터베이스 스키마 변경

### 새로운 테이블
```sql
-- 포인트 시스템
CREATE TABLE points_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    skid VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    points INT NOT NULL,
    type VARCHAR(10) NOT NULL, -- EARN/USE
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI 피드백
CREATE TABLE ai_feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    consultation_id BIGINT NOT NULL,
    ai_comment TEXT NOT NULL,
    status VARCHAR(20) NOT NULL, -- success/warning
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 동료 성공사례
CREATE TABLE colleague_stories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    consultant_name VARCHAR(50) NOT NULL,
    consultant_level VARCHAR(20) NOT NULL,
    marketing_type VARCHAR(50) NOT NULL,
    marketing_message TEXT NOT NULL,
    success_tip TEXT,
    bookmarked_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 북마크
CREATE TABLE bookmarks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    skid VARCHAR(20) NOT NULL,
    story_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_bookmark (skid, story_id)
);
```

## 마이그레이션 계획

### Phase 1: 기존 API 수정
1. 필드명 오타 수정 (gourp -> group)
2. 새로운 필드 추가 (teamComparison, goalProgress, monthlyComparison)

### Phase 2: 새로운 API 개발
1. 포인트 시스템 API 개발
2. AI 피드백 API 개발
3. 차트 데이터 API 개발

### Phase 3: 데이터베이스 마이그레이션
1. 새로운 테이블 생성
2. 기존 데이터 마이그레이션
3. 인덱스 최적화

## 프론트엔드 연동 가이드

### 1. API 호출 방식 변경
```javascript
// 기존
const response = await fetch('/api/dashboard');

// 새로운 방식 (차트 데이터는 첫 번째 API에 포함됨)
const [dashboardData, pointsData, feedbackData] = await Promise.all([
    fetch('/api/dashboard'),  // monthlyNudgeData 포함
    fetch('/api/points/summary'),
    fetch('/api/feedback/my')
]);
```

### 2. 데이터 구조 변경
```javascript
// 기존 데이터 구조 유지하면서 새로운 필드 추가
const data = {
    ...dashboardData,
    points: pointsData,
    feedback: feedbackData
};
```

## 성능 최적화 고려사항

1. **캐싱 전략**: 포인트 데이터는 1시간, 피드백 데이터는 30분 캐시
2. **페이지네이션**: 포인트 내역, 피드백 목록에 페이지네이션 적용
3. **인덱스 최적화**: 자주 조회되는 필드에 인덱스 추가
4. **API 응답 시간**: 각 API 응답 시간 200ms 이하 유지

## 보안 고려사항

1. **인증**: 모든 API에 JWT 토큰 인증 적용
2. **권한**: 본인 데이터만 조회 가능하도록 권한 체크
3. **입력 검증**: 모든 입력값에 대한 검증 로직 추가
4. **로깅**: 중요 API 호출에 대한 로깅 추가 