type GenderCount = {
    male: number;
    female: number;
};

export interface DashboardStats {
    users: {
        students: GenderCount;
        teachers: GenderCount;
        parents: GenderCount;
        admins: GenderCount;
    };
    classes: number;
    subjects: number;
    lessons: number;
    registrations: number;
}
