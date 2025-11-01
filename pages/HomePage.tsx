import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { GithubIcon, CodeBracketIcon, UploadIcon, XIcon, BeakerIcon, PlayIcon, ChartBarIcon, SparklesIcon } from '../components/icons/Icons';

const HomePage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<File[]>([]);

    const handleAnalyze = () => {
        // Here you would typically trigger an API call
        // For now, we just navigate to the analyze page
        navigate('/analyze');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    const tabs = [
        {
            label: 'GitHub URL',
            content: (
                <div className="space-y-4">
                    <div className="relative">
                        <GithubIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-muted" />
                        <input type="text" placeholder="https://github.com/username/repo" className="w-full bg-background border border-surface2 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-violet" />
                    </div>
                    <Button onClick={handleAnalyze} className="w-full flex justify-center items-center gap-2">
                        <SparklesIcon/> Analyze & Generate Tests
                    </Button>
                </div>
            )
        },
        {
            label: 'Code Snippet',
            content: (
                <div className="space-y-4">
                    <textarea placeholder="// Paste your code snippet here..." className="w-full h-40 bg-background border border-surface2 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet"></textarea>
                    <Button onClick={handleAnalyze} className="w-full">Analyze Snippet</Button>
                </div>
            )
        },
        {
            label: 'Upload Files',
            content: (
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-surface2 rounded-lg p-8 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-primary-muted" />
                        <p className="mt-2 text-sm text-primary-muted">Drag & drop files or click to browse</p>
                        <p className="text-xs text-primary-muted/70">Max 10 files, 1MB per file</p>
                        <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {files.map(file => (
                                <div key={file.name} className="bg-surface2 rounded-full py-1 pl-3 pr-2 flex items-center text-sm">
                                    <span>{file.name}</span>
                                    <span className="text-xs text-primary-muted ml-2">{Math.round(file.size / 1024)} KB</span>
                                    <button onClick={() => removeFile(file.name)} className="ml-2 hover:text-status-danger">
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                     <Button onClick={handleAnalyze} className="w-full" disabled={files.length === 0}>Analyze Files</Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center p-12 rounded-2xl bg-gradient-g2">
                <h1 className="text-4xl font-extrabold text-white mb-2">Welcome to Test Studio AI</h1>
                <p className="text-lg text-primary-muted max-w-2xl mx-auto">
                    The intelligent testing agent that analyzes your code, suggests tests, and automates execution and reporting.
                </p>
            </div>

            <Card glow={true}>
                <h2 className="text-2xl font-bold mb-4">Start a New Test Analysis</h2>
                <Tabs tabs={tabs} />
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4 border border-accent-cyan">
                            <BeakerIcon className="w-8 h-8 text-accent-cyan"/>
                        </div>
                        <h3 className="text-lg font-semibold">1. Analyze</h3>
                        <p className="text-primary-muted text-sm">Provide your codebase via GitHub, snippet, or file upload for our AI to analyze its structure and logic.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4 border border-accent-violet">
                            <PlayIcon className="w-8 h-8 text-accent-violet"/>
                        </div>
                        <h3 className="text-lg font-semibold">2. Select & Run</h3>
                        <p className="text-primary-muted text-sm">Review AI-generated test cases, select the ones you need, and execute them with a single click.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4 border border-status-success">
                            <ChartBarIcon className="w-8 h-8 text-status-success"/>
                        </div>
                        <h3 className="text-lg font-semibold">3. Report</h3>
                        <p className="text-primary-muted text-sm">Get instant results, detailed logs, AI-powered failure analysis, and a comprehensive reporting dashboard.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default HomePage;
