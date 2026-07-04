import React from "react";
import Reveal from "./Reveal";

export default function SectionHeading({ overline, title, subtitle, align = "center" }) {
  const alignCls = align === "left" ? "text-left items-start" : "text-center items-center";
  return (
    <Reveal className={`flex flex-col ${alignCls} gap-4 mb-14 md:mb-20`}>
      {overline && (
        <span className="overline text-brand-primary flex items-center gap-3">
          <span className="h-px w-8 bg-brand-primary" />
          {overline}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] max-w-3xl text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
