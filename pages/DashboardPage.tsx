import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { mockData } from '../data/mock';
import { HistoryItem } from '../types';

const DashboardPage = () => {
    const lastRun = mockData.run;
    const passPercentage = lastRun.total > 0 ? ((lastRun.passed / lastRun.total) * 100).toFixed(1) : '0.0';

    const pieData = [
        { name: 'Pass', value: lastRun.passed },
        { name: 'Fail', value: lastRun.failed },
    ];
    const COLORS = ['#10B981', '#EF4444'];

    const barData = mockData.history.slice(0, 5).reverse().map(h => ({
        name: h.runId,
        pass: h.pass,
        fail: h.fail,
    }));
    
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
                <Table columns={historyColumns} data={mockData.history} />
            </Card>
        </div>
    );
};

export default DashboardPage;
