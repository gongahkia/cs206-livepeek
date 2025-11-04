import React, { useState, useEffect } from 'react';
import { Bookmark, MessageCircle, Share, Send, BookOpen, Sparkles, UserPlus, UserCheck, Volume2, VolumeX } from 'lucide-react';
import EnhancedCommentSystem from './EnhancedCommentSystem';
import { handleWordClick as sharedHandleWordClick, addWordToDictionary } from '../lib/wordDatabase';
import speechService from '../services/speechService';
import redditService from '../services/redditService';
import { formatLinkDisplay } from '../utils/textUtils';

const NewsFeed = ({ selectedCountry, userProfile, onAddWordToDictionary, userDictionary }) => {
  const [showComments, setShowComments] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(new Set(['佐藤博', '高橋美咲']));
  const [speakingWord, setSpeakingWord] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(speechService.isTextToSpeechSupported());
  const [redditPosts, setRedditPosts] = useState([]);
  const [loadingReddit, setLoadingReddit] = useState(true);
  // Only live Reddit data

  // Pagination controls for Reddit fetch
  const [limitPerSubreddit, setLimitPerSubreddit] = useState(5);
  const [maxTotalPosts, setMaxTotalPosts] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Lightbox for images
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Removed hardcoded fallback posts; rely only on live Reddit data

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const getLevelColor = (level) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-blue-500';
    if (level <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const showFeedback = (message, icon) => {
    setFeedbackMessage({ message, icon });
    setTimeout(() => {
      setFeedbackMessage(null);
      setSelectedWord(null);
    }, 2000);
  };


  const handleAddToDictionary = () => {
    if (selectedWord) {
      let wordToAdd;
      
      if (selectedWord.showJapaneseTranslation) {
        // English word - add the Japanese translation to dictionary
        wordToAdd = {
          japanese: selectedWord.english, // Japanese translation
          hiragana: selectedWord.hiragana, // Katakana pronunciation
          english: selectedWord.japanese, // Original English word
          level: selectedWord.level,
          example: selectedWord.example,
          exampleEn: selectedWord.exampleEn,
          source: "LivePeek Post"
        };
      } else {
        // Japanese word - add normally
        wordToAdd = {
          japanese: selectedWord.japanese,
          hiragana: selectedWord.hiragana,
          english: selectedWord.english,
          level: selectedWord.level,
          example: selectedWord.example,
          exampleEn: selectedWord.exampleEn,
          source: "LivePeek Post"
        };
      }
      
      const exists = userDictionary.some(word => word.japanese === wordToAdd.japanese);
      
      if (!exists) {
        onAddWordToDictionary(wordToAdd);
        showFeedback('Added to dictionary! ✓', '📚');
      } else {
        showFeedback('Already in dictionary!', '📖');
      }
    }
  };

  const handleMastered = () => {
    showFeedback('Sugoi!', '😊');
  };

  // Speech synthesis for word pronunciation
  const speakWord = async () => {
    if (!speechSupported || !selectedWord) {
      console.warn('Text-to-speech not supported or no word selected');
      return;
    }

    // Stop any current speech
    if (speakingWord) {
      speechService.stopSpeaking();
      setSpeakingWord(false);
      return;
    }

    try {
      setSpeakingWord(true);
      
      // Determine if it's a Japanese word or English word
      const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(selectedWord.japanese);
      
      if (isJapanese) {
        await speechService.speakJapanese(selectedWord.japanese, {
          rate: 0.7, // Slower for learning
          pitch: 1.0,
          volume: 1.0
        });
      } else {
        // For English words, speak the Japanese translation if available
        const textToSpeak = selectedWord.showJapaneseTranslation ? selectedWord.english : selectedWord.japanese;
        await speechService.speakJapanese(textToSpeak, {
          rate: 0.7,
          pitch: 1.0,
          volume: 1.0
        });
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setSpeakingWord(false);
    }
  };

  const handleFollowToggle = (authorName) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(authorName)) {
        newSet.delete(authorName);
      } else {
        newSet.add(authorName);
      }
      return newSet;
    });
  };

  // Fetch Reddit posts on mount and when limits change
  useEffect(() => {
    const fetchRedditPosts = async () => {
      try {
        setLoadingReddit(true);
        const posts = await redditService.fetchJapanesePosts(limitPerSubreddit, maxTotalPosts);
        setRedditPosts(posts || []);
      } catch (error) {
        console.error('Error fetching Reddit posts:', error);
        setRedditPosts([]);
      } finally {
        setLoadingReddit(false);
      }
    };

    fetchRedditPosts();
  }, [limitPerSubreddit, maxTotalPosts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      // Search in available posts
      setTimeout(() => {
        const filtered = redditPosts.filter(post => {
          const searchText = (post.title + ' ' + post.content).toLowerCase();
          return searchText.includes(query.toLowerCase());
        });
        
        setSearchResults(filtered.length > 0 ? filtered.slice(0, 5) : []);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

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

  // Get actual comment count for each article
  const getCommentCount = (articleId, article) => {
    // Use the real Reddit comment count
    return article?.comments || 0;
  };

  const handleWordClick = async (word, isJapanese, context = null) => {
    await sharedHandleWordClick(word, setSelectedWord, isJapanese, context);
  };

  const handleWordClickOld = (word, isJapanese) => {
    // Comprehensive Japanese word database with words from actual posts
    const japaneseWords = {
      // Basic particles and grammar (particles are small words that show relationships between words)
      'の': { japanese: 'の', hiragana: 'の', english: 'possessive particle (shows ownership, like "\'s" in English)', level: 1, example: '地元の人だけがこの店を知っています。', exampleEn: 'Only local people know about this shop.' },
      'が': { japanese: 'が', hiragana: 'が', english: 'subject particle (marks who/what does the action)', level: 1, example: '地元の人が秘密の場所を教えてくれました。', exampleEn: 'Local people taught me about the secret place.' },
      'は': { japanese: 'は', hiragana: 'は', english: 'topic marker (shows what we\'re talking about)', level: 1, example: 'この店は本当に美味しいです。', exampleEn: 'This shop is really delicious.' },
      'を': { japanese: 'を', hiragana: 'を', english: 'object particle (marks what receives the action)', level: 1, example: '毎日美味しいラーメンを提供しています。', exampleEn: 'They provide delicious ramen every day.' },
      'に': { japanese: 'に', hiragana: 'に', english: 'direction/location particle (to/at/in)', level: 1, example: '東京に住んでいる友達がいます。', exampleEn: 'I have a friend who lives in Tokyo.' },
      'で': { japanese: 'で', hiragana: 'で', english: 'location/method particle (at/in/by means of)', level: 2, example: 'この地区で新しい文化を探索できます。', exampleEn: 'You can explore new culture in this district.' },
      'と': { japanese: 'と', hiragana: 'と', english: 'connecting particle (and/with)', level: 2, example: '友達と一緒にラーメンを食べました。', exampleEn: 'I ate ramen together with my friend.' },
      'も': { japanese: 'も', hiragana: 'も', english: 'addition particle (also/too)', level: 2, example: '伝統的な文化も新しい文化も大切です。', exampleEn: 'Both traditional culture and new culture are important.' },
      
      // Common hiragana characters
      'ま': { japanese: 'ま', hiragana: 'ま', english: 'ma (hiragana character)', level: 1, example: 'まだ', exampleEn: 'still/yet' },
      'す': { japanese: 'す', hiragana: 'す', english: 'su (hiragana character)', level: 1, example: 'します', exampleEn: 'to do (polite)' },
      'た': { japanese: 'た', hiragana: 'た', english: 'ta (hiragana character)', level: 1, example: 'した', exampleEn: 'did (past tense)' },
      'だ': { japanese: 'だ', hiragana: 'だ', english: 'da (hiragana character)', level: 1, example: 'だけ', exampleEn: 'only' },
      'け': { japanese: 'け', hiragana: 'け', english: 'ke (hiragana character)', level: 1, example: 'だけ', exampleEn: 'only' },
      'れ': { japanese: 'れ', hiragana: 'れ', english: 're (hiragana character)', level: 1, example: 'これ', exampleEn: 'this' },
      'ら': { japanese: 'ら', hiragana: 'ら', english: 'ra (hiragana character)', level: 1, example: 'これら', exampleEn: 'these' },
      'し': { japanese: 'し', hiragana: 'し', english: 'shi (hiragana character)', level: 1, example: 'します', exampleEn: 'to do' },
      'て': { japanese: 'て', hiragana: 'て', english: 'te (hiragana character)', level: 1, example: 'して', exampleEn: 'doing' },
      'き': { japanese: 'き', hiragana: 'き', english: 'ki (hiragana character)', level: 1, example: 'してきました', exampleEn: 'have been doing' },
      
      // Individual kanji characters
      '地': { japanese: '地', hiragana: 'ち', english: 'ground/land', level: 3, example: '地面', exampleEn: 'ground' },
      '元': { japanese: '元', hiragana: 'もと', english: 'origin/base', level: 4, example: '元気', exampleEn: 'healthy' },
      '人': { japanese: '人', hiragana: 'ひと', english: 'person', level: 1, example: '日本人', exampleEn: 'Japanese person' },
      '知': { japanese: '知', hiragana: 'し', english: 'know', level: 3, example: '知識', exampleEn: 'knowledge' },
      '東': { japanese: '東', hiragana: 'ひがし', english: 'east', level: 2, example: '東京', exampleEn: 'Tokyo' },
      '京': { japanese: '京', hiragana: 'きょう', english: 'capital', level: 3, example: '東京', exampleEn: 'Tokyo' },
      '最': { japanese: '最', hiragana: 'さい', english: 'most', level: 4, example: '最高', exampleEn: 'best' },
      '区': { japanese: '区', hiragana: 'く', english: 'ward/district', level: 3, example: '地区', exampleEn: 'district' },
      '下': { japanese: '下', hiragana: 'した', english: 'under/below', level: 2, example: '地下', exampleEn: 'underground' },
      '何': { japanese: '何', hiragana: 'なに', english: 'what', level: 2, example: '何時', exampleEn: 'what time' },
      '世': { japanese: '世', hiragana: 'せ', english: 'world/generation', level: 4, example: '世界', exampleEn: 'world' },
      '代': { japanese: '代', hiragana: 'だい', english: 'generation/era', level: 4, example: '時代', exampleEn: 'era' },
      '提': { japanese: '提', hiragana: 'てい', english: 'present/offer', level: 5, example: '提供', exampleEn: 'provide' },
      '供': { japanese: '供', hiragana: 'きょう', english: 'offer/supply', level: 5, example: '提供', exampleEn: 'provide' },
      '若': { japanese: '若', hiragana: 'わか', english: 'young', level: 4, example: '若者', exampleEn: 'young people' },
      '者': { japanese: '者', hiragana: 'しゃ', english: 'person (suffix)', level: 3, example: '学者', exampleEn: 'scholar' },
      '変': { japanese: '変', hiragana: 'へん', english: 'change', level: 4, example: '変化', exampleEn: 'change' },
      '化': { japanese: '化', hiragana: 'か', english: 'change/transform', level: 4, example: '文化', exampleEn: 'culture' },
      '文': { japanese: '文', hiragana: 'ぶん', english: 'writing/culture', level: 3, example: '文化', exampleEn: 'culture' },
      '見': { japanese: '見', hiragana: 'み', english: 'see/look', level: 2, example: '見る', exampleEn: 'to see' },
      
      // Katakana characters
      'ラ': { japanese: 'ラ', hiragana: 'ら', english: 'ra (katakana)', level: 1, example: 'ラーメン', exampleEn: 'ramen' },
      'ー': { japanese: 'ー', hiragana: 'ー', english: 'long vowel mark', level: 1, example: 'ラーメン', exampleEn: 'ramen' },
      'メ': { japanese: 'メ', hiragana: 'め', english: 'me (katakana)', level: 1, example: 'ラーメン', exampleEn: 'ramen' },
      'ン': { japanese: 'ン', hiragana: 'ん', english: 'n (katakana)', level: 1, example: 'ラーメン', exampleEn: 'ramen' },
      
      // Words from actual posts with real sentences from the posts
      '地元': { japanese: '地元', hiragana: 'じもと', english: 'local area/hometown', level: 4, example: '地元の人だけが知る hidden ラーメン店', exampleEn: 'Hidden ramen shops that only local people know about' },
      'だけが': { japanese: 'だけが', hiragana: 'だけが', english: 'only (exclusive)', level: 3, example: '地元の人だけが知る hidden ラーメン店', exampleEn: 'Hidden ramen shops that only local people know about' },
      '知る': { japanese: '知る', hiragana: 'しる', english: 'to know/be aware of', level: 2, example: '地元の人だけが知る hidden ラーメン店', exampleEn: 'Hidden ramen shops that only local people know about' },
      'ラーメン': { japanese: 'ラーメン', hiragana: 'らーめん', english: 'ramen noodles', level: 3, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      '店': { japanese: '店', hiragana: 'みせ', english: 'shop/store', level: 2, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      '東京': { japanese: '東京', hiragana: 'とうきょう', english: 'Tokyo (capital of Japan)', level: 2, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      '最も': { japanese: '最も', hiragana: 'もっとも', english: 'most/extremely', level: 5, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      '地区': { japanese: '地区', hiragana: 'ちく', english: 'district/area', level: 4, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      '地下': { japanese: '地下', hiragana: 'ちか', english: 'underground/basement', level: 3, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      '探索': { japanese: '探索', hiragana: 'たんさく', english: 'exploration/investigation', level: 6, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      'これらの': { japanese: 'これらの', hiragana: 'これらの', english: 'these (plural)', level: 3, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      '何世代': { japanese: '何世代', hiragana: 'なんせだい', english: 'many generations', level: 7, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      'にもわたって': { japanese: 'にもわたって', hiragana: 'にもわたって', english: 'over/spanning across', level: 8, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      '提供': { japanese: '提供', hiragana: 'ていきょう', english: 'provide/offer/supply', level: 6, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      'してきました': { japanese: 'してきました', hiragana: 'してきました', english: 'have been doing (continuous past)', level: 5, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      
      // Fashion and culture words
      '若者': { japanese: '若者', hiragana: 'わかもの', english: 'young people', level: 5, example: '若者たちは新しいファッションを作り出しています。', exampleEn: 'Young people are creating new fashion.' },
      '変化': { japanese: '変化', hiragana: 'へんか', english: 'change', level: 4, example: '東京のファッションは常に変化しています。', exampleEn: 'Tokyo fashion is constantly changing.' },
      'させています': { japanese: 'させています', hiragana: 'させています', english: 'causing to', level: 6, example: '新しい技術が社会を変化させています。', exampleEn: 'New technology is causing society to change.' },
      '見られます': { japanese: '見られます', hiragana: 'みられます', english: 'can be seen', level: 4, example: 'この地区では多くの変化が見られます。', exampleEn: 'Many changes can be seen in this district.' },
      
      // Common words
      '文化': { japanese: '文化', hiragana: 'ぶんか', english: 'culture', level: 5, example: '日本の文化は世界中で人気があります。', exampleEn: 'Japanese culture is popular around the world.' },
      '伝統': { japanese: '伝統', hiragana: 'でんとう', english: 'tradition', level: 6, example: '古い伝統と新しいアイデアが融合しています。', exampleEn: 'Old traditions and new ideas are merging.' },
      '桜': { japanese: '桜', hiragana: 'さくら', english: 'cherry blossom', level: 3, example: '春になると桜が美しく咲きます。', exampleEn: 'Cherry blossoms bloom beautifully in spring.' },
      '季節': { japanese: '季節', hiragana: 'きせつ', english: 'season', level: 4, example: '桜の季節は日本で最も美しい時期です。', exampleEn: 'Cherry blossom season is the most beautiful time in Japan.' },
      
      // Places
      '原宿': { japanese: '原宿', hiragana: 'はらじゅく', english: 'Harajuku', level: 4, example: '原宿で買い物', exampleEn: 'shopping in Harajuku' },
      '渋谷': { japanese: '渋谷', hiragana: 'しぶや', english: 'Shibuya', level: 4, example: '渋谷駅', exampleEn: 'Shibuya station' },
      '大阪': { japanese: '大阪', hiragana: 'おおさか', english: 'Osaka', level: 3, example: '大阪の食べ物', exampleEn: 'Osaka food' },
      '京都': { japanese: '京都', hiragana: 'きょうと', english: 'Kyoto', level: 3, example: '京都の寺', exampleEn: 'Kyoto temples' },
      '九州': { japanese: '九州', hiragana: 'きゅうしゅう', english: 'Kyushu', level: 5, example: '九州地方', exampleEn: 'Kyushu region' },
      
      // Missing words that were showing "Translation not available"
      '何世代にもわたって': { japanese: '何世代にもわたって', hiragana: 'なんせだいにもわたって', english: 'across many generations', level: 9, example: '何世代にもわたって伝統的なラーメンを作り続けています。', exampleEn: 'They have been making traditional ramen across many generations.' },
      '融': { japanese: '融', hiragana: 'ゆう', english: 'fusion/blend', level: 7, example: '融合', exampleEn: 'fusion' },
      '合': { japanese: '合', hiragana: 'ごう', english: 'combine/match', level: 4, example: '融合', exampleEn: 'fusion' },
      '古い': { japanese: '古い', hiragana: 'ふるい', english: 'old/ancient', level: 2, example: '古い tradition', exampleEn: 'old tradition' },
      
      // English words with Japanese translations (from actual posts)
      'hidden': { japanese: 'hidden', hiragana: 'ひどん', english: '隠れた', level: 4, example: '地元の人だけが知る hidden ラーメン店', exampleEn: 'Hidden ramen shops that only local people know about' },
      'culture': { japanese: 'culture', hiragana: 'かるちゃー', english: '文化', level: 4, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      'business': { japanese: 'business', hiragana: 'びじねす', english: 'ビジネス', level: 5, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      'authentic': { japanese: 'authentic', hiragana: 'おーせんてぃっく', english: '本格的な', level: 6, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      'family-run': { japanese: 'family-run', hiragana: 'ふぁみりーらん', english: '家族経営の', level: 6, example: 'これらの family-run business の店は何世代にもわたって authentic ラーメンを提供してきました。', exampleEn: 'These family-run business shops have been providing authentic ramen for many generations.' },
      'food': { japanese: 'food', hiragana: 'ふーど', english: '食べ物', level: 3, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      'busy': { japanese: 'busy', hiragana: 'びじー', english: '忙しい', level: 4, example: '東京の最も busy な地区で地下の food culture を探索。', exampleEn: 'Exploring underground food culture in Tokyo\'s busiest districts.' },
      'creativity': { japanese: 'creativity', hiragana: 'くりえいてぃびてぃ', english: '創造性', level: 5, example: 'Young people の creativity と self-expression は、Tokyo の fashion scene を constantly に変化させています。', exampleEn: 'Young people\'s creativity and self-expression are constantly changing Tokyo\'s fashion scene.' },
      'self-expression': { japanese: 'self-expression', hiragana: 'せるふえくすぷれっしょん', english: '自己表現', level: 6, example: 'Young people の creativity と self-expression は、Tokyo の fashion scene を constantly に変化させています。', exampleEn: 'Young people\'s creativity and self-expression are constantly changing Tokyo\'s fashion scene.' },
      'fashion': { japanese: 'fashion', hiragana: 'ふぁっしょん', english: 'ファッション', level: 4, example: 'Young people の creativity と self-expression は、Tokyo の fashion scene を constantly に変化させています。', exampleEn: 'Young people\'s creativity and self-expression are constantly changing Tokyo\'s fashion scene.' },
      'scene': { japanese: 'scene', hiragana: 'しーん', english: 'シーン', level: 4, example: 'Young people の creativity と self-expression は、Tokyo の fashion scene を constantly に変化させています。', exampleEn: 'Young people\'s creativity and self-expression are constantly changing Tokyo\'s fashion scene.' },
      'constantly': { japanese: 'constantly', hiragana: 'こんすたんとりー', english: '常に', level: 6, example: 'Young people の creativity と self-expression は、Tokyo の fashion scene を constantly に変化させています。', exampleEn: 'Young people\'s creativity and self-expression are constantly changing Tokyo\'s fashion scene.' },
      
      // Additional English words with Japanese translations
      'tradition': { japanese: 'tradition', hiragana: 'とらでぃしょん', english: '伝統', level: 5, example: '古い tradition と new generation の融合', exampleEn: 'Fusion of old tradition and new generation' },
      'new': { japanese: 'new', hiragana: 'にゅー', english: '新しい', level: 3, example: '古い tradition と new generation の融合', exampleEn: 'Fusion of old tradition and new generation' },
      'generation': { japanese: 'generation', hiragana: 'じぇねれーしょん', english: '世代', level: 5, example: '古い tradition と new generation の融合', exampleEn: 'Fusion of old tradition and new generation' },
      'style': { japanese: 'style', hiragana: 'すたいる', english: 'スタイル', level: 4, example: '生活 style が変化しています', exampleEn: 'Lifestyle is changing' },
      'Young': { japanese: 'Young', hiragana: 'やんぐ', english: '若い', level: 3, example: 'Young people の creativity', exampleEn: 'Young people\'s creativity' },
      'people': { japanese: 'people', hiragana: 'ぴーぷる', english: '人々', level: 2, example: 'Young people の creativity', exampleEn: 'Young people\'s creativity' },
      'Tokyo': { japanese: 'Tokyo', hiragana: 'とうきょう', english: '東京', level: 2, example: 'Tokyo の fashion scene', exampleEn: 'Tokyo fashion scene' },
      'Traditional': { japanese: 'Traditional', hiragana: 'とらでぃしょなる', english: '伝統的な', level: 5, example: 'Traditional elements と modern trends', exampleEn: 'Traditional elements and modern trends' },
      'elements': { japanese: 'elements', hiragana: 'えれめんつ', english: '要素', level: 5, example: 'Traditional elements と modern trends', exampleEn: 'Traditional elements and modern trends' },
      'modern': { japanese: 'modern', hiragana: 'もだん', english: '現代の', level: 4, example: 'Traditional elements と modern trends', exampleEn: 'Traditional elements and modern trends' },
      'trends': { japanese: 'trends', hiragana: 'とれんず', english: 'トレンド', level: 5, example: 'Traditional elements と modern trends', exampleEn: 'Traditional elements and modern trends' },
      'fusion': { japanese: 'fusion', hiragana: 'ふゅーじょん', english: '融合', level: 6, example: 'cultural fusion が見られます', exampleEn: 'Cultural fusion can be seen' },
      'Sakura': { japanese: 'Sakura', hiragana: 'さくら', english: '桜', level: 3, example: 'Sakura の季節は tourism に boost をもたらします', exampleEn: 'Sakura season brings a boost to tourism' },
      'tourism': { japanese: 'tourism', hiragana: 'つーりずむ', english: '観光', level: 5, example: 'Sakura の季節は tourism に boost をもたらします', exampleEn: 'Sakura season brings a boost to tourism' },
      'industry': { japanese: 'industry', hiragana: 'いんだすとりー', english: '産業', level: 5, example: 'tourism industry に massive な boost', exampleEn: 'Massive boost to tourism industry' },
      'massive': { japanese: 'massive', hiragana: 'ますぃぶ', english: '大規模な', level: 6, example: 'tourism industry に massive な boost', exampleEn: 'Massive boost to tourism industry' },
      'boost': { japanese: 'boost', hiragana: 'ぶーすと', english: '押し上げ', level: 5, example: 'tourism industry に massive な boost', exampleEn: 'Massive boost to tourism industry' },
      'Local': { japanese: 'Local', hiragana: 'ろーかる', english: '地元の', level: 3, example: 'Local businesses は special events を開催', exampleEn: 'Local businesses hold special events' },
      'businesses': { japanese: 'businesses', hiragana: 'びじねしず', english: '企業', level: 5, example: 'Local businesses は special events を開催', exampleEn: 'Local businesses hold special events' },
      'special': { japanese: 'special', hiragana: 'すぺしゃる', english: '特別な', level: 4, example: 'Local businesses は special events を開催', exampleEn: 'Local businesses hold special events' },
      'events': { japanese: 'events', hiragana: 'いべんつ', english: 'イベント', level: 4, example: 'Local businesses は special events を開催', exampleEn: 'Local businesses hold special events' },
      'limited-time': { japanese: 'limited-time', hiragana: 'りみてっどたいむ', english: '期間限定', level: 6, example: 'limited-time products で visitors を attract', exampleEn: 'Attract visitors with limited-time products' },
      'products': { japanese: 'products', hiragana: 'ぷろだくつ', english: '商品', level: 4, example: 'limited-time products で visitors を attract', exampleEn: 'Attract visitors with limited-time products' },
      'visitors': { japanese: 'visitors', hiragana: 'びじたーず', english: '訪問者', level: 4, example: 'limited-time products で visitors を attract', exampleEn: 'Attract visitors with limited-time products' },
      'attract': { japanese: 'attract', hiragana: 'あとらくと', english: '引きつける', level: 5, example: 'limited-time products で visitors を attract', exampleEn: 'Attract visitors with limited-time products' }
    };

    // Clean the word (remove punctuation)
    const cleanWord = word.replace(/[。、！？]/g, '');
    const wordData = japaneseWords[cleanWord];
    
    if (wordData) {
      // For English words, swap the display to show Japanese as the translation
      if (!isJapanese) {
        setSelectedWord({
          japanese: wordData.japanese, // Keep original English word
          hiragana: wordData.hiragana, // Katakana pronunciation
          english: wordData.english, // Japanese translation
          level: wordData.level,
          example: wordData.example,
          exampleEn: wordData.exampleEn,
          original: cleanWord,
          isJapanese: false, // Mark as English word
          showJapaneseTranslation: true // Flag to show Japanese translation
        });
      } else {
        setSelectedWord({
          ...wordData,
          original: cleanWord,
          isJapanese: isJapanese
        });
      }
    } else {
      // Create a basic translation for unknown words
      let basicTranslation = 'Unknown word';
      let basicHiragana = cleanWord;
      let basicExample = `${cleanWord}の例文です。`;
      let basicExampleEn = `Example sentence with ${cleanWord}.`;
      
      // Try to provide some basic meaning based on character patterns
      if (isJapanese) {
        if (/[\u4E00-\u9FAF]/.test(cleanWord)) {
          // Contains kanji
          basicTranslation = 'Japanese word (kanji)';
          basicExample = `この${cleanWord}は重要です。`;
          basicExampleEn = `This ${cleanWord} is important.`;
        } else if (/[\u3040-\u309F]/.test(cleanWord)) {
          // Hiragana
          basicTranslation = 'Japanese word (hiragana)';
          basicExample = `${cleanWord}を使います。`;
          basicExampleEn = `Use ${cleanWord}.`;
        } else if (/[\u30A0-\u30FF]/.test(cleanWord)) {
          // Katakana
          basicTranslation = 'Japanese word (katakana)';
          basicExample = `${cleanWord}は外来語です。`;
          basicExampleEn = `${cleanWord} is a foreign word.`;
        }
      } else {
        // English word
        basicTranslation = cleanWord.toLowerCase();
        basicHiragana = cleanWord;
        basicExample = `This is ${cleanWord}.`;
        basicExampleEn = `This is ${cleanWord}.`;
      }
      
      console.log(`Word not found in database: ${cleanWord}, providing basic translation: ${basicTranslation}`);
      setSelectedWord({
        japanese: cleanWord,
        hiragana: basicHiragana,
        english: basicTranslation,
        level: 5,
        example: basicExample,
        exampleEn: basicExampleEn,
        original: cleanWord,
        isJapanese: isJapanese
      });
    }
  };

  // Function to segment Japanese text into meaningful words/phrases
  const segmentJapaneseText = (text) => {
    // Define common Japanese word patterns and boundaries
    const wordPatterns = [
      // Multi-character words from our database (longest first)
      '地元の人だけが知る', '何世代にもわたって', 'これらの', 'family-run', 'self-expression',
      'limited-time', 'constantly', 'Traditional', 'businesses', 'generation',
      '地元', '人だけが', 'だけが', '知る', 'ラーメン', '東京', '最も', '地区', '地下', '探索',
      '何世代', 'にもわたって', '提供', 'してきました', '若者', 'creativity', 'させています',
      '変化', '見られます', '文化', '伝統', '桜', '季節', '原宿', '渋谷', '大阪', '京都', '九州',
      '古い', '生活', 'tradition', 'elements', 'products', 'visitors', 'attract',
      'Young', 'people', 'Tokyo', 'modern', 'trends', 'fusion', 'Sakura', 'tourism',
      'industry', 'massive', 'boost', 'Local', 'special', 'events', 'hidden',
      'culture', 'business', 'authentic', 'style',
      // Common particles and grammar
      'の', 'が', 'は', 'を', 'に', 'で', 'と', 'も'
    ];
    
    let result = [];
    let remaining = text;
    
    while (remaining.length > 0) {
      let matched = false;
      
      // Group contiguous ASCII/latin runs (e.g. inline translations like (protest) or /AC/)
      const asciiMatch = remaining.match(/^[A-Za-z0-9 \-._,'"()\[\]\/:%+&!?]+/);
      if (asciiMatch && asciiMatch[0].length > 0) {
        const token = asciiMatch[0];
        result.push({ text: token, isWord: false, isJapanese: false });
        remaining = remaining.slice(token.length);
        matched = true;
      }
      
      if (matched) {
        continue;
      }
      
      // Try to match longer patterns first
      for (let pattern of wordPatterns.sort((a, b) => b.length - a.length)) {
        if (remaining.startsWith(pattern)) {
          result.push({ text: pattern, isWord: true, isJapanese: true });
          remaining = remaining.slice(pattern.length);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // If no pattern matches, take one character (Japanese char)
        result.push({ text: remaining[0], isWord: false, isJapanese: true });
        remaining = remaining.slice(1);
      }
    }
    
    return result;
  };

  const renderClickableText = (text) => {
    if (!text) return null;
    return renderTextSegments(text);
  };
  
  // Format a URL to a shorter, cleaner display (domain + tail)
  // Moved to utils/textUtils.js
  
  const renderTextSegments = (text) => {
    // Split by spaces and punctuation first
    const segments = text.split(/(\s+|[。、！？])/);
    
    return segments.map((segment, segmentIndex) => {
      if (!segment.trim()) return <span key={segmentIndex}>{segment}</span>;
      
      // Detect raw URLs and render as clean hyperlinks
      if (/^https?:\/\/\S+$/i.test(segment)) {
        const clean = formatLinkDisplay(segment);
        return (
          <a
            key={segmentIndex}
            href={segment}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-700"
          >
            {clean}
          </a>
        );
      }
      
      const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(segment);
      const hasEnglish = /[a-zA-Z]/.test(segment);
      
      if (hasJapanese) {
        // Use intelligent segmentation for Japanese text
        const words = segmentJapaneseText(segment);
        
        return (
          <span key={segmentIndex}>
            {words.map((wordObj, wordIndex) => {
              const { text } = wordObj;
              const tokenIsJapanese = wordObj.isJapanese !== false;
              
              return (
                <span
                  key={`${segmentIndex}-${wordIndex}`}
                  className="cursor-pointer hover:bg-yellow-200 hover:shadow-sm border-b border-transparent hover:border-orange-300 rounded px-0.5 py-0.5 transition-all duration-200 inline-block"
                  onClick={() => handleWordClick(text, tokenIsJapanese, text)}
                  title={`Click to learn: ${text}`}
                  style={{ textDecoration: 'none' }}
                >
                  {text}
                </span>
              );
            })}
          </span>
        );
      } else if (hasEnglish) {
        // For English words, make the whole word clickable
        return (
          <span key={segmentIndex}>
            <span
              className="cursor-pointer hover:bg-blue-100 hover:shadow-sm border-b border-transparent hover:border-blue-300 rounded px-1 py-0.5 transition-all duration-200"
              onClick={() => handleWordClick(segment.trim(), false, text)}
              title={`Click to learn: ${segment.trim()}`}
              style={{ textDecoration: 'none' }}
            >
              {segment}
            </span>
          </span>
        );
      }
      
      return <span key={segmentIndex}>{segment}</span>;
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

        {/* Subreddit Sources Display */}
        <div className="mt-4 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">📡 Loading from Reddit:</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">r/japan</span>
            <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">r/LearnJapanese</span>
            <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">r/newsokur</span>
            <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">r/japanlife</span>
            <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">r/japantravel</span>
            <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">r/JapanTravel</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Japanese Word Learning Popup */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedWord(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md mx-4" onClick={e => e.stopPropagation()}>
            {!feedbackMessage ? (
              <div className="text-center">
                {/* Word Display - handles both Japanese and English words */}
                <div className="mb-4">
                  {selectedWord.showJapaneseTranslation ? (
                    // English word showing Japanese translation
                    <>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{selectedWord.japanese}</div>
                      <div className="text-lg text-gray-600 mb-2">{selectedWord.hiragana}</div>
                      <div className="text-xl text-orange-600 font-semibold">Japanese: {selectedWord.english}</div>
                    </>
                  ) : (
                    // Japanese word showing English translation
                    <>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{selectedWord.japanese}</div>
                      {selectedWord.hiragana !== selectedWord.japanese && (
                        <div className="text-lg text-gray-600 mb-2">{selectedWord.hiragana}</div>
                      )}
                      <div className="text-xl text-orange-600 font-semibold">{selectedWord.english}</div>
                    </>
                  )}
                </div>

                {/* Level Badge */}
                {selectedWord.level && (
                  <div className="mb-4 flex items-center space-x-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getLevelColor(selectedWord.level)}`}>
                      Level {selectedWord.level}
                    </span>
                    {selectedWord.isApiTranslated && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        🌐 Live Translation
                      </span>
                    )}
                    {selectedWord.isApiFallback && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        ⚠️ Basic Translation
                      </span>
                    )}
                  </div>
                )}

                {/* Context section removed as requested */}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Pronunciation button */}
                  {speechSupported && (
                    <button
                      className={`w-full px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1 ${
                        speakingWord 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                      onClick={speakWord}
                    >
                      {speakingWord ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Listen to Pronunciation</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    className="w-full bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                    onClick={handleMastered}
                  >
                    Mastered! ✨
                  </button>
                  <button
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                    onClick={handleAddToDictionary}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Add to My Dictionary</span>
                  </button>
                </div>

                {/* Dictionary Status */}
                {(() => {
                  const wordToCheck = selectedWord.showJapaneseTranslation ? selectedWord.english : selectedWord.japanese;
                  const isInDictionary = userDictionary.some(word => word.japanese === wordToCheck);
                  return isInDictionary && (
                    <div className="mt-3 text-sm text-green-600 flex items-center justify-center space-x-1">
                      <span>✓</span>
                      <span>Already in your dictionary</span>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">{feedbackMessage.icon}</div>
                <div className="text-xl font-semibold text-gray-900">{feedbackMessage.message}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingReddit && redditPosts.length === 0 && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-sm text-yellow-800">
          No posts available right now. Please try again in a moment.
        </div>
      )}

      {/* Loading Indicator */}
      {loadingReddit && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            <span className="text-sm text-gray-700">Loading real Japanese posts from Reddit...</span>
          </div>
        </div>
      )}

      {/* Posts */}
      {(searchResults.length > 0 ? searchResults : redditPosts).map((article) => (
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
                <div className="flex-1">
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
                <button
                  onClick={() => handleFollowToggle(article.author)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    followingUsers.has(article.author)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {followingUsers.has(article.author) ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href={article.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="See original post"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                {/* Subreddit source */}
                {article.originalSource && (
                  <a
                    href={`https://www.reddit.com/${article.originalSource}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    title={`From ${article.originalSource}`}
                  >
                    {article.originalSource}
                  </a>
                )}
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Level {article.difficulty}
                </span>
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
                  className="w-full h-64 object-cover rounded-lg cursor-pointer"
                  onClick={() => setLightboxUrl(article.imageFull || article.image)}
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
                <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
                  <Bookmark className="w-5 h-5" />
                  <span className="text-sm font-medium">Save</span>
                </button>
                <button 
                  onClick={() => toggleComments(article.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Comments
                  </span>
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
              article={article}
              userProfile={userProfile}
              userDictionary={userDictionary}
              onAddWordToDictionary={onAddWordToDictionary}
            />
          )}
        </div>
      ))}

      {/* Load More Posts */}
      <div className="flex justify-center py-6">
        <button
          onClick={async () => {
            setIsLoadingMore(true);
            // Increase limits and let useEffect refetch
            setLimitPerSubreddit(prev => prev + 5);
            setMaxTotalPosts(prev => prev + 20);
            // Small delay to show spinner feel
            setTimeout(() => setIsLoadingMore(false), 400);
          }}
          disabled={isLoadingMore || loadingReddit}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            isLoadingMore || loadingReddit
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {isLoadingMore || loadingReddit ? 'Loading…' : 'Load more posts'}
        </button>
      </div>

      {/* Image Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-h-[90vh] max-w-[95vw] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default NewsFeed;

