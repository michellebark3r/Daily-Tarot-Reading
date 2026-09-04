import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCard, DailyReading } from '../types';
import { getRandomDailyCard } from '../data/tarotCards';
import { TarotCardVisual } from './TarotCardVisual';
import { playShuffleSound, playFlipSound, playCelebrationSound } from '../utils/audio';
import { saveDailyReading, getTodayDateString } from '../utils/storage';
import { Sparkles, Shuffle, Moon, Feather, Check, ArrowRight, Heart, Tag, BookOpen, Volume2, HelpCircle } from 'lucide-react';

interface DailyDrawRitualProps {
  allowReversals: boolean;
  soundEnabled: boolean;
  onReadingCompleted: (reading: DailyReading) => void;
}

const MOODS = [
  { id: 'peaceful', label: 'Peaceful', icon: '🌿' },
  { id: 'inspired', label: 'Inspired', icon: '✨' },
  { id: 'focused', label: 'Focused', icon: '🎯' },
  { id: 'reflective', label: 'Reflective', icon: '🌊' },
  { id: 'seeking', label: 'Seeking Clarity', icon: '🔍' },
  { id: 'anxious', label: 'Anxious', icon: '🌪️' },
  { id: 'grateful', label: 'Grateful', icon: '🙏' },
];

const COMMON_TAGS = ['DailyMindfulness', 'Career', 'Love', 'InnerGrowth', 'Decision', 'Creativity', 'Health'];

