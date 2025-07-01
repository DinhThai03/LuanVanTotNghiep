import RegistrationPeriodForm from "@/components/form/RegistrationPeriodForm"
import { ScrollArea } from "@/components/ui/scroll-area"

const SemesterSubjectPage = () => {
    return (
        <ScrollArea className='bg-white w-full '>
            <div className='p-4'>
                <RegistrationPeriodForm />
            </div>
        </ScrollArea>
    )
}

export default SemesterSubjectPage