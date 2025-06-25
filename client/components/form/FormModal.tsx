"use client";

import { AdminForm } from "./AdminForm";
import { AdminData } from "@/types/AdminType";
import { TeacherForm } from "./TeacherForm";
import { TeacherData } from "@/types/TeacherType";
import { AcademicYearData } from "@/types/AcademicYearType";
import { AcademicYearForm } from "./AcademicYearForm";
import { SemesterData } from "@/types/SemesterType";
import { SemesterForm } from "./SemesterForm";
import { FacultyData } from "@/types/FacultyType";
import { FacultyForm } from "./FacultyForm";
import { RoomData } from "@/types/RoomType";
import { RoomForm } from "./RoomForm";
import { ClassedData } from "@/types/ClassedType";
import { ClassedForm } from "./ClassForm";
import { SubjectForm } from "./SubjectForm";
import { SubjectData } from "@/types/SubjectType";
import { ScrollArea } from "../ui/scroll-area";
import SemesterSubjectForm from "./SemesterSubjectsForm";

export type ModalType = "create" | "update";

interface FormModalProps {
  table: string;
  type: ModalType;
  data?: unknown;
  onClose?: () => void;
  onSubmitSuccess?: (item: any) => void;
}

const FormModal = ({
  table,
  type,
  data,
  onClose,
  onSubmitSuccess,
}: FormModalProps) => {

  const renderForm = () => {
    switch (table) {
      case "admin":
        return (
          <AdminForm
            type={type}
            data={data as AdminData}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );

      case "teacher":
        return (
          <TeacherForm
            type={type}
            data={data as TeacherData}
            onSubmitSuccess={(teacher) => { onSubmitSuccess?.(teacher); onClose?.() }}
          />
        );

      case "academic_year":
        return (
          <AcademicYearForm
            type={type}
            data={data as AcademicYearData}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );

      case "semester":
        return (
          <SemesterForm
            type={type}
            data={data as SemesterData}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );

      case "room":
        return (
          <RoomForm
            type={type}
            data={data as RoomData}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );


      case "faculty":
        return (
          <FacultyForm
            type={type}
            data={data as FacultyData}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );

      case "classed":
        return (
          <ClassedForm
            type={type}
            data={data as ClassedData}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );

      case "subject":
        return (
          <SubjectForm
            type={type}
            data={data as SubjectData}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );

      default:
        return <div>Form không tồn tại!</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 top-[60px] md:top-0 flex items-center justify-center z-30">
      <ScrollArea className="bg-white rounded-lg w-full max-w-4xl ">
        <div className="p-6 relative max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-200px)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl cursor-pointer hover:text-gray-900 hover:rotate-90 duration-150 ease-in-out"
          >
            &times;
          </button>
          {renderForm()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FormModal;
