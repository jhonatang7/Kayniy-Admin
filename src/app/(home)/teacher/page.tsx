import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import TeacherList from "../../../modules/teacher/view/components/teacher_list";

export default function TeacherPage() {
	return (
		<div className="h-full">
			<RouteBreadCrumb />
			<div className="flex flex-col space-y-4 p-8">
				<TeacherList />
			</div>
		</div>
	);
}
