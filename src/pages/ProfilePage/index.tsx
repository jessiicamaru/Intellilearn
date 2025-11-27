import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Student } from '@/types';
import { useEffect, useState } from 'react';
import { User, Calendar, TrendingUp, BookOpen, Award, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = searchParams.get('id');
    const userRole = searchParams.get('role') as 'student' | 'teacher';

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        // Simulate API call - Replace with real API
        setTimeout(() => {
            // Mock data based on user ID
            const mockStudent: Student = {
                student_id: userId,
                name: userRole === 'teacher' ? `Giáo viên ${userId}` : `Học sinh ${userId}`,
                dai_so: '75',
                hinh_hoc: '65',
                level_overall: 'B+',
                last_update: new Date().toISOString(),
            };
            setStudent(mockStudent);
            setLoading(false);
        }, 800);
    }, [userId, userRole, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-6">
                <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                    <Skeleton className="h-12 w-64 mx-auto" />
                    <Card className="p-6 sm:p-8">
                        <Skeleton className="h-32 w-full mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </Card>
                </div>
            </div>
        );
    }

    if (!student) {
        return null;
    }

    const daiSo = Number(student.dai_so) || 50;
    const hinhHoc = Number(student.hinh_hoc) || 50;
    const isTeacher = userRole === 'teacher';

    const handleGetExam = () => {
        navigate('/exam', { state: { student } });
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-6">
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Quay lại</span>
                    </Button>
                    <Badge variant={isTeacher ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                        {isTeacher ? '👨‍🏫 Giáo viên' : '🎓 Học sinh'}
                    </Badge>
                </div>

                {/* Welcome Card */}
                <Card className="overflow-hidden border-0 shadow-xl">
                    <div
                        className={`${
                            isTeacher ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                        } p-6 sm:p-8 text-white`}
                    >
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <User className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-4xl font-bold">Chào mừng!</h1>
                                <p className="text-lg sm:text-2xl text-white/90 mt-1">{student.name}</p>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-4 sm:p-8">
                        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                            {/* Left Column - Info */}
                            <div className="space-y-4 sm:space-y-6">
                                {/* Student ID */}
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-muted-foreground">Mã định danh</p>
                                        <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{student.student_id}</p>
                                    </div>
                                </div>

                                {/* Level */}
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                        <Award className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs sm:text-sm text-muted-foreground">Trình độ hiện tại</p>
                                        <p className="text-3xl sm:text-5xl font-bold text-amber-600">{student.level_overall}</p>
                                    </div>
                                </div>

                                {/* Skills Progress */}
                                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        <p className="font-semibold text-gray-900">Kỹ năng</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Đại số</span>
                                                <span className="text-lg font-bold text-blue-600">{daiSo}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${daiSo}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Hình học</span>
                                                <span className="text-lg font-bold text-red-600">{hinhHoc}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${hinhHoc}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Update */}
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>Cập nhật: {new Date(student.last_update).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>

                            {/* Right Column - Empty Space */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                    <p className="text-sm text-gray-400">Dành cho biểu đồ trong tương lai</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        {!isTeacher && (
                            <div className="flex justify-center mt-8 sm:mt-12">
                                <Button
                                    size="lg"
                                    onClick={handleGetExam}
                                    className="text-base sm:text-lg px-8 sm:px-12 h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                                >
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Làm bài tập mới
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
