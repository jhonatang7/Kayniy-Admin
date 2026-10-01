"use client";

import { canAccessRole } from "@/modules/auth/main/authorization";
import { AuthService } from "@/modules/auth/data/services/auth_service";
import {
  Avatar,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from "flowbite-react";
import { FaCodeBranch, FaDoorClosed, FaUserShield, FaUserTie } from "react-icons/fa";
import { HiChartPie } from "react-icons/hi";
import { TbUsersGroup } from "react-icons/tb";
import { TfiBlackboard } from "react-icons/tfi";

export function SidebarMenu() {
  const { data, isLoading } = AuthService.useMe();
  const { mutate: logout, isPending: isLoggingOut } = AuthService.useLogout();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const canManageTeachers = canAccessRole(data?.role, ["admin"]);
  const canManageAdmins = canAccessRole(data?.role, ["admin"]);
  const canManageCommunities = canAccessRole(data?.role, ["admin"]);
  const canAccessTeacherTools = canAccessRole(data?.role, ["teacher"]);

  return (
    <Sidebar aria-label="Default sidebar example" className="h-full">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex-shrink-0 border-b-[1px] border-gray-200 border-b-black dark:border-gray-700">
          <SidebarLogo href="/dashboard" img="/logo.svg" imgAlt="Kayniy logo">
            Kayniy
          </SidebarLogo>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarItems>
            <SidebarItemGroup>
              <SidebarItem href="/dashboard" icon={HiChartPie}>
                Dashboard
              </SidebarItem>
              {canAccessTeacherTools && (
                <SidebarItem href="/my-modules" icon={FaCodeBranch}>
                  Módulos
                </SidebarItem>
              )}
              {canManageTeachers && (
                <SidebarItem href="/teacher" icon={FaUserTie}>
                  Profesores
                </SidebarItem>
              )}
              {canManageAdmins && (
                <SidebarItem href="/admin" icon={FaUserShield}>
                  Administradores
                </SidebarItem>
              )}
              {canAccessTeacherTools && (
                <>
                  <SidebarItem href="#" icon={TfiBlackboard}>
                    Cursos
                  </SidebarItem>
                  <SidebarItem href="#" icon={TbUsersGroup}>
                    Clases en vivo
                  </SidebarItem>
                </>
              )}
            </SidebarItemGroup>
            {canManageCommunities && (
              <SidebarItemGroup>
                <SidebarItem href="/community" icon={TbUsersGroup}>
                  Comunidad
                </SidebarItem>
              </SidebarItemGroup>
            )}
            <SidebarItemGroup>
              <SidebarItem
                href="#"
                icon={FaDoorClosed}
                className={isLoggingOut ? "cursor-wait opacity-60" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  if (!isLoggingOut) logout();
                }}
              >
                {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </div>

        <section className="flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
          <Avatar
            img={
              data?.avatarPath ||
              "https://gravatar.com/avatar/ceabff2ada75d972655b2306051fd98d1eddbefc63ba83e013348dd74f8cd?f=y&d=retro"
            }
            alt={`Avatar de ${data?.firstName ?? "usuario"}`}
            size="md"
          >
            <div className="space-y-1 font-medium dark:text-white">
              <div>{data?.firstName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {data?.lastName}
              </div>
            </div>
          </Avatar>
        </section>
      </div>
    </Sidebar>
  );
}
