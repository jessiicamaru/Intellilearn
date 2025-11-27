import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type QuizResponse } from '@/types';
import { MessageCircle, BookOpen, Target, AlertCircle } from 'lucide-react';

type Props = {
    quiz: QuizResponse;
    answers: Record<string, string>;
    setAnswers: (a: Record<string, string>) => void;
    onSubmit: () => void;
    loading: boolean;
};

const getLevelColor = (level: number) => {
    if (level === 1) return 'bg-green-100 text-green-800 border-green-300';
    if (level === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
};

const getLevelText = (level: number) => {
    if (level === 1) return 'Dễ';
    if (level === 2) return 'Trung bình';
    return 'Khó';
};

const getTopicText = (topic: string) => {
    return topic === 'dai_so' ? 'Đại số' : 'Hình học';
};

export default function Quiz({ quiz, answers, setAnswers, onSubmit, loading }: Props) {
    if (!quiz || !quiz.selected_questions) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Đang tải đề thi...</div>
            </div>
        );
    }

    const isComplete = quiz.selected_questions.every((q) => answers[q.qid]);
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = quiz.selected_questions.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Bài tập được gợi ý</h1>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {answeredCount}/{totalQuestions} câu
                        </span>
                        {quiz.assessment_id && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">ID: {quiz.assessment_id}</span>
                        )}
                    </div>
                </div>

                {/* Teacher's Message */}
                {quiz.overall_reason && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        Lời nhắn từ giáo viên
                                    </h3>
                                    <p className="text-blue-50 leading-relaxed">{quiz.overall_reason}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Questions */}
                <div className="space-y-5">
                    {quiz.selected_questions.map((q, i) => (
                        <Card key={q.qid} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="text-lg font-bold text-blue-600">Câu {i + 1}</span>
                                                <Badge className={`${getLevelColor(q.level)} border`}>
                                                    {getLevelText(q.level)}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {getTopicText(q.topic)}
                                                </Badge>
                                            </div>
                                            <p className="text-base sm:text-lg font-medium text-gray-900">{q.question}</p>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <RadioGroup
                                        value={answers[q.qid] || ''}
                                        onValueChange={(val) => setAnswers({ ...answers, [q.qid]: val })}
                                        className="space-y-3"
                                    >
                                        {['A', 'B', 'C', 'D'].map((opt) => (
                                            <div
                                                key={opt}
                                                className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:bg-blue-50 ${
                                                    answers[q.qid] === opt
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 bg-white'
                                                }`}
                                            >
                                                <RadioGroupItem value={opt} id={`${q.qid}-${opt}`} className="mt-1" />
                                                <Label htmlFor={`${q.qid}-${opt}`} className="flex-1 cursor-pointer">
                                                    <span className="font-semibold text-gray-700">{opt}.</span>{' '}
                                                    <span className="text-gray-900">{q[`option${opt}` as keyof typeof q]}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>

                                    {/* Question Reason */}
                                    {q.reason && (
                                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                                                    <span className="font-semibold">Ghi chú:</span> {q.reason}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="sticky bottom-4 flex justify-center pt-4">
                    <Button
                        size="lg"
                        onClick={onSubmit}
                        disabled={!isComplete || loading}
                        className="text-base sm:text-lg px-8 sm:px-12 h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang nộp bài...' : isComplete ? 'Nộp bài' : `Còn ${totalQuestions - answeredCount} câu`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
