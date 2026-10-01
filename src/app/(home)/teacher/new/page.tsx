import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import TeacherForm from "@/modules/teacher/view/components/teacher_form";

export default function NewTeacherPage() {
  return (
    <div className="min-h-full p-4 md:p-8">
      <RouteBreadCrumb />
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Nuevo profesor
        </h1>
        <TeacherForm />
      </div>
    </div>
  );
}
