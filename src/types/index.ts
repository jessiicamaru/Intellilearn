export type Student = {
    student_id: string;
    name: string;
    dai_so: string;
    hinh_hoc: string;
    level_overall: string;
    last_update: string;
};

export type Question = {
    row_number: number;
    qid: string;
    grade: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correct: string;
    topic: string;
    sub_topic: string;
    level: number;
    skill_tag: string;
};

export type QuizResponse = {
    selected_questions: Question[];
    overall_reason: string;
};

export type StudentAnswer = {
    qid: string;
    selected: string;
    correct: string;
};

export type ProfileUpdateResponse = {
    profile_update: {
        student_id: string;
        skill_updates: {
            dai_so: number;
            hinh_hoc: number;
        };
        level_overall: string;
        rationale: string;
    };
};
