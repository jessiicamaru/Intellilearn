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
    reason?: string;
};

export type QuizResponse = {
    selected_questions: Question[];
    overall_reason: string;
    assessment_id?: string;
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

export type MetricHistory = {
    row_id: string;
    student_id: string;
    timestamp: string;
    dai_so: number;
    hinh_hoc: number;
    level_overall: string;
    assessment_id: string;
};

export type AssessmentSummary = {
    assessment_id: string;
    student_id: string;
    started_at: string;
    finished_at: string;
    num_questions: number;
    num_correct: number;
    num_wrong: number;
    score_overall: number;
    accuracy_dai_so: number;
    accuracy_hinh_hoc: number;
    level_before: string;
    level_after: string;
    main_topic: string;
};
