import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SkillPieChart from '@/components/SkillPieChart';
import type { Student } from '@/types';

export default function ProfilePage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const student: Student = state?.student;

    if (!student) {
        navigate('/');
        return null;
    }

    const daiSo = Number(student.dai_so) || 50;
    const hinhHoc = Number(student.hinh_hoc) || 50;

    const handleGetExam = () => {
        navigate('/exam', { state: { student } });
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="p-8">
                    <h1 className="text-4xl font-bold text-center mb-8">Chào mừng, {student.name}!</h1>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Mã học sinh</p>
                                <p className="text-2xl font-semibold">{student.student_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Trình độ hiện tại</p>
                                <p className="text-4xl font-bold text-primary">{student.level_overall}</p>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    Đại số: <strong className="text-blue-600">{daiSo}%</strong>
                                </p>
                                <p>
                                    Hình học: <strong className="text-red-600">{hinhHoc}%</strong>
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <SkillPieChart dai_so={daiSo} hinh_hoc={hinhHoc} />
                        </div>
                    </div>

                    <div className="flex justify-center mt-12">
                        <Button size="lg" onClick={handleGetExam} className="text-lg px-12">
                            Làm bài tập mới
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
