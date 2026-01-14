"use client";

import { newUser } from "@/actions/auth-act";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [toggleEye, setToggleEye] = useState({
    pass: false,
    cPass: false,
  });

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Card className="max-w-md rounded-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-4xl font-medium text-center">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              const raw = {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password"),
                confirmPassword: formData.get("confirmPassword"),
              };
              console.log("r", raw);
              const res = await newUser(raw);
              if (!res.success) {
                alert(res.errors ? res.errors : res.message ?? "Failed");
                return;
              }
              alert(res.message);
            }}
            className="space-y-4"
          >
            <Input name="name" type="text" placeholder="Enter name" />
            <Input name="email" type="email" placeholder="Enter email" />
            <div className="relative">
              <Input
                name="password"
                type={toggleEye.pass ? "text" : "password"}
                placeholder="Enter password"
              />
              <Button
                className="absolute right-0 top-0"
                type="button"
                variant={"ghost"}
                onClick={() => {
                  setToggleEye((prev) => ({
                    ...prev,
                    pass: !prev.pass,
                  }));
                }}
              >
                {toggleEye.pass ? <EyeOffIcon /> : <EyeIcon />}
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
                {toggleEye.cPass ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit" size={"lg"}>
                Submit
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
