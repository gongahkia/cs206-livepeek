import React, { useState } from 'react';
import { Heart, MessageCircle, Languages, BookOpen, Sparkles, Send } from 'lucide-react';

const EnhancedCommentSystem = ({ articleId, userProfile }) => {
  const [showDictionary, setShowDictionary] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  // Mock comments with mixed Japanese/English for intermediate learners
  const mockComments = {
    1: [
      {
        id: 1,
        user: "Li Wei",
        badge: "Chinese Learner",
        level: "Advanced",
        location: "Beijing, China",
        time: "20m ago",
        content: "この place は really authentic です！I've been learning about Japanese food culture と this looks amazing. Can't wait to visit Tokyo someday!",
        likes: 18,
        avatar: "LW"
      },
      {
        id: 2,
        user: "Sarah Johnson",
        badge: "Japanese Learner", 
        level: "Beginner",
        location: "New York, USA",
        time: "15m ago",
        content: "ラーメン looks so delicious! I'm still learning hiragana but I love seeing authentic Japanese content. Thank you for sharing!",
        likes: 12,
        avatar: "SJ"
      },
      {
        id: 3,
        user: "田中健",
        badge: "Native Speaker",
        level: "Native",
        location: "大阪、Japan",
        time: "10m ago",
        content: "Great post! These hidden gems are what make Tokyo special. For learners: 'hidden' means 隠れた and 'authentic' means 本格的な。",
        likes: 24,
        avatar: "TK"
      },
      {
        id: 4,
        user: "Maria Garcia",
        badge: "Spanish Learner",
        level: "Intermediate",
        location: "Madrid, Spain",
        time: "8m ago",
        content: "As someone learning Japanese, I appreciate the mixed language approach! The ramen culture in Japan is so fascinating compared to Spain.",
        likes: 15,
        avatar: "MG"
      },
      {
        id: 5,
        user: "김민수",
        badge: "Korean Learner",
        level: "Advanced",
        location: "Seoul, Korea",
        time: "5m ago",
        content: "Japanese と Korean の food culture には many similarities があります。This type of family business は both countries で important です。",
        likes: 19,
        avatar: "KM"
      },
      {
        id: 6,
        user: "Alex Thompson",
        badge: "Japanese Learner",
        level: "Intermediate",
        location: "London, UK",
        time: "3m ago",
        content: "I visited one of these places last month! The おじいさん who ran it was so kind and patient with my broken Japanese. Unforgettable experience!",
        likes: 22,
        avatar: "AT"
      },
      {
        id: 7,
        user: "山田花",
        badge: "Native Speaker",
        level: "Native",
        location: "東京、Japan",
        time: "2m ago",
        content: "These places are treasures! Many have been in families for generations. The recipes are passed down and never written down - pure tradition!",
        likes: 28,
        avatar: "YH"
      },
      {
        id: 8,
        user: "Pierre Dubois",
        badge: "French Learner",
        level: "Beginner",
        location: "Paris, France",
        time: "1m ago",
        content: "Je suis débutant in Japanese but this makes me want to learn more! The food culture looks incredible. Merci for sharing!",
        likes: 8,
        avatar: "PD"
      },
      {
        id: 9,
        user: "Chen Wei",
        badge: "Chinese Learner",
        level: "Advanced",
        location: "Shanghai, China",
        time: "30s ago",
        content: "中国にも similar family restaurants があります。But Japanese ラーメン culture is unique! Planning a food tour to Tokyo next year.",
        likes: 14,
        avatar: "CW"
      },
      {
        id: 10,
        user: "Emma Wilson",
        badge: "Japanese Learner",
        level: "Intermediate",
        location: "Sydney, Australia",
        time: "just now",
        content: "This is why I love LivePeek! Learning about culture through food is the best way. Can anyone recommend similar places in Osaka?",
        likes: 11,
        avatar: "EW"
      }
    ],
    2: [
      {
        id: 1,
        user: "Emma Wilson",
        badge: "Japanese Learner",
        level: "Intermediate", 
        location: "London, UK",
        time: "30m ago",
        content: "Digital art museums in Japan are incredible! The technology と traditional art の combination is fascinating. I visited one in Odaiba last year.",
        likes: 15,
        avatar: "EW"
      },
      {
        id: 2,
        user: "山田太郎",
        badge: "Native Speaker",
        level: "Native",
        location: "東京、Japan", 
        time: "25m ago",
        content: "This museum is perfect for language learners! They have English explanations alongside Japanese. Great for practicing reading skills!",
        likes: 19,
        avatar: "YT"
      },
      {
        id: 3,
        user: "Carlos Silva",
        badge: "Portuguese Learner",
        level: "Advanced",
        location: "São Paulo, Brazil",
        time: "20m ago",
        content: "Technology と art の fusion は本当に beautiful です！Brazil also has some digital art spaces but nothing like this scale.",
        likes: 13,
        avatar: "CS"
      },
      {
        id: 4,
        user: "Anna Kowalski",
        badge: "Polish Learner",
        level: "Beginner",
        location: "Warsaw, Poland",
        time: "18m ago",
        content: "I'm still learning basic Japanese but this looks amazing! The interactive elements must make it so engaging for visitors.",
        likes: 9,
        avatar: "AK"
      },
      {
        id: 5,
        user: "田中美咲",
        badge: "Native Speaker",
        level: "Native",
        location: "京都、Japan",
        time: "15m ago",
        content: "Traditional Japanese aesthetics combined with modern technology creates such a unique experience. Proud of our cultural innovation!",
        likes: 25,
        avatar: "TM"
      },
      {
        id: 6,
        user: "David Kim",
        badge: "Korean Learner",
        level: "Advanced",
        location: "Los Angeles, USA",
        time: "12m ago",
        content: "As an artist myself, I'm fascinated by how Japan blends tradition with innovation. This museum represents that perfectly!",
        likes: 17,
        avatar: "DK"
      },
      {
        id: 7,
        user: "Sophie Martin",
        badge: "French Learner",
        level: "Intermediate",
        location: "Lyon, France",
        time: "10m ago",
        content: "The immersive experience must be incredible! French museums are starting to adopt similar technology. Japan is always ahead!",
        likes: 12,
        avatar: "SM"
      },
      {
        id: 8,
        user: "李小明",
        badge: "Chinese Learner",
        level: "Advanced",
        location: "Beijing, China",
        time: "8m ago",
        content: "Digital art は future of museums だと思います。This type of cultural experience helps language learners understand Japan better.",
        likes: 16,
        avatar: "LX"
      },
      {
        id: 9,
        user: "Roberto Rossi",
        badge: "Italian Learner",
        level: "Intermediate",
        location: "Rome, Italy",
        time: "5m ago",
        content: "Italy has amazing traditional art, but this digital approach is revolutionary! Would love to experience this in person someday.",
        likes: 14,
        avatar: "RR"
      },
      {
        id: 10,
        user: "Jessica Brown",
        badge: "Japanese Learner",
        level: "Beginner",
        location: "Toronto, Canada",
        time: "2m ago",
        content: "This makes me even more excited to learn Japanese! The culture is so rich and innovative. Adding this to my Tokyo bucket list!",
        likes: 10,
        avatar: "JB"
      }
    ],
    3: [
      {
        id: 1,
        user: "Alex Kim",
        badge: "Korean Learner",
        level: "Advanced",
        location: "Seoul, Korea",
        time: "45m ago",
        content: "Harajuku fashion is so unique! As someone learning Japanese, I love how creative expression transcends language barriers. Fashion は universal language ですね！",
        likes: 22,
        avatar: "AK"
      },
      {
        id: 2,
        user: "Isabella Rodriguez",
        badge: "Spanish Learner",
        level: "Intermediate",
        location: "Barcelona, Spain",
        time: "40m ago",
        content: "The creativity in Harajuku is inspiring! Spanish fashion is more traditional, but I love how Japanese youth express themselves so freely.",
        likes: 18,
        avatar: "IR"
      },
      {
        id: 3,
        user: "佐藤ゆき",
        badge: "Native Speaker",
        level: "Native",
        location: "原宿、Tokyo",
        time: "35m ago",
        content: "Harajuku represents the spirit of Japanese youth! We're not afraid to mix traditional elements with modern trends. Fashion is our voice!",
        likes: 31,
        avatar: "SY"
      },
      {
        id: 4,
        user: "Thomas Mueller",
        badge: "German Learner",
        level: "Beginner",
        location: "Berlin, Germany",
        time: "30m ago",
        content: "German fashion is quite conservative compared to this! I admire how Japanese young people aren't afraid to stand out.",
        likes: 15,
        avatar: "TM"
      },
      {
        id: 5,
        user: "Priya Sharma",
        badge: "Hindi Learner",
        level: "Advanced",
        location: "Mumbai, India",
        time: "25m ago",
        content: "Indian fashion also mixes traditional と modern elements! But Harajuku takes it to a completely different level. So creative!",
        likes: 20,
        avatar: "PS"
      },
      {
        id: 6,
        user: "Lucas Santos",
        badge: "Portuguese Learner",
        level: "Intermediate",
        location: "Rio de Janeiro, Brazil",
        time: "20m ago",
        content: "Brazilian fashion is colorful but this is next level! The way young Japanese people express individuality through fashion is amazing.",
        likes: 16,
        avatar: "LS"
      },
      {
        id: 7,
        user: "中村あい",
        badge: "Native Speaker",
        level: "Native",
        location: "渋谷、Tokyo",
        time: "15m ago",
        content: "Fashion in Harajuku changes every season! It's like a living art gallery where everyone is both artist and artwork.",
        likes: 28,
        avatar: "NA"
      },
      {
        id: 8,
        user: "Olivia Taylor",
        badge: "Japanese Learner",
        level: "Intermediate",
        location: "Melbourne, Australia",
        time: "12m ago",
        content: "I visited Harajuku last month and was amazed! Everyone was so kind when I tried to compliment their outfits in broken Japanese.",
        likes: 19,
        avatar: "OT"
      },
      {
        id: 9,
        user: "Ahmed Hassan",
        badge: "Arabic Learner",
        level: "Advanced",
        location: "Cairo, Egypt",
        time: "8m ago",
        content: "Fashion as self-expression is universal! But Japanese youth culture takes it to artistic levels. Very inspiring for creative people.",
        likes: 17,
        avatar: "AH"
      },
      {
        id: 10,
        user: "Marie Dubois",
        badge: "French Learner",
        level: "Beginner",
        location: "Paris, France",
        time: "3m ago",
        content: "Even Paris fashion week doesn't have this level of creativity! Japanese street fashion is truly an art form.",
        likes: 21,
        avatar: "MD"
      }
    ],
    4: [
      {
        id: 1,
        user: "Maria Garcia",
        badge: "Spanish Learner",
        level: "Intermediate",
        location: "Madrid, Spain", 
        time: "1h ago",
        content: "Cherry blossom season must be amazing for the economy! I'm planning to visit during sakura season. Any recommendations for best viewing spots?",
        likes: 16,
        avatar: "MG"
      },
      {
        id: 2,
        user: "鈴木健太",
        badge: "Native Speaker",
        level: "Native",
        location: "東京、Japan",
        time: "55m ago",
        content: "Sakura season brings millions of tourists! Ueno Park and Shinjuku Gyoen are popular, but try Chidorigafuchi for fewer crowds.",
        likes: 24,
        avatar: "SK"
      },
      {
        id: 3,
        user: "James Wilson",
        badge: "Japanese Learner",
        level: "Advanced",
        location: "Chicago, USA",
        time: "50m ago",
        content: "The economic impact is huge! Hotels, restaurants, everything gets booked months in advance. Tourism と economy の perfect example です。",
        likes: 18,
        avatar: "JW"
      },
      {
        id: 4,
        user: "Lin Zhang",
        badge: "Chinese Learner",
        level: "Intermediate",
        location: "Shanghai, China",
        time: "45m ago",
        content: "中国也有樱花，but Japan's sakura culture is unique! The hanami tradition makes it more than just flowers - it's a cultural event.",
        likes: 20,
        avatar: "LZ"
      },
      {
        id: 5,
        user: "Elena Petrov",
        badge: "Russian Learner",
        level: "Beginner",
        location: "Moscow, Russia",
        time: "40m ago",
        content: "Russian spring is still cold when Japan has sakura! The timing must be perfect for tourism. Very smart seasonal marketing.",
        likes: 12,
        avatar: "EP"
      },
      {
        id: 6,
        user: "高橋さくら",
        badge: "Native Speaker",
        level: "Native",
        location: "京都、Japan",
        time: "35m ago",
        content: "Kyoto during sakura season is magical but very crowded! Local businesses prepare special sakura-themed products months ahead.",
        likes: 27,
        avatar: "TS"
      },
      {
        id: 7,
        user: "Marco Rossi",
        badge: "Italian Learner",
        level: "Advanced",
        location: "Milan, Italy",
        time: "30m ago",
        content: "Italy has beautiful springs too, but sakura season in Japan is legendary! The limited time makes it even more special and valuable.",
        likes: 15,
        avatar: "MR"
      },
      {
        id: 8,
        user: "Sophie Chen",
        badge: "Japanese Learner",
        level: "Intermediate",
        location: "Vancouver, Canada",
        time: "25m ago",
        content: "Vancouver has cherry blossoms too but Japan's hanami culture is deeper! It's not just viewing - it's celebrating life and renewal.",
        likes: 19,
        avatar: "SC"
      },
      {
        id: 9,
        user: "Daniel Lee",
        badge: "Korean Learner",
        level: "Advanced",
        location: "Busan, Korea",
        time: "20m ago",
        content: "Korea also has cherry blossoms but Japan's tourism marketing is incredible! They've turned natural beauty into economic opportunity.",
        likes: 16,
        avatar: "DL"
      },
      {
        id: 10,
        user: "Fatima Al-Zahra",
        badge: "Arabic Learner",
        level: "Beginner",
        location: "Dubai, UAE",
        time: "15m ago",
        content: "Desert countries like UAE don't have seasons like this! The concept of seasonal tourism based on flowers is fascinating.",
        likes: 14,
        avatar: "FA"
      }
    ],
    5: [
      {
        id: 1,
        user: "Emma Thompson",
        badge: "Japanese Learner",
        level: "Advanced",
        location: "London, UK",
        time: "2h ago",
        content: "Tea ceremony と modern life の combination is brilliant! Traditional culture doesn't have to be separate from contemporary living.",
        likes: 23,
        avatar: "ET"
      },
      {
        id: 2,
        user: "田中和子",
        badge: "Native Speaker",
        level: "Native",
        location: "京都、Japan",
        time: "1h 50m ago",
        content: "As a tea ceremony instructor, I love seeing young people embrace tradition! Instagram sharing actually helps preserve our culture.",
        likes: 35,
        avatar: "TK"
      },
      {
        id: 3,
        user: "Carlos Mendez",
        badge: "Spanish Learner",
        level: "Intermediate",
        location: "Mexico City, Mexico",
        time: "1h 45m ago",
        content: "Mexican culture also blends traditional と modern! But Japanese approach to preserving ceremony while adapting is inspiring.",
        likes: 18,
        avatar: "CM"
      },
      {
        id: 4,
        user: "Lisa Park",
        badge: "Korean Learner",
        level: "Advanced",
        location: "Seoul, Korea",
        time: "1h 40m ago",
        content: "Korean tea culture exists too but Japan's ceremony is more formalized! The mindfulness aspect is what young people need today.",
        likes: 21,
        avatar: "LP"
      },
      {
        id: 5,
        user: "Ahmed Ali",
        badge: "Arabic Learner",
        level: "Beginner",
        location: "Cairo, Egypt",
        time: "1h 35m ago",
        content: "Middle Eastern tea culture is different but equally important! Seeing how Japan modernizes tradition while keeping essence is amazing.",
        likes: 16,
        avatar: "AA"
      },
      {
        id: 6,
        user: "小林美香",
        badge: "Native Speaker",
        level: "Native",
        location: "東京、Japan",
        time: "1h 30m ago",
        content: "My grandmother taught me tea ceremony, now I share it on TikTok! Traditional arts need modern platforms to survive and thrive.",
        likes: 29,
        avatar: "KM"
      },
      {
        id: 7,
        user: "Pierre Laurent",
        badge: "French Learner",
        level: "Intermediate",
        location: "Lyon, France",
        time: "1h 25m ago",
        content: "French café culture is casual, but Japanese tea ceremony has such depth! The meditation aspect appeals to stressed modern life.",
        likes: 19,
        avatar: "PL"
      },
      {
        id: 8,
        user: "Raj Patel",
        badge: "Hindi Learner",
        level: "Advanced",
        location: "Mumbai, India",
        time: "1h 20m ago",
        content: "Indian chai culture is everywhere, but Japanese ceremony teaches patience and mindfulness! Both cultures value tea differently.",
        likes: 22,
        avatar: "RP"
      },
      {
        id: 9,
        user: "Anna Kowalski",
        badge: "Polish Learner",
        level: "Beginner",
        location: "Krakow, Poland",
        time: "1h 15m ago",
        content: "Polish tea traditions are simple compared to this! The artistic and spiritual elements of Japanese ceremony are fascinating.",
        likes: 15,
        avatar: "AK"
      },
      {
        id: 10,
        user: "Michael Brown",
        badge: "Japanese Learner",
        level: "Intermediate",
        location: "Sydney, Australia",
        time: "1h 10m ago",
        content: "Tried tea ceremony in Kyoto last year! The Instagram generation is actually helping preserve these traditions in new ways.",
        likes: 17,
        avatar: "MB"
      }
    ],
    6: [
      {
        id: 1,
        user: "Roberto Silva",
        badge: "Portuguese Learner",
        level: "Advanced",
        location: "São Paulo, Brazil",
        time: "1d ago",
        content: "Osaka street food is legendary! Brazilian street food is amazing too, but Japanese fusion creativity is next level. Want to try that Korean-Japanese combo!",
        likes: 28,
        avatar: "RS"
      },
      {
        id: 2,
        user: "中村太郎",
        badge: "Native Speaker",
        level: "Native",
        location: "大阪、Japan",
        time: "23h ago",
        content: "Osaka is Japan's kitchen! We're always experimenting with new flavors while keeping traditional takoyaki and okonomiyaki perfect.",
        likes: 42,
        avatar: "NT"
      },
      {
        id: 3,
        user: "Kim Min-jun",
        badge: "Korean Learner",
        level: "Advanced",
        location: "Seoul, Korea",
        time: "22h ago",
        content: "Korean-Japanese fusion food is popular in Seoul too! The combination of Korean spices with Japanese techniques creates amazing flavors.",
        likes: 25,
        avatar: "KM"
      },
      {
        id: 4,
        user: "Isabella Romano",
        badge: "Italian Learner",
        level: "Intermediate",
        location: "Naples, Italy",
        time: "21h ago",
        content: "Italian-Japanese fusion sounds incredible! Naples has amazing street food too, but Osaka's creativity with international flavors is inspiring.",
        likes: 19,
        avatar: "IR"
      },
      {
        id: 5,
        user: "Chen Wei",
        badge: "Chinese Learner",
        level: "Advanced",
        location: "Guangzhou, China",
        time: "20h ago",
        content: "Chinese street food culture is huge, but Japanese attention to detail even in street food is remarkable! Quality と creativity の perfect balance.",
        likes: 23,
        avatar: "CW"
      },
      {
        id: 6,
        user: "田中さくら",
        badge: "Native Speaker",
        level: "Native",
        location: "大阪、Japan",
        time: "19h ago",
        content: "Dotonbori area has the best fusion experiments! Young chefs are creating new traditions while respecting old ones. Food evolution!",
        likes: 31,
        avatar: "TS"
      },
      {
        id: 7,
        user: "Miguel Rodriguez",
        badge: "Spanish Learner",
        level: "Beginner",
        location: "Madrid, Spain",
        time: "18h ago",
        content: "Spanish tapas culture is different but I love how Osaka embraces international influences! Food brings cultures together.",
        likes: 16,
        avatar: "MR"
      },
      {
        id: 8,
        user: "Sarah Johnson",
        badge: "Japanese Learner",
        level: "Intermediate",
        location: "Portland, USA",
        time: "17h ago",
        content: "Portland has great food trucks but Osaka's street food scene is legendary! The fusion approach shows how food culture evolves.",
        likes: 20,
        avatar: "SJ"
      },
      {
        id: 9,
        user: "Hans Mueller",
        badge: "German Learner",
        level: "Advanced",
        location: "Munich, Germany",
        time: "16h ago",
        content: "German street food is traditional sausages, but this fusion concept is revolutionary! Innovation while respecting tradition.",
        likes: 18,
        avatar: "HM"
      },
      {
        id: 10,
        user: "Priya Sharma",
        badge: "Hindi Learner",
        level: "Intermediate",
        location: "Delhi, India",
        time: "15h ago",
        content: "Indian street food has fusion too, but Japanese precision in preparation is amazing! Would love to try these Osaka innovations.",
        likes: 22,
        avatar: "PS"
      }
    ],
    7: [
      {
        id: 1,
        user: "David Chen",
        badge: "Chinese Learner",
        level: "Advanced",
        location: "San Francisco, USA",
        time: "2d ago",
        content: "Work from home culture in Japan changing is huge news! Silicon Valley went remote first, but seeing traditional Japanese companies adapt is impressive.",
        likes: 27,
        avatar: "DC"
      },
      {
        id: 2,
        user: "小林健太",
        badge: "Native Speaker",
        level: "Native",
        location: "横浜、Japan",
        time: "2d ago",
        content: "Remote work was unthinkable before pandemic! Now even traditional companies are embracing flexibility. Big cultural shift for Japan.",
        likes: 38,
        avatar: "KK"
      },
      {
        id: 3,
        user: "Emma Wilson",
        badge: "Japanese Learner",
        level: "Intermediate",
        location: "London, UK",
        time: "2d ago",
        content: "UK went remote quickly, but Japan's transformation is more significant! The traditional office culture was so deeply rooted there.",
        likes: 21,
        avatar: "EW"
      },
      {
        id: 4,
        user: "Lars Andersen",
        badge: "Danish Learner",
        level: "Advanced",
        location: "Copenhagen, Denmark",
        time: "2d ago",
        content: "Scandinavian work-life balance was already good, but Japan's change from overwork culture to remote flexibility is revolutionary!",
        likes: 24,
        avatar: "LA"
      },
      {
        id: 5,
        user: "Maria Santos",
        badge: "Portuguese Learner",
        level: "Beginner",
        location: "Lisbon, Portugal",
        time: "1d 23h ago",
        content: "Portuguese companies also adapted to remote work, but Japanese transformation shows how global events can change deep cultural practices.",
        likes: 18,
        avatar: "MS"
      },
      {
        id: 6,
        user: "田中美咲",
        badge: "Native Speaker",
        level: "Native",
        location: "東京、Japan",
        time: "1d 22h ago",
        content: "As a working mother, remote work has been life-changing! Better work-life balance is finally possible in Japanese corporate culture.",
        likes: 35,
        avatar: "TM"
      },
      {
        id: 7,
        user: "Alex Thompson",
        badge: "Japanese Learner",
        level: "Advanced",
        location: "Toronto, Canada",
        time: "1d 21h ago",
        content: "Canadian remote work culture is established, but watching Japan adapt shows how flexible human societies can be when necessary.",
        likes: 19,
        avatar: "AT"
      },
      {
        id: 8,
        user: "Sophie Martin",
        badge: "French Learner",
        level: "Intermediate",
        location: "Paris, France",
        time: "1d 20h ago",
        content: "French work culture values long lunches, Japanese valued long hours. Both are finding new balance with remote work flexibility!",
        likes: 22,
        avatar: "SM"
      },
      {
        id: 9,
        user: "Raj Patel",
        badge: "Hindi Learner",
        level: "Advanced",
        location: "Bangalore, India",
        time: "1d 19h ago",
        content: "India's IT sector was remote-ready, but seeing traditional Japanese companies change shows technology's power to transform culture.",
        likes: 26,
        avatar: "RP"
      },
      {
        id: 10,
        user: "Carlos Rodriguez",
        badge: "Spanish Learner",
        level: "Intermediate",
        location: "Buenos Aires, Argentina",
        time: "1d 18h ago",
        content: "Latin American work culture is family-focused, so remote work fits well. Japan's adaptation from group-office culture is more dramatic!",
        likes: 20,
        avatar: "CR"
      }
    ],
    8: [
      {
        id: 1,
        user: "Lisa Park",
        badge: "Korean Learner",
        level: "Advanced",
        location: "Busan, Korea",
        time: "3d ago",
        content: "Kyushu is so beautiful! Korean tourists love visiting, especially Fukuoka. The nature and hot springs are incredible. Hidden gems indeed!",
        likes: 31,
        avatar: "LP"
      },
      {
        id: 2,
        user: "森田健一",
        badge: "Native Speaker",
        level: "Native",
        location: "福岡、Japan",
        time: "3d ago",
        content: "So proud to see Kyushu getting international recognition! We have amazing nature, history, and food that rivals Tokyo and Osaka.",
        likes: 45,
        avatar: "MK"
      },
      {
        id: 3,
        user: "Thomas Schmidt",
        badge: "German Learner",
        level: "Intermediate",
        location: "Munich, Germany",
        time: "3d ago",
        content: "German tourists usually go to Tokyo/Kyoto, but Kyushu sounds amazing! The combination of nature and history is exactly what we love.",
        likes: 23,
        avatar: "TS"
      },
      {
        id: 4,
        user: "Chen Li",
        badge: "Chinese Learner",
        level: "Advanced",
        location: "Taipei, Taiwan",
        time: "2d 23h ago",
        content: "Taiwan and Kyushu have similar subtropical climates! The natural beauty and local communities sound wonderful for cultural exchange.",
        likes: 28,
        avatar: "CL"
      },
      {
        id: 5,
        user: "Isabella Garcia",
        badge: "Spanish Learner",
        level: "Beginner",
        location: "Barcelona, Spain",
        time: "2d 22h ago",
        content: "Spanish tourists love discovering hidden places! Kyushu's combination of nature and culture sounds perfect for authentic travel experiences.",
        likes: 19,
        avatar: "IG"
      },
      {
        id: 6,
        user: "佐藤ゆき",
        badge: "Native Speaker",
        level: "Native",
        location: "熊本、Japan",
        time: "2d 21h ago",
        content: "Kumamoto Castle and Aso volcano attract many visitors! Local communities are working hard to share our culture with international guests.",
        likes: 37,
        avatar: "SY"
      },
      {
        id: 7,
        user: "James Wilson",
        badge: "Japanese Learner",
        level: "Advanced",
        location: "Seattle, USA",
        time: "2d 20h ago",
        content: "Pacific Northwest has great nature too, but Kyushu's volcanic landscapes and hot springs are unique! Adding to my Japan travel list.",
        likes: 25,
        avatar: "JW"
      },
      {
        id: 8,
        user: "Marie Dubois",
        badge: "French Learner",
        level: "Intermediate",
        location: "Nice, France",
        time: "2d 19h ago",
        content: "French Riviera is beautiful, but Kyushu's natural diversity sounds incredible! The local community involvement in tourism is inspiring.",
        likes: 21,
        avatar: "MD"
      },
      {
        id: 9,
        user: "Ahmed Hassan",
        badge: "Arabic Learner",
        level: "Advanced",
        location: "Dubai, UAE",
        time: "2d 18h ago",
        content: "Desert landscapes are beautiful, but Kyushu's green mountains and hot springs offer completely different natural experiences!",
        likes: 24,
        avatar: "AH"
      },
      {
        id: 10,
        user: "Anna Petrov",
        badge: "Russian Learner",
        level: "Beginner",
        location: "St. Petersburg, Russia",
        time: "2d 17h ago",
        content: "Russian nature is vast and cold, but Kyushu's warm subtropical environment sounds like paradise! Perfect for winter escapes.",
        likes: 18,
        avatar: "AP"
      }
    ]
  };

  // User's personal dictionary
  const userDictionary = [
    { japanese: "ラーメン", reading: "ramen", english: "ramen noodles" },
    { japanese: "文化", reading: "bunka", english: "culture" },
    { japanese: "興味深い", reading: "kyōmibukai", english: "interesting" },
    { japanese: "素晴らしい", reading: "subarashii", english: "wonderful" },
    { japanese: "美味しい", reading: "oishii", english: "delicious" },
    { japanese: "本格的", reading: "honkakuteki", english: "authentic" },
    { japanese: "伝統的", reading: "dentōteki", english: "traditional" },
    { japanese: "現代的", reading: "gendaiteki", english: "modern" }
  ];

  // AI-powered comment suggestions
  const aiSuggestions = [
    "This looks とても delicious! I want to try it.",
    "Thank you for sharing this cultural insight!",
    "As a Japanese learner, this is very helpful.",
    "The combination of traditional と modern is fascinating.",
    "I hope to visit Japan someday and experience this!"
  ];

  const comments = mockComments[articleId] || [];

  const handleWordClick = (word) => {
    const dictEntry = userDictionary.find(entry => 
      entry.japanese === word || entry.english.toLowerCase() === word.toLowerCase()
    );
    
    if (dictEntry) {
      setSelectedWord(dictEntry);
    }
  };

  const renderClickableText = (text) => {
    const words = text.split(/(\s+)/);
    
    return words.map((word, index) => {
      const cleanWord = word.trim().replace(/[.,!?]$/, '');
      if (!cleanWord) return word;
      
      const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(cleanWord);
      const hasEnglish = /[a-zA-Z]/.test(cleanWord);
      
      if (hasJapanese || hasEnglish) {
        return (
          <span key={index}>
            <span
              className="cursor-pointer hover:bg-yellow-100 hover:underline rounded px-1 transition-colors"
              onClick={() => handleWordClick(cleanWord)}
            >
              {cleanWord}
            </span>
            {word.replace(cleanWord, '')}
          </span>
        );
      }
      
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="bg-yellow-50 border-t border-yellow-200">
      {/* Word Translation Popup */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedWord(null)}>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{selectedWord.japanese}</div>
              <div className="text-sm text-gray-500 mb-2">{selectedWord.reading}</div>
              <div className="text-lg text-gray-600 mb-4">{selectedWord.english}</div>
              <button 
                className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
                onClick={() => setSelectedWord(null)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Language Learning Comments ({comments.length})
        </h3>

        {/* Comments */}
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-orange-700">{comment.avatar}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.user}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {comment.badge}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {comment.level}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    {comment.location} • {comment.time}
                  </div>
                  
                  <p className="text-gray-800 mb-3 leading-relaxed">
                    {renderClickableText(comment.content)}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Reply</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-colors">
                      <Languages className="w-4 h-4" />
                      <span className="text-sm">Translate</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">Add to Dictionary</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-gray-700">You</span>
            </div>
            
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this topic... (You can write in any language)"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="3"
              />
              
              {/* Writing Tools */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowDictionary(!showDictionary)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">Dictionary</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAIHelp(!showAIHelp)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">AI Help</span>
                  </button>
                  
                  <label className="flex items-center space-x-1 text-gray-600">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Auto-translate</span>
                  </label>
                </div>
                
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 flex items-center space-x-1">
                  <Send className="w-4 h-4" />
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dictionary Panel */}
        {showDictionary && (
          <div className="mt-4 bg-white rounded-lg border border-yellow-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Your Dictionary</h4>
            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {userDictionary.map((entry, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-gray-900">{entry.japanese}</div>
                  <div className="text-gray-500 text-xs">{entry.reading}</div>
                  <div className="text-gray-600">{entry.english}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestions Panel */}
        {showAIHelp && (
          <div className="mt-4 bg-white rounded-lg border border-yellow-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>LivePeek Recommendations</span>
            </h4>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setCommentText(suggestion)}
                  className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCommentSystem;

