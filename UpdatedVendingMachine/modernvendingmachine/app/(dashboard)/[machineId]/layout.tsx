import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {redirect} from "next/navigation";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({ children, params }:
    { children: React.ReactNode; 
      params:{machineId: string
    }}) {

const {userId} = auth();
 if (!userId){
    redirect("/sign-in");
 }

 const machine = await prismadb.machine.findFirst({
     where: {
         userId,
         id: params.machineId
     },
 });

 if (!machine){
     redirect("/");
 }

 return (
    <>
        <Navbar />
        {children}
    </>
 )
}