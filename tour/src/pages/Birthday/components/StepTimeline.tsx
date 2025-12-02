import React, { useMemo, useState } from "react";
import { useBeep } from "./hooks";

export default function StepTimeline({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const [index, setIndex] = useState(0);
  const img = (n: number) => require(`../imgs/${n}.jpg`);
  const items = useMemo(
    () => [
      {
        title: "干饭魂直接觉醒！",
        text: "砂锅炖肉刚上桌呀，筷子立马锁定最大块～ 干饭魂刻进DNA咯，主打一个眼里只有肉！",
        icon: "🥢",
        img: img(1),
      },
      {
        title: "暴风吸入模式开启！",
        text: "小笼包还没凉透呢，直接往嘴里炫～ 腮帮子鼓成仓鼠，好吃到表情失控，谁懂啊！",
        icon: "😋",
        img: img(2),
      },
      {
        title: "餐前仪式感不能少！",
        text: "菜刚上齐先举手机呀，咱可不是在干饭，是给干饭素材拍写真呢，朋友圈先吃为敬～",
        icon: "📸",
        img: img(3),
      },
      {
        title: "干饭界优雅显眼包！",
        text: "喝口汤都端成高脚杯架势，表面岁月静好，心里早盘算好下一口夹哪块肉啦，戏精本精～",
        icon: "🍲",
        img: img(4),
      },
      {
        title: "海边冷漠担当上线！",
        text: "海风把头发吹成鸡窝，他稳如老狗～ 只要我不笑，尴尬就追不上我，高冷人设焊死了！",
        icon: "🌊",
        img: img(5),
      },
      {
        title: "自助火锅侦查小能手！",
        text: "手机举得比筷子还高，边刷菜单边嘀咕：这盘肉烫几秒最嫩呀？吃货的自我修养～",
        icon: "🥘",
        img: img(6),
      },
      {
        title: "高铁打哈欠搭子！",
        text: "困到灵魂出窍咯，打哈欠都要同步～ 主打一个“摆烂式同行”，谁也别想叫醒我俩！",
        icon: "😴",
        img: img(7),
      },
      {
        title: "干饭间隙摸鱼ing！",
        text: "碗里的爆炒腰花还没动，先刷手机呀～ 干饭和摸鱼，两手都得硬，这才是正确打开方式！",
        icon: "📱",
        img: img(8),
      },
      {
        title: "旋转木马显眼包！",
        text: "骑上白马秒变“迪士尼在逃壮汉”，手机举得比马头还高，主打自我记录，社牛属性拉满！",
        icon: "🎠",
        img: img(9),
      },
    ],
    []
  );
  const beep = useBeep();
  const prevNode = () => setIndex((i) => Math.max(0, i - 1));
  const nextNode = () => setIndex((i) => Math.min(items.length - 1, i + 1));
  return (
    <div>
      <h2 className="title">时光回溯</h2>
      <div className="timeline-wrap">
        <div
          className="nodes"
          style={{
            width: `${items.length * 100}%`,
            transform: `translateX(-${index * (100 / items.length)}%)`,
            transition: "transform .3s ease",
          }}
        >
          {items.map((it, i) => (
            <div
              className="node"
              key={i}
              style={{ flex: `0 0 ${100 / items.length}%` }}
            >
              <div className="node-card">
                <div className="node-icons">{it.icon}</div>
                <h3>{it.title}</h3>
                <p className="subtitle">{it.text}</p>
                <div className="node-photo">
                  <img src={it.img} alt={it.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pager">
          <button
            className="btn"
            onClick={() => {
              beep(500, 100);
              prevNode();
            }}
          >
            上一条
          </button>
          <button
            className="btn"
            onClick={() => {
              beep(520, 100);
              nextNode();
            }}
          >
            下一条
          </button>
        </div>
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
