import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import CourseList from "@/modules/course/view/components/course_list";

export default function CoursePage() {
	return (
		<div className="h-full">
			<RouteBreadCrumb />
			<CourseList />
		</div>
	);
}
