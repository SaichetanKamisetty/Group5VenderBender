"use client";

import { MachineModal } from "@/components/modals/machine-modal";
import {useEffect, useState } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
 
    //code use to deal with potential hydration errors in the future
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted) return null;

    return (
        <>
            <MachineModal />
        </>
    )



}