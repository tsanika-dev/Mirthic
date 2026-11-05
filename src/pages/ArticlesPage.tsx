import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Bookmark, BookmarkCheck, ArrowRight, X } from 'lucide-react';
import { useSaved } from '../hooks/useSaved';
import { useAuth } from '../context/AuthContext';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { useNavigate, useParams } from 'react-router-dom';
import { mockArticles } from '../data/mockData';

const ARTICLES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

const CATEGORIES = ['All', 'Stress', 'Anxiety', 'Depression', 'Sleep', 'Relationships', 'Self-esteem', 'Mindfulness'];

export default function ArticlesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { savedArticleIds, toggleSaveArticle } = useSaved();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSaved, setShowSaved] = useState(false);

  const filteredArticles = useMemo(() => {
    let articles = showSaved ? mockArticles.filter(a => savedArticleIds.includes(a.id)) : mockArticles;
    return articles.filter(a => {
      const matchesSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, showSaved, savedArticleIds]);

  if (id) {
    const article = mockArticles.find(a => a.id === id);
    if (!article) return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <PageVideoBackground videoUrl={ARTICLES_VIDEO} overlay={0.3} />
        <div className="relative z-10 text-center"><p className="text-white/60 text-lg mb-4">Article not found</p><button onClick={() => navigate('/articles')} className="liquid-glass-pill px-6 py-2 text-white/60 text-sm">Back to Articles</button></div>
      </div>
    );
    const isSaved = savedArticleIds.includes(article.id);
    const related = mockArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

    return (
      <div className="relative min-h-screen overflow-hidden">
        <PageVideoBackground videoUrl={ARTICLES_VIDEO} overlay={0.15} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <motion.button onClick={() => navigate('/articles')} className="text-white/40 hover:text-white text-sm flex items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>← Back to Articles</motion.button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-0">
            <div className="rounded-t-3xl p-6 md:p-8" style={{ background: 'rgba(10,14,24,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(155,191,169,0.12)', color: '#9BBFA9', border: '1px solid rgba(155,191,169,0.2)' }}>{article.category}</span>
              <motion.button onClick={() => toggleSaveArticle(article.id)} className="text-white/40 hover:text-sage transition-colors" whileTap={{ scale: 0.9 }}>
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-sage" /> : <Bookmark className="w-5 h-5" />}
              </motion.button>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight mb-3" style={{ color: '#F7F8F5' }}>{article.title}</h1>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(247,248,245,0.5)' }}><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readingTime} min</span><span>{article.category}</span></div>
              </div>
            <div className="rounded-b-3xl p-6 md:p-8 space-y-4" style={{ background: 'rgba(250,250,248,0.92)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 25px 80px rgba(0,0,0,0.30)' }}>
              <p className="text-lg leading-relaxed" style={{ color: '#33423B' }}>{article.description}</p>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#2F3934', lineHeight: 1.8 }}>
                {article.content?.split('\n').map((line: string, i: number) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="font-medium mt-6 mb-2 text-base" style={{ color: '#17201D' }}>{line.replace('## ', '')}</h2>;
                  if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} className="ml-4 list-disc" style={{ color: '#2F3934' }}>{line.replace(/^[-•]\s*/, '').replace(/\*\*/g, '')}</li>;
                  if (line.match(/^\d+\.\s/)) return <li key={i} className="ml-4 list-decimal" style={{ color: '#2F3934' }}>{line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}</li>;
                  if (line.startsWith('❌') || line.startsWith('✅')) return <p key={i} className="pl-2" style={{ color: '#2F3934' }}>{line}</p>;
                  if (line.trim()) return <p key={i} style={{ color: '#2F3934' }}>{line.replace(/\*\*/g, '')}</p>;
                  return <br key={i} />;
                })}
              </div>
            </div>
            {related.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-white/60 text-sm font-medium">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {related.map(rel => (
                    <motion.button key={rel.id} onClick={() => navigate(`/articles/${rel.id}`)} className="liquid-glass rounded-xl p-4 text-left hover:bg-white/5 transition-colors" whileHover={{ y: -2 }}>
                      <p className="text-white text-sm font-medium line-clamp-2 mb-1">{rel.title}</p>
                      <p className="text-white/30 text-xs">{rel.readingTime} min</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageVideoBackground videoUrl={ARTICLES_VIDEO} overlay={0.25} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-2">Discover</h1>
          <p className="text-white/50 text-base">Trusted articles and insights for your mental well-being.</p>
        </motion.div>
        <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full liquid-glass rounded-full pl-11 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none" />
          </div>
          <button onClick={() => setShowSaved(!showSaved)} className={`liquid-glass-pill px-4 py-3 text-sm flex items-center gap-2 ${showSaved ? 'text-sage' : 'text-white/40 hover:text-white/60'}`}>
            {showSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}Saved
          </button>
        </motion.div>
        <motion.div className="flex flex-wrap gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`liquid-glass-pill px-4 py-1.5 text-xs transition-all ${selectedCategory === cat ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>{cat}</button>
          ))}
        </motion.div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {filteredArticles.map((article, i) => (
            <motion.div key={article.id} className="liquid-glass rounded-2xl overflow-hidden cursor-pointer group" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }} onClick={() => navigate(`/articles/${article.id}`)}>
              <div className="h-40 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center relative overflow-hidden">
                <div className="text-5xl opacity-20 group-hover:opacity-30 transition-opacity">{article.image || '📖'}</div>
                <motion.button onClick={(e) => { e.stopPropagation(); toggleSaveArticle(article.id); }} className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/60 hover:text-white transition-colors" whileTap={{ scale: 0.9 }}>
                  {savedArticleIds.includes(article.id) ? <BookmarkCheck className="w-4 h-4 text-sage" /> : <Bookmark className="w-4 h-4" />}
                </motion.button>
              </div>
              <div className="p-5">
                <span className="text-white/30 text-xs uppercase tracking-wider">{article.category}</span>
                <h3 className="text-white font-medium mt-1 mb-2 line-clamp-2 group-hover:text-sage transition-colors">{article.title}</h3>
                <p className="text-white/40 text-sm line-clamp-2 mb-3">{article.description}</p>
                <div className="flex items-center justify-between text-xs text-white/30">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime} min</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:text-sage transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {filteredArticles.length === 0 && (
          <div className="liquid-glass rounded-2xl p-12 text-center">
            <p className="text-white/60 text-lg mb-2">{showSaved ? 'No saved articles yet' : 'No articles found'}</p>
            <p className="text-white/30 text-sm">{showSaved ? 'Save articles to read later.' : 'Try a different search term.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}