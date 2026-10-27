import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { WeddingData } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';

interface GallerySectionProps {
  wedding: WeddingData;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ wedding }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const fallbackImages = [
    '/images/hero_couple.jpg',
    '/images/groom.jpg',
    '/images/bride.jpg',
    '/images/landscape.jpg',
    '/images/rings.jpg',
  ];

  const galleryItems =
    wedding.gallery && wedding.gallery.length > 0
      ? wedding.gallery.map((g) => g.url)
      : fallbackImages;

  return (
    <section className="relative py-16 px-4 text-center max-w-[460px] mx-auto space-y-8 overflow-hidden">
      {/* Title */}
      <div className="space-y-2">
        <ScrollReveal animation="fade-down" delay={100} duration={1200}>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold">
            Galeri Foto
          </div>
          <h2 className="text-[36px] sm:text-[42px] text-[#3A302B] font-serif font-normal leading-tight mt-1">
            Our Moment
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={250} duration={1200}>
          <p className="text-[13px] sm:text-[14px] text-[#70635C] italic font-serif">
            "A moment is better when shared with you."
          </p>
        </ScrollReveal>
      </div>

      {/* Grid of photos with slow staggered scroll reveal */}
      <div className="grid grid-cols-2 gap-3">
        {galleryItems.map((src, idx) => (
          <ScrollReveal
            key={src + idx}
            animation="zoom-in"
            delay={100 + (idx % 2) * 150}
            duration={1200}
            className={idx === 0 ? 'col-span-2' : 'col-span-1'}
          >
            <div
              onClick={() => setActiveIdx(idx)}
              className={`group relative overflow-hidden rounded-2xl bg-stone-100 cursor-pointer shadow-md hover:shadow-xl transition-all border border-[#E8D8BD]/70 ${
                idx === 0 ? 'h-64 sm:h-76' : 'h-44 sm:h-52'
              }`}
            >
              <img
                src={src}
                alt={`Moment ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-2 rounded-full bg-white/80 text-[#3A302B] shadow-md">
                  <Maximize2 className="w-4 h-4 text-[#B89B63]" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveIdx(null)}
        >
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx((prev) =>
                prev === null || prev === 0 ? galleryItems.length - 1 : prev - 1
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={galleryItems[activeIdx]}
            alt="Preview"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx((prev) =>
                prev === null || prev === galleryItems.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
