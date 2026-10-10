"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Buka penuh langsung kalau halaman dibuka dengan anchor (#faq dll) atau pengguna memilih kurangi animasi.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.location.hash && !reduce) return;
    const id = requestAnimationFrame(() => {
      setScrollProgress(1);
      setShowContent(true);
      setMediaFullyExpanded(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    // Pengguna keyboard (Page Down, panah, spasi, End) langsung dibuka penuh,
    // supaya tidak terkunci di atas halaman.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mediaFullyExpanded) return;
      const keys = ["ArrowDown", "PageDown", " ", "Spacebar", "End"];
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (keys.includes(e.key)) {
        setScrollProgress(1);
        setMediaFullyExpanded(true);
        setShowContent(true);
      }
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileState(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 480 + scrollProgress * (isMobileState ? 470 : 1070);
  const mediaHeight = 270 + scrollProgress * (isMobileState ? 330 : 530);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div
      ref={sectionRef}
      className="overflow-x-hidden transition-colors duration-700 ease-in-out"
    >
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt=""
              width={1920}
              height={960}
              className="animate-hero-zoom h-screen w-screen"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
            <div className="absolute inset-0 bg-black/70" />
          </motion.div>

          <div className="container relative z-10 mx-auto flex flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              <div
                className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={mediaSrc}
                    alt={title || "barumahID"}
                    width={1280}
                    height={720}
                    className="h-full w-full rounded-2xl object-cover"
                    style={{ objectPosition: "center center" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-black/40"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                <div className="relative z-10 mt-4 flex flex-col items-center text-center transition-none">
                  {date && (
                    <p
                      className="text-[15px] font-bold tracking-wide text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] md:text-base"
                      style={{
                        transform: `translateX(-${textTranslateX}vw)`,
                      }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && scrollToExpand.length > 0 && (
                    <p
                      className="mt-2 text-center text-sm font-medium text-white/60"
                      style={{
                        transform: `translateX(${textTranslateX}vw)`,
                      }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`relative z-10 flex w-full flex-col items-center justify-center gap-4 text-center transition-none ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                <motion.h1
                  className="text-5xl font-black leading-tight tracking-tight text-white transition-none md:text-6xl lg:text-7xl"
                  style={{
                    transform: `translateX(-${textTranslateX}vw)`,
                  }}
                >
                  {firstWord}
                </motion.h1>
                {restOfTitle && (
                  <motion.h1
                    className="text-center text-5xl font-black leading-tight tracking-tight text-white transition-none md:text-6xl lg:text-7xl"
                    style={{
                      transform: `translateX(${textTranslateX}vw)`,
                    }}
                  >
                    {restOfTitle}
                  </motion.h1>
                )}
              </div>
            </div>

            <motion.section
              className="flex w-full flex-col p-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
