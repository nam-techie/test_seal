import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import Card from '../components/ui/Card';
import MetricCard from '../components/ui/MetricCard';
import ChartTooltip from '../components/ui/ChartTooltip';
import Table from '../components/ui/Table';
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
    // Empty state - will be populated from API later
    const lastRun = { total: 0, passed: 0, failed: 0, durationMs: 0 };
    const passPercentage = '0.0';

    const pieData = [
        { name: 'Pass', value: 0 },
        { name: 'Fail', value: 0 },
    ];
    const COLORS = ['#10B981', '#EF4444'];

    const barData: any[] = [];
    
    const historyColumns = [
        { header: 'Run #', accessor: (item: HistoryItem) => <span className="text-accent-cyan font-semibold">{item.runId}</span> },
        { header: 'Total Tests', accessor: (item: HistoryItem) => item.tests },
        { header: 'Pass', accessor: (item: HistoryItem) => <span className="text-status-success">{item.pass}</span> },
        { header: 'Fail', accessor: (item: HistoryItem) => <span className="text-status-danger">{item.fail}</span> },
        { header: 'Duration', accessor: (item: HistoryItem) => item.duration },
        { header: 'Date/Time', accessor: (item: HistoryItem) => item.date },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Reporting Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h3 className="text-primary-muted text-sm font-medium">Pass %</h3><p className="text-3xl font-bold text-status-success">{passPercentage}%</p></Card>
                <Card><h3 className="text-primary-muted text-sm font-medium">Failed Tests</h3><p className="text-3xl font-bold text-status-danger">{lastRun.failed}</p></Card>
                <Card><h3 className="text-primary-muted text-sm font-medium">Total Time</h3><p className="text-3xl font-bold">{(lastRun.durationMs / 1000).toFixed(2)}s</p></Card>
                <Card><h3 className="text-primary-muted text-sm font-medium"># of Tests</h3><p className="text-3xl font-bold">{lastRun.total}</p></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Pass vs Fail (Last Run)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#11162A', border: '1px solid #151B33', borderRadius: '0.75rem' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="lg:col-span-3">
                    <h2 className="text-xl font-bold mb-4">Last 5 Runs Trend</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#11162A', border: '1px solid #151B33', borderRadius: '0.75rem' }} cursor={{fill: 'rgba(124, 58, 237, 0.1)'}}/>
                            <Legend />
                            <Bar dataKey="pass" stackId="a" fill="#10B981" name="Pass" radius={[4, 4, 0, 0]}/>
                            <Bar dataKey="fail" stackId="a" fill="#EF4444" name="Fail" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <Card>
                <h2 className="text-xl font-bold mb-4">Run History</h2>
                <Table columns={historyColumns} data={[]} />
                <div className="mt-4 text-center text-primary-muted">
                    <p>No test run history available. Execute tests to see history.</p>
                </div>
            </Card>
        </div>
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
