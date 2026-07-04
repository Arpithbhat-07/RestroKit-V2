import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useMenu } from "@/hooks/useSiteData";

export default function MenuSection() {
  const { data: menuItems, loading } = useMenu();

  const categories = useMemo(() => {
    if (!menuItems) return [];
    return [...new Set(menuItems.filter((m) => m.available !== false).map((m) => m.category || m.cat))];
  }, [menuItems]);

  const [cat, setCat] = useState(null);
  const activeCat = cat || categories[0];

  const items = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((m) => (m.category || m.cat) === activeCat && m.available !== false);
  }, [menuItems, activeCat]);

  const groupedItems = useMemo(() => {
    const groups = new Map();
    const useCategoryLabel = ["Desserts", "Drinks"].includes(activeCat);
    items.forEach((item) => {
      const normalizedDiet = item.diet?.toLowerCase();
      const groupKey = item.section?.toLowerCase() ?? (useCategoryLabel ? activeCat.toLowerCase() : normalizedDiet ?? "other");
      const label = item.section ?? (useCategoryLabel ? activeCat : normalizedDiet === "veg" ? "Veg" : normalizedDiet === "nonveg" ? "Non Veg" : activeCat);
      if (!groups.has(groupKey)) groups.set(groupKey, { key: groupKey, label, list: [] });
      groups.get(groupKey).list.push(item);
    });
    const order = ["veg", "nonveg"];
    return Array.from(groups.values()).sort((a, b) => {
      const ai = order.indexOf(a.key), bi = order.indexOf(b.key);
      if (ai !== -1 || bi !== -1) return ai - bi;
      return 0;
    });
  }, [items, activeCat]);

  const renderDishList = (list) => (
    <div className="rounded-3xl border border-border bg-background/80 p-6">
      <div className="space-y-4">
        {list.map((item) => (
          <div key={item.id || item.name} className="border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                {item.core && <p className="text-sm text-muted-foreground mt-1">{item.core}</p>}
              </div>
              <span className="text-brand-primary font-semibold">₹{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderImageGrid = (list) => (
    <div className="grid grid-cols-2 gap-4">
      {list.slice(0, 5).map((dish) => (
        <div key={dish.id || dish.name} className="aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
          <img src={dish.img} alt={dish.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
      ))}
    </div>
  );

  const renderSplitSection = (title, list, reverse) => (
    <div className="space-y-6">
      <div className="text-center uppercase tracking-[0.35em] text-sm font-semibold text-muted-foreground">{title}</div>
      <div className={`grid gap-8 rounded-[2rem] border border-border bg-card p-6 md:p-8 ${reverse ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
        {reverse ? renderDishList(list) : renderImageGrid(list)}
        {reverse ? renderImageGrid(list) : renderDishList(list)}
      </div>
    </div>
  );

  if (loading || !menuItems) return null;

  return (
    <section id="menu" data-testid="menu-section" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading overline="Our Menu" title="Authentic Coastal Delicacies"
          subtitle="Prepared fresh with traditional recipes and the finest local ingredients." />
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3 mb-12" data-testid="menu-categories">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                data-testid={`menu-cat-${c.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
                  activeCat === c ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "border border-border hover:border-brand-primary hover:text-brand-primary"
                }`}>{c}</button>
            ))}
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.div key={activeCat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-12">
            <div className="space-y-10">
              {groupedItems.map((group, index) => (
                <div key={group.key}>{renderSplitSection(group.label, group.list, index % 2 === 1)}</div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
