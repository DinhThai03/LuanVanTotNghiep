export interface User {
    id: number;
    username: string;
    role: 'admin' | 'student' | 'teacher' | 'parent';
    email: string;
    date_of_birth: string;
    full_name: string;
    address: string;
    phone: string;
    is_active: number;
    remember_token: string | null;
}
