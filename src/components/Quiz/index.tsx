import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { type QuizResponse } from '@/types';

type Props = {
    quiz: QuizResponse;
    answers: Record<string, string>;
    setAnswers: (a: Record<string, string>) => void;
    onSubmit: () => void;
    loading: boolean;
};

export default function Quiz({ quiz, answers, setAnswers, onSubmit, loading }: Props) {
    const isComplete = quiz.questions.every((q) => answers[q.qid]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-center">Làm bài tập</h1>
            <div className="space-y-6">
                {quiz.questions.map((q, i) => (
                    <Card key={q.qid} className="p-6">
                        <div className="space-y-4">
                            <p className="font-medium">
                                Câu {i + 1}: {q.question}
                            </p>
                            <RadioGroup value={answers[q.qid] || ''} onValueChange={(val) => setAnswers({ ...answers, [q.qid]: val })}>
                                {['A', 'B', 'C', 'D'].map((opt) => (
                                    <div key={opt} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt} id={`${q.qid}-${opt}`} />
                                        <Label htmlFor={`${q.qid}-${opt}`}>
                                            <span className="font-semibold">{opt}.</span> {q[`option${opt}` as keyof typeof q]}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center">
                <Button size="lg" onClick={onSubmit} disabled={!isComplete || loading}>
                    {loading ? 'Đang nộp...' : 'Nộp bài'}
                </Button>
            </div>
        </div>
    );
}
