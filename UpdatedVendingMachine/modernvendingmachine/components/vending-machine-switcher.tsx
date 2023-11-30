"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Machine } from "@prisma/client"
import { VendingMachineModal } from "@/hooks/VendingMachineModal"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import Image from "next/image"
import VendingMachineIcon from "../public/vendingdude.png"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger> 

interface VendingMachineSwitcherProps extends PopoverTriggerProps {
    items: Machine[];
}

export default function VendingMachineSwitcher ({className, items = []}:VendingMachineSwitcherProps) {
    const machineModal = VendingMachineModal();
    const params = useParams();
    const router = useRouter();

    const formatItems = items.map((item) => ({
        label: item.name,
        value: item.id
     }));

     const currentVendingMachine = formatItems.find((item) => item.value === params.machineId);

     const [open, setOpen] = useState(false);
     const VendingMachineSelect = (machine: {value: string; label: string}) => { 
        setOpen(false);
        router.push(`/${machine.value}/settings`);
     }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a Vending Machine"
                className={cn("w-[200px] justify-between", className)}>
                    {/* <Store className="mr-2 h-4 w-4"/> */}
                    <Image src={VendingMachineIcon} alt="Vending Machine Icon" width="25" height="25" className="mr-2"/>
                    {currentVendingMachine?.label || "Select a Vending Machine"}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search Machine..."/>
                        <CommandEmpty>No Machine Found.</CommandEmpty>
                        <CommandGroup heading="Machines">
                            {formatItems.map((machine) => (
                                <CommandItem key={machine.value} onSelect={()=> VendingMachineSelect(machine)} className="text-sm">
                                      <Image src={VendingMachineIcon} className="mr-2" alt="Vending Machine Icon" width="25" height="25"/>
                                    {machine.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentVendingMachine?.value === machine.value ? "opacity-100" : "opacity-0")}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => { 
                                setOpen(false)
                                machineModal.onOpen();
                            }}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Machine
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
