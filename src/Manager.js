import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import './Manager.css';

const Manager = ({ userRole = 'center', userId = null }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);

    useEffect(() => {
        fetchData();
    }, [userRole, userId]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            let url;
            if (userRole === 'center') {
                url = 'http://localhost:8080/api/admin/dashboard/center001';
            } else {
                url = `http://localhost:8080/api/admin/user-detail/${userId || 'csm6_mgr01'}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('데이터를 가져오는데 실패했습니다.');
            }

            const result = await response.json();
            setData(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="manager-container">
                <div className="loading-spinner">데이터를 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manager-container">
                <div className="error-message">오류: {error}</div>
            </div>
        );
    }

    return (
        <div className="manager-container">
            {userRole === 'center' ? (
                <CenterDashboard data={data} selectedDept={selectedDept} setSelectedDept={setSelectedDept} />
            ) : (
                <UserDetailDashboard data={data} />
            )}
        </div>
    );
};

const CenterDashboard = ({ data, selectedDept, setSelectedDept }) => {
    const { deptStats, rankings, deptDailyStats } = data;

    const getTotalStats = () => {
        const totals = deptStats.reduce((acc, dept) => ({
            totalMembers: acc.totalMembers + dept.totalMembers,
            totalNudgeCount: acc.totalNudgeCount + dept.totalNudgeCount,
            totalSuccessCount: acc.totalSuccessCount + dept.totalSuccessCount
        }), { totalMembers: 0, totalNudgeCount: 0, totalSuccessCount: 0 });

        return {
            ...totals,
            avgNudgeRate: totals.totalNudgeCount > 0 ? (totals.totalSuccessCount / totals.totalNudgeCount * 100).toFixed(1) : 0
        };
    };

    const totalStats = getTotalStats();

    return (
        <div className="center-dashboard">
            <div className="dashboard-header">
                <h1>센터 관리 대시보드</h1>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-label">총 구성원</span>
                        <span className="stat-value">{totalStats.totalMembers}명</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">총 넛지</span>
                        <span className="stat-value">{totalStats.totalNudgeCount}건</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">평균 성공률</span>
                        <span className="stat-value">{totalStats.avgNudgeRate}%</span>
                    </div>
                </div>
            </div>

            <div className="content-grid">
                <div className="left-panel">
                    <div className="section">
                        <div className="section-header">
                            <h2>부서별 현황</h2>
                        </div>
                        <div className="dept-list">
                            {deptStats.map((dept) => (
                                <div
                                    key={dept.deptIdx}
                                    className={`dept-item ${selectedDept === dept.deptIdx ? 'active' : ''}`}
                                    onClick={() => setSelectedDept(selectedDept === dept.deptIdx ? null : dept.deptIdx)}
                                >
                                    <div className="dept-name">{dept.deptName}</div>
                                    <div className="dept-info">
                                        <span>구성원 {dept.totalMembers}명</span>
                                        <span>넛지 {dept.totalNudgeCount}건</span>
                                        <span className="success-rate">{dept.nudgeRate.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>랭킹</h2>
                        </div>
                        <div className="ranking-tabs">
                            <div className="ranking-section">
                                <h3>넛지 TOP 5</h3>
                                <div className="ranking-list">
                                    {rankings.nudgeRanking.slice(0, 5).map((item, index) => (
                                        <div key={item.userId} className="ranking-item">
                                            <span className="rank">{index + 1}</span>
                                            <div className="user-info">
                                                <span className="name">{item.userName}</span>
                                                <span className="dept">{item.deptName}</span>
                                            </div>
                                            <span className="count">{item.totalNudgeCount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    {selectedDept ? (
                        <DepartmentDetail
                            dept={deptStats.find(d => d.deptIdx === selectedDept)}
                            dailyStats={deptDailyStats.find(d => d.deptIdx === selectedDept)}
                        />
                    ) : (
                        <div className="placeholder">
                            <p>부서를 선택하면 상세 정보를 확인할 수 있습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DepartmentDetail = ({ dept, dailyStats }) => {
    return (
        <div className="dept-detail">
            <div className="section">
                <div className="section-header">
                    <h2>{dept.deptName} 상세</h2>
                </div>

                <div className="subsection">
                    <h3>구성원 현황</h3>
                    <div className="member-list">
                        {dept.userStats.map((user) => (
                            <div key={user.userId} className="member-item">
                                <div className="member-info">
                                    <span className="name">{user.userName}</span>
                                    <span className="position">{user.mbPositionName}</span>
                                </div>
                                <div className="member-stats">
                                    <div className="stat">
                                        <label>넛지</label>
                                        <span>{user.nudgeCount}건</span>
                                    </div>
                                    <div className="stat">
                                        <label>성공률</label>
                                        <span>{user.nudgeRate.toFixed(1)}%</span>
                                    </div>
                                </div>
                                <div className="service-counts">
                                    <span>G:{user.gigaCount}</span>
                                    <span>C:{user.crmCount}</span>
                                    <span>T:{user.tdsCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {dailyStats && dailyStats.dailyStats && dailyStats.dailyStats.length > 0 && (
                    <div className="subsection">
                        <h3>일별 통계</h3>
                        <div className="daily-chart-container">
                            <DailyChart dailyStats={dailyStats.dailyStats} />
                        </div>
                        <div className="daily-list">
                            {dailyStats.dailyStats.map((daily) => (
                                <div key={daily.date} className="daily-item">
                                    <span className="date">{formatDate(daily.date)}</span>
                                    <span className="total">총 {daily.totalCount}건</span>
                                    <span className="nudge">넛지 {daily.nudgeCount}건</span>
                                    <span className="rate">{daily.nudgeRate.toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DailyChart = ({ dailyStats }) => {
    if (!dailyStats || dailyStats.length === 0) {
        return <div className="no-chart-data">차트 데이터가 없습니다.</div>;
    }

    const chartData = dailyStats.map(item => ({
        date: formatDate(item.date),
        넛지성공: item.nudgeCount || 0,
        총상담: item.totalCount || 0,
        성공률: item.nudgeRate || 0
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    stroke="#6c757d"
                />
                <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#6c757d"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="넛지성공"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="총상담"
                    stroke="#6c757d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#6c757d', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const UserDetailDashboard = ({ data }) => {
    const { userId, userName, mbPositionName, deptName, dailyData, summary } = data;
    const [selectedDay, setSelectedDay] = useState(null);

    return (
        <div className="user-dashboard">
            <div className="dashboard-header">
                <h1>{userName} 상담 현황</h1>
                <div className="user-info">
                    <span>{deptName}</span>
                    <span>{mbPositionName}</span>
                </div>
            </div>

            <div className="content-grid">
                <div className="left-panel">
                    <div className="section">
                        <div className="section-header">
                            <h2>요약 통계</h2>
                        </div>
                        <div className="summary-stats">
                            <div className="summary-item">
                                <label>총 상담</label>
                                <span className="value">{summary.totalCount}건</span>
                            </div>
                            <div className="summary-item">
                                <label>넛지 성공</label>
                                <span className="value">{summary.totalNudgeCount}건</span>
                            </div>
                            <div className="summary-item">
                                <label>전체 성공률</label>
                                <span className="value">{summary.totalNudgeRate.toFixed(1)}%</span>
                            </div>
                            <div className="summary-item">
                                <label>평균 성공률</label>
                                <span className="value">{summary.avgNudgeRate.toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="service-summary">
                            <div className="service-item">
                                <span className="service-label">GIGA</span>
                                <span className="service-count">{summary.totalGigaCount}</span>
                            </div>
                            <div className="service-item">
                                <span className="service-label">CRM</span>
                                <span className="service-count">{summary.totalCrmCount}</span>
                            </div>
                            <div className="service-item">
                                <span className="service-label">TDS</span>
                                <span className="service-count">{summary.totalTdsCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-header">
                            <h2>일별 현황</h2>
                        </div>
                        <div className="daily-chart-container">
                            <UserDailyChart dailyData={dailyData} />
                        </div>
                        <div className="daily-overview">
                            {dailyData.map((daily) => (
                                <div
                                    key={daily.date}
                                    className={`daily-overview-item ${selectedDay === daily.date ? 'active' : ''} ${daily.totalCount === 0 ? 'empty' : ''}`}
                                    onClick={() => setSelectedDay(selectedDay === daily.date ? null : daily.date)}
                                >
                                    <span className="date">{formatDate(daily.date)}</span>
                                    {daily.totalCount > 0 ? (
                                        <>
                                            <span className="count">상담 {daily.totalCount}건</span>
                                            <span className="rate">{daily.nudgeRate.toFixed(1)}%</span>
                                        </>
                                    ) : (
                                        <span className="no-data">상담없음</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    {selectedDay ? (
                        <DailyDetail data={dailyData.find(d => d.date === selectedDay)} />
                    ) : (
                        <div className="placeholder">
                            <p>날짜를 선택하면 상세 상담 내역을 확인할 수 있습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserDailyChart = ({ dailyData }) => {
    if (!dailyData || dailyData.length === 0) {
        return <div className="no-chart-data">차트 데이터가 없습니다.</div>;
    }

    // 상담이 있는 날만 필터링
    const validData = dailyData.filter(item => item.totalCount > 0);

    if (validData.length === 0) {
        return <div className="no-chart-data">차트 데이터가 없습니다.</div>;
    }

    const chartData = validData.map(item => ({
        date: formatDate(item.date),
        GIGA: item.gigaCount || 0,
        CRM: item.crmCount || 0,
        TDS: item.tdsCount || 0,
        총넛지: item.nudgeCount || 0
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    stroke="#6c757d"
                />
                <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#6c757d"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="GIGA" stackId="a" fill="#28a745" />
                <Bar dataKey="CRM" stackId="a" fill="#ffc107" />
                <Bar dataKey="TDS" stackId="a" fill="#dc3545" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const DailyDetail = ({ data }) => {
    if (!data || data.totalCount === 0) {
        return (
            <div className="daily-detail">
                <div className="section">
                    <div className="section-header">
                        <h2>{data ? formatDate(data.date) : ''} 상담 내역</h2>
                    </div>
                    <div className="empty-state">
                        <p>해당 날짜에 상담 내역이 없습니다.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="daily-detail">
            <div className="section">
                <div className="section-header">
                    <h2>{formatDate(data.date)} 상담 내역</h2>
                    <div className="daily-summary">
                        <span>총 {data.totalCount}건</span>
                        <span>넛지 {data.nudgeCount}건</span>
                        <span>성공률 {data.nudgeRate.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="consultation-list">
                    {data.nudgeDetails && data.nudgeDetails.map((detail, index) => (
                        <div key={index} className="consultation-item">
                            <div className="consultation-header">
                                <span className="time">{formatTime(detail.consultationDate)}</span>
                                <span className={`status ${detail.customerConsentYn === 'Y' ? 'success' : 'fail'}`}>
                  {detail.customerConsentYn === 'Y' ? '동의' : '거부'}
                </span>
                            </div>
                            <div className="consultation-content">
                                <div className="inquiry">
                                    <label>고객 문의:</label>
                                    <span>{detail.customerInquiry}</span>
                                </div>
                                <div className="marketing">
                                    <label>{detail.marketingType}:</label>
                                    <span>{detail.marketingMessage}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${month}/${day}`;
};

const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const hour = dateTimeString.substring(8, 10);
    const minute = dateTimeString.substring(10, 12);
    return `${hour}:${minute}`;
};

export default Manager;