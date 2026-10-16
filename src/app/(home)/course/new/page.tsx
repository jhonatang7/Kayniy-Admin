"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, Label, Select, Spinner, TextInput, Textarea } from "flowbite-react";
import {
	HiArrowLeft,
	HiArrowRight,
	HiChevronDown,
	HiChevronUp,
	HiCheckCircle,
	HiOutlineBookOpen,
	HiOutlineSearch,
	HiTrash,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { AuthService } from "@/modules/auth/data/services/auth_service";
import { ModuleService } from "@/modules/module/data/services/module_service";
import { CourseService } from "@/modules/course/data/services/course_service";
import {
	CourseLevel,
	CreateCourseModuleRequest,
} from "@/modules/course/main/types/course.types";

const levelOptions: { value: CourseLevel; label: string }[] = [
	{ value: "Basic", label: "Básico" },
	{ value: "Medium", label: "Medio" },
	{ value: "Hard", label: "Difícil" },
];

export default function NewCoursePage() {
	const router = useRouter();
	const { data: user, isLoading: isLoadingUser } = AuthService.useMe();
	const community = user?.community;
	const { data: modules = [], isLoading: isLoadingModules } =
		ModuleService.useModulesByCommunityId(community?.id ?? null);
	const { mutate: createCourse, isPending: isCreating } = CourseService.useCreateCourse();

	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [level, setLevel] = useState<CourseLevel | "">("");
	const [moduleSearch, setModuleSearch] = useState("");
	const [selectedModules, setSelectedModules] = useState<CreateCourseModuleRequest[]>([]);

	const communityModules = useMemo(() => modules, [modules]);
	const availableModules = communityModules.filter(
		(module) =>
			!selectedModules.some((selected) => selected.moduleId === module.id) &&
			`${module.title} ${module.description}`.toLowerCase().includes(moduleSearch.toLowerCase()),
	);
	const selectedModuleDetails = selectedModules
		.map((selected) => ({
			...selected,
			module: communityModules.find((module) => module.id === selected.moduleId),
		}))
		.filter((selected) => selected.module);

	const canContinueFromStepOne =
		name.trim().length > 0 && description.trim().length > 0 && !!level && !!community;

	const addModule = (moduleId: string) => {
		setSelectedModules((current) => [
			...current,
			{ moduleId, order: current.length + 1 },
		]);
	};

	const removeModule = (moduleId: string) => {
		setSelectedModules((current) =>
			current
				.filter((module) => module.moduleId !== moduleId)
				.map((module, index) => ({ ...module, order: index + 1 })),
		);
	};

	const moveModule = (index: number, direction: -1 | 1) => {
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= selectedModules.length) return;

		setSelectedModules((current) => {
			const reordered = [...current];
			[reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
			return reordered.map((module, moduleIndex) => ({ ...module, order: moduleIndex + 1 }));
		});
	};

	const handleSubmit = () => {
		if (!user || !community || !level) return;

		createCourse(
			{
				name: name.trim(),
				description: description.trim(),
				level,
				userId: user.id,
				communityId: community.id,
				modules: selectedModules,
			},
			{
				onSuccess: () => {
					toast.success("Curso creado correctamente");
					router.push("/course");
				},
				onError: () => toast.error("No fue posible crear el curso"),
			},
		);
	};

	if (isLoadingUser) {
		return <div className="flex justify-center p-12"><Spinner size="xl" /></div>;
	}

	return (
		<main className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
			<header>
				<p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Aprendizaje</p>
				<h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Crear nuevo curso</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-300">Completa las tres etapas para publicar el curso en tu comunidad.</p>
			</header>

			<nav className="grid gap-2 sm:grid-cols-3" aria-label="Etapas de creación">
				{["Información básica", "Módulos", "Resumen"].map((label, index) => {
					const itemStep = (index + 1) as 1 | 2 | 3;
					return (
						<div key={label} className={`border-b-2 p-3 text-sm font-semibold ${step === itemStep ? "border-blue-600 text-blue-600" : "border-gray-200 text-gray-500 dark:border-gray-700"}`}>
							Etapa {itemStep}: {label}
						</div>
					);
				})}
			</nav>

			{step === 1 && (
				<Card className="space-y-5">
					<div>
						<Label htmlFor="course-name">Nombre del curso</Label>
						<TextInput id="course-name" className="mt-2" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Inglés conversacional" />
					</div>
					<div>
						<Label htmlFor="course-description">Descripción</Label>
						<Textarea id="course-description" className="mt-2" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe qué aprenderán los estudiantes" />
					</div>
					<div>
						<Label htmlFor="course-level">Nivel</Label>
						<Select id="course-level" className="mt-2 w-fit min-w-[130px]" value={level} onChange={(event) => setLevel(event.target.value as CourseLevel | "")}>
							<option value="">Selecciona un nivel</option>
							{levelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
						</Select>
					</div>
					<div className={`rounded-lg border p-4 ${community ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
						{community ? (
							<p className="flex items-center gap-2 text-sm text-green-800"><HiCheckCircle className="h-5 w-5" /> Comunidad: <strong>{community.name}</strong></p>
						) : (
							<p className="text-sm text-red-700">No perteneces a ninguna comunidad. Debes ser añadido a una comunidad antes de crear un curso.</p>
						)}
					</div>
					<div className="flex justify-end">
						<Button disabled={!canContinueFromStepOne} onClick={() => setStep(2)}>Continuar <HiArrowRight className="ml-2 h-5 w-5" /></Button>
					</div>
				</Card>
			)}

			{step === 2 && (
				<Card className="space-y-6">
					<div>
						<Label htmlFor="module-search">Buscar módulos de tu comunidad</Label>
						<TextInput id="module-search" className="mt-2" icon={HiOutlineSearch} value={moduleSearch} onChange={(event) => setModuleSearch(event.target.value)} placeholder="Busca por título o descripción" />
					</div>
					<p className="text-xs font-semibold uppercase tracking-wider text-blue-600">TIP: Notarás que el contenido se ordenará de manera ascendente. Puedes cambiar el orden usando los botones.</p>
					<div className="grid gap-6 lg:grid-cols-2">
						<section>
							<h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Módulos disponibles</h2>
							<div className="space-y-3">
								{isLoadingModules ? <Spinner /> : availableModules.map((module) => (
									<button key={module.id} type="button" onClick={() => addModule(module.id)} className="block w-full rounded-lg border border-gray-200 p-4 text-left hover:border-blue-500 dark:border-gray-700">
										<h3 className="font-semibold text-gray-900 dark:text-white">{module.title}</h3>
										<p className="mt-1 line-clamp-2 text-sm text-gray-500">{module.description}</p>
									</button>
								))}
								{!isLoadingModules && availableModules.length === 0 && <p className="text-sm text-gray-500">No hay módulos disponibles para agregar.</p>}
							</div>
						</section>
						<section>
							<h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{name || "Tu curso"}</h2>
							<div className="space-y-3">
								{selectedModuleDetails.map((selected, index) => (
									<article key={selected.moduleId} className="flex min-h-[112px] items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-gray-800">
										<span className="text-xl font-bold text-blue-600">{selected.order}</span>
										<div className="min-w-0 flex-1">
											<h3 className="truncate font-semibold text-gray-900 dark:text-white">{selected.module?.title}</h3>
											<p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{selected.module?.description}</p>
										</div>
										<div className="flex flex-col gap-1">
											<Button size="xs" color="light" aria-label="Subir módulo" disabled={index === 0} onClick={() => moveModule(index, -1)}><HiChevronUp /></Button>
											<Button size="xs" color="light" aria-label="Bajar módulo" disabled={index === selectedModuleDetails.length - 1} onClick={() => moveModule(index, 1)}><HiChevronDown /></Button>
											<Button size="xs" color="failure" aria-label="Eliminar módulo" onClick={() => removeModule(selected.moduleId)}><HiTrash /></Button>
										</div>
									</article>
								))}
								{selectedModuleDetails.length === 0 && <p className="text-sm text-gray-500">Selecciona módulos para agregarlos al curso.</p>}
							</div>
						</section>
					</div>
					<div className="flex justify-between">
						<Button color="light" onClick={() => setStep(1)}><HiArrowLeft className="mr-2 h-5 w-5" />Atrás</Button>
						<Button disabled={selectedModules.length === 0} onClick={() => setStep(3)}>Continuar <HiArrowRight className="ml-2 h-5 w-5" /></Button>
					</div>
				</Card>
			)}

			{step === 3 && (
				<Card className="space-y-6">
					<div className="flex items-center gap-3"><HiOutlineBookOpen className="h-8 w-8 text-blue-600" /><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resumen del curso</h2></div>
					<dl className="grid gap-4 sm:grid-cols-2">
						<div><dt className="text-sm text-gray-500">Nombre</dt><dd className="font-semibold">{name}</dd></div>
						<div><dt className="text-sm text-gray-500">Nivel</dt><dd><Badge color="indigo" className="w-fit">{levelOptions.find((option) => option.value === level)?.label}</Badge></dd></div>
						<div><dt className="text-sm text-gray-500">Usuario creador</dt><dd className="font-semibold">{user?.firstName} {user?.lastName}</dd></div>
						<div><dt className="text-sm text-gray-500">Comunidad destino</dt><dd className="font-semibold">{community?.name}</dd></div>
					</dl>
					<div><p className="text-sm text-gray-500">Descripción</p><p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{description}</p></div>
					<div><p className="mb-2 text-sm text-gray-500">Módulos ({selectedModuleDetails.length})</p><ol className="space-y-2">{selectedModuleDetails.map((selected) => <li key={selected.moduleId} className="rounded border border-gray-200 p-3 dark:border-gray-700"><span className="mr-2 font-bold text-blue-600">{selected.order}.</span>{selected.module?.title}</li>)}</ol></div>
					<div className="flex justify-between"><Button color="light" onClick={() => setStep(2)}><HiArrowLeft className="mr-2 h-5 w-5" />Atrás</Button><Button onClick={handleSubmit} disabled={isCreating}>{isCreating ? <Spinner size="sm" /> : "Crear curso"}</Button></div>
				</Card>
			)}
		</main>
	);
}
