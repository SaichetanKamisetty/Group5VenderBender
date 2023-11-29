import {create} from "zustand";

interface VendingMachineModalInterface {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;

};

export const VendingMachineModal = create<VendingMachineModalInterface>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));