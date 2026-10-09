export default function LoadingCarPage() {
  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 h-12 w-48 animate-pulse rounded-full bg-zinc-200" />
        <div className="mb-8 h-16 max-w-3xl animate-pulse rounded-3xl bg-zinc-200" />
        <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="h-[560px] animate-pulse rounded-[2rem] bg-zinc-200" />
          <div className="grid gap-5">
            <div className="h-80 animate-pulse rounded-[2rem] bg-zinc-200" />
            <div className="h-72 animate-pulse rounded-[2rem] bg-zinc-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
