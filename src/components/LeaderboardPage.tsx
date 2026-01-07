import { motion } from 'motion/react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { UserNavbar } from './UserNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

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
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-600">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20 md:pb-8">
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="leaderboard" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-gray-900 mb-2">Community Leaderboard</h1>
        <p className="text-xl text-gray-600 mb-8">See where you stand among top recyclers</p>

        {/* Current User Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-[#3BAF69] to-[#2d9355] text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  🥉
                </div>
                <div>
                  <div className="text-sm text-green-100 mb-1">Your Rank</div>
                  <div className="text-3xl">#3</div>
                  <div className="text-green-100">out of 1,247 recyclers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-100 mb-1">Your Stats</div>
                <div className="text-2xl">145 kg</div>
                <div className="text-green-100">₹2,850 donated</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-gray-900 mb-1">Keep it up! 🎯</div>
              <div className="text-sm text-gray-600">
                You're only 123 kg away from 2nd place. Recycle more to climb the leaderboard!
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="all-time" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value="all-time" className="space-y-3">
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:order-1"
              >
                <Card className="p-6 text-center border-2 border-gray-300 bg-gradient-to-b from-gray-50 to-white">
                  <div className="text-5xl mb-3">🥈</div>
                  <div className="text-2xl mb-2">#2</div>
                  <div className="text-xl text-gray-900 mb-2">{leaderboardData[1].name}</div>
                  <div className="text-gray-600 mb-1">{leaderboardData[1].waste} kg recycled</div>
                  <div className="text-sm text-gray-500">₹{leaderboardData[1].donation} donated</div>
                </Card>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="md:order-0"
              >
                <Card className="p-6 text-center border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white md:-mt-4">
                  <div className="text-6xl mb-3">👑</div>
                  <div className="text-3xl mb-2">#1</div>
                  <div className="text-2xl text-gray-900 mb-2">{leaderboardData[0].name}</div>
                  <div className="text-gray-600 mb-1">{leaderboardData[0].waste} kg recycled</div>
                  <div className="text-sm text-gray-500">₹{leaderboardData[0].donation} donated</div>
                  <Badge className="mt-3 bg-yellow-400 text-yellow-900">Champion</Badge>
                </Card>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:order-2"
              >
                <Card className="p-6 text-center border-2 border-amber-600 bg-gradient-to-b from-amber-50 to-white">
                  <div className="text-5xl mb-3">🥉</div>
                  <div className="text-2xl mb-2">#3</div>
                  <div className="text-xl text-gray-900 mb-2">{leaderboardData[2].name}</div>
                  <div className="text-gray-600 mb-1">{leaderboardData[2].waste} kg recycled</div>
                  <div className="text-sm text-gray-500">₹{leaderboardData[2].donation} donated</div>
                  <Badge className="mt-3 bg-green-100 text-green-700">That's you!</Badge>
                </Card>
              </motion.div>
            </div>

            {/* Rest of the leaderboard */}
            {leaderboardData.slice(3).map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className={`p-4 hover:shadow-md transition-shadow ${
                  user.isCurrentUser ? 'border-2 border-[#3BAF69] bg-green-50' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {getRankIcon(user.rank)}
                      </div>
                      <div>
                        <div className="text-gray-900 flex items-center gap-2">
                          {user.name}
                          {user.isCurrentUser && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.waste} kg recycled • ₹{user.donation} donated
                        </div>
                      </div>
                    </div>
                    {user.badge && (
                      <div className="text-2xl">{user.badge}</div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-3">
            <Card className="p-8 text-center">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Weekly leaderboard coming soon!</p>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-3">
            <Card className="p-8 text-center">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Monthly leaderboard coming soon!</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
