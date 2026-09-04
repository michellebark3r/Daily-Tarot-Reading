import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_TAROT_CARDS } from '../data/tarotCards';
import { TarotCard, SuitType, ElementType, ArcanaType } from '../types';
import { TarotCardVisual } from './TarotCardVisual';
import {
  Search,
  BookOpen,
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Compass,
  Briefcase,
  Heart,
  X,
  Info,
} from 'lucide-react';

export const GrimoireCompendium: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [modalReversed, setModalReversed] = useState(false);

  // Filter cards
  const filteredCards = ALL_TAROT_CARDS.filter((card) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = card.name.toLowerCase().includes(q);
      const matchTitle = card.esotericTitle.toLowerCase().includes(q);
      const matchKeywords = card.uprightKeywords.some((k) => k.toLowerCase().includes(q));
      const matchSummary = card.summary.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchKeywords && !matchSummary) {
        return false;
      }
    }

    // Category
    if (selectedCategory === 'major' && card.arcana !== 'major') return false;
    if (selectedCategory === 'wands' && card.suit !== 'wands') return false;
    if (selectedCategory === 'cups' && card.suit !== 'cups') return false;
    if (selectedCategory === 'swords' && card.suit !== 'swords') return false;
    if (selectedCategory === 'pentacles' && card.suit !== 'pentacles') return false;

    // Element
    if (selectedElement !== 'all' && card.element !== selectedElement) return false;

    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Grimoire Title Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200">
          <BookOpen className="w-6 h-6 text-amber-300" />
        </div>
        <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-zinc-100">
          Tarot Grimoire & Compendium
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed">
          The complete 78-card esoteric encyclopedia. Study archetypes, decode hidden symbology, and deepen your intuitive mastery.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0c0c0f] p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            id="grimoire-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search card name, archetype, keyword (e.g. 'Intuition', 'The Star', 'Rebirth')..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-xs md:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { id: 'all', label: 'All 78 Cards' },
            { id: 'major', label: 'Major Arcana (22)' },
            { id: 'wands', label: 'Wands (Fire)' },
            { id: 'cups', label: 'Cups (Water)' },
            { id: 'swords', label: 'Swords (Air)' },
            { id: 'pentacles', label: 'Pentacles (Earth)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#181820] border-amber-500/30 text-amber-200 shadow-sm'
                  : 'bg-[#08080a] border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCards.map((card) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            onClick={() => {
              setSelectedCard(card);
              setModalReversed(false);
            }}
            className="cursor-pointer flex flex-col items-center group"
          >
            <TarotCardVisual
              card={card}
              size="sm"
              showDetails={false}
              className="w-full aspect-[2/3] h-auto shadow-md group-hover:border-amber-400/40 transition-colors"
            />
            <span className="font-cinzel text-xs text-zinc-200 group-hover:text-amber-200 font-bold mt-2 text-center line-clamp-1 transition-colors">
              {card.name}
            </span>
            <span className="text-[10px] text-zinc-500 font-sans capitalize">
              {card.arcana === 'major' ? 'Major Arcana' : card.suit}
            </span>
          </motion.div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <p>No cards found matching your query.</p>
        </div>
      )}

      {/* Detailed Card Study Modal */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-[#0c0c0f] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Close Button */}
              <button
                id="grimoire-modal-close-btn"
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-[#08080a] border border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Top Header */}
              <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/5 pb-6">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <TarotCardVisual
                    card={selectedCard}
                    isReversed={modalReversed}
                    size="md"
                    className="shadow-2xl"
                  />
                  <button
                    onClick={() => setModalReversed(!modalReversed)}
                    className="px-3 py-1 rounded-full bg-[#08080a] border border-white/10 text-xs text-amber-200 hover:bg-[#181820] transition-colors"
                  >
                    Flip: {modalReversed ? 'Reversed' : 'Upright'}
                  </button>
                </div>

                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-200 border border-amber-500/25">
                      {selectedCard.arcana === 'major' ? 'Major Arcana' : `Suit of ${selectedCard.suit}`}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#08080a] text-zinc-400 border border-white/5">
                      Element: {selectedCard.element}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#08080a] text-zinc-400 border border-white/5">
                      {selectedCard.astrologicalCorrespondence}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-zinc-100">
                    {selectedCard.name}
                  </h3>
                  <p className="text-xs text-amber-200/90 italic font-cinzel">
                    {selectedCard.esotericTitle}
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {selectedCard.summary}
                  </p>
                </div>
              </div>

              {/* Meanings & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upright */}
                <div className={`p-4 rounded-xl border transition-all ${!modalReversed ? 'bg-[#121217] border-amber-500/30' : 'bg-[#08080a] border-white/5'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Upright Meaning
                  </h4>
                  <p className="text-xs md:text-sm text-zinc-200 leading-relaxed mb-3">
                    {selectedCard.uprightMeaning}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCard.uprightKeywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#08080a] text-[10px] text-amber-200 border border-amber-500/20">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reversed */}
                <div className={`p-4 rounded-xl border transition-all ${modalReversed ? 'bg-[#121217] border-amber-500/30' : 'bg-[#08080a] border-white/5'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Reversed Meaning
                  </h4>
                  <p className="text-xs md:text-sm text-zinc-200 leading-relaxed mb-3">
                    {selectedCard.reversedMeaning}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCard.reversedKeywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#08080a] text-[10px] text-zinc-300 border border-white/5">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Symbolism Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sacred Symbolism Decoded</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCard.symbolism.map((sym, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#08080a] border border-white/5">
                      <span className="font-cinzel text-xs font-bold text-amber-200 block mb-1">
                        ✦ {sym.symbol}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {sym.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Life Spheres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#08080a] border border-white/5">
                  <span className="text-[11px] font-bold text-amber-200 flex items-center gap-1 mb-1 font-cinzel">
                    <Briefcase className="w-3.5 h-3.5" /> Work & Career
                  </span>
                  <p className="text-xs text-zinc-400">{selectedCard.lifeSpheres.career}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#08080a] border border-white/5">
                  <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1 mb-1 font-cinzel">
                    <Heart className="w-3.5 h-3.5" /> Love & Relationships
                  </span>
                  <p className="text-xs text-zinc-400">{selectedCard.lifeSpheres.love}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
