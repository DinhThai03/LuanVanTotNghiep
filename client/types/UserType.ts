export interface User {
    id: number;
    username: string;
    role: 'admin' | 'student' | 'teacher' | 'parent';
    email: string;
    date_of_birth: string;
    first_name: string;
    last_name: string;
    sex: boolean;
    address: string;
    phone: string;
    identity_number: string | null;
    issued_date: string | null;
    issued_place: string | null;
    ethnicity: string | null;
    religion: string | null;
    is_active: number;
    remember_token: string | null;
}
