export function TrustBar() {
  const colleges = [
    "BL College",
    "Dhaka College",
    "MM College",
    "Titumir College",
  ];

  return (
    <section className="bg-background py-8 md:py-12 border-y border-border">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm md:text-base text-muted-foreground mb-6">
          Optimized for students from:
        </p>

        {/* Desktop: Static Row */}
        <div className="hidden md:flex items-center justify-center gap-8">
          {colleges.map((college) => (
            <div
              key={college}
              className="text-lg font-semibold text-muted-foreground/70"
            >
              {college}
            </div>
          ))}
        </div>

        {/* Mobile: Marquee */}
        <div className="md:hidden overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-8 w-max">
            {[...Array(2)].map((_, i) =>
              colleges.map((college) => (
                <div
                  key={`${college}-${i}`}
                  className="flex-shrink-0 text-base font-semibold text-muted-foreground/70 px-4"
                >
                  {college}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
