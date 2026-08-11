import { Button, Card } from "flowbite-react";
import { FaEdit } from "react-icons/fa";

export default function CardAddMember() {
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
          <Button>
            <FaEdit />
          </Button>
          <Button>Invitar miembros</Button>
        </div>
      </div>
    </Card>
  );
}
