import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateProfile, getQuiz } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SkillPieChart from '@/components/SkillPieChart';

export default function ResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { student, answers, quiz, userAnswers } = state || {};

    const [updateResult, setUpdateResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!student || !answers) {
            navigate('/');
            return;
        }

        updateProfile(student.student_id, answers)
            .then((res) => setUpdateResult(res[0]))
            .finally(() => setLoading(false));
    }, [student, answers, navigate]);

    if (!student || !updateResult) {
        return <div className="flex items-center justify-center min-h-screen">Đang xử lý...</div>;
    }

    const { skill_updates, level_overall, rationale } = updateResult.profile_update;

    const correctCount = answers.filter((a: any) => a.correct === 1).length;
    const total = answers.length;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                <Card className="p-10">
                    <h1 className="text-4xl font-bold text-center mb-8 text-green-600">
                        Hoàn thành! Bạn trả lời đúng {correctCount}/{total} câu
                    </h1>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Cập nhật năng lực</h2>
                                <div className="space-y-3 text-lg">
                                    <p>
                                        Đại số: <strong className="text-blue-600">{skill_updates.dai_so}%</strong>
                                    </p>
                                    <p>
                                        Hình học: <strong className="text-red-600">{skill_updates.hinh_hoc}%</strong>
                                    </p>
                                    <p className="text-3xl font-bold text-primary mt-4">Trình độ mới: {level_overall}</p>
                                </div>
                            </div>

                            {rationale && <div className="p-4 bg-muted rounded-lg italic text-muted-foreground">{rationale}</div>}
                        </div>

                        <div className="flex justify-center items-center">
                            <SkillPieChart dai_so={skill_updates.dai_so} hinh_hoc={skill_updates.hinh_hoc} />
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 mt-12">
                        <Button size="lg" variant="outline" onClick={() => navigate('/profile', { state: { student } })}>
                            Về trang cá nhân
                        </Button>
                        <Button size="lg" onClick={() => navigate('/exam', { state: { student } })} disabled={loading}>
                            Làm bài mới ngay
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
