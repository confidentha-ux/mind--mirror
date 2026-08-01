import { useState, useRef, useEffect } from "react";
import QuickTest from "./QuickTest";
import Oracle from "./Oracle";
import Comprehensive from "./Comprehensive";
import NewWindow from "./NewWindow";
import LoadingScreen from "./LoadingScreen";
import Prologue from "./Prologue";
import SituationRevisit from "./SituationRevisit";

// ── 섹션 2 — 기본화면 (감정 구조) 12문항 ─────────────────────────

const SECTION2_QUESTIONS = [
  {
    id: 1,
    title: "뿌듯했던 순간",
    type: "single",
    question: "최근 스스로가 뿌듯했던 순간이 있었나요?",
    options: ["있었다", "잘 모르겠다", "없었다"],
    followUp: {
      condition: "있었다",
      question: "그 순간을 지금도 기억하고 있나요?",
      options: [
        "선명하게 기억한다",
        "흐릿하게 기억한다",
        "기억은 나는데 그때 감정이 잘 안 떠오른다",
        "잘 기억나지 않는다",
      ],
    },
  },
  {
    id: 2,
    title: "긍정 감정 출처",
    type: "two_stage",
    question: "그 느낌은 어디서 왔나요?",
    stage1: {
      options: ["내가 스스로 해냈다는 느낌", "누군가가 알아봐줬다는 느낌"],
    },
    stage2: {
      "내가 스스로 해냈다는 느낌": {
        options: [
          "오래 준비하거나 노력한 게 결과로 나왔다",
          "어렵다고 생각했는데 내가 잘 해냈다",
          "누가 시킨 게 아니라 내가 하고 싶어서 했다",
          "예전의 나라면 못 했을 텐데 이번엔 달랐다",
        ],
      },
      "누군가가 알아봐줬다는 느낌": {
        options: [
          "누군가가 내 노력이나 결과를 알아봐줬다",
          "누군가와 함께했고 그 연결이 좋았다",
          "내가 누군가에게 도움이 됐다",
          "특별히 뭘 한 것은 아닌데 그냥 내가 환영받는 느낌이었다",
        ],
      },
    },
  },
  {
    id: 3,
    title: "긍정 감정 지속성",
    type: "single",
    question: "그 느낌은 얼마나 갔나요?",
    options: [
      "그 순간만 좋았고 금방 사라졌다",
      "하루 이틀 정도 좋은 기분이 남았다",
      "꽤 오래 내 안에 남아있었다",
      "지금도 가끔 떠올리면 좋다",
    ],
    followUp: {
      condition: "그 순간만 좋았고 금방 사라졌다",
      question: "그 느낌이 금방 사라진 이유가 뭔가요?",
      options: [
        "다른 일이 생겨서 잊었다",
        "별거 아니라고 스스로 축소했다",
        "더 잘해야 한다는 생각으로 넘어갔다",
        "누군가에게 말하지 않아서 혼자 사라진 것 같다",
        "잘 모르겠다",
      ],
    },
  },
  {
    id: 4,
    title: "힘들었던 순간",
    type: "single",
    question: "최근 스스로가 작아지거나 힘들었던 순간이 있었나요?",
    options: ["있었다", "잘 모르겠다", "없었다"],
  },
  {
    id: 5,
    title: "부정 감정 출처",
    type: "two_stage",
    question: "그 감정은 어디서 왔나요?",
    stage1: {
      options: ["내 안에서 온 것 같다", "누군가나 상황이 나를 힘들게 했다"],
    },
    stage2: {
      "내 안에서 온 것 같다": {
        multi: true,
        options: [
          "나는 왜 이것밖에 못 할까",
          "또 실수했다",
          "나는 원래 이런 사람이다",
          "아무리 해도 안 된다",
          "남들은 되는데 나만 안 된다",
          "누군가에게 들킬까봐 두려웠다",
        ],
      },
      "누군가나 상황이 나를 힘들게 했다": {
        multi: true,
        options: [
          "무시당한 것 같았다",
          "거절당한 것 같았다",
          "억울했다",
          "아무도 내 편이 없다는 느낌이었다",
          "믿었는데 배신당한 느낌이었다",
          "나만 빠진 것 같았다",
          "나만 이런 상황인 것 같았다",
        ],
      },
    },
  },
  {
    id: 6,
    title: "부정 감정 지속성",
    type: "single",
    question: "그 힘들었던 감정은 얼마나 갔나요?",
    options: [
      "그 순간만 힘들었고 금방 사라졌다",
      "하루 이틀 정도 마음에 남았다",
      "꽤 오래 안고 갔다",
      "아직도 남아있는 것 같다",
    ],
  },
  {
    id: 7,
    title: "감정이 켜지는 때",
    type: "single",
    question: "감정이 많이 올라오는 때는 주로 언제인가요?",
    options: [
      "혼자 있을 때",
      "누군가와 함께할 때",
      "일이나 과제를 할 때",
      "아무것도 안 할 때",
    ],
  },
  {
    id: 8,
    title: "관계 감정",
    type: "two_stage",
    question: "사람들과 함께 있을 때 내가 자주 느끼는 감정은 어떤 쪽에 가까운가요?",
    stage1: {
      options: [
        "함께여서 좋다",
        "함께인데 혼자인 것 같다",
        "맞춰야 한다는 느낌이 든다",
        "관계에서 자주 아프다",
        "기대고 싶은데 기대면 안 될 것 같다",
      ],
    },
    stage2: {
      "함께여서 좋다": {
        multi: true,
        options: [
          "같이 있는 것만으로도 편할 때",
          "내 말을 끝까지 들어줄 때",
          "말하지 않아도 알아줄 때",
          "내 편이라는 게 느껴질 때",
          "함께 뭔가를 해낼 때",
        ],
      },
      "함께인데 혼자인 것 같다": {
        multi: true,
        options: [
          "말해도 전달이 안 된다는 느낌이 들 때",
          "나만 겉도는 것 같을 때",
          "대화는 하는데 마음은 닿지 않는 것 같을 때",
          "내 이야기를 아무도 궁금해하지 않을 때",
          "내가 없어도 아무 상관없을 것 같을 때",
        ],
      },
      "맞춰야 한다는 느낌이 든다": {
        multi: true,
        options: [
          "내가 어떻게 보일지 신경 쓰일 때",
          "실수하면 안 된다는 느낌이 들 때",
          "상대 기분을 먼저 살피게 될 때",
          "내 말이 상대를 불편하게 할까봐 망설여질 때",
          "나를 숨기고 맞춰가고 있다는 느낌이 들 때",
          "내가 너무 많은 걸 원하는 건 아닐까 싶을 때",
        ],
      },
      "관계에서 자주 아프다": {
        multi: true,
        options: [
          "믿었는데 배신당한 것 같을 때",
          "오해받았는데 해명할 수 없을 때",
          "무시당한 것 같을 때",
          "억울한데 말할 수 없을 때",
          "내 감정이 가볍게 취급당한 것 같을 때",
          "사과를 받지 못했을 때",
          "내가 먼저 손을 내밀어야 하는 상황일 때",
        ],
      },
      "기대고 싶은데 기대면 안 될 것 같다": {
        multi: true,
        options: [
          "기대고 싶은데 기대면 상대가 떠날 것 같다",
          "혼자가 편한데 혼자이면 외롭다",
          "가까워지고 싶은데 가까워지면 무서워진다",
          "도움을 받고 싶은데 부탁하면 약해 보일 것 같다",
          "관계를 끊고 싶은데 끊으면 후회할 것 같다",
          "상대가 나를 얼마나 좋아하는지 확인하고 싶어진다",
        ],
      },
    },
  },
  {
    id: 9,
    title: "부러움",
    type: "two_stage",
    question: "누군가가 부러웠다면 그 부러움은 어떤 것에 가까운가요?",
    stage1: {
      options: [
        "저 사람이 가진 것이 부러웠다",
        "저 사람처럼 되고 싶었다",
        "저 사람이 받는 것이 부러웠다",
        "저 사람이 할 수 있는 것이 부러웠다",
      ],
    },
    stage2: {
      "저 사람이 가진 것이 부러웠다": {
        options: [
          "돈이나 물질적인 것",
          "안정된 환경이나 조건",
          "좋은 관계나 가족",
          "시간이나 여유",
          "건강",
          "기회나 운",
        ],
      },
      "저 사람처럼 되고 싶었다": {
        options: [
          "저 사람의 성격이나 태도",
          "저 사람의 자신감",
          "저 사람이 사람들한테 좋게 보이는 것",
          "저 사람의 삶을 대하는 방식",
          "저 사람의 감정을 다루는 방식",
        ],
      },
      "저 사람이 받는 것이 부러웠다": {
        options: [
          "사람들에게 인정받는 것",
          "사랑받는 것",
          "편하게 기댈 수 있는 사람이 있는 것",
          "있는 그대로 받아들여지는 것",
          "누군가가 먼저 챙겨주는 것",
        ],
      },
      "저 사람이 할 수 있는 것이 부러웠다": {
        options: [
          "자기 생각을 잘 표현하는 능력",
          "사람들과 쉽게 어울리는 능력",
          "어려운 상황에서도 흔들리지 않는 능력",
          "하고 싶은 걸 실제로 해내는 능력",
          "감정을 잘 다루는 능력",
          "자기 자신을 잘 아는 능력",
        ],
      },
    },
  },
  {
    id: 10,
    title: "놀람",
    type: "single",
    question: "자기 자신에게 스스로 놀라는 순간은 주로 어떤 때인가요?",
    options: [
      "생각보다 강하게 반응했을 때",
      "생각보다 아무렇지 않았을 때",
      "하기 싫었는데 해냈을 때",
      "할 수 있다고 생각했는데 못 했을 때",
      "나도 몰랐던 감정이 올라왔을 때",
    ],
  },
  {
    id: 11,
    title: "반복 패턴",
    type: "multi",
    question: "살면서 '또 이러네' 싶었던 순간, 어떤 일이 반복되었나요?",
    options: [
      "비슷한 상황에서 비슷하게 화가 난다",
      "비슷한 사람에게 비슷하게 상처받는다",
      "다짐했는데 비슷한 실수를 반복한다",
      "관계가 비슷한 방식으로 틀어진다",
      "비슷한 순간에 나를 닫아버린다",
      "잘 되다가 비슷한 지점에서 포기한다",
    ],
  },
  {
    id: 12,
    title: "패턴 반응",
    type: "single",
    question: "뭔가가 내게 반복되고 있다는 것을 알아챘을 때 어떤 생각이 드시나요?",
    options: [
      "나는 왜 이러지라는 자책이 든다",
      "어쩔 수 없지라는 체념이 든다",
      "바꾸고 싶다는 생각이 든다",
      "내가 왜 이런지 이유가 궁금해진다",
      "그냥 모른 척하고 싶다",
      "무슨 생각이 드는지 모르겠다",
    ],
  },
];

