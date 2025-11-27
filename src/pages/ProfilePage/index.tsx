import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Student, MetricHistory, AssessmentSummary } from '@/types';
import { useEffect, useState } from 'react';
import { User, Calendar, TrendingUp, BookOpen, Award, ArrowLeft, History, Target } from 'lucide-react';
import { fetchStudents, fetchMetricHistory, fetchAssessmentSummary } from '@/lib/google-sheet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProfilePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [metricHistory, setMetricHistory] = useState<MetricHistory[]>([]);
    const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = searchParams.get('id');
    const userRole = searchParams.get('role') as 'student' | 'teacher';

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        // Fetch all data in parallel
        Promise.all([fetchStudents(), fetchMetricHistory(userId), fetchAssessmentSummary(userId)])
            .then(([students, history, assessmentData]) => {
                const foundStudent = students.find((s) => s.student_id === userId);

                if (!foundStudent && userRole === 'student') {
                    setError(`Không tìm thấy học sinh với mã: ${userId}`);
                    setLoading(false);
                    return;
                }

                // If teacher or student found
                const studentData = foundStudent || {
                    student_id: userId,
                    name: `Giáo viên ${userId}`,
                    dai_so: '0',
                    hinh_hoc: '0',
                    level_overall: 'N/A',
                    last_update: new Date().toISOString(),
                };

                setStudent(studentData);
                setMetricHistory(history);
                setAssessments(assessmentData);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu');
                setLoading(false);
            });
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

    if (error || !student) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <User className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Không tìm thấy thông tin</h2>
                        <p className="text-gray-600">{error || 'Vui lòng thử lại'}</p>
                        <Button onClick={() => navigate('/')} className="w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại trang chủ
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
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

                            {/* Right Column - Score Analysis */}
                            <div className="space-y-4">
                                {assessments.length > 0 ? (
                                    <>
                                        {/* Recent Performance Card */}
                                        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Target className="w-4 h-4 text-purple-600" />
                                                    <h3 className="text-sm font-bold text-purple-900">Bài kiểm tra gần nhất</h3>
                                                </div>
                                                {assessments[0] && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-600">Điểm số</span>
                                                            <span className="text-2xl font-bold text-purple-600">{assessments[0].score_overall}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-600">Số câu đúng</span>
                                                            <span className="text-lg font-semibold text-green-600">
                                                                {assessments[0].num_correct}/{assessments[0].num_questions}
                                                            </span>
                                                        </div>
                                                        <div className="pt-2 border-t border-purple-200">
                                                            <div className="flex justify-between text-xs mb-2">
                                                                <span className="text-gray-600">Độ chính xác</span>
                                                                <span className="font-medium">
                                                                    {((assessments[0].num_correct / assessments[0].num_questions) * 100).toFixed(0)}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${
                                                                            (assessments[0].num_correct / assessments[0].num_questions) * 100
                                                                        }%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Performance Trend */}
                                        {assessments.length >= 2 && (
                                            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                                        <h3 className="text-sm font-bold text-blue-900">Xu hướng</h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {(() => {
                                                            const recent = assessments[0].score_overall;
                                                            const previous = assessments[1].score_overall;
                                                            const diff = recent - previous;
                                                            const isImproving = diff > 0;
                                                            return (
                                                                <>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-xs text-gray-600">So với lần trước</span>
                                                                        <Badge
                                                                            className={`${
                                                                                isImproving
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : 'bg-red-100 text-red-800'
                                                                            }`}
                                                                        >
                                                                            {isImproving ? '↑' : '↓'} {Math.abs(diff)} điểm
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 mt-2">
                                                                        {isImproving ? '🎉 Tiến bộ rõ rệt!' : '💪 Cố gắng thêm nhé!'}
                                                                    </p>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Topic Strength */}
                                        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Award className="w-4 h-4 text-emerald-600" />
                                                    <h3 className="text-sm font-bold text-emerald-900">Điểm mạnh</h3>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span>Đại số</span>
                                                            <span className="font-medium">{daiSo}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                                                style={{ width: `${daiSo}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span>Hình học</span>
                                                            <span className="font-medium">{hinhHoc}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                                                                style={{ width: `${hinhHoc}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-emerald-200">
                                                        {daiSo > hinhHoc ? '📐 Đại số là điểm mạnh của bạn!' : '📏 Hình học là điểm mạnh của bạn!'}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </>
                                ) : (
                                    <Card className="border-0 shadow-md">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <BookOpen className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">Chưa có dữ liệu bài kiểm tra</p>
                                            <p className="text-xs text-gray-500">Hãy làm bài tập đầu tiên để xem thống kê!</p>
                                        </CardContent>
                                    </Card>
                                )}
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

                {/* Learning Progress Chart */}
                {metricHistory.length > 0 && (
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg sm:text-xl font-bold">Biểu đồ tiến bộ học tập</h2>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={metricHistory.map((m) => ({
                                        date: new Date(m.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                                        'Đại số': Number(m.dai_so),
                                        'Hình học': Number(m.hinh_hoc),
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Đại số" stroke="#3b82f6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Hình học" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Assessment History */}
                {assessments.length > 0 && (
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <History className="w-5 h-5 text-purple-600" />
                                <h2 className="text-lg sm:text-xl font-bold">Lịch sử làm bài</h2>
                            </div>

                            {/* Statistics Summary */}
                            <div className="grid sm:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="w-4 h-4 text-blue-600" />
                                        <p className="text-xs text-blue-600 font-medium">Tổng số bài</p>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">{assessments.length}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="w-4 h-4 text-green-600" />
                                        <p className="text-xs text-green-600 font-medium">Điểm trung bình</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">
                                        {(assessments.reduce((sum, a) => sum + (Number(a.score_overall) || 0), 0) / assessments.length).toFixed(1)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-amber-600" />
                                        <p className="text-xs text-amber-600 font-medium">Độ chính xác</p>
                                    </div>
                                    <p className="text-2xl font-bold text-amber-900">
                                        {(() => {
                                            const totalCorrect = assessments.reduce((sum, a) => sum + (Number(a.num_correct) || 0), 0);
                                            const totalQuestions = assessments.reduce((sum, a) => sum + (Number(a.num_questions) || 0), 0);
                                            return totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(0) : 0;
                                        })()}
                                        %
                                    </p>
                                </div>
                            </div>

                            {/* Assessment List */}
                            <div className="space-y-3">
                                {assessments.slice(0, 5).map((assessment) => (
                                    <div
                                        key={assessment.assessment_id}
                                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {assessment.main_topic === 'Đại số' ? '📐 Đại số' : '📏 Hình học'}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {assessment.finished_at && new Date(assessment.finished_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                {/* Temporarily commented - time data not set up yet */}
                                                {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {(() => {
                                                            const duration = Math.round((new Date(assessment.finished_at).getTime() - new Date(assessment.started_at).getTime()) / 60000);
                                                            return isNaN(duration) || duration < 0 ? 'N/A' : `${duration} phút`;
                                                        })()}
                                                    </span>
                                                </div> */}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">{Number(assessment.score_overall) || 0}</div>
                                                <div className="text-xs text-gray-500">
                                                    {Number(assessment.num_correct) || 0}/{Number(assessment.num_questions) || 0} đúng
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-600">
                                                    Đại số: <span className="font-medium">{Number(assessment.accuracy_dai_so) || 0}%</span>
                                                </span>
                                                <span className="text-gray-600">
                                                    Hình học: <span className="font-medium">{Number(assessment.accuracy_hinh_hoc) || 0}%</span>
                                                </span>
                                            </div>
                                            {assessment.level_after !== assessment.level_before && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {assessment.level_before} → {assessment.level_after}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
