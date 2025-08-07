import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Star, MessageSquare, Award, Zap, Users, BarChart3, Trophy, Target, Sparkles, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

    // 주차별 데이터 생성 함수
    const generateWeeklyData = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // 이번달 첫날과 오늘까지의 주차 계산
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const currentWeek = Math.ceil((today.getDate() + firstDayOfMonth.getDay()) / 7);

        // 저번달 데이터 (완전한 4주)
        const lastMonthData = [
            { lastMonth: Math.floor(Math.random() * 6) + 2 },
            { lastMonth: Math.floor(Math.random() * 7) + 3 },
            { lastMonth: Math.floor(Math.random() * 8) + 4 },
            { lastMonth: Math.floor(Math.random() * 9) + 5 }
        ];

        // 이번달 4주차까지의 데이터 생성
        const thisMonthData = [];
        for (let i = 1; i <= 4; i++) {
            const baseData = lastMonthData[i - 1];
            thisMonthData.push({
                week: `${i}주차`,
                // 현재 주차까지만 thisMonth 데이터 포함, 이후는 null
                thisMonth: i <= currentWeek ?
                    (i === currentWeek ?
                            Math.floor(Math.random() * 5) + 2 : // 현재 주차는 진행중이므로 낮게
                            Math.floor(Math.random() * 10) + 5  // 완료된 주차
                    ) : null, // null로 설정하면 해당 부분에 선이 그어지지 않음
                lastMonth: baseData.lastMonth
            });
        }

        return thisMonthData;
    };

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
        weeklyData: generateWeeklyData(),
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

    // 커스텀 툴팁 컴포넌트
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{`${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="tooltip-value" style={{ color: entry.color }}>
                            {`${entry.name === 'thisMonth' ? '이번달' : '저번달'}: ${entry.value}건`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // 월별 총합 계산
    const thisMonthTotal = data.weeklyData.reduce((sum, week) => sum + week.thisMonth, 0);
    const lastMonthTotal = data.weeklyData.reduce((sum, week) => sum + week.lastMonth, 0);
    const monthComparison = thisMonthTotal - lastMonthTotal;

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                {/* 환영 메시지 */}
                <div className="welcome-message">
                    <div className="message-content">
                        <h1>안녕하세요, <span className="highlight">김상담님</span> 👋</h1>
                        <p>오늘도 좋은 하루 되세요!</p>
                    </div>
                    <div className="team-ranking">
                        <div className="ranking-content">
                            <div className="team-info">
                                <span className="team-name">마케팅1팀</span>
                                <span className="team-rank">현재 전체 3위</span>
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
                            <div className="conversion-section">
                                <div className="section-subtitle">
                                    <span>📊 상품별 전환 현황</span>
                                </div>
                                <div className="conversion-grid">
                                    <div className="conversion-item">
                                        <div className="value pink">{data.currentAnalyze.gourp1Count}</div>
                                        <div className="label">GIGA</div>
                                        <div className="growth">
                                            {getGrowthIcon(data.currentAnalyze.group1Growth)}
                                            <span>{data.currentAnalyze.group1Growth}</span>
                                        </div>
                                        <div className="conversion-rate">전환률 4.2%</div>
                                    </div>
                                    <div className="conversion-item">
                                        <div className="value blue">{data.currentAnalyze.gourp2Count}</div>
                                        <div className="label">CRM</div>
                                        <div className="growth">
                                            {getGrowthIcon(data.currentAnalyze.group2Growth)}
                                            <span>유지</span>
                                        </div>
                                        <div className="conversion-rate">전환률 3.1%</div>
                                    </div>
                                    <div className="conversion-item">
                                        <div className="value green">{data.currentAnalyze.gourp3Count}</div>
                                        <div className="label">TDS</div>
                                        <div className="growth">
                                            {getGrowthIcon(data.currentAnalyze.group3Growth)}
                                            <span>{data.currentAnalyze.group3Growth}</span>
                                        </div>
                                        <div className="conversion-rate">전환률 2.8%</div>
                                    </div>
                                </div>
                            </div>

                            {/* 이번주 일별 성과 - 컴팩트 버전 */}
                            <div className="weekly-performance-compact">
                                <div className="performance-header">
                                    <span className="performance-title">📈 이번주</span>
                                </div>
                                <div className="daily-grid-compact">
                                    <div className="daily-item-compact">
                                        <div className="day-compact">월</div>
                                        <div className="day-value-compact">4</div>
                                    </div>
                                    <div className="daily-item-compact">
                                        <div className="day-compact">화</div>
                                        <div className="day-value-compact">5</div>
                                    </div>
                                    <div className="daily-item-compact">
                                        <div className="day-compact">수</div>
                                        <div className="day-value-compact">3</div>
                                    </div>
                                    <div className="daily-item-compact today">
                                        <div className="day-compact">목</div>
                                        <div className="day-value-compact">{animatedValues.todayCount}</div>
                                    </div>
                                    <div className="daily-item-compact future">
                                        <div className="day-compact">금</div>
                                        <div className="day-value-compact">-</div>
                                    </div>
                                </div>
                            </div>

                            {/* AI 응원 멘트 */}
                            <div className="ai-encouragement">
                                <div className="ai-avatar">🤖</div>
                                <div className="encouragement-content">
                                    <div className="encouragement-text">
                                        "어제보다 더 좋은 성과를 보이고 계시네요! 특히 GIGA 전환률이 높아지고 있어 인상적입니다. 이런 추세라면 이번 달 목표 달성도 충분히 가능해 보입니다. 파이팅! 💪"
                                    </div>
                                    <div className="ai-signature">- AI 어시스턴트</div>
                                </div>
                            </div>
                        </div>

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

                                    {/* 성과 하이라이트 추가 */}
                                    <div className="performance-highlights">
                                        <div className="highlight-title">🏆 이번달 하이라이트</div>
                                        <div className="highlight-list">
                                            <div className="highlight-item">
                                                <span className="highlight-icon">🥇</span>
                                                <span className="highlight-text">주간 1위 달성 (3주차)</span>
                                            </div>
                                            <div className="highlight-item">
                                                <span className="highlight-icon">📈</span>
                                                <span className="highlight-text">전월 대비 +15% 성장</span>
                                            </div>
                                            <div className="highlight-item">
                                                <span className="highlight-icon">⭐</span>
                                                <span className="highlight-text">고객만족도 4.8/5.0</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 스킬 분석 추가 */}
                                    <div className="skill-analysis">
                                        <div className="skill-title">💪 상담 스킬 분석</div>
                                        <div className="skill-items">
                                            <div className="skill-item">
                                                <div className="skill-info">
                                                    <span className="skill-name">니즈 파악</span>
                                                    <span className="skill-score">92%</span>
                                                </div>
                                                <div className="skill-bar">
                                                    <div className="skill-fill" style={{ width: '92%' }}></div>
                                                </div>
                                            </div>
                                            <div className="skill-item">
                                                <div className="skill-info">
                                                    <span className="skill-name">제안 타이밍</span>
                                                    <span className="skill-score">87%</span>
                                                </div>
                                                <div className="skill-bar">
                                                    <div className="skill-fill" style={{ width: '87%' }}></div>
                                                </div>
                                            </div>
                                            <div className="skill-item">
                                                <div className="skill-info">
                                                    <span className="skill-name">설득력</span>
                                                    <span className="skill-score">89%</span>
                                                </div>
                                                <div className="skill-bar">
                                                    <div className="skill-fill" style={{ width: '89%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 주차별 넛지건수 그래프 */}
                                <div className="monthly-chart">
                                    <div className="chart-header">
                                        <span className="chart-title">주차별 넛지 성공 비교</span>
                                        <div className="chart-trend">
                                            <span className="this-month-total">이번달: {thisMonthTotal}건</span>
                                            <span className={`month-comparison ${monthComparison >= 0 ? 'positive' : 'negative'}`}>
                                                {monthComparison >= 0 ? '+' : ''}{monthComparison}건
                                            </span>
                                        </div>
                                    </div>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={240}>
                                            <LineChart data={data.weeklyData} margin={{ left: 5, right: 5, top: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis
                                                    dataKey="week"
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    domain={[0, 15]}
                                                    width={25}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend
                                                    wrapperStyle={{
                                                        fontSize: '11px',
                                                        paddingTop: '8px'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="lastMonth"
                                                    stroke="#9ca3af"
                                                    strokeWidth={3}
                                                    strokeDasharray="8 4"
                                                    name="저번달"
                                                    dot={{
                                                        fill: '#9ca3af',
                                                        stroke: '#ffffff',
                                                        strokeWidth: 2,
                                                        r: 4
                                                    }}
                                                    activeDot={{
                                                        r: 6,
                                                        stroke: '#9ca3af',
                                                        strokeWidth: 2,
                                                        fill: '#ffffff'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="thisMonth"
                                                    stroke="#3b82f6"
                                                    strokeWidth={4}
                                                    name="이번달"
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
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 하단 상세 정보 */}
                <div className="detail-grid">

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

                            {/* 교육 영상 카드 추가 */}
                            <div className="education-video-card">
                                <div className="video-header">
                                    <div className="video-title">
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
                                        height="200"
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