"use client";

import { Bell, BellOff, X } from "lucide-react";
import { memo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Component for no notifications
const NoNotification = memo(() => (
  <div className="flex items-center flex-col justify-center gap-5 w-full py-6">
    <BellOff className="w-[100px] h-[100px] text-primary " />
    <h2 className="font-bold text-sm capitalize text-slate-800">No notification yet</h2>
    <p className="text-[11px] text-center font-medium text-muted-foreground">
      You have no notifications right now, <br /> come back later.
    </p>
  </div>
));
NoNotification.displayName = "NoNotification";

export default function Notification() {
  

  // useEffect(() => {
  //   if (user?.uid) {
  //     fetchUserLogs(user.uid);
  //   }
  // }, [user?.uid, fetchUserLogs]);



  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Bell className="w-5 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] flex flex-col p-0 mr-5" sideOffset={15}>
        <div className="p-4 flex flex-col w-full">
          {/* {notifications.length === 0 ? (
            <NoNotification />
          ) : (
            <div className="space-y-3">
              {{}.map((notification: NotificationType) => (
                <div key={notification.id} className="flex items-center justify-between border hover:bg-muted duration-300 p-3 rounded-md">

                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium">{notification.message}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <button onClick={() => removeNotification(notification.id)} className="text-muted-foreground hover:text-primary">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )} */}
        </div>

        <div className="w-full flex items-center justify-center border-t p-4 bg-muted rounded-b-md">
          <p className="text-[10px] cursor-default text-muted-foreground">RentCreeb &copy; 2024 All Rights Reserved.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
