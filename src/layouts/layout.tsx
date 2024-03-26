import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "shadcn/components/navigation-menu"
import { buttonVariants } from "shadcn/components/button"
import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"

export default function Layout() {
  return (
    <main className="flex flex-col h-screen">
      <div className="flex justify-center center border-b pb-4 pt-4">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-20">
            <NavigationMenuItem>
              <Link to="/dailyNote" className={buttonVariants()}>
                <NavigationMenuLink>DailyNote</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/calendarReview" className={buttonVariants()}>
                <NavigationMenuLink>Calendar</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex w-full flex-col flex-grow">
        <Outlet />
      </div>
    </main>
  )
}
