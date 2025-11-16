"use client";
import { Button, Card } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FaArrowRightFromBracket, FaArrowRightLong } from "react-icons/fa6";

interface CardModuleProps {
  moduleId: string;
  name: string;
  countLessons: number;
}

export function CardModule({ moduleId, name, countLessons }: CardModuleProps) {
  const router = useRouter();
  return (
    <Card className="max-w-sm min-w-[300px] flex-shrink-0">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {name}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Lecciones: {countLessons}
      </p>
      <Button onClick={() => router.push(`/my-modules/${moduleId}`)} className="space-x-2" >
        <p>Administrar</p>
        <FaArrowRightLong />
      </Button>
    </Card>
  );
}
