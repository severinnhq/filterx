import React, { useEffect, useRef, useState } from "react"
import { User, MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Share } from "lucide-react"

interface Tweet {
  id: number
  username: string
  handle: string
  content: string
  comments: number
  reposts: number
  likes: number
  views: number
  timestamp: string
  isConnectionPost?: boolean
}

const connectionTweets: Tweet[][] = [
  [
    {
      id: 1,
      username: "Networking Pro",
      handle: "NetworkingPro",
      content: "Hi I'm bla bla bla, I follow back everyone who follows me. Let's connect!",
      comments: 45,
      reposts: 121,
      likes: 349,
      views: 28400,
      timestamp: "2h",
      isConnectionPost: true,
    },
    {
      id: 2,
      username: "Career Guru",
      handle: "CareerGuru",
      content: "if you are using Next JS, let's connect!",
      comments: 32,
      reposts: 89,
      likes: 276,
      views: 15700,
      timestamp: "4h",
      isConnectionPost: true,
    },
    {
      id: 3,
      username: "Tech Connect",
      handle: "TechConnector",
      content: "Followed you from my end, now it's your turn. Let's connect! (my favourite)",
      comments: 28,
      reposts: 94,
      likes: 312,
      views: 19800,
      timestamp: "5h",
      isConnectionPost: true,
    },
    {
      id: 4,
      username: "Network Builder",
      handle: "NetBuilder",
      content: "Say “ Hi ”, hit the ❤️ & let’s connect!",
      comments: 37,
      reposts: 142,
      likes: 423,
      views: 31200,
      timestamp: "6h",
      isConnectionPost: true,
    },
    {
      id: 5,
      username: "Job Seeker",
      handle: "JobHunter",
      content: "I follow if you follow! Let's connect",
      comments: 41,
      reposts: 112,
      likes: 287,
      views: 22500,
      timestamp: "3h",
      isConnectionPost: true,
    },
    {
      id: 6,
      username: "Global Pro",
      handle: "WorldConnect",
      content: "Twitter is fun with followers, let's connect!!!",
      comments: 53,
      reposts: 98,
      likes: 265,
      views: 18900,
      timestamp: "1h",
      isConnectionPost: true,
    },
    {
      id: 7,
      username: "Industry Mentor",
      handle: "CareerCoach",
      content: "If you are in tech, let's connect!",
      comments: 39,
      reposts: 76,
      likes: 312,
      views: 26700,
      timestamp: "7h",
      isConnectionPost: true,
    },
    {
      id: 8,
      username: "Innovation Hub",
      handle: "InnovationNet",
      content: "Who's active let's connect 🤝",
      comments: 44,
      reposts: 105,
      likes: 398,
      views: 33600,
      timestamp: "4h",
      isConnectionPost: true,
    }
  ],
  [
    {
      id: 9,
      username: "Remote Worker",
      handle: "RemoteWorker",
      content: "Let's connect XY. Followed you from my end.",
      comments: 36,
      reposts: 89,
      likes: 276,
      views: 19500,
      timestamp: "2h",
      isConnectionPost: true,
    },
    {
      id: 10,
      username: "Startup Friend",
      handle: "StartupNetwork",
      content: "Following everyone who likes and replies.Let's connect! ",
      comments: 47,
      reposts: 132,
      likes: 412,
      views: 35800,
      timestamp: "5h",
      isConnectionPost: true,
    },
    {
      id: 11,
      username: "Green Tech",
      handle: "EcoNetwork",
      content: "Super fast follow back 🔙🔙 Super fast follow back 🔙🔙 Let's connect 🙏",
      comments: 42,
      reposts: 97,
      likes: 289,
      views: 23600,
      timestamp: "3h",
      isConnectionPost: true,
    },
    {
      id: 12,
      username: "Tech Scout",
      handle: "TalentFinder",
      content: "Ready to grow and share ideas—let’s connect!",
      comments: 38,
      reposts: 85,
      likes: 267,
      views: 20900,
      timestamp: "6h",
      isConnectionPost: true,
    },
    {
      id: 13,
      username: "Learning Pro",
      handle: "SkillShare",
      content: "Hello everyone! Let’s connect! 💯💯💯💯💯 ",
      comments: 45,
      reposts: 108,
      likes: 335,
      views: 27400,
      timestamp: "1h",
      isConnectionPost: true,
    },
    {
      id: 14,
      username: "Tech Diversity",
      handle: "WomenTechNetwork",
      content: "Like & repost. Let's connect🔜",
      comments: 52,
      reposts: 116,
      likes: 398,
      views: 32500,
      timestamp: "4h",
      isConnectionPost: true,
    },
    {
      id: 15,
      username: "AI Expert",
      handle: "AIConnections",
      content: "Full-Stack here! Let’s connect!",
      comments: 40,
      reposts: 93,
      likes: 276,
      views: 25700,
      timestamp: "7h",
      isConnectionPost: true,
    },
    {
      id: 16,
      username: "Business Pro",
      handle: "ConsultantNetwork",
      content: "Let's connect and share business insights! 🌍",
      comments: 46,
      reposts: 102,
      likes: 312,
      views: 29800,
      timestamp: "2h",
      isConnectionPost: true,
    }
  ],
  [
    {
      id: 17,
      username: 'Startup Mentor',
      handle: 'StartupGuide',
      content: 'Hey let’s connect 👋',
      comments: 12,
      reposts: 57,
      likes: 102,
      views: 15000,
      timestamp: '1h',
      isConnectionPost: true,
    },
    {
      id: 18,
      username: 'Marketing Pro',
      handle: 'MarketingGuru',
      content: "Let's connect! Marketing expert here 📈",
      comments: 18,
      reposts: 33,
      likes: 250,
      views: 22000,
      timestamp: '3h',
      isConnectionPost: true,
    },
    {
      id: 19,
      username: 'Design Thinker',
      handle: 'DesignPro',
      content: "Less than 1000 followers? Let's connect!",
      comments: 8,
      reposts: 44,
      likes: 175,
      views: 13000,
      timestamp: '2h',
      isConnectionPost: true,
    },
    {
      id: 20,
      username: 'Data Scientist',
      handle: 'DataPro',
      content: 'Say “yo”, hit the ❤️ & let’s connect! ⬇️',
      comments: 21,
      reposts: 66,
      likes: 310,
      views: 18000,
      timestamp: '2h',
      isConnectionPost: true,
    },
    {
      id: 21,
      username: 'Cloud Expert',
      handle: 'CloudPro',
      content: "let's connect!",
      comments: 10,
      reposts: 28,
      likes: 95,
      views: 14500,
      timestamp: '3h',
      isConnectionPost: true,
    },
    {
      id: 22,
      username: 'Security Pro',
      handle: 'CyberSec',
      content: "Paste your handle let's connect 🚨",
      comments: 14,
      reposts: 39,
      likes: 120,
      views: 17000,
      timestamp: '5h',
      isConnectionPost: true,
    },
    {
      id: 23,
      username: 'Blockchain Dev',
      handle: 'BlockchainPro',
      content: "Let’s connect! Developer here!",
      comments: 16,
      reposts: 45,
      likes: 140,
      views: 16000,
      timestamp: '1h',
      isConnectionPost: true,
    },
    {
      id: 24,
      username: 'Product Manager',
      handle: 'ProductPro',
      content: 'Awesome! Followed. Let’s connect',
      comments: 9,
      reposts: 31,
      likes: 200,
      views: 15500,
      timestamp: '4h',
      isConnectionPost: true,
    }
  ]
  
  
]

