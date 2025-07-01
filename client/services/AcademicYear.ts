import axios from "@/lib/Axios";

// Lấy danh sách năm học
export const getAcademicYears = async () => {
    const res = await axios.get("/api/academic_years");
    return res.data;
};

export const getAcademicYearsWithSemesters = async () => {
    const res = await axios.get("/api/academic-years/with-semesters");
    return res.data;
};


// Thêm năm học mới
export const addAcademicYear = async (academic_year: FormData) => {
    const res = await axios.post("/api/academic_year", academic_year);
    return res;
};

// Cập nhật năm học theo mã
export const updateAcademicYear = async (code: number, academic_year: FormData) => {
    const res = await axios.post(`/api/academic_year/${code}`, academic_year);
    return res;
};

// Xoá năm học
export const deleteAcademicYear = async (code: number) => {
    const res = await axios.delete(`/api/academic_year/${code}`);
    return res.data;
};
