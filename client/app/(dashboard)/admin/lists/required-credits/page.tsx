import RegistrationPeriodForm from "@/components/form/RegistrationPeriodForm"
import RequiredCreditForm from "@/components/form/RequiredCreditForm"
import { ScrollArea } from "@/components/ui/scroll-area"

const RequiredCredit = () => {
    return (
        <ScrollArea className='bg-white w-full '>
            <div className='p-4'>
                <RequiredCreditForm />
            </div>
        </ScrollArea>
    )
}

export default RequiredCredit