import { GradeTable } from "@/components/grade-table"
import { ScrollArea } from "@/components/ui/scroll-area"

const ResultPage = () => {
    return (
        <ScrollArea className='bg-white w-full h-[calc(100vh-60px)] p-4'>
            <GradeTable />
        </ScrollArea>
    )
}

export default ResultPage