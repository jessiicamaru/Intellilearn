import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Student } from '@/types';

type Props = {
    students: Student[];
    onLogin: (s: Student) => void;
};

export default function StudentLogin({ students, onLogin }: Props) {
    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Chọn học sinh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {students.map((s) => (
                    <Button key={s.student_id} variant="outline" className="w-full justify-start" onClick={() => onLogin(s)}>
                        <div className="text-left">
                            <div className="font-medium">{s.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {s.student_id} • {s.level_overall}
                            </div>
                        </div>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}
