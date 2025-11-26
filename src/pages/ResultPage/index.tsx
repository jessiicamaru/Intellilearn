// src/pages/ResultPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateProfile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import SkillPieChart from '@/components/SkillPieChart';
import { BookOpen, Lightbulb, Target } from 'lucide-react';

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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Đang xử lý kết quả...</div>
            </div>
        );
    }

    const { skill_updates, level_overall, rationale } = updateResult.profile_update;
    const miniLessons = updateResult.mini_lessons || [];

    const correctCount = answers.filter((a: any) => a.correct === 1).length;
    const total = answers.length;
    const scorePercent = Math.round((correctCount / total) * 100);

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header kết quả */}
                <Card className="border-2 border-green-200 bg-green-50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold text-green-700 flex items-center justify-center gap-3">
                            <Lightbulb className="w-12 h-12" />
                            Hoàn thành xuất sắc!
                        </CardTitle>
                        <CardDescription className="text-2xl mt-4">
                            Bạn trả lời đúng{' '}
                            <strong className="text-green-600">
                                {correctCount}/{total}
                            </strong>{' '}
                            câu ({scorePercent}%)
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cột trái: Năng lực + Biểu đồ */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-6 h-6" />
                                    Cập nhật năng lực
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Đại số</p>
                                            <p className="text-4xl font-bold text-blue-600">{skill_updates.dai_so}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Hình học</p>
                                            <p className="text-4xl font-bold text-red-600">{skill_updates.hinh_hoc}%</p>
                                        </div>
                                        <div className="pt-4">
                                            <p className="text-sm text-muted-foreground">Trình độ tổng</p>
                                            <p className="text-5xl font-bold text-primary">{level_overall}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <SkillPieChart dai_so={skill_updates.dai_so} hinh_hoc={skill_updates.hinh_hoc} />
                                    </div>
                                </div>

                                {rationale && <div className="mt-8 p-4 bg-muted rounded-lg italic text-muted-foreground text-sm">{rationale}</div>}
                            </CardContent>
                        </Card>

                        {/* Mini Lessons – Phần học bù */}
                        {miniLessons.length > 0 && (
                            <Card className="border-orange-200 bg-orange-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-orange-700">
                                        <BookOpen className="w-8 h-8" />
                                        Bài học bổ sung dành riêng cho bạn
                                    </CardTitle>
                                    <CardDescription>Dựa trên phần bạn còn yếu, hệ thống gợi ý ôn lại những kiến thức này nhé!</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        {miniLessons.map((lesson: any, index: number) => (
                                            <AccordionItem key={index} value={`lesson-${index}`}>
                                                <AccordionTrigger className="text-lg font-semibold">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="secondary" className="text-sm">
                                                            {lesson.topic}
                                                        </Badge>
                                                        <span>{lesson.title}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="prose prose-sm max-w-none text-foreground">
                                                        {/* Render Markdown-style content đẹp hơn */}
                                                        {lesson.content.split('\n').map((line: string, i: number) => {
                                                            if (line.startsWith('**') && line.endsWith('**')) {
                                                                return (
                                                                    <h4 key={i} className="font-bold text-primary mt-4 mb-2">
                                                                        {line.replace(/\*\*/g, '')}
                                                                    </h4>
                                                                );
                                                            }
                                                            if (line.startsWith('(a)') || line.startsWith('(b)') || line.startsWith('(c)')) {
                                                                return (
                                                                    <p key={i} className="ml-4 text-muted-foreground">
                                                                        <strong>{line.split(' ')[0]}</strong> {line.slice(line.indexOf(' ') + 1)}
                                                                    </p>
                                                                );
                                                            }
                                                            return (
                                                                <p key={i} className="my-2">
                                                                    {line}
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Cột phải: Nút hành động */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-6 text-center">Bạn muốn làm gì tiếp?</h3>
                            <div className="space-y-4">
                                <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/profile', { state: { student } })}>
                                    Về trang cá nhân
                                </Button>

                                <Button size="lg" className="w-full" onClick={() => navigate('/exam', { state: { student } })} disabled={loading}>
                                    Làm bài tập mới ngay
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
