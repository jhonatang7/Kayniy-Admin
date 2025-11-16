"use client";

import { Breadcrumb, BreadcrumbItem } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { usePathname } from "next/navigation";

interface BreadcrumbSegment {
  label: string;
  href?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface RouteBreadCrumbProps {
  segments?: BreadcrumbSegment[];
  showHome?: boolean;
}

export function RouteBreadCrumb({ segments, showHome = true }: RouteBreadCrumbProps) {
  const pathname = usePathname();

  // Si no se proporcionan segments, generarlos automáticamente desde la URL
  const breadcrumbSegments = segments || generateSegmentsFromPath(pathname);

  return (
    <Breadcrumb
      aria-label="Breadcrumb navigation"
      className="bg-gray-50 px-5 py-3 dark:bg-gray-800"
    >
      {showHome && (
        <BreadcrumbItem href="/dashboard" icon={HiHome}>
          Home
        </BreadcrumbItem>
      )}
      
      {breadcrumbSegments.map((segment, index) => {
        const isLast = index === breadcrumbSegments.length - 1;
        
        return (
          <BreadcrumbItem
            key={index}
            href={!isLast ? segment.href : undefined}
            icon={segment.icon}
          >
            {segment.label}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

// Función auxiliar para generar segments automáticamente desde la ruta
function generateSegmentsFromPath(pathname: string): BreadcrumbSegment[] {
  // Remover el primer slash y dividir por '/'
  const paths = pathname.split('/').filter(Boolean);
  
  // Si estamos en home, no mostrar nada más
  if (paths.length === 0 || (paths.length === 1 && paths[0] === 'home')) {
    return [];
  }

  // Generar segments
  let accumulatedPath = '';
  return paths.map((path, index) => {
    accumulatedPath += `/${path}`;
    
    // Capitalizar y formatear el label
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      label,
      href: accumulatedPath,
    };
  });
}
