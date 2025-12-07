import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AudienceSplit() {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Box A: Student */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 md:p-12 shadow-lg border border-border">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                I need to track my meals.
              </h3>
              <p className="text-base text-muted-foreground">
                See your meal history, calculate your bill, and toggle meals on
                or off with one tap.
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
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-8 md:p-12 shadow-lg border border-border">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                I need to manage a hostel.
              </h3>
              <p className="text-base text-muted-foreground">
                Lock meals, track bazar costs, and generate bills automatically
                for your entire mess.
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full md:w-auto"
              >
                <Link href="/register?type=manager">Create Hostel Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
