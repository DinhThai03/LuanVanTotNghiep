"use client";

import { AdminForm } from "./AdminForm";
import { AdminData } from "@/types/AdminType";

export type ModalType = "create" | "update";
type TableType = "admin" | "ads";

interface FormModalProps {
  table: TableType;
  type: ModalType;
  data?: AdminData;
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
            data={data}
            onSubmitSuccess={(admin) => { onSubmitSuccess?.(admin); onClose?.() }}
          />
        );
      default:
        return <div>Form không tồn tại!</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative max-h-screen md:max-h-[calc(100vh-100px)] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl cursor-pointer hover:text-gray-900 hover:rotate-90 duration-150 ease-in-out"
        >
          &times;
        </button>
        {renderForm()}
      </div>
    </div>
  );
};

export default FormModal;
