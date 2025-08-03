# Nudge 시스템 테이블 설계 문서

## 1. 개요

넛지(Nudge) 시스템의 데이터베이스 테이블 설계 문서입니다. 고객 상담 데이터 분석과 포인트 시스템을 포함합니다.

## 2. 기존 테이블 구조

### 2.1 사용자 테이블 (users)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    position VARCHAR(50),
    employee_id VARCHAR(20) UNIQUE,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department),
    INDEX idx_status (status)
);
```

## 3. 포인트 시스템 테이블 설계 (간소화)

### 3.1 포인트 테이블 (points)
```sql
CREATE TABLE points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    points INT DEFAULT 0 COMMENT '현재 포인트',
    total_earned INT DEFAULT 0 COMMENT '총 적립 포인트',
    total_used INT DEFAULT 0 COMMENT '총 사용 포인트',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_id (user_id),
    INDEX idx_points (points)
);
```

### 3.2 포인트 내역 테이블 (point_history)
```sql
CREATE TABLE point_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    point_type ENUM('DAILY_NUDGE', 'WEEKLY_BONUS', 'MONTHLY_BONUS', 'SPECIAL_EVENT') NOT NULL,
    points INT NOT NULL COMMENT '포인트 (+ 적립, - 사용)',
    reason VARCHAR(200) NOT NULL COMMENT '사유',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_point_type (point_type),
    INDEX idx_created_at (created_at)
);
```

## 4. 상담 데이터 테이블

### 4.1 상담 데이터 테이블 (consultations)
```sql
CREATE TABLE consultations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    consultation_date DATE NOT NULL,
    user_id BIGINT NOT NULL,
    customer_inquiry VARCHAR(200) NOT NULL,
    nudge_yn ENUM('Y', 'N') DEFAULT 'N',
    marketing_type VARCHAR(50) NULL,
    marketing_message TEXT NULL,
    customer_consent_yn ENUM('Y', 'N') DEFAULT 'N',
    inappropriate_response_yn ENUM('Y', 'N') DEFAULT 'N',
    inappropriate_response_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_consultation_date (consultation_date),
    INDEX idx_user_id (user_id),
    INDEX idx_nudge_yn (nudge_yn),
    INDEX idx_marketing_type (marketing_type),
    INDEX idx_customer_consent_yn (customer_consent_yn)
);
```

## 5. 샘플 데이터

### 5.1 포인트 샘플 데이터
```sql
-- 사용자 포인트 초기화
INSERT INTO points (user_id, points, total_earned, total_used) VALUES
(1, 150, 200, 50),
(2, 80, 120, 40),
(3, 300, 350, 50);

-- 포인트 내역 샘플
INSERT INTO point_history (user_id, point_type, points, reason) VALUES
(1, 'DAILY_NUDGE', 10, '일일 넛지 수행'),
(1, 'WEEKLY_BONUS', 50, '주간 보너스'),
(1, 'SPECIAL_EVENT', -20, '포인트 사용'),
(2, 'DAILY_NUDGE', 10, '일일 넛지 수행'),
(2, 'MONTHLY_BONUS', 200, '월간 보너스');
```

## 6. 포인트 시스템 API 설계

### 6.1 포인트 관련 API 엔드포인트
```
GET /api/v1/points/balance - 포인트 잔액 조회
GET /api/v1/points/history - 포인트 내역 조회
POST /api/v1/points/earn - 포인트 적립
POST /api/v1/points/use - 포인트 사용
```

### 6.2 포인트 DTO 설계
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointBalanceDto {
    private Long userId;
    private int points;
    private int totalEarned;
    private int totalUsed;
    private String lastUpdated;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointHistoryDto {
    private Long id;
    private Long userId;
    private String pointType;
    private int points;
    private String reason;
    private String createdAt;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointRequestDto {
    private Long userId;
    private String pointType;
    private int points;
    private String reason;
}
```

## 7. 포인트 지급 로직

### 7.1 일일 포인트 지급 프로세스
1. **스케줄러 실행**: 매일 정해진 시간에 스케줄러 실행
2. **대상 사용자 조회**: 전날 넛지를 수행한 사용자 조회
3. **포인트 지급**: 조건에 맞는 사용자에게 포인트 지급
4. **내역 기록**: 포인트 내역 테이블에 기록

### 7.2 포인트 사용 프로세스
1. **잔액 확인**: 사용자의 현재 포인트 잔액 확인
2. **포인트 차감**: 사용 포인트만큼 차감
3. **내역 기록**: 포인트 내역 테이블에 사용 기록

## 8. 성능 최적화

### 8.1 인덱스 전략
- 사용자별 포인트 조회를 위한 인덱스
- 포인트 내역 날짜별 조회를 위한 인덱스

### 8.2 캐싱 전략
- 사용자 포인트 잔액 Redis 캐싱
- 실시간 포인트 정보 제공 