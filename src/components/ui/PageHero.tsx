export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
}) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden sm:min-h-[52vh]">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/55 to-forest-950/30" />
      </div>
      <div className="container-page relative z-10 pb-12 pt-32 text-cream-50 sm:pb-16">
        <span className="section-eyebrow text-gold-300">
          <span className="h-px w-8 bg-gold-300/70" />
          {eyebrow}
        </span>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-cream-100/90 sm:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
