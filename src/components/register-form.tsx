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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
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
              <div className="flex flex-col gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up with Apple
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </div>

              {/* Divider */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
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
                      className="pl-10"
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
                      className="pl-10"
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
                      className="pl-10 pr-10"
                      {...(role === "student"
                        ? studentForm.register("password")
                        : managerForm.register("password"))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                        className="pl-10 uppercase"
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
                          className="pl-10"
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
                              "h-12 pl-10",
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
                <Link href="/login" className="underline underline-offset-4">
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
