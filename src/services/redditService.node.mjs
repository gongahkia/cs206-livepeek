// Reddit API Service for fetching real Japanese posts (Node-compatible copy)
// Uses Reddit's public JSON API

import translationService from './translationService.js';

class RedditService {
  constructor() {
    this.baseUrl = 'https://www.reddit.com';
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
    if (post.data.thumbnail && post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default' && post.data.thumbnail.startsWith('http')) {
      image = post.data.thumbnail;
    } else if (post.data.preview && post.data.preview.images && post.data.preview.images[0]) {
      image = post.data.preview.images[0].source?.url || null;
      // Clean Reddit image URLs
      if (image) {
        image = image.replace(/&amp;/g, '&');
      }
    } else if (post.data.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(post.data.url)) {
      image = post.data.url;
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

  // Heuristic: translate only likely nouns while keeping Japanese structure
  // - Translate Kanji runs (>=1 char) and Katakana runs (>=2 chars)
  // - Leave hiragana/particles untouched
  async translateNounsInline(text, perTokenProbability = this.perTokenTranslateProbability) {
    if (!text || typeof text !== 'string') return text;

    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    if (!hasJapanese) return text;

    // Find candidate noun tokens (unique, max 12 per text to limit API calls)
    const kanjiTokens = (text.match(/[\u4E00-\u9FAF]{1,}/g) || []);
    const katakanaTokens = (text.match(/[\u30A0-\u30FF]{2,}/g) || []);
    const candidates = Array.from(new Set([...kanjiTokens, ...katakanaTokens])).slice(0, 12);

    if (candidates.length === 0) return text;

    const translations = await Promise.all(
      candidates.map(async (token) => {
        const cacheKey = `ja-en:${token}`;
        if (this.nounTranslationCache.has(cacheKey)) {
          return [token, this.nounTranslationCache.get(cacheKey)];
        }
        try {
          const en = await translationService.translateText(token, 'ja', 'en');
          // Basic sanity filter
          const cleaned = (en || '').trim();
          if (cleaned && cleaned.toLowerCase() !== token.toLowerCase()) {
            this.nounTranslationCache.set(cacheKey, cleaned);
            return [token, cleaned];
          }
        } catch (e) {
          // ignore
        }
        return [token, null];
      })
    );

    let result = text;
    let replacedAny = false;
    for (const [ja, en] of translations) {
      if (!en) continue;
      // Randomly decide whether to translate this particular noun token
      if (Math.random() > perTokenProbability) continue;
      // Replace each occurrence with inline English noun in parentheses
      // Keep original Japanese to preserve structure and readability
      const re = new RegExp(ja.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const before = result;
      result = result.replace(re, `${ja} (${en})`);
      if (result !== before) replacedAny = true;
    }
    // Ensure at least one replacement happened if possible
    if (!replacedAny) {
      const first = translations.find(([ja, en]) => ja && en);
      if (first) {
        const [ja, en] = first;
        const re = new RegExp(ja.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        result = result.replace(re, `${ja} (${en})`);
      }
    }
    return result;
  }

  // Fetch posts from a specific subreddit
  async fetchSubredditPosts(subreddit, limit = 10, sort = 'hot') {
    const cacheKey = `${subreddit}_${sort}_${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/r/${subreddit}/${sort}.json?limit=${limit}&raw_json=1`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
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
  async fetchJapanesePosts(limitPerSubreddit = 5) {
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
        if (!seenIds.has(post.id) && uniquePosts.length < 20) {
          seenIds.add(post.id);
          uniquePosts.push(post);
        }
      }

      // Post-process text: translate nouns inline while preserving structure
      // Ensure no post is fully English or fully Japanese in display:
      // - If entirely English: translate fully to Japanese, then inline-translate nouns to English
      // - If entirely Japanese: inline-translate nouns to English
      const processed = await Promise.all(
        uniquePosts.map(async (post) => {
          const processText = async (text) => {
            if (!text) return text;
            const hasJa = this.hasJapaneseContent(text);
            const hasEn = this.hasLatinLetters(text);
            // Fully English (no Japanese but has Latin)
            if (!hasJa && hasEn) {
              try {
                const jaText = await translationService.translateText(text, 'en', 'ja');
                return await this.translateNounsInline(jaText, this.perTokenTranslateProbability);
              } catch (_) {
                return text; // fallback
              }
            }
            // Fully Japanese (has Japanese but no Latin)
            if (hasJa && !hasEn) {
              return await this.translateNounsInline(text, this.perTokenTranslateProbability);
            }
            // Mixed: still apply noun translation to ensure mix
            return await this.translateNounsInline(text, this.perTokenTranslateProbability);
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
      const url = `${this.baseUrl}/api/info.json?id=t3_${postId}&raw_json=1`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
      const post = data.data?.children[0];
      
      if (!post) return null;

      return this.transformRedditPost(post, 0);
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return null;
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
const redditService = new RedditService();

export default redditService;


