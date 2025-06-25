import SemesterSubjectForm from "@/components/form/SemesterSubjectsForm"
import { ScrollArea } from "@/components/ui/scroll-area"

const SemesterSubjectPage = () => {
    return (
        <ScrollArea className='bg-white w-full '>
            <div className='p-4'>
                <SemesterSubjectForm />
            </div>
        </ScrollArea>
    )
}

export default SemesterSubjectPage