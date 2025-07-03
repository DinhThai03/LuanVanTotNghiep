import ChangePasswordForm from "@/components/form/ChangePasswordForm";
import InfoForm from "@/components/form/InfoForm";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

const ProfilePage = () => {
    return (
        <div className=" flex bg-white justify-start items-start w-full p-6">
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-fit grid-cols-2 mb-4">
                    <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
                    <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                </TabsList>
                <div className='w-full flex justify-center items-center h-[calc(100vh-200px)]'>
                    <div className="w-full max-w-2xl border rounded-md shadow-md p-4 ">

                        <TabsContent value="info">
                            <InfoForm />
                        </TabsContent>
                        <TabsContent value="password">
                            <ChangePasswordForm />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default ProfilePage;
