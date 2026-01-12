export interface Question {
    id: string;
    title: string;
    description: string;
    type: QuestionType;
    order: number;
    quizId: string;
    points: number;
    options: Option[];
    createdAt: string;
    updatedAt: string;
}

export enum QuestionType {
    UNIQUE_SELECTION = 'UNIQUE_SELECTION',
    MULTIPLE_SELECTION = 'MULTIPLE_SELECTION',
}

export interface Option {
    id: string;
    content: string;
    isCorrect: boolean;
}

export interface CreateQuestionRequest {
    title: string;
    description: string;
    type: QuestionType;
    quizId: string;
    points: number;
    options: CreateOptionRequest[];
}

export interface CreateOptionRequest {
    content: string;
    isCorrect: boolean;
}

export interface UpdateOptionRequest {
    id?: string;
    content: string;
    isCorrect: boolean;
}

export interface UpdateQuestionRequest {
    title?: string;
    description?: string;
    type?: QuestionType;
    points?: number;
    options?: UpdateOptionRequest[];
}
