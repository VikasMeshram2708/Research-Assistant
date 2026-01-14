"use client";

import { logUser } from "@/actions/auth-act";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [toggleEye, setToggleEye] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Card className="w-full max-w-sm rounded-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-4xl font-medium text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              const raw = {
                email: formData.get("email"),
                password: formData.get("password"),
              };
              const res = await logUser(raw);
              console.log("cli-res", res);
              if (!res.success) {
                alert(res?.errors ? res.errors : res.message ?? "Failed");
                return;
              }
              alert("Logged In");
              router.push("/research");
            }}
            className="space-y-4"
          >
            <Input name="email" type="email" placeholder="Enter email" />
            <div className="relative">
              <Input
                name="password"
                type={toggleEye ? "text" : "password"}
                placeholder="Enter password"
              />
              <Button
                className="absolute right-0 top-0"
                type="button"
                variant={"ghost"}
                onClick={() => {
                  setToggleEye((prev) => !prev);
                }}
              >
                {toggleEye ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button type="submit" size={"lg"}>
                Login
              </Button>
              <p>
                Not an user ?{" "}
                <span className="hover:text-blue-500 hover:underline hover:underline-offset-4">
                  <Link href="/register">Register</Link>
                </span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
