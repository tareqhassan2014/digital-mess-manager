"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Eye,
  EyeOff,
  Hash,
  Home,
  Lock,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Role type
type Role = "student" | "manager";

// Zod schemas
const studentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hostelCode: z.string().length(6, "Hostel code must be exactly 6 characters"),
});

const managerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hostelName: z.string().min(2, "Hostel name must be at least 2 characters"),
  area: z.enum(["Daulatpur", "Farmgate", "Other"], {
    message: "Please select an area",
  }),
});

type StudentFormData = z.infer<typeof studentSchema>;
type ManagerFormData = z.infer<typeof managerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [areaValue, setAreaValue] = useState<string>("");

  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
      hostelCode: "",
    },
  });

  const managerForm = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
      hostelName: "",
      area: undefined,
    },
  });

  const onSubmit = (data: StudentFormData | ManagerFormData) => {
    console.log("Form submitted:", { role, data });
    // TODO: Handle form submission
  };

  const onSubmitStudent = studentForm.handleSubmit((data) => onSubmit(data));
  const onSubmitManager = managerForm.handleSubmit((data) => onSubmit(data));

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Home className="size-5" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Latent Talent Hostel
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            {role === "student"
              ? "Join a hostel and start managing your meals"
              : "Create your hostel and manage meals efficiently"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={role === "student" ? onSubmitStudent : onSubmitManager}
          >
            <div className="grid gap-6">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1 h-auto py-3"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-xs font-medium">Google</span>
                </Button>

                {/* Facebook */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2] hover:border-[#166FE5] flex flex-col items-center justify-center gap-1 h-auto py-3"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs font-medium">Facebook</span>
                </Button>
              </div>

              {/* Separator */}
              <div className="relative text-center text-sm">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* Role Switcher */}
              <div className="relative bg-muted rounded-full p-1 flex">
                <button
                  type="button"
                  onClick={() => {
                    setRole("student");
                    studentForm.reset();
                    managerForm.reset();
                    setAreaValue("");
                  }}
                  className={cn(
                    "flex-1 relative z-10 py-2.5 px-4 text-sm font-medium rounded-full transition-all duration-200",
                    role === "student"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Join a Hostel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("manager");
                    studentForm.reset();
                    managerForm.reset();
                    setAreaValue("");
                  }}
                  className={cn(
                    "flex-1 relative z-10 py-2.5 px-4 text-sm font-medium rounded-full transition-all duration-200",
                    role === "manager"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Create a Hostel
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid gap-6">
                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                      {...(role === "student"
                        ? studentForm.register("fullName")
                        : managerForm.register("fullName"))}
                    />
                  </div>
                  {(role === "student"
                    ? studentForm.formState.errors.fullName
                    : managerForm.formState.errors.fullName) && (
                    <p className="text-sm text-destructive">
                      {
                        (role === "student"
                          ? studentForm.formState.errors.fullName
                          : managerForm.formState.errors.fullName
                        )?.message
                      }
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                      {...(role === "student"
                        ? studentForm.register("phone")
                        : managerForm.register("phone"))}
                    />
                  </div>
                  {(role === "student"
                    ? studentForm.formState.errors.phone
                    : managerForm.formState.errors.phone) && (
                    <p className="text-sm text-destructive">
                      {
                        (role === "student"
                          ? studentForm.formState.errors.phone
                          : managerForm.formState.errors.phone
                        )?.message
                      }
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                      {...(role === "student"
                        ? studentForm.register("password")
                        : managerForm.register("password"))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {(role === "student"
                    ? studentForm.formState.errors.password
                    : managerForm.formState.errors.password) && (
                    <p className="text-sm text-destructive">
                      {
                        (role === "student"
                          ? studentForm.formState.errors.password
                          : managerForm.formState.errors.password
                        )?.message
                      }
                    </p>
                  )}
                </div>

                {/* Conditional Fields */}
                {role === "student" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="hostelCode">Hostel Code</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="hostelCode"
                        type="text"
                        placeholder="DH-402"
                        maxLength={6}
                        className="pl-10 uppercase bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                        {...studentForm.register("hostelCode")}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ask your manager for the hostel code.
                    </p>
                    {studentForm.formState.errors.hostelCode && (
                      <p className="text-sm text-destructive">
                        {studentForm.formState.errors.hostelCode.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="hostelName">Hostel Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="hostelName"
                          type="text"
                          placeholder="Mayer Doa Student Mess"
                          className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                          {...managerForm.register("hostelName")}
                        />
                      </div>
                      {managerForm.formState.errors.hostelName && (
                        <p className="text-sm text-destructive">
                          {managerForm.formState.errors.hostelName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="area">Area / Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
                        <Select
                          value={areaValue}
                          onValueChange={(value) => {
                            setAreaValue(value);
                            managerForm.setValue(
                              "area",
                              value as "Daulatpur" | "Farmgate" | "Other",
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                        >
                          <SelectTrigger
                            id="area"
                            className={cn(
                              "h-12 pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700",
                              managerForm.formState.errors.area &&
                                "border-destructive"
                            )}
                          >
                            <SelectValue placeholder="Select an area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daulatpur">Daulatpur</SelectItem>
                            <SelectItem value="Farmgate">Farmgate</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {managerForm.formState.errors.area && (
                        <p className="text-sm text-destructive">
                          {managerForm.formState.errors.area.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={
                    role === "student"
                      ? studentForm.formState.isSubmitting
                      : managerForm.formState.isSubmitting
                  }
                >
                  {role === "student" ? "Join Hostel" : "Create Hostel"}
                </Button>
              </div>

              {/* Footer Link */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
