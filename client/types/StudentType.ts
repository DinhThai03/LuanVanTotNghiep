import { ClassData } from "./ClassType";
import { User } from "./UserType";

export interface StudentData {
    code: string;
    class_id: number;
    user_id: number;
    place_of_birth: string;
    status: string;
    user: User;
    school_class: ClassData;
}