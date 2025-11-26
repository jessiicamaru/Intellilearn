import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuiz } from '@/lib/api';
import { useEffect } from 'react';
import Quiz from '@/components/Quiz';
import type { QuizResponse, Student } from '@/types';

export default function ExamPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const student: Student = state?.student;

    const [quiz, setQuiz] = useState<QuizResponse[] | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!student) {
            navigate('/');
            return;
        }

        getQuiz(student.student_id, 10)
            .then(setQuiz)
            .finally(() => setLoading(false));
    }, [student, navigate]);

    const handleSubmit = () => {
        if (!quiz || !student) return;

        const payload = quiz[0].selected_questions.map((q) => ({
            qid: q.qid,
            correct: answers[q.qid] === q.correct ? 1 : 0,
        }));

        navigate('/result', {
            state: { student, answers: payload, quiz, userAnswers: answers },
        });
    };

    if (!student) return null;
    if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tạo đề...</div>;
    if (!quiz) return <div className="text-center p-10">Không tải được đề thi.</div>;

    return <Quiz quiz={quiz[0]} answers={answers} setAnswers={setAnswers} onSubmit={handleSubmit} loading={false} />;
}
