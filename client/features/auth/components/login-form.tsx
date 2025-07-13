import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordField from "../../../components/password-field";
import InputField from "../../../components/input-field";
import { login, profile } from "../api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const schema = z.object({
  user_name: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    let loginError = "";
    try {
      const res = await login(data.user_name, data.password);
      const res_profile = await profile();
      const role = res_profile.role;
      switch (role) {
        case 'admin':
          router.push("/admin/home/");
          break;
        case 'student':
        case 'parent':
        case 'teacher':
          router.push("/");

          break;

      }

    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;

      if (axiosError.response && axiosError.response.data) {
        loginError = (axiosError.response.data.error || "Tên đăng nhập hoặc mật khẩu không chính xác.");
      } else if (axiosError.message === "Network Error") {
        loginError = ("Không thể kết nối đến server.");
      } else {
        loginError = ("Đã có lỗi xảy ra.");
      }
      toast.error(loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Đăng nhập bằng mật khẩu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <InputField
                  id="user_name"
                  label="Tên tài khoản"
                  register={register("user_name")}
                  error={errors.user_name}
                />
              </div>

              <div className="grid gap-3">
                <PasswordField
                  register={register("password")}
                  error={errors.password}
                  forgotPasswordLink="/forgot-password"
                />
              </div>

              <Button variant="default" type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Hoặc
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Đăng nhập với Google
                </Button>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
