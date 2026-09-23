"use client";
import { Button, Card } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";

export default function CardAddMember() {
  const router = useRouter();
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h4 className="text-2xl font-semibold ">
            ¡Agrega miembros a tus comunidades!
          </h4>
          <p>
            Añade a estudiantes y docentes a tus comunidades para que puedan
            acceder a los módulos y recursos compartidos.
          </p>
        </div>
        <div className="flex space-x-2 items-end">
          <Button onClick={() => router.push("/community/members")}>
            <FaEdit />
          </Button>
          <Button onClick={() => router.push("/community/invite-members")}>
            Invitar miembros
          </Button>
        </div>
      </div>
    </Card>
  );
}
