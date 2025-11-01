import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import Card from '../components/ui/Card';
import MetricCard from '../components/ui/MetricCard';
import ChartTooltip from '../components/ui/ChartTooltip';
import Table from '../components/ui/Table';
import FilterBar from '../components/ui/FilterBar';
import { mockData } from '../data/mock';
import { HistoryItem } from '../types';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  RefreshIcon,
  DocumentArrowDownIcon,
} from '../components/icons/Icons';

const DashboardPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const lastRun = mockData.run;
  const passPercentage = lastRun.total > 0 ? ((lastRun.passed / lastRun.total) * 100).toFixed(1) : '0.0';
  const passPercentageNum = parseFloat(passPercentage);

  // Calculate trends (mock data - in real app, compare with previous period)
  const trends = {
    passRate: 2.5, // +2.5% from previous
    passed: -1, // -1 test from previous
    failed: 1, // +1 test from previous
    totalTime: -0.8, // -0.8s from previous
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  // Filter history based on search and filters
  const filteredHistory = useMemo(() => {
    let filtered = [...mockData.history];

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filtered;
  }, [searchQuery]);

  // Pie chart data
  const pieData = [
    { name: 'Passed', value: lastRun.passed, fill: '#10B981' },
    { name: 'Failed', value: lastRun.failed, fill: '#EF4444' },
  ];

  // Bar chart data - Last 5 runs
  const barData = mockData.history
    .slice(0, 5)
    .reverse()
    .map((h) => ({
      name: h.runId,
      pass: h.pass,
      fail: h.fail,
    }));

  // Table columns với sortable
  const historyColumns = [
    {
      header: 'Run #',
      accessor: (item: HistoryItem) => (
        <span className="text-accent-cyan font-semibold">{item.runId}</span>
      ),
      sortable: true,
      sortKey: 'runId' as keyof HistoryItem,
    },
    {
      header: 'Total Tests',
      accessor: (item: HistoryItem) => item.tests,
      sortable: true,
      sortKey: 'tests' as keyof HistoryItem,
    },
    {
      header: 'Pass',
      accessor: (item: HistoryItem) => (
        <span className="text-status-success font-medium">{item.pass}</span>
      ),
      sortable: true,
      sortKey: 'pass' as keyof HistoryItem,
    },
    {
      header: 'Fail',
      accessor: (item: HistoryItem) => (
        <span className="text-status-danger font-medium">{item.fail}</span>
      ),
      sortable: true,
      sortKey: 'fail' as keyof HistoryItem,
    },
    {
      header: 'Duration',
      accessor: (item: HistoryItem) => item.duration,
      sortable: true,
      sortKey: 'duration' as keyof HistoryItem,
    },
    {
      header: 'Date/Time',
      accessor: (item: HistoryItem) => item.date,
      sortable: true,
      sortKey: 'date' as keyof HistoryItem,
    },
  ];

  // Extract unique branches and authors (mock data - in real app, get from API)
  const branches = ['main', 'develop', 'feature/test'];
  const authors = ['an@gmail.com', 'user@example.com'];

  // Animation cho page load
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Custom label cho pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip formatter
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Passed' || name === 'Failed') {
      return [`${value} tests`, name];
    }
    return [value.toString(), name];
  };

  return (
    <div 
      className="space-y-6"
      style={{
        opacity: isPageLoaded ? 1 : 0,
        transform: isPageLoaded ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      {/* Header với title và refresh button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary">Test Execution Analytics</h1>
          <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="
              flex items-center gap-2
              px-4 py-2
              bg-surface border border-surface2 rounded-lg
              text-primary text-sm font-medium
              hover:bg-surface2 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <RefreshIcon
              className={`w-4 h-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          <button
            className="
              flex items-center gap-2
              px-4 py-2
              bg-accent-violet text-white rounded-lg
              text-sm font-medium
              hover:bg-accent-violet/90 transition-all duration-200
            "
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Pass Rate"
          value={`${passPercentage}%`}
          subtitle={`${lastRun.passed} of ${lastRun.total} tests`}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          trend={trends.passRate}
          progress={passPercentageNum}
          color="success"
        />
        <MetricCard
          title="Tests Passed"
          value={lastRun.passed}
          subtitle="Successful executions"
          icon={<CheckCircleIcon className="w-6 h-6" />}
          trend={trends.passed}
          color="success"
        />
        <MetricCard
          title="Tests Failed"
          value={lastRun.failed}
          subtitle="Requires attention"
          icon={<XCircleIcon className="w-6 h-6" />}
          trend={trends.failed}
          color="danger"
        />
        <MetricCard
          title="Total Time"
          value={`${(lastRun.durationMs / 1000).toFixed(1)}s`}
          subtitle="Execution duration"
          icon={<ClockIcon className="w-6 h-6" />}
          trend={trends.totalTime}
          color="cyan"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {/* Pie Chart - Test Distribution */}
        <Card className="lg:col-span-1 xl:col-span-2" hover={true}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">Test Distribution</h2>
              <p className="text-sm text-primary-muted">Overall pass/fail breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip formatter={formatTooltipValue} />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-primary-muted text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Test Trends */}
        <Card className="lg:col-span-2 xl:col-span-3" hover={true}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">Test Trends</h2>
              <p className="text-sm text-primary-muted">Pass/fail ratio over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                iconType="square"
                formatter={(value) => (
                  <span className="text-primary-muted text-sm">{value}</span>
                )}
              />
              <Bar
                dataKey="pass"
                stackId="a"
                fill="#10B981"
                name="Pass"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
              <Bar
                dataKey="fail"
                stackId="a"
                fill="#EF4444"
                name="Fail"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filter Bar */}
      <FilterBar
        onSearch={setSearchQuery}
        onBranchFilter={setSelectedBranch}
        onAuthorFilter={setSelectedAuthor}
        branches={branches}
        authors={authors}
      />

      {/* History Table */}
      <Card hover={true}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">Test Execution History</h2>
            <p className="text-sm text-primary-muted">Recent test runs and results</p>
          </div>
        </div>
        <Table
          columns={historyColumns}
          data={filteredHistory}
          searchable={true}
          searchPlaceholder="Search by run ID, tests, date..."
          pagination={true}
          itemsPerPage={10}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
