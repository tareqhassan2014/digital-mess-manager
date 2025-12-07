import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="gradient-hero py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-2xl text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-foreground">
          Ready to modernize your mess?
        </h2>
        <div className="space-y-4">
          <Link
            href="https://wa.me/8801234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white dark:text-primary hover:text-white/80 dark:hover:text-primary/80 underline text-base md:text-lg"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
