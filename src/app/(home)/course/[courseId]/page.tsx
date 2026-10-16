import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import EditCourseForm from "@/modules/course/view/components/edit_course_form";
import { use } from "react";

export default function CoursePage({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const resolvedParams = use(params);

	return (
		<div className="flex h-full flex-col">
			<RouteBreadCrumb />
			<div className="flex flex-1 flex-col items-center p-4 md:p-8">
				<h1 className="w-full text-left text-2xl font-bold md:text-3xl">Editar curso</h1>
				<EditCourseForm courseId={resolvedParams.courseId} />
			</div>
		</div>
	);
}