const meaningfulTweets: Tweet[][] = [
  [
    {
      id: 33,
      username: "Tech Insights",
      handle: "TechAnalyst",
      content: "I’m going to end your fear of rejection. (women, business, public speaking etc)<br/><br/>Understand that everything that you desire is on the opposite of what you fear.<br/><br/>What if I told you that your 4th business will make you a millionaire, how excited would you be at the first time?<br/><br/>⬇️",
      comments: 89,
      reposts: 445,
      likes: 1287,
      views: 89300,
      timestamp: "1h",
    },
    {
      id: 34,
      username: "Data Science Daily",
      handle: "DataScientist",
      content: "Your future self is watching you right now through memories. Make them proud. What action you took/will you take today?",
      comments: 156,
      reposts: 567,
      likes: 2341,
      views: 102400,
      timestamp: "3h",
    },
    {
      id: 35,
      username: "Startup Chronicle",
      handle: "StartupNews",
      content: "How many of you actually grindin' instead of partying at this beautiful friday night?🤔🌃",
      comments: 234,
      reposts: 890,
      likes: 3456,
      views: 150000,
      timestamp: "5h",
    },
    {
      id: 36,
      username: "Product Hunt",
      handle: "ProductHunt",
      content: "Unpopular opinion. <br/><br/>Building all day is the fancy way of procrastination. <br/><br/>Basically you are tricking your brain. <br/><br/>You make yourself believe that you worked a lot.<br/><br/>But it’s not about the time you put in but about the quality of your work.",
      comments: 445,
      reposts: 1200,
      likes: 4567,
      views: 180000,
      timestamp: "7h",
    },
    {
      id: 37,
      username: "Climate Tech",
      handle: "ClimateTechToday",
      content: "in general how do you validate your idea? how do you collect useful feedback ASAP?",
      comments: 312,
      reposts: 678,
      likes: 2345,
      views: 95600,
      timestamp: "2h",
    },
    {
      id: 38,
      username: "Quantum Computing",
      handle: "QuantumInsider",
      content: "What’s the best tool for collecting an email waitlist?",
      comments: 267,
      reposts: 534,
      likes: 1876,
      views: 87200,
      timestamp: "4h",
    },
    {
      id: 39,
      username: "Biotech Pioneer",
      handle: "BiotechNews",
      content: "📈What’s one productivity hack that changed the way you work?",
      comments: 401,
      reposts: 912,
      likes: 4123,
      views: 156700,
      timestamp: "6h",
    },
    {
      id: 40,
      username: "Space Exploration",
      handle: "SpaceTech",
      content: "☕️Coffee thought: Your MVP is not about building a perfect product. It's about testing your riskiest assumption. What's yours?",
      comments: 389,
      reposts: 756,
      likes: 3456,
      views: 142500,
      timestamp: "1h",
    }


    ],
  [
    {
      id: 41,
      username: "AI Research",
      handle: "AIScience",
      content: "Spend 2 hours working ON your business, not IN it. Step back, look at the big picture. You might be surprised what you see.👨‍💻",
      comments: 289,
      reposts: 645,
      likes: 2287,
      views: 92300,
      timestamp: "2h",
    },
    {
      id: 42,
      username: "Robotics Today",
      handle: "RoboticsFuture",
      content: "Did you start with a todo app?",
      comments: 176,
      reposts: 467,
      likes: 1941,
      views: 82400,
      timestamp: "4h",
    },
    {
      id: 43,
      username: "Web3 Insights",
      handle: "Web3Future",
      content: "I didn’t write a single line of code for this MVP.<br/><br/>Here’s the exact process I followed to build it, FAST and efficiently.",
      comments: 334,
      reposts: 790,
      likes: 2456,
      views: 110000,
      timestamp: "3h",
    },
    {
      id: 44,
      username: "Green Energy",
      handle: "CleanTechNews",
      content: "Build products that solve your own problems.<br/><br/>It's the best way to ensure you're working on something that matters to you.",
      comments: 245,
      reposts: 900,
      likes: 3567,
      views: 130000,
      timestamp: "5h",
    },
    {
      id: 45,
      username: "Neural Tech",
      handle: "BrainInterface",
      content: "- 𝕏 is free<br/>- reddit is free<br/>-vercel is free<br/>-vs code is free<br/>-v0 is $20/month<br/><br/>what’s your excuse?",
      comments: 412,
      reposts: 878,
      likes: 4345,
      views: 165600,
      timestamp: "1h",
    },
    {
      id: 46,
      username: "Future Transport",
      handle: "MobilityTech",
      content: "Build a daily habit of questioning what could be improved in your daily workflow. Thats how you find ideas at the beginning.",
      comments: 367,
      reposts: 734,
      likes: 2876,
      views: 97200,
      timestamp: "6h",
    },
    {
      id: 47,
      username: "Quantum Physics",
      handle: "QuantumNews",
      content: "2025 really be like: <br/><br/>monday: grinding <br/>tuesday: still grinding <br/>wednesday: grinding harder <br/>thursday: questioning life <br/>friday: back to grinding <br/>saturday: 'you never hang out anymore' <br/>sunday: planning next week's grind <br/><br/>we're not trapped, we're transforming",
      comments: 501,
      reposts: 1012,
      likes: 5123,
      views: 186700,
      timestamp: "2h",
    },
    {
      id: 48,
      username: "Tech Ethics",
      handle: "AIEthics",
      content: "Is it better to focus on building ONE product or building a bunch?",
      comments: 289,
      reposts: 656,
      likes: 2456,
      views: 112500,
      timestamp: "4h",
    }
  ],
  [
    {
      id: 49,
      username: "Materials Science",
      handle: "NewMaterials",
      content: "If you won the lottery tomorrow, what's the first thing you would do?",
      comments: 189,
      reposts: 445,
      likes: 1687,
      views: 79300,
      timestamp: "3h",
    },
    {
      id: 50,
      username: "Cyber Security",
      handle: "SecurityAlert",
      content: "🤖if any AI helps you in your code add this to the end of every prompt:<br/><br/>,,Do you need clarification?<br/><br/>’’thank me later, it’s a gamechanger",
      comments: 256,
      reposts: 767,
      likes: 2941,
      views: 122400,
      timestamp: "5h",
    },
    {
      id: 51,
      username: "Future Medicine",
      handle: "MedTechNews",
      content: "I went to the Chinese restaurant and asked what they are cooking today: <br/><br/>They said they just cooked OpenAI.",
      comments: 334,
      reposts: 890,
      likes: 3456,
      views: 140000,
      timestamp: "2h",
    },
    {
      id: 52,
      username: "Digital Privacy",
      handle: "PrivacyTech",
      content: "As a solopreneur, what’s the best place to live in Europe?<br/><br/>(or with a 2-3member team doesnt really matter)",
      comments: 445,
      reposts: 1100,
      likes: 4167,
      views: 160000,
      timestamp: "4h",
    },
    {
      id: 53,
      username: "Fusion Energy",
      handle: "FusionUpdate",
      content: "My simple framework for product ideas:<br/><br/>• Find a problem<br/>• Build a waitlist<br/>• Pre-sell to 10 people<br/>• Build MVP in 2 weeks<br/>• Launch<br/>• Improve based on feedback<br/><br/>That's it. No magic.",
      comments: 512,
      reposts: 1678,
      likes: 6345,
      views: 195600,
      timestamp: "1h",
    },
    {
      id: 54,
      username: "AR Technology",
      handle: "AugmentedWorld",
      content: "There are 2 types of builders:<br/><br/>A. Ship early.<br/><br/>B. Never Ship <br/><br/>Which one are you?",
      comments: 367,
      reposts: 834,
      likes: 3876,
      views: 147200,
      timestamp: "6h",
    },
    {
      id: 55,
      username: "Ocean Tech",
      handle: "MarineTech",
      content: "How can i learn to build AI agents???",
      comments: 301,
      reposts: 712,
      likes: 2123,
      views: 96700,
      timestamp: "3h",
    },
    {
        id: 56,
        username: "Space Mining",
        handle: "AsteroidTech",
        content: "A. Build fast, sell later.<br/><br/>B. Validate first, build slow.<br/><br/>Which team are you on? ",
        comments: 489,
        reposts: 956,
        likes: 4456,
        views: 172500,
        timestamp: "5h",
      }
  ]
]

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export default function TweetDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const [filterEnabled, setFilterEnabled] = useState(false)
  const scrollPositionRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [contentOffset, setContentOffset] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down")
  const [isScrollingEnabled, setIsScrollingEnabled] = useState(true)
  const [connectionTweetsIndex, setConnectionTweetsIndex] = useState(0)
  const [meaningfulTweetsIndex, setMeaningfulTweetsIndex] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scrollSpeed = 1
    const maxScroll = container.scrollHeight - container.clientHeight
    const fastScrollSpeed = 15

    const smoothScroll = () => {
      if (!container || !isScrollingEnabled) return

      if (scrollDirection === "down") {
        scrollPositionRef.current += scrollSpeed

        if (scrollPositionRef.current >= maxScroll) {
          setScrollDirection("up")
        }
      } else {
        scrollPositionRef.current -= fastScrollSpeed

        if (scrollPositionRef.current <= 0) {
          scrollPositionRef.current = 0
          triggerPullToRefresh()
          setScrollDirection("down")
        }
      }

      container.scrollTop = scrollPositionRef.current
      animationFrameRef.current = requestAnimationFrame(smoothScroll)
    }

    animationFrameRef.current = requestAnimationFrame(smoothScroll)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scrollDirection, isScrollingEnabled])

  const triggerPullToRefresh = () => {
    setIsScrollingEnabled(false)
    setIsLoading(true)
    setContentOffset(50)

    setTimeout(() => {
      const newConnectionIndex = (connectionTweetsIndex + 1) % connectionTweets.length
      const newMeaningfulIndex = (meaningfulTweetsIndex + 1) % meaningfulTweets.length
      
      setConnectionTweetsIndex(newConnectionIndex)
      setMeaningfulTweetsIndex(newMeaningfulIndex)
      setRefreshCount(prev => prev + 1)

      setIsLoading(false)
      setContentOffset(0)
      setIsScrollingEnabled(true)
    }, 2000)
  }

  const currentConnectionTweets = connectionTweets[connectionTweetsIndex]
  const currentMeaningfulTweets = meaningfulTweets[meaningfulTweetsIndex]

  const displayTweets = filterEnabled 
    ? currentMeaningfulTweets.slice(0, 8) 
    : currentConnectionTweets.slice(0, 8)

  const formatContent = (content: string) => {
    return content.split('<br/>').map((part, index, array) => (
      <React.Fragment key={index}>
        {part}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const highlightConnectionText = (text: string) => {
    const parts = text.split(/(Let's connect|let's connect)/i)
    return parts.map((part, index) => {
      if (part.toLowerCase() === "let's connect") {
        return (
          <span key={index} className="bg-yellow-100 px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }
  
  return (
    <div className="bg-white text-black rounded-xl shadow-lg p-0 max-w-xl w-full relative overflow-hidden">
      <div className="sticky top-0 z-20 bg-white">
        <div className="border-b border-gray-100 p-3">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${filterEnabled ? "bg-[#2563eb]" : "bg-gray-200"}`}
              >
                <img src="/logo.png" alt="FilterX Logo" className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-[15px]">FilterX</h3>
                  {filterEnabled && (
                    <span className="text-[13px] text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                      Enabled
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-[13px]">Hide generic connection requests</p>
              </div>
            </div>
            <button
              onClick={() => setFilterEnabled(!filterEnabled)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300"
              style={{ backgroundColor: filterEnabled ? "#2563eb" : "#e5e7eb" }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  filterEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-[400px] overflow-y-hidden relative"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          className="absolute left-0 right-0 flex justify-center transition-all duration-300 z-10 bg-white"
          style={{
            top: contentOffset > 0 ? '0px' : '-50px',
            height: '50px',
            opacity: isLoading || contentOffset > 0 ? 1 : 0,
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <svg className="animate-spin" viewBox="0 0 24 24" width="32" height="32">
                <g>
                  {[...Array(8)].map((_, i) => (
                    <line
                      key={i}
                      x1="12"
                      y1="4"
                      x2="12"
                      y2="7"
                      stroke={i === 0 ? "#4B5563" : "#9CA3AF"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{
                        transformOrigin: "center",
                        transform: `rotate(${i * 45}deg)`,
                      }}
                    />
                  ))}
                </g>
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">Pull to refresh</div>
          )}
        </div>

        <div
          ref={feedRef}
          className="pt-2"
          style={{
            transform: `translateY(${contentOffset}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {displayTweets.map((tweet, index) => (
            <article
              key={`${tweet.id}-${index}`}
              className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 rounded-full bg-gray-200 p-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center text-[15px] space-x-1">
                    <span className="font-bold hover:underline">{tweet.username}</span>
                    <span className="text-gray-500">@{tweet.handle}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 hover:underline">{tweet.timestamp}</span>
                  </div>

                    <p className="mt-0.5 mb-2 text-[15px] leading-5">
                        {tweet.isConnectionPost ? highlightConnectionText(tweet.content) : formatContent(tweet.content)}
                    </p>
  
                    <div className="flex justify-between items-center mt-2 mr-16 text-gray-500 text-[13px]">
                      <button className="group flex items-center space-x-1 hover:text-[#2563eb]">
                        <div className="p-1.5 group-hover:bg-blue-50 rounded-full">
                          <MessageCircle className="h-[18px] w-[18px]" />
                        </div>
                        <span>{formatNumber(tweet.comments)}</span>
                      </button>
  
                      <button className="group flex items-center space-x-1 hover:text-emerald-500">
                        <div className="p-1.5 group-hover:bg-emerald-50 rounded-full">
                          <Repeat2 className="h-[18px] w-[18px]" />
                        </div>
                        <span>{formatNumber(tweet.reposts)}</span>
                      </button>
  
                      <button className="group flex items-center space-x-1 hover:text-rose-500">
                        <div className="p-1.5 group-hover:bg-rose-50 rounded-full">
                          <Heart className="h-[18px] w-[18px]" />
                        </div>
                        <span>{formatNumber(tweet.likes)}</span>
                      </button>
  
                      <button className="group flex items-center space-x-1 hover:text-[#2563eb]">
                        <div className="p-1.5 group-hover:bg-blue-50 rounded-full">
                          <BarChart2 className="h-[18px] w-[18px]" />
                        </div>
                        <span>{formatNumber(tweet.views)}</span>
                      </button>
  
                      <div className="flex space-x-1">
                        <button className="group p-1.5 hover:text-[#2563eb]">
                          <div className="group-hover:bg-blue-50 rounded-full">
                            <Bookmark className="h-[18px] w-[18px]" />
                          </div>
                        </button>
                        <button className="group p-1.5 hover:text-[#2563eb]">
                          <div className="group-hover:bg-blue-50 rounded-full">
                            <Share className="h-[18px] w-[18px]" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  }