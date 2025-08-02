import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Star, MessageSquare, Award, Zap, Users, BarChart3, Trophy, Target, Sparkles, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Home.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('earn');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackTab, setFeedbackTab] = useState('my'); // 'my' or 'colleagues'
    const [animatedValues, setAnimatedValues] = useState({
        nudgeRate: 0,
        nudgeCount: 0,
        todayCount: 0,
        points: 0
    });

    const data = {
        monthAnalyze: {
            totalCount: 500,
            nudgeCount: 20,
            nudgePercentage: 4.0,
            gourp1Count: 8,
            gourp2Count: 7,
            gourp3Count: 5
        },
        currentAnalyze: {
            totalCount: 25,
            nudgeCount: 3,
            nudgePercentage: 12.0,
            gourp1Count: 1,
            gourp2Count: 1,
            gourp3Count: 1,
            group1Growth: "+1",
            group2Growth: "0",
            group3Growth: "+1"
        },
        weeklyData: [
            { day: '월', count: 4 },
            { day: '화', count: 5 },
            { day: '수', count: 3 },
            { day: '목', count: 0 }, // 오늘이 수요일이므로 목금은 0건
            { day: '금', count: 0 }
        ],
        monthlyData: (() => {
            const today = new Date();
            const currentDay = today.getDate();
            const data = [];

            for (let i = 1; i <= currentDay; i++) {
                data.push({
                    date: `${i}일`,
                    count: Math.floor(Math.random() * 7) + 1 // 1-7 사이의 랜덤 값
                });
            }
            return data;
        })(),
        curnetDatas: [
            {
                id: 101,
                consultationDate: "2025-07-29",
                marketingType: "GIGA 전환",
                marketingMessage: "GIGA 상품을 추천드립니다",
                customerConsentYn: "Y"
            },
            {
                id: 102,
                consultationDate: "2025-07-29",
                marketingType: "CRM 전환",
                marketingMessage: "CRM 시스템 전환을 제안드려요",
                customerConsentYn: "Y"
            }
            // TDS 전환 데이터가 없는 경우 예시
        ],
        colleagueSuccessStories: [
            {
                id: 201,
                consultantName: "상담원 A",
                consultantLevel: "💎 플래티넘",
                marketingType: "GIGA 전환",
                marketingMessage: "고객님의 현재 요금제를 분석해보니 GIGA로 바꾸시면 월 2만원 절약하실 수 있어요. 데이터도 무제한으로 사용 가능하시고요!",
                customerConsentYn: "Y",
                bookmarked: false
            },
            {
                id: 202,
                consultantName: "상담원 B",
                consultantLevel: "🥇 골드",
                marketingType: "CRM 전환",
                marketingMessage: "CRM 시스템 도입하시면 고객 관리가 훨씬 체계적으로 되고, 매출도 평균 30% 증가하는 효과가 있습니다. 무료 체험부터 시작해보시는 건 어떠세요?",
                customerConsentYn: "Y",
                bookmarked: true
            }
        ]
    };

    // 숫자 카운트업 애니메이션
    useEffect(() => {
        const duration = 1500;
        const steps = 30;
        const stepTime = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setAnimatedValues({
                nudgeRate: easeOut * data.monthAnalyze.nudgePercentage,
                nudgeCount: Math.floor(easeOut * data.monthAnalyze.nudgeCount),
                todayCount: Math.floor(easeOut * data.currentAnalyze.nudgeCount),
                points: Math.floor(easeOut * 2450)
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setAnimatedValues({
                    nudgeRate: data.monthAnalyze.nudgePercentage,
                    nudgeCount: data.monthAnalyze.nudgeCount,
                    todayCount: data.currentAnalyze.nudgeCount,
                    points: 2450
                });
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, []);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

    const getGrowthIcon = (growth) => {
        if (growth.includes('+')) return <TrendingUp className="growth-icon up" />;
        if (growth.includes('-')) return <TrendingDown className="growth-icon down" />;
        return <Minus className="growth-icon neutral" />;
    };

    // X축 간격 계산 함수
    const getXAxisInterval = (dataLength) => {
        if (dataLength <= 10) return 0; // 10일 이하면 모든 라벨 표시
        if (dataLength <= 20) return 1; // 11-20일이면 2일마다 표시
        return 2; // 21일 이상이면 3일마다 표시
    };

    const dailyProgress = Math.min((animatedValues.todayCount / data.currentAnalyze.totalCount) * 100 * 8, 100); // 일일 넛지율 기반

    // 등급 시스템
    const gradeSystem = [
        { name: '브론즈', min: 0, max: 999, color: 'amber', icon: '🥉' },
        { name: '실버', min: 1000, max: 2499, color: 'gray', icon: '🥈' },
        { name: '골드', min: 2500, max: 4999, color: 'yellow', icon: '🥇' },
        { name: '플래티넘', min: 5000, max: 999999, color: 'purple', icon: '💎' }
    ];

    const getCurrentGrade = (points) => {
        return gradeSystem.find(grade => points >= grade.min && points <= grade.max);
    };

    const getNextGrade = (points) => {
        return gradeSystem.find(grade => points < grade.min);
    };

    const currentGrade = getCurrentGrade(animatedValues.points);
    const nextGrade = getNextGrade(animatedValues.points);
    const gradeProgress = nextGrade ?
        ((animatedValues.points - currentGrade.min) / (nextGrade.min - currentGrade.min)) * 100 : 100;

    // 북마크 토글 함수
    const toggleBookmark = (storyId) => {
        // 실제 구현에서는 서버에 요청을 보내겠지만, 여기서는 로컬 상태로 시뮬레이션
        console.log(`북마크 토글: ${storyId}`);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                {/* 환영 메시지 */}
                <div className="welcome-message">
                    <div className="message-content">
                        <h1>안녕하세요, <span className="highlight">김상담님</span> 👋</h1>
                        <p>오늘도 좋은 하루 되세요!</p>
                    </div>
                    <div className="success-notification">
                        <div className="notification-content">
                            <div className="notification-header">
                                <span className="consultant-name">박상담님</span>이 성공했습니다
                            </div>
                            <div className="success-message">
                                "고객님의 현재 요금제를 분석해보니 GIGA로 바꾸시면 월 2만원 절약하실 수 있어요"
                            </div>
                        </div>
                    </div>
                </div>

                {/* 통합된 주요 지표 */}
                <section className="kpi-section">
                    <div className="section-title">
                        <div className="title-indicator"></div>
                        <h2>주요 지표</h2>
                    </div>

                    <div className="kpi-grid">
                        {/* 넛지율 */}
                        <div className="kpi-card nudge-rate">
                            <div className="card-header">
                                <div className="card-title">
                                    <Target className="icon" />
                                    <span>이번달 넛지율</span>
                                </div>
                                {animatedValues.nudgeRate >= 4.0 && (
                                    <div className="achievement-indicator">
                                        <Trophy className="icon" />
                                    </div>
                                )}
                            </div>

                            <div className="nudge-stats">
                                <div className="main-stats">
                                    <div className="rate-value">
                                        {animatedValues.nudgeRate.toFixed(1)}<span>%</span>
                                    </div>

                                    <div className="stat-group-compact">
                                        <div className="stat-item">
                                            <span className="stat-value highlight">{animatedValues.nudgeCount}</span>
                                            <span className="stat-label">내 넛지 성공</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-value">{data.monthAnalyze.totalCount}</span>
                                            <span className="stat-label">전체 통화</span>
                                        </div>
                                    </div>

                                    {/* 팀 평균 비교 */}
                                    <div className="team-comparison">
                                        <div className="comparison-item">
                                            <span className="comparison-label">팀 평균</span>
                                            <span className="comparison-value">18건</span>
                                        </div>
                                        <div className="comparison-item">
                                            <span className="comparison-label">내 순위</span>
                                            <span className="comparison-value positive">#3</span>
                                        </div>
                                    </div>

                                    {/* 목표 달성률 */}
                                    <div className="goal-progress">
                                        <div className="goal-header">
                                            <span>월 목표 달성률</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 한달 넛지건수 그래프 */}
                                <div className="monthly-chart">
                                    <div className="chart-header">
                                        <span className="chart-title">한달 넛지 성공 건수</span>
                                        <span className="chart-trend">📊 총 {data.monthlyData.reduce((sum, item) => sum + item.count, 0)}건</span>
                                    </div>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={220}>
                                            <LineChart data={data.monthlyData} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    interval={getXAxisInterval(data.monthlyData.length)}
                                                />
                                                <YAxis
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    domain={[0, 10]}
                                                    ticks={[0, 2, 4, 6, 8, 10]}
                                                    width={30}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                                                />
                                                <Line
                                                    type="natural"
                                                    dataKey="count"
                                                    stroke="url(#lineGradient)"
                                                    strokeWidth={4}
                                                    dot={{
                                                        fill: '#3b82f6',
                                                        stroke: '#ffffff',
                                                        strokeWidth: 3,
                                                        r: 5,
                                                        filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                                                    }}
                                                    activeDot={{
                                                        r: 8,
                                                        stroke: '#3b82f6',
                                                        strokeWidth: 3,
                                                        fill: '#ffffff',
                                                        filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))'
                                                    }}
                                                />
                                                <defs>
                                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#3b82f6" />
                                                        <stop offset="50%" stopColor="#60a5fa" />
                                                        <stop offset="100%" stopColor="#3b82f6" />
                                                    </linearGradient>
                                                </defs>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 전환 현황 & 어제 성과 통합 */}
                        <div className="kpi-card conversion-performance">
                            <div className="card-header">
                                <BarChart3 className="icon" />
                                <span>전환 현황 & 어제 성과</span>
                            </div>

                            {/* 어제 성과 요약 */}
                            <div className="yesterday-summary">
                                <div className="performance-stats">
                                    <div className="stat-item">
                                        <div className="stat-value highlight">{animatedValues.todayCount}</div>
                                        <div className="stat-label">어제 넛지 성공</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{data.currentAnalyze.nudgePercentage}%</div>
                                        <div className="stat-label">성공률</div>
                                    </div>
                                    <div className="trend-info positive">
                                        <TrendingUp className="icon" />
                                        <span>전일 대비 +{data.currentAnalyze.nudgeCount}건</span>
                                    </div>
                                </div>
                            </div>

                            {/* 전환 현황 */}
                            <div className="conversion-grid">
                                <div className="conversion-item">
                                    <div className="value pink">{data.currentAnalyze.gourp1Count}</div>
                                    <div className="label">GIGA</div>
                                    <div className="growth">
                                        {getGrowthIcon(data.currentAnalyze.group1Growth)}
                                        <span>{data.currentAnalyze.group1Growth}</span>
                                    </div>
                                </div>
                                <div className="conversion-item">
                                    <div className="value blue">{data.currentAnalyze.gourp2Count}</div>
                                    <div className="label">CRM</div>
                                    <div className="growth">
                                        {getGrowthIcon(data.currentAnalyze.group2Growth)}
                                        <span>유지</span>
                                    </div>
                                </div>
                                <div className="conversion-item">
                                    <div className="value green">{data.currentAnalyze.gourp3Count}</div>
                                    <div className="label">TDS</div>
                                    <div className="growth">
                                        {getGrowthIcon(data.currentAnalyze.group3Growth)}
                                        <span>{data.currentAnalyze.group3Growth}</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI 응원 멘트 */}
                            <div className="ai-encouragement">
                                <div className="ai-avatar">🤖</div>
                                <div className="encouragement-content">
                                    <div className="encouragement-text">
                                        "어제보다 더 좋은 성과를 보이고 계시네요! 이런 추세라면 이번 달 목표 달성도 충분히 가능해 보입니다. 파이팅! 💪"
                                    </div>
                                    <div className="ai-signature">- AI 어시스턴트</div>
                                </div>
                            </div>
                        </div>

                        {/* Vimeo 영상 */}
                        <div className="kpi-card video-section">
                            <div className="card-header">
                                <div className="card-title">
                                    <MessageSquare className="icon" />
                                    <span>교육 영상</span>
                                </div>
                                <button
                                    className="more-button"
                                    onClick={() => window.open('https://www.google.com', '_blank')}
                                >
                                    더보기 →
                                </button>
                            </div>
                            <div className="video-container">
                                <iframe
                                    src="https://player.vimeo.com/video/998263129?badge=0&autopause=0&player_id=0&app_id=58479"
                                    width="100%"
                                    height="260"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title="교육 영상"
                                ></iframe>
                            </div>
                            <div className="video-description">
                                📚 고객 상담 스킬 향상을 위한 실전 교육 영상 - 넛지 기법 활용법
                            </div>
                        </div>
                    </div>
                </section>

                {/* 하단 상세 정보 */}
                <div className="detail-grid">
                    {/* 등급 시스템 & 포인트 통합 */}
                    <div className="points-section">
                        <div className="section-header">
                            <div className="title-group">
                                <div className="title-indicator amber"></div>
                                <h2>등급 시스템 & 포인트</h2>
                            </div>
                            <div className="points-badge">이번주 +300P ✨</div>
                        </div>

                        <div className="points-cards">
                            {/* 통합된 포인트 & 등급 시스템 카드 */}
                            <div className="integrated-points-grade-card">
                                <div className="points-grade-content">
                                    {/* 포인트 정보 섹션 */}
                                    <div className="points-section-content">
                                        <div className="current-points">{animatedValues.points.toLocaleString()}</div>
                                        <div className="points-label">현재 보유 포인트</div>

                                        <div className="grade-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className={`progress-fill ${currentGrade.color}`}
                                                    style={{ width: `${gradeProgress}%` }}
                                                ></div>
                                            </div>
                                            <div className="progress-label">
                                                {nextGrade ? `${nextGrade.name}까지 ${nextGrade.min - animatedValues.points}P` : '최고 등급!'}
                                            </div>
                                        </div>

                                        <div className={`grade-badge ${currentGrade.color}`}>
                                            <span>{currentGrade.icon}</span>
                                            <span>{currentGrade.name} 등급</span>
                                        </div>

                                        <div className="team-rank-info">
                                            팀 내 순위 #3 | 2위까지 50포인트 남음
                                        </div>

                                        {/* 포인트 내역 버튼 */}
                                        <button
                                            className="points-history-button-inline"
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            <div className="button-content-inline">
                                                <div className="button-icon">📊</div>
                                                <div className="button-text">
                                                    <div className="button-title">포인트 내역 보기</div>
                                                </div>
                                                <div className="button-arrow">→</div>
                                            </div>
                                        </button>

                                        {/* 포인트 상점 버튼 */}
                                        <button
                                            className="points-shop-button-inline"
                                            onClick={() => alert('준비중입니다.')}
                                        >
                                            <div className="button-content-inline">
                                                <div className="button-icon">🛍️</div>
                                                <div className="button-text">
                                                    <div className="button-title">포인트 상점</div>
                                                </div>
                                                <div className="button-arrow">→</div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* 등급 시스템 섹션 */}
                                    <div className="grade-system-content">
                                        <h3 className="grade-system-title">
                                            <Trophy className="icon" />
                                            <span>등급 시스템</span>
                                        </h3>

                                        <div className="grade-list">
                                            {gradeSystem.map((grade, index) => (
                                                <div key={grade.name}
                                                    className={`grade-item ${grade.name === currentGrade.name ? 'active' : ''} ${grade.color}`}>
                                                    <div className="grade-info">
                                                        <span className="grade-icon">{grade.icon}</span>
                                                        <span className="grade-name">{grade.name}</span>
                                                        {grade.name === currentGrade.name && (
                                                            <span className="current-badge">현재</span>
                                                        )}
                                                    </div>
                                                    <span className="grade-points">
                                                        {grade.max === 999999 ? `${grade.min.toLocaleString()}P+` : `${grade.min}-${grade.max.toLocaleString()}P`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 현재 등급 혜택 */}
                                        <div className={`grade-benefits ${currentGrade.color}`}>
                                            <div className="benefits-header">
                                                <span>{currentGrade.icon} {currentGrade.name} 등급 혜택</span>
                                            </div>
                                            <div className="benefits-list">
                                                {currentGrade.name === '브론즈' && (
                                                    <>
                                                        <div>• 기본 적립률 1%</div>
                                                        <div>• 월 1회 무료 음료</div>
                                                    </>
                                                )}
                                                {currentGrade.name === '실버' && (
                                                    <>
                                                        <div>• 적립률 1.5% (현재 등급)</div>
                                                        <div>• 월 2회 무료 음료</div>
                                                        <div>• 우선 상담 지원</div>
                                                    </>
                                                )}
                                                {currentGrade.name === '골드' && (
                                                    <>
                                                        <div>• 적립률 2%</div>
                                                        <div>• 월 3회 무료 음료</div>
                                                        <div>• 전용 라운지 이용</div>
                                                        <div>• 특별 교육 프로그램</div>
                                                    </>
                                                )}
                                                {currentGrade.name === '플래티넘' && (
                                                    <>
                                                        <div>• 적립률 3%</div>
                                                        <div>• 무제한 음료</div>
                                                        <div>• VIP 라운지 이용</div>
                                                        <div>• 1:1 멘토링</div>
                                                        <div>• 연말 특별 보너스</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* AI 피드백 섹션 */}
                    <div className="feedback-section">
                        <div className="section-header">
                            <div className="title-group">
                                <div className="title-indicator purple"></div>
                                <h2>AI 피드백</h2>
                            </div>
                            <div className="ai-badge">🤖 실시간 분석</div>
                        </div>

                        <div className="feedback-card">
                            {/* 피드백 탭 버튼 */}
                            <div className="feedback-tabs">
                                <button
                                    onClick={() => setFeedbackTab('my')}
                                    className={`feedback-tab ${feedbackTab === 'my' ? 'active' : ''}`}
                                >
                                    내 피드백
                                </button>
                                <button
                                    onClick={() => setFeedbackTab('colleagues')}
                                    className={`feedback-tab ${feedbackTab === 'colleagues' ? 'active' : ''}`}
                                >
                                    동료 성공사례
                                </button>
                            </div>

                            <div className="feedback-list">
                                {feedbackTab === 'my' ? (
                                    // 내 피드백
                                    data.curnetDatas.length > 0 ? (
                                        data.curnetDatas.map((item, index) => (
                                            <div key={item.id} className="feedback-item">
                                                <div className="feedback-header">
                                                    <div className="type-info">
                                                        <span className={`type-indicator ${item.marketingType === 'GIGA 전환' ? 'pink' :
                                                            item.marketingType === 'CRM 전환' ? 'blue' :
                                                                'green'
                                                            }`}></span>
                                                        <span className="type-name">{item.marketingType}</span>
                                                    </div>
                                                    <span className={`status-badge ${item.customerConsentYn === 'Y' ? 'success' : 'warning'
                                                        }`}>
                                                        {item.customerConsentYn === 'Y' ? '성공 🎉' : '개선점 💡'}
                                                    </span>
                                                </div>

                                                <div className="message">
                                                    "{item.marketingMessage}"
                                                </div>

                                                <div className="ai-comment">
                                                    {item.customerConsentYn === 'Y'
                                                        ? "완벽한 접근! 고객 니즈 파악이 정확했고 타이밍도 좋았어요. 이런 식으로 계속 하시면 더 좋은 성과를 얻을 수 있을 거예요!"
                                                        : "좋은 시도! 다음엔 '이런 혜택이 있어서 도움될 것 같아서요'라고 구체적 이유를 제시해보세요."
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data-message">
                                            <div className="no-data-icon">📊</div>
                                            <div className="no-data-text">오늘은 아직 피드백할 데이터가 없네요!</div>
                                            <div className="no-data-subtext">상담을 진행하시면 AI가 분석해드릴게요.</div>
                                        </div>
                                    )
                                ) : (
                                    // 동료 성공사례
                                    data.colleagueSuccessStories.map((story, index) => (
                                        <div key={story.id} className="feedback-item colleague-story">
                                            <div className="feedback-header">
                                                <div className="consultant-info">
                                                    <div className="consultant-profile">
                                                        <span className="consultant-name">{story.consultantName}</span>
                                                        <span className={`consultant-level ${story.consultantLevel.includes('브론즈') ? 'bronze' :
                                                            story.consultantLevel.includes('실버') ? 'silver' :
                                                                story.consultantLevel.includes('골드') ? 'gold' :
                                                                    story.consultantLevel.includes('플래티넘') ? 'platinum' : ''
                                                            }`}>{story.consultantLevel}</span>
                                                    </div>
                                                    <div className="type-info">
                                                        <span className={`type-indicator ${story.marketingType === 'GIGA 전환' ? 'pink' :
                                                            story.marketingType === 'CRM 전환' ? 'blue' :
                                                                'green'
                                                            }`}></span>
                                                        <span className="type-name">{story.marketingType}</span>
                                                    </div>
                                                </div>
                                                <div className="story-actions">
                                                    <button
                                                        className={`bookmark-btn ${story.bookmarked ? 'bookmarked' : ''}`}
                                                        onClick={() => toggleBookmark(story.id)}
                                                    >
                                                        {story.bookmarked ? '🔖' : '📌'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="message colleague-message">
                                                "{story.marketingMessage}"
                                            </div>

                                            <div className="story-tip">
                                                💡 <strong>성공 포인트:</strong> 구체적인 수치와 고객 맞춤형 혜택을 강조하여 설득력을 높였습니다.
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 포인트 내역 모달 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>포인트 내역</h3>
                            <button
                                className="modal-close"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="tab-buttons">
                                <button
                                    onClick={() => setActiveTab('earn')}
                                    className={`tab-button ${activeTab === 'earn' ? 'active' : ''}`}
                                >
                                    적립 🎯
                                </button>
                                <button
                                    onClick={() => setActiveTab('use')}
                                    className={`tab-button ${activeTab === 'use' ? 'active' : ''}`}
                                >
                                    사용 🛍️
                                </button>
                            </div>

                            <div className="history-list">
                                {activeTab === 'earn' ? (
                                    <>
                                        <div className="history-item earn">
                                            <div className="item-info">
                                                <div className="emoji">🎉</div>
                                                <div>
                                                    <div className="item-title">넛지 성공 보너스</div>
                                                    <div className="item-date">07.29</div>
                                                </div>
                                            </div>
                                            <div className="item-points">+150</div>
                                        </div>
                                        <div className="history-item earn">
                                            <div className="item-info">
                                                <div className="emoji">⭐</div>
                                                <div>
                                                    <div className="item-title">고객 만족도 우수</div>
                                                    <div className="item-date">07.28</div>
                                                </div>
                                            </div>
                                            <div className="item-points">+100</div>
                                        </div>
                                        <div className="history-item earn">
                                            <div className="item-info">
                                                <div className="emoji">🎯</div>
                                                <div>
                                                    <div className="item-title">일일 성과 달성</div>
                                                    <div className="item-date">07.27</div>
                                                </div>
                                            </div>
                                            <div className="item-points">+50</div>
                                        </div>
                                        <div className="history-item earn">
                                            <div className="item-info">
                                                <div className="emoji">🏆</div>
                                                <div>
                                                    <div className="item-title">주간 성과 1위</div>
                                                    <div className="item-date">07.26</div>
                                                </div>
                                            </div>
                                            <div className="item-points">+200</div>
                                        </div>
                                        <div className="history-item earn">
                                            <div className="item-info">
                                                <div className="emoji">🎖️</div>
                                                <div>
                                                    <div className="item-title">월간 우수상담원</div>
                                                    <div className="item-date">07.25</div>
                                                </div>
                                            </div>
                                            <div className="item-points">+300</div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="history-item use">
                                            <div className="item-info">
                                                <div className="emoji">☕</div>
                                                <div>
                                                    <div className="item-title">카페 기프티콘</div>
                                                    <div className="item-date">07.25</div>
                                                </div>
                                            </div>
                                            <div className="item-points">-500</div>
                                        </div>
                                        <div className="history-item use">
                                            <div className="item-info">
                                                <div className="emoji">🛍️</div>
                                                <div>
                                                    <div className="item-title">편의점 상품권</div>
                                                    <div className="item-date">07.20</div>
                                                </div>
                                            </div>
                                            <div className="item-points">-1000</div>
                                        </div>
                                        <div className="history-item use">
                                            <div className="item-info">
                                                <div className="emoji">🍔</div>
                                                <div>
                                                    <div className="item-title">점심 식사권</div>
                                                    <div className="item-date">07.18</div>
                                                </div>
                                            </div>
                                            <div className="item-points">-800</div>
                                        </div>
                                        <div className="history-item use">
                                            <div className="item-info">
                                                <div className="emoji">🎁</div>
                                                <div>
                                                    <div className="item-title">문화상품권</div>
                                                    <div className="item-date">07.15</div>
                                                </div>
                                            </div>
                                            <div className="item-points">-1500</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home; 