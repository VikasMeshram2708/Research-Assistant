import { MenuIcon, ScanSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function Header() {
  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Research",
      href: "/research",
    },
    {
      label: "About",
      href: "/about",
    },
  ] as const;
  return (
    <header className="p-4 sticky top-0 z-50 bg-background/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <ScanSearch className="size-8" />
          <h1 className="bg-clip-text text-transparent bg-linear-to-r from-pink-500 via-orange-600 to-pink-600 italic font-medium text-xl sm:text-2xl md:text-3xl flex items-center gap-2">
            Research Assistant
          </h1>
        </Link>
        <nav className="hidden lg:flex items-center gap-4">
          {navLinks.map((nl) => (
            <Link key={nl.label} href={nl.href}>
              <span className="text-sm hover:text-primary transition-colors duration-300 ease-out">
                {nl.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"ghost"}>
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent className="">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-4">
                    <ScanSearch className="size-8" />
                    <h1 className="bg-clip-text text-transparent bg-linear-to-r from-pink-500 via-orange-600 to-pink-600 italic font-medium text-xl sm:text-2xl md:text-3xl flex items-center gap-2">
                      Research Assistant
                    </h1>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="p-5 flex flex-col gap-4">
                {navLinks.map((nl) => (
                  <Link key={nl.label} href={nl.href}>
                    <span className="text-sm hover:text-primary transition-colors duration-300 ease-out">
                      {nl.label}
                    </span>
                  </Link>
                ))}
              </nav>
              <SheetFooter className="grid gap-3">
                <Button variant={"link"}>Login</Button>
                <Button>Register</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        {/* auth buttons */}
        <div className="hidden lg:flex items-center accent-pink-200">
          <Button variant={"link"}>Login</Button>
          <Button>Register</Button>
        </div>
      </div>
    </header>
  );
}
