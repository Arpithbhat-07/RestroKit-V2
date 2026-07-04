import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle, CalendarCheck } from "lucide-react";
import { useRestaurant } from "@/hooks/useSiteData";

export default function FloatingActions() {
  const [show, setShow] = useState(false);
  const { data } = useRestaurant();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goReserve = () => document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth" });
  const whatsappLink = data?.social?.whatsapp || "#";

  return (
    <>
      <a href={whatsappLink} target="_blank" rel="noreferrer" data-testid="whatsapp-float" aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full grid place-items-center bg-[#25D366] text-white shadow-2xl shadow-black/20 hover:scale-110 transition-transform">
        <MessageCircle size={22} />
      </a>

      <AnimatePresence>
        {show && (
          <motion.button key="top" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            onClick={scrollTop} data-testid="back-to-top" aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full grid place-items-center bg-brand-ink text-white shadow-2xl hover:bg-brand-primary transition-colors">
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <button onClick={goReserve} data-testid="mobile-reserve-float"
        className="md:hidden fixed bottom-6 right-24 z-40 h-12 px-5 rounded-full bg-brand-primary text-white shadow-2xl text-sm font-medium tracking-wide inline-flex items-center gap-2">
        <CalendarCheck size={16} /> Reserve
      </button>
    </>
  );
}
