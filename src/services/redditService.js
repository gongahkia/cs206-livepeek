// Reddit API Service for fetching real Japanese posts
// Uses Reddit's public JSON API

import translationService from './translationService';

class RedditService {
  constructor() {
    // Try multiple Reddit endpoints to improve reliability across networks/adblockers
    this.baseUrls = [
      'https://www.reddit.com',
      'https://api.reddit.com'
    ];
    // Preserve the original property for any existing references
    this.baseUrl = this.baseUrls[0];
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.subreddits = [
      'japan',
      'LearnJapanese',
      'newsokur',
      'japanlife',
      'japantravel',
      'JapanTravel'
    ];
    this.nounTranslationCache = new Map();
    // Probability to translate each noun token when translation is enabled for the page
    this.perTokenTranslateProbability = 0.6;
    // Use serverless proxy in production to avoid CORS/adblock
    this.proxyBasePath = '/api/reddit';
  }

  // Get time ago string from timestamp
  getTimeAgo(createdUtc) {
    const seconds = Math.floor((Date.now() / 1000) - createdUtc);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 2592000)} months ago`;
  }

  // Estimate difficulty level based on content
  estimateDifficulty(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    const japaneseCharCount = (text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length;
    const totalCharCount = text.length;
    const japaneseRatio = japaneseCharCount / totalCharCount;

    // Check for complex words
    const hasComplexKanji = /[\u4E00-\u9FAF]{3,}/.test(text);
    const hasHiragana = /[\u3040-\u309F]/.test(text);
    const hasKatakana = /[\u30A0-\u30FF]/.test(text);

    if (japaneseRatio > 0.7 && hasComplexKanji) return 8;
    if (japaneseRatio > 0.5 && hasComplexKanji) return 7;
    if (japaneseRatio > 0.3 && hasHiragana) return 6;
    if (japaneseRatio > 0.1) return 5;
    if (japaneseRatio > 0) return 4;
    return 3; // Mostly English
  }

  // Check if post contains Japanese content
  hasJapaneseContent(text) {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
  }

  // Detect basic Latin letters presence
  hasLatinLetters(text) {
    return /[A-Za-z]/.test(text);
  }

  // Extract tags from post
  extractTags(title, content) {
    const tags = [];
    const text = (title + ' ' + content).toLowerCase();
    
    const tagKeywords = {
      'グルメ': ['food', 'restaurant', '食べ物', '料理', 'ラーメン', 'sushi'],
      'culture': ['culture', '文化', '伝統', 'tradition'],
      'travel': ['travel', '旅行', '観光', 'tourist'],
      'language': ['日本語', 'japanese', 'language', '学習'],
      'news': ['news', 'ニュース', '報道'],
      'lifestyle': ['life', '生活', 'lifestyle'],
      'fashion': ['fashion', 'ファッション', 'style'],
      'technology': ['tech', '技術', 'technology']
    };

    Object.keys(tagKeywords).forEach(tag => {
      if (tagKeywords[tag].some(keyword => text.includes(keyword))) {
        tags.push(`#${tag}`);
      }
    });

    return tags.length > 0 ? tags : ['#japan'];
  }

  // Transform Reddit post to app article format
  transformRedditPost(post, index) {
    const title = post.data.title || '';
    const selftext = post.data.selftext || '';
    const content = selftext.substring(0, 300); // Limit content length
    
    // Get image if available
    let image = null;
    let imageFull = null;
    if (post.data.thumbnail && post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default' && post.data.thumbnail.startsWith('http')) {
      image = post.data.thumbnail;
    }
    if (post.data.preview && post.data.preview.images && post.data.preview.images[0]) {
      const preview = post.data.preview.images[0];
      imageFull = preview.source?.url || null;
      // Use a decent resolution for card if available, otherwise fallback to source
      const resolutions = preview.resolutions || [];
      const medium = resolutions.length > 0 ? resolutions[Math.min(resolutions.length - 1, 3)] : null;
      image = (medium?.url || imageFull || image);
      // Clean Reddit image URLs
      if (image) image = image.replace(/&amp;/g, '&');
      if (imageFull) imageFull = imageFull.replace(/&amp;/g, '&');
    } else if (post.data.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(post.data.url)) {
      image = post.data.url;
      imageFull = post.data.url;
    }

    // Extract author name
    const author = post.data.author || 'anonymous';
    const authorEn = author; // Reddit usernames are usually in English

    // Get location from subreddit or flair
    const location = post.data.link_flair_text || post.data.subreddit || 'Japan';

    return {
      id: `reddit_${post.data.id}_${index}`,
      author: author,
      authorEn: authorEn,
      verified: post.data.author_flair_text ? true : false,
      location: location,
      time: this.getTimeAgo(post.data.created_utc),
      title: title,
      content: content || title, // Use title if no content
      image: image,
      imageFull: imageFull || image,
      tags: this.extractTags(title, selftext),
      likes: post.data.ups || 0,
      comments: post.data.num_comments || 0,
      shares: Math.floor((post.data.ups || 0) * 0.1), // Estimated shares
      source: 'reddit',
      originalSource: `r/${post.data.subreddit}`,
      externalUrl: `https://www.reddit.com${post.data.permalink}`,
      difficulty: this.estimateDifficulty(title, selftext),
      isRedditPost: true,
      fullText: selftext || title // Store full text for word clicking
    };
  }

  // Heuristic: translate key nouns to English while keeping Japanese structure
  // Focus on nouns - more generous to provide better learning experience
  async translateNounsInline(text, perTokenProbability = this.perTokenTranslateProbability) {
    if (!text || typeof text !== 'string') return text;

    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    if (!hasJapanese) return text;

    // Find candidate noun tokens:
    // 1. Pure kanji compounds (2-5 chars) - most nouns
    // 2. Katakana words (2+ chars) - foreign words, names
    const kanjiNouns = (text.match(/[\u4E00-\u9FAF]{2,5}/g) || []);
    const katakanaWords = (text.match(/[\u30A0-\u30FF]{2,}/g) || []);
    
    // Combine candidates
    const allCandidates = [...kanjiNouns, ...katakanaWords];
    const uniqueCandidates = Array.from(new Set(allCandidates))
      .filter(token => token.length >= 2 && token.length <= 8) // Allow longer compounds
      .slice(0, 20); // Allow more candidates

    if (uniqueCandidates.length === 0) return text;

    // Only filter out the most obvious non-nouns
    const strictStopWords = ['です', 'ます', 'から', 'まで', 'ので'];
    const candidates = uniqueCandidates.filter(token => {
      // Only skip if it's exactly a particle (not contained in a larger word)
      if (strictStopWords.includes(token)) return false;
      return true;
    });

    if (candidates.length === 0) return text;

    // Translate all candidates
    const translations = await Promise.all(
      candidates.map(async (token) => {
        const cacheKey = `ja-en:${token}`;
        if (this.nounTranslationCache.has(cacheKey)) {
          return [token, this.nounTranslationCache.get(cacheKey)];
        }
        try {
          const en = await translationService.translateText(token, 'ja', 'en');
          const cleaned = (en || '').trim();
          
          // More lenient validation - accept most translations
          if (cleaned && 
              cleaned.length > 0 && 
              cleaned.length < 80 && // Allow longer translations
              cleaned.toLowerCase() !== token.toLowerCase()) {
            this.nounTranslationCache.set(cacheKey, cleaned);
            return [token, cleaned];
          }
        } catch (e) {
          // ignore
        }
        return [token, null];
      })
    );

    // Filter to get valid translations
    const validTranslations = translations
      .filter(([ja, en]) => en && en.length > 0)
      .sort((a, b) => b[0].length - a[0].length); // Longer tokens first

    // Use most of the valid translations (80%)
    const numToTranslate = Math.max(5, Math.ceil(validTranslations.length * 0.8));

    let result = text;
    let translatedCount = 0;

    // Apply translations
    for (const [ja, en] of validTranslations) {
      if (translatedCount >= numToTranslate) break;
      
      // Check if token still exists in result (not already replaced)
      if (!result.includes(ja)) continue;
      
      // Replace with inline translation
      const escapedToken = ja.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Don't match if already in parentheses or followed by more kanji/kana
      const re = new RegExp(`(?<!\\()${escapedToken}(?![)\\u4E00-\\u9FAF\\u3040-\\u309F\\u30A0-\\u30FF])`, 'g');
      
      const matches = result.match(re);
      if (matches && matches.length > 0) {
        // Append plain English inline with a space for readability
        result = result.replace(re, `${ja} ${en}`);
        translatedCount++;
      }
    }

    return result;
  }

  // Decide whether to use proxy (non-localhost browser)
  shouldUseProxy() {
    try {
      if (typeof window === 'undefined') return false;
      const host = window.location.hostname || '';
      return host !== 'localhost' && host !== '127.0.0.1';
    } catch (_) {
      return false;
    }
  }

  // Fetch posts from a specific subreddit
  async fetchSubredditPosts(subreddit, limit = 10, sort = 'hot') {
    const cacheKey = `${subreddit}_${sort}_${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Build candidate URLs: proxy first in production, then direct hosts
      const candidateUrls = [];
      if (this.shouldUseProxy()) {
        candidateUrls.push(`${this.proxyBasePath}?path=/r/${subreddit}/${sort}.json&limit=${limit}&raw_json=1`);
      }
      for (const base of this.baseUrls) {
        candidateUrls.push(`${base}/r/${subreddit}/${sort}.json?limit=${limit}&raw_json=1`);
      }

      let data = null;
      let lastError = null;
      for (const url of candidateUrls) {
        try {
          const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (!response.ok) {
            lastError = new Error(`Reddit API error from ${url}: ${response.status}`);
            continue;
          }
          data = await response.json();
          break;
        } catch (innerErr) {
          lastError = innerErr;
          continue;
        }
      }
      if (!data) throw lastError || new Error('Reddit fetch failed');
      const posts = data.data?.children || [];
      
      // Filter for posts with Japanese content or interesting titles
      const japanesePosts = posts
        .filter(post => {
          // Skip pinned/stickied posts (usually rules/meta)
          if (post.data?.stickied) return false;
          
          const title = post.data?.title || '';
          const selftext = post.data?.selftext || '';
          const combined = title + ' ' + selftext;
          
          // Include if has Japanese characters or is from Japanese-focused subreddit
          // Be more lenient - include most posts from Japanese subreddits
          return this.hasJapaneseContent(combined) || 
                 subreddit === 'japan' || 
                 subreddit === 'newsokur' ||
                 subreddit === 'LearnJapanese' ||
                 subreddit === 'japanlife' ||
                 subreddit === 'japantravel' ||
                 subreddit === 'JapanTravel' ||
                 (title.length > 10 && combined.length > 20); // Or has substantial content
        })
        .map((post, index) => this.transformRedditPost(post, index))
        .filter(post => post.title && post.title.length > 0); // Ensure valid posts

      // Cache the results
      this.cache.set(cacheKey, {
        data: japanesePosts,
        timestamp: Date.now()
      });

      return japanesePosts;
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error);
      return [];
    }
  }

  // Fetch posts from multiple subreddits
  async fetchJapanesePosts(limitPerSubreddit = 5, maxTotalPosts = 20) {
    try {
      const promises = this.subreddits.map(subreddit => 
        this.fetchSubredditPosts(subreddit, limitPerSubreddit)
      );

      const results = await Promise.all(promises);
      const allPosts = results.flat();

      // Sort by upvotes and recency
      const sortedPosts = allPosts.sort((a, b) => {
        // Prioritize posts with Japanese content
        const aHasJapanese = this.hasJapaneseContent(a.title + ' ' + a.content);
        const bHasJapanese = this.hasJapaneseContent(b.title + ' ' + b.content);
        
        if (aHasJapanese && !bHasJapanese) return -1;
        if (!aHasJapanese && bHasJapanese) return 1;
        
        // Then by upvotes
        return b.likes - a.likes;
      });

      // Limit total posts and ensure variety
      const uniquePosts = [];
      const seenIds = new Set();
      
      for (const post of sortedPosts) {
        if (!seenIds.has(post.id) && uniquePosts.length < maxTotalPosts) {
          seenIds.add(post.id);
          uniquePosts.push(post);
        }
      }

      // Post-process text: ensure all posts are in Japanese with selective English noun translations
      // Goal: Japanese text with key nouns translated to English for learning
      const processed = await Promise.all(
        uniquePosts.map(async (post) => {
          const processText = async (text) => {
            if (!text) return text;
            const hasJa = this.hasJapaneseContent(text);
            const hasEn = this.hasLatinLetters(text);
            
            // If fully English, translate to Japanese using improved Google Translate
            if (!hasJa && hasEn) {
              try {
                const jaText = await translationService.translateText(text, 'en', 'ja');
                if (jaText && jaText !== text) {
                  // Then add selective English noun translations (30% probability)
                  return await this.translateNounsInline(jaText, 0.3);
                }
              } catch (_) {
                return text; // fallback
              }
            }
            
            // If already has Japanese, add selective English noun translations
            if (hasJa) {
              return await this.translateNounsInline(text, 0.3);
            }
            
            return text;
          };

          const titleProcessed = await processText(post.title);
          const contentProcessed = await processText(post.content);
          return { ...post, title: titleProcessed, content: contentProcessed };
        })
      );

      return processed;
    } catch (error) {
      console.error('Error fetching Japanese posts from Reddit:', error);
      return [];
    }
  }

  // Get a single post by ID (for detailed view)
  async getPostById(postId) {
    try {
      let data = null;
      let lastError = null;
      const candidates = [];
      if (this.shouldUseProxy()) {
        candidates.push(`${this.proxyBasePath}?path=/api/info.json&id=t3_${postId}&raw_json=1`);
      }
      for (const base of this.baseUrls) {
        candidates.push(`${base}/api/info.json?id=t3_${postId}&raw_json=1`);
      }
      for (const url of candidates) {
        try {
          const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (!response.ok) {
            lastError = new Error(`Reddit API error from ${url}: ${response.status}`);
            continue;
          }
          data = await response.json();
          break;
        } catch (innerErr) {
          lastError = innerErr;
          continue;
        }
      }
      if (!data) throw lastError || new Error('Reddit fetch failed');
      const post = data.data?.children[0];
      
      if (!post) return null;

      return this.transformRedditPost(post, 0);
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return null;
    }
  }

  // Fetch comments for a specific Reddit post
  async fetchPostComments(permalink, limit = 20) {
    if (!permalink) return [];

    const cacheKey = `comments_${permalink}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Reddit permalink format: /r/subreddit/comments/post_id/title/
      let data = null;
      let lastError = null;
      const candidates = [];
      if (this.shouldUseProxy()) {
        candidates.push(`${this.proxyBasePath}?path=${encodeURIComponent(permalink)}.json&limit=${limit}&raw_json=1`);
      }
      for (const base of this.baseUrls) {
        candidates.push(`${base}${permalink}.json?limit=${limit}&raw_json=1`);
      }
      for (const url of candidates) {
        try {
          const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (!response.ok) {
            lastError = new Error(`Reddit API error from ${url}: ${response.status}`);
            continue;
          }
          data = await response.json();
          break;
        } catch (innerErr) {
          lastError = innerErr;
          continue;
        }
      }
      if (!data) throw lastError || new Error('Reddit fetch failed');
      
      // Reddit returns [post_data, comments_data]
      if (!Array.isArray(data) || data.length < 2) {
        return [];
      }

      const commentsData = data[1]?.data?.children || [];
      
      // Transform Reddit comments to app format
      const rawComments = commentsData
        .filter(comment => comment.kind === 't1' && comment.data) // Only actual comments
        .map((comment, index) => {
          const commentData = comment.data;
          return {
            id: commentData.id || `comment_${index}`,
            user: commentData.author || 'deleted',
            content: commentData.body || '',
            likes: commentData.ups || 0,
            avatar: (commentData.author || 'U').substring(0, 2).toUpperCase(),
            created: commentData.created_utc,
            timeAgo: this.getTimeAgo(commentData.created_utc),
            isRedditComment: true
          };
        })
        .filter(comment => 
          comment.user !== 'deleted' && 
          comment.user !== '[deleted]' && 
          comment.content && 
          comment.content !== '[removed]' &&
          comment.content !== '[deleted]'
        )
        .slice(0, limit); // Limit number of comments

      // Process comments: translate English to Japanese with noun translations
      const processedComments = await Promise.all(
        rawComments.map(async (comment) => {
          const processedContent = await this.processCommentText(comment.content);
          return {
            ...comment,
            content: processedContent
          };
        })
      );

      // Cache the results
      this.cache.set(cacheKey, {
        data: processedComments,
        timestamp: Date.now()
      });

      return processedComments;
    } catch (error) {
      console.error('Error fetching Reddit comments:', error);
      return [];
    }
  }

  // Process comment text: translate English to Japanese with noun hints
  async processCommentText(text) {
    if (!text) return text;

    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);

    // If has Japanese content, add selective English noun translations for learning
    if (hasJapanese) {
      return await this.translateNounsInline(text, 0.3); // Conservative probability
    }

    // If purely English, translate to Japanese using improved Google Translate
    if (!hasJapanese && hasEnglish) {
      try {
        const japaneseText = await translationService.translateText(text, 'en', 'ja');
        
        if (japaneseText && japaneseText !== text) {
          // Add selective noun translations for learning (30% of nouns)
          return await this.translateNounsInline(japaneseText, 0.3);
        }
      } catch (error) {
        console.error('Error translating comment:', error);
      }
    }

    return text;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
const redditService = new RedditService();

export default redditService;
