import type { ProfileUpdateResponse, QuizResponse } from '@/types';

// src/lib/api.ts
const API_ENDPOINT = 'https://vcoch.app.n8n.cloud/webhook-test/intellilearn';

export const getQuiz = async (studentId: string, numQuestion: number = 10) => {
    const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'get_quiz',
            content: { student_id: studentId, num_question: numQuestion },
        }),
    });
    return (await res.json()) as QuizResponse;
};

export const updateProfile = async (studentId: string, answers: { qid: string; correct: 0 | 1 }[]) => {
    const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'update_profile',
            content: { student_id: studentId, answers },
        }),
    });
    return (await res.json()) as ProfileUpdateResponse[];
};
