"use client";

import { logUser } from "@/actions/auth-act";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(logUser, null);

  const [toggleEye, setToggleEye] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (!state?.success) {
      alert(state?.errors ? state.errors : state?.message ?? "Failed");
      return;
    }
    alert(state.message);
    router.push("/research");
  }, [state, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Card className="w-full max-w-sm rounded-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-4xl font-medium text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Input
              disabled={isPending}
              name="email"
              type="email"
              placeholder="Enter email"
            />
            <div className="relative">
              <Input
                disabled={isPending}
                name="password"
                type={toggleEye ? "text" : "password"}
                placeholder="Enter password"
              />
              <Button
                disabled={isPending}
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
              <Button disabled={isPending} type="submit" size={"lg"}>
                {isPending ? <Loader2Icon className="animate-spin" /> : "Login"}
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
