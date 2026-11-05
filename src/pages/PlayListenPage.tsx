import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Play, Music, Sparkles, Search } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { getFreshJoke, getFreshByGenre, getMoodAppropriateContent, SMILE_GENRES, type SmileGenre } from '../services/smileHubService';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { useAuth } from '../context/AuthContext';
import { getRandomJokeForMood, type Joke } from '../services/jokeService';
import { getNextGame, GAME_LIBRARY, type Game } from '../services/gameService';
import { TINY_CHALLENGES, getRandomChallenge } from '../services/moodRecommendationService';
import {
  normalizeLanguage, detectBrowserLanguage, ALL_LANGUAGES, LANGUAGE_LABELS,
  USER_MOOD_TO_MUSIC,
  type CanonicalLanguage, type MusicMood, type MusicCategory as MCat, type MusicGenre as MGenre, type Decade, type MusicTrack,
} from '../services/musicCatalog';
import { getMusicRecommendations, getWhyThis } from '../services/musicRecommendationEngine';
import { searchMusic as searchTracks } from '../services/musicSearchService';
import { FullMusicPlayer } from '../components/music/FullMusicPlayer';

const COSMIC_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

type Section = 'home' | 'games' | 'music' | 'jokes' | 'challenges' | 'smile';
type ActiveGame = 'bubble-pop' | 'memory-match' | 'reaction-game' | 'word-scramble' | 'emoji-guess' | 'color-match' | 'find-star' | 'sequence-memory' | 'odd-one-out' | 'quick-trivia' | null;
type MusicSubTab = 'for-you' | 'new-releases' | 'dj-remix' | 'old-classics' | 'by-language' | 'by-mood' | 'genres';
const DISC_TABS = [
  { id: 'for-you' as MusicSubTab, label: 'For You', emoji: '✨' },
  { id: 'new-releases' as MusicSubTab, label: 'New Releases', emoji: '🆕' },
  { id: 'dj-remix' as MusicSubTab, label: 'DJ & Remixes', emoji: '🎧' },
  { id: 'old-classics' as MusicSubTab, label: 'Old Classics', emoji: '🏛️' },
  { id: 'by-language' as MusicSubTab, label: 'By Language', emoji: '🌐' },
  { id: 'by-mood' as MusicSubTab, label: 'By Mood', emoji: '🎭' },
  { id: 'genres' as MusicSubTab, label: 'Genres', emoji: '🎵' },
];

