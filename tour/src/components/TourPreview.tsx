import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TourPreview.css";

// 修复 Leaflet 图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface Recommendation {
  name: string;
  type: "attraction" | "food";
  coordinates: [number, number];
  description: string;
  details: string;
  shops?: {
    name: string;
    address: string;
    coordinates: [number, number];
    specialties: string[];
  }[];
}

interface Highlight {
  name: string;
  description: string;
  details: string;
  tips?: string;
}

interface TourDay {
  day: number;
  date: string;
  city: string;
  activities: string[];
  highlights: string[];
  coordinates: [number, number];
  transportation?: string;
  attractions?: {
    name: string;
    coordinates: [number, number];
    description: string;
    details?: string;
    openTime?: string;
    ticketPrice?: string;
    highlights?: string[];
    tips?: string;
  }[];
  recommendations?: Recommendation[];
}

// 地图控制组件
const MapController: React.FC<{ selectedDay: TourDay | null }> = ({
  selectedDay,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedDay && selectedDay.attractions) {
      // 聚焦到选中城市
      map.setView(selectedDay.coordinates, 12, { animate: true });
    } else {
      // 回到全景视图
      map.setView([26.5, 117.5], 6, { animate: true });
    }
  }, [selectedDay, map]);

  return null;
};

const TourPreview: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<Recommendation | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);

  // Highlight详细信息映射
  const highlightDetails: { [key: string]: Highlight } = {
    "东街口": {
      name: "东街口",
      description: "福州最繁华的商业中心，汇聚了众多购物中心、美食街和娱乐场所",
      details: "东街口是福州的核心商圈，这里有万达广场、东百中心、大洋百货等大型购物中心。夜晚时分，霓虹灯闪烁，人流如织，是体验福州都市生活的最佳地点。周边还有许多老字号美食店，可以品尝到正宗的福州小吃。",
      tips: "建议晚上7-9点前往，此时最为热闹。可以先逛街购物，再品尝美食。"
    },
    "鱼丸肉燕": {
      name: "鱼丸肉燕",
      description: "福州最具代表性的传统小吃，鱼丸Q弹鲜美，肉燕皮薄馅足",
      details: "福州鱼丸以鳗鱼、鲨鱼等为主料，制作工艺精细，口感Q弹有嚼劲。肉燕则是用猪肉打成肉泥，包在特制的燕皮里，汤汁鲜美。这两样都是福州人从小吃到大的家常美食，也是外地游客必尝的特色小吃。",
      tips: "推荐到同利肉燕老铺、永和鱼丸等老字号品尝最正宗的味道。"
    },
    "八一七路": {
      name: "八一七路",
      description: "福州著名的步行街，夜晚灯火辉煌，是感受福州夜生活的好去处",
      details: "八一七路是福州最著名的商业步行街，全长约1.5公里。街道两旁林立着各种商店、餐厅和娱乐场所。夜晚时分，整条街被霓虹灯装点得格外美丽，是福州人和游客都喜欢的休闲场所。",
      tips: "建议傍晚时分前往，可以看到从白天到夜晚的街景变化。"
    },
    "鼓山": {
      name: "鼓山",
      description: "福州著名风景区，可俯瞰福州全景，是登高望远的绝佳地点",
      details: "鼓山海拔925米，是福州市的标志性山峰。山上有涌泉寺、白云洞等名胜古迹，登顶后可以俯瞰整个福州城和闽江。山路蜿蜒，沿途风景秀丽，是福州市民和游客都喜爱的登山胜地。",
      tips: "建议早上或傍晚登山，避开中午炎热时段。可选择步行登山或乘坐缆车。"
    },
    "三坊七巷": {
      name: "三坊七巷",
      description: "福州历史文化街区，保存完好的明清古建筑群，被誉为'明清建筑博物馆'",
      details: "三坊七巷是福州老城区经历了建国后的拆迁建设后仅存下来的一部分。是福州的历史之源、文化之根。这里有林则徐纪念馆、严复故居、冰心故居等名人故居，是了解福州历史文化的重要窗口。",
      tips: "建议安排半天时间游览，可以慢慢品味古建筑的韵味和历史文化。"
    },
    "烟台山": {
      name: "烟台山",
      description: "福州文艺地标，保留着众多近代西式建筑，是拍照打卡的热门地点",
      details: "烟台山历史风貌区保存着大量的近代西式建筑，包括领事馆、教堂、洋行等。这里融合了中西文化，建筑风格独特，是福州近代历史的见证。夜晚时分，灯光璀璨，非常适合拍照留念。",
      tips: "建议傍晚前往，可以拍摄到美丽的夜景。穿着文艺一些会更适合这里的氛围。"
    },
    "福州双子塔": {
      name: "福州双子塔",
      description: "福州现代化地标建筑，夜晚灯光秀璀璨夺目",
      details: "福州双子塔是福州市的现代化地标，由两座超高层建筑组成。夜晚时分，塔身的LED灯光秀变幻多彩，是福州夜景的重要组成部分。这里也是福州金融商务区的核心，代表着福州的现代化发展。",
      tips: "最佳观赏时间是晚上8-10点，此时灯光秀最为精彩。可以在闽江边找个好位置观赏。"
    },
    "广济桥": {
      name: "广济桥",
      description: "潮州古城标志性建筑，中国四大古桥之一，有'一里长桥一里市'的美誉",
      details: "广济桥始建于南宋，是中国古代桥梁建筑的杰作。桥长518米，由东西两段石桥和中间一段浮桥组成。桥上有楼台亭阁，桥下有商铺林立，形成了独特的'桥市'景观。夜晚灯光璀璨，倒映在韩江中，美不胜收。",
      tips: "建议白天和夜晚各游览一次，可以体验不同的美景。桥上有表演时间，可以提前了解。"
    },
    "韩江夜游": {
      name: "韩江夜游",
      description: "乘船游览韩江，欣赏潮州古城夜景，体验'一江两岸'的美丽风光",
      details: "韩江是潮州的母亲河，夜游韩江可以从水上欣赏潮州古城的美丽夜景。沿途可以看到广济桥、韩文公祠、凤凰洲公园等景点，灯光倒映在江水中，如梦如幻。游船上还有潮州音乐表演，增添了浓厚的文化氛围。",
      tips: "建议选择晚上7-9点的班次，此时夜景最美。记得带上外套，江上会有些凉。"
    },
    "潮汕美食": {
      name: "潮汕美食",
      description: "潮汕地区独特的饮食文化，以精细、清淡、鲜美著称",
      details: "潮汕美食以其精细的制作工艺和独特的口味闻名全国。代表性美食包括潮汕牛肉火锅、砂锅粥、红桃粿、蚝烙等。潮汕人对食材的要求极高，烹饪技法精湛，形成了独特的饮食文化。",
      tips: "一定要尝试当地的牛肉火锅和各种粿品，这些都是潮汕美食的精华。"
    },
    "牌坊街": {
      name: "牌坊街",
      description: "潮州古城核心街区，保存着众多明清牌坊，是潮州历史文化的集中展示",
      details: "牌坊街全长1948米，沿街保存着22座明清石牌坊，是国内保存最完整的古牌坊街。街道两旁是传统的骑楼建筑，商铺林立，可以品尝到各种潮州小吃，购买到特色手工艺品。这里是了解潮州历史文化的最佳场所。",
      tips: "建议慢慢步行游览，每座牌坊都有其历史故事。可以边走边品尝街边小吃。"
    },
    "红桃粿制作": {
      name: "红桃粿制作",
      description: "潮汕传统糕点制作体验，亲手制作寓意吉祥的红桃粿",
      details: "红桃粿是潮汕地区的传统糕点，外形似桃子，寓意长寿吉祥。制作过程包括和面、调色、包馅、塑形等步骤，需要一定的技巧。通过亲手制作，可以深入了解潮汕的饮食文化和民俗传统。",
      tips: "制作过程需要耐心，建议跟着师傅认真学习每个步骤。制作完成后可以带走品尝。"
    },
    "小公园开埠区": {
      name: "小公园开埠区",
      description: "汕头近代历史文化街区，保存着大量骑楼建筑，见证了汕头的开埠历史",
      details: "小公园开埠区是汕头开埠以来形成的商业文化中心，这里保存着大量的骑楼建筑，融合了中西建筑风格。街区内有许多老字号商铺、传统手工艺店和特色小吃店，是体验汕头历史文化的重要场所。",
      tips: "建议安排2-3小时游览，可以慢慢欣赏骑楼建筑的精美细节。"
    },
    "观海长廊": {
      name: "观海长廊",
      description: "汕头海滨风景线，可欣赏南海美景，是休闲散步的好去处",
      details: "观海长廊沿着汕头海岸线建设，全长数公里。这里可以欣赏到壮阔的南海景色，感受海风的清爽。长廊上设有休息亭、观景台等设施，是汕头市民和游客都喜爱的休闲场所。傍晚时分，夕阳西下，景色格外美丽。",
      tips: "建议傍晚时分前往，可以看到美丽的海上日落。记得带上防晒用品。"
    },
    "南澳岛": {
      name: "南澳岛",
      description: "广东唯一的海岛县，拥有优美的海岛风光和丰富的海洋文化",
      details: "南澳岛是广东省唯一的海岛县，四面环海，风光秀丽。岛上有美丽的海滩、古老的灯塔、清澈的海水和新鲜的海鲜。这里还保存着丰富的海洋文化和渔民风俗，是体验海岛生活的绝佳去处。",
      tips: "建议安排1-2天时间游览，可以充分体验海岛的悠闲生活。记得品尝当地的海鲜。"
    },
    "三囱崖灯塔": {
      name: "三囱崖灯塔",
      description: "南澳岛标志性建筑，亚洲第一岛屿灯塔，是观海听涛的绝佳地点",
      details: "三囱崖灯塔建于1900年，是亚洲第一岛屿灯塔，也是南澳岛的标志性建筑。灯塔高约60米，白色的塔身在蓝天碧海的映衬下格外醒目。登上灯塔可以俯瞰整个南澳岛和周围的海域，景色壮观。",
      tips: "建议选择天气晴朗的日子前往，视野会更加开阔。可以在这里拍摄美丽的海景照片。"
    },
    "青澳湾": {
      name: "青澳湾",
      description: "南澳岛最美海湾，沙滩细腻，海水清澈，是游泳戏水的理想场所",
      details: "青澳湾是南澳岛最著名的海湾，拥有2.4公里长的优质沙滩。这里沙质细腻，海水清澈见底，是游泳、冲浪、沙滩排球等海上运动的理想场所。海湾周围还有度假村、餐厅等配套设施，是度假休闲的好去处。",
      tips: "建议带上游泳用品和防晒用品。海湾有救生员值守，但仍需注意安全。"
    },
    "宋井": {
      name: "宋井",
      description: "南澳岛历史古迹，宋代古井，见证了南澳岛的悠久历史",
      details: "宋井是南澳岛上的一口古井，相传建于宋代，距今已有近千年历史。井水清甜甘美，即使在海岛上也不带咸味，被当地人视为神井。这口古井见证了南澳岛的历史变迁，也承载着当地人的美好传说。",
      tips: "可以品尝一下井水，体验古人的智慧。周围还有一些历史文物，值得细细观赏。"
    }
  };

  const tourData: TourDay[] = [
    {
      day: 1,
      date: "9月27日",
      city: "福州",
      activities: [
        "下午：12:48乘坐高铁G413从杭州出发，抵达福州后（高铁约4.5小时，预计17:15左右到站），先前往酒店办理入住",
        "晚上：前往福州核心商圈东街口，品尝福州特色美食——Q弹鲜美的鱼丸、皮薄馅足的肉燕",
        "饭后可沿八一七路散步，感受福州夜晚的热闹氛围",
      ],
      highlights: ["东街口", "福州鱼丸", "肉燕", "八一七路"],
      coordinates: [26.0745, 119.2965],
      transportation: "高铁G413",
      attractions: [
        {
          name: "福州站",
          coordinates: [26.0745, 119.2965],
          description: "高铁到达站",
          details: "福州站是福建省最大的铁路客运站，也是福厦高铁的重要枢纽站。车站建筑现代化，设施完善，是进入福州的重要门户。站前广场宽敞，交通便利，有地铁、公交等多种交通方式连接市区各地。",
          openTime: "全天开放",
          ticketPrice: "免费",
          highlights: ["现代化建筑", "交通枢纽", "福厦高铁"],
          tips: "建议提前了解地铁和公交线路，方便前往市区各景点"
        },
        {
          name: "东街口",
          coordinates: [26.0614, 119.3061],
          description: "福州核心商圈，美食聚集地",
          details: "东街口是福州最繁华的商业中心，汇集了众多知名品牌店铺、餐厅和娱乐场所。这里是福州人购物、聚餐的首选之地，也是体验福州现代都市生活的最佳场所。周边有多家老字号美食店，是品尝正宗福州小吃的绝佳地点。",
          openTime: "全天开放（商铺营业时间各异）",
          ticketPrice: "免费",
          highlights: ["购物天堂", "美食聚集", "夜景繁华", "交通便利"],
          tips: "晚上7-9点是最热闹的时段，建议这个时间来体验福州夜生活"
        },
        {
          name: "八一七路",
          coordinates: [26.058, 119.305],
          description: "福州繁华步行街",
          details: "八一七路是福州最著名的步行街，全长约1.5公里，两侧林立着各种商店、餐厅和娱乐场所。这条街承载着福州人的集体记忆，既有现代化的购物中心，也保留着传统的老字号店铺。夜晚灯火辉煌，是感受福州都市魅力的必游之地。",
          openTime: "全天开放",
          ticketPrice: "免费",
          highlights: ["历史悠久", "购物休闲", "夜景迷人", "文化底蕴"],
          tips: "建议傍晚时分前来，可以同时体验白天和夜晚的不同风情"
        },
      ],
      recommendations: [
        {
          name: "福州鱼丸",
          type: "food",
          coordinates: [26.0614, 119.3061],
          description: "福州特色小吃，Q弹鲜美",
          details:
            "福州鱼丸以鲨鱼、鳗鱼等为主料，肉质鲜嫩，汤汁清香，是福州最具代表性的小吃之一。",

          shops: [
            {
              name: "永和鱼丸",
              address: "鼓楼区八一七北路84号",
              coordinates: [26.062, 119.3055],
              specialties: ["鱼丸汤", "肉燕", "线面"],

            },
            {
              name: "同利肉燕老铺",
              address: "台江区达道路108号",
              coordinates: [26.058, 119.308],
              specialties: ["太平燕", "鱼丸", "扁肉燕"],

            },
          ],
        },
        {
          name: "福州网红彩虹楼梯",
          type: "attraction",
          coordinates: [26.085, 119.292],
          description: "ins风拍照圣地",
          details:
            "福州最新的网红打卡地，彩色阶梯设计充满艺术感，每一层都有不同的颜色，是拍摄时尚大片的绝佳背景，深受年轻人喜爱。",

        },
        {
          name: "锅边糊",
          type: "food",
          coordinates: [26.06, 119.304],
          description: "福州传统早餐，香滑可口",
          details:
            "锅边糊是福州著名的风味小吃，用大米磨成浆，沿着锅边倒入，形成薄片，配以虾米、紫菜、韭菜等，味道鲜美。",

          shops: [
            {
              name: "安泰楼锅边糊",
              address: "鼓楼区安泰街道安泰河沿1号",
              coordinates: [26.059, 119.302],
              specialties: ["锅边糊", "蛎饼", "光饼"],

            },
          ],
        },
        {
          name: "福州温泉公园",
          type: "attraction",
          coordinates: [26.09, 119.28],
          description: "天然温泉体验",
          details:
            "福州温泉公园拥有丰富的地热资源，温泉水质优良，含有多种对人体有益的矿物质，是放松身心的绝佳去处。",

        },
        {
          name: "福州荔枝肉",
          type: "food",
          coordinates: [26.082, 119.31],
          description: "福建经典菜肴",
          details:
            "荔枝肉是福州传统名菜，猪肉切花刀炸制，形似荔枝，酸甜可口，色泽红亮，是福州宴席上的经典菜品。",

          shops: [
            {
              name: "聚春园",
              address: "鼓楼区东街口",
              coordinates: [26.085, 119.305],
              specialties: ["荔枝肉", "佛跳墙", "红糟鸡"],

            },
          ],
        },
      ],
    },
    {
      day: 2,
      date: "9月28日",
      city: "福州",
      activities: [
        '上午：前往"福州之肺"鼓山，建议乘坐观光车至半山腰，再徒步登鼓山十八景观景台，俯瞰福州城区全景',
        "中午：在鼓山脚下的餐厅用餐，推荐尝试鼓山当地特色的农家菜，如土鸡汤、炒笋干等",
        "下午：前往福州文化地标三坊七巷，打卡林觉民冰心故居、严复故居，感受名人故里的文化底蕴",
        "晚上：前往烟台山夜游，登上观景天台，俯瞰闽江夜景、双子塔与解放大桥的璀璨灯光",
      ],
      highlights: ["鼓山", "三坊七巷", "烟台山", "闽江夜景", "双子塔"],
      coordinates: [26.0745, 119.2965],
      attractions: [
        {
          name: "鼓山",
          coordinates: [26.092, 119.361],
          description: "福州著名风景区，可俯瞰全城",
          details: "鼓山是福州市最著名的风景名胜区，海拔925米，因山巅有一巨石如鼓而得名。山上古迹众多，有涌泉寺、十八景等著名景点。登山途中可欣赏茂密的森林植被，山顶观景台可360度俯瞰福州全城美景，是福州市民和游客登高望远的首选之地。",
          openTime: "6:00-18:00",
          ticketPrice: "免费（观光车单程15元）",
          highlights: ["涌泉寺", "十八景", "观景台", "古树名木", "城市全景"],
          tips: "建议穿舒适的运动鞋，可选择乘坐观光车到半山腰再步行登顶，节省体力"
        },
        {
          name: "三坊七巷",
          coordinates: [26.052, 119.302],
          description: "福州历史文化街区，名人故居聚集地",
          details: "三坊七巷是福州的历史文化名片，有'中国城市里坊制度活化石'和'中国明清建筑博物馆'的美称。这里保存着大量明清时期的古建筑，走出了林则徐、严复、冰心等众多历史名人。青石板路、白墙黛瓦、雕梁画栋，每一处都诉说着千年古城的文化底蕴。",
          openTime: "全天开放（部分故居9:00-17:00）",
          ticketPrice: "街区免费，部分故居收费（联票120元）",
          highlights: ["林则徐纪念馆", "严复故居", "冰心故居", "明清建筑群", "传统工艺品"],
          tips: "建议购买联票参观各个名人故居，晚上灯光亮起时拍照效果更佳"
        },
        {
          name: "烟台山",
          coordinates: [26.045, 119.289],
          description: "观赏闽江夜景的最佳地点",
          details: "烟台山是福州观赏闽江夜景的绝佳地点，山上有观景平台和咖啡厅。夜幕降临时，闽江两岸灯火辉煌，双子塔、解放大桥等地标建筑在江水中倒影摇曳，构成一幅美丽的都市夜景画卷。这里也是福州年轻人约会和拍照的热门地点。",
          openTime: "全天开放",
          ticketPrice: "免费",
          highlights: ["闽江夜景", "观景平台", "双子塔夜景", "解放大桥", "江景咖啡厅"],
          tips: "最佳观景时间是日落后1小时，建议带上相机记录美丽夜景"
        },
        {
          name: "福州双子塔",
          coordinates: [26.038, 119.318],
          description: "福州地标建筑",
          details: "福州双子塔是福州市的标志性建筑，由两座高度相同的摩天大楼组成，总高度约200米。塔身设计现代简约，夜晚灯光璀璨，是福州天际线的重要组成部分。塔内设有购物中心、办公区域和观景台，是集商务、购物、观光于一体的现代化建筑群。",
          openTime: "购物中心10:00-22:00，观景台需预约",
          ticketPrice: "外观免费，观景台门票50元",
          highlights: ["现代建筑设计", "夜景灯光秀", "高空观景台", "购物中心", "城市地标"],
          tips: "夜晚从远处观赏效果最佳，观景台需要提前预约，建议关注官方微信"
        },
      ],
      recommendations: [
        {
          name: "鼓山观景台",
          type: "attraction",
          coordinates: [26.095, 119.365],
          description: "福州最佳观景点",
          details:
            "鼓山观景台是俯瞰福州全景的最佳位置，可以看到闽江蜿蜒穿城而过，城市天际线尽收眼底，是拍摄福州全景的网红打卡地。",

        },
        {
          name: "佛跳墙",
          type: "food",
          coordinates: [26.052, 119.302],
          description: "福建名菜，营养丰富",
          details:
            "佛跳墙是福建省福州市的一道特色名菜，属于闽菜系。制作工艺非常繁复，先要制作十几种原料，然后再分别调制，最后汇聚到一起加工制作而成。",

          shops: [
            {
              name: "聚春园",
              address: "鼓楼区东街口中山路2号",
              coordinates: [26.061, 119.305],
              specialties: ["佛跳墙", "荔枝肉", "红糟鸡"],

            },
          ],
        },
        {
          name: "福州创意园区",
          type: "attraction",
          coordinates: [26.053, 119.301],
          description: "文艺青年聚集地",
          details:
            "由老厂房改造的创意园区，汇集了艺术工作室、独立书店、手工咖啡馆和设计师品牌店，是体验福州文艺生活的最佳去处。",

        },
        {
          name: "福州线面",
          type: "food",
          coordinates: [26.05, 119.3],
          description: "福州传统面食，细如发丝",
          details:
            "福州线面制作工艺独特，面条细如发丝，煮制时间短，口感爽滑，常配以蛋花、紫菜等，是福州人喜爱的传统面食。",

          shops: [
            {
              name: "老福州线面",
              address: "鼓楼区三坊七巷南后街",
              coordinates: [26.051, 119.3015],
              specialties: ["线面汤", "拌线面", "蛋花线面"],

            },
          ],
        },
        {
          name: "福州西湖公园",
          type: "attraction",
          coordinates: [26.08, 119.29],
          description: "古典园林美景",
          details:
            "福州西湖公园是福州保留最完整的一座古典园林，有1700多年的历史，园内亭台楼阁，柳暗花明，春季樱花盛开时尤为美丽。",

        },
        {
          name: "福州肉燕",
          type: "food",
          coordinates: [26.065, 119.305],
          description: "福州传统小吃",
          details:
            "福州肉燕又称太平燕，是福州的传统风味小吃，燕皮薄如纸，肉馅鲜美，汤汁清香，寓意平安吉祥。",

          shops: [
            {
              name: "同利肉燕老铺",
              address: "台江区中亭街",
              coordinates: [26.065, 119.305],
              specialties: ["太平燕", "鱼丸", "扁肉燕"],

            },
          ],
        },
        {
          name: "福州马尾船政文化景区",
          type: "attraction",
          coordinates: [26.02, 119.45],
          description: "中国近代海军摇篮",
          details:
            "马尾船政文化景区是中国近代海军的发源地，保存着丰富的船政文化遗产，是了解中国近代海军发展史的重要场所。",

        },
      ],
    },
    {
      day: 3,
      date: "9月29日",
      city: "潮州",
      activities: [
        "上午：留1-2小时自由活动，可去酒店附近的早餐店吃一碗福州锅边糊",
        "中午：12:42乘坐高铁G3047前往潮汕（高铁约2.5小时，预计15:10左右到站）",
        '下午：抵达潮汕后，直奔"中国四大古桥"之一的广济桥，欣赏桥身的浮雕、古亭',
        "晚上：体验韩江夜游（游船约1小时），乘船欣赏两岸灯笼长廊、广济楼夜景",
      ],
      highlights: ["福州锅边糊", "广济桥", "韩江夜游", "广济楼"],
      coordinates: [23.6617, 116.6227],
      transportation: "高铁G3047",
      attractions: [
        {
          name: "潮汕站",
          coordinates: [23.6617, 116.6227],
          description: "高铁到达站",
          details: "潮汕站是连接潮州、汕头、揭阳三市的重要交通枢纽，是厦深高铁的重要站点。车站设计融入了潮汕地区的传统建筑元素，体现了浓郁的地方文化特色。站前交通便利，有多条公交线路和出租车服务连接各个景区。",
          openTime: "全天开放",
          ticketPrice: "免费",
          highlights: ["交通枢纽", "地方特色建筑", "厦深高铁"],
          tips: "建议提前了解前往潮州古城的交通路线，可选择公交或出租车"
        },
        {
          name: "广济桥",
          coordinates: [23.674, 116.633],
          description: "中国四大古桥之一，潮州地标",
          details: "广济桥始建于南宋，是中国四大古桥之一，被誉为'世界上最早的启闭式桥梁'。桥长518米，由东西固定桥段和中间浮桥组成，桥上建有精美的楼台亭阁，集梁桥、浮桥、拱桥于一体，是古代桥梁建筑的杰作。夜晚灯光璀璨，倒映在韩江中，美不胜收。",
          openTime: "全天开放（夜景灯光19:30-22:30）",
          ticketPrice: "免费观赏，上桥参观20元",
          highlights: ["古代桥梁工艺", "启闭式设计", "楼台亭阁", "夜景灯光", "韩江倒影"],
          tips: "最佳拍摄时间是傍晚和夜晚，建议从韩江两岸不同角度欣赏"
        },
        {
          name: "韩江",
          coordinates: [23.67, 116.628],
          description: "潮州母亲河，夜游观光",
          details: "韩江是潮州的母亲河，因韩愈而得名。江水清澈，两岸风光秀丽，是潮州城市的重要景观带。夜游韩江是体验潮州夜景的最佳方式，游船沿江而行，可欣赏到广济桥、广济楼、韩文公祠等著名景点的夜景，感受千年古城的魅力。",
          openTime: "夜游时间19:30-21:30",
          ticketPrice: "夜游船票68元/人",
          highlights: ["古城夜景", "广济桥夜景", "两岸灯光", "历史文化", "江景风光"],
          tips: "建议提前预订夜游船票，最佳观赏时间是晚上8-9点"
        },
        {
          name: "广济楼",
          coordinates: [23.675, 116.632],
          description: "潮州古城门楼，夜景绝佳",
          details: "广济楼是潮州古城的东门楼，始建于明洪武三年，是潮州古城墙的重要组成部分。楼高约20米，为三层歇山顶建筑，飞檐翘角，气势雄伟。楼内陈列着潮州历史文物，是了解潮州历史文化的重要窗口。夜晚灯光照射下，古楼显得格外庄严肃穆。",
          openTime: "8:00-18:00",
          ticketPrice: "10元",
          highlights: ["明代建筑", "古城门楼", "历史文物", "夜景灯光", "城墙遗迹"],
          tips: "登楼可俯瞰古城全景，夜晚从外观赏灯光效果更佳"
        },
      ],
      recommendations: [
        {
          name: "潮州工夫茶",
          type: "food",
          coordinates: [23.673, 116.631],
          description: "潮州茶文化精髓",
          details:
            "潮州工夫茶是中国茶艺的活化石，讲究茶具、水质、茶叶和冲泡技艺，是潮州人日常生活的重要组成部分。",

          shops: [
            {
              name: "老字号茶庄",
              address: "湘桥区太平路古城区",
              coordinates: [23.672, 116.63],
              specialties: ["单丛茶", "铁观音", "大红袍"],

            },
          ],
        },
        {
          name: "潮州古城墙",
          type: "attraction",
          coordinates: [23.668, 116.625],
          description: "网红拍照圣地",
          details:
            "潮州古城墙是明代建筑，保存完好，城墙上可俯瞰韩江美景，是热门的拍照打卡地，特别是夕阳西下时分最为壮观。",

        },
        {
          name: "潮州牛肉丸",
          type: "food",
          coordinates: [23.676, 116.634],
          description: "潮汕特色小吃，弹性十足",
          details:
            "潮州牛肉丸选用新鲜牛肉，经过反复捶打制成，口感弹牙，汤汁鲜美，是潮汕地区最具代表性的小吃之一。",

          shops: [
            {
              name: "亚强牛肉丸",
              address: "湘桥区环城西路",
              coordinates: [23.675, 116.633],
              specialties: ["手打牛肉丸", "牛筋丸", "牛肉粿条"],

            },
          ],
        },
        {
          name: "潮州广济桥夜景",
          type: "attraction",
          coordinates: [23.674, 116.633],
          description: "中国四大古桥之一",
          details:
            "广济桥夜晚灯光璀璨，倒映在韩江水中，形成绝美的夜景，是潮州最具代表性的景观，也是拍摄夜景的最佳地点。",

        },
        {
          name: "潮州粿条",
          type: "food",
          coordinates: [23.68, 116.635],
          description: "潮汕经典粉面",
          details:
            "潮州粿条是潮汕地区的传统小吃，粿条爽滑有韧性，可炒可汤，配以新鲜的牛肉、韭菜等，味道鲜美。",

          shops: [
            {
              name: "老牌粿条汤",
              address: "湘桥区牌坊街",
              coordinates: [23.678, 116.635],
              specialties: ["牛肉粿条汤", "炒粿条", "粿条卷"],

            },
          ],
        },
      ],
    },
    {
      day: 4,
      date: "9月30日",
      city: "汕头",
      activities: [
        '上午：漫步潮州牌坊街，这里矗立着22座明清时期的石牌坊，可打卡"状元坊"拍国风照片',
        "上午：前往红桃粿文化馆，体验手工制作红桃粿（潮汕传统糕点），感受潮汕民俗文化",
        "下午：前往汕头（潮州到汕头车程约1小时），前往小公园开埠区——汕头老城的核心",
        "晚上：前往汕头观海长廊，这是一条1.5公里长的滨海步道，欣赏汕头的海滨夜景",
      ],
      highlights: ["牌坊街", "红桃粿文化馆", "小公园开埠区", "观海长廊"],
      coordinates: [23.354, 116.6816],
      transportation: "高铁",
      attractions: [
        {
          name: "潮州牌坊街",
          coordinates: [23.676, 116.634],
          description: "22座明清石牌坊，历史文化街区",
          details: "潮州牌坊街是中国现存最完整的古代牌坊街，全长1948米，共有22座明清时期的石牌坊，每座牌坊都有其独特的历史故事。街道两侧保留着传统的潮州民居建筑，现在是集文化、旅游、商业于一体的历史文化街区，是了解潮州历史文化的重要窗口。",
          openTime: "全天开放",
          ticketPrice: "免费",
          highlights: ["明清石牌坊", "传统建筑", "历史文化", "状元坊", "民俗展示"],
          tips: "建议穿着汉服拍照，特别是在状元坊前，可拍出很好的国风照片"
        },
        {
          name: "红桃粿文化馆",
          coordinates: [23.672, 116.63],
          description: "体验潮汕传统糕点制作",
          details: "红桃粿文化馆是展示和传承潮汕传统糕点文化的专门场所。红桃粿是潮汕地区的传统节庆食品，寓意吉祥如意。在这里可以亲手体验制作过程，了解潮汕民俗文化，感受传统手工艺的魅力。馆内还展示了各种潮汕传统糕点的制作工艺和文化内涵。",
          openTime: "9:00-17:00",
          ticketPrice: "参观免费，体验制作50元/人",
          highlights: ["传统糕点", "手工体验", "民俗文化", "非遗传承", "亲子活动"],
          tips: "建议提前预约体验活动，制作的红桃粿可以带走作为纪念品"
        },
        {
          name: "小公园开埠区",
          coordinates: [23.365, 116.682],
          description: "汕头老城核心，骑楼建筑群",
          details: "小公园开埠区是汕头的历史文化核心区域，保存着大量的骑楼建筑群，展现了汕头作为近代重要通商口岸的历史风貌。这里的建筑融合了中西方建筑风格，具有浓郁的南洋风情。漫步其中，可以感受到汕头百年商埠的繁华历史和独特的文化魅力。",
          openTime: "全天开放",
          ticketPrice: "免费",
          highlights: ["骑楼建筑", "开埠历史", "南洋风情", "商埠文化", "历史街区"],
          tips: "最佳拍摄时间是下午，阳光斜射时骑楼的光影效果最佳"
        },
        {
          name: "观海长廊",
          coordinates: [23.358, 116.69],
          description: "1.5公里滨海步道，海景观光",
          details: "汕头观海长廊是一条沿海而建的景观步道，全长约1.5公里，是汕头市民和游客休闲观光的热门去处。长廊设计现代，设施完善，沿途可以欣赏到美丽的海景和汕头的城市天际线。夜晚时分，海风习习，灯光璀璨，是情侣约会和家庭散步的理想场所。",
          openTime: "全天开放",
          ticketPrice: "免费",
          highlights: ["海景观光", "城市天际线", "夜景灯光", "休闲步道", "海风体验"],
          tips: "傍晚时分是最佳观赏时间，可以看到美丽的日落和夜景"
        },
      ],
      recommendations: [
        {
          name: "潮汕砂锅粥",
          type: "food",
          coordinates: [23.675, 116.632],
          description: "潮汕夜宵经典",
          details:
            "潮汕砂锅粥是当地人最爱的夜宵，用砂锅慢煮，粥底香浓，配菜丰富，有海鲜粥、瘦肉粥等多种口味。",

          shops: [
            {
              name: "阿彬砂锅粥",
              address: "湘桥区新洋路",
              coordinates: [23.674, 116.631],
              specialties: ["海鲜砂锅粥", "瘦肉砂锅粥", "生滚粥"],

            },
          ],
        },
        {
          name: "潮州网红咖啡街",
          type: "attraction",
          coordinates: [23.682, 116.638],
          description: "文艺青年聚集地",
          details:
            "潮州新兴的文艺街区，汇集了多家特色咖啡馆、手工艺品店和创意工作室，是年轻人喜爱的拍照打卡地，充满文艺气息。",

        },
        {
          name: "汕头牛肉火锅",
          type: "food",
          coordinates: [23.365, 116.682],
          description: "汕头特色火锅",
          details:
            "汕头牛肉火锅以新鲜牛肉为主料，汤底清淡，突出牛肉的鲜美，是汕头人最爱的美食之一。",

          shops: [
            {
              name: "八合里海记牛肉店",
              address: "金平区金砂东路",
              coordinates: [23.368, 116.685],
              specialties: ["鲜切牛肉", "牛肉丸", "牛筋丸"],

            },
          ],
        },
        {
          name: "汕头小公园骑楼",
          type: "attraction",
          coordinates: [23.365, 116.682],
          description: "百年骑楼建筑群",
          details:
            "小公园骑楼是汕头最具历史价值的建筑群，融合了中西建筑风格，是了解汕头历史文化的重要窗口，也是拍照的绝佳背景。",

        },
        {
          name: "汕头蚝烙",
          type: "food",
          coordinates: [23.37, 116.695],
          description: "潮汕经典小吃",
          details:
            "蚝烙是汕头的传统小吃，用新鲜生蚝和薯粉调制，煎至金黄酥脆，外酥内嫩，配以鱼露蘸料，味道鲜美。",

          shops: [
            {
              name: "老妈宫粽球蚝烙",
              address: "金平区老妈宫",
              coordinates: [23.369, 116.694],
              specialties: ["蚝烙", "粽球", "肠粉"],

            },
          ],
        },
        {
          name: "汕头海滨长廊",
          type: "attraction",
          coordinates: [23.375, 116.7],
          description: "海景休闲步道",
          details:
            "海滨长廊沿海而建，可以欣赏到美丽的海景和日落，是汕头市民休闲散步的好去处，也是情侣约会的浪漫地点。",

        },
      ],
    },
    {
      day: 5,
      date: "10月1日",
      city: "汕头",
      activities: [
        '上午：前往"广东最美海岛"南澳岛（汕头市区到南澳岛车程约1.5小时），打卡三囱崖灯塔',
        '上午：前往青澳湾，这里有"东方夏威夷"之称，沙滩细腻，海水清澈，可体验摩托艇、香蕉船等水上项目',
        "下午：继续环岛游玩，前往宋井，打卡宋代遗留的淡水井，感受历史遗迹的神奇",
        "晚上：在南澳岛吃海鲜晚餐，饭后可在海边散步，看星空与海浪，感受海岛的宁静夜晚",
      ],
      highlights: ["南澳岛", "三囱崖灯塔", "青澳湾", "宋井"],
      coordinates: [23.354, 116.6816],
      attractions: [
        {
          name: "南澳岛",
          coordinates: [23.42, 117.03],
          description: "广东最美海岛，海岛风光",
          details: "南澳岛是广东省唯一的海岛县，被誉为'广东最美海岛'。岛上自然风光秀丽，拥有优质的海滩、清澈的海水和丰富的海洋资源。岛上还保存着众多历史文化遗迹，如宋井、总兵府等，是集自然风光、历史文化、海岛风情于一体的旅游胜地。",
          openTime: "全天开放",
          ticketPrice: "上岛免费，各景点单独收费",
          highlights: ["海岛风光", "历史文化", "海鲜美食", "水上运动", "日出日落"],
          tips: "建议安排1-2天时间游玩，可以体验海岛的慢生活节奏"
        },
        {
          name: "三囱崖灯塔",
          coordinates: [23.435, 117.045],
          description: "南澳岛地标灯塔，观海胜地",
          details: "三囱崖灯塔建于1900年，是南澳岛的标志性建筑，也是亚洲第一岛屿灯塔。灯塔高18米，白色塔身在蓝天碧海的映衬下格外醒目。登上灯塔可以360度俯瞰南澳岛全景和无边的大海，是观赏日出日落的绝佳地点，也是拍摄海岛风光的最佳位置。",
          openTime: "8:00-18:00",
          ticketPrice: "20元",
          highlights: ["历史灯塔", "360度海景", "日出日落", "拍照圣地", "海岛全景"],
          tips: "建议傍晚时分前来，可以看到美丽的日落，记得带相机"
        },
        {
          name: "青澳湾",
          coordinates: [23.418, 117.038],
          description: "东方夏威夷，细腻沙滩",
          details: "青澳湾是南澳岛最著名的海滩，被誉为'东方夏威夷'。这里拥有2.4公里长的优质沙滩，沙质细腻洁白，海水清澈湛蓝。海湾呈月牙形，三面环山，一面向海，形成了天然的避风港。这里是游泳、日光浴、沙滩排球等海滩活动的理想场所，也提供摩托艇、香蕉船等水上运动项目。",
          openTime: "全天开放",
          ticketPrice: "免费（水上项目另收费）",
          highlights: ["优质沙滩", "清澈海水", "水上运动", "日光浴", "月牙形海湾"],
          tips: "建议带上防晒用品，水上项目需要另外付费，注意安全"
        },
        {
          name: "宋井",
          coordinates: [23.41, 117.025],
          description: "宋代古井，历史遗迹",
          details: "宋井是南澳岛上的一口古井，相传为南宋末年所凿。这口井的神奇之处在于，虽然距离海边仅几十米，但井水却是甘甜的淡水，千年来从未干涸。井水清澈甘甜，被当地人视为神井。周围还有宋代的石刻和遗迹，是了解南澳岛历史文化的重要景点。",
          openTime: "全天开放",
          ticketPrice: "10元",
          highlights: ["宋代古井", "淡水神井", "历史遗迹", "石刻文物", "文化传说"],
          tips: "可以品尝井水，据说有保健功效，周围环境清幽适合拍照"
        },
      ],
      recommendations: [
        {
          name: "南澳海鲜",
          type: "food",
          coordinates: [23.42, 117.03],
          description: "新鲜海鲜大餐",
          details:
            "南澳岛四面环海，海鲜资源丰富，有石斑鱼、龙虾、扇贝、海胆等，做法多样，味道鲜美。",

          shops: [
            {
              name: "渔家乐海鲜餐厅",
              address: "南澳县青澳湾旅游区",
              coordinates: [23.418, 117.038],
              specialties: ["清蒸石斑鱼", "蒜蓉扇贝", "白灼虾"],

            },
          ],
        },
        {
          name: "南澳岛玻璃栈道",
          type: "attraction",
          coordinates: [23.43, 117.04],
          description: "刺激的海上体验",
          details:
            "南澳岛新建的玻璃栈道悬空于海面之上，透明的玻璃地面让游客仿佛行走在海面上，是挑战胆量和拍摄震撼照片的网红景点。",

        },
        {
          name: "南澳岛网红秋千",
          type: "attraction",
          coordinates: [23.415, 117.028],
          description: "海边浪漫秋千",
          details:
            "南澳岛海边的网红秋千，背景是无边的大海和蓝天，是拍摄浪漫照片的绝佳地点，吸引了众多游客前来打卡拍照。",

        },
        {
          name: "南澳岛风车群",
          type: "attraction",
          coordinates: [23.425, 117.035],
          description: "壮观的海上风车",
          details:
            "南澳岛的风力发电机群是一道独特的风景线，白色的风车在蓝天碧海的映衬下格外壮观，是拍摄大片的绝佳背景。",

        },
        {
          name: "南澳紫菜",
          type: "food",
          coordinates: [23.422, 117.032],
          description: "海岛特色紫菜",
          details:
            "南澳岛的紫菜品质优良，口感鲜美，富含多种营养成分，可以做成紫菜蛋花汤、紫菜包饭等多种美食。",

          shops: [
            {
              name: "海岛紫菜专卖店",
              address: "南澳县云澳镇海滨路",
              coordinates: [23.421, 117.031],
              specialties: ["野生紫菜", "紫菜干", "紫菜汤"],

            },
          ],
        },
        {
          name: "南澳岛日出观景台",
          type: "attraction",
          coordinates: [23.435, 117.045],
          description: "最美日出观赏点",
          details:
            "这里是南澳岛观看日出的最佳地点，清晨时分，太阳从海平面缓缓升起，金光洒向大海，景色壮观迷人。",

        },
      ],
    },
    {
      day: 6,
      date: "10月2日",
      city: "汕头",
      activities: [
        "上午：留1-2小时自由活动，可前往汕头市区的老市区骑楼街，买一些潮汕特产（如牛肉丸、腐乳饼、紫菜）",
        "下午：13:55乘坐高铁G3690前往赣州，结束福州、潮汕、汕头的轻松之旅",
      ],
      highlights: ["骑楼街", "潮汕特产", "返程赣州"],
      coordinates: [23.354, 116.6816],
      transportation: "高铁G3690",
      attractions: [
        {
          name: "汕头骑楼街",
          coordinates: [23.36, 116.678],
          description: "老市区特色建筑，购买特产",
        },
        {
          name: "汕头站",
          coordinates: [23.354, 116.6816],
          description: "高铁返程站点",
        },
      ],
      recommendations: [
        {
          name: "潮汕特产",
          type: "food",
          coordinates: [23.36, 116.678],
          description: "地道潮汕伴手礼",
          details:
            "潮汕地区有许多特色食品可作为伴手礼，如牛肉丸、腐乳饼、紫菜、潮汕功夫茶具等，都是当地的特色产品。",
          shops: [
            {
              name: "潮汕特产店",
              address: "金平区小公园开埠区",
              coordinates: [23.365, 116.682],
              specialties: ["牛肉丸", "腐乳饼", "紫菜", "茶具"],
            },
          ],
        },
        {
          name: "汕头网红天空之镜",
          type: "attraction",
          coordinates: [23.352, 116.675],
          description: "梦幻拍照胜地",
          details:
            "汕头海边的天空之镜景点，利用浅水反射效果营造出天空倒影的梦幻景象，是拍摄唯美照片的热门打卡地，特别适合日出日落时分。",
        },
      ],
    },
  ];

  const selectedDayData = selectedDay
    ? tourData.find((day) => day.day === selectedDay) || null
    : null;

  // 路线坐标
  const routeCoordinates: [number, number][] = [
    [30.2741, 120.1551], // 杭州
    [26.0745, 119.2965], // 福州
    [23.6617, 116.6227], // 潮州
    [23.354, 116.6816], // 汕头
    [25.8452, 114.9348], // 赣州
  ];

  return (
    <div className="tour-preview">
      <header className="tour-header">
        <h1>杭州-福州-潮汕-汕头-赣州 6日游</h1>
        <p className="tour-subtitle">从江南水乡到闽都古城，再到潮汕美食之旅</p>
      </header>

      <div className="tour-content">
        {/* 行程时间线 */}
        <div className="timeline-section">
          <h2>行程安排</h2>
          <div className="timeline">
            {tourData.map((day) => (
              <div
                key={day.day}
                className={`timeline-item ${
                  selectedDay === day.day ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedDay(selectedDay === day.day ? null : day.day)
                }
              >
                <div className="timeline-marker">
                  <span className="day-number">{day.day}</span>
                </div>
                <div className="timeline-content">
                  <h3>
                    {day.date} - {day.city}
                  </h3>
                  {day.transportation && (
                    <span className="transportation">
                      🚄 {day.transportation}
                    </span>
                  )}
                  <div className="activities">
                    {day.activities.map((activity, index) => (
                      <p key={index} className="activity">
                        {activity}
                      </p>
                    ))}
                  </div>
                  <div className="highlights">
                    {day.highlights.map((highlight, index) => (
                      <span 
                        key={index} 
                        className="highlight-tag"
                        onClick={(e) => {
                          e.stopPropagation();
                          const highlightInfo = highlightDetails[highlight];
                          if (highlightInfo) {
                            setSelectedHighlight(highlightInfo);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  {/* 推荐标签 */}
                  {day.recommendations && (
                    <div className="recommendations">
                      <h4>推荐</h4>
                      <div className="recommendation-tags">
                        {day.recommendations.map((rec, index) => (
                          <span
                            key={index}
                            className={`recommendation-tag ${rec.type}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecommendation(rec);
                            }}
                          >
                            {rec.type === "food" ? "🍽️" : "📍"} {rec.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 地图区域 */}
        <div className="map-section">
          <h2>路线地图</h2>
          <div className="map-container" style={{ position: "relative" }}>
            {/* 地图模式指示器 */}
            <div
              className={`map-mode-indicator ${
                selectedDayData ? "detail-mode" : ""
              }`}
            >
              {selectedDayData
                ? `${selectedDayData.date} ${selectedDayData.city} 详细路线`
                : "全程路线总览"}
            </div>
            <MapContainer
              center={[26.5, 117.5]}
              zoom={6}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* 地图控制器 */}
              <MapController selectedDay={selectedDayData} />

              {/* 路线 */}
              {!selectedDayData && (
                <Polyline
                  positions={routeCoordinates}
                  color="#e74c3c"
                  weight={3}
                  opacity={0.8}
                />
              )}

              {/* 选中天数的详细景点路线 */}
              {selectedDayData && selectedDayData.attractions && (
                <>
                  <Polyline
                    positions={selectedDayData.attractions.map(
                      (attr) => attr.coordinates
                    )}
                    color="#3498db"
                    weight={4}
                    opacity={0.9}
                  />
                  {selectedDayData.attractions.map((attraction, index) => (
                    <Marker
                      key={attraction.name}
                      position={attraction.coordinates}
                    >
                      <Popup>
                        <div className="popup-content attraction-popup">
                          <h4>{attraction.name}</h4>
                          <p className="attraction-description">{attraction.description}</p>
                          {attraction.details && (
                            <div className="attraction-details">
                              <p>{attraction.details}</p>
                            </div>
                          )}
                          <div className="attraction-info">
                            {attraction.openTime && (
                              <div className="info-item">
                                <span className="info-label">🕒 开放时间:</span>
                                <span className="info-value">{attraction.openTime}</span>
                              </div>
                            )}
                            {attraction.ticketPrice && (
                              <div className="info-item">
                                <span className="info-label">💰 门票价格:</span>
                                <span className="info-value">{attraction.ticketPrice}</span>
                              </div>
                            )}
                          </div>
                          {attraction.highlights && attraction.highlights.length > 0 && (
                            <div className="attraction-highlights">
                              <span className="highlights-label">✨ 亮点:</span>
                              <div className="highlights-tags">
                                {attraction.highlights.map((highlight, idx) => (
                                  <span 
                                    key={idx} 
                                    className="highlight-tag"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const highlightInfo = highlightDetails[highlight];
                                      if (highlightInfo) {
                                        setSelectedHighlight(highlightInfo);
                                      }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {attraction.tips && (
                            <div className="attraction-tips">
                              <span className="tips-label">💡 小贴士:</span>
                              <p className="tips-content">{attraction.tips}</p>
                            </div>
                          )}
                          <span className="popup-order">第{index + 1}站</span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </>
              )}

              {/* 城市标记（仅在全景模式显示） */}
              {!selectedDayData &&
                tourData
                  .filter(
                    (day, index, arr) =>
                      arr.findIndex((d) => d.city === day.city) === index
                  )
                  .map((day) => (
                    <Marker key={day.city} position={day.coordinates}>
                      <Popup>
                        <div className="popup-content">
                          <h4>{day.city}</h4>
                          <p>
                            停留天数:{" "}
                            {tourData.filter((d) => d.city === day.city).length}
                            天
                          </p>
                          <div className="popup-highlights">
                            {day.highlights
                              .slice(0, 3)
                              .map((highlight, index) => (
                                <span 
                                  key={index} 
                                  className="popup-tag"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const highlightInfo = highlightDetails[highlight];
                                    if (highlightInfo) {
                                      setSelectedHighlight(highlightInfo);
                                    }
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
            </MapContainer>
          </div>
        </div>

        {/* 推荐详情弹窗 */}
        {selectedRecommendation && (
          <div
            className="recommendation-modal"
            onClick={() => setSelectedRecommendation(null)}
          >
            <div
              className="recommendation-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="recommendation-header">
                <h3>
                  {selectedRecommendation.type === "food" ? "🍽️" : "📍"}
                  {selectedRecommendation.name}
                </h3>
                <button
                  className="close-button"
                  onClick={() => setSelectedRecommendation(null)}
                >
                  ×
                </button>
              </div>

              <div className="recommendation-body">

                <p className="recommendation-description">
                  {selectedRecommendation.description}
                </p>
                <p className="recommendation-details">
                  {selectedRecommendation.details}
                </p>

                {/* 地图位置 */}
                <div className="recommendation-map">
                  <h4>📍 位置</h4>
                  <MapContainer
                    center={selectedRecommendation.coordinates}
                    zoom={15}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={selectedRecommendation.coordinates}>
                      <Popup>{selectedRecommendation.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* 推荐店铺（仅美食类） */}
                {selectedRecommendation.type === "food" &&
                  selectedRecommendation.shops && (
                    <div className="recommendation-shops">
                      <h4>🏪 推荐店铺</h4>
                      {selectedRecommendation.shops.map((shop, index) => (
                        <div key={index} className="shop-card">
                          <h5>{shop.name}</h5>
                          <p className="shop-address">📍 {shop.address}</p>
                          <div className="shop-specialties">
                            <strong>招牌：</strong>
                            {shop.specialties.map((specialty, idx) => (
                              <span key={idx} className="specialty-tag">
                                {specialty}
                              </span>
                            ))}
                          </div>

                          <div className="shop-map">
                            <MapContainer
                              center={shop.coordinates}
                              zoom={16}
                              style={{
                                height: "150px",
                                width: "100%",
                                marginTop: "10px",
                              }}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              <Marker position={shop.coordinates}>
                                <Popup>{shop.name}</Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Highlight详情弹窗 */}
        {selectedHighlight && (
          <div
            className="recommendation-modal"
            onClick={() => setSelectedHighlight(null)}
          >
            <div
              className="recommendation-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="recommendation-header">
                <h3>
                  ✨ {selectedHighlight.name}
                </h3>
                <button
                  className="close-button"
                  onClick={() => setSelectedHighlight(null)}
                >
                  ×
                </button>
              </div>

              <div className="recommendation-body">
                <p className="recommendation-description">
                  {selectedHighlight.description}
                </p>
                <p className="recommendation-details">
                  {selectedHighlight.details}
                </p>

                {selectedHighlight.tips && (
                  <div className="highlight-tips-section">
                    <h4>💡 小贴士</h4>
                    <p className="highlight-tips-content">
                      {selectedHighlight.tips}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 行程亮点 */}
        <div className="highlights-section">
          <h2>行程亮点</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <h3>🏛️ 历史文化</h3>
              <p>
                探访三坊七巷名人故居、广济桥古建筑、小公园开埠区，感受深厚的历史文化底蕴
              </p>
            </div>
            <div className="highlight-card">
              <h3>🍜 美食体验</h3>
              <p>品尝福州鱼丸肉燕、锅边糊、潮汕红桃粿、汕头海鲜等地道美食</p>
            </div>
            <div className="highlight-card">
              <h3>🌊 自然风光</h3>
              <p>登鼓山俯瞰福州全景、韩江夜游、南澳岛海岛风光，欣赏山海美景</p>
            </div>
            <div className="highlight-card">
              <h3>🎨 文化体验</h3>
              <p>手工制作红桃粿、烟台山文艺夜游、骑楼建筑摄影，体验多元文化</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPreview;
