import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import VendingMachineSwitcher from "@/components/vending-machine-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
const Navbar = async () => {
    const {userId} = auth();
    if(!userId) {
        redirect("/sign-in");
    }

    const machine = await prismadb.machine.findMany({
        where: {
            userId,
        },
    });
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <VendingMachineSwitcher items={machine} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    )
}

export default Navbar;