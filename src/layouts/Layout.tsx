import { Link, Outlet } from "react-router-dom"
import { Button } from "shadcn/components/button"

// Cette page est le layout, <Outlet /> affiche le contenu de la page actuel
export default function Layout() {
  return (
    <main>
      <div className="m-10 flex flex-row space-x-10">
        <aside className="flex w-52 flex-col space-y-4">
          <h1 className="text-xl font-bold">JournAI</h1>
          <ul>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start">
                Vue d'ensemble
              </Button>
            </Link>
          </ul>
        </aside>
        <div className="flex w-full flex-col">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
