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
    identity_number: string;
    issued_date: string;
    issued_place: string;
    ethnicity: string;
    religion: string;
    is_active: number;
    remember_token: string;
}


export interface Info {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    date_of_birth: string; // ISO string, có thể dùng Date nếu bạn muốn parse
    sex: boolean; // true = nam, false = nữ (tuỳ cách backend quy định)
    phone: string;
    email: string;
    address: string;
    identity_number: string;
    issued_date: string; // ISO string
    issued_place: string;
    ethnicity: string;
    religion: string;
    role: string; // hoặc union type như: "admin" | "user" | ...
    is_active: boolean;
}
