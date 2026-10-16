"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { useForm } from "react-hook-form";
import { FaCalendarAlt, FaClock, FaLink, FaSave, FaVideo } from "react-icons/fa";
import toast from "react-hot-toast";
import { LiveClassService } from "../../data/services/live_class_service";
import { LiveClass } from "../../main/types/live_class.types";
import { liveClassSchema, LiveClassFormValues } from "../schemas/live_class_schema";

interface LiveClassFormProps {
  communityId: string;
  professorId: string;
  liveClass?: LiveClass;
  onSuccess: () => void;
  onCancel: () => void;
}

const toDateTimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toIsoDate = (value: string) => new Date(value).toISOString();

const calculateExpiresAt = (startedDate: string, duration: number) => {
  const expiresAt = new Date(startedDate);
  expiresAt.setMinutes(expiresAt.getMinutes() + duration);
  return expiresAt.toISOString();
};

export default function LiveClassForm({
  communityId,
  professorId,
  liveClass,
  onSuccess,
  onCancel,
}: LiveClassFormProps) {
  const isEditing = Boolean(liveClass);
  const { mutate: createLiveClass, isPending: isCreating } = LiveClassService.useCreateLiveClass();
  const { mutate: updateLiveClass, isPending: isUpdating } = LiveClassService.useUpdateLiveClass();
  const isPending = isCreating || isUpdating;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LiveClassFormValues>({
    resolver: zodResolver(liveClassSchema),
    mode: "onChange",
    defaultValues: {
      title: liveClass?.title ?? "",
      description: liveClass?.description ?? "",
      startedDate: toDateTimeLocal(liveClass?.startedDate),
      transmitionLink: liveClass?.transmitionLink ?? "",
      duration: liveClass?.duration ?? 60,
    },
  });

  const onSubmit = (data: LiveClassFormValues) => {
    const payload = {
      ...data,
      startedDate: toIsoDate(data.startedDate),
      duration: Number(data.duration),
      expiresAt: calculateExpiresAt(data.startedDate, Number(data.duration)),
    };

    if (liveClass) {
      updateLiveClass(
        { id: liveClass.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Clase en vivo actualizada correctamente");
            onSuccess();
          },
          onError: () => toast.error("No fue posible actualizar la clase en vivo"),
        },
      );
      return;
    }

    createLiveClass(
      { ...payload, communityId, professorId },
      {
        onSuccess: () => {
          toast.success("Clase en vivo creada correctamente");
          onSuccess();
        },
        onError: () => toast.error("No fue posible crear la clase en vivo"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="live-title" className="mb-2 block">Título</Label>
        <TextInput id="live-title" icon={FaVideo} placeholder="Ej. Repaso de estructuras de datos" color={errors.title ? "failure" : "gray"} {...register("title")} />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="live-description" className="mb-2 block">Descripción</Label>
        <Textarea id="live-description" rows={4} placeholder="Describe el tema de la clase en vivo" color={errors.description ? "failure" : "gray"} {...register("description")} />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="live-started-date" className="mb-2 block">Fecha de inicio</Label>
          <TextInput id="live-started-date" type="datetime-local" icon={FaCalendarAlt} color={errors.startedDate ? "failure" : "gray"} {...register("startedDate")} />
          {errors.startedDate && <p className="mt-1 text-sm text-red-600">{errors.startedDate.message}</p>}
        </div>
        <div>
          <Label htmlFor="live-duration" className="mb-2 block">Duración (minutos)</Label>
          <TextInput id="live-duration" type="number" min="1" icon={FaClock} color={errors.duration ? "failure" : "gray"} {...register("duration", { valueAsNumber: true })} />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="live-link" className="mb-2 block">Enlace de transmisión</Label>
        <TextInput id="live-link" type="url" icon={FaLink} placeholder="https://..." color={errors.transmitionLink ? "failure" : "gray"} {...register("transmitionLink")} />
        {errors.transmitionLink && <p className="mt-1 text-sm text-red-600">{errors.transmitionLink.message}</p>}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 dark:border-gray-700 sm:flex-row sm:justify-end">
        <Button type="button" color="light" onClick={onCancel} disabled={isPending}>Cancelar</Button>
        <Button type="submit" disabled={!isValid || isPending}>
          <FaSave className="mr-2" />
          {isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear clase en vivo"}
        </Button>
      </div>
    </form>
  );
}