// ── 섹션 3 — 운영체계 (인지 패턴) 8문항 ─────────────────────────

const SECTION3_QUESTIONS = [
  {
    id: 1,
    title: "나를 보는 눈",
    type: "single",
    question: "평소 나 자신에 대해 가장 자주 드는 생각은 뭔가요?",
    options: [
      "나는 왠지 남들보다 뒤처지는 것 같다",
      "나는 괜찮은 사람이다",
      "나는 특별히 잘하는 게 없다",
      "나는 나쁜 사람은 아니다",
      "나는 나 자신을 잘 모르겠다",
    ],
    followUp: {
      question: "그 생각이 드는 건 언제 가장 강하게 느껴지나요?",
      options: [
        "누군가와 비교될 때",
        "실수했을 때",
        "혼자 있을 때",
        "누군가에게 평가받을 때",
        "잘 해냈는데도 인정받지 못할 때",
      ],
    },
  },
  {
    id: 2,
    title: "일이 틀어졌을 때",
    type: "single",
    question: "무언가 잘못됐다고 느낄 때, 내 안에서 자동으로 켜지는 생각은 뭔가요?",
    options: [
      "내가 뭔가 잘못했다",
      "상대가 잘못했다",
      "그냥 원래 이런 거야",
      "내가 예민한 거다",
      "어쩔 수 없었다",
      "이유를 모르겠다",
    ],
  },
  {
    id: 3,
    title: "누가 나를 건드렸을 때",
    type: "single",
    question: "누군가의 말이나 행동이 나를 건드렸을 때 내 안에서 먼저 일어나는 건 뭔가요?",
    options: [
      "내가 왜 그렇게 느꼈는지 상대가 알아줬으면 한다",
      "내가 잘못한 게 있나 돌아본다",
      "그 자리를 피하고 싶어진다",
      "아무렇지 않은 척한다",
      "혼자 삭히다가 나중에 터진다",
      "즉각 반응하고 나중에 후회한다",
    ],
    followUp: {
      question: "그 상황이 지나고 나서 드는 생각은 뭔가요?",
      options: [
        "내가 좀 과하게 반응한 것 같다",
        "상대의 말이나 태도가 여전히 걸린다",
        "왜 그랬는지 이해가 안 된다",
        "후회된다",
        "어쩔 수 없었다",
      ],
    },
  },
  {
    id: 5,
    title: "상대가 조용할 때",
    type: "single",
    question: "상대가 아무 말도 안 할 때, 내 안에서 자동으로 드는 생각은 뭔가요?",
    options: [
      "나한테 화가 난 것 같다",
      "나를 무시하는 것 같다",
      "그냥 바쁜 거겠지",
      "뭔가 문제가 생긴 것 같다",
      "나 때문인 것 같다",
      "별 생각이 없는 것 같다",
    ],
    followUp: {
      question: "그 생각이 들었을 때 나는 어떻게 하나요?",
      options: [
        "직접 확인한다",
        "혼자 계속 생각한다",
        "거리를 둔다",
        "아무렇지 않은 척한다",
        "먼저 맞춰가려고 한다",
      ],
    },
  },
  {
    id: 6,
    title: "일이 안 됐을 때",
    type: "single",
    question: "어떤 일이 잘 안 됐을 때 내 안에서 자동으로 드는 생각은 뭔가요?",
    options: [
      "완전히 실패한 거다",
      "이 정도면 괜찮다",
      "다음엔 잘 될 거다",
      "역시 나는 안 된다",
      "상황이 안 좋았던 거다",
      "잘 된 부분도 있고 안 된 부분도 있다",
    ],
  },
  {
    id: 7,
    title: "안 좋은 일이 생기면",
    type: "single",
    question: "안 좋은 일이 생겼을 때 내 안에서 자동으로 드는 생각은 뭔가요?",
    options: [
      "앞으로도 계속 이럴 것 같다",
      "이번만 이런 거다",
      "나는 항상 이런 식이다",
      "이런 일은 나한테만 생긴다",
      "이번엔 그랬지만 다음엔 다를 수 있다",
      "잘 모르겠다",
    ],
  },
  {
    id: 8,
    title: "앞일을 그려볼 때",
    type: "single",
    question: "아직 일어나지 않은 일인데 미리 걱정될 때 내 안에서 자동으로 드는 생각은 뭔가요?",
    options: [
      "분명히 잘 안 될 것 같다",
      "최악의 상황을 먼저 생각하게 된다",
      "어떻게 될지 모르니까 일단 해보자",
      "잘 될 수도 있고 안 될 수도 있다",
      "생각하기 싫어서 피하게 된다",
      "걱정보다 준비를 먼저 한다",
    ],
  },
];

