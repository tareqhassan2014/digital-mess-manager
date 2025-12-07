import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center relative gradient-hero px-4">
      {/* Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 pt-16">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white dark:text-foreground">
          Ditch the{" "}
          <span className="text-yellow-300 dark:text-yellow-500 line-through">
            Paper Notebook
          </span>
          .
          <br />
          The Automated Hostel Manager.
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-white/90 dark:text-muted-foreground max-w-[600px] mx-auto">
          Stop arguing over meal bills. Track history, lock meals, and calculate
          costs instantly.
        </p>

        {/* Primary CTA */}
        <Button
          asChild
          className="h-14 px-8 rounded-full shadow-lg hover:shadow-xl animate-subtle-pulse bg-background text-primary hover:bg-background/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
        >
          <Link href="/register" className="flex items-center gap-2">
            Start Your Free Pilot
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Mobile App Image - Overlaps bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full max-w-[320px] md:max-w-[400px]">
        <div className="relative bg-card-foreground rounded-[2.5rem] p-2 shadow-2xl border-2 border-border">
          <div className="bg-background rounded-[2rem] overflow-hidden">
            {/* Notch */}
            <div className="h-6 bg-card-foreground rounded-b-2xl"></div>
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
                <div className="bg-muted rounded-xl p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Lunch</p>
                      <p className="text-sm text-muted-foreground">12:00 PM</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 dark:bg-green-600">
                      <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-background transition"></span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Dinner</p>
                      <p className="text-sm text-muted-foreground">7:00 PM</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted-foreground/30">
                      <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-background transition"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4 space-y-2 border border-border">
                <p className="text-sm font-medium text-foreground">
                  This Month
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  24/30
                </p>
                <p className="text-xs text-muted-foreground">Meals taken</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
