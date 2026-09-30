import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { listNotifications } from "@/services/alertService";

interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

export function NotificationDropdown({ extra = 0 }: { extra?: number }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    listNotifications()
      .then((data) => setNotifications(data || []))
      .catch(() => setNotifications([]));
  }, []);

  const count = notifications.length + extra;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4.5" />
          {count > 0 ? (
            <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-risk-high text-[9px] font-semibold text-white">
              {count}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">{count} recent items</p>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {extra > 0 ? (
            <li className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium text-risk-high">New high-risk welfare alert</p>
              <p className="text-xs text-muted-foreground">P-1024 · risk 42 → 82</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Just now</p>
            </li>
          ) : null}
          {notifications.map((n) => {
            const isIsoOrDate = n.time && (n.time.includes("-") || n.time.includes("T"));
            const displayTime = isIsoOrDate
              ? new Date(n.time).toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                }) + " IST"
              : n.time.includes("IST")
                ? n.time
                : `${n.time} IST`;

            return (
              <li key={n.id} className="border-b border-border px-4 py-3 last:border-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.detail}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{displayTime}</p>
              </li>
            );
          })}

          {count === 0 ? (
            <li className="px-4 py-6 text-center text-xs text-muted-foreground">
              No new notifications
            </li>
          ) : null}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
