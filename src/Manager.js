import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Star, MessageSquare, Award, Zap, Users, BarChart3, Trophy, Target, Sparkles, ChevronUp, User, Crown, Calendar, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './Manager.css';

const Manager = () => {
    const [selectedTeam, setSelectedTeam] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [animatedValues, setAnimatedValues] = useState({
        totalMembers: 0,
        totalNudgeCount: 0,
        averageRate: 0,
        topPerformer: ''
    });

    const data = {
        teams: [
            { id: 'team1', name: '1팀', memberCount: 8 },
            { id: 'team2', name: '2팀', memberCount: 6 },
            { id: 'team3', name: '3팀', memberCount: 7 }
        ],
        teamStats: {
            totalMembers: 21,
            totalNudgeCount: 156,
            averageRate: 4.2,
            topPerformer: '김상담',
            monthlyTrend: [
                { date: '1일', count: 8 },
                { date: '2일', count: 12 },
                { date: '3일', count: 9 },
                { date: '4일', count: 15 },
                { date: '5일', count: 11 },
                { date: '6일', count: 14 },
                { date: '7일', count: 10 },
                { date: '8일', count: 13 },
                { date: '9일', count: 16 },
                { date: '10일', count: 12 },
                { date: '11일', count: 9 },
                { date: '12일', count: 14 },
                { date: '13일', count: 11 },
                { date: '14일', count: 17 },
                { date: '15일', count: 13 },
                { date: '16일', count: 10 },
                { date: '17일', count: 15 },
                { date: '18일', count: 12 },
                { date: '19일', count: 18 },
                { date: '20일', count: 14 },
                { date: '21일', count: 11 },
                { date: '22일', count: 16 },
                { date: '23일', count: 13 },
                { date: '24일', count: 19 },
                { date: '25일', count: 15 },
                { date: '26일', count: 12 },
                { date: '27일', count: 17 },
                { date: '28일', count: 14 },
                { date: '29일', count: 20 },
                { date: '30일', count: 16 }
            ]
        },
        members: [
            {
                id: 1,
                name: '김상담',
                team: '1팀',
                grade: '플래티넘',
                currentPoints: 2450,
                monthlyNudgeCount: 20,
                monthlyRate: 4.8,
                weeklyGrowth: '+15%',
                status: 'active'
            },
            {
                id: 2,
                name: '이상담',
                team: '1팀',
                grade: '골드',
                currentPoints: 1850,
                monthlyNudgeCount: 18,
                monthlyRate: 4.2,
                weeklyGrowth: '+8%',
                status: 'active'
            },
            {
                id: 3,
                name: '박상담',
                team: '2팀',
                grade: '실버',
                currentPoints: 1200,
                monthlyNudgeCount: 15,
                monthlyRate: 3.8,
                weeklyGrowth: '+12%',
                status: 'active'
            },
            {
                id: 4,
                name: '최상담',
                team: '2팀',
                grade: '브론즈',
                currentPoints: 850,
                monthlyNudgeCount: 12,
                monthlyRate: 3.2,
                weeklyGrowth: '+5%',
                status: 'active'
            },
            {
                id: 5,
                name: '정상담',
                team: '3팀',
                grade: '골드',
                currentPoints: 2100,
                monthlyNudgeCount: 19,
                monthlyRate: 4.5,
                weeklyGrowth: '+20%',
                status: 'active'
            },
            {
                id: 6,
                name: '한상담',
                team: '3팀',
                grade: '실버',
                currentPoints: 1100,
                monthlyNudgeCount: 14,
                monthlyRate: 3.5,
                weeklyGrowth: '+3%',
                status: 'active'
            },
            {
                id: 7,
                name: '윤상담',
                team: '1팀',
                grade: '브론즈',
                currentPoints: 750,
                monthlyNudgeCount: 10,
                monthlyRate: 2.8,
                weeklyGrowth: '+2%',
                status: 'active'
            },
            {
                id: 8,
                name: '임상담',
                team: '2팀',
                grade: '골드',
                currentPoints: 1950,
                monthlyNudgeCount: 17,
                monthlyRate: 4.1,
                weeklyGrowth: '+18%',
                status: 'active'
            }
        ],
        teamPerformance: [
            { team: '1팀', members: 8, avgRate: 4.1, totalNudge: 48, growth: '+12%' },
            { team: '2팀', members: 6, avgRate: 3.8, totalNudge: 44, growth: '+8%' },
            { team: '3팀', members: 7, avgRate: 4.0, totalNudge: 45, growth: '+15%' }
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
                totalMembers: Math.floor(easeOut * data.teamStats.totalMembers),
                totalNudgeCount: Math.floor(easeOut * data.teamStats.totalNudgeCount),
                averageRate: easeOut * data.teamStats.averageRate,
                topPerformer: data.teamStats.topPerformer
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setAnimatedValues({
                    totalMembers: data.teamStats.totalMembers,
                    totalNudgeCount: data.teamStats.totalNudgeCount,
                    averageRate: data.teamStats.averageRate,
                    topPerformer: data.teamStats.topPerformer
                });
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, []);

    const getGrowthIcon = (growth) => {
        if (growth.includes('+')) return <TrendingUp className="growth-icon up" />;
        if (growth.includes('-')) return <TrendingDown className="growth-icon down" />;
        return <Minus className="growth-icon neutral" />;
    };

    const filteredMembers = selectedTeam === 'all'
        ? data.members
        : data.members.filter(member => member.team === selectedTeam);

    const getGradeIcon = (grade) => {
        switch (grade) {
            case '플래티넘': return '💎';
            case '골드': return '🥇';
            case '실버': return '🥈';
            case '브론즈': return '🥉';
            default: return '⭐';
        }
    };

    return (
        <div className="manager-dashboard">
            <div className="manager-container">
                {/* 헤더 */}
                <div className="manager-header">
                    <div className="header-content">
                        <h1>팀 관리 대시보드</h1>
                        <p>전체 팀 구성원의 성과를 한눈에 확인하세요</p>
                    </div>
                    <div className="header-controls">
                        <div className="filter-group">
                            <Filter className="icon" />
                            <select
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                className="team-select"
                            >
                                <option value="all">전체 팀</option>
                                {data.teams.map(team => (
                                    <option key={team.id} value={team.name}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="period-selector">
                            <Calendar className="icon" />
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="period-select"
                            >
                                <option value="week">이번주</option>
                                <option value="month">이번달</option>
                                <option value="quarter">이번분기</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 전체 통계 */}
                <section className="overview-section">
                    <div className="section-title">
                        <div className="title-indicator"></div>
                        <h2>전체 현황</h2>
                    </div>

                    <div className="overview-grid">
                        <div className="overview-card">
                            <div className="card-header">
                                <Users className="icon" />
                                <span>전체 구성원</span>
                            </div>
                            <div className="card-value">
                                {animatedValues.totalMembers}명
                            </div>
                            <div className="card-trend positive">
                                <TrendingUp className="icon" />
                                <span>활성 구성원</span>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="card-header">
                                <Target className="icon" />
                                <span>총 넛지 성공</span>
                            </div>
                            <div className="card-value">
                                {animatedValues.totalNudgeCount}건
                            </div>
                            <div className="card-trend positive">
                                <TrendingUp className="icon" />
                                <span>전월 대비 +12%</span>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="card-header">
                                <BarChart3 className="icon" />
                                <span>평균 넛지율</span>
                            </div>
                            <div className="card-value">
                                {animatedValues.averageRate.toFixed(1)}%
                            </div>
                            <div className="card-trend positive">
                                <TrendingUp className="icon" />
                                <span>목표 달성률 105%</span>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="card-header">
                                <Crown className="icon" />
                                <span>최고 성과자</span>
                            </div>
                            <div className="card-value">
                                {animatedValues.topPerformer}
                            </div>
                            <div className="card-trend positive">
                                <Trophy className="icon" />
                                <span>플래티넘 등급</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 팀별 성과 */}
                <section className="team-performance-section">
                    <div className="section-title">
                        <div className="title-indicator"></div>
                        <h2>팀별 성과</h2>
                    </div>

                    <div className="team-performance-grid">
                        {data.teamPerformance.map((team, index) => (
                            <div key={team.team} className="team-performance-card">
                                <div className="team-header">
                                    <h3>{team.team}</h3>
                                    <span className="member-count">{team.members}명</span>
                                </div>
                                <div className="team-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">평균 넛지율</span>
                                        <span className="stat-value">{team.avgRate}%</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">총 성공 건수</span>
                                        <span className="stat-value">{team.totalNudge}건</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">성장률</span>
                                        <span className="stat-value positive">{team.growth}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 월별 트렌드 차트 */}
                <section className="trend-section">
                    <div className="section-title">
                        <div className="title-indicator"></div>
                        <h2>월별 트렌드</h2>
                    </div>

                    <div className="trend-chart-card">
                        <div className="chart-header">
                            <span>전체 팀 월별 넛지 성공 건수</span>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.teamStats.monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#6b7280"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={4}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 'dataMax + 5']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}
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
                </section>

                {/* 구성원 목록 */}
                <section className="members-section">
                    <div className="section-title">
                        <div className="title-indicator"></div>
                        <h2>구성원 상세 현황</h2>
                        <span className="member-count">총 {filteredMembers.length}명</span>
                    </div>

                    <div className="members-grid">
                        {filteredMembers.map((member) => (
                            <div key={member.id} className="member-card">
                                <div className="member-header">
                                    <div className="member-info">
                                        <div className="member-avatar">
                                            <User className="icon" />
                                        </div>
                                        <div className="member-details">
                                            <h3 className="member-name">{member.name}</h3>
                                            <span className="member-team">{member.team}</span>
                                        </div>
                                    </div>
                                    <div className="member-grade">
                                        <span className="grade-icon">{getGradeIcon(member.grade)}</span>
                                        <span className="grade-text">{member.grade}</span>
                                    </div>
                                </div>

                                <div className="member-stats">
                                    <div className="stat-row">
                                        <div className="stat-item">
                                            <span className="stat-label">포인트</span>
                                            <span className="stat-value">{member.currentPoints.toLocaleString()}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">넛지 성공</span>
                                            <span className="stat-value">{member.monthlyNudgeCount}건</span>
                                        </div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-item">
                                            <span className="stat-label">넛지율</span>
                                            <span className="stat-value">{member.monthlyRate}%</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">성장률</span>
                                            <span className={`stat-value ${member.weeklyGrowth.includes('+') ? 'positive' : 'negative'}`}>
                                                {member.weeklyGrowth}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="member-status">
                                    <span className={`status-badge ${member.status}`}>
                                        {member.status === 'active' ? '활성' : '비활성'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Manager; 