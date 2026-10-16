"use client";

import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import Loading from "@/@core/view/components/Loading";
import { AuthService } from "@/modules/auth/data/services/auth_service";
import { getRoleName } from "@/modules/auth/main/authorization";
import LiveClassList from "@/modules/live-class/view/components/live_class_list";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LiveClassPage() {
	const router = useRouter();
	const { data: user, isLoading, isError } = AuthService.useMe();
	const isTeacher = getRoleName(user?.role) === "teacher";

	useEffect(() => {
		if (!isLoading && (isError || !isTeacher)) {
			router.replace("/dashboard");
		}
	}, [isError, isLoading, isTeacher, router]);

	if (isLoading || isError || !user || !isTeacher) {
		return <Loading />;
	}

	if (!user.community) {
		return (
			<div className="h-full">
				<RouteBreadCrumb />
				<p className="p-8 text-red-600">No perteneces a ninguna comunidad.</p>
			</div>
		);
	}

	return (
		<div className="h-full">
			<RouteBreadCrumb />
			<LiveClassList communityId={user.community.id} professorId={user.id} />
		</div>
	);
}
