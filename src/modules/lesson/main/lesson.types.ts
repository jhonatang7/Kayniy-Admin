export interface Lesson {
    id: string;
    title: string;
    type: LessonType;
    description: string;
    urlContent: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
}

export enum LessonType {
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
}

export interface CreateLessonRequest {
    title: string;
    type: LessonType;
    description: string;
    urlContent: string;
    duration: number;
    moduleId: string;
    file?: File; // Archivo PDF opcional para documentos
}

export interface UpdateLessonRequest {
    title?: string;
    type?: LessonType;
    description?: string;
    urlContent?: string;
    duration?: number;
    file?: File; // Archivo PDF opcional para documentos
}