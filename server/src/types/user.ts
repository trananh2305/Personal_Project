export interface User{
    _id: string;
    username: string;
    email?: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    phone?: string;
    role: 'admin' | 'user' | 'chef' | 'waiter';
}