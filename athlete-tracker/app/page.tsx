import Link from "next/link";
import { players } from "./data/players";

const statusColors: Record<string, string> = {
  "NFL Active": "bg-green-100 text-green-800",
  "Post-Football Career": "bg-blue-100 text-blue-800",
  "Coaching/Sports": "bg-orange-100 text-orange-800",
  "Unknown": "bg-gray-100 text-gray-600",
};

const positionColors: Record<string, string> = {
  RB: "bg-red-700",
  WR: "bg-blue-700",
  TE: "bg-purple-700",
  QB: "bg-yellow-600",
  C: "bg-green-700",
  DT: "bg-gray-700",
  DL: "bg-gray-700",
  LB: "bg-indigo-700",
  CB: "bg-pink-700",
  S: "bg-teal-700",
};

export default function Home() {
  const nflActive = players.filter((p) => p.status === "NFL Active").length;
  const postCareer = players.filter((p) => p.status === "Post-Football Career").length;
  const coaching = players.filter((p) => p.status === "Coaching/Sports").length;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 via-red-700 to-gray-900 border-b border-red-900">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-red-700 font-black text-xl">A</span>
            </div>
            <div>
              <p className="text-red-300 text-sm font-semibold tracking-widest uppercase">
                Where Are They Now
              </p>
              <h1 className="text-3xl font-black tracking-tight">
                2015 Alabama Crimson Tide
              </h1>
            </div>
          </div>
          <p className="text-gray-300 text-sm max-w-xl">
            The 2015 Alabama Crimson Tide won the CFP National Championship defeating Clemson 45–40.
            Track what every player on that roster is doing today.
          </p>
        </div>
      </header>

      {/* Stats bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-gray-300 text-sm">
              <strong className="text-white">{nflActive}</strong> still in the NFL
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-gray-300 text-sm">
              <strong className="text-white">{postCareer}</strong> post-football careers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-gray-300 text-sm">
              <strong className="text-white">{coaching}</strong> coaching or in sports
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-500 text-sm">{players.length} players profiled</span>
          </div>
        </div>
      </div>

      {/* Player grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/player/${player.id}`}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-red-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                    positionColors[player.position] ?? "bg-gray-700"
                  }`}
                >
                  {player.imageInitials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {player.name}
                    </h2>
                    <span className="text-gray-500 text-xs shrink-0">#{player.number}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                      {player.position}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[player.status]}`}
                    >
                      {player.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {player.currentRole}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-gray-500 text-xs">{player.hometown}</span>
                <span className="text-red-500 text-xs font-medium group-hover:text-red-400">
                  View profile →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-800 mt-8 py-6 text-center text-gray-600 text-sm">
        Athlete Career Tracker · 2015 Alabama Football · Data updated 2024
      </footer>
    </main>
  );
}
