import { COMMITMENTS } from "@/data/commitments";

/**
 * The COMMITMENTS grid — identical markup was duplicated across Home,
 * Mission and MissionVision, so the emoji-vs-photo branching (see
 * commitments.ts) only needs to be written once here.
 */
export default function CommitmentCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {COMMITMENTS.map((c) => (
        <div key={c.title} className="card px-5 py-8 text-center">
          {"image" in c ? (
            <img src={c.image} alt="" aria-hidden="true" className="mx-auto h-12 w-12 rounded-full object-cover shadow-card" />
          ) : (
            <span className="text-3xl">{c.emoji}</span>
          )}
          <h3 className="mt-3 font-display text-sm font-semibold text-forest-900">{c.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-forest-600">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