export default function PlayListenPage() {
  const { user } = useAuth();
  const [section, setSection] = useState<Section>('home');
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [language, setLanguage] = useState<CanonicalLanguage>(() => {
    const stored = localStorage.getItem('mc_music_language');
    if (stored) return normalizeLanguage(stored);
    return detectBrowserLanguage() || 'English';
  });
  const [mood, setMood] = useState(() => localStorage.getItem('mc_current_mood') || 'okay');
  const [showLangPrompt, setShowLangPrompt] = useState(false);

  const userId = user?.uid || 'demo-user';

  useEffect(() => {
    const hasSeenLangPrompt = localStorage.getItem('mc_lang_prompt_seen');
    if (!hasSeenLangPrompt) {
      const detected = detectBrowserLanguage();
      if (detected && detected !== 'English') {
        setShowLangPrompt(true);
      }
      localStorage.setItem('mc_lang_prompt_seen', 'true');
    }
  }, []);

  const handleLanguageChange = (lang: CanonicalLanguage) => {
    setLanguage(lang);
    localStorage.setItem('mc_music_language', lang);
  };

  const handleBack = () => {
    if (activeGame) { setActiveGame(null); return; }
    if (section !== 'home') { setSection('home'); return; }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageVideoBackground videoUrl={COSMIC_VIDEO} overlay={0.3} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(155,145,201,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(157,217,208,0.06) 0%, transparent 50%)',
        zIndex: 1,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {(section !== 'home' || activeGame) && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleBack} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </motion.button>
        )}

        <AnimatePresence>
          {showLangPrompt && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="rounded-2xl p-6 max-w-sm w-full" style={{ background: 'rgba(10,14,24,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="text-center mb-4">
                  <Music className="w-8 h-8 text-lavender mx-auto mb-3" />
                  <h3 className="text-white text-lg font-medium mb-1">Music Preference</h3>
                  <p className="text-white/50 text-sm">We think you may prefer {LANGUAGE_LABELS[detectBrowserLanguage() || 'English']} music.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { handleLanguageChange(detectBrowserLanguage() || 'English'); setShowLangPrompt(false); }}
                    className="flex-1 py-2.5 text-sm rounded-full" style={{ background: 'rgba(155,191,169,0.15)', border: '1px solid rgba(155,191,169,0.2)', color: '#9BBFA9' }}>
                    Use {LANGUAGE_LABELS[detectBrowserLanguage() || 'English']}
                  </button>
                  <button onClick={() => setShowLangPrompt(false)} className="flex-1 py-2.5 text-sm rounded-full text-white/50" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Choose another
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeGame === 'bubble-pop' && <BubblePopGame key="bubble" onComplete={() => setActiveGame(null)} />}
          {activeGame === 'memory-match' && <MemoryMatchGame key="memory" onComplete={() => setActiveGame(null)} />}
          {activeGame === 'reaction-game' && <ReactionGame key="reaction" onComplete={() => setActiveGame(null)} />}
          {activeGame === 'word-scramble' && <WordScrambleGame key="word" onComplete={() => setActiveGame(null)} />}
          {activeGame === 'emoji-guess' && <EmojiGuessGame key="emoji" onComplete={() => setActiveGame(null)} />}
          {activeGame === 'quick-trivia' && <QuickTriviaGame key="trivia" onComplete={() => setActiveGame(null)} />}
          {activeGame === 'odd-one-out' && <OddOneOutGame key="odd" onComplete={() => setActiveGame(null)} />}
          {activeGame === 'find-star' && <FindStarGame key="star" onComplete={() => setActiveGame(null)} />}

          {!activeGame && section === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center pt-8">
                <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight mb-3" style={{ textShadow: '0 2px 30px rgba(155,145,201,0.3)' }}>Take a little break.</h1>
                <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto">Play something. Hear something. Smile a little.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🎮', title: 'Games', desc: 'Quick fun breaks', action: () => setSection('games'), color: 'rgba(155,145,201,0.08)' },
                  { icon: '🎵', title: 'Music', desc: 'Choose your atmosphere', action: () => setSection('music'), color: 'rgba(157,217,208,0.08)' },
                  { icon: '😂', title: 'Jokes', desc: 'Something to smile about', action: () => setSection('jokes'), color: 'rgba(232,184,168,0.08)' },
                  { icon: '😊', title: 'Smile Hub', desc: 'Jokes, flirty lines & more', action: () => setSection('smile'), color: 'rgba(232,130,180,0.08)' },
                  { icon: '✨', title: 'Tiny Challenges', desc: 'Quick mindful activities', action: () => setSection('challenges'), color: 'rgba(232,220,200,0.08)' },
                ].map((item, i) => (
                  <motion.button key={item.title} onClick={item.action} className="liquid-glass rounded-2xl p-6 text-left group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5, scale: 1.02 }}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h3 className="text-white font-medium text-lg">{item.title}</h3>
                        <p className="text-white/40 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {!activeGame && section === 'games' && (
            <motion.div key="games" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="font-serif text-2xl md:text-3xl text-white">Choose a game</h2>
              <p className="text-white/40 text-sm">Personalized for your mood — games you haven't played recently appear first.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GAME_LIBRARY.map((game, i) => {
                  const nextGame = getNextGame(userId, mood);
                  const isRecommended = game.id === nextGame.id;
                  return (
                    <motion.button key={game.id} onClick={() => setActiveGame(game.id as ActiveGame)}
                      className={`liquid-glass rounded-2xl p-4 text-left ${isRecommended ? 'ring-1 ring-sage/30' : ''}`}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{game.icon}</span>
                        <div>
                          <h3 className="text-white font-medium text-sm">{game.title}</h3>
                          {isRecommended && <span className="text-sage text-[10px]">Recommended</span>}
                        </div>
                      </div>
                      <p className="text-white/35 text-xs">{game.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {!activeGame && section === 'music' && (
            <MusicDiscoverySection language={language} mood={mood} onLanguageChange={handleLanguageChange} />
          )}

          {!activeGame && section === 'jokes' && (
            <JokesSection userId={userId} mood={mood} />
          )}

          {!activeGame && section === 'smile' && (
            <SmileHubSection mood={mood} />
          )}

          {!activeGame && section === 'challenges' && (
            <ChallengesSection />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════ MUSIC DISCOVERY SECTION ═══════════════
function MusicDiscoverySection({ language, mood, onLanguageChange }: { language: CanonicalLanguage; mood: string; onLanguageChange: (l: CanonicalLanguage) => void }) {
  const music = useMusic();
  const [activeTab, setActiveTab] = useState<MusicSubTab>('for-you');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MusicMood | ''>('');
  const [selectedGenre, setSelectedGenre] = useState<MGenre | ''>('');
  const [selectedDecade, setSelectedDecade] = useState<Decade | ''>('');
  const [showDebug, setShowDebug] = useState(false);
  const [fullPlayerOpen, setFullPlayerOpen] = useState(false);

  const musicHistory = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('mc_music_history') || '[]').slice(0, 20); } catch { return []; }
  }, []);

  const results = useMemo(() => {
    if (searchQuery.trim()) {
      const searchResults = searchTracks(searchQuery, language, musicHistory);
      return {
        tracks: searchResults,
        debug: {
          selectedLanguage: language,
          normalizedLanguage: language,
          mood: mood,
          category: activeTab,
          genre: selectedGenre || undefined,
          candidateCount: searchResults.length,
          finalCount: searchResults.length,
          returnedLanguages: searchResults.map(t => t.language),
          hasResults: searchResults.length > 0,
        },
      };
    }

    const tabToCategory: Partial<Record<MusicSubTab, MCat>> = {
      'new-releases': 'new-releases',
      'dj-remix': 'dj-remix',
      'old-classics': 'old-classics',
      'by-language': 'by-language',
      'by-mood': 'by-mood',
      'genres': 'genres',
    };

    return getMusicRecommendations({
      language,
      mood: mood,
      category: tabToCategory[activeTab],
      genre: selectedGenre || undefined,
      userHistory: musicHistory,
    });
  }, [language, mood, activeTab, searchQuery, selectedGenre, musicHistory]);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-serif text-2xl md:text-3xl text-white">Music Discovery</h2>
          <select value={language} onChange={e => onLanguageChange(normalizeLanguage(e.target.value))}
            className="rounded-full px-4 py-2 text-sm appearance-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', backdropFilter: 'blur(12px)' }}>
            {ALL_LANGUAGES.map(l => <option key={l} value={l} className="bg-[#0B1220]">{LANGUAGE_LABELS[l]}</option>)}
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Search songs, artists, genres..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)' }} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {DISC_TABS.map(sec => (
            <button key={sec.id} onClick={() => { setActiveTab(sec.id); setSearchQuery(''); setSelectedMoodFilter(''); setSelectedGenre(''); setSelectedDecade(''); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0"
              style={{ background: activeTab === sec.id ? 'rgba(155,191,169,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeTab === sec.id ? 'rgba(155,191,169,0.3)' : 'rgba(255,255,255,0.08)'}`, color: activeTab === sec.id ? '#9BBFA9' : 'rgba(255,255,255,0.5)' }}>
              <span>{sec.emoji}</span> {sec.label}
            </button>
          ))}
        </div>

        {activeTab === 'old-classics' && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {(['60s','70s','80s','90s','2000s','2010s'] as Decade[]).map(d => (
              <button key={d} onClick={() => setSelectedDecade(selectedDecade === d ? '' : d)}
                className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all"
                style={{ background: selectedDecade === d ? 'rgba(232,130,180,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedDecade === d ? 'rgba(232,130,180,0.25)' : 'rgba(255,255,255,0.06)'}`, color: selectedDecade === d ? '#E882B4' : 'rgba(255,255,255,0.35)' }}>
                {d}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'by-mood' && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {([['calm','🧘'],['focus','🎯'],['relax','🍃'],['feel-good','☀️'],['energy','⚡'],['dance','💃'],['sleep','😴'],['motivation','💪']] as const).map(([moodVal, emoji]) => (
              <button key={moodVal} onClick={() => setSelectedMoodFilter(selectedMoodFilter === moodVal ? '' : moodVal as MusicMood)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all"
                style={{ background: selectedMoodFilter === moodVal ? 'rgba(97,175,239,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedMoodFilter === moodVal ? 'rgba(97,175,239,0.25)' : 'rgba(255,255,255,0.06)'}`, color: selectedMoodFilter === moodVal ? '#61AFEF' : 'rgba(255,255,255,0.35)' }}>
                {emoji} {moodVal}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'genres' && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {([['pop','🎤'],['lofi','🎧'],['edm','🔊'],['classical','🎻'],['acoustic','🎸'],['indie','🌟'],['hip-hop','🎤'],['jazz','🎷'],['rock','🎸'],['r&b','💜'],['folk','🪕'],['ambient','🌌']] as [MGenre, string][]).map(([genre, emoji]) => (
              <button key={genre} onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all"
                style={{ background: selectedGenre === genre ? 'rgba(198,120,221,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedGenre === genre ? 'rgba(198,120,221,0.25)' : 'rgba(255,255,255,0.06)'}`, color: selectedGenre === genre ? '#C678DD' : 'rgba(255,255,255,0.35)' }}>
                {emoji} {genre}
              </button>
            ))}
          </div>
        )}


        {import.meta.env.DEV && (
          <button onClick={() => setShowDebug(!showDebug)} className="text-white/15 text-[10px] hover:text-white/30">
            {showDebug ? 'Hide' : 'Show'} Debug
          </button>
        )}
        {showDebug && import.meta.env.DEV && (
          <div className="rounded-xl p-3 text-[10px] text-white/30 space-y-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p>Language: {results.debug.selectedLanguage}</p>
            <p>Mood: {results.debug.mood || '(none)'} | Category: {results.debug.category || '(none)'}</p>
            <p>Candidates: {results.debug.candidateCount} | Returned: {results.debug.finalCount}</p>
            <p>Languages: [{results.debug.returnedLanguages.join(', ')}]</p>
          </div>
        )}

        <p className="text-white/30 text-sm">{results.tracks.length} track{results.tracks.length !== 1 ? 's' : ''} found</p>

        <div className="space-y-4">
          {results.tracks.map((track, i) => (
            <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{track.coverEmoji}</span>
                    <div>
                      <h3 className="text-white font-medium text-sm md:text-base">{track.title}</h3>
                      <p className="text-white/40 text-xs md:text-sm">{track.artist} — {track.album}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      music.playTrack(track as any, results.tracks as any);
                      setFullPlayerOpen(true);
                    }}
                    disabled={(track.playbackType as string) === 'unavailable'}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm transition-all hover:scale-105 flex-shrink-0"
                    style={{
                      background: (track.playbackType as string) === 'unavailable' ? 'rgba(255,255,255,0.05)' : 'rgba(155,191,169,0.2)',
                      color: (track.playbackType as string) === 'unavailable' ? 'rgba(255,255,255,0.25)' : '#9BBFA9',
                      border: `1px solid ${(track.playbackType as string) === 'unavailable' ? 'rgba(255,255,255,0.05)' : 'rgba(155,191,169,0.25)'}`,
                    }}>
                    <Play className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {(track.playbackType as string) === 'unavailable' ? 'Unavailable' : track.playbackType === 'embed' ? 'Open Player' : 'Play'}
                    </span>
                  </button>
                </div>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(155,191,169,0.1)', color: 'rgba(155,191,169,0.7)' }}>{track.language}</span>
                  {track.mood.map(m => (
                    <span key={m} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(97,175,239,0.1)', color: 'rgba(97,175,239,0.7)' }}>{m}</span>
                  ))}
                  <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(232,130,180,0.1)', color: 'rgba(232,130,180,0.7)' }}>{track.genre}</span>
                </div>
                <p className="text-white/20 text-[10px] italic mb-3">{getWhyThis(language, mood, activeTab, track.genre as MGenre)}</p>
                <div className="flex items-center gap-2 text-white/30 text-[10px]">
                  <span>
                    {(track.playbackType as string) === 'unavailable' ? '🚫 Unavailable' :
                      track.playbackType === 'preview' ? '⏱ Preview available' :
                      track.playbackType === 'external' ? '↗ Provider playback' :
                      track.playbackType === 'native' ? '▶ Full track available' :
                      track.playbackType === 'embed' ? '▶ In-app player available' :
                      '▶ Play'}
                  </span>

                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!results.debug.hasResults && (
          <div className="text-center py-12">
            <p className="text-white/40">No {language} tracks found for this selection.</p>
            <p className="text-white/25 text-sm mt-2">Try another category or mood.</p>
          </div>
        )}
      </motion.div>

      <FullMusicPlayer open={fullPlayerOpen} onClose={() => setFullPlayerOpen(false)} />
    </>
  );
}

// ═══════════════ JOKES SECTION ═══════════════
function JokesSection({ userId, mood }: { userId: string; mood: string }) {
  const [joke, setJoke] = useState<Joke>(() => getRandomJokeForMood(userId, mood));

  const nextJoke = () => setJoke(getRandomJokeForMood(userId, mood));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 max-w-lg mx-auto">
      <h2 className="font-serif text-2xl md:text-3xl text-white text-center">Need a laugh?</h2>
      <p className="text-white/30 text-sm text-center">No repeats — each joke is fresh.</p>
      <AnimatePresence mode="wait">
        <motion.div key={joke.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <p className="text-white text-lg leading-relaxed mb-2">{joke.text}</p>
          <p className="text-white/20 text-xs mb-6 capitalize">#{joke.category}</p>
          <motion.button onClick={nextJoke} className="rounded-full px-6 py-2.5 text-sm transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Another one 😂
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════ CHALLENGES SECTION ═══════════════
function ChallengesSection() {
  const [challenge, setChallenge] = useState(getRandomChallenge());
  const [completed, setCompleted] = useState<string[]>([]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 max-w-lg mx-auto">
      <h2 className="font-serif text-2xl md:text-3xl text-white text-center">Tiny Challenges</h2>
      <AnimatePresence mode="wait">
        <motion.div key={challenge} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <p className="text-white text-lg leading-relaxed mb-6">{challenge}</p>
          <div className="flex gap-3 justify-center">
            <motion.button onClick={() => { setCompleted([...completed, challenge]); setChallenge(getRandomChallenge()); }}
              className="rounded-full px-6 py-2.5 text-sm flex items-center gap-2" style={{ background: 'rgba(155,191,169,0.15)', border: '1px solid rgba(155,191,169,0.2)', color: '#9BBFA9' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Check className="w-4 h-4" /> Done ✓
            </motion.button>
            <motion.button onClick={() => setChallenge(getRandomChallenge())}
              className="rounded-full px-6 py-2.5 text-sm text-white/50" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              whileHover={{ scale: 1.03 }}>
              Skip
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
      {completed.length > 0 && <p className="text-white/30 text-sm text-center">{completed.length} challenge{completed.length !== 1 ? 's' : ''} completed</p>}
    </motion.div>
  );
}

// ═══════════════ GAMES ═══════════════
const GLASS_CARD = { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.10)' };

function BubblePopGame({ onComplete }: { onComplete: () => void }) {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const spawn = () => setBubbles(prev => [...prev, { id: Date.now() + Math.random(), x: 10 + Math.random() * 80, y: 10 + Math.random() * 70, size: 30 + Math.random() * 40 }]);
    const spawnInterval = setInterval(spawn, 600);
    const timer = setInterval(() => setTimeLeft(p => { if (p <= 1) { setGameOver(true); clearInterval(spawnInterval); return 0; } return p - 1; }), 1000);
    return () => { clearInterval(spawnInterval); clearInterval(timer); };
  }, []);

  if (gameOver) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-5xl">🌿</div>
      <h2 className="font-serif text-3xl text-white">Nice little break!</h2>
      <p className="text-white/50">You popped {score} bubbles</p>
      <motion.button onClick={onComplete} className="rounded-full px-8 py-3 text-white" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Done</motion.button>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-[70vh]">
      <div className="flex justify-between mb-4"><span className="text-white/50 text-sm">Bubbles: {score}</span><span className="text-white/50 text-sm">{timeLeft}s</span></div>
      {bubbles.map(b => (
        <motion.button key={b.id} onClick={() => { setBubbles(prev => prev.filter(x => x.id !== b.id)); setScore(p => p + 1); }}
          className="absolute rounded-full cursor-pointer"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.7, y: [0, -10, 0] }}
          transition={{ y: { duration: 2, repeat: Infinity } }}
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }} />
      ))}
    </motion.div>
  );
}

function MemoryMatchGame({ onComplete }: { onComplete: () => void }) {
  const icons = ['🌿', '☁️', '🌙', '⭐', '🌸', '❤️', '☀️', '🌊'];
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { setCards([...icons, ...icons].sort(() => Math.random() - 0.5).map((icon, i) => ({ id: i, icon, flipped: false, matched: false }))); }, []);

  const flip = (id: number) => {
    if (flipped.length >= 2 || cards[id].flipped || cards[id].matched) return;
    const next = cards.map((c, i) => i === id ? { ...c, flipped: true } : c);
    setCards(next);
    const nf = [...flipped, id];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = nf;
      if (cards[a].icon === cards[b].icon) {
        setTimeout(() => { setCards(p => p.map(c => c.icon === cards[a].icon ? { ...c, matched: true } : c)); setFlipped([]); if (next.filter(c => !c.matched).length <= 2) setTimeout(() => setDone(true), 500); }, 500);
      } else {
        setTimeout(() => { setCards(p => p.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c)); setFlipped([]); }, 800);
      }
    }
  };

  if (done) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-5xl">🌟</div>
      <h2 className="font-serif text-3xl text-white">Well done!</h2>
      <p className="text-white/50">Completed in {moves} moves</p>
      <motion.button onClick={onComplete} className="rounded-full px-8 py-3 text-white" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Done</motion.button>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between"><h2 className="font-serif text-xl text-white">Memory Match</h2><span className="text-white/40 text-sm">Moves: {moves}</span></div>
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {cards.map((card) => (
          <motion.button key={card.id} onClick={() => flip(card.id)} className="aspect-square rounded-xl flex items-center justify-center text-2xl"
            style={{ ...GLASS_CARD, opacity: card.matched ? 0.5 : 1 }} whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : undefined}>
            {card.flipped || card.matched ? card.icon : '?'}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ReactionGame({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<'idle' | 'ready' | 'go' | 'result'>('idle');
  const [time, setTime] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const goTime = useRef(0);

  const start = () => { setState('ready'); timeoutRef.current = window.setTimeout(() => { goTime.current = performance.now(); setState('go'); }, 1000 + Math.random() * 3000); };
  const tap = () => {
    if (state === 'ready') { if (timeoutRef.current) clearTimeout(timeoutRef.current); setState('idle'); }
    if (state === 'go') { setTime(Math.round(performance.now() - goTime.current)); setState('result'); }
  };
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="font-serif text-xl text-white">Reaction Game</h2>
      <motion.button onClick={state === 'idle' ? start : tap} className="w-48 h-48 rounded-full flex items-center justify-center text-lg font-medium"
        style={{ background: state === 'go' ? 'rgba(152,195,121,0.3)' : state === 'ready' ? 'rgba(224,108,117,0.3)' : 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.15)', color: 'white' }}
        whileTap={{ scale: 0.95 }}>
        {state === 'idle' && 'Tap to start'}{state === 'ready' && 'Wait...'}{state === 'go' && 'TAP!'}{state === 'result' && `${time}ms`}
      </motion.button>
      {state === 'result' && <motion.button onClick={onComplete} className="rounded-full px-6 py-2 text-white/60 text-sm" style={{ ...GLASS_CARD }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Done</motion.button>}
    </motion.div>
  );
}

function WordScrambleGame({ onComplete }: { onComplete: () => void }) {
  const WORDS = ['CALM', 'SMILE', 'BREATHE', 'SUNSHINE', 'FRIEND', 'RELAX', 'PEACE', 'JOY', 'HOPE', 'KIND'];
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const newWord = useCallback(() => { const w = WORDS[Math.floor(Math.random() * WORDS.length)]; setWord(w); setScrambled(w.split('').sort(() => Math.random() - 0.5).join('')); setGuess(''); setCorrect(false); }, []);
  useEffect(() => { newWord(); }, [newWord]);
  const check = () => { if (guess.toUpperCase() === word) { setCorrect(true); setScore(s => s + 1); setTimeout(newWord, 1200); } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="font-serif text-xl text-white">Word Scramble</h2>
      <p className="text-white/40 text-sm">Score: {score}</p>
      <div className="text-4xl font-mono text-white tracking-[0.3em]">{scrambled}</div>
      <input type="text" value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Your guess..."
        className="rounded-xl px-6 py-3 text-white text-center text-lg tracking-wider focus:outline-none w-64"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }} />
      {correct && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sage text-sm">Correct! ✓</motion.p>}
      <div className="flex gap-3">
        <motion.button onClick={check} className="rounded-full px-6 py-2 text-white text-sm" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Check</motion.button>
        <motion.button onClick={onComplete} className="rounded-full px-6 py-2 text-white/50 text-sm" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Done</motion.button>
      </div>
    </motion.div>
  );
}

function EmojiGuessGame({ onComplete }: { onComplete: () => void }) {
  const puzzles = [
    { emojis: '🌅🏃', answer: 'Morning Run' }, { emojis: '📖☕', answer: 'Reading Time' },
    { emojis: '🎵🧘', answer: 'Meditation Music' }, { emojis: '🌙😴', answer: 'Sleep Time' },
    { emojis: '🌻😊', answer: 'Happy Day' }, { emojis: '🌧🏠', answer: 'Rainy Day In' },
  ];
  const [current, setCurrent] = useState(puzzles[Math.floor(Math.random() * puzzles.length)]);
  const [guess, setGuess] = useState('');
  const [correct, setCorrect] = useState(false);

  const check = () => { if (guess.toLowerCase().trim() === current.answer.toLowerCase()) { setCorrect(true); setTimeout(() => { setCurrent(puzzles[Math.floor(Math.random() * puzzles.length)]); setGuess(''); setCorrect(false); }, 1500); } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="font-serif text-xl text-white">Emoji Guess</h2>
      <div className="text-5xl">{current.emojis}</div>
      <input type="text" value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="What do these emojis mean?"
        className="rounded-xl px-6 py-3 text-white text-center focus:outline-none w-64"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }} />
      {correct && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sage">Correct! ✓</motion.p>}
      <div className="flex gap-3">
        <motion.button onClick={check} className="rounded-full px-6 py-2 text-white text-sm" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Guess</motion.button>
        <motion.button onClick={onComplete} className="rounded-full px-6 py-2 text-white/50 text-sm" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Done</motion.button>
      </div>
    </motion.div>
  );
}

function QuickTriviaGame({ onComplete }: { onComplete: () => void }) {
  const trivia = [
    { q: 'How many breaths does the average person take per day?', a: '~20,000' }, { q: 'What organ pumps about 2,000 gallons of blood daily?', a: 'Heart' },
    { q: 'What percentage of the brain is water?', a: '~75%' }, { q: 'How many muscles do we use to frown?', a: '~11' },
    { q: 'How many for a smile?', a: '~12' }, { q: 'What is the strongest muscle?', a: 'Jaw' },
  ];
  const [current, setCurrent] = useState(trivia[Math.floor(Math.random() * trivia.length)]);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 max-w-md mx-auto">
      <h2 className="font-serif text-xl text-white">Quick Trivia</h2>
      <div className="rounded-2xl p-8 text-center" style={{ ...GLASS_CARD }}>
        <p className="text-white text-lg mb-6">{current.q}</p>
        {showAnswer ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sage text-xl font-medium mb-4">{current.a}</motion.p>
        ) : (
          <motion.button onClick={() => setShowAnswer(true)} className="rounded-full px-6 py-2 text-white text-sm mb-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }} whileTap={{ scale: 0.95 }}>Reveal</motion.button>
        )}
        <button onClick={() => { setCurrent(trivia[Math.floor(Math.random() * trivia.length)]); setShowAnswer(false); }} className="text-white/30 text-xs hover:text-white/50">Next question →</button>
      </div>
      <motion.button onClick={onComplete} className="rounded-full px-6 py-2 text-white/50 text-sm" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Done</motion.button>
    </motion.div>
  );
}

function OddOneOutGame({ onComplete }: { onComplete: () => void }) {
  const sets = [
    { items: ['🌿', '🌸', '⭐', '🌳'], answer: '⭐' }, { items: ['🐱', '🐶', '🐟', '🚗'], answer: '🚗' },
    { items: ['☀️', '🌙', '⭐', '🍕'], answer: '🍕' }, { items: ['🎵', '🎶', '🎸', '📱'], answer: '📱' },
  ];
  const [current, setCurrent] = useState(sets[Math.floor(Math.random() * sets.length)]);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const guess = (item: string) => {
    if (item === current.answer) { setResult('correct'); setTimeout(() => { setCurrent(sets[Math.floor(Math.random() * sets.length)]); setResult(null); }, 1200); }
    else { setResult('wrong'); setTimeout(() => setResult(null), 800); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="font-serif text-xl text-white">Odd One Out</h2>
      <p className="text-white/40 text-sm">Find the different one</p>
      <div className="grid grid-cols-2 gap-4 max-w-xs">
        {current.items.map((item, i) => (
          <motion.button key={`${item}-${i}`} onClick={() => guess(item)} className="aspect-square rounded-2xl flex items-center justify-center text-4xl"
            style={{ ...GLASS_CARD, borderColor: result === 'correct' && item === current.answer ? 'rgba(155,191,169,0.5)' : result === 'wrong' ? 'rgba(224,108,117,0.3)' : 'rgba(255,255,255,0.10)' }}
            whileTap={{ scale: 0.95 }}>{item}</motion.button>
        ))}
      </div>
      {result === 'correct' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sage">Correct! ✓</motion.p>}
      <motion.button onClick={onComplete} className="rounded-full px-6 py-2 text-white/50 text-sm" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Done</motion.button>
    </motion.div>
  );
}

function FindStarGame({ onComplete }: { onComplete: () => void }) {
  const [positions] = useState(() => Array.from({ length: 12 }, () => Math.random()));
  const [starIdx] = useState(() => Math.floor(Math.random() * 12));
  const [found, setFound] = useState(false);
  const [reveal, setReveal] = useState(false);

  const click = (i: number) => { if (i === starIdx) { setFound(true); setReveal(true); } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="font-serif text-xl text-white">Find the Star</h2>
      <div className="grid grid-cols-4 gap-3 max-w-xs">
        {positions.map((_, i) => (
          <motion.button key={i} onClick={() => click(i)} className="aspect-square rounded-xl flex items-center justify-center text-2xl"
            style={{ ...GLASS_CARD, borderColor: found && i === starIdx ? 'rgba(155,191,169,0.5)' : 'rgba(255,255,255,0.10)' }}
            whileTap={{ scale: 0.95 }}>{found && i === starIdx ? '⭐' : '?'}</motion.button>
        ))}
      </div>
      {found && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sage">Found it! ⭐</motion.p>}
      <motion.button onClick={onComplete} className="rounded-full px-6 py-2 text-white/50 text-sm" style={{ ...GLASS_CARD }} whileHover={{ scale: 1.03 }}>Done</motion.button>
    </motion.div>
  );
}

import { useRef } from 'react';

// ═══════════════ SMILE HUB ═══════════════════════
function SmileHubSection({ mood }: { mood: string }) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState(() => getFreshJoke(1)[0]);
  const [exhausted, setExhausted] = useState(false);

  const handleNew = () => {
    const items = selectedGenre
      ? getFreshByGenre(selectedGenre as SmileGenre, 1)
      : getMoodAppropriateContent(mood, 1);
    if (items.length === 0) {
      setExhausted(true);
    } else {
      setCurrentItem(items[0]);
      setExhausted(false);
    }
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    const items = getFreshByGenre(genre as SmileGenre, 1);
    if (items.length === 0) {
      setExhausted(true);
    } else {
      setCurrentItem(items[0]);
      setExhausted(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="font-serif text-2xl md:text-3xl text-white">Smile Hub</h2>
      <p className="text-white/40 text-sm">Something to brighten your day. No repeats!</p>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {SMILE_GENRES.map(g => (
          <button key={g.id} onClick={() => handleGenreSelect(g.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0"
            style={{ background: selectedGenre === g.id ? 'rgba(232,130,180,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedGenre === g.id ? 'rgba(232,130,180,0.25)' : 'rgba(255,255,255,0.06)'}`, color: selectedGenre === g.id ? '#E882B4' : 'rgba(255,255,255,0.4)' }}>
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {currentItem && !exhausted ? (
        <motion.div key={currentItem.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <p className="text-white text-lg leading-relaxed mb-2">{currentItem.text}</p>
          <p className="text-white/20 text-xs mb-6 capitalize">#{currentItem.genre}</p>
          <motion.button onClick={handleNew} className="rounded-full px-6 py-2.5 text-sm transition-all"
            style={{ background: 'rgba(232,130,180,0.12)', border: '1px solid rgba(232,130,180,0.2)', color: '#E882B4' }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            ✨ Make me smile again
          </motion.button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-4xl block mb-3">🎉</span>
          <p className="text-white/60 text-sm">You've discovered everything in this category!</p>
          <button onClick={() => { setSelectedGenre(null); setExhausted(false); handleNew(); }}
            className="mt-3 rounded-full px-5 py-2 text-xs" style={{ background: 'rgba(155,191,169,0.12)', border: '1px solid rgba(155,191,169,0.2)', color: '#9BBFA9' }}>
            Try another vibe
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
