export default function ModernAboutPage() {
  return (
    <div>
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-gray-700">
          Welcome to the modern layout!
          I'm a full-stack software engineer with a passion for
          using software to solve problems, especially if it involves
          a sweet user interface!

          As you may have already learned on the Island, I love basketball, video and board games, track and field, and martial arts.
        </p>
      </section>
      <aside className="w-full mt-2">
        <div className="flex aspect-[3/4] w-1/2 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white/95 text-center text-sm text-gray-500">
          Professional
          <br />
          Photo Placeholder
        </div>
      </aside>
    </div>
  );
}
