import { motion } from 'motion/react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { UserNavbar } from './UserNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface LeaderboardPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function LeaderboardPage({ onNavigate, onLogout }: LeaderboardPageProps) {
  const leaderboardData = [
    { rank: 1, name: 'Rajesh Kumar', waste: 285, donation: 4250, badge: '👑', isCurrentUser: false },
    { rank: 2, name: 'Anjali Patel', waste: 268, donation: 4020, badge: '🥈', isCurrentUser: false },
    { rank: 3, name: 'Priya Sharma', waste: 145, donation: 2850, badge: '🥉', isCurrentUser: true },
    { rank: 4, name: 'Vikram Singh', waste: 132, donation: 2640, badge: '', isCurrentUser: false },
    { rank: 5, name: 'Neha Gupta', waste: 128, donation: 2560, badge: '', isCurrentUser: false },
    { rank: 6, name: 'Arun Mehta', waste: 115, donation: 2300, badge: '', isCurrentUser: false },
    { rank: 7, name: 'Kavita Reddy', waste: 108, donation: 2160, badge: '', isCurrentUser: false },
    { rank: 8, name: 'Suresh Rao', waste: 95, donation: 1900, badge: '', isCurrentUser: false },
    { rank: 9, name: 'Deepak Verma', waste: 88, donation: 1760, badge: '', isCurrentUser: false },
    { rank: 10, name: 'Pooja Nair', waste: 82, donation: 1640, badge: '', isCurrentUser: false },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-amber-400" strokeWidth={2} />;
      case 2:
        return <Medal className="w-6 h-6 text-white/60" strokeWidth={2} />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" strokeWidth={2} />;
      default:
        return <span className="text-white/60">#{rank}</span>;
    }
  };

  return (
      <div className="min-h-screen">
        <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="leaderboard" />
        
        <div className="md:ml-64 container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl text-white mb-2">Community Leaderboard</h1>
          <p className="text-xl text-white/60 mb-8">See where you stand among top recyclers</p>

          {/* Current User Rank Card */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <RecycledPaperCard className="p-6" glowColor="emerald">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-2xl">
                    🥉
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Your Rank</div>
                    <div className="text-3xl text-white">#3</div>
                    <div className="text-white/60">out of 1,247 recyclers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60 mb-1">Your Stats</div>
                  <div className="text-2xl text-white">145 kg</div>
                  <div className="text-white/60">₹2,850 donated</div>
                </div>
              </div>
            </RecycledPaperCard>
          </motion.div>

          {/* Motivational Message */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
            <RecycledPaperCard className="p-4" glowColor="blue">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-white mb-1">Keep it up!</div>
                  <div className="text-sm text-white/60">
                    You're only 123 kg away from 2nd place. Recycle more to climb the leaderboard!
                  </div>
                </div>
              </div>
            </RecycledPaperCard>
          </motion.div>

          <Tabs defaultValue="all-time" className="space-y-6">
            <TabsList className="bg-white/5 border-white/10">
              <TabsTrigger value="weekly" className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/5">This Week</TabsTrigger>
              <TabsTrigger value="monthly" className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/5">This Month</TabsTrigger>
              <TabsTrigger value="all-time" className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/5">All Time</TabsTrigger>
            </TabsList>

            <TabsContent value="all-time" className="space-y-3">
              {/* Top 3 Podium */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* 2nd Place */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="md:order-1">
                  <RecycledPaperCard className="p-6 text-center" glowColor="blue">
                    <div className="text-5xl mb-3">🥈</div>
                    <div className="text-2xl mb-2 text-white">#2</div>
                    <div className="text-xl text-white mb-2">{leaderboardData[1].name}</div>
                    <div className="text-white/80 mb-1">{leaderboardData[1].waste} kg recycled</div>
                    <div className="text-sm text-white/60">₹{leaderboardData[1].donation} donated</div>
                  </RecycledPaperCard>
                </motion.div>

                {/* 1st Place */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="md:order-0">
                  <RecycledPaperCard className="p-6 text-center md:-mt-4" glowColor="gold">
                    <div className="text-6xl mb-3">👑</div>
                    <div className="text-3xl mb-2 text-white">#1</div>
                    <div className="text-2xl text-white mb-2">{leaderboardData[0].name}</div>
                    <div className="text-white/80 mb-1">{leaderboardData[0].waste} kg recycled</div>
                    <div className="text-sm text-white/60">₹{leaderboardData[0].donation} donated</div>
                    <Badge className="mt-3 bg-amber-500/20 text-amber-400 border-amber-500/30">Champion</Badge>
                  </RecycledPaperCard>
                </motion.div>

                {/* 3rd Place */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="md:order-2">
                  <RecycledPaperCard className="p-6 text-center" glowColor="emerald">
                    <div className="text-5xl mb-3">🥉</div>
                    <div className="text-2xl mb-2 text-white">#3</div>
                    <div className="text-xl text-white mb-2">{leaderboardData[2].name}</div>
                    <div className="text-white/80 mb-1">{leaderboardData[2].waste} kg recycled</div>
                    <div className="text-sm text-white/60">₹{leaderboardData[2].donation} donated</div>
                    <Badge className="mt-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">That's you!</Badge>
                  </RecycledPaperCard>
                </motion.div>
              </div>

              {/* Rest of the leaderboard */}
              {leaderboardData.slice(3).map((user, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                  <RecycledPaperCard className={cn("p-4", user.isCurrentUser && "border-emerald-500/50")} glowColor={user.isCurrentUser ? "emerald" : "blue"}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-full flex items-center justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <div>
                          <div className="text-[#2c1810] flex items-center gap-2 font-semibold">
                            {user.name}
                            {user.isCurrentUser && (
                              <Badge className="bg-emerald-500/20 text-[#6b8e6b] border-emerald-500/30">You</Badge>
                            )}
                          </div>
                          <div className="text-sm text-[#3d2817]/70">
                            {user.waste} kg recycled • ₹{user.donation} donated
                          </div>
                        </div>
                      </div>
                      {user.badge && <div className="text-2xl">{user.badge}</div>}
                    </div>
                  </RecycledPaperCard>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="weekly">
              <RecycledPaperCard className="p-8 text-center" glowColor="emerald">
                <Award className="w-16 h-16 text-white/40 mx-auto mb-4" strokeWidth={1} />
                <p className="text-white/60">Weekly leaderboard coming soon!</p>
              </RecycledPaperCard>
            </TabsContent>

            <TabsContent value="monthly">
              <RecycledPaperCard className="p-8 text-center" glowColor="emerald">
                <Award className="w-16 h-16 text-white/40 mx-auto mb-4" strokeWidth={1} />
                <p className="text-white/60">Monthly leaderboard coming soon!</p>
              </RecycledPaperCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}
