import BasketballBounce from "@/components/BasketballBounce";
import Scroll_Page from "@/components/ScrollPage";

export default function Basketball() {
  const entityName = "Basketball Court";
  const body = (
    <div className="flex h-full flex-col gap-4 p-6">
      <h1 className="text-center">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;My favorite sport to play and watch is Basketball. I play at least once per week, and I&apos;m also a huge fan of the Milwaukee Bucks and NBA. You can also find me playing NBA 2K, which you may have already discovered by exploring the camp.
      </h1>
      <div className="min-h-0 flex-1 pb-8">
        <BasketballBounce />
      </div>
    </div>
  );

  return <Scroll_Page entityName={entityName} body={body} bodyClassName="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-hidden" />;
}