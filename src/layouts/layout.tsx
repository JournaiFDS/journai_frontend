import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "shadcn/components/navigation-menu";
import { buttonVariants } from "shadcn/components/button";
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster } from "shadcn/components/sonner";

export default function Layout() {
  return (
      <div className="h-screen flex flex-col">
        <div className="flex justify-start center border-b pl-10 pb-4 pt-4 sticky top-0 bg-white z-10">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-10">
              <FaRegCalendarAlt />
              <NavigationMenuItem>
                <Link to="/dailyNote" className={buttonVariants({ variant: "ghost" })}>
                  <NavigationMenuLink>DailyNote</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/calendarReview" className={buttonVariants({ variant: "ghost" })}>
                  <NavigationMenuLink>Calendar</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-col flex-grow">
          <Toaster />
          <Outlet />
        </div>
      </div>
  );
}
