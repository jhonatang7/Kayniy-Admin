import { Module } from "@/modules/module/main/types/module.types";
import { LessonService } from "../../data/services/lesson_service";
import Loading from "@/@core/view/components/Loading";
import { Badge, List, ListItem } from "flowbite-react";
import { HiCheckCircle, HiVideoCamera } from "react-icons/hi";
import { GrDocumentPdf } from "react-icons/gr";
import { LessonType } from "../../main/lesson.types";
import { useRouter } from "next/navigation";

interface LessonListProps {
  moduleId: string;
}

export default function LessonList({ moduleId }: LessonListProps) {
  const router = useRouter();
  const { data: lessons, isLoading } =
    LessonService.useLessonsByModuleId(moduleId);

  if (isLoading) {
    return <Loading />;
  }

  const handleLessonClick = (lessonId: string) => {
    router.push(`/my-modules/${moduleId}/${lessonId}`);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center lg:text-left">
        Lecciones
      </h2>
      <div className="space-y-4">
        {lessons && lessons.length > 0 ? (
          <List className="divide-y divide-gray-200 dark:divide-gray-700">
            {lessons.map((lesson, index) => (
              <ListItem
                key={lesson.id}
                icon={
                  lesson.type === LessonType.VIDEO
                    ? HiVideoCamera
                    : GrDocumentPdf
                }
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                onClick={() => handleLessonClick(lesson.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{lesson.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {lesson.description}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                      Duración: {lesson.duration} min
                    </p>
                  </div>
                  <Badge color="purple" size="sm" className="rounded-2xl ml-4">
                    {index + 1}
                  </Badge>
                </div>
              </ListItem>
            ))}
          </List>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Este módulo aún no tiene lecciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
