import Image from "next/image";

export default function ModernExperiencePage() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="relative w-full h-[54vh] md:h-[78vh]">
          <Image
            src="/resume.png"
            alt="Resume PNG"
            fill
            priority
            className="object-contain object-top"
          />
        </div>
    </section>
  );
}
