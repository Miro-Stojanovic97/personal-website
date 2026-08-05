import Image from "next/image";

export default function ModernContactPage() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-4 text-gray-700">
        I am always open to discussing software opportunities, product ideas, and collaboration.
      </p>
      <div className="text-gray-700 flex flex-row flex-wrap items-center justify-center gap-10">
        <a href="https://www.linkedin.com/in/mirostojanovic/">
          <Image
            src="/LinkedIn_icon.svg"
            alt="LinkedIn Icon"
            width={100}
            height={100}
          />
        </a>
        <a href="https://github.com/Miro-Stojanovic97">
          <Image
            src="/github.svg"
            alt="GitHub Icon"
            width={100}
            height={100}
          />
        </a>
        <a href="mailto:stojanovic.miro97@gmail.com">
          <Image
            src="/Gmail_icon.svg"
            alt="Email Icon"
            width={100}
            height={100}
          />
        </a>
      </div>    
    </section>
  );
}