export const DailyDrawRitual: React.FC<DailyDrawRitualProps> = ({
  allowReversals,
  soundEnabled,
  onReadingCompleted,
}) => {
  const [step, setStep] = useState<'intention' | 'select' | 'reveal' | 'journal'>('intention');
  const [intention, setIntention] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mood, setMood] = useState('inspired');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['DailyMindfulness']);
  const [customTag, setCustomTag] = useState('');

  // Handle deck shuffle animation
  const handleShuffle = () => {
    setIsShuffling(true);
    playShuffleSound(soundEnabled);
    setTimeout(() => {
      setIsShuffling(false);
    }, 800);
  };

  // User selects a card from the fan
  const handleCardPick = () => {
    if (selectedCardData) return;
    const cardData = getRandomDailyCard(allowReversals);
    setSelectedCardData(cardData);
    setStep('reveal');
    playShuffleSound(soundEnabled);

    // Auto flip after a brief moment
    setTimeout(() => {
      setIsFlipped(true);
      playFlipSound(soundEnabled);
      setTimeout(() => {
        playCelebrationSound(soundEnabled);
      }, 400);
    }, 600);
  };

  // Toggle tag
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim().replace(/^#/, '')]);
      setCustomTag('');
    }
  };

  // Save the complete daily reading to journal
  const handleSaveToJournal = () => {
    if (!selectedCardData) return;

    const newReading: DailyReading = {
      id: `reading_${Date.now()}`,
      date: getTodayDateString(),
      timestamp: Date.now(),
      cardId: selectedCardData.card.id,
      isReversed: selectedCardData.isReversed,
      intention: intention.trim() || undefined,
      userNotes: notes.trim() || undefined,
      mood: mood,
      tags: selectedTags,
      bookmarked: false,
    };

    saveDailyReading(newReading);
    onReadingCompleted(newReading);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Step 1: Intention & Mindful Centering */}
      {step === 'intention' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 shadow-lg shadow-black/60">
            <Moon className="w-8 h-8 animate-pulse text-amber-200" />
          </div>

          <div className="space-y-2">
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-zinc-100 tracking-wide">
              Today's Sacred Tarot Ritual
            </h2>
            <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
              Take a slow, grounding breath. Align with your inner center and hold the space for what wisdom you seek today.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-[#0c0c0f] p-6 rounded-2xl border border-amber-500/20 shadow-xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-amber-200/90 uppercase tracking-widest flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-amber-300" />
                <span>Today's Guiding Intention (Optional)</span>
              </label>
            </div>
            <textarea
              id="ritual-intention-input"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g. What mindset should I embody during my meeting today? Or: Grant me clarity on my personal boundaries..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all resize-none"
            />
            
            {/* Quick Oracle Prompt Suggestions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Quick Oracle Prompts</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What energy should I embody today?',
                  'Where is my focus most needed?',
                  'What hidden strength can I call on?',
                  'What lesson is ready to unfold?',
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setIntention(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#121217] border border-white/5 text-zinc-400 hover:text-amber-200 hover:border-amber-500/30 transition-colors text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 italic pt-1 border-t border-white/5">
              ✦ Remember: You receive one sacred card per calendar day.
            </p>
          </div>

          <button
            id="ritual-proceed-to-draw-btn"
            onClick={() => setStep('select')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-[#08080a] font-bold font-cinzel tracking-wider text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 mx-auto"
          >
            <span>Enter the Sacred Arc</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Step 2: Interactive Card Fan / Deck Selection */}
      {step === 'select' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-center space-y-6"
        >
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">Step 2 of 3</span>
            <h3 className="font-cinzel text-xl md:text-2xl font-bold text-zinc-100">
              Select Your Card of the Day
            </h3>
            <p className="text-xs md:text-sm text-zinc-400">
              Allow your intuition to guide your hand. Tap any card in the arc when you feel the pull.
            </p>
          </div>

          {/* Shuffle Deck Action */}
          <div className="flex justify-center">
            <button
              id="ritual-shuffle-deck-btn"
              onClick={handleShuffle}
              disabled={isShuffling}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0c0c0f] border border-amber-500/25 text-amber-200 text-xs font-medium hover:bg-[#16161c] transition-colors shadow-sm"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
              <span>{isShuffling ? 'Shuffling Sacred Deck...' : 'Shuffle Deck'}</span>
            </button>
          </div>

          {/* Interactive Card Arc / Fan */}
          <div className="relative py-12 px-4 flex items-center justify-center min-h-[300px] overflow-hidden">
            <div className="relative flex items-center justify-center">
              {[...Array(9)].map((_, i) => {
                const rotation = (i - 4) * 6; // -24deg to +24deg
                const xOffset = (i - 4) * 28;
                const yOffset = Math.abs(i - 4) * 6;

                return (
                  <motion.div
                    key={i}
                    onClick={handleCardPick}
                    animate={{
                      rotate: isShuffling ? (Math.random() - 0.5) * 30 : rotation,
                      x: isShuffling ? (Math.random() - 0.5) * 60 : xOffset,
                      y: isShuffling ? (Math.random() - 0.5) * 20 : yOffset,
                    }}
                    whileHover={{
                      y: yOffset - 30,
                      scale: 1.08,
                      zIndex: 30,
                      transition: { duration: 0.15 },
                    }}
                    className="absolute cursor-pointer transition-shadow"
                    style={{ zIndex: 10 + i }}
                  >
                    <TarotCardVisual isFaceDown size="md" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-amber-300/80 italic animate-pulse">
            ✦ Tap any card in the deck to reveal your daily message
          </p>
        </motion.div>
      )}

      {/* Step 3: Card Reveal & Educational Breakdown */}
      {step === 'reveal' && selectedCardData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">Divine Revelation</span>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-zinc-100">
              {selectedCardData.card.name}
            </h2>
            <p className="text-xs text-amber-200/80 font-serif italic">
              {selectedCardData.isReversed ? 'Reversed Orientation' : 'Upright Orientation'} • {selectedCardData.card.element} Element
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 3D Card Animation Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, rotateY: 180 }}
                animate={{ scale: 1, rotateY: isFlipped ? 0 : 180 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="transform-style-3d perspective-1000 shadow-2xl rounded-2xl"
              >
                <TarotCardVisual
                  card={selectedCardData.card}
                  isReversed={selectedCardData.isReversed}
                  size="xl"
                />
              </motion.div>
            </div>

            {/* Educational Breakdown & Lore */}
            <div className="lg:col-span-7 space-y-5 bg-[#0c0c0f] p-6 rounded-2xl border border-amber-500/20 shadow-xl">
              {/* Core Meaning */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Archetypal Wisdom</span>
                </h4>
                <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-sans">
                  {selectedCardData.isReversed
                    ? selectedCardData.card.reversedMeaning
                    : selectedCardData.card.uprightMeaning}
                </p>
              </div>

              {/* Keywords */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                  Key Resonance
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCardData.isReversed
                    ? selectedCardData.card.reversedKeywords
                    : selectedCardData.card.uprightKeywords
                  ).map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs bg-amber-500/10 border border-amber-500/25 text-amber-200/90 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Daily Affirmation */}
              <div className="p-4 rounded-xl bg-[#121217] border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                  Daily Affirmation
                </span>
                <p className="font-serif italic text-amber-100 text-sm md:text-base mt-1">
                  "{selectedCardData.card.affirmation}"
                </p>
              </div>

              {/* Contemplation */}
              <div className="p-4 rounded-xl bg-[#121217] border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  Daily Contemplation Question
                </span>
                <p className="text-zinc-300 text-xs md:text-sm mt-1">
                  {selectedCardData.card.dailyContemplation}
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="ritual-proceed-to-journal-btn"
                  onClick={() => setStep('journal')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-[#08080a] font-bold font-cinzel tracking-wider text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Record in Daily Journal</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 4: Record in Private Daily Journal */}
      {step === 'journal' && selectedCardData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-[#0c0c0f] p-6 md:p-8 rounded-2xl border border-amber-500/30 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Private Sanctuary Log
              </span>
              <h3 className="font-cinzel text-xl font-bold text-zinc-100">
                Journal Your Daily Reflection
              </h3>
            </div>
            <div className="text-right">
              <span className="font-cinzel text-sm text-amber-200">{selectedCardData.card.name}</span>
              <p className="text-[11px] text-zinc-500">
                {selectedCardData.isReversed ? 'Reversed' : 'Upright'}
              </p>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Your Current Energy / Mood</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    mood === m.label
                      ? 'bg-amber-500/15 border-amber-400/50 text-amber-200 shadow-sm'
                      : 'bg-[#08080a] border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/10'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="truncate">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Journal Reflection Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-300" />
              <span>Personal Reflection & Insights</span>
            </label>
            <textarea
              id="ritual-journal-reflection-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What thoughts, intuitive nudges, or everyday connections come to mind with this card? Write freely in your private space..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-[#08080a] border border-white/10 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all resize-y"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <span>Theme Tags</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                        : 'bg-[#08080a] border-white/5 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <form onSubmit={handleAddCustomTag} className="flex gap-2 pt-1">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add custom tag..."
                className="px-3 py-1.5 rounded-lg bg-[#08080a] border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#181820] hover:bg-[#20202a] text-xs text-zinc-300 font-medium"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Save Action */}
          <div className="pt-4 border-t border-white/5 flex gap-3">
            <button
              id="ritual-save-reading-btn"
              onClick={handleSaveToJournal}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-[#08080a] font-bold font-cinzel tracking-wider text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Complete Ritual & Save Reading</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
