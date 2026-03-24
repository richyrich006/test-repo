import Link from "next/link";
import { notFound } from "next/navigation";
import { players } from "../../data/players";

const statusColors: Record<string, string> = {
  "NFL Active": "bg-green-900 text-green-300 border border-green-700",
  "Post-Football Career": "bg-blue-900 text-blue-300 border border-blue-700",
  "Coaching/Sports": "bg-orange-900 text-orange-300 border border-orange-700",
  "Unknown": "bg-gray-800 text-gray-400 border border-gray-700",
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

export function generateStaticParams() {
  return players.map((p) => ({ id: p.id }));
}

export default async function PlayerPage(props: PageProps<"/player/[id]">) {
  const { id } = await props.params;
  const player = players.find((p) => p.id === id);

  if (!player) notFound();

  const playerIndex = players.findIndex((p) => p.id === id);
  const prevPlayer = players[playerIndex - 1] ?? null;
  const nextPlayer = players[playerIndex + 1] ?? null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-red-400 hover:text-red-300">
            ← 2015 Alabama Roster
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">{player.name}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Player header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-2xl shrink-0 ${
                positionColors[player.position] ?? "bg-gray-700"
              }`}
            >
              {player.imageInitials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-black tracking-tight mb-1">{player.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-400 font-semibold">
                      #{player.number} · {player.position}
                    </span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-400 text-sm">{player.hometown}</span>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusColors[player.status]}`}
                >
                  {player.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* What they're doing now */}
            <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xs font-bold tracking-widest text-red-400 uppercase mb-4">
                What They&apos;re Doing Now
              </h2>
              <h3 className="text-lg font-bold text-white mb-3">{player.currentRole}</h3>
              <p className="text-gray-300 leading-relaxed">{player.currentSummary}</p>

              {player.currentLink && (
                <a
                  href={player.currentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  <span>{player.currentLinkLabel ?? "Learn more"}</span>
                  <span>↗</span>
                </a>
              )}
            </section>

            {/* NFL Career */}
            {(player.nflDrafted || player.nflCareer) && (
              <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xs font-bold tracking-widest text-red-400 uppercase mb-4">
                  NFL Career
                </h2>
                {player.nflDrafted && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Draft</span>
                    <p className="text-gray-200 mt-0.5">{player.nflDrafted}</p>
                  </div>
                )}
                {player.nflCareer && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Teams & Years</span>
                    <p className="text-gray-200 mt-0.5">{player.nflCareer}</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
                Player Info
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Position</dt>
                  <dd className="text-gray-200 font-semibold mt-0.5">{player.position}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Jersey</dt>
                  <dd className="text-gray-200 font-semibold mt-0.5">#{player.number}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Hometown</dt>
                  <dd className="text-gray-200 mt-0.5">{player.hometown}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Team</dt>
                  <dd className="text-gray-200 mt-0.5">2015 Alabama Crimson Tide</dd>
                </div>
              </dl>
            </div>

            {/* Suggest correction */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                Know Something We Don&apos;t?
              </h2>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">
                Help us keep this profile accurate. Submit a correction or update.
              </p>
              <button className="w-full text-center text-xs font-semibold text-red-400 border border-red-900 hover:border-red-700 rounded-lg py-2 transition-colors">
                Suggest an Update
              </button>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {prevPlayer ? (
            <Link
              href={`/player/${prevPlayer.id}`}
              className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-red-800 rounded-xl px-4 py-3 transition-all group"
            >
              <span className="text-gray-600 group-hover:text-red-500">←</span>
              <div>
                <p className="text-xs text-gray-500">Previous</p>
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white">
                  {prevPlayer.name}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPlayer ? (
            <Link
              href={`/player/${nextPlayer.id}`}
              className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-red-800 rounded-xl px-4 py-3 transition-all group text-right ml-auto"
            >
              <div>
                <p className="text-xs text-gray-500">Next</p>
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white">
                  {nextPlayer.name}
                </p>
              </div>
              <span className="text-gray-600 group-hover:text-red-500">→</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
