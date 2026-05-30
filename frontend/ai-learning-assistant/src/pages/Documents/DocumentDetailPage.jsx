import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentService from '../../services/documentService.js';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import ChatInterface from '../../components/chat/ChatInterface';
import MarkdownRenderer from '../../components/common/MarkDownRenderer'

import toast from 'react-hot-toast';
import {
    ArrowLeft,
    ExternalLink,
} from 'lucide-react';
import AIActions from '../../components/ai/AIActions.jsx';
import QuizManager from '../../components/quizzes/QuizManager.jsx';

const DocumentDetailPage = () => {
    const { id } = useParams();

    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Content');

    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const data = await documentService.getDocumentById(id);
                setDocument(data);
            } catch (error) {
                toast.error('Failed to fetch document details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentDetails();
    }, [id]);

    // Get Full PDF URL
    const getPdfUrl = () => {
        if (!document?.data?.filePath) return null;

        const filePath = document.data.filePath;

        // Fixes the ReferenceError by returning filePath instead of fileUrl
        if (
            filePath.startsWith('http://') ||
            filePath.startsWith('https://')
        ) {
            return filePath; 
        }

        //const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        // Change this line:
// const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// To this:
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    };

    // Content Tab
    const renderContent = () => {
        if (loading) {
            return <Spinner />;
        }

        if (!document?.data?.filePath) {
            return (
                <div className="text-center p-8">
                    PDF not available.
                </div>
            );
        }
         console.log(document.data.filePath);
console.log(getPdfUrl());
        const pdfUrl = getPdfUrl();

        return (
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
                    <span className="text-sm font-medium text-gray-700">
                        Document Viewer
                    </span>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                    >
                        <ExternalLink size={16} />
                        Open in new tab
                    </a>
                </div>

                {/* PDF */}
                <div className="bg-gray-100 p-1">
                    <iframe
                        src={pdfUrl}
                        className="w-full"
                        title="PDF Viewer"
                        frameBorder="0"
                        style={{
                            height: '80vh',
                            colorScheme: 'light',
                        }}
                    />
                </div>
            </div>
        );
    };

    const renderChat = () => {
        return <ChatInterface/>
    };
    const renderAIActions = () => {
        return <AIActions/>
    };
     const renderFlashcardsTab = () => {
        return <FlashcardManager documentId={id} />
    }
    const renderQuizzesTab = () => {
        return <QuizManager documentId={id}/>
    }
    // Dynamic rendering helper so content only updates/calculates for the active view
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Content': return renderContent();
            case 'Chat': return renderChat();
            case 'AI Actions': return renderAIActions();
            case 'Flashcards': return renderFlashcardsTab();
            case 'Quizzes': return renderQuizzesTab();
            default: return renderContent();
        }
    };

    const tabs = [
        { name: 'Content', label: 'Content' },
        { name: 'Chat', label: 'Chat' },
        { name: 'AI Actions', label: 'AI Actions' },
        { name: 'Flashcards', label: 'Flashcards' },
        { name: 'Quizzes', label: 'Quizzes' },
    ];

    if (loading) {
        return <Spinner />;
    }

    if (!document) {
        return (
            <div className="text-center p-8">
                Document not found.
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Back Button */}
            <div className="mb-4">
                <Link
                    to="/documents"
                    className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Documents
                </Link>
            </div>
            
            <PageHeader title={document.data.title} />
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Render active content container down here */}
            <div className="mt-4">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default DocumentDetailPage;