import { Trophy, Medal, Award, TrendingUp, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User } from '../../App';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface LeaderboardProps {
  user: User;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  wasteRecycled: number;
  donation: number;
  pickups: number;
  streak: number;
  isCurrentUser?: boolean;
}

export function Leaderboard({ user }: LeaderboardProps) {
  // Mock data
  const weeklyLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: 'U042', name: 'Anika Patel', wasteRecycled: 18.5, donation: 1850, pickups: 3, streak: 12 },
    { rank: 2, userId: 'U087', name: 'Rohan Mehta', wasteRecycled: 16.2, donation: 1620, pickups: 2, streak: 8 },
    { rank: 3, userId: 'U015', name: 'Kavya Singh', wasteRecycled: 14.8, donation: 1480, pickups: 2, streak: 15 },
    { rank: 4, userId: 'U103', name: 'Vikram Sharma', wasteRecycled: 12.5, donation: 1250, pickups: 2, streak: 5 },
    { rank: 5, userId: 'U067', name: 'Sneha Gupta', wasteRecycled: 11.3, donation: 1130, pickups: 1, streak: 7 },
  ];

  const monthlyLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: 'U015', name: 'Kavya Singh', wasteRecycled: 52.3, donation: 5230, pickups: 8, streak: 15 },
    { rank: 2, userId: 'U042', name: 'Anika Patel', wasteRecycled: 48.7, donation: 4870, pickups: 7, streak: 12 },
    { rank: 3, userId: 'U087', name: 'Rohan Mehta', wasteRecycled: 45.2, donation: 4520, pickups: 6, streak: 8 },
    { rank: 4, userId: 'U103', name: 'Vikram Sharma', wasteRecycled: 42.8, donation: 4280, pickups: 6, streak: 5 },
    { rank: 5, userId: 'U156', name: 'Arjun Verma', wasteRecycled: 39.5, donation: 3950, pickups: 5, streak: 9 },
  ];

  const allTimeLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: 'U003', name: 'Meera Gupta', wasteRecycled: 324.5, donation: 32450, pickups: 42, streak: 28 },
    { rank: 2, userId: 'U008', name: 'Amit Verma', wasteRecycled: 298.2, donation: 29820, pickups: 38, streak: 22 },
    { rank: 3, userId: 'U015', name: 'Kavya Singh', wasteRecycled: 276.8, donation: 27680, pickups: 35, streak: 15 },
    { rank: 4, userId: 'U022', name: 'Rajesh Kumar', wasteRecycled: 245.3, donation: 24530, pickups: 32, streak: 18 },
    { rank: 5, userId: 'U029', name: 'Priya Sharma', wasteRecycled: 228.7, donation: 22870, pickups: 30, streak: 25 },
    // ... more entries ...
    { rank: 23, userId: user.id, name: user.name, wasteRecycled: 47.5, donation: 4750, pickups: 12, streak: 3, isCurrentUser: true },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <Medal className="w-6 h-6 text-white" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <Award className="w-6 h-6 text-white" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-gray-700">#{rank}</span>
      </div>
    );
  };

  const LeaderboardTable = ({ data }: { data: LeaderboardEntry[] }) => (
    <div className="space-y-3">
      {data.map((entry) => (
        <Card
          key={entry.userId}
          className={`border-2 transition-all ${
            entry.isCurrentUser
              ? 'border-green-400 bg-green-50 shadow-md'
              : 'border-green-100 hover:border-green-200'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                {getRankBadge(entry.rank)}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-900 truncate">{entry.name}</p>
                  {entry.isCurrentUser && (
                    <Badge className="bg-green-600 hover:bg-green-700">You</Badge>
                  )}
                  {entry.streak >= 7 && (
                    <Badge variant="outline" className="border-orange-500 text-orange-600">
                      <Flame className="w-3 h-3 mr-1" />
                      {entry.streak} day streak
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Recycled</p>
                    <p className="text-green-600">{entry.wasteRecycled} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Donated</p>
                    <p className="text-green-600">₹{entry.donation.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pickups</p>
                    <p className="text-gray-900">{entry.pickups}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Streak</p>
                    <p className="text-gray-900">{entry.streak} days</p>
                  </div>
                </div>
              </div>

              {/* Rank Badge for mobile */}
              <div className="flex-shrink-0 md:hidden">
                <p className="text-gray-600">#{entry.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-green-900 mb-2">Community Leaderboard</h1>
        <p className="text-gray-600">See how you rank among fellow eco-warriors</p>
      </div>

      {/* User's Rank Card */}
      <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-600 mb-2">Your Current Rank</p>
              <div className="flex items-center gap-3">
                <div className="text-green-600">#23</div>
                <Badge className="bg-green-600 hover:bg-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Up 5 places
                </Badge>
              </div>
            </div>
            
            <div className="h-12 w-px bg-green-300 hidden md:block" />

            <div className="grid grid-cols-3 gap-8 flex-1">
              <div className="text-center md:text-left">
                <p className="text-gray-600 mb-1">Recycled</p>
                <p className="text-green-600">47.5 kg</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-600 mb-1">Donated</p>
                <p className="text-green-600">₹4,750</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-600 mb-1">Streak</p>
                <p className="text-green-600">3 days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="border-green-100 bg-gradient-to-r from-green-600 to-green-700">
        <CardContent className="p-6 text-center text-white">
          <p className="text-white mb-2">🎯 You're just 2.8 kg away from entering the top 20!</p>
          <p className="text-green-100">Keep going! Every bit of recycling makes a difference.</p>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="all-time" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto mb-8">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">Top Recyclers This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={weeklyLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">Top Recyclers This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={monthlyLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-time">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">All-Time Top Recyclers</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable data={allTimeLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Milestones */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900">Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-900">Reach 50kg recycled</p>
                <p className="text-green-600">95%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
              <p className="text-gray-600 mt-2">Just 2.5 kg to go! 🎯</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-900">Complete 15 pickups</p>
                <p className="text-green-600">80%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
              <p className="text-gray-600 mt-2">3 more pickups to unlock this achievement!</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-900">Reach top 20 on leaderboard</p>
                <p className="text-green-600">92%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-gray-600 mt-2">So close! Keep recycling! 🚀</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
