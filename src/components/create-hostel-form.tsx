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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Hash,
  List,
  MapPin,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const createHostelSchema = z
  .object({
    name: z.string().min(2, "Hostel name must be at least 2 characters"),
    shortCode: z
      .string()
      .min(2, "Short code must be at least 2 characters")
      .max(10, "Short code must be at most 10 characters")
      .regex(
        /^[A-Z0-9]+$/,
        "Short code must contain only uppercase letters and numbers"
      ),
    address: z.string().min(5, "Address must be at least 5 characters"),
    type: z.enum(["BOYS", "GIRLS"], "Type must be either BOYS or GIRLS"),
    seats: z.object({
      total: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(1, "Total seats must be at least 1")
      ),
      occupied: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(0, "Occupied seats cannot be negative")
      ),
      availableForRent: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(0, "Available seats cannot be negative")
      ),
      inMaintenance: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(0, "Maintenance seats cannot be negative")
      ),
    }),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    rules: z
      .array(
        z.object({
          order: z.preprocess(
            (val) =>
              val === "" || val === null || val === undefined ? 0 : Number(val),
            z.number().int().min(0, "Order must be a non-negative number")
          ),
          level: z.enum(["CRITICAL", "MODERATE", "INFO"] as [
            string,
            string,
            string
          ]),
          title: z.string().min(1, "Title is required"),
          description: z.string().optional(),
          fine: z.string().min(1, "Fine is required"),
        })
      )
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      const seats = data.seats;
      const total =
        typeof seats.total === "number"
          ? seats.total
          : parseInt(String(seats.total), 10);
      const occupied =
        typeof seats.occupied === "number"
          ? seats.occupied
          : parseInt(String(seats.occupied), 10);
      const available =
        typeof seats.availableForRent === "number"
          ? seats.availableForRent
          : parseInt(String(seats.availableForRent), 10);
      const maintenance =
        typeof seats.inMaintenance === "number"
          ? seats.inMaintenance
          : parseInt(String(seats.inMaintenance), 10);
      return occupied + available + maintenance <= total;
    },
    {
      message:
        "Sum of occupied, available, and maintenance seats cannot exceed total seats",
      path: ["seats"],
    }
  )
  .refine(
    (data) => {
      if (data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        return (
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        );
      }
      return true;
    },
    {
      message: "Invalid latitude or longitude values",
      path: ["latitude"],
    }
  );

type HostelFormData = z.infer<typeof createHostelSchema>;

// Step-specific validation schemas
const step1Schema = z.object({
  name: z.string().min(2, "Hostel name must be at least 2 characters"),
  shortCode: z
    .string()
    .min(2, "Short code must be at least 2 characters")
    .max(10, "Short code must be at most 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Short code must contain only uppercase letters and numbers"
    ),
  address: z.string().min(5, "Address must be at least 5 characters"),
  type: z.enum(["BOYS", "GIRLS"], "Type must be either BOYS or GIRLS"),
});

const step2Schema = z.object({
  seats: z
    .object({
      total: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(1, "Total seats must be at least 1")
      ),
      occupied: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(0, "Occupied seats cannot be negative")
      ),
      availableForRent: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(0, "Available seats cannot be negative")
      ),
      inMaintenance: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? 0 : Number(val),
        z.number().int().min(0, "Maintenance seats cannot be negative")
      ),
    })
    .refine(
      (seats) => {
        const total = Number(seats.total) || 0;
        const occupied = Number(seats.occupied) || 0;
        const available = Number(seats.availableForRent) || 0;
        const maintenance = Number(seats.inMaintenance) || 0;
        return occupied + available + maintenance <= total;
      },
      {
        message:
          "Sum of occupied, available, and maintenance seats cannot exceed total seats",
        path: ["seats"],
      }
    ),
});

const step3Schema = z.object({
  rules: z
    .array(
      z.object({
        order: z.preprocess(
          (val) =>
            val === "" || val === null || val === undefined ? 0 : Number(val),
          z.number().int().min(0, "Order must be a non-negative number")
        ),
        level: z.enum(["CRITICAL", "MODERATE", "INFO"]),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        fine: z.string().min(1, "Fine is required"),
      })
    )
    .optional()
    .default([]),
});

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Hostel details",
    icon: Building2,
  },
  {
    id: 2,
    title: "Seats Configuration",
    description: "Capacity settings",
    icon: Users,
  },
  {
    id: 3,
    title: "Rules",
    description: "Hostel rules",
    icon: FileText,
  },
  {
    id: 4,
    title: "Location",
    description: "Optional coordinates",
    icon: MapPin,
  },
] as const;

