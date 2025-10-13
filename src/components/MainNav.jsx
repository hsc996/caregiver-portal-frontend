
function MainNav() {
    return (
        <>
            <nav className="fixed left-0 right-0 top-0 z-50 flex flex-col items-center justify-center px-0 sm:px-10">
                <div className="z-51 h-20 w-full max-w-7xl bg-background/85 px-6 ring-1 ring-border ring-offset-0 backdrop-blur-[6px]">
                    <div className="flex h-full justify-between">
                        <div className="flex gap-3">
                            <p>logo</p>
                            <p>Hannah Scaife</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex h-full items-center space-x-3 pl-6">
                                <p>search</p>
                                <p>toggle</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default MainNav;