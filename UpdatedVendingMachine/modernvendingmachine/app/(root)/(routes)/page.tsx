"use client"
import { useEffect } from "react";
import { VendingMachineModal } from "@/hooks/VendingMachineModal";
import { UserButton } from "@clerk/nextjs";
export default function Home() {

  //Right now authentication is working. Had to comment out the Creating Vending Machine Modal for authentication to work but will fix later

  const onOpen = VendingMachineModal((state) => state.onOpen);
  const isOpen = VendingMachineModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  return (
    null
   
 
  )
}
