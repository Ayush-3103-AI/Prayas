import { Trophy, Medal, Crown, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface LeaderboardProps {
  userName: string;
}

interface LeaderEntry {
  rank: number;
  name: string;
  recycled: number;
  donated: number;
  pickups: number;
  badges: number;
}

export default function LeaderboardPage({ userName }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('monthly');

  const leaderboardData: Record<string, LeaderEntry[]> = {
    weekly: [
      { rank: 1, name: 'Amit Patel', recycled: 12.5, donated: 625, pickups: 3, badges: 8 },
      { rank: 2, name: 'Sneha Reddy', recycled: 10.2, donated: 510, pickups: 2, badges: 6 },
      { rank: 3, name: 'Priya Sharma', recycled: 8.7, donated: 435, pickups: 2, badges: 3 },
      { rank: 4, name: 'Rahul Verma', recycled: 7.5, donated: 375, pickups: 2, badges: 5 },
      { rank: 5, name: 'Anjali Kumar', recycled: 6.8, donated: 340, pickups: 1, badges: 4 },
    ],
    monthly: [
      { rank: 1, name: 'Rajesh Kumar', recycled: 45.3, donated: 2265, pickups: 8, badges: 12 },
      { rank: 2, name: 'Meera Shah', recycled: 38.7, donated: 1935, pickups: 7, badges: 10 },
      { rank: 3, name: 'Priya Sharma', recycled: 32.5, donated: 1840, pickups: 6, badges: 3 },
      { rank: 4, name: 'Vikram Singh', recycled: 28.9, donated: 1445, pickups: 5, badges: 8 },
      { rank: 5, name: 'Kavita Nair', recycled: 25.6, donated: 1280, pickups: 5, badges: 7 },
      { rank: 6, name: 'Arjun Mehta', recycled: 22.4, donated: 1120, pickups: 4, badges: 6 },
      { rank: 7, name: 'Pooja Desai', recycled: 19.8, donated: 990, pickups: 4, badges: 5 },
      { rank: 8, name: 'Suresh Iyer', recycled: 17.3, donated: 865, pickups: 3, badges: 4 },
    ],
    'all-time': [
      { rank: 1, name: 'Amit Patel', recycled: 285.7, donated: 14285, pickups: 42, badges: 18 },
      { rank: 2, name: 'Sneha Reddy', recycled: 243.2, donated: 12160, pickups: 38, badges: 16 },
      { rank: 3, name: 'Rajesh Kumar', recycled: 198.5, donated: 9925, pickups: 32, badges: 15 },
      { rank: 4, name: 'Priya Sharma', recycled: 145.8, donated: 7290, pickups: 24, badges: 12 },
      { rank: 5, name: 'Meera Shah', recycled: 132.4, donated: 6620, pickups: 22, badges: 13 },
      { rank: 6, name: 'Vikram Singh', recycled: 118.9, donated: 5945, pickups: 19, badges: 11 },
      { rank: 7, name: 'Kavita Nair', recycled: 105.3, donated: 5265, pickups: 17, badges: 10 },
      { rank: 8, name: 'Arjun Mehta', recycled: 92.7, donated: 4635, pickups: 15, badges: 9 },
    ],
  };

  const currentData = leaderboardData[timeframe];
  const userRank = currentData.find(entry => entry.name === userName);
  const userRankNumber = userRank?.rank || currentData.length + 1;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <Trophy className="w-5 h-5 text-gray-400" />;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white';
    if (rank === 3) return 'bg-gradient-to-br from-amber-500 to-amber-700 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div>
        <h1 className="text-gray-900 mb-2">Community Leaderboard</h1>
        <p className="text-gray-600">See how you rank among other recyclers</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 overflow-x-auto">
        {(['weekly', 'monthly', 'all-time'] as const).map((t) => (
          <Button
            key={t}
            variant={timeframe === t ? 'default' : 'outline'}
            onClick={() => setTimeframe(t)}
            className={timeframe === t ? 'bg-[#3BAF69] hover:bg-[#2d9755]' : ''}
          >
            {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
          </Button>
        ))}
      </div>

      {/* Your Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-green-100 mb-1">Your Rank</div>
              <div className="text-white">#{userRank.rank}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-white mb-1">{userRank.recycled} kg</div>
              <div className="text-green-100">Recycled</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-white mb-1">₹{userRank.donated}</div>
              <div className="text-green-100">Donated</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-white mb-1">{userRank.badges}</div>
              <div className="text-green-100">Badges</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-6">
        {currentData.slice(0, 3).map((entry, index) => {
          const podiumOrder = [1, 0, 2];
          const actualEntry = currentData[podiumOrder[index]];
          const heights = ['h-48', 'h-56', 'h-40'];
          const bgColors = [
            'from-gray-100 to-gray-200',
            'from-yellow-100 to-yellow-200',
            'from-amber-100 to-amber-200',
          ];
          
          return (
            <div key={actualEntry.rank} className="flex flex-col items-center">
              <div className={`w-full bg-gradient-to-br ${bgColors[podiumOrder.indexOf(actualEntry.rank)]} ${heights[podiumOrder.indexOf(actualEntry.rank)]} rounded-2xl border-2 ${
                actualEntry.rank === 1 ? 'border-yellow-400' :
                actualEntry.rank === 2 ? 'border-gray-300' :
                'border-amber-500'
              } flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-3">
                  {getRankIcon(actualEntry.rank)}
                </div>
                <div className={`w-16 h-16 ${getRankBadgeColor(actualEntry.rank)} rounded-full flex items-center justify-center mb-3`}>
                  <span className="text-2xl">#{actualEntry.rank}</span>
                </div>
                <div className="text-gray-900 text-center mb-2">{actualEntry.name}</div>
                <div className="text-[#3BAF69]">{actualEntry.recycled} kg</div>
                <div className="text-gray-600">₹{actualEntry.donated}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Rank</th>
                <th className="px-6 py-4 text-left text-gray-700">Name</th>
                <th className="px-6 py-4 text-right text-gray-700">Recycled (kg)</th>
                <th className="px-6 py-4 text-right text-gray-700">Donated (₹)</th>
                <th className="px-6 py-4 text-right text-gray-700">Pickups</th>
                <th className="px-6 py-4 text-right text-gray-700">Badges</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    entry.name === userName ? 'bg-green-50 hover:bg-green-100' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank)}
                      <span className={`${entry.rank <= 3 ? 'text-gray-900' : 'text-gray-700'}`}>
                        #{entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{entry.name}</span>
                      {entry.name === userName && (
                        <span className="px-2 py-1 bg-[#3BAF69] text-white rounded-full text-xs">You</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">{entry.recycled}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{entry.donated}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{entry.pickups}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Award className="w-4 h-4 text-[#3BAF69]" />
                      <span className="text-gray-900">{entry.badges}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl border text-center">
        <TrendingUp className="w-12 h-12 text-[#3BAF69] mx-auto mb-4" />
        <h3 className="text-gray-900 mb-2">Keep Up the Great Work!</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {userRankNumber <= 3
            ? "You're doing amazing! Your contribution is making a real difference in our community."
            : `You're currently ranked #${userRankNumber}. Keep recycling to climb up the leaderboard and earn more badges!`}
        </p>
      </div>
    </div>
  );
}
