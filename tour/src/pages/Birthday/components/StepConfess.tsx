import React, { useEffect, useState } from "react";
import { useBeep } from "./hooks";

export default function StepConfess({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const [text, setText] = useState("");
  const [icons, setIcons] = useState<
    { x: number; y: number; emoji: string; heart?: boolean }[]
  >([]);
  const full = `亲爱的老男孩！今年真是最幸运的一年——我们从心动牵手到许下一生承诺，踩着满心欢喜的节奏，把“我”变成了“我们”，把恋爱的甜直接延续进了婚姻的暖～30+的你自带让人安心的魔力，那份藏在行动里的责任心，从恋爱时就悄悄发芽，结婚后更是蹭蹭上涨，让我每天都庆幸“选对人”是这辈子最正确的决定！\n\n

还记得刚在一起时，你就牢牢记住了我超爱吃鸡爪，总会顺手给我点一份；我工作的时候，你也会点上一杯热乎的奶茶给我。\n\n

结婚后，你更是把“宠我”做到了极致：家里的重活累活全承包，洗碗、打扫卫生从不让我沾手，哪怕自己下班累得只想瘫着，也会先把家里收拾妥当；\n\n

谢谢你陪我追狗血又上头的剧，哪怕一脸“剧情离谱”，也会耐着性子听我吐槽；谢谢你陪我深夜吃烧烤，笑着听我絮叨工作的委屈、生活的小确幸；谢谢你把我宠成小懒虫，起床有温水、出门有提醒，我撒娇耍赖不想做家务，你也只会揉揉我的头说“没关系，我来”。\n\n

今年是我们相伴的第一年，也是婚姻的起点。30+的你褪去青涩多了担当，肩负生活压力却总把最好的情绪留给我，成熟稳重又温柔包容。你不善言辞，却把爱融进每个平凡瞬间，是默默扛起的家务，是永远包容的态度。\n\n

亲爱的，刚在一起就结婚虽显仓促，却满是我们对彼此的笃定。你值得满分！未来的日子还很长，愿我们带着初心，把柴米油盐过成诗，吃遍人间烟火，一起抵御风雨、慢慢相爱。往后余生，三餐四季，岁岁年年，都要和你紧紧牵手走下去～永远爱你呀！`;
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setText(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, []);
  const beep = useBeep();
  const onClickZone = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const emoji = ["🍟", "🎮", "🧋", "🍗", "🍰"][Math.floor(Math.random() * 5)];
    setIcons((arr) => [...arr, { x, y, emoji }]);
    beep(600, 100, "triangle");
    setTimeout(
      () =>
        setIcons((arr) => arr.map((it, idx) => (idx === arr.length ? it : it))),
      0
    );
  };
  return (
    <div>
      <h2 className="title">专属吐槽告白</h2>
      <div className="typing">
        {text}
        <span>{text.length < full.length ? "|" : ""}</span>
      </div>
      <div className="floating-zone" onClick={onClickZone}>
        {icons.map((it, i) => (
          <div
            key={i}
            className="icon"
            style={{ left: it.x, top: it.y }}
            onClick={(e) => {
              e.stopPropagation();
              setIcons((arr) =>
                arr.map((x, k) =>
                  k === i ? { ...x, heart: true, emoji: "❤" } : x
                )
              );
            }}
          >
            <span className={it.heart ? "heart" : ""}>{it.emoji}</span>
          </div>
        ))}
      </div>
      <div className="actions">
        <button className="btn" onClick={onPrev}>
          返回
        </button>
        <button className="btn primary" onClick={onNext}>
          下一步
        </button>
      </div>
    </div>
  );
}
