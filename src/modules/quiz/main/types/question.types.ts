export interface Question {
    id: string;
    title: string;
    description: string;
    type: QuestionType;
    quizId: string;
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
    text: string;
    isCorrect: boolean;
    questionId: string;
}

export interface CreateQuestionRequest {
    title: string;
    description: string;
    type: QuestionType;
    quizId: string;
    options: CreateOptionRequest[];
}

export interface CreateOptionRequest {
    text: string;
    isCorrect: boolean;
}

export interface UpdateQuestionRequest {
    title?: string;
    description?: string;
    type?: QuestionType;
    options?: CreateOptionRequest[];
}
