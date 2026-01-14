"use client";

import { newUser } from "@/actions/auth-act";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

export default function RegisterPage() {
  const [toggleEye, setToggleEye] = useState({
    pass: false,
    cPass: false,
  });

  const [state, formAction, isPending] = useActionState(newUser, null);

  useEffect(() => {
    if (!state) return;
    if (!state?.success) {
      alert(state?.errors ? state.errors : state?.message ?? "Failed");
      return;
    }
    alert(state.message);
  }, [state]);

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Card className="max-w-md rounded-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-4xl font-medium text-center">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Input
              disabled={isPending}
              name="name"
              type="text"
              placeholder="Enter name"
            />
            <Input
              disabled={isPending}
              name="email"
              type="email"
              placeholder="Enter email"
            />
            <div className="relative">
              <Input
                name="password"
                type={toggleEye.pass ? "text" : "password"}
                placeholder="Enter password"
                disabled={isPending}
              />
              <Button
                className="absolute right-0 top-0"
                type="button"
                variant={"ghost"}
                disabled={isPending}
                onClick={() => {
                  setToggleEye((prev) => ({
                    ...prev,
                    pass: !prev.pass,
                  }));
                }}
              >
                {toggleEye.pass ? <EyeIcon /> : <EyeOffIcon />}
              </Button>
            </div>
            {/* confirm password */}
            <div className="relative">
              <Input
                name="confirmPassword"
                type={toggleEye.cPass ? "text" : "password"}
                placeholder="Confirm password"
              />
              <Button
                disabled={isPending}
                className="absolute right-0 top-0"
                type="button"
                variant={"ghost"}
                onClick={() => {
                  setToggleEye((prev) => ({
                    ...prev,
                    cPass: !prev.cPass,
                  }));
                }}
              >
                {toggleEye.cPass ? <EyeIcon /> : <EyeOffIcon />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Button disabled={isPending} type="submit" size={"lg"}>
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
              <p>
                Already an user ?{" "}
                <span className="hover:text-blue-500 hover:underline hover:underline-offset-4">
                  <Link href="/login">Login</Link>
                </span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
