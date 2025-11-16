import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import NewModuleForm from "@/modules/module/view/components/new_module_form";

export default function NewModulePage() {
    return (
        <div className="h-full flex flex-col">
            <RouteBreadCrumb />
            <NewModuleForm/>
        </div>
    );
}