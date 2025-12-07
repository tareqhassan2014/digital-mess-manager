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
  Building2,
  CheckCircle2,
  Hash,
  MapPin,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

export function CreateHostelForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg border border-border bg-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Create New Hostel
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Hostel Information
          </CardTitle>
          <CardDescription>
            Fill in the details to create a new hostel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md shadow-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md shadow-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Hostel created successfully! Redirecting...
                </div>
              )}

              {/* Hostel Name */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-foreground">
                  Hostel Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter hostel name"
                    className="pl-10 bg-background"
                    {...form.register("name")}
                    disabled={isLoading}
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Short Code */}
              <div className="grid gap-2">
                <Label htmlFor="shortCode" className="text-foreground">
                  Short Code <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="shortCode"
                    type="text"
                    placeholder="e.g., HOSTEL01"
                    className="pl-10 bg-background uppercase"
                    {...form.register("shortCode", {
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase();
                      },
                    })}
                    disabled={isLoading}
                  />
                </div>
                {form.formState.errors.shortCode && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.shortCode.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Unique code for the hostel (uppercase letters and numbers
                  only)
                </p>
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address" className="text-foreground">
                  Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Textarea
                    id="address"
                    placeholder="Enter full address"
                    className="pl-10 bg-background min-h-[80px]"
                    {...form.register("address")}
                    disabled={isLoading}
                  />
                </div>
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-foreground">
                  Hostel Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select hostel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BOYS">Boys Hostel</SelectItem>
                        <SelectItem value="GIRLS">Girls Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.type && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              {/* Seats Section */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-lg font-semibold text-foreground">
                    Seats Configuration
                  </Label>
                </div>

                {/* Total Seats */}
                <div className="grid gap-2">
                  <Label htmlFor="totalSeats" className="text-foreground">
                    Total Seats <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    min="1"
                    placeholder="0"
                    className="bg-background"
                    {...form.register("seats.total")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.seats?.total && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.seats.total.message}
                    </p>
                  )}
                </div>

                {/* Occupied Seats */}
                <div className="grid gap-2">
                  <Label htmlFor="occupiedSeats" className="text-foreground">
                    Occupied Seats
                  </Label>
                  <Input
                    id="occupiedSeats"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-background"
                    {...form.register("seats.occupied")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.seats?.occupied && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.seats.occupied.message}
                    </p>
                  )}
                </div>

                {/* Available for Rent */}
                <div className="grid gap-2">
                  <Label htmlFor="availableSeats" className="text-foreground">
                    Available for Rent
                  </Label>
                  <Input
                    id="availableSeats"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-background"
                    {...form.register("seats.availableForRent")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.seats?.availableForRent && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.seats.availableForRent.message}
                    </p>
                  )}
                </div>

                {/* In Maintenance */}
                <div className="grid gap-2">
                  <Label htmlFor="maintenanceSeats" className="text-foreground">
                    In Maintenance
                  </Label>
                  <Input
                    id="maintenanceSeats"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-background"
                    {...form.register("seats.inMaintenance")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.seats?.inMaintenance && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.seats.inMaintenance.message}
                    </p>
                  )}
                </div>

                {/* Seats Validation */}
                {!seatsValid && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Sum of occupied ({occupiedSeats}), available (
                    {availableSeats}), and maintenance ({maintenanceSeats})
                    seats ({seatsSum}) cannot exceed total seats ({totalSeats})
                  </div>
                )}
                {seatsValid && totalSeats > 0 && (
                  <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <CheckCircle2 className="h-4 w-4 inline mr-2" />
                    Seats configuration is valid ({seatsSum} / {totalSeats})
                  </div>
                )}
              </div>

              {/* Location Section (Optional) */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-lg font-semibold text-foreground">
                    Location (Optional)
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add coordinates for location-based features
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude" className="text-foreground">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 23.8103"
                      className="bg-background"
                      {...form.register("latitude")}
                      disabled={isLoading}
                    />
                    {form.formState.errors.latitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.latitude.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="longitude" className="text-foreground">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 90.4125"
                      className="bg-background"
                      {...form.register("longitude")}
                      disabled={isLoading}
                    />
                    {form.formState.errors.longitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.longitude.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                size="lg"
                disabled={isLoading || !seatsValid}
              >
                {isLoading ? "Creating Hostel..." : "Create Hostel"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
