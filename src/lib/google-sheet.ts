// src/lib/google-sheet.ts
import type { Student } from '@/types';

const SHEET_ID = '1PXg5yVODqb9WDvJT3YA-ksnr18rkmN_oYHp4aGFhebE';
const SHEET_NAME = 'studentprofile';
const API_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

export const fetchStudents = async (): Promise<Student[]> => {
    try {
        const res = await fetch(API_URL);
        const text = await res.text();

        // Google bọc JSON trong: google.visualization.Query.setResponse({...})
        const jsonText = text.substring(47, text.length - 2);
        const data = JSON.parse(jsonText);

        if (!data.table || !data.table.cols || !data.table.rows) {
            console.error('Dữ liệu Google Sheets không đúng định dạng', data);
            return [];
        }

        // Lấy header từ cols.label
        const headers = data.table.cols.map((col: any) => col.label);

        // Lấy dữ liệu từng dòng
        const rows = data.table.rows.map((row: any) => row.c);

        const students: Student[] = rows.map((cells: any[]) => {
            const obj: any = {};

            headers.forEach((header: string, index: number) => {
                const value = cells[index];
                let parsedValue: any = '';

                if (value !== null && value !== undefined) {
                    if (value.v !== null && value.v !== undefined) {
                        parsedValue = value.v;
                    } else if (value.f !== undefined) {
                        parsedValue = value.f; // dùng formatted value nếu có
                    }
                }

                // Chuẩn hóa key
                const key = header.toLowerCase().replace(/\s+/g, '_');
                obj[key] = parsedValue;
            });

            return obj as Student;
        });

        return students;
    } catch (error) {
        console.error('Lỗi khi fetch Google Sheets:', error);
        return [];
    }
};
