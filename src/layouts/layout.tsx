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
  const { userName } = useContext(UserContext)

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between center border-b px-10 pb-4 pt-4 sticky top-0 bg-white z-10">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-10">
            <NavigationMenuItem>
              <Link to="/dailyNote" className={buttonVariants({ variant: "ghost" })}>
                <FaRegCalendarAlt style={{ fill: "#7c3aed" }} />
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/dailyNote" className={buttonVariants({ variant: "ghost" })}>
                <NavigationMenuLink>Note quotidienne</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/calendarView" className={buttonVariants({ variant: "ghost" })}>
                <NavigationMenuLink>Calendrier</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-10">
            {userName !== "" && (
              <NavigationMenuItem>
                <Link to="/profile" className={buttonVariants({ variant: "ghost" })}>
                  <FaUser style={{ fill: "#7c3aed" }} />
                </Link>
              </NavigationMenuItem>
            )}
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