const SYSTEM_PROMPT_S2 = `당신은 마음거울의 분석가입니다.
사용자가 답한 감정 구조 검사 결과를 분석합니다.

분석 원칙:
1. 사람을 정의하지 말고 반복되는 감정 패턴을 관찰하라
2. 결론보다 흔적을 먼저 보여라
3. 해석은 가설로만 제시하라
4. 장점과 비용을 함께 보여라
5. 볼드(**텍스트**) 절대 사용 금지
6. 소제목(###) 절대 사용 금지
7. 존댓말로 쓸 것. 따뜻하되 거리를 유지할 것
8. 각 섹션 최대 4-5문장
9. 전체가 하나의 흐름처럼 읽혀야 한다
10. "~군요", "~네요" 같은 감탄 어투 금지. "~일 수 있어요", "~했을 수도 있어요" 형식으로

출력 구조:
## 감정이 켜지는 방식
## 관계 안에서 반복되는 것
## 부러움이 말하는 것
## 반복된 패턴
## 이제 질문은 당신에게

한국어로 작성하세요.`;

const SYSTEM_PROMPT_S3 = `당신은 마음거울의 분석가입니다.
사용자가 답한 인지 패턴 검사 결과를 분석합니다.

분석 원칙:
1. 사람을 정의하지 말고 반복되는 인지 패턴을 관찰하라
2. 결론보다 흔적을 먼저 보여라
3. 해석은 가설로만 제시하라
4. 볼드(**텍스트**) 절대 사용 금지
5. 소제목(###) 절대 사용 금지
6. 존댓말로 쓸 것. 따뜻하되 거리를 유지할 것
7. 각 섹션 최대 4-5문장
8. 전체가 하나의 흐름처럼 읽혀야 한다
9. "~군요", "~네요" 같은 감탄 어투 금지. "~일 수 있어요", "~했을 수도 있어요" 형식으로

출력 구조:
## 자기 자신을 보는 방식
## 감정이 올라올 때 작동하는 것
## 관계에서 반복되는 해석
## 미래를 상상하는 방식
## 이제 질문은 당신에게

한국어로 작성하세요.`;

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

