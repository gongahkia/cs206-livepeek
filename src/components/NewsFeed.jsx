import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Send, BookOpen, Sparkles } from 'lucide-react';
import EnhancedCommentSystem from './EnhancedCommentSystem';

const NewsFeed = ({ selectedCountry, userProfile }) => {
  const [showComments, setShowComments] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);

  // Enhanced Japanese posts with mixed Japanese/English content for intermediate learners
  const japaneseArticles = [
    {
      id: 1,
      author: "田中雪",
      authorEn: "Yuki Tanaka",
      verified: true,
      location: "渋谷、Tokyo",
      time: "3 hours ago",
      title: "地元の人だけが知る hidden ラーメン店",
      content: "東京の最も busy な地区で地下の food culture を探索。これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
      tags: ["#グルメ", "#culture", "#local"],
      likes: 2847,
      comments: 156,
      shares: 89,
      source: "twitter",
      originalSource: "Twitter"
    },
    {
      id: 2,
      author: "佐藤博",
      authorEn: "Hiroshi Sato",
      verified: true,
      location: "東京",
      time: "5 hours ago",
      title: "Tokyo の新しい digital art museum が一般公開",
      content: "Interactive な digital art 展示は、traditional な日本の美学と最先端 technology を組み合わせ、没入型の cultural experience を創造しています。",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
      tags: ["#アート", "#technology", "#museum"],
      likes: 1567,
      comments: 89,
      shares: 234,
      source: "reddit",
      originalSource: "Reddit"
    },
    {
      id: 3,
      author: "山田花子",
      authorEn: "Hanako Yamada",
      verified: false,
      location: "原宿、Tokyo",
      time: "8 hours ago",
      title: "Street fashion の evolution in Harajuku",
      content: "Young people の creativity と self-expression は、Tokyo の fashion scene を constantly に変化させています。Traditional elements と modern trends の fusion が見られます。",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
      tags: ["#ファッション", "#youth", "#creativity"],
      likes: 892,
      comments: 45,
      shares: 67,
      source: "instagram",
      originalSource: "Instagram"
    },
    {
      id: 4,
      author: "鈴木太郎",
      authorEn: "Taro Suzuki",
      verified: true,
      location: "新宿、Tokyo",
      time: "12 hours ago",
      title: "Cherry blossom season の economic impact",
      content: "Sakura の季節は tourism industry に massive な boost をもたらします。Local businesses は special events と limited-time products で visitors を attract しています。",
      image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&h=400&fit=crop",
      tags: ["#桜", "#tourism", "#economy"],
      likes: 1234,
      comments: 78,
      shares: 156,
      source: "line",
      originalSource: "LINE"
    },
    {
      id: 5,
      author: "高橋美咲",
      authorEn: "Misaki Takahashi",
      verified: true,
      location: "京都",
      time: "1 day ago",
      title: "Traditional tea ceremony meets modern lifestyle",
      content: "古い tradition と new generation の生活 style が融合。Young Japanese people は tea ceremony を modern way で楽しんでいます。Instagram で sharing する culture も生まれています。",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop",
      tags: ["#茶道", "#tradition", "#modern"],
      likes: 1876,
      comments: 134,
      shares: 298,
      source: "tiktok",
      originalSource: "TikTok"
    },
    {
      id: 6,
      author: "中村健一",
      authorEn: "Kenichi Nakamura",
      verified: false,
      location: "大阪",
      time: "1 day ago",
      title: "Osaka の street food revolution が始まっている",
      content: "Traditional takoyaki と okonomiyaki に加えて、fusion cuisine が人気。Korean-Japanese と Italian-Japanese の combination が特に popular です。",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
      tags: ["#大阪", "#streetfood", "#fusion"],
      likes: 2156,
      comments: 187,
      shares: 145,
      source: "facebook",
      originalSource: "Facebook"
    },
    {
      id: 7,
      author: "小林さくら",
      authorEn: "Sakura Kobayashi",
      verified: true,
      location: "横浜",
      time: "2 days ago",
      title: "Working from home culture in Japan の変化",
      content: "Pandemic 以降、Japanese companies の work style が大きく変わりました。Remote work と traditional office culture の balance を見つけることが challenge です。",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
      tags: ["#リモートワーク", "#culture", "#change"],
      likes: 987,
      comments: 92,
      shares: 76,
      source: "reddit",
      originalSource: "Reddit"
    },
    {
      id: 8,
      author: "森田大輔",
      authorEn: "Daisuke Morita",
      verified: true,
      location: "福岡",
      time: "3 days ago",
      title: "九州の hidden gem destinations が international attention を集めている",
      content: "Kyushu region の beautiful nature と rich history が foreign tourists に人気。Local communities も tourism development に積極的に participate しています。",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
      tags: ["#九州", "#tourism", "#nature"],
      likes: 1543,
      comments: 118,
      shares: 203,
      source: "instagram",
      originalSource: "Instagram"
    }
  ];

  const renderSourceBadge = (source) => {
    const sourceConfig = {
      twitter: { color: 'bg-blue-500', icon: '🐦', name: 'Twitter' },
      reddit: { color: 'bg-orange-600', icon: '🤖', name: 'Reddit' },
      instagram: { color: 'bg-pink-500', icon: '📷', name: 'Instagram' },
      line: { color: 'bg-green-500', icon: '💬', name: 'LINE' },
      tiktok: { color: 'bg-black', icon: '🎵', name: 'TikTok' },
      facebook: { color: 'bg-blue-600', icon: '👥', name: 'Facebook' }
    };

    const config = sourceConfig[source] || { color: 'bg-gray-500', icon: '📱', name: 'Social' };
    
    return (
      <div className={`inline-flex items-center space-x-1 ${config.color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
        <span>{config.icon}</span>
        <span>{config.name}</span>
      </div>
    );
  };

  const toggleComments = (articleId) => {
    setShowComments(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const handleWordClick = (word, isJapanese) => {
    // Simple word translation logic
    const translations = {
      // Japanese to English
      '地元': 'local',
      'ラーメン': 'ramen',
      '店': 'shop/store',
      '東京': 'Tokyo',
      '地区': 'district',
      '探索': 'explore',
      '提供': 'provide',
      '新しい': 'new',
      '一般公開': 'public opening',
      '美学': 'aesthetics',
      '最先端': 'cutting-edge',
      '創造': 'create',
      '若い': 'young',
      '変化': 'change',
      '季節': 'season',
      '観光': 'tourism',
      // English to Japanese
      'hidden': '隠れた',
      'busy': '忙しい',
      'culture': '文化',
      'family-run': '家族経営',
      'business': 'ビジネス',
      'authentic': '本格的な',
      'digital': 'デジタル',
      'museum': '美術館',
      'interactive': 'インタラクティブ',
      'traditional': '伝統的な',
      'technology': '技術',
      'experience': '体験',
      'evolution': '進化',
      'creativity': '創造性',
      'expression': '表現',
      'constantly': '絶えず',
      'elements': '要素',
      'modern': '現代の',
      'trends': 'トレンド',
      'fusion': '融合',
      'economic': '経済的な',
      'impact': '影響',
      'massive': '大規模な',
      'boost': '押し上げ',
      'special': '特別な',
      'events': 'イベント',
      'products': '製品',
      'visitors': '訪問者',
      'attract': '引きつける'
    };

    const translation = translations[word.toLowerCase()];
    if (translation) {
      setSelectedWord({
        original: word,
        translation: translation,
        isJapanese: isJapanese
      });
    }
  };

  const renderClickableText = (text) => {
    // Split text into words and make them clickable
    const words = text.split(/(\s+)/);
    
    return words.map((word, index) => {
      const cleanWord = word.trim();
      if (!cleanWord) return word;
      
      // Detect if word contains Japanese characters
      const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(cleanWord);
      const hasEnglish = /[a-zA-Z]/.test(cleanWord);
      
      if (hasJapanese || hasEnglish) {
        return (
          <span key={index}>
            <span
              className="cursor-pointer hover:bg-yellow-100 hover:underline rounded px-1 transition-colors"
              onClick={() => handleWordClick(cleanWord, hasJapanese)}
            >
              {cleanWord}
            </span>
            {word.includes(' ') && ' '}
          </span>
        );
      }
      
      return <span key={index}>{word}</span>;
    });
  };

  if (!selectedCountry) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to LivePeek</h3>
          <p className="text-gray-600">Discover authentic content from around the world. Starting with Japanese, expanding globally!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Country Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">日本のトレンド</h1>
            <p className="text-gray-600">地域で何が起こっているかを発見・トレンドニュース</p>
          </div>
          <div className="text-4xl">🇯🇵</div>
        </div>
      </div>

      {/* Word Translation Popup */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedWord(null)}>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">{selectedWord.original}</div>
              <div className="text-lg text-gray-600 mb-4">{selectedWord.translation}</div>
              <div className="flex space-x-3">
                <button 
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
                  onClick={() => setSelectedWord(null)}
                >
                  Got it!
                </button>
                <button 
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                  onClick={() => {
                    // Add to dictionary logic would go here
                    setSelectedWord(null);
                  }}
                >
                  Add to Dictionary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles */}
      {japaneseArticles.map((article) => (
        <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-orange-700">
                    {article.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{article.author}</span>
                    {article.verified && (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {article.location} • {article.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {renderSourceBadge(article.source)}
              </div>
            </div>

            {/* Article Content */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {renderClickableText(article.title)}
              </h2>
              <p className="text-gray-800 leading-relaxed mb-4">
                {renderClickableText(article.content)}
              </p>
              
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Engagement Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{article.likes.toLocaleString()} likes</span>
                </button>
                <button 
                  onClick={() => toggleComments(article.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{article.comments} comments</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                  <Share className="w-5 h-5" />
                  <span className="text-sm font-medium">{article.shares} shares</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Comment System */}
          {showComments[article.id] && (
            <EnhancedCommentSystem 
              articleId={article.id}
              userProfile={userProfile}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;

