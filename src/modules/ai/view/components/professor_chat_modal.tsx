"use client";

import { FormEvent, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { AiService } from "../../data/services/ai_service";

interface ProfessorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ProfessorChatModal({
  isOpen,
  onClose,
  communityId,
}: ProfessorChatModalProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chat = AiService.useChat();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !communityId || chat.isPending) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmedQuestion },
    ]);
    setQuestion("");
    chat.mutate(
      { communityId, message: trimmedQuestion },
      {
        onSuccess: (response) => {
          setMessages((current) => [
            ...current,
            { role: "assistant", content: response.answer },
          ]);
        },
      },
    );
  };

  const handleClose = () => {
    if (chat.isPending) return;
    onClose();
  };

  return (
    <Modal show={isOpen} size="7xl" onClose={handleClose} className="!text-white">
      <ModalHeader className="!border-gray-700 !bg-gray-900 !text-white">
        Asistente de IA
      </ModalHeader>
      <ModalBody className="!bg-gray-900 !text-white">
        <div className="flex min-h-[65vh] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 p-4">
            {!messages.length && (
              <p className="py-16 text-center text-sm text-gray-300">
                Escribe una pregunta para consultar las métricas de tu comunidad.
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto border border-gray-600 bg-gray-700 text-gray-100 shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {chat.isPending && (
              <div className="mr-auto flex items-center gap-2 rounded-2xl border border-gray-600 bg-gray-700 px-4 py-3 text-sm text-gray-200 shadow-sm">
                <Spinner size="sm" />
                Consultando...
              </div>
            )}
            {chat.isError && (
              <p className="rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-200">
                No se pudo obtener una respuesta. Intenta nuevamente.
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={chat.isPending}
              className="min-w-0 flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-gray-700"
            />
            <Button
              type="submit"
              disabled={!question.trim() || !communityId || chat.isPending}
            >
              {chat.isPending && <Spinner size="sm" className="mr-2" />}
              Enviar
            </Button>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
}
