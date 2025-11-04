# 🔴 Reddit API Integration

## Overview
The application now fetches real Japanese posts from Reddit and displays them in the news feed. This provides authentic, up-to-date content for language learning.

## Implementation

### Reddit Service (`src/services/redditService.js`)
- Fetches posts from multiple Japanese-focused subreddits:
  - `r/japan` - General Japan discussion
  - `r/LearnJapanese` - Japanese language learning
  - `r/newsokur` - Japanese news and discussion (Japanese Reddit)
  - `r/japanlife` - Life in Japan
  - `r/japantravel` - Travel in Japan
  - `r/JapanTravel` - Travel resources

### Features
1. **Multi-Subreddit Aggregation**: Fetches posts from 6 different subreddits
2. **Smart Filtering**: Prioritizes posts with Japanese content
3. **Difficulty Estimation**: Automatically calculates learning difficulty based on Japanese character ratio
4. **Caching**: 5-minute cache to reduce API calls
5. **Error Handling**: Graceful fallback to mock data if Reddit API fails
6. **Real-Time Data**: Shows actual upvotes, comments, and timestamps from Reddit

### Data Transformation
Each Reddit post is transformed to match the app's article format:
- **Title & Content**: Extracted from Reddit post
- **Author**: Reddit username
- **Location**: Subreddit name or flair
- **Images**: Extracted from Reddit preview/thumbnail
- **Tags**: Auto-generated based on content keywords
- **Difficulty**: Calculated based on Japanese content ratio
- **Link**: Direct link to original Reddit post

## Usage

### In the Application
1. **Toggle Data Source**: 
   - A banner at the top shows current data source
   - Click to toggle between "🔴 Live Reddit Posts" and "📝 Mock Data"

2. **Loading State**: 
   - Shows spinner while fetching Reddit posts
   - Falls back to mock data if Reddit is unavailable

3. **Real Posts**: 
   - All posts show real Reddit content
   - Click external link icon to view on Reddit
   - Comment counts are real from Reddit
   - Upvotes reflect actual Reddit scores

### Subreddits Monitored
- **r/japan**: General discussions about Japan
- **r/LearnJapanese**: Language learning content
- **r/newsokur**: Japanese-language news and discussions
- **r/japanlife**: Expat experiences in Japan
- **r/japantravel**: Travel tips and experiences
- **r/JapanTravel**: Travel planning resources

## Technical Details

### API Endpoints
- Uses Reddit's public JSON API
- No authentication required (rate limit: 60 requests/minute)
- Endpoint format: `https://www.reddit.com/r/{subreddit}/hot.json`

### Caching Strategy
- Cache duration: 5 minutes
- Cache key: `{subreddit}_{sort}_{limit}`
- Automatic cache invalidation

### Error Handling
- Network errors: Falls back to mock data
- Empty results: Falls back to mock data
- API errors: Logged to console, graceful degradation

### Performance
- Fetches 5 posts per subreddit (max 30 total)
- Filters and sorts for best Japanese content
- Limits to 20 unique posts for display

## Browser Compatibility
- Works in all modern browsers
- Requires JavaScript fetch API
- No special permissions needed

## Future Enhancements
Potential improvements:
- OAuth authentication for higher rate limits
- Real-time updates with polling
- User customization of subreddits
- Caching in localStorage
- Offline mode with cached data
- Additional social media integrations (Twitter, Instagram)

## Notes
- Reddit API rate limits apply (60 requests/minute without auth)
- Some posts may not have images
- Content is filtered to prioritize Japanese language content
- All posts link back to original Reddit threads

The integration provides authentic Japanese content while maintaining the app's language learning features like clickable words, pronunciation, and dictionary saving! 🚀