function FeedbackWidget({ dark = false }) {
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const textColor = dark ? "rgba(240,237,232,0.45)" : "rgba(38,50,44,0.45)";
  const borderColor = dark ? "rgba(240,237,232,0.15)" : "rgba(38,50,44,0.15)";
  const dividerColor = dark ? "rgba(240,237,232,0.08)" : "rgba(38,50,44,0.08)";
  const inputBg = dark ? "rgba(240,237,232,0.05)" : "rgba(38,50,44,0.04)";

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `당신은 마음거울의 분석가입니다. 사용자가 방금 받은 분석 결과가 자신과 맞지 않는다고 느끼고 있어요. 사용자의 말을 판단하지 말고, 어떤 부분이 맞지 않는지 조용히 들어주세요. 그리고 사용자가 스스로 더 정확한 자기 이해에 가까워지도록 도와주세요. 볼드 금지. 소제목 금지. 짧고 따뜻하게. 존댓말. "~군요", "~네요" 금지.`,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setMessages([...newMessages, { role: "assistant", content: text }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "잠시 연결이 되지 않았어요. 다시 시도해주세요." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px solid ${dividerColor}`, textAlign: "center" }}>
      <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", fontWeight: 300, color: textColor, marginBottom: "1rem" }}>읽으면서 가장 크게 울린 부분이 있다면?</p>
      {!selected && (
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setSelected("yes")} style={{ background: "none", border: `1px solid ${borderColor}`, fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: textColor, padding: "0.4rem 1rem", cursor: "pointer" }}>👍 맞아요</button>
          <button onClick={() => setSelected("no")} style={{ background: "none", border: `1px solid ${borderColor}`, fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: textColor, padding: "0.4rem 1rem", cursor: "pointer" }}>👎 아닌 것 같아요</button>
          <button onClick={() => setSelected("unsure")} style={{ background: "none", border: `1px solid ${borderColor}`, fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: textColor, padding: "0.4rem 1rem", cursor: "pointer" }}>🤔 잘 모르겠어요</button>
        </div>
      )}
      {selected === "yes" && <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", fontWeight: 300, color: textColor }}>감사해요.</p>}
      {selected === "unsure" && <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", fontWeight: 300, color: textColor }}>그 모르겠다는 느낌도 중요한 정보예요.</p>}
      {selected === "no" && (
        <div style={{ textAlign: "left" }}>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: textColor, lineHeight: 1.9, marginBottom: "1.25rem" }}>
            어떤 부분이 맞지 않았나요? 말씀해주시면 같이 다시 볼게요.
          </p>
          <div style={{ marginBottom: "1rem", maxHeight: "300px", overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                marginBottom: "1rem",
                textAlign: m.role === "user" ? "right" : "left",
              }}>
                <span style={{
                  display: "inline-block",
                  fontFamily: "'Source Serif 4',serif",
                  fontSize: "0.85rem", fontWeight: 300,
                  color: textColor,
                  lineHeight: 1.8,
                  background: m.role === "user" ? inputBg : "transparent",
                  border: m.role === "user" ? `1px solid ${borderColor}` : "none",
                  padding: m.role === "user" ? "0.5rem 0.9rem" : "0",
                  maxWidth: "85%",
                  whiteSpace: "pre-wrap",
                }}>{m.content}</span>
              </div>
            ))}
            {loading && (
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: textColor, opacity: 0.4 }}>...</p>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              placeholder="여기에 써주세요..."
              style={{
                flex: 1,
                background: inputBg,
                border: `1px solid ${borderColor}`,
                color: textColor,
                fontFamily: "'Source Serif 4',serif",
                fontSize: "0.85rem", fontWeight: 300,
                padding: "0.5rem 0.75rem",
                outline: "none",
              }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading} style={{
              background: "none",
              border: `1px solid ${borderColor}`,
              color: textColor,
              fontFamily: "'Source Serif 4',serif",
              fontSize: "0.78rem",
              padding: "0.5rem 1rem",
              cursor: input.trim() && !loading ? "pointer" : "default",
              opacity: input.trim() && !loading ? 1 : 0.35,
            }}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 객관식 섹션 공용 컴포넌트 ─────────────────────────────────────

function MCQSection({ questions, sectionNum, accentColor, bgColor, textColor, introTitle, introLabel, introHeading, introBody, introBefore, onComplete, onBack: onBackProp }) {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stage1Answer, setStage1Answer] = useState(null);
  const [stage2Answer, setStage2Answer] = useState([]);
  const [followUpAnswer, setFollowUpAnswer] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [visibleSections, setVisibleSections] = useState([]);

  const q = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  const resultKeys = sectionNum === 2
    ? ["감정이 켜지는 방식", "관계 안에서 반복되는 것", "부러움이 말하는 것", "반복된 패턴", "이제 질문은 당신에게"]
    : ["자기 자신을 보는 방식", "감정이 올라올 때 작동하는 것", "관계에서 반복되는 해석", "미래를 상상하는 방식", "이제 질문은 당신에게"];

  const systemPrompt = sectionNum === 2 ? SYSTEM_PROMPT_S2 : SYSTEM_PROMPT_S3;

  function getAnswerDisplay() {
    const a = answers[currentQ];
    if (!a) return null;
    return a;
  }

  function canProceed() {
    if (q?.type === "two_stage") {
      if (!stage1Answer) return false;
      if (stage2Answer.length === 0) return false;
      return true;
    }
    if (q?.type === "multi") {
      return (answers[currentQ] || []).length > 0;
    }
    if (showFollowUp) {
      return !!followUpAnswer;
    }
    return !!answers[currentQ];
  }

  function handleSingle(opt) {
    setAnswers(prev => ({ ...prev, [currentQ]: opt }));
    if (q.followUp && opt === q.followUp.condition) {
      setShowFollowUp(true);
    } else {
      setShowFollowUp(false);
      setFollowUpAnswer(null);
    }
    // 확인질문 없는 단일선택은 자동 진행
    if (!q.followUp && q.type === "single") {
      setTimeout(() => goNext({ ...answers, [currentQ]: opt }), 300);
    }
  }

  function handleMulti(opt) {
    const cur = answers[currentQ] || [];
    const next = cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt];
    setAnswers(prev => ({ ...prev, [currentQ]: next }));
  }

  function handleStage1(opt) {
    setStage1Answer(opt);
    setStage2Answer([]);
  }

  function handleStage2Single(opt) {
    setStage2Answer([opt]);
  }

  function handleStage2Multi(opt) {
    setStage2Answer(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  }

  function goNext(overrideAnswers) {
    const allAnswers = overrideAnswers || answers;
    let finalAnswer = allAnswers[currentQ];

    if (q?.type === "two_stage") {
      finalAnswer = `${stage1Answer} > ${stage2Answer.join(", ")}`;
    } else if (showFollowUp && followUpAnswer) {
      finalAnswer = `${allAnswers[currentQ]} (확인: ${followUpAnswer})`;
    } else if (q?.followUp && !q?.followUp?.condition) {
      // 항상 확인질문
      finalAnswer = `${allAnswers[currentQ]} (확인: ${followUpAnswer || ""})`;
    }

    const newAnswers = { ...allAnswers, [currentQ]: finalAnswer };
    setAnswers(newAnswers);
    setStage1Answer(null);
    setStage2Answer([]);
    setFollowUpAnswer(null);
    setShowFollowUp(false);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("analyzing");
      analyze(newAnswers);
    }
  }

  function handleNext() {
    if (!canProceed()) return;
    goNext();
  }

  function handleBack() {
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      setCurrentQ(currentQ - 1);
      setStage1Answer(null);
      setStage2Answer([]);
      setFollowUpAnswer(null);
      setShowFollowUp(false);
    }
  }

  async function analyze(allAnswers) {
    const userContent = questions.map((q, i) =>
      `[${q.title}]\n${allAnswers[i] || "(미응답)"}`
    ).join("\n\n");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      const data = await response.json();
      const text = data.content ? data.content.map(b => typeof b.text === "string" ? b.text : "").join("") : "분석 실패";
      const key = sectionNum === 2 ? "mindmirror_result1" : "mindmirror_result2";
      localStorage.setItem(key, text);
      setAnalysis(text);
      setPhase("result");
      resultKeys.forEach((s, i) => {
        setTimeout(() => setVisibleSections(prev => [...prev, s]), i * 1400);
      });
    } catch (e) {
      setAnalysis("분석 실패");
      setPhase("result");
    }
  }

  function parseSection(text, key) {
    if (!text) return "";
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const idx = resultKeys.indexOf(key);
    const rest = resultKeys.slice(idx + 1).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = rest.length > 0
      ? new RegExp(`##\\s*${escaped}([\\s\\S]*?)(?:##\\s*(?:${rest.join("|")})|$)`)
      : new RegExp(`##\\s*${escaped}([\\s\\S]*?)$`);
    const match = text.match(pattern);
    return match ? match[1].trim() : "";
  }

  const stage2Config = q?.type === "two_stage" && stage1Answer ? q.stage2[stage1Answer] : null;
  const isStage2Multi = stage2Config?.multi;

  // 분석 로딩은 풀스크린 단독 (다른 섹션과 통일)
  if (phase === "analyzing") return <LoadingScreen section={sectionNum} />;

  return (
    <div style={{
      minHeight: "100vh",
      background: phase === "result" ? "#F7F2E8" : phase === "analyzing" ? "#1F3A32" : bgColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem", transition: "background 0.6s ease",
    }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.35} 50%{opacity:0.9} }
        .sec-appear { animation: fadeUp 1.4s ease forwards; opacity:0; }
      `}</style>

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{ width: "100%", maxWidth: 640, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: accentColor, marginBottom: "1.5rem" }}>{introLabel}</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 400, lineHeight: 1.2, color: textColor, marginBottom: "2rem" }}>{introHeading}</h1>
          <div style={{ marginBottom: "1.5rem" }}>
            {introBody.map((line, i) => (
              <p key={i} style={{ fontFamily: i % 2 === 1 ? "'Playfair Display',serif" : "'Source Serif 4',serif", fontStyle: i % 2 === 1 ? "italic" : "normal", fontSize: "0.93rem", fontWeight: 300, color: i % 2 === 1 ? accentColor : `rgba(${textColor === "#3A2E24" ? "58,46,36" : "30,46,30"},0.75)`, lineHeight: 1.9, marginBottom: "0.75rem" }}>{line}</p>
            ))}
          </div>
          <div style={{ background: `rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.1)`, borderLeft: `3px solid ${accentColor}`, padding: "1.1rem 1.25rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: accentColor, marginBottom: "0.6rem" }}>시작 전에</div>
            {introBefore.map((t, i) => (
              <div key={i} style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", fontWeight: 300, color: `rgba(${textColor === "#3A2E24" ? "58,46,36" : "30,46,30"},0.7)`, lineHeight: 1.85, display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={{ opacity: 0.5 }}>—</span>{t}
              </div>
            ))}
          </div>
          <div style={{ width: "48px", height: "1px", background: accentColor, margin: "2rem 0" }} />
          <div style={{ marginBottom: "2rem" }}>
            {questions.map((q, i) => (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.4rem 0", borderBottom: `1px solid rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.2)` }}>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.7rem", color: accentColor, opacity: 0.8, minWidth: "1.5rem" }}>{i + 1}</span>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: textColor }}>{q.title}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={() => setPhase("questions")} style={{ background: accentColor, border: "none", color: "#F7F2E8", fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "1.1rem 2.8rem", cursor: "pointer" }}>{introTitle}</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{ width: "100%", maxWidth: 600, position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.1)", marginBottom: "3rem" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: accentColor, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: textColor, opacity: 0.5, marginBottom: "0.6rem" }}>
            {currentQ + 1} / {questions.length}
          </div>

          {/* 2단계 질문 */}
          {q.type === "two_stage" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 400, color: textColor, lineHeight: 1.5, marginBottom: "1.5rem" }}>{q.question}</h2>
              {q.stage1.options.map(opt => (
                <button key={opt} onClick={() => handleStage1(opt)} style={{
                  width: "100%", background: stage1Answer === opt ? `rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.2)` : "rgba(0,0,0,0.06)",
                  border: stage1Answer === opt ? `1px solid ${accentColor}` : "1px solid rgba(0,0,0,0.12)",
                  color: textColor, fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300,
                  textAlign: "left", padding: "0.85rem 1.1rem", cursor: "pointer", marginBottom: "0.4rem", lineHeight: 1.5, transition: "all 0.3s",
                }}>{opt}</button>
              ))}

              {stage1Answer && stage2Config && (
                <div style={{ marginTop: "1.5rem" }}>
                  <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", color: textColor, opacity: 0.5, marginBottom: "0.75rem" }}>
                    {isStage2Multi ? "해당되는 것 모두 선택하세요" : "하나를 선택하세요"}
                  </div>
                  {stage2Config.options.map(opt => {
                    const isSelected = isStage2Multi ? stage2Answer.includes(opt) : stage2Answer[0] === opt;
                    return (
                      <button key={opt} onClick={() => isStage2Multi ? handleStage2Multi(opt) : handleStage2Single(opt)} style={{
                        width: "100%", background: isSelected ? `rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.2)` : "rgba(0,0,0,0.04)",
                        border: isSelected ? `1px solid ${accentColor}` : "1px solid rgba(0,0,0,0.1)",
                        color: textColor, fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300,
                        textAlign: "left", padding: "0.75rem 1.1rem", cursor: "pointer", marginBottom: "0.35rem", lineHeight: 1.5, transition: "all 0.3s",
                      }}>
                        {isStage2Multi && <span style={{ marginRight: "0.5rem", opacity: 0.5 }}>{isSelected ? "✓" : "○"}</span>}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 단일선택 */}
          {q.type === "single" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 400, color: textColor, lineHeight: 1.5, marginBottom: "1.5rem" }}>{q.question}</h2>
              {q.options.map(opt => (
                <button key={opt} onClick={() => handleSingle(opt)} style={{
                  width: "100%", background: answers[currentQ] === opt ? `rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.2)` : "rgba(0,0,0,0.06)",
                  border: answers[currentQ] === opt ? `1px solid ${accentColor}` : "1px solid rgba(0,0,0,0.12)",
                  color: textColor, fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300,
                  textAlign: "left", padding: "0.85rem 1.1rem", cursor: "pointer", marginBottom: "0.4rem", lineHeight: 1.5, transition: "all 0.3s",
                }}>{opt}</button>
              ))}

              {showFollowUp && q.followUp && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: textColor, opacity: 0.7, marginBottom: "0.75rem" }}>{q.followUp.question}</p>
                  {q.followUp.options.map(opt => (
                    <button key={opt} onClick={() => setFollowUpAnswer(opt)} style={{
                      width: "100%", background: followUpAnswer === opt ? `rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.2)` : "rgba(0,0,0,0.04)",
                      border: followUpAnswer === opt ? `1px solid ${accentColor}` : "1px solid rgba(0,0,0,0.1)",
                      color: textColor, fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300,
                      textAlign: "left", padding: "0.75rem 1.1rem", cursor: "pointer", marginBottom: "0.35rem", lineHeight: 1.5, transition: "all 0.3s",
                    }}>{opt}</button>
                  ))}
                </div>
              )}

              {/* 확인질문 항상 (condition 없는 경우) */}
              {!showFollowUp && q.followUp && !q.followUp.condition && answers[currentQ] && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: textColor, opacity: 0.7, marginBottom: "0.75rem" }}>{q.followUp.question}</p>
                  {q.followUp.options.map(opt => (
                    <button key={opt} onClick={() => setFollowUpAnswer(opt)} style={{
                      width: "100%", background: followUpAnswer === opt ? `rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.2)` : "rgba(0,0,0,0.04)",
                      border: followUpAnswer === opt ? `1px solid ${accentColor}` : "1px solid rgba(0,0,0,0.1)",
                      color: textColor, fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300,
                      textAlign: "left", padding: "0.75rem 1.1rem", cursor: "pointer", marginBottom: "0.35rem", lineHeight: 1.5, transition: "all 0.3s",
                    }}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 다중선택 */}
          {q.type === "multi" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 400, color: textColor, lineHeight: 1.5, marginBottom: "1.5rem" }}>{q.question}</h2>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", color: textColor, opacity: 0.5, marginBottom: "0.75rem" }}>해당되는 것 모두 선택하세요</div>
              {q.options.map(opt => {
                const cur = answers[currentQ] || [];
                const isSelected = cur.includes(opt);
                return (
                  <button key={opt} onClick={() => handleMulti(opt)} style={{
                    width: "100%", background: isSelected ? `rgba(${accentColor === "#8C7A6A" ? "140,122,106" : "74,122,82"},0.2)` : "rgba(0,0,0,0.06)",
                    border: isSelected ? `1px solid ${accentColor}` : "1px solid rgba(0,0,0,0.12)",
                    color: textColor, fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300,
                    textAlign: "left", padding: "0.85rem 1.1rem", cursor: "pointer", marginBottom: "0.4rem", lineHeight: 1.5, transition: "all 0.3s",
                  }}>
                    <span style={{ marginRight: "0.5rem", opacity: 0.5 }}>{isSelected ? "✓" : "○"}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
            <button onClick={handleBack} style={{ background: "transparent", border: "none", fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", color: textColor, opacity: 0.35 }}>← 이전</button>
            {(q.type !== "single" || showFollowUp || q.followUp || q.type === "two_stage" || q.type === "multi") && (
              <button onClick={handleNext} disabled={!canProceed()} style={{
                background: "transparent", border: "none", fontFamily: "'Source Serif 4',serif",
                fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase",
                cursor: "pointer", color: textColor, opacity: canProceed() ? 1 : 0.25,
              }}>
                {currentQ < questions.length - 1 ? "다음 질문 →" : "분석 시작 →"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 로딩 */}
{phase === "analyzing" && <LoadingScreen section={sectionNum} />}

      {/* 결과 */}
      {phase === "result" && (
        <div style={{ width: "100%", maxWidth: 640, maxHeight: "88vh", overflowY: "auto", scrollbarWidth: "none" }}>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(38,50,44,0.4)", marginBottom: "0.5rem" }}>
            {sectionNum === 2 ? "내 마음의 초기화면" : "내 마음의 운영체계"} — 분석 결과
          </div>
          <div style={{ width: "100%", height: "1px", background: "rgba(38,50,44,0.12)", marginBottom: "2rem" }} />
          {resultKeys.map((key, i) => {
            const content = parseSection(analysis, key);
            return visibleSections.includes(key) && content ? (
              <div key={key} className="sec-appear" style={{ marginBottom: "2rem", animationDelay: `${i * 0.2}s` }}>
                <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(38,50,44,0.4)", marginBottom: "0.4rem" }}>{key}</div>
                <div style={{ width: "100%", height: "1px", background: "rgba(38,50,44,0.12)", marginBottom: "1rem" }} />
                <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "#1F3A32", lineHeight: 2, whiteSpace: "pre-wrap" }}>{content}</div>
              </div>
            ) : null;
          })}
          {visibleSections.length === resultKeys.length && (
            <div>
              <FeedbackWidget />
              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
                <button onClick={() => navigator.clipboard.writeText(analysis).then(() => alert("복사되었습니다."))} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.25)", color: "rgba(38,50,44,0.6)", fontFamily: "'Source Serif 4',serif", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", padding: "0.75rem 1.75rem" }}>결과 복사</button>
                <button onClick={() => onComplete && onComplete(analysis)} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.25)", color: "rgba(38,50,44,0.6)", fontFamily: "'Source Serif 4',serif", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", padding: "0.75rem 1.75rem" }}>
                  다음으로 →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 메인 App ─────────────────────────────────────────────────────

export default function App() {
  const [showPrologue, setShowPrologue] = useState(true);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [showRevisit1, setShowRevisit1] = useState(false); // 섹션1 다시 보기
  const [revisit1Type, setRevisit1Type] = useState(null);  // 다시 보기에 넘길 유형
  const [showRevisit2, setShowRevisit2] = useState(false); // 섹션2 다시 보기
  const [showRevisit3, setShowRevisit3] = useState(false); // 섹션3 다시 보기
  const [showRevisit4, setShowRevisit4] = useState(false); // 섹션4 다시 보기
  const [showRevisit5, setShowRevisit5] = useState(false); // 섹션5 다시 보기
  const [showSection2, setShowSection2] = useState(false);
  const [showSection3, setShowSection3] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [oracleInitialPhase, setOracleInitialPhase] = useState("intro");
  const [showComprehensive, setShowComprehensive] = useState(false);
  const [showNewWindow, setShowNewWindow] = useState(false);

  if (showPrologue) return (
    <Prologue
      onEnter={(choices) => {
        try { localStorage.setItem("mindmirror_prologue", JSON.stringify(choices)); } catch (e) {}
        setShowPrologue(false);
      }}
      onBack={() => setShowPrologue(false)}
    />
  );

  // 섹션1 다시 보기 — QuickTest 완료 후 등장 → 섹션2로 바로
  if (showRevisit1) return (
    <SituationRevisit
      sectionKey="section1"
      userType={revisit1Type}
      onDone={(payload) => {
        try { localStorage.setItem("mindmirror_revisit_section1", JSON.stringify(payload)); } catch (e) {}
        setShowRevisit1(false);
        setShowSection2(true);
      }}
    />
  );

  // 섹션2 다시 보기 — 완료 후 → 섹션3으로
  if (showRevisit2) return (
    <SituationRevisit
      sectionKey="section2"
      onDone={(payload) => {
        try { localStorage.setItem("mindmirror_revisit_section2", JSON.stringify(payload)); } catch (e) {}
        setShowRevisit2(false);
        setShowSection3(true);
      }}
    />
  );

  // 섹션3 다시 보기 — 완료 후 → 섹션4(Oracle)로
  if (showRevisit3) return (
    <SituationRevisit
      sectionKey="section3"
      onDone={(payload) => {
        try { localStorage.setItem("mindmirror_revisit_section3", JSON.stringify(payload)); } catch (e) {}
        setShowRevisit3(false);
        setOracleInitialPhase("intro");
        setShowOracle(true);
      }}
    />
  );

  // 섹션4 다시 보기 — 완료 후 → 섹션5(NewWindow)로
  if (showRevisit4) return (
    <SituationRevisit
      sectionKey="section4"
      onDone={(payload) => {
        try { localStorage.setItem("mindmirror_revisit_section4", JSON.stringify(payload)); } catch (e) {}
        setShowRevisit4(false);
        setShowNewWindow(true);
      }}
    />
  );

  // 섹션5 다시 보기 — 완료 후 → 종합분석으로
  if (showRevisit5) return (
    <SituationRevisit
      sectionKey="section5"
      onDone={(payload) => {
        try { localStorage.setItem("mindmirror_revisit_section5", JSON.stringify(payload)); } catch (e) {}
        setShowRevisit5(false);
        setShowComprehensive(true);
      }}
    />
  );

  if (showQuickTest) return (
    <QuickTest
      onBack={() => {
        // QuickTest 완료/이탈 시: 저장된 유형이 있으면 다시 보기로, 없으면 메인으로
        let type = null;
        try {
          const raw = localStorage.getItem("mindmirror_quicktest");
          if (raw) {
            const parsed = JSON.parse(raw);
            type = parsed?.type || null;
          }
        } catch (e) {}
        setShowQuickTest(false);
        if (type) {
          setRevisit1Type(type);
          setShowRevisit1(true);
        }
      }}
    />
  );
  if (showComprehensive) return (
    <Comprehensive onBack={() => { setShowComprehensive(false); setOracleInitialPhase("final"); setShowOracle(true); }} />
  );
  if (showNewWindow) return <NewWindow onBack={() => setShowNewWindow(false)} onComprehensive={() => { setShowNewWindow(false); setShowRevisit5(true); }} />;
  if (showOracle) return (
    <Oracle initialPhase={oracleInitialPhase} onBack={() => { setShowOracle(false); setOracleInitialPhase("intro"); }} onComprehensive={() => { setShowOracle(false); setOracleInitialPhase("intro"); setShowRevisit4(true); }} />
  );
  if (showSection2) return (
    <MCQSection
      questions={SECTION2_QUESTIONS}
      sectionNum={2}
      accentColor="#8C7A6A"
      bgColor="#E6DDD0"
      textColor="#3A2E24"
      introLabel="내 마음의 초기화면"
      introHeading="마음에 먼저 뜨는 것"
      introTitle="시작하기"
      introBody={[
        "일이 생겼을 때 — 분석하기 전에, 말하기 전에, 행동하기 전에\n마음에 먼저 뜨는 것이 있어요.",
        "걱정이 먼저 오는 사람,\n누군가 얼굴이 먼저 떠오르는 사람,\n해결책이 먼저 보이는 사람.\n그 첫 반응이 당신의 초기화면이에요.",
        "잘 정리된 문장이 아니어도 괜찮아요.\n지금 떠오르는 선택지를 그대로 골라주세요.",
      ]}
      introBefore={[
        "틀린 답은 없어요. 지금의 나와 가장 가까운 걸 고르면 돼요.",
        "12개 질문으로 구성되어 있어요.",
        "일부 질문은 선택에 따라 추가 질문이 생겨요.",
      ]}
      onComplete={() => { setShowSection2(false); setShowRevisit2(true); }}
      onBack={() => setShowSection2(false)}
    />
  );
  if (showSection3) return (
    <MCQSection
      questions={SECTION3_QUESTIONS}
      sectionNum={3}
      accentColor="#4A7A52"
      bgColor="#C2D4C0"
      textColor="#1E2E1E"
      introLabel="내 마음의 운영체계"
      introHeading="반복이 만든 마음의 결"
      introTitle="시작하기"
      introBody={[
        "내 마음의 초기화면에서는 일이 생겼을 때\n내 마음에 자동으로 뜨는 반응을 확인했습니다.",
        "이제 그 반응 아래에서 작동하는\n해석과 판단의 방식을 살펴봅니다.",
        "내가 비슷한 상황에서 비슷한 방식으로 생각하고 선택해온 것.\n그 반복이 만들어온 구조를 확인하는 단계입니다.",
      ]}
      introBefore={[
        "이번 질문들은 조금 더 깊어요. 떠오르는 대로 편하게 골라주세요.",
        "8개 질문으로 구성되어 있어요.",
        "일부 질문은 선택에 따라 추가 질문이 생겨요.",
      ]}
      onComplete={() => { setShowSection3(false); setShowRevisit3(true); }}
      onBack={() => setShowSection3(false)}
    />
  );

  return (
    <div style={{ background: "#1F3A32", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
      <style>{FONTS + `
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade5 { opacity:0; animation:fadeUp 0.6s ease forwards 2.9s; }
        .fade7 { opacity:0; animation:fadeUp 0.6s ease forwards 4.5s; }
        .fade8 { opacity:0; animation:fadeUp 0.6s ease forwards 5.1s; }
        .intro-card-hover { transition:all 0.3s; cursor:pointer; }
        .intro-card-hover:hover { transform:translateY(-2px); }
      `}</style>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(247,242,232,0.1)" }}>
          <img src="/mark_header.png" alt="마음거울" style={{ height: "30px", width: "auto", marginBottom: "1rem", display: "block" }} />
          <h1 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "clamp(1.8rem,5vw,2.4rem)", fontWeight: 400, color: "rgba(247,242,232,0.9)", lineHeight: 1.2, marginBottom: "0.75rem" }}>나를 만나는 다섯 가지 방식</h1>
        </div>

        <div className="fade5" style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem", fontWeight: 300, color: "rgba(247,242,232,0.65)", lineHeight: 1.9, marginBottom: "0.75rem" }}>나는 나를 잘 안다고 생각했다.<br />왜 나는 매번 여기서 막히는 걸까?<br />내가 한 말인데 내가 왜 그랬는지 모르겠다.<br />나에 대해 설명하려다 말문이 막혔다.</p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem", fontWeight: 300, color: "rgba(247,242,232,0.65)", lineHeight: 1.9, marginBottom: "0.75rem" }}>모르는 게 당연해요.<br />대부분의 자기 이해는 남이 해준 말과 벌어진 사건으로 만들어졌으니까요.</p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem", fontWeight: 300, color: "rgba(247,242,232,0.65)", lineHeight: 1.9, marginBottom: "0.75rem" }}>당신이 고른 선택지가 가장 정직한 자기소개가 되어야 해요.</p>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(247,242,232,0.4)", lineHeight: 1.9 }}>답하다 보면 내가 왜 그 사람 앞에서만 작아지는지,<br />왜 늘 그 순간에 후회하는지 보이기 시작해요.</p>
        </div>

        <div className="fade7" style={{ position: "relative", paddingLeft: "3rem" }}>
          <div style={{ position: "absolute", left: 14, top: 20, bottom: 20, width: 1, background: "rgba(247,242,232,0.12)" }} />

          {/* 01 */}
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.6rem", marginLeft: "0.1rem" }}>여기서 시작하세요</div>
          <div className="intro-card-hover" style={{ position: "relative", marginBottom: "0.75rem" }}>
            <div style={{ position: "absolute", left: "-3rem", top: "1rem", width: 28, height: 28, borderRadius: "50%", background: "#8C6640", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.65rem", color: "#F7F2E8" }}>01</span>
            </div>
            <div onClick={() => setShowQuickTest(true)} style={{ background: "#EEE0CB", padding: "1.4rem 1.8rem", borderLeft: "4px solid #8C6640", borderRadius: "0 4px 4px 0", position: "relative", overflow: "hidden", minHeight: 140, boxShadow: "0 0 0 2px rgba(201,168,76,0.35)" }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(58,36,16,0.5)", marginBottom: "0.35rem" }}>설치한 적 없는데 실행되고 있는 것.</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", color: "#3A2410", marginBottom: "0.4rem" }}>내 마음의 기본값</div>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(58,36,16,0.7)", lineHeight: 1.75 }}>누가 가르쳐준 적 없는데 늘 그렇게 해온 것들이 있어요.<br />여기서 시작해요 →</p>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "-0.1rem 0 0.1rem", color: "rgba(247,242,232,0.2)", fontSize: "0.8rem" }}>↓</div>

          {/* 02 */}
          <div className="intro-card-hover" style={{ position: "relative", marginBottom: "0.75rem" }}>
            <div style={{ position: "absolute", left: "-3rem", top: "1rem", width: 28, height: 28, borderRadius: "50%", background: "#8C7A6A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.65rem", color: "#F7F2E8" }}>02</span>
            </div>
            <div onClick={() => setShowSection2(true)} style={{ background: "#E6DDD0", padding: "1.4rem 1.8rem", borderLeft: "4px solid #8C7A6A", borderRadius: "0 4px 4px 0", position: "relative", overflow: "hidden", minHeight: 140 }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(58,46,36,0.5)", marginBottom: "0.35rem" }}>켜지자마자 뜨는 것.</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", color: "#3A2E24", marginBottom: "0.4rem" }}>내 마음의 초기화면</div>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(58,46,36,0.65)", lineHeight: 1.75 }}>일이 생겼을 때, 내 마음에 먼저 뜨는 것을 봅니다.<br />01을 했다면 여기로 →</p>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "-0.1rem 0 0.1rem", color: "rgba(247,242,232,0.2)", fontSize: "0.8rem" }}>↓</div>

          {/* 03 */}
          <div className="intro-card-hover" style={{ position: "relative", marginBottom: "0.75rem" }}>
            <div style={{ position: "absolute", left: "-3rem", top: "1rem", width: 28, height: 28, borderRadius: "50%", background: "#4A7A52", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.65rem", color: "#F7F2E8" }}>03</span>
            </div>
            <div onClick={() => setShowSection3(true)} style={{ background: "#C2D4C0", padding: "1.4rem 1.8rem", borderLeft: "4px solid #4A7A52", borderRadius: "0 4px 4px 0", position: "relative", overflow: "hidden", minHeight: 140 }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(30,46,30,0.5)", marginBottom: "0.35rem" }}>생각하기도 전에 이미 움직이고 있는 것들.</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", color: "#1E2E1E", marginBottom: "0.4rem" }}>내 마음의 운영체계</div>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(30,46,30,0.65)", lineHeight: 1.75 }}>내 첫 반응 아래에 작동하고 있는 해석과 판단의 방식을 알아봐요.<br />02를 했다면 여기로 →</p>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "-0.1rem 0 0.1rem", color: "rgba(247,242,232,0.2)", fontSize: "0.8rem" }}>↓</div>

          {/* 04 */}
          <div className="intro-card-hover" style={{ position: "relative", marginBottom: "0.75rem" }}>
            <div style={{ position: "absolute", left: "-3rem", top: "1rem", width: 28, height: 28, borderRadius: "50%", background: "#2E6A5E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.65rem", color: "#F7F2E8" }}>04</span>
            </div>
            <div onClick={() => { setOracleInitialPhase("intro"); setShowOracle(true); }} style={{ background: "#A8C0B8", padding: "1.4rem 1.8rem", borderLeft: "4px solid #2E6A5E", borderRadius: "0 4px 4px 0", position: "relative", overflow: "hidden", minHeight: 140 }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(26,46,40,0.55)", marginBottom: "0.35rem" }}>지워지지 않고 계속 불러오는 것.</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", color: "#1A2E28", marginBottom: "0.4rem" }}>내 마음의 메모리</div>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(26,46,40,0.7)", lineHeight: 1.75 }}>우리가 반응하는 방식은 어느 날 갑자기 생긴 게 아니에요.<br />03을 했다면 여기로 →</p>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "-0.1rem 0 0.1rem", color: "rgba(247,242,232,0.2)", fontSize: "0.8rem" }}>↓</div>

          {/* 05 */}
          <div className="intro-card-hover" style={{ position: "relative", marginBottom: "0.75rem" }}>
            <div style={{ position: "absolute", left: "-3rem", top: "1rem", width: 28, height: 28, borderRadius: "50%", background: "#3A5278", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.65rem", color: "#F7F2E8" }}>05</span>
            </div>
            <div onClick={() => setShowNewWindow(true)} style={{ background: "#B0BED0", padding: "1.4rem 1.8rem", borderLeft: "4px solid #3A5278", borderRadius: "0 4px 4px 0", position: "relative", overflow: "hidden", minHeight: 140 }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(26,34,52,0.5)", marginBottom: "0.35rem" }}>지금까지 보던 창 옆에 작은 창 하나를 더 열어봐요.</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", color: "#1A2234", marginBottom: "0.4rem" }}>내 마음의 새창열기</div>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(26,34,52,0.65)", lineHeight: 1.75 }}>같은 기억도 다른 창으로 보면 조금 다르게 보여요.<br />여기가 마지막 문이에요 →</p>
            </div>
          </div>
        </div>

        <div className="fade8" style={{ padding: "2.5rem 0 0" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.85rem", fontStyle: "italic", color: "#C9A84C", letterSpacing: "0.05em", lineHeight: 1.8 }}>모든 결과는 마지막 "내 마음의 전체화면"에 다시 모입니다.</p>
        </div>
      </div>
    </div>
  );
}
