import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Student } from '@/types';
import SkillPieChart from '../SkillPieChart';

type Props = {
    student: Student;
    lastUpdate: any;
    onGetNewQuiz: () => void;
    loading: boolean;
};

export default function QuizResult({ student, lastUpdate, onGetNewQuiz, loading }: Props) {
    const daiSo = lastUpdate?.profile_update.skill_updates.dai_so ?? parseInt(student.dai_so || '50');
    const hinhHoc = lastUpdate?.profile_update.skill_updates.hinh_hoc ?? parseInt(student.hinh_hoc || '50');

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <Card className="p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Xin chào, {student.name}!</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Năng lực hiện tại</h2>
                        <div className="space-y-3 text-lg">
                            <p>
                                Đại số: <strong>{daiSo}%</strong>
                            </p>
                            <p>
                                Hình học: <strong>{hinhHoc}%</strong>
                            </p>
                            <p>
                                Trình độ tổng:{' '}
                                <strong className="text-2xl text-primary">{lastUpdate?.profile_update.level_overall || student.level_overall}</strong>
                            </p>
                        </div>
                    </div>

                    <div>
                        <SkillPieChart dai_so={daiSo} hinh_hoc={hinhHoc} />
                    </div>
                </div>

                {lastUpdate && (
                    <div className="mt-8 p-4 bg-muted rounded-lg">
                        <p className="text-sm italic">{lastUpdate.profile_update.rationale}</p>
                    </div>
                )}

                <div className="flex justify-center mt-10">
                    <Button size="lg" onClick={onGetNewQuiz} disabled={loading}>
                        {loading ? 'Đang tạo đề...' : 'Làm bài tập mới'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
