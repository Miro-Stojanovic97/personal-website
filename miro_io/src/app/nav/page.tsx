import Link from "next/link";

export default function ModernHomePage() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-3 text-3xl">Welcome to the Modern Site</h1>
      
      <p className="mb-5 text-gray-700">
        Welcome to the more modern layout. Much less fun though, you gotta admit;).
        In today's world, webpages like this are a dime a dozen.
        I think that's why I pushed off making one for so long.
        There was nothing that excited me about a "Portfolio Website".
        Which is why I decided that when I did finally make one, I was
        going to have fun with it. I wanted to make a website that was fun to explore,
        and... felt... human. I also wanted to learn new things while doing it, and I did.
        I learned a lot about Next.js, Tailwind, Supabase, and more.  

      </p>
    </section>
  );
}