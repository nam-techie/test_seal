import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Checkbox from '../components/ui/Checkbox';
import { mockData } from '../data/mock';
import { SuggestedTest } from '../types';
import { DocumentTextIcon, PlayIcon, SparklesIcon } from '../components/icons/Icons';

const AnalyzePage = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState<SuggestedTest[]>(mockData.suggestedTests);

    const handleSelectTest = (id: number) => {
        setTests(tests.map(test => test.id === id ? { ...test, selected: !test.selected } : test));
    };

    const handleSelectAll = () => {
        const allSelected = tests.every(test => test.selected);
        setTests(tests.map(test => ({ ...test, selected: !allSelected })));
    };

    const handleClearSelection = () => {
        setTests(tests.map(test => ({ ...test, selected: false })));
    };
    
    const selectedCount = tests.filter(t => t.selected).length;

    const testTypeVariant = (type: string) => {
      switch (type) {
        case 'unit': return 'info';
        case 'integration': return 'warning';
        case 'negative': return 'danger';
        case 'edge': return 'success';
        default: return 'info';
      }
    };

    const complexityBadge = (complexity: string) => {
        switch (complexity) {
            case 'S': return <Badge variant="success">Simple</Badge>;
            case 'M': return <Badge variant="warning">Medium</Badge>;
            case 'L': return <Badge variant="danger">Large</Badge>;
            default: return <Badge variant="info">{complexity}</Badge>;
        }
    };
    
    const columns = [
        { header: '#', accessor: (item: SuggestedTest) => <span className="text-primary-muted">{item.id}</span> },
        { header: 'Test Case', accessor: (item: SuggestedTest) => item.name },
        { header: 'Target Function', accessor: (item: SuggestedTest) => <code>{item.function}</code> },
        { header: 'Type', accessor: (item: SuggestedTest) => <Badge variant={testTypeVariant(item.type)}>{item.type}</Badge> },
        { header: 'Complexity', accessor: (item: SuggestedTest) => complexityBadge(item.complexity) },
        {
            header: 'Select',
            accessor: (item: SuggestedTest) => (
                <div className="flex justify-center">
                    <Checkbox
                        checked={item.selected || false}
                        onChange={() => handleSelectTest(item.id)}
                    />
                </div>
            ),
            className: 'text-center'
        },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">AI Analysis Results</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><SparklesIcon/> AI Summary</h2>
                        <p className="text-primary-muted mb-4">{mockData.aiSummary.overview}</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="font-semibold text-sm mr-2">Detected Tech:</span>
                            {mockData.repo.detectedTech.map(tech => <Badge key={tech} variant="info">{tech}</Badge>)}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="font-semibold text-sm mr-2">Potential Risks:</span>
                            {mockData.aiSummary.risks.map(risk => <Badge key={risk} variant="danger">{risk}</Badge>)}
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Suggested Test Cases ({tests.length})</h2>
                            <div className="space-x-2">
                                <Button variant="secondary" onClick={handleSelectAll}>Select All</Button>
                                <Button variant="ghost" onClick={handleClearSelection}>Clear</Button>
                            </div>
                        </div>
                        <Table columns={columns} data={tests} />
                        <div className="mt-6 flex justify-end">
                            <Button 
                                variant="action" 
                                onClick={() => navigate('/runs')} 
                                disabled={selectedCount === 0}
                                icon={<PlayIcon className="w-4 h-4" />}
                                className="group min-w-[200px]"
                            >
                                Run {selectedCount} Selected Test{selectedCount !== 1 ? 's' : ''}
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Code Structure</h2>
                        <ul className="space-y-2 text-sm">
                            {mockData.repo.files.map(file => (
                                <li key={file} className="flex items-center text-primary-muted hover:text-primary">
                                    <DocumentTextIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                    <span>{file}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AnalyzePage;
