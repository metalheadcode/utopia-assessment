import * as React from "react"
import {
  AirVent,
  LifeBuoy,
  Send,
  LucideIcon,
  ToolCase,
  ShieldUser,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/context/auth-context"
import { useMemo } from "react"


export interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  navSecondary: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

const data: SidebarData = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  navMain: [
    {
      title: "Admin",
      url: "#",
      icon: ShieldUser,
      isActive: true,
      items: [
        {
          title: "Submit Order",
          url: "/dashboard/submit-order",
        },
        {
          title: "Worker List",
          url: "/dashboard/worker-list",
        },
        {
          title: "Role Management",
          url: "/dashboard/role-management",
        },
      ],
    },
    {
      title: "Workers",
      url: "#",
      icon: ToolCase,
      isActive: true,
      items: [
        {
          title: "Jobs",
          url: "/dashboard/jobs",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userRole } = useAuth()

  const roleLabel = useMemo(() => {
    if (userRole === null) {
      return []
    }
    if (userRole === "admin") {
      return data.navMain
    }
    if (userRole === "worker") {
      return data.navMain.filter(item => item.title === "Workers")
    }
  }, [userRole])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <AirVent className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">SejookNamastey</span>
                  <span className="truncate text-xs">Sejuk Sejuk Service Sdn Bhd</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={roleLabel || []} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
