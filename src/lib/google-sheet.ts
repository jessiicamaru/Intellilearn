// src/lib/google-sheet.ts
import type { Student, MetricHistory, AssessmentSummary } from '@/types';

const SHEET_ID = '1PXg5yVODqb9WDvJT3YA-ksnr18rkmN_oYHp4aGFhebE';

// Generic function to fetch data from any sheet
const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
        const res = await fetch(url);
        const text = await res.text();

        // Google bọc JSON trong: google.visualization.Query.setResponse({...})
        const jsonText = text.substring(47, text.length - 2);
        const data = JSON.parse(jsonText);

        if (!data.table || !data.table.cols || !data.table.rows) {
            console.error(`Dữ liệu từ sheet ${sheetName} không đúng định dạng`, data);
            return [];
        }

        // Lấy header từ cols.label
        const headers = data.table.cols.map((col: { label: string }) => col.label);

        // Lấy dữ liệu từng dòng
        const rows = data.table.rows.map((row: { c: unknown[] }) => row.c);

        const result: T[] = rows.map((cells: unknown[]) => {
            const obj: Record<string, string | number> = {};

            headers.forEach((header: string, index: number) => {
                const value = cells[index] as { v?: string | number; f?: string } | null;
                let parsedValue: string | number = '';

                if (value !== null && value !== undefined) {
                    if (value.v !== null && value.v !== undefined) {
                        parsedValue = value.v;
                    } else if (value.f !== undefined) {
                        parsedValue = value.f;
                    }
                }

                // Chuẩn hóa key
                const key = header.toLowerCase().replace(/\s+/g, '_');
                obj[key] = parsedValue;
            });

            return obj as T;
        });

        return result;
    } catch (error) {
        console.error(`Lỗi khi fetch sheet ${sheetName}:`, error);
        return [];
    }
};

export const fetchStudents = async (): Promise<Student[]> => {
    return fetchSheetData<Student>('StudentProfile');
};

export const fetchMetricHistory = async (studentId: string): Promise<MetricHistory[]> => {
    const data = await fetchSheetData<MetricHistory>('MetricHistory');
    return data.filter((m) => m.student_id === studentId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const fetchAssessmentSummary = async (studentId: string): Promise<AssessmentSummary[]> => {
    const data = await fetchSheetData<AssessmentSummary>('AssessmentSummary');
    return data.filter((a) => a.student_id === studentId).sort((a, b) => new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime());
};
