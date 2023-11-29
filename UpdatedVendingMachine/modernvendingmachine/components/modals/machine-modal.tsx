"use client"
import {Modal} from "../ui/modal"
import { zodResolver } from "@hookform/resolvers/zod";
import { VendingMachineModal } from "@/hooks/VendingMachineModal";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 character long"}).max(60, {message: "Name must be less than 60 characters long"}),
});

export const MachineModal = () => { 
    const machineModal = VendingMachineModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //we create new vending machines
        console.log(values);
    }
    return (
        <Modal title="Create Vending Machine" description="Add new vending machine to manage items" isOpen={machineModal.isOpen} onClose={machineModal.onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Vending Machine" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button variant="outline" onClick={machineModal.onClose}>Cancel</Button>
                                <Button type="submit">Continue</Button>

                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )

};