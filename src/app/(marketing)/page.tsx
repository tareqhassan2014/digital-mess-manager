import { AudienceSplit } from "@/components/marketing/audience-split";
import { FeaturesSection } from "@/components/marketing/features-section";
import { FinalCTA } from "@/components/marketing/final-cta";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBar } from "@/components/marketing/trust-bar";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <AudienceSplit />
      <FinalCTA />
    </div>
  );
}
