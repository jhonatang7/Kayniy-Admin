import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import ModuleList from "@/modules/module/view/components/module_list";
import { Breadcrumb, BreadcrumbItem, Label, TextInput } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
export default function MyModulesPage() {
  return (
    <div className="h-full">
      <RouteBreadCrumb />
      <ModuleList />
    </div>
  );
}
