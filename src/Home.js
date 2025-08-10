import React, { useState, useEffect } from 'react';
import { Target, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Home.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('earn');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackTab, setFeedbackTab] = useState('my');
    const [chartViewType, setChartViewType] = useState('all'); // 'all' 또는 'current'

    // 실제 API 응답과 동일한 형태의 JSON 데이터
    const dashboardData = {
        monthAnalyze: { // 8월 전체 통계 (8월 8일까지)
            totalCount: 180,
            nudgeCount: 12,
            nudgePercentage: 6.7,
            gourp1Count: 5,
            gourp2Count: 4,
            gourp3Count: 3
        },
        currentAnalyze: { // 8월 7일 하루 통계
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
        lastMonthDatas: [ // 7월 전체 데이터
            {
                id: 201,
                consultationDate: "2025-07-01",
                skid: "EMP001",
                customerInquiry: "요금제 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "7월 GIGA 상품을 추천드립니다",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 202,
                consultationDate: "2025-07-03",
                skid: "EMP001",
                customerInquiry: "인터넷 속도 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "7월 프리미엄 상품을 추천해드려요",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 203,
                consultationDate: "2025-07-05",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "TDS 서비스로 변경하시면 더 저렴해요",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 204,
                consultationDate: "2025-07-08",
                skid: "EMP001",
                customerInquiry: "서비스 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "7월 GIGA 무제한 데이터 어떠세요?",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 205,
                consultationDate: "2025-07-10",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "CRM 시스템으로 더 나은 서비스를",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 206,
                consultationDate: "2025-07-15",
                skid: "EMP001",
                customerInquiry: "서비스 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "7월 특가 GIGA 상품",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 207,
                consultationDate: "2025-07-17",
                skid: "EMP001",
                customerInquiry: "요금제 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "TDS로 월 1만원 절약하세요",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 208,
                consultationDate: "2025-07-19",
                skid: "EMP001",
                customerInquiry: "인터넷 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "7월 CRM 프리미엄 서비스",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 209,
                consultationDate: "2025-07-22",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "7월 말 GIGA 특별 혜택",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 210,
                consultationDate: "2025-07-24",
                skid: "EMP001",
                customerInquiry: "서비스 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "7월 TDS 마지막 기회",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 211,
                consultationDate: "2025-07-26",
                skid: "EMP001",
                customerInquiry: "요금제 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "7월 CRM 업그레이드 추천",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 212,
                consultationDate: "2025-07-29",
                skid: "EMP001",
                customerInquiry: "인터넷 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "7월 마지막 GIGA 혜택",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 213,
                consultationDate: "2025-07-31",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "7월 마지막날 TDS 추천",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            }
        ],
        monthDatas: [ // 8월 전체 데이터 (8월 8일까지)
            {
                id: 1,
                consultationDate: "2025-08-01",
                skid: "EMP001",
                customerInquiry: "요금제 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "8월 GIGA 상품을 추천드립니다",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 2,
                consultationDate: "2025-08-02",
                skid: "EMP001",
                customerInquiry: "인터넷 속도 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "더 빠른 인터넷을 원하시면 프리미엄 상품을 추천해드려요",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 3,
                consultationDate: "2025-08-02",
                skid: "EMP001",
                customerInquiry: "서비스 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "TDS 서비스 어떠세요?",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 4,
                consultationDate: "2025-08-05",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "8월 GIGA 할인 혜택",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 5,
                consultationDate: "2025-08-06",
                skid: "EMP001",
                customerInquiry: "인터넷 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "CRM 프리미엄으로 업그레이드",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 6,
                consultationDate: "2025-08-06",
                skid: "EMP001",
                customerInquiry: "요금제 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "8월 TDS 특가 상품",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 7,
                consultationDate: "2025-08-07",
                skid: "EMP001",
                customerInquiry: "서비스 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "8월 GIGA 무제한 데이터",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 8,
                consultationDate: "2025-08-07",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "8월 CRM 최신 기능 체험",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 9,
                consultationDate: "2025-08-08",
                skid: "EMP001",
                customerInquiry: "인터넷 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "8월 TDS 추천 상품",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 10,
                consultationDate: "2025-08-08",
                skid: "EMP001",
                customerInquiry: "서비스 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "8월 GIGA 프리미엄 혜택",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 11,
                consultationDate: "2025-08-08",
                skid: "EMP001",
                customerInquiry: "요금제 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "8월 CRM 신규 서비스",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 12,
                consultationDate: "2025-08-08",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "8월 TDS 마지막 기회",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            }
        ],
        curnetDatas: [ // 8월 7일 하루 데이터
            {
                id: 101,
                consultationDate: "2025-08-07",
                skid: "EMP001",
                customerInquiry: "요금 문의",
                nudgeYn: "Y",
                marketingType: "GIGA 전환",
                marketingMessage: "현재 요금제보다 20% 저렴한 GIGA 상품 어떠세요?",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 102,
                consultationDate: "2025-08-07",
                skid: "EMP001",
                customerInquiry: "서비스 문의",
                nudgeYn: "Y",
                marketingType: "CRM 전환",
                marketingMessage: "고객님께 최적화된 서비스를 제안드려요",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            },
            {
                id: 103,
                consultationDate: "2025-08-07",
                skid: "EMP001",
                customerInquiry: "인터넷 문의",
                nudgeYn: "Y",
                marketingType: "TDS 전환",
                marketingMessage: "TDS로 변경하시면 속도가 2배 빨라져요",
                customerConsentYn: "Y",
                inappropriateResponseYn: "N",
                inappropriateResponseMessage: ""
            }
        ]
    };

    /**
     * 영업일 날짜 목록 생성 (월~금만)
     * @param {number} year - 년도
     * @param {number} month - 월 (0-11)
     * @param {Date} endDate - 종료일 (어제까지)
     * @returns {Array} 영업일 날짜 배열
     */
    const getBusinessDatesList = (year, month, endDate) => {
        const businessDates = [];

        // 해당 월의 1일부터 시작
        for (let day = 1; day <= 31; day++) {
            const currentDate = new Date(year, month, day);

            // 월이 바뀌면 종료 (예: 8월 31일 다음은 9월 1일)
            if (currentDate.getMonth() !== month) {
                break;
            }

            // endDate를 넘으면 종료
            if (currentDate > endDate) {
                break;
            }

            const dayOfWeek = currentDate.getDay();
            // 월(1) ~ 금(5)만 영업일
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                businessDates.push(new Date(currentDate));
            }
        }

        return businessDates;
    };
    /**
     * 영업일 계산 함수 (토, 일 제외)
     * @param {Date} startDate - 시작일
     * @param {Date} endDate - 종료일
     * @returns {number} 영업일 수
     */
    const calculateBusinessDays = (startDate, endDate) => {
        let businessDayCount = 0;
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            // 월(1) ~ 금(5)만 영업일로 계산
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                businessDayCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return businessDayCount;
    };

    /**
     * 월의 영업일을 4분기로 나누는 함수
     * @param {number} year - 년도
     * @param {number} month - 월 (0-11)
     * @returns {Array} 분기별 정보 배열
     */
    const divideMonthIntoQuarters = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // 해당 월의 총 영업일 수
        const totalBusinessDays = calculateBusinessDays(firstDay, lastDay);
        const daysPerQuarter = Math.ceil(totalBusinessDays / 4);

        const quarters = [];
        let businessDayCount = 0;
        let currentQuarter = 1;
        let quarterStart = null;
        const currentDate = new Date(firstDay);

        while (currentDate <= lastDay && currentQuarter <= 4) {
            const dayOfWeek = currentDate.getDay();

            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // 영업일
                if (quarterStart === null) {
                    quarterStart = new Date(currentDate);
                }
                businessDayCount++;

                // 분기 완료 조건
                if (businessDayCount === daysPerQuarter * currentQuarter ||
                    currentDate.getTime() === lastDay.getTime()) {

                    quarters.push({
                        quarter: currentQuarter,
                        startDate: new Date(quarterStart),
                        endDate: new Date(currentDate),
                        businessDays: daysPerQuarter
                    });

                    currentQuarter++;
                    quarterStart = null;
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return quarters;
    };

    /**
     * 현재 진행중인 분기 계산
     * @param {number} year - 년도
     * @param {number} month - 월 (0-11)
     * @returns {number} 현재 분기 (1-4)
     */
    const getCurrentQuarter = (year, month) => {
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();

        // 현재 월이 아닌 경우 처리
        if (todayYear !== year || todayMonth !== month) {
            if (today > new Date(year, month + 1, 0)) {
                return 4; // 해당 월이 지났으면 모든 분기 완료
            }
            return 0; // 해당 월이 아직 시작되지 않음
        }

        const quarters = divideMonthIntoQuarters(year, month);

        // 오늘이 속한 분기 찾기
        for (let i = 0; i < quarters.length; i++) {
            if (today >= quarters[i].startDate && today <= quarters[i].endDate) {
                return i + 1;
            }
        }

        return Math.min(4, quarters.length);
    };

    /**
     * 실제 데이터를 기반으로 차트 데이터 생성
     * @param {string} viewType - 'all' (분기별 비교) 또는 'current' (일자별 데이터)
     * @returns {Array} 차트 데이터
     */
    const generateChartData = (viewType = 'all') => {
        const currentYear = 2025;
        const currentMonth = 7; // 8월 (0-based index)

        if (viewType === 'current') {
            // 이번달 영업일별 데이터 생성
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // 8월 1일부터 어제까지의 영업일 목록
            const businessDates = getBusinessDatesList(2025, 7, yesterday);

            // 각 영업일별 넛지 성공 건수 계산
            const dailyData = businessDates.map(date => {
                const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
                const nudgeCount = dashboardData.monthDatas.filter(item =>
                    item.nudgeYn === 'Y' && item.consultationDate === dateStr
                ).length;

                const month = date.getMonth() + 1;
                const day = date.getDate();
                const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

                return {
                    date: `${month}/${day}(${dayOfWeek})`,
                    thisMonth: nudgeCount
                };
            });

            console.log('일자별 넛지 데이터:', dailyData);
            return dailyData;

        } else {
            // 분기별 비교 데이터 생성 (기존 로직)
            const currentQuarter = getCurrentQuarter(currentYear, currentMonth);

            // 7월 데이터를 분기별로 분석
            const lastMonthNudgeData = dashboardData.lastMonthDatas
                .filter(item => item.nudgeYn === 'Y')
                .map(item => new Date(item.consultationDate));

            // 8월 데이터를 분기별로 분석
            const thisMonthNudgeData = dashboardData.monthDatas
                .filter(item => item.nudgeYn === 'Y')
                .map(item => new Date(item.consultationDate));

            // 7월 분기별 분포 계산
            const lastMonthQuarters = divideMonthIntoQuarters(2025, 6); // 7월 (0-based)
            const lastMonthQuarterlyCount = [0, 0, 0, 0];

            lastMonthNudgeData.forEach(date => {
                for (let i = 0; i < lastMonthQuarters.length; i++) {
                    if (date >= lastMonthQuarters[i].startDate && date <= lastMonthQuarters[i].endDate) {
                        lastMonthQuarterlyCount[i]++;
                        break;
                    }
                }
            });

            // 8월 분기별 분포 계산
            const thisMonthQuarters = divideMonthIntoQuarters(2025, 7); // 8월 (0-based)
            const thisMonthQuarterlyCount = [0, 0, 0, 0];

            thisMonthNudgeData.forEach(date => {
                for (let i = 0; i < thisMonthQuarters.length; i++) {
                    if (date >= thisMonthQuarters[i].startDate && date <= thisMonthQuarters[i].endDate) {
                        thisMonthQuarterlyCount[i]++;
                        break;
                    }
                }
            });

            // 차트 데이터 생성
            const chartData = [];
            for (let i = 1; i <= 4; i++) {
                chartData.push({
                    quarter: `${i}분기`,
                    lastMonth: lastMonthQuarterlyCount[i - 1],
                    thisMonth: i <= currentQuarter ? thisMonthQuarterlyCount[i - 1] : null
                });
            }

            console.log('현재 분기:', currentQuarter);
            console.log('7월 분기별 넛지 성공:', lastMonthQuarterlyCount);
            console.log('8월 분기별 넛지 성공:', thisMonthQuarterlyCount);
            console.log('분기별 차트 데이터:', chartData);

            return chartData;
        }
    };

    /**
     * 차트 툴팁 커스텀 컴포넌트
     */
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    {payload.map((entry, index) => (
                        entry.value !== null && (
                            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
                                {chartViewType === 'current'
                                    ? `넛지 성공: ${entry.value}건`
                                    : `${entry.name === 'thisMonth' ? '8월' : '7월'}: ${entry.value}건`
                                }
                            </p>
                        )
                    ))}
                </div>
            );
        }
        return null;
    };

    // 차트 데이터 생성
    const chartData = generateChartData(chartViewType);

    // 월별 총합 계산
    const thisMonthTotal = chartData.reduce((sum, item) => {
        return sum + (item.thisMonth || 0);
    }, 0);
    const lastMonthTotal = chartViewType === 'all'
        ? chartData.reduce((sum, item) => {
            return sum + (item.lastMonth || 0);
        }, 0)
        : 0;
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

                {/* 주요 지표 섹션 */}
                <section className="kpi-section">
                    <div className="kpi-grid">
                        {/* 넛지율 카드 */}
                        <div className="kpi-card nudge-rate">
                            <div className="card-header">
                                <div className="card-title">
                                    <Target className="icon" />
                                    <span>이번달 넛지율</span>
                                </div>
                                {dashboardData.monthAnalyze.nudgePercentage >= 4.0 && (
                                    <div className="achievement-indicator">
                                        <Trophy className="icon" />
                                    </div>
                                )}
                            </div>

                            <div className="nudge-stats">
                                <div className="main-stats">
                                    {/* 넛지율 메인 표시 */}
                                    <div className="rate-value">
                                        {dashboardData.monthAnalyze.nudgePercentage.toFixed(1)}<span>%</span>
                                    </div>

                                    {/* 통계 요약 */}
                                    <div className="stat-group-compact">
                                        <div className="stat-item">
                                            <span className="stat-value highlight">
                                                {dashboardData.monthAnalyze.nudgeCount}
                                            </span>
                                            <span className="stat-label">내 넛지 성공</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-value">
                                                {dashboardData.monthAnalyze.totalCount}
                                            </span>
                                            <span className="stat-label">전체 통화</span>
                                        </div>
                                    </div>

                                    {/* 팀 평균 비교 */}
                                    <div className="team-comparison">
                                        <div className="comparison-item">
                                            <span className="comparison-label">저번달 성과</span>
                                            <span className="comparison-value">
                                                {dashboardData.lastMonthDatas.filter(item => item.nudgeYn === 'Y').length}건
                                            </span>
                                        </div>
                                        <div className="comparison-item">
                                            <span className="comparison-label">내 순위</span>
                                            <span className="comparison-value positive">#3</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 분기별 넛지 성공 차트 */}
                                <div className="monthly-chart">
                                    <div className="chart-header">
                                        <div className="chart-header-left">
                                            <span className="chart-title">
                                                {chartViewType === 'current'
                                                    ? '일자별 넛지 성공 (영업일 기준)'
                                                    : '분기별 넛지 성공 비교 (영업일 기준)'
                                                }
                                            </span>

                                            {/* 차트 뷰 타입 선택 드롭박스 */}
                                            <select
                                                value={chartViewType}
                                                onChange={(e) => setChartViewType(e.target.value)}
                                                className="chart-view-selector"
                                                style={{
                                                    marginLeft: '12px',
                                                    padding: '4px 8px',
                                                    fontSize: '11px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#ffffff',
                                                    color: '#374151'
                                                }}
                                            >
                                                <option value="all">전체 데이터</option>
                                                <option value="current">이번달 데이터</option>
                                            </select>
                                        </div>

                                        <div className="chart-trend">
                                            <span className="this-month-total">
                                                8월: {thisMonthTotal}건
                                            </span>
                                            {chartViewType === 'all' && (
                                                <span className={`month-comparison ${monthComparison >= 0 ? 'positive' : 'negative'}`}>
                                                    {monthComparison >= 0 ? '+' : ''}{monthComparison}건
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={240}>
                                            <LineChart
                                                data={chartData}
                                                margin={{ left: 5, right: 5, top: 5, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis
                                                    dataKey={chartViewType === 'current' ? 'date' : 'quarter'}
                                                    stroke="#6b7280"
                                                    fontSize={chartViewType === 'current' ? 9 : 11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    angle={chartViewType === 'current' ? -45 : 0}
                                                    textAnchor={chartViewType === 'current' ? 'end' : 'middle'}
                                                    height={chartViewType === 'current' ? 60 : 30}
                                                />
                                                <YAxis
                                                    stroke="#6b7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    domain={[0, chartViewType === 'current' ? 5 : 10]}
                                                    width={25}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend
                                                    wrapperStyle={{
                                                        fontSize: '11px',
                                                        paddingTop: '8px'
                                                    }}
                                                />

                                                {/* 저번달(7월) 라인 - 분기별 비교일 때만 표시 */}
                                                {chartViewType === 'all' && (
                                                    <Line
                                                        type="monotone"
                                                        dataKey="lastMonth"
                                                        stroke="#9ca3af"
                                                        strokeWidth={3}
                                                        strokeDasharray="8 4"
                                                        name="7월"
                                                        dot={{
                                                            fill: '#9ca3af',
                                                            stroke: '#ffffff',
                                                            strokeWidth: 2,
                                                            r: 4
                                                        }}
                                                    />
                                                )}

                                                {/* 이번달(8월) 라인 */}
                                                <Line
                                                    type="monotone"
                                                    dataKey="thisMonth"
                                                    stroke="#3b82f6"
                                                    strokeWidth={4}
                                                    name="8월"
                                                    connectNulls={false}
                                                    dot={{
                                                        fill: '#3b82f6',
                                                        stroke: '#ffffff',
                                                        strokeWidth: 3,
                                                        r: chartViewType === 'current' ? 4 : 5
                                                    }}
                                                    activeDot={{
                                                        r: chartViewType === 'current' ? 6 : 8,
                                                        stroke: '#3b82f6',
                                                        strokeWidth: 3,
                                                        fill: '#ffffff'
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* 이번달 데이터 선택 시 영업일 요약 정보 표시 */}
                                    {chartViewType === 'current' && (
                                        <div className="business-dates-summary" style={{
                                            marginTop: '12px',
                                            padding: '8px 12px',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            color: '#64748b',
                                            lineHeight: '1.4'
                                        }}>
                                            <div style={{ fontWeight: '500', color: '#374151' }}>
                                                📅 영업일 기준: 8월 1일 ~ 어제까지 (총 {chartData.length}일)
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;