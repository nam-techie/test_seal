import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import Drawer from '../components/ui/Drawer';
import { mockData } from '../data/mock';
import { RunResult } from '../types';
import { CheckCircleIcon, XCircleIcon, XIcon, TerminalIcon, InformationCircleIcon, ClipboardIcon, SparklesIcon } from '../components/icons/Icons';

// Sub-component for the new Test Log Modal
const TestLogModal = ({ isOpen, onClose, result }: { isOpen: boolean, onClose: () => void, result: RunResult | null }) => {
    if (!result) return null;

    const getLogLineClass = (line: string) => {
        if (line.startsWith('[SUCCESS]')) return 'text-status-success';
        if (line.startsWith('[ERROR]')) return 'text-status-danger';
        if (line.startsWith('[INFO]')) return 'text-primary-muted';
        return 'text-primary';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="p-2 -mt-8 -mx-6">
                <div className="flex justify-between items-center mb-6 px-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TerminalIcon />
                        Test Execution Logs
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-surface2">
                        <XIcon />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 px-4">
                    <Card className="!p-4 bg-surface2">
                        <div className="text-sm text-primary-muted mb-1">Status</div>
                        <Badge variant={result.status === 'pass' ? 'success' : 'danger'} className="uppercase font-bold tracking-wider">{result.status}</Badge>
                    </Card>
                    <Card className="!p-4 bg-surface2">
                        <div className="text-sm text-primary-muted mb-1">Duration</div>
                        <div className="font-semibold">{result.timeMs}ms</div>
                    </Card>
                    <Card className="!p-4 bg-surface2">
                        <div className="text-sm text-primary-muted mb-1">Branch</div>
                        <div className="font-semibold">{result.branch}</div>
                    </Card>
                    <Card className="!p-4 bg-surface2">
                        <div className="text-sm text-primary-muted mb-1">Author</div>
                        <div className="font-semibold">{result.author}</div>
                    </Card>
                </div>
                
                <div className="px-4 mb-6">
                    <details open>
                        <summary className="font-semibold cursor-pointer flex items-center gap-2 text-primary-muted hover:text-primary transition-colors">
                            <TerminalIcon className="w-5 h-5" /> Console Logs
                        </summary>
                        <pre className="mt-2 bg-background p-4 rounded-lg text-sm whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                            {result.log.split('\n').map((line, i) => (
                                <div key={i} className={getLogLineClass(line)}>{line}</div>
                            ))}
                        </pre>
                    </details>
                </div>

                {result.status === 'fail' && (
                    <>
                        <div className="px-4 mb-4">
                            <div className="border border-status-danger/50 bg-status-danger/10 p-4 rounded-lg">
                                <h3 className="font-semibold flex items-center gap-2 text-status-danger mb-2">
                                    <InformationCircleIcon className="w-5 h-5" /> Error Details
                                </h3>
                                <p className="text-sm text-status-danger font-mono">{result.error}</p>
                            </div>
                        </div>
                        <div className="px-4 mb-6">
                            <div className="border border-accent-violet/50 bg-accent-violet/10 p-4 rounded-lg">
                                <h3 className="font-semibold flex items-center gap-2 text-accent-violet mb-2">
                                    <SparklesIcon className="w-5 h-5" /> AI-Powered Suggestions
                                </h3>
                                <p className="text-sm whitespace-pre-wrap">{result.aiSuggestion?.suggestion}</p>
                            </div>
                        </div>
                    </>
                )}

                <div className="px-4 text-xs text-primary-muted border-t border-surface2 pt-4">
                    Executed At: {result.executedAt}
                </div>
            </div>
        </Modal>
    );
};

const ExecutionPage = () => {
    const [runResults, setRunResults] = useState<RunResult[]>([]);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isCodeModalOpen, setCodeModalOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    
    // State for the new modal
    const [isLogModalOpen, setLogModalOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState<RunResult | null>(null);

    useEffect(() => {
        const testsToRun = mockData.run.results;
        const totalTests = testsToRun.length;
        let completedTests = 0;
        
        const initialResults: RunResult[] = testsToRun.map(t => ({ ...t, status: 'running', timeMs: null }));
        setRunResults(initialResults);

        const runTest = (index: number) => {
            if (index >= totalTests) {
                setIsComplete(true);
                setDrawerOpen(mockData.run.failed > 0);
                return;
            }

            setTimeout(() => {
                setRunResults(prev => prev.map((r, i) => i === index ? { ...testsToRun[index] } : r));
                completedTests++;
                setProgress(Math.round((completedTests / totalTests) * 100));
                runTest(index + 1);
            }, 1000 + Math.random() * 1500);
        };

        runTest(0);
    }, []);

    const handleViewLog = (result: RunResult) => {
        setSelectedResult(result);
        setLogModalOpen(true);
    };

    const columns = [
        { header: 'Test Name', accessor: (item: RunResult) => item.name },
        { 
            header: 'Status', 
            accessor: (item: RunResult) => {
                if (item.status === 'running') {
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center">
                                <div className="w-4 h-4 bg-accent-cyan rounded-full animate-spin"></div>
                            </div>
                            <Badge variant="running" className="px-5 py-2 text-sm uppercase">Running</Badge>
                        </div>
                    )
                }
                const isPass = item.status === 'pass';
                const icon = isPass ? <CheckCircleIcon className="text-status-success w-7 h-7" /> : <XCircleIcon className="text-status-danger w-7 h-7" />;
                const badgeVariant = isPass ? 'success' : 'danger';
                const badgeText = isPass ? 'PASS' : 'FAIL';
    
                return (
                    <div className="flex items-center gap-3">
                        {icon}
                        <Badge variant={badgeVariant} className="px-5 py-2 text-sm">
                            {badgeText}
                        </Badge>
                    </div>
                )
            }
        },
        { header: 'Duration', accessor: (item: RunResult) => item.timeMs ? `${item.timeMs}ms` : '...' },
        {
            header: 'Actions',
            accessor: (item: RunResult) => (
                <div className="space-x-2">
                    <Button variant="ghost" className="px-3 py-1 text-xs" onClick={() => setCodeModalOpen(true)}>View Code</Button>
                    <Button variant="ghost" className="px-3 py-1 text-xs" onClick={() => handleViewLog(item)}>View Log</Button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Test Execution</h1>
            
            <Card>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Run Progress</h2>
                        {isComplete && <Badge variant={mockData.run.failed > 0 ? 'danger' : 'success'}>Run Complete</Badge>}
                    </div>
                    <div className="flex items-center gap-4">
                        <ProgressBar progress={progress} />
                        <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="flex space-x-4">
                        <Badge variant="info">Selected: {mockData.run.total}</Badge>
                        <Badge variant="info">Framework: Jest</Badge>
                        <Badge variant="info">Language: TypeScript</Badge>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Results</h2>
                <Table columns={columns} data={runResults} />
            </Card>

            <TestLogModal isOpen={isLogModalOpen} onClose={() => setLogModalOpen(false)} result={selectedResult} />
            
            <Modal isOpen={isCodeModalOpen} onClose={() => setCodeModalOpen(false)} title="Test Code: login.test.ts">
                <pre className="bg-background p-4 rounded-lg text-sm text-primary-muted whitespace-pre-wrap">
                    <code>
{`
describe('login', () => {
    it('should return a JWT for valid credentials', async () => {
        // test implementation...
    });

    it('should return 401 for invalid credentials', async () => {
        // test implementation...
    });
});
`}
                    </code>
                </pre>
            </Modal>
        </div>
    );
};

export default ExecutionPage;