"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiLockClosed, HiPencil } from "react-icons/hi";
import toast from "react-hot-toast";
import { AuthService } from "../../data/services/auth_service";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
  profileSchema,
  ProfileFormValues,
} from "../schemas/profile_schema";

export default function ProfilePage() {
  const { data: user, isLoading } = AuthService.useMe();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isValid: isProfileValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    AuthService.useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } =
    AuthService.useChangePassword();

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [resetProfile, user]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => toast.success("Información actualizada correctamente"),
      onError: () => toast.error("No fue posible actualizar la información"),
    });
  };

  const onPasswordSubmit = ({
    currentPassword,
    newPassword,
  }: ChangePasswordFormValues) => {
    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada correctamente");
          resetPassword();
          setIsPasswordModalOpen(false);
        },
        onError: () => toast.error("La contraseña actual no es correcta"),
      },
    );
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi perfil</h1>
        <p className="mt-2 text-gray-600">
          Administra tu información personal y la seguridad de tu cuenta.
        </p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <HiPencil className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Información personal
          </h2>
        </div>
        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="grid gap-5 md:grid-cols-2"
        >
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <TextInput
              id="firstName"
              {...registerProfile("firstName")}
              color={profileErrors.firstName ? "failure" : "gray"}
            />
            {profileErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {profileErrors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <TextInput
              id="lastName"
              {...registerProfile("lastName")}
              color={profileErrors.lastName ? "failure" : "gray"}
            />
            {profileErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {profileErrors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <TextInput id="email" value={user.email} disabled />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Teléfono</Label>
            <TextInput
              id="phoneNumber"
              {...registerProfile("phoneNumber")}
              color={profileErrors.phoneNumber ? "failure" : "gray"}
            />
            {profileErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {profileErrors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={!isProfileValid || isUpdatingProfile}>
              {isUpdatingProfile ? "Guardando..." : "Actualizar información"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Contraseña
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Cambia tu contraseña periódicamente para mantener tu cuenta segura.
            </p>
          </div>
          <Button color="light" onClick={() => setIsPasswordModalOpen(true)}>
            Actualizar contraseña
          </Button>
        </div>
      </Card>

      <Modal
        show={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        size="md"
      >
        <ModalHeader>Actualizar contraseña</ModalHeader>
        <ModalBody>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-5"
          >
            <div>
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <TextInput
                id="currentPassword"
                type="password"
                {...registerPassword("currentPassword")}
                color={passwordErrors.currentPassword ? "failure" : "gray"}
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <TextInput
                id="newPassword"
                type="password"
                icon={() => <HiLockClosed className="mr-2 h-5 w-5" />}
                {...registerPassword("newPassword")}
                color={passwordErrors.newPassword ? "failure" : "gray"}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <TextInput
                id="confirmPassword"
                type="password"
                {...registerPassword("confirmPassword")}
                color={passwordErrors.confirmPassword ? "failure" : "gray"}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                color="light"
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!isPasswordValid || isChangingPassword}>
                {isChangingPassword ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
