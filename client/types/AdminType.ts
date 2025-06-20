import { User } from "./UserType";

export interface AdminData {
    user_id: number;
    admin_level: number;
    user: User;
}