export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 p-6 text-slate-950">
      <section className="max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
          TaskFlow
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Project foundation ready
        </h1>
        <p className="mt-3 text-slate-600">
          The application shell is ready for incremental development. No product
          functionality has been implemented yet.
        </p>
      </section>
    </main>
  );
}
