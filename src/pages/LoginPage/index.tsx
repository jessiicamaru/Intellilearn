import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudents } from '@/lib/google-sheet';
import CenterLayout from '@/layouts/CenterLayout';
import StudentLogin from '@/components/StudentLogin';
import type { Student } from '@/types';

export default function LoginPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents().then(setStudents);
    }, []);

    const handleLogin = (student: Student) => {
        navigate('/profile', { state: { student } });
    };

    return (
        <CenterLayout>
            <StudentLogin students={students} onLogin={handleLogin} />
        </CenterLayout>
    );
}
