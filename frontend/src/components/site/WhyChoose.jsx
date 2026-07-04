import React from "react";
import * as Lucide from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { site } from "@/data/site";

export default function WhyChoose() {
  return (
    <section id="why" data-testid="why-section" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          overline="Why Choose Us"
          title="Experience the taste of Coastal Karnataka."
          subtitle="Every dish is crafted using authentic recipes, fresh ingredients, and the rich flavours that make Mangalorean cuisine truly unforgettable."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {site.whyChoose.map((f, i) => {
            const Icon = Lucide[f.icon] || Lucide.Sparkles;
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div
                  data-testid={`why-card-${i}`}
                  className="group h-full rounded-2xl border border-border bg-card p-8 hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="h-12 w-12 rounded-xl grid place-items-center bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-2xl mt-6">{f.title}</h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
