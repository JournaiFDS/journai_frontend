import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "shadcn/components/navigation-menu"
import { buttonVariants } from "shadcn/components/button"
import { FaRegCalendarAlt, FaUser } from "react-icons/fa"
import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { Toaster } from "shadcn/components/sonner"
import { UserContext } from "../component/userContext.tsx"
import { useContext } from "react"


export default function Layout() {
  const { userId  } = useContext(UserContext);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-start center border-b pl-10 pb-4 pt-4 sticky top-0 bg-white z-10">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-10">
            <NavigationMenuItem>
              <Link to="/dailyNote" className={buttonVariants({ variant: "ghost" })}>
                <FaRegCalendarAlt />
              </Link>
            </NavigationMenuItem>
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
            <NavigationMenuList className="flex space-x-10 justify-end">
              {userId !== "" && (
                <NavigationMenuItem>
                  <Link to="/profile" className={buttonVariants({ variant: "ghost" })}>
                    <FaUser />
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex flex-col flex-grow">
        <Toaster />
        <Outlet />
      </div>
    </div>
  )
}
