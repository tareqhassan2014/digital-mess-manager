import { Button } from "@/components/ui/button";
import { ArrowRight, History, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center relative bg-gradient-to-b from-background to-muted/30 px-4">
        {/* Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8 pt-16">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Ditch the{" "}
            <span className="text-destructive line-through">
              Paper Notebook
            </span>
            .
            <br />
            The Automated Hostel Manager.
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-muted-foreground max-w-[600px] mx-auto">
            Stop arguing over meal bills. Track history, lock meals, and
            calculate costs instantly.
          </p>

          {/* Primary CTA */}
          <Button
            asChild
            className="h-14 px-8 rounded-full shadow-lg hover:shadow-xl animate-subtle-pulse"
          >
            <Link href="/register" className="flex items-center gap-2">
              Start Your Free Pilot
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Mobile App Image - Overlaps bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full max-w-[320px] md:max-w-[400px]">
          <div className="relative bg-foreground rounded-[2.5rem] p-2 shadow-2xl">
            <div className="bg-background rounded-[2rem] overflow-hidden">
              {/* Notch */}
              <div className="h-6 bg-foreground rounded-b-2xl"></div>
              {/* Screen Content - Meal Toggle Interface */}
              <div className="bg-background p-6 space-y-6 min-h-[600px]">
                {/* Header */}
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    Today&apos;s Meals
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    December 5, 2025
                  </p>
                </div>

                {/* Meal Toggle Cards */}
                <div className="space-y-4">
                  <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Lunch</p>
                        <p className="text-sm text-muted-foreground">
                          12:00 PM
                        </p>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 dark:bg-green-600">
                        <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-background transition"></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Dinner</p>
                        <p className="text-sm text-muted-foreground">7:00 PM</p>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                        <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-background transition"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-muted rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-primary">24/30</p>
                  <p className="text-xs text-muted-foreground">Meals taken</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Trust Bar */}
      <section className="bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm md:text-base text-muted-foreground mb-6">
            Optimized for students from:
          </p>

          {/* Desktop: Static Row */}
          <div className="hidden md:flex items-center justify-center gap-8">
            {[
              "BL College",
              "Dhaka College",
              "MM College",
              "Titumir College",
            ].map((college) => (
              <div
                key={college}
                className="text-lg font-semibold text-muted-foreground opacity-50"
              >
                {college}
              </div>
            ))}
          </div>

          {/* Mobile: Marquee */}
          <div className="md:hidden overflow-hidden whitespace-nowrap">
            <div className="flex animate-marquee gap-8 w-max">
              {[...Array(2)].map((_, i) =>
                [
                  "BL College",
                  "Dhaka College",
                  "MM College",
                  "Titumir College",
                ].map((college) => (
                  <div
                    key={`${college}-${i}`}
                    className="flex-shrink-0 text-base font-semibold text-muted-foreground opacity-50 px-4"
                  >
                    {college}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Pain vs Solution */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          {/* Mobile: Horizontal Snap Carousel */}
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 md:hidden">
            {/* Card 1: One-Tap Meal Off */}
            <div className="flex-shrink-0 w-[85vw] snap-start bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">One-Tap Meal Off</h3>
                <p className="text-base text-muted-foreground">
                  Turning off lunch? Do it from bed. No more finding the
                  manager.
                </p>
              </div>
            </div>

            {/* Card 2: Manager Panic Mode */}
            <div className="flex-shrink-0 w-[85vw] snap-start bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Manager Panic Mode</h3>
                <p className="text-base text-muted-foreground">
                  Lock all meals for the next 24h instantly to fix the bazar
                  list.
                </p>
              </div>
            </div>

            {/* Card 3: Dispute-Free Billing */}
            <div className="flex-shrink-0 w-[85vw] snap-start bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Dispute-Free Billing</h3>
                <p className="text-base text-muted-foreground">
                  We keep 5 years of history. Every meal is tracked and
                  audit-ready.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8">
            {/* Card 1: One-Tap Meal Off */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold">One-Tap Meal Off</h3>
                <p className="text-base text-muted-foreground">
                  Turning off lunch? Do it from bed. No more finding the
                  manager.
                </p>
              </div>
            </div>

            {/* Card 2: Manager Panic Mode */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Manager Panic Mode</h3>
                <p className="text-base text-muted-foreground">
                  Lock all meals for the next 24h instantly to fix the bazar
                  list.
                </p>
              </div>
            </div>

            {/* Card 3: Dispute-Free Billing */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Dispute-Free Billing</h3>
                <p className="text-base text-muted-foreground">
                  We keep 5 years of history. Every meal is tracked and
                  audit-ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Audience Split */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Box A: Student */}
            <div className="flex-1 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 border border-border rounded-xl p-8 md:p-12 shadow-sm">
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold">
                  I need to track my meals.
                </h3>
                <p className="text-base text-muted-foreground">
                  See your meal history, calculate your bill, and toggle meals
                  on or off with one tap.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <Link href="/register?type=student">Student Login</Link>
                </Button>
              </div>
            </div>

            {/* Box B: Manager */}
            <div className="flex-1 bg-gradient-to-br from-secondary/5 via-background to-background dark:from-secondary/10 border border-border rounded-xl p-8 md:p-12 shadow-sm">
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold">
                  I need to manage a hostel.
                </h3>
                <p className="text-base text-muted-foreground">
                  Lock meals, track bazar costs, and generate bills
                  automatically for your entire mess.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <Link href="/register?type=manager">
                    Create Hostel Account
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="bg-muted/30 py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to modernize your mess?
          </h2>
          <div className="space-y-4">
            <Link
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-primary hover:text-primary/80 underline text-base md:text-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
