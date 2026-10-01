import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import TeacherEdit from "@/modules/teacher/view/components/teacher_edit";

export default async function EditTeacherPage({ params }: { params: Promise<{ teacherId: string }> }) {
  const { teacherId } = await params;
  return <div className="min-h-full p-4 md:p-8"><RouteBreadCrumb /><TeacherEdit teacherId={teacherId} /></div>;
}