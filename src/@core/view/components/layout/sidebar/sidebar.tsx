"use client";

import { AuthService } from "@/modules/auth/data/services/auth_service";
import {
  Avatar,
  Sidebar,
  SidebarCTA,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from "flowbite-react";
import Link from "next/link";
import { FaCodeBranch, FaDoorClosed, FaRoute } from "react-icons/fa";
import {
  HiArrowSmRight,
  HiChartPie,
  HiCode,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { HiCodeBracket } from "react-icons/hi2";
import { TbUsersGroup } from "react-icons/tb";
import { TfiBlackboard } from "react-icons/tfi";

export function SidebarMenu() {
  const { data, isLoading } = AuthService.useMe();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("User data in sidebar> ", data);
  return (
    <Sidebar aria-label="Default sidebar example" className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 border-b-black border-b-[1] border-gray-200 dark:border-gray-700 mb-2">
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
              <SidebarItem href="/my-modules" icon={FaCodeBranch}>
                Módulos
              </SidebarItem>
              <SidebarItem href="#" icon={TfiBlackboard}>
                Cursos
              </SidebarItem>
              <SidebarItem href="#" icon={TbUsersGroup}>
                Clases en vivo
              </SidebarItem>
            </SidebarItemGroup>
            <SidebarItemGroup>
              <SidebarItem href="#" icon={FaDoorClosed}>
                Logout
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </div>

        <section className="flex-shrink-0 border-t flex-col border-gray-200 dark:border-gray-700 p-4">
          <Avatar
            img="https://gravatar.com/avatar/ceabff2ada75d972655b2306051fd98d1eddbefc63ba83e013348dd74a76f8cd?f=y&d=retro"
            alt="avatar of Jese"
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
