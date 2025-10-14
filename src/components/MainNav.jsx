import { Calendar, Search, Menu } from "lucide-react";

function MainNav() {
  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 flex flex-col items-center justify-center px-0 sm:px-10">
        <div className=" ring-border z-51 h-20 w-full max-w-7xl px-6 ring-1 ring-offset-0 backdrop-blur-[6px]">
          <div className="flex h-full justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-7 w-7 text-indigo-600"/>
              <h1 className="text-2xl text-indigo-600">CareSync</h1>
            </div>
            <div className="flex">
              <div className="flex h-full items-center space-x-4 pl-6">
                <Search className="h-7 w-7" />
                <Menu className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default MainNav;
