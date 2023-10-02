"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "./ui/button";



export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    // this will be directed to settings page
    const routes = [
        {
            href: `/${params.storeId}`,
            label: `Overview`,
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/settings`,
            label: `Settings`,
            active: pathname === `/${params.storeId}/settings`,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: `Billboards`,
            active: pathname === `/${params.storeId}/billboards`,
        }
    ]
    return(
        <nav 
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
        {routes.map((route) =>(
            <Link 
                key={route.href}
                href={route.href}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-black dark:text-white" : "text-muted-foreground"
                )}
            >
                <Button variant="link" className="p-1.5 pb-0 pt-0">
                    {route.label}
                </Button>
                
            </Link>
        ))}
        </nav>
    )
};