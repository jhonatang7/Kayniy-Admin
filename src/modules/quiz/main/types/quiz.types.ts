export interface Quiz {
    id: string;
    name: string;
    description: string;
    passingScore: number;
    moduleId: string;
    registeredDate: string;
    updatedAt: string;
}

export interface CreateQuizRequest {
    name: string;
    description: string;
    passingScore: number;
    moduleId: string;
}

export interface UpdateQuizRequest {
    name?: string;
    description?: string;
    passingScore?: number;
}