export function CreateHostelForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HostelFormData>({
    resolver: zodResolver(createHostelSchema),
    defaultValues: {
      name: "",
      shortCode: "",
      address: "",
      type: undefined,
      seats: {
        total: 0,
        occupied: 0,
        availableForRent: 0,
        inMaintenance: 0,
      },
      latitude: "",
      longitude: "",
      rules: [],
    },
  });

  const onSubmit = async (data: HostelFormData) => {
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // Transform seat values to numbers (already handled by zod preprocess)
      const seats = {
        total: Number(data.seats.total),
        occupied: Number(data.seats.occupied),
        availableForRent: Number(data.seats.availableForRent),
        inMaintenance: Number(data.seats.inMaintenance),
      };

      const payload: {
        name: string;
        shortCode: string;
        address: string;
        type: "BOYS" | "GIRLS";
        seats: {
          total: number;
          occupied: number;
          availableForRent: number;
          inMaintenance: number;
        };
        rules?: {
          order: number;
          level: "CRITICAL" | "MODERATE" | "INFO";
          title: string;
          description?: string;
          fine: string;
        }[];
        location?: {
          coordinates: [number, number];
        };
      } = {
        name: data.name,
        shortCode: data.shortCode.toUpperCase(),
        address: data.address,
        type: data.type,
        seats,
      };

      // Add rules if provided
      if (data.rules && data.rules.length > 0) {
        payload.rules = data.rules.map((rule) => ({
          order: Number(rule.order) || 0,
          level: rule.level as "CRITICAL" | "MODERATE" | "INFO",
          title: rule.title,
          description: rule.description || undefined,
          fine: rule.fine,
        }));
      }

      // Add location if provided
      if (data.latitude && data.longitude) {
        payload.location = {
          coordinates: [
            parseFloat(data.longitude), // Longitude first
            parseFloat(data.latitude), // Latitude second
          ],
        };
      }

      const response = await fetch("/api/hostels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create hostel");
        return;
      }

      setSuccess(true);
      // Reset form
      form.reset();
      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const seats = form.watch("seats");
  const totalSeats = Number(seats.total) || 0;
  const occupiedSeats = Number(seats.occupied) || 0;
  const availableSeats = Number(seats.availableForRent) || 0;
  const maintenanceSeats = Number(seats.inMaintenance) || 0;
  const seatsSum = occupiedSeats + availableSeats + maintenanceSeats;
  const seatsValid = seatsSum <= totalSeats;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  // Step validation using step-specific schemas
  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 4) return true; // Location is optional

    try {
      const formValues = form.getValues();

      if (step === 1) {
        // Validate basic information fields
        const result = step1Schema.safeParse({
          name: formValues.name,
          shortCode: formValues.shortCode,
          address: formValues.address,
          type: formValues.type,
        });

        if (!result.success) {
          // Set errors on form for display
          result.error.issues.forEach((issue) => {
            const path = issue.path.join(".") as keyof HostelFormData;
            form.setError(path, {
              type: "manual",
              message: issue.message,
            });
          });
          return false;
        }
        return true;
      } else if (step === 2) {
        // Validate seats fields
        const result = step2Schema.safeParse({
          seats: formValues.seats,
        });

        if (!result.success) {
          // Set errors on form for display
          result.error.issues.forEach((issue) => {
            const path = issue.path.join(".") as
              | "seats"
              | "seats.total"
              | "seats.occupied"
              | "seats.availableForRent"
              | "seats.inMaintenance";
            form.setError(path, {
              type: "manual",
              message: issue.message,
            });
          });
          return false;
        }
        return true;
      } else if (step === 3) {
        // Validate rules fields
        const result = step3Schema.safeParse({
          rules: formValues.rules || [],
        });

        if (!result.success) {
          // Set errors on form for display
          result.error.issues.forEach((issue) => {
            const path = issue.path.join(".") as
              | keyof HostelFormData
              | `rules.${number}.${string}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form.setError(path as any, {
              type: "manual",
              message: issue.message,
            });
          });
          return false;
        }
        return true;
      }
      return true;
    } catch {
      // If validation throws an error, the step is invalid
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setError("");
    } else {
      // Show validation errors if step is invalid
      const errors = form.formState.errors;
      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        if (firstError?.message) {
          setError(firstError.message as string);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleStepClick = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      setError("");
    } else if (step > currentStep) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep(step);
        setError("");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-2xl border border-gray-700 bg-gray-800 rounded-2xl">
        <CardHeader className="space-y-6">
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-white">
              Create New Hostel
            </CardTitle>
            <CardDescription className="text-base text-gray-300">
              Follow the steps below to set up your hostel
            </CardDescription>
          </div>

          {/* Step Indicator */}
          <div className="relative">
            <div className="flex items-start justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isClickable = currentStep >= step.id;

                return (
                  <Fragment key={step.id}>
                    {/* Step Circle and Content */}
                    <div className="flex flex-col items-center flex-1 relative z-10 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleStepClick(step.id)}
                        disabled={!isClickable}
                        className={cn(
                          "relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0",
                          isActive
                            ? "border-teal-700 bg-teal-500 text-white"
                            : "border-gray-600 bg-gray-400 text-gray-600",
                          isClickable && "cursor-pointer hover:scale-105"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                      <div className="mt-3 text-center w-full">
                        <p
                          className={cn(
                            "text-sm font-medium transition-colors break-words",
                            isActive || isCompleted
                              ? "text-white"
                              : "text-gray-400"
                          )}
                        >
                          {step.title}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-1 transition-colors break-words",
                            isActive || isCompleted
                              ? "text-gray-300"
                              : "text-gray-500"
                          )}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Connecting Line - centered vertically with circle */}
                    {index < STEPS.length - 1 && (
                      <div className="flex-1 mx-4 relative z-0">
                        <div className="absolute top-6 left-0 right-0 h-0.5 -translate-y-1/2">
                          {isCompleted ? (
                            <div className="h-full bg-teal-500 transition-all duration-500" />
                          ) : isActive ? (
                            <div className="h-full bg-teal-500 transition-all duration-500" />
                          ) : (
                            <div className="h-full border-t-2 border-dashed border-gray-400 transition-all duration-500" />
                          )}
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            data-form-type="hostel-creation"
          >
            <div className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-400 bg-red-900/20 rounded-lg shadow-sm flex items-center gap-2 border border-red-800/50">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 text-sm text-green-400 bg-green-900/20 border border-green-800/50 rounded-lg shadow-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span className="text-green-300">
                    Hostel created successfully! Redirecting...
                  </span>
                </div>
              )}

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-left-2 duration-300">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white">
                      Basic Information
                    </h3>
                    <p className="text-sm text-gray-300">
                      Provide the essential details about your hostel
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white">
                      Hostel Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter hostel name"
                        className="pl-10 bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                        {...form.register("name")}
                        disabled={isLoading}
                        autoComplete="off"
                        data-field="hostel-name"
                      />
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-400">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Short Code */}
                  <div className="grid gap-2">
                    <Label htmlFor="shortCode" className="text-white">
                      Short Code <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <Input
                        id="shortCode"
                        type="text"
                        placeholder="E.G. HOSTEL01"
                        className="pl-10 bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500 uppercase"
                        {...form.register("shortCode", {
                          onChange: (e) => {
                            e.target.value = e.target.value.toUpperCase();
                          },
                        })}
                        disabled={isLoading}
                        autoComplete="off"
                        data-field="hostel-short-code"
                      />
                    </div>
                    {form.formState.errors.shortCode && (
                      <p className="text-sm text-red-400">
                        {form.formState.errors.shortCode.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Unique code for this hostel (uppercase letters and numbers
                      only)
                    </p>
                  </div>

                  {/* Address */}
                  <div className="grid gap-2">
                    <Label htmlFor="address" className="text-white">
                      Address <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                      <Textarea
                        id="address"
                        placeholder="Enter full address"
                        className="pl-10 bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500 min-h-[80px]"
                        {...form.register("address")}
                        disabled={isLoading}
                        autoComplete="street-address"
                        data-field="hostel-address"
                      />
                    </div>
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-400">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="grid gap-2">
                    <Label htmlFor="type" className="text-white">
                      Hostel Type <span className="text-red-400">*</span>
                    </Label>
                    <Controller
                      name="type"
                      control={form.control}
                      render={({ field }) => (
                        <div className="relative">
                          <List className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="pl-10 bg-gray-800 text-white border-gray-700 focus:border-teal-500 focus:ring-teal-500">
                              <SelectValue placeholder="Select hostel type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem
                                value="BOYS"
                                className="text-white hover:bg-gray-700"
                              >
                                Boys Hostel
                              </SelectItem>
                              <SelectItem
                                value="GIRLS"
                                className="text-white hover:bg-gray-700"
                              >
                                Girls Hostel
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {form.formState.errors.type && (
                      <p className="text-sm text-red-400">
                        {form.formState.errors.type.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Seats Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-left-2 duration-300">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white">
                      Seats Configuration
                    </h3>
                    <p className="text-sm text-gray-300">
                      Configure the seating capacity and availability
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Total Seats */}
                    <div className="grid gap-2">
                      <Label htmlFor="totalSeats" className="text-white">
                        Total Seats <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="totalSeats"
                        type="number"
                        min="1"
                        placeholder="0"
                        className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                        {...form.register("seats.total")}
                        disabled={isLoading}
                      />
                      {form.formState.errors.seats?.total && (
                        <p className="text-sm text-red-400">
                          {form.formState.errors.seats.total.message}
                        </p>
                      )}
                    </div>

                    {/* Occupied Seats */}
                    <div className="grid gap-2">
                      <Label htmlFor="occupiedSeats" className="text-white">
                        Occupied Seats
                      </Label>
                      <Input
                        id="occupiedSeats"
                        type="number"
                        min="0"
                        placeholder="0"
                        className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                        {...form.register("seats.occupied")}
                        disabled={isLoading}
                      />
                      {form.formState.errors.seats?.occupied && (
                        <p className="text-sm text-red-400">
                          {form.formState.errors.seats.occupied.message}
                        </p>
                      )}
                    </div>

                    {/* Available for Rent */}
                    <div className="grid gap-2">
                      <Label htmlFor="availableSeats" className="text-white">
                        Available for Rent
                      </Label>
                      <Input
                        id="availableSeats"
                        type="number"
                        min="0"
                        placeholder="0"
                        className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                        {...form.register("seats.availableForRent")}
                        disabled={isLoading}
                      />
                      {form.formState.errors.seats?.availableForRent && (
                        <p className="text-sm text-red-400">
                          {form.formState.errors.seats.availableForRent.message}
                        </p>
                      )}
                    </div>

                    {/* In Maintenance */}
                    <div className="grid gap-2">
                      <Label htmlFor="maintenanceSeats" className="text-white">
                        In Maintenance
                      </Label>
                      <Input
                        id="maintenanceSeats"
                        type="number"
                        min="0"
                        placeholder="0"
                        className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                        {...form.register("seats.inMaintenance")}
                        disabled={isLoading}
                      />
                      {form.formState.errors.seats?.inMaintenance && (
                        <p className="text-sm text-red-400">
                          {form.formState.errors.seats.inMaintenance.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Seats Validation */}
                  {!seatsValid && (
                    <div className="p-4 text-sm text-red-400 bg-red-900/20 rounded-lg border border-red-800/50">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-300">
                            Invalid seats configuration
                          </p>
                          <p className="mt-1 text-xs text-red-400/80">
                            Sum of occupied ({occupiedSeats}), available (
                            {availableSeats}), and maintenance (
                            {maintenanceSeats}) seats ({seatsSum}) cannot exceed
                            total seats ({totalSeats})
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {seatsValid && totalSeats > 0 && (
                    <div className="p-4 text-sm text-green-400 bg-green-900/20 rounded-lg border border-green-800/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        <span className="text-green-300">
                          Seats configuration is valid ({seatsSum} /{" "}
                          {totalSeats})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Rules */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-left-2 duration-300">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white">
                      Hostel Rules (Optional)
                    </h3>
                    <p className="text-sm text-gray-300">
                      Define rules and regulations for your hostel
                    </p>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card
                        key={field.id}
                        className="bg-gray-700/50 border-gray-600"
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-white">
                                Rule {index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Order */}
                              <div className="grid gap-2">
                                <Label
                                  htmlFor={`rules.${index}.order`}
                                  className="text-white"
                                >
                                  Order
                                </Label>
                                <Input
                                  id={`rules.${index}.order`}
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                  {...form.register(
                                    `rules.${index}.order` as const
                                  )}
                                  disabled={isLoading}
                                />
                                {form.formState.errors.rules?.[index]
                                  ?.order && (
                                  <p className="text-sm text-red-400">
                                    {
                                      form.formState.errors.rules[index]?.order
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Level */}
                              <div className="grid gap-2">
                                <Label
                                  htmlFor={`rules.${index}.level`}
                                  className="text-white"
                                >
                                  Level
                                </Label>
                                <Controller
                                  name={`rules.${index}.level` as const}
                                  control={form.control}
                                  render={({ field }) => (
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      disabled={isLoading}
                                    >
                                      <SelectTrigger className="bg-gray-800 text-white border-gray-700 focus:border-teal-500 focus:ring-teal-500">
                                        <SelectValue placeholder="Select level" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem
                                          value="CRITICAL"
                                          className="text-white hover:bg-gray-700"
                                        >
                                          Critical
                                        </SelectItem>
                                        <SelectItem
                                          value="MODERATE"
                                          className="text-white hover:bg-gray-700"
                                        >
                                          Moderate
                                        </SelectItem>
                                        <SelectItem
                                          value="INFO"
                                          className="text-white hover:bg-gray-700"
                                        >
                                          Info
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                                {form.formState.errors.rules?.[index]
                                  ?.level && (
                                  <p className="text-sm text-red-400">
                                    {
                                      form.formState.errors.rules[index]?.level
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Title */}
                            <div className="grid gap-2">
                              <Label
                                htmlFor={`rules.${index}.title`}
                                className="text-white"
                              >
                                Title <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                id={`rules.${index}.title`}
                                type="text"
                                placeholder="Enter rule title"
                                className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                {...form.register(
                                  `rules.${index}.title` as const
                                )}
                                disabled={isLoading}
                              />
                              {form.formState.errors.rules?.[index]?.title && (
                                <p className="text-sm text-red-400">
                                  {
                                    form.formState.errors.rules[index]?.title
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                              <Label
                                htmlFor={`rules.${index}.description`}
                                className="text-white"
                              >
                                Description
                              </Label>
                              <Textarea
                                id={`rules.${index}.description`}
                                placeholder="Enter rule description (optional)"
                                className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500 min-h-[80px]"
                                {...form.register(
                                  `rules.${index}.description` as const
                                )}
                                disabled={isLoading}
                              />
                            </div>

                            {/* Fine */}
                            <div className="grid gap-2">
                              <Label
                                htmlFor={`rules.${index}.fine`}
                                className="text-white"
                              >
                                Fine <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                id={`rules.${index}.fine`}
                                type="text"
                                placeholder="e.g., 500 BDT"
                                className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                {...form.register(
                                  `rules.${index}.fine` as const
                                )}
                                disabled={isLoading}
                              />
                              {form.formState.errors.rules?.[index]?.fine && (
                                <p className="text-sm text-red-400">
                                  {
                                    form.formState.errors.rules[index]?.fine
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        append({
                          order: fields.length,
                          level: "INFO" as const,
                          title: "",
                          description: "",
                          fine: "0 BDT",
                        })
                      }
                      className="w-full border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>

                    {fields.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          No rules added yet. Click &quot;Add Rule&quot; to get
                          started.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Location */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-left-2 duration-300">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white">
                      Location (Optional)
                    </h3>
                    <p className="text-sm text-gray-300">
                      Add coordinates for location-based features
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude" className="text-white">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 23.8103"
                        className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                        {...form.register("latitude")}
                        disabled={isLoading}
                      />
                      {form.formState.errors.latitude && (
                        <p className="text-sm text-red-400">
                          {form.formState.errors.latitude.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="longitude" className="text-white">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 90.4125"
                        className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                        {...form.register("longitude")}
                        disabled={isLoading}
                      />
                      {form.formState.errors.longitude && (
                        <p className="text-sm text-red-400">
                          {form.formState.errors.longitude.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-700">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isLoading}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white border border-gray-500 disabled:bg-gray-700 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="text-sm text-gray-300">
                  Step {currentStep} of {STEPS.length}
                </div>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !seatsValid}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Create Hostel
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
