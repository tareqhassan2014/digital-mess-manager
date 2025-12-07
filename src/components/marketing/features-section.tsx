import { History, Lock, Zap } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconBorderColor: string;
  iconColor: string;
}

function FeatureCard({
  icon,
  title,
  description,
  iconBgColor,
  iconBorderColor,
  iconColor,
}: FeatureCardProps) {
  return (
    <div className="flex-shrink-0 w-[85vw] snap-start bg-card rounded-lg p-8 shadow-lg border border-border md:w-auto">
      <div className="space-y-4">
        <div
          className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center border ${iconBorderColor}`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "One-Tap Meal Off",
      description:
        "Turning off lunch? Do it from bed. No more finding the manager.",
      iconBgColor: "bg-green-100 dark:bg-green-900/30",
      iconBorderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Manager Panic Mode",
      description:
        "Lock all meals for the next 24h instantly to fix the bazar list.",
      iconBgColor: "bg-red-100 dark:bg-red-900/30",
      iconBorderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Dispute-Free Billing",
      description:
        "We keep 5 years of history. Every meal is tracked and audit-ready.",
      iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconBorderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-subtle">
      <div className="container mx-auto">
        {/* Mobile: Horizontal Snap Carousel */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 md:hidden">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
