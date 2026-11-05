import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { mockArticles } from '../data/mockData';
import { useSaved } from '../hooks/useSaved';

const ARTICLES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedArticleIds, toggleSaveArticle } = useSaved();
  const [loading, setLoading] = useState(true);

  const article = mockArticles.find(a => a.id === id);
  const isSaved = savedArticleIds.includes(id || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate brief load
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <PageVideoBackground videoUrl={ARTICLES_VIDEO} overlay={0.25} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
          <div className="rounded-3xl h-48 bg-white/5 animate-pulse" />
          <div className="rounded-b-3xl p-8 space-y-4">
            <div className="h-4 w-48 rounded-full bg-white/10 animate-pulse" />
            <div className="h-8 w-3/4 rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!article) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <PageVideoBackground videoUrl={ARTICLES_VIDEO} overlay={0.3} />
        <div className="relative z-10 text-center">
          <p className="text-white/60 text-lg mb-4">Article not found</p>
          <button onClick={() => navigate('/articles')} className="liquid-glass-pill px-6 py-2 text-white/60 text-sm">
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const related = mockArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => {
      // Bold headings like **What is Stress?**
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h2 key={i} className="font-serif text-xl mt-8 mb-3" style={{ color: '#17201D' }}>
            {paragraph.replace(/\*\*/g, '')}
          </h2>
        );
      }
      // Lists with bullet points
      if (paragraph.includes('•') || paragraph.includes('- ')) {
        return (
          <ul key={i} className="space-y-2 my-4 ml-4">
            {paragraph.split('\n').map((line, j) => (
              <li key={j} className="text-sm leading-relaxed flex gap-2" style={{ color: '#2F3934' }}>
                <span className="text-sage mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: line.replace(/^[•\-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ul>
        );
      }
      // Numbered lists
      if (/^\d+\./.test(paragraph)) {
        return (
          <ol key={i} className="space-y-2 my-4 ml-4 list-decimal">
            {paragraph.split('\n').map((line, j) => (
              <li key={j} className="text-sm leading-relaxed" style={{ color: '#2F3934' }}>
                <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ol>
        );
      }
      // Regular paragraph
      if (paragraph.trim()) {
        return (
          <p key={i} className="text-sm leading-relaxed my-3" style={{ color: '#2F3934', lineHeight: 1.85 }}>
            <span dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </p>
        );
      }
      return <br key={i} />;
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageVideoBackground videoUrl={ARTICLES_VIDEO} overlay={0.15} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.button
          onClick={() => navigate('/articles')}
          className="text-white/40 hover:text-white text-sm flex items-center gap-1 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-0">
          {/* Dark hero header */}
          <div className="rounded-t-3xl p-6 md:p-8" style={{ background: 'rgba(10,14,24,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(155,191,169,0.12)', color: '#9BBFA9', border: '1px solid rgba(155,191,169,0.2)' }}>
                {article.category}
              </span>
              <motion.button
                onClick={() => toggleSaveArticle(article.id)}
                className="text-white/40 hover:text-sage transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-sage" /> : <Bookmark className="w-5 h-5" />}
              </motion.button>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight mb-3" style={{ color: '#F7F8F5' }}>
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(247,248,245,0.5)' }}>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime} min
              </span>
              <span>{article.category}</span>
            </div>
          </div>

          {/* Frosted reading surface */}
          <div className="rounded-b-3xl p-6 md:p-10 space-y-4" style={{ background: 'rgba(248,250,249,0.94)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 25px 80px rgba(0,0,0,0.30)' }}>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#33423B' }}>
              {article.description}
            </p>
            <div className="space-y-2 text-sm" style={{ lineHeight: 1.8 }}>
              {renderContent(article.content || '')}
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        {related.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white/60 text-sm font-medium">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(rel => (
                <motion.button
                  key={rel.id}
                  onClick={() => navigate(`/articles/${rel.id}`)}
                  className="liquid-glass rounded-xl p-4 text-left hover:bg-white/5 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <p className="text-white text-sm font-medium line-clamp-2 mb-1">{rel.title}</p>
                  <p className="text-white/30 text-xs">{rel.readingTime} min</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
