import prismadb from "@/lib/prismadb";
interface DashboardPageProps {
    params: {machineId: string}
};
const DashboardPage:React.FC<DashboardPageProps> = async ({params}) => {
    const machine = await prismadb.machine.findFirst({
        where: {
            id: params.machineId,
        },
    });
    return (
        <div>
            Current Active Store: {machine?.name}
        </div>
    );
}

export default DashboardPage