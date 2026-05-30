import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Trophy,
    Target,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const QuizResultPage = () => {
    const { quizId } = useParams();

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await quizService.getQuizResults(quizId);

                console.log('Quiz Results:', response);

                setResults(response);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch quiz results');
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchResults();
        }
    }, [quizId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        );
    }

    const quiz =
        results?.data?.quiz ||
        results?.quiz ||
        {};

    const detailedResults =
        results?.data?.results ||
        results?.results ||
        [];

    const score = Number(quiz?.score || 0);

    const totalQuestions = detailedResults.length;

    const correctAnswers = detailedResults.filter(
        (item) => item?.isCorrect
    ).length;

    const incorrectAnswers =
        totalQuestions - correctAnswers;

    const getScoreColor = () => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-orange-500';
        return 'text-red-500';
    };

    const getScoreMessage = () => {
        if (score >= 90) return 'Outstanding!';
        if (score >= 80) return 'Great Job!';
        if (score >= 70) return 'Good Work!';
        if (score >= 60) return 'Not Bad!';
        return 'Keep Practicing!';
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="mb-8">
                <Link
                    to="/documents"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back to Document
                </Link>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-8">
                {quiz?.title || 'Quiz Results'}
            </h1>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-10">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl bg-emerald-100 flex items-center justify-center">
                        <Trophy
                            size={42}
                            className="text-emerald-600"
                        />
                    </div>

                    <p className="mt-8 text-slate-500 uppercase font-medium tracking-wider">
                        Your Score
                    </p>

                    <h2
                        className={`text-7xl font-bold mt-3 ${getScoreColor()}`}
                    >
                        {score}%
                    </h2>

                    <p className="text-3xl font-semibold text-slate-700 mt-2">
                        {getScoreMessage()}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 w-full max-w-3xl">
                        <div className="border border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-3">
                            <Target className="text-slate-500" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {totalQuestions}
                                </p>
                                <p className="text-slate-500">
                                    Total
                                </p>
                            </div>
                        </div>

                        <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5 flex items-center justify-center gap-3">
                            <CheckCircle2 className="text-emerald-600" />
                            <div>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {correctAnswers}
                                </p>
                                <p className="text-emerald-600">
                                    Correct
                                </p>
                            </div>
                        </div>

                        <div className="border border-red-200 bg-red-50 rounded-2xl p-5 flex items-center justify-center gap-3">
                            <XCircle className="text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-600">
                                    {incorrectAnswers}
                                </p>
                                <p className="text-red-600">
                                    Incorrect
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResultPage;