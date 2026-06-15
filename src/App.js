import { useState, useRef, useEffect } from "react";
import QuickTest from "./QuickTest";
import Oracle from "./Oracle";

const QUESTIONS = [
  {
    id: 1,
    title: "나는 누구인가요",
    prompt: "먼저 자기 자신에 대해 편하게 이야기해 주세요. 어떤 사람인지, 어떤 일을 하는지, 중요하게 생각하는 게 뭔지 생각나는 대로 쓰시면 돼요. 많이 쓰시면 좋고요. 적게 쓰셔도 전혀 상관없어요.",
    placeholder: "예: 나는 기본적으로 ___한 사람인 것 같아요. 왜냐하면...",
    bg: "#e8d5c0", textColor: "#2a1200", accentColor: "#8b4513", borderColor: "#c4956a",
    deco: "circle", skippable: false
  },
  {
    id: 2,
    title: "내 사람들",
    prompt: "나에게 중요한 사람, 편한 사람, 그리고 거슬리는 사람 — 다 써보세요. 왜 그런지 이유도 함께요.",
    placeholder: "예: 나에게 중요한 사람은 ___인데, 왜냐하면...",
    bg: "#c8bfdf", textColor: "#1a0f35", accentColor: "#5c4a8a", borderColor: "#9b89c4",
    deco: "mirror", skippable: false
  },
  {
    id: 3,
    title: "억울했던 순간",
    prompt: "누군가에게 오해받거나 억울했던 적 있나요? 그때 하고 싶었던 말이 있었는데 하지 못했다면 여기서 해보세요.",
    placeholder: "예: 그때 나는 정말 ___하고 싶었는데...",
    bg: "#e8c8b8", textColor: "#2a0e00", accentColor: "#a0522d", borderColor: "#c47a5a",
    deco: "shards", skippable: true
  },
  {
    id: 4,
    title: "자꾸 떠오르는 것",
    prompt: "오래 전 일인데도 자꾸 머릿속에 맴도는 사건, 장면이 있으신가요? 그게 왜 떠오르는지 생각해 보신 적 있으세요? 한 번도 생각해 보신 적 없으시다면 지금 해보시겠어요. 물론 패스하셔도 전혀 상관없어요.",
    placeholder: "예: 몇 년이 지났는데도 자꾸 그 때가 ...",
    bg: "#e8d48a", textColor: "#1e1400", accentColor: "#8b6914", borderColor: "#c9a84c",
    deco: "spiral", skippable: true
  },
  {
    id: 5,
    title: "반복되는 그 말, 그 상황",
    prompt: "살면서 '또 이러네' 싶었던 순간이 있으셨나요? 비슷한 상황, 비슷한 감정이 반복된다는 느낌이요. 반복적으로 꾸는 꿈은요? 어떤 상황이었는지, 그때 어떤 마음이었는지 써주세요.",
    placeholder: "예: 이상하게 나는 항상 ___한 상황에서...",
    bg: "#b8d4b0", textColor: "#0d200e", accentColor: "#2d6b32", borderColor: "#7a9e6e",
    deco: "grid", skippable: false
  },
  {
    id: 6,
    title: "부러웠던 순간",
    prompt: "누군가가, 아니면 어떤 순간이 부러우셨던 적이 있으신가요? 어떤 부분이 부러우셨는지, 기억나시는 대로 써주세요.",
    placeholder: "예: ___ 이 부러웠는데, 돌아보면 내가 원하는 건...",
    bg: "#f0b8c4", textColor: "#2a0a10", accentColor: "#9b2335", borderColor: "#c47a8a",
    deco: "star", skippable: false
  },
  {
    id: 7,
    title: "빛났던 순간",
    prompt: "스스로가 뿌듯하거나 자랑스러웠던 순간이 있으신가요? 크고 대단한 일이 아니어도 좋아요. 그때 어떤 기분이었는지, 기억나시는 대로 써주세요.",
    placeholder: "예: 별것 아닌 것 같지만, 그때 나는 정말...",
    bg: "#a8c8e0", textColor: "#05182a", accentColor: "#1a4d6e", borderColor: "#6a95b8",
    deco: "rays", skippable: false
  }
];

const QUESTIONS2 = [
  {
    id: 1,
    title: "친구의 결정",
    prompt: "친한 사람이 당신이 보기엔 분명 좋지 않은 선택을 하려 해요. 이직, 이별, 큰 돈을 쓰는 일 같은 것들이요. 그 순간 당신 안에서 무슨 일이 일어나나요? 말하고 싶어지나요, 아니면 조용해지나요?",
    placeholder: "떠오르는 대로 써주세요...",
    bg: "#1a2535", textColor: "#c8d8e8", accentColor: "#4a8ab4", borderColor: "#2a4a6a",
    deco: "circle", skippable: false
  },
  {
    id: 2,
    title: "반박 앞에서",
    prompt: "당신이 확신하던 생각을 누군가 조목조목 반박했어요. 발표 후 피드백이든, 대화 중 의견 충돌이든. 그 자리에서 몸과 마음에 어떤 일이 일어났나요? 그리고 혼자가 됐을 때, 그 반박을 어떻게 대했나요?",
    placeholder: "생각, 감정, 몸의 반응, 이후 행동까지...",
    bg: "#1e1e2e", textColor: "#c8c8e8", accentColor: "#6a5acd", borderColor: "#3a3a6a",
    deco: "shards", skippable: false
  },
  {
    id: 3,
    title: "막힌 문제",
    prompt: "며칠째 붙잡고 있는데도 풀리지 않는 문제가 있어요. 일이든, 관계든, 결정이든. 그럴 때 당신은 어디로 가나요? 뭔가 알 것 같을 때까지 계속 파고드나요, 잠시 멈추나요, 누군가 만날 사람을 찾나요?",
    placeholder: "그때 당신의 상태도 함께 적어주세요...",
    bg: "#1a2520", textColor: "#c8e0c8", accentColor: "#3a8a5a", borderColor: "#2a5a3a",
    deco: "grid", skippable: false
  },
  {
    id: 4,
    title: "설명할 수 없는 신호",
    prompt: "이유는 모르겠는데 몸이 먼저 아는 순간들이 있어요. 특정 사람을 보면 어깨에 힘이 들어간다거나, 어떤 장소에 가면 이유 없이 피곤해진다거나, 전화가 오기 전에 뭔가 이상한 느낌이 든다거나. 당신은 그런 신호를 어떻게 대해왔나요?",
    placeholder: "떠오르는 방식대로 적어주세요...",
    bg: "#251a20", textColor: "#e0c8d0", accentColor: "#8a3a5a", borderColor: "#5a2a3a",
    deco: "spiral", skippable: true
  },
  {
    id: 5,
    title: "예상 밖의 결과",
    prompt: "열심히 준비했는데 결과가 완전히 달랐어요. 시험이든, 프로젝트든, 관계든. 그 순간 제일 먼저 떠오른 건 뭐였나요? 나 자신인가요, 상황인가요, 아니면 아무것도 안 떠올랐나요?",
    placeholder: "예: 나 자신, 운이나 타이밍, 특정한 누군가...",
    bg: "#201a25", textColor: "#d8c8e8", accentColor: "#7a4a9a", borderColor: "#4a2a6a",
    deco: "star", skippable: false
  },
  {
    id: 6,
    title: "복잡한 걸 이해하는 방식",
    prompt: "복잡한 걸 받아들여야 할 때 당신만의 방식이 있어요. 혼자 오래 생각하거나, 글로 써보거나, 누군가와 이야기하거나, 그냥 자고 일어나거나. 어떻게 하나요? 그리고 그 방법이 안 통할 때는요?",
    placeholder: "당신만의 방식을 적어주세요...",
    bg: "#1a2030", textColor: "#c8d0e8", accentColor: "#3a5a9a", borderColor: "#2a3a6a",
    deco: "mirror", skippable: false
  },
  {
    id: 7,
    title: "지금 필요한 것",
    prompt: "거창한 목표나 미래 얘기가 아니라요. 지금 이 순간, 오늘, 당신에게 필요한게 있다면 뭘까요? 떠오르는 대로 써주세요.",
    placeholder: "딱 하나만 꼽지 않아도 괜찮아요...",
    bg: "#202020", textColor: "#e0e0e0", accentColor: "#8a8a8a", borderColor: "#4a4a4a",
    deco: "rays", skippable: false
  }
];

const MIRROR_PRINCIPLES = `
당신의 역할은 사용자를 진단하거나 규정하는 분석가가 아닙니다.
당신의 역할은 사용자가 자신의 반복 패턴과 선택 구조를 스스로 발견하도록 돕는 거울입니다.

반드시 지켜야 할 원칙:

1. 사람을 정의하지 말고 반복되는 움직임을 관찰하라.
금지: "당신은 이런 사람입니다" "당신의 본질은 이것입니다"
권장: "여러 답변에서 이런 표현이 반복됩니다" "이런 상황에서 비슷한 선택이 나타납니다"

2. 결론보다 흔적을 먼저 보여라.
분석보다 먼저 사용자의 실제 표현, 반복된 단어, 반복된 장면을 보여주어라.
사용자의 표현을 직접 인용하라.

3. 패턴과 해석을 반드시 이 순서로 구분하라.
① 반복적으로 등장한 표현
② 반복적으로 등장한 상황
③ 반복적으로 나타난 선택 방식
④ AI가 제안하는 가능성 있는 해석
⑤ 사용자가 탐색할 질문
패턴과 해석을 섞지 마라.

4. 해석은 가설로만 제시하라.
금지: "이것이 원인입니다" "이것이 당신의 문제입니다"
권장: "이런 가능성이 있습니다" "이런 전제가 작동할 수 있습니다"

5. 장점과 비용을 함께 보여라.
어떤 패턴도 문제로 규정하지 마라.
예: "설명을 중요하게 여기는 경향은 깊은 이해를 돕지만 행동을 늦출 수도 있습니다"

6. 사람보다 구조를 설명하라.
금지: "당신은 불안한 사람입니다"
권장: "불확실한 상황에서 안전성을 먼저 확인하려는 움직임이 반복됩니다"

7. 사용자의 표현을 우선하라.
AI의 해석보다 사용자가 실제로 한 말을 더 중요하게 다뤄라.

8. 놀라운 통찰을 만들려 하지 마라.
극적인 심리 분석, 존재를 규정하는 문장을 만들지 마라.
목표는 감탄이 아니라 자기관찰이다.

9. 여백을 남겨라.
모든 것을 설명하려 하지 마라.
사용자가 스스로 의미를 만들 수 있도록 일부 연결은 열어두어라.

10. 볼드(**텍스트**) 절대 사용 금지.
11. 소제목(###) 절대 사용 금지.
12. 전문 용어 사용 금지. (동결, 투쟁-도피, 트라우마, 방어기제, 메타인지 등)
13. 존댓말로 쓸 것. 따뜻하되 거리를 유지할 것.
14. 각 섹션 최대 4-5문장. 짧고 깊게.
15. 전체가 하나의 흐름처럼 읽혀야 한다.
`;

const systemPrompt = `${MIRROR_PRINCIPLES}

사용자가 제공한 7가지 답변을 분석합니다.

각 질문의 분석 의도:
1. 나는 누구인가요 → 자기개념과 정체성 언어
2. 내 사람들 → 관계 스키마와 대상 분류 방식
3. 억울했던 순간 → 귀인 방식, 억압된 감정
4. 자꾸 떠오르는 것 → 미해결 감정, 무의식적 집착
5. 반복되는 그 말, 그 상황 → 행동 패턴과 관계 반복
6. 부러웠던 순간 → 결핍과 욕구
7. 빛났던 순간 → 자기효능감과 핵심 가치관

출력 구조 (반드시 이 순서와 헤더를 정확히 사용할 것):

## 여기까지 오셨네요
"여기까지 답해주셨네요. 쉽지 않은 질문들이었을 텐데요."
2-3문장으로 전체 인상을 따뜻하게 열 것.

## 당신이 자주 느끼는 감정
3가지 핵심 감정 키워드. 각각 한 단락. 짧은 인용과 함께 연결고리 설명.
단정 금지.

## 사람 사이에서 반복되는 것
관찰 → 가능성 → 확인질문 구조로 2가지만.
각각 3-4문장. 짧고 깊게.

## 말하지 못한 말
관찰 → 가능성 → 확인질문 구조로 2가지만.
각각 3-4문장. 짧고 깊게.

## 감정의 결
전체 답변의 감정 온도와 문체. 관찰만. 단정 금지.
3-4문장.

## 이제 질문은 당신에게
분석 요약 아님. 스스로 궁금해질 관찰 유도 질문 1-3개.
정답을 유도하지 말 것.

한국어로 작성하세요.`;

const systemPrompt2 = `${MIRROR_PRINCIPLES}

사용자가 제공한 7가지 답변을 분석하여 사고 방식과 패턴을 파악합니다.

각 질문의 분석 의도:
1. 친구의 결정 → 갈등 처리 방식, 관계에서의 경계
2. 반박 앞에서 → 인지적 유연성, 자아 방어 방식
3. 막힌 문제 → 문제 해결 전략, 에너지 원천
4. 설명할 수 없는 신호 → 직관과 논리의 균형, 신체 인식
5. 예상 밖의 결과 → 귀인 방식, 회복 탄력성
6. 복잡한 걸 이해하는 방식 → 인지 스타일, 학습 패턴
7. 지금 진짜 필요한 것 → 현재 상태, 핵심 욕구

출력 구조 (반드시 이 순서와 헤더를 정확히 사용할 것):

## 두 번째 질문들까지
"두 번째 질문들까지 답해주셨네요. 이번엔 조금 다른 층위의 이야기였을 거예요."
2-3문장으로 전체 인상을 열 것.

## 생각하는 방식
이 사람이 정보를 처리하고 사고를 조직하는 방식.
관찰 → 가능성 → 확인질문 구조로. 4-5문장.

## 갈등을 해결하는 방식
1번과 2번을 교차 분석.
관찰 → 가능성 → 확인질문 구조로. 4-5문장.

## 몸이 먼저 아는 것
4번 답변 중심. 몸의 신호와 인지의 연결.
3-4문장. 단정 금지.

## 지금 당신에게 필요한 것
7번 답변과 전체 패턴을 연결.
단정 없이 가능성으로. 3-4문장.

## 이제 질문은 당신에게
분석 요약 아님. 스스로 궁금해질 관찰 유도 질문 1-3개.
정답을 유도하지 말 것.

한국어로 작성하세요.`;

const Decoration = ({ type, color }) => {
  const s = { position: "absolute", pointerEvents: "none" };
  if (type === "circle") return (
    <svg style={{...s, top: "-60px", right: "-60px", opacity: 0.18}} width="280" height="280" viewBox="0 0 280 280">
      <circle cx="140" cy="140" r="130" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="140" cy="140" r="90" fill="none" stroke={color} strokeWidth="1"/>
      <circle cx="140" cy="140" r="50" fill={color} opacity="0.15"/>
    </svg>
  );
  if (type === "mirror") return (
    <svg style={{...s, top: "20px", right: "-40px", opacity: 0.2}} width="200" height="300" viewBox="0 0 200 300">
      <ellipse cx="100" cy="120" rx="70" ry="100" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="85" y="220" width="30" height="60" fill="none" stroke={color} strokeWidth="2"/>
      <line x1="60" y1="280" x2="140" y2="280" stroke={color} strokeWidth="2"/>
    </svg>
  );
  if (type === "spiral") return (
    <svg style={{...s, bottom: "-40px", right: "-40px", opacity: 0.2}} width="260" height="260" viewBox="0 0 260 260">
      <path d="M130,130 m-5,0 a5,5 0 1,1 10,0 a15,15 0 1,1 -30,0 a30,30 0 1,1 60,0 a50,50 0 1,1 -100,0 a75,75 0 1,1 150,0" fill="none" stroke={color} strokeWidth="2"/>
    </svg>
  );
  if (type === "grid") return (
    <svg style={{...s, top: "0", right: "-20px", opacity: 0.15}} width="220" height="220" viewBox="0 0 220 220">
      {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => (
        <rect key={`${r}-${c}`} x={c*44+2} y={r*44+2} width="40" height="40" fill="none" stroke={color} strokeWidth="1.5"/>
      )))}
    </svg>
  );
  if (type === "star") return (
    <svg style={{...s, top: "-30px", right: "-30px", opacity: 0.2}} width="240" height="240" viewBox="0 0 240 240">
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i * Math.PI * 2) / 8;
        const x1 = 120 + Math.cos(a) * 20; const y1 = 120 + Math.sin(a) * 20;
        const x2 = 120 + Math.cos(a) * 100; const y2 = 120 + Math.sin(a) * 100;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5"/>;
      })}
      <circle cx="120" cy="120" r="18" fill={color} opacity="0.3"/>
      <circle cx="120" cy="120" r="8" fill={color} opacity="0.5"/>
    </svg>
  );
  if (type === "shards") return (
    <svg style={{...s, top: "-20px", right: "-20px", opacity: 0.18}} width="240" height="240" viewBox="0 0 240 240">
      <polygon points="120,20 180,80 150,140" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="60,60 140,50 100,130" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="100,100 200,90 160,180" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="40,120 120,110 80,200" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="140,140 220,130 190,210" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
  if (type === "rays") return (
    <svg style={{...s, top: "-30px", right: "-30px", opacity: 0.18}} width="260" height="260" viewBox="0 0 260 260">
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
        const a = (i * Math.PI * 2) / 12;
        const x1 = 130 + Math.cos(a) * 30; const y1 = 130 + Math.sin(a) * 30;
        const x2 = 130 + Math.cos(a) * 110; const y2 = 130 + Math.sin(a) * 110;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1"/>;
      })}
      <circle cx="130" cy="130" r="28" fill={color} opacity="0.2"/>
      <circle cx="130" cy="130" r="14" fill={color} opacity="0.35"/>
    </svg>
  );
  return null;
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

export default function FeedbackWidget() {
  const [selected, setSelected] = React.useState(null);
  return (
    <div style={{marginTop:"2.5rem",paddingTop:"2rem",borderTop:"1px solid rgba(42,18,0,0.08)",textAlign:"center"}}>
      <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(42,18,0,0.45)",marginBottom:"1rem"}}>이 분석이 당신에게 맞나요?</p>
      {!selected && (
        <div style={{display:"flex",gap:"0.75rem",justifyContent:"center"}}>
          <button onClick={() => setSelected("yes")} style={{background:"none",border:"1px solid rgba(42,18,0,0.15)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(42,18,0,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>👍 맞아요</button>
          <button onClick={() => setSelected("no")} style={{background:"none",border:"1px solid rgba(42,18,0,0.15)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(42,18,0,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>👎 아닌 것 같아요</button>
          <button onClick={() => setSelected("unsure")} style={{background:"none",border:"1px solid rgba(42,18,0,0.15)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(42,18,0,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>🤔 잘 모르겠어요</button>
        </div>
      )}
      {selected === "yes" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(42,18,0,0.4)"}}>감사해요.</p>}
      {selected === "unsure" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(42,18,0,0.4)"}}>그 모르겠다는 느낌도 중요한 정보예요.</p>}
      {selected === "no" && (
        <div>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.85rem",fontWeight:300,color:"rgba(42,18,0,0.55)",lineHeight:1.9,marginBottom:"0.75rem"}}>맞지 않는 부분이 있으신가요?<br/>당신이 느낀 것을 말씀해주세요.</p>
          <a href="https://forms.gle/1MK9PRZmTBpFsEPN8" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(42,18,0,0.5)",textDecoration:"underline",textUnderlineOffset:"3px"}}>피드백 남기기 →</a>
        </div>
      )}
    </div>
  );
}


  const [stage, setStage] = useState(1);
  const [step, setStep] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analysis2, setAnalysis2] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  const questions = stage === 1 ? QUESTIONS : QUESTIONS2;

  useEffect(() => {
    const savedResult2 = localStorage.getItem("mindmirror_result2");
    const savedResult1 = localStorage.getItem("mindmirror_result1");
    if (savedResult2 && window.confirm("이전 2단계 분석 결과가 있어요. 다시 볼까요?")) {
      setAnalysis2(savedResult2);
      if (savedResult1) setAnalysis(savedResult1);
      setStage(2);
      setStep("result2");
      return;
    } else if (savedResult1 && !savedResult2 && window.confirm("이전 1단계 분석 결과가 있어요. 다시 볼까요?")) {
      setAnalysis(savedResult1);
      setStep("result");
      return;
    }
    const saved = localStorage.getItem("mindmirror_answers");
    const savedStage = localStorage.getItem("mindmirror_stage");
    const savedQ = localStorage.getItem("mindmirror_currentQ");
    if (saved) {
      const parsedAnswers = JSON.parse(saved);
      const hasAnswers = Object.keys(parsedAnswers).length > 0;
      if (hasAnswers && window.confirm("이전에 작성하던 내용이 있어요. 이어서 하시겠어요?")) {
        setAnswers(parsedAnswers);
        setStage(savedStage ? parseInt(savedStage) : 1);
        setCurrentQ(savedQ ? parseInt(savedQ) : 0);
        setStep("questions");
      } else {
        localStorage.removeItem("mindmirror_answers");
        localStorage.removeItem("mindmirror_stage");
        localStorage.removeItem("mindmirror_currentQ");
      }
    }
  }, []);

  useEffect(() => {
    if (step === "questions") {
      localStorage.setItem("mindmirror_answers", JSON.stringify(answers));
      localStorage.setItem("mindmirror_stage", stage.toString());
      localStorage.setItem("mindmirror_currentQ", currentQ.toString());
    }
    if ((step === "result" && analysis) || (step === "result2" && analysis2)) {
      localStorage.removeItem("mindmirror_answers");
      localStorage.removeItem("mindmirror_stage");
      localStorage.removeItem("mindmirror_currentQ");
    }
  }, [answers, step, currentQ, stage]);

  useEffect(() => {
    if (step === "questions" && textareaRef.current) textareaRef.current.focus();
  }, [step, currentQ, stage]);

  useEffect(() => {
    setCharCount(currentAnswer.length);
  }, [currentAnswer]);

  const handleNext = () => {
    const newAnswers = { ...answers, [currentQ]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("analyzing");
      if (stage === 1) analyze(newAnswers);
      else analyze2(newAnswers);
    }
  };

  const handleSkip = () => {
    const newAnswers = { ...answers, [currentQ]: "" };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("analyzing");
      if (stage === 1) analyze(newAnswers);
      else analyze2(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      const prevAnswer = answers[currentQ - 1] || "";
      setCurrentAnswer(prevAnswer);
      setCurrentQ(currentQ - 1);
    }
  };

  const analyze = async (allAnswers) => {
    const userContent = QUESTIONS.map((q, i) =>
      `[${q.title}]\n${allAnswers[i] || "(미입력 — 침묵 데이터로 처리)"}`
    ).join("\n\n");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }]
        })
      });
      const data = await response.json();
      const text = data.content ? data.content.map(b => typeof b.text === 'string' ? b.text : "").join("") : (data.error ? JSON.stringify(data.error) : "분석 실패");
      const result = text || "분석 실패";
      setAnalysis(result);
      localStorage.setItem("mindmirror_result1", result);
      setStep("result");
    } catch (e) {
      setAnalysis(JSON.stringify(e));
      setStep("result");
    }
  };

  const analyze2 = async (allAnswers) => {
    const userContent = QUESTIONS2.map((q, i) =>
      `[${q.title}]\n${allAnswers[i] || "(미입력 — 침묵 데이터로 처리)"}`
    ).join("\n\n");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 4000,
          system: systemPrompt2,
          messages: [{ role: "user", content: userContent }]
        })
      });
      const data = await response.json();
      const text = data.content ? data.content.map(b => typeof b.text === 'string' ? b.text : "").join("") : (data.error ? JSON.stringify(data.error) : "분석 실패");
      const result2 = text || "분석 실패";
      setAnalysis2(result2);
      localStorage.setItem("mindmirror_result2", result2);
      setStep("result2");
    } catch (e) {
      setAnalysis2(JSON.stringify(e));
      setStep("result2");
    }
  };

  const startStage2 = () => {
    setStage(2);
    setStep("intro2");
    setCurrentQ(0);
    setAnswers({});
    setCurrentAnswer("");
    setCharCount(0);
  };

  const copyResult = () => {
    const text = step === "result" ? analysis : analysis2;
    navigator.clipboard.writeText(text).then(() => { alert("복사되었습니다."); });
  };

  const downloadResult = () => {
    const text = step === "result" ? analysis : analysis2;
    const title = step === "result" ? "마음거울_1단계_분석결과" : "마음거울_2단계_분석결과";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restart = () => {
    setStage(1); setStep("intro"); setCurrentQ(0); setAnswers({});
    setCurrentAnswer(""); setAnalysis(""); setAnalysis2(""); setCharCount(0);
    localStorage.removeItem("mindmirror_result1");
    localStorage.removeItem("mindmirror_result2");
  };

  // ── QuickTest / Oracle ──────────────────────────────────────────
  if (showQuickTest) {
    return <QuickTest onBack={() => setShowQuickTest(false)} />;
  }
  if (showOracle) {
    return <Oracle onBack={() => setShowOracle(false)} />;
  }

  // ── 메인 랜딩 ───────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div style={{background:"#2d5a2d",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1.25rem"}}>
        <style>{FONTS + `
          .intro-card { transition: all 0.3s; cursor: pointer; background: rgba(255,255,255,0.92); border: 1px solid rgba(255,255,255,0.15); position: relative; overflow: hidden; }
          .intro-card:hover { background: rgba(255,255,255,0.98); transform: translateY(-2px); box-shadow: 0 6px 28px rgba(0,0,0,0.2); }
        `}</style>
        <div style={{width:"100%",maxWidth:680}}>

          {/* 헤더 */}
          <div style={{textAlign:"center",marginBottom:"3rem"}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:400,fontStyle:"italic",color:"#f0ede8",lineHeight:1.3,marginBottom:"1.25rem"}}>나를 읽는 세 가지 렌즈</h1>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.88rem",fontWeight:300,color:"rgba(240,237,232,0.6)",lineHeight:2,maxWidth:420,margin:"0 auto"}}>
              잘하고 싶은데 방법을 모르겠다면.<br/>
              나를 설명할 말이 없다면.<br/>
              왜 항상 같은 상황에서 막히는지 모르겠다면.<br/><br/>
              세 가지 렌즈로 들여다봐요.
            </p>
          </div>

          {/* 카드 목록 */}
          <div style={{display:"flex",flexDirection:"column",gap:"1.25rem",marginBottom:"3.5rem"}}>

            {/* 01 나 사용 설명서 */}
            <div className="intro-card" onClick={() => setShowQuickTest(true)}>
              {/* 나침반 SVG */}
              <svg width="200" height="200" viewBox="0 0 200 200" style={{position:"absolute",right:"-30px",top:"50%",transform:"translateY(-50%)",opacity:0.08,pointerEvents:"none"}}>
                <circle cx="100" cy="100" r="88" fill="none" stroke="#2a1200" strokeWidth="1.5"/>
                <circle cx="100" cy="100" r="75" fill="none" stroke="#2a1200" strokeWidth="0.7" strokeDasharray="4,6"/>
                <circle cx="100" cy="100" r="55" fill="none" stroke="#2a1200" strokeWidth="1"/>
                <line x1="12" y1="100" x2="188" y2="100" stroke="#2a1200" strokeWidth="0.8"/>
                <line x1="100" y1="12" x2="100" y2="188" stroke="#2a1200" strokeWidth="0.8"/>
                <line x1="38" y1="38" x2="162" y2="162" stroke="#2a1200" strokeWidth="0.6"/>
                <line x1="162" y1="38" x2="38" y2="162" stroke="#2a1200" strokeWidth="0.6"/>
                <line x1="100" y1="12" x2="100" y2="22" stroke="#2a1200" strokeWidth="2.5"/>
                <line x1="100" y1="178" x2="100" y2="188" stroke="#2a1200" strokeWidth="1.5"/>
                <line x1="12" y1="100" x2="22" y2="100" stroke="#2a1200" strokeWidth="1.5"/>
                <line x1="178" y1="100" x2="188" y2="100" stroke="#2a1200" strokeWidth="1.5"/>
                <polygon points="100,25 95,100 105,100" fill="#2a1200"/>
                <polygon points="100,175 95,100 105,100" fill="none" stroke="#2a1200" strokeWidth="1.2"/>
                <circle cx="100" cy="100" r="7" fill="none" stroke="#2a1200" strokeWidth="1.5"/>
                <text x="100" y="10" textAnchor="middle" fontFamily="serif" fontSize="12" fontStyle="italic" fill="#2a1200">N</text>
                <circle cx="100" cy="100" r="3.5" fill="#2a1200"/>
              </svg>
              <div style={{padding:"1.5rem 1.75rem"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:"0.75rem",marginBottom:"0.75rem"}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontStyle:"italic",color:"rgba(42,18,0,0.1)",lineHeight:1}}>01</span>
                  <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(42,18,0,0.35)"}}>유형 탐색</span>
                </div>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",fontStyle:"italic",color:"rgba(42,18,0,0.4)",marginBottom:"0.4rem"}}>나는 어떻게 움직이는 사람일까</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.35rem",fontStyle:"italic",color:"#2a1200",marginBottom:"0.75rem"}}>나 사용 설명서</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.83rem",fontWeight:300,color:"rgba(42,18,0,0.55)",lineHeight:1.85,margin:0}}>잘하고 싶은데 내 방식이 뭔지 모르겠다면. 11가지 상황 질문에 답하면 당신이 정보를 받아들이고, 결정하고, 사람과 부딪히는 방식을 찾아드려요. 강점도, 막히는 지점도요.</p>
              </div>
            </div>

            {/* 02 마음거울 */}
            <div className="intro-card" onClick={() => setStep("mindmirror-intro")}>
              {/* 나선 SVG */}
              <svg width="180" height="180" viewBox="0 0 180 180" style={{position:"absolute",right:"-20px",top:"50%",transform:"translateY(-50%)",opacity:0.08,pointerEvents:"none"}}>
                <circle cx="90" cy="90" r="75" fill="none" stroke="#2a1200" strokeWidth="0.7"/>
                <circle cx="90" cy="90" r="58" fill="none" stroke="#2a1200" strokeWidth="0.7"/>
                <circle cx="90" cy="90" r="42" fill="none" stroke="#2a1200" strokeWidth="0.7"/>
                <circle cx="90" cy="90" r="26" fill="none" stroke="#2a1200" strokeWidth="0.7"/>
                <circle cx="90" cy="90" r="10" fill="none" stroke="#2a1200" strokeWidth="0.7"/>
                <path d="M90,90 Q90,80 100,80 Q110,80 110,90 Q110,105 90,107 Q68,107 66,88 Q64,68 90,66 Q116,66 118,90 Q120,118 90,121 Q57,121 54,88 Q51,56 90,53 Q128,53 131,90 Q134,130 90,134 Q44,134 40,88" fill="none" stroke="#2a1200" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="90" cy="90" r="3" fill="#2a1200"/>
              </svg>
              <div style={{padding:"1.5rem 1.75rem"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:"0.75rem",marginBottom:"0.75rem"}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontStyle:"italic",color:"rgba(42,18,0,0.1)",lineHeight:1}}>02</span>
                  <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(42,18,0,0.35)"}}>패턴 탐색 · 1단계 + 2단계</span>
                </div>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",fontStyle:"italic",color:"rgba(42,18,0,0.4)",marginBottom:"0.4rem"}}>나는 왜 같은 상황을 반복하는가</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.35rem",fontStyle:"italic",color:"#2a1200",marginBottom:"0.75rem"}}>마음거울</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.83rem",fontWeight:300,color:"rgba(42,18,0,0.55)",lineHeight:1.85,margin:0}}>감정과 관계 패턴부터 사고 구조까지, 두 단계로 깊게 들어가요.</p>
              </div>
            </div>

            {/* 03 오라클 */}
            <div className="intro-card" onClick={() => setShowOracle(true)}>
              {/* 꽃병 SVG */}
              <svg width="160" height="220" viewBox="0 0 160 220" style={{position:"absolute",right:"-20px",top:"50%",transform:"translateY(-50%)",opacity:0.08,pointerEvents:"none"}}>
                <ellipse cx="80" cy="22" rx="20" ry="5" fill="none" stroke="#2a1200" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M60,22 Q56,38 52,52" fill="none" stroke="#2a1200" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M100,22 Q104,38 108,52" fill="none" stroke="#2a1200" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M52,52 Q30,70 28,110 Q26,148 32,170 Q38,188 50,196" fill="none" stroke="#2a1200" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M108,52 Q130,70 132,110 Q134,148 128,170 Q122,188 110,196" fill="none" stroke="#2a1200" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M54,48 Q80,52 106,48" fill="none" stroke="#2a1200" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M52,56 Q80,60 108,56" fill="none" stroke="#2a1200" strokeWidth="1" strokeLinecap="round"/>
                <path d="M30,118 Q80,124 130,118" fill="none" stroke="#2a1200" strokeWidth="1" strokeLinecap="round"/>
                <path d="M29,130 Q80,136 131,130" fill="none" stroke="#2a1200" strokeWidth="1" strokeLinecap="round"/>
                <path d="M50,196 Q80,204 110,196" fill="none" stroke="#2a1200" strokeWidth="1.8" strokeLinecap="round"/>
                <ellipse cx="80" cy="200" rx="32" ry="6" fill="none" stroke="#2a1200" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <div style={{padding:"1.5rem 1.75rem"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:"0.75rem",marginBottom:"0.75rem"}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontStyle:"italic",color:"rgba(42,18,0,0.1)",lineHeight:1}}>03</span>
                  <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(42,18,0,0.35)"}}>질문 탐색</span>
                </div>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",fontStyle:"italic",color:"rgba(42,18,0,0.4)",marginBottom:"0.4rem"}}>실제로 원하는 것, 스스로에게 던지는 진짜 질문</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.35rem",fontStyle:"italic",color:"#2a1200",marginBottom:"0.75rem"}}>오라클</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.83rem",fontWeight:300,color:"rgba(42,18,0,0.55)",lineHeight:1.85,margin:0}}>답을 주지 않아요. 당신이 이미 알고 있었지만 아직 말로 꺼내지 못한 것들을 비춰드립니다.</p>
              </div>
            </div>

          </div>

          {/* 하단 */}
          <div style={{textAlign:"center",padding:"1.5rem 0"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.9rem",fontStyle:"italic",color:"rgba(240,237,232,0.4)",letterSpacing:"0.08em"}}>γνῶθι σεαυτόν · 너 자신을 알라</div>
          </div>

        </div>
      </div>
    );
  }

  // ── 마음거울 인트로 ─────────────────────────────────────────────
  if (step === "mindmirror-intro") {
    return (
      <div style={{minHeight:"100vh",background:"#fef6ed",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",position:"relative",overflow:"hidden"}}>
        <style>{FONTS + `
          @keyframes ripple {
            0% { transform: scale(0.3); opacity: 0.6; }
            100% { transform: scale(1); opacity: 0; }
          }
          .ripple-a { animation: ripple 3.5s ease-out infinite; transform-origin: center; }
          .ripple-b { animation: ripple 3.5s ease-out 0.7s infinite; transform-origin: center; }
          .ripple-c { animation: ripple 3.5s ease-out 1.4s infinite; transform-origin: center; }
          .ripple-d { animation: ripple 3.5s ease-out 2.1s infinite; transform-origin: center; }
          .ripple-e { animation: ripple 3.5s ease-out 2.8s infinite; transform-origin: center; }
        `}</style>

        {/* 물결 애니메이션 — 오른쪽 하단 */}
        <svg width="320" height="320" viewBox="0 0 200 200" style={{position:"absolute",right:"-60px",bottom:"-60px",pointerEvents:"none"}}>
          <ellipse className="ripple-a" cx="100" cy="100" rx="8" ry="4" fill="none" stroke="#c4956a" strokeWidth="1.2"/>
          <ellipse className="ripple-b" cx="100" cy="100" rx="25" ry="12" fill="none" stroke="#c4956a" strokeWidth="1"/>
          <ellipse className="ripple-c" cx="100" cy="100" rx="45" ry="22" fill="none" stroke="#c4956a" strokeWidth="0.9"/>
          <ellipse className="ripple-d" cx="100" cy="100" rx="68" ry="33" fill="none" stroke="#c4956a" strokeWidth="0.7"/>
          <ellipse className="ripple-e" cx="100" cy="100" rx="90" ry="44" fill="none" stroke="#c4956a" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="2.5" fill="#c4956a" opacity="0.4"/>
        </svg>
        <div style={{width:"100%",maxWidth:640,position:"relative",zIndex:1}}>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:".7rem",letterSpacing:".25em",textTransform:"uppercase",color:"#c4956a",marginBottom:"1.5rem"}}>마음거울 · 1단계</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.4rem,6vw,3.6rem)",fontWeight:400,lineHeight:1.15,color:"#2a1200",marginBottom:"2rem"}}>당신은<br/>어떻게<br/>생각하나요</h1>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"1rem",fontWeight:300,color:"#6b4c2a",lineHeight:1.9,marginBottom:"1.25rem"}}>살면서 왜 같은 상황이 반복되는지,<br/>왜 특정 순간에 늘 비슷한 감정이 오는지<br/>궁금했던 적 있나요.</p>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:".93rem",fontWeight:300,fontStyle:"italic",color:"#9a7856",lineHeight:1.9,marginBottom:"1.5rem"}}>일곱 가지 질문에 솔직하게 답해주시면,<br/>당신이 쓴 말들을 읽고 패턴을 돌려드려요.<br/>거울 하나 건네드리겠습니다.</p>
          <div style={{background:"rgba(196,149,106,0.1)",borderLeft:"3px solid #c4956a",padding:"1.1rem 1.25rem",marginBottom:"2rem"}}>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:".68rem",letterSpacing:".2em",textTransform:"uppercase",color:"#c4956a",marginBottom:".6rem"}}>시작 전에</div>
            {["틀린 답은 없어요. 생각나는 대로, 편한 만큼만 쓰시면 돼요.","많이 쓸수록 더 풍부한 분석을 받을 수 있어요.","질문마다 자유롭게 돌아가서 수정할 수 있어요.","패스하고 싶은 질문은 건너뛰셔도 괜찮아요.","입력하신 내용은 저장되지 않아요."].map((t,i) => (
              <div key={i} style={{fontFamily:"'Source Serif 4',serif",fontSize:".82rem",fontWeight:300,color:"#6b4c2a",lineHeight:1.85,display:"flex",alignItems:"flex-start",gap:".5rem",marginBottom:".2rem"}}>
                <span style={{opacity:.5}}>—</span>{t}
              </div>
            ))}
          </div>
          <div style={{width:"48px",height:"1px",background:"#c4956a",margin:"2rem 0"}}/>
          <div style={{marginBottom:"2.5rem"}}>
            {QUESTIONS.map((q,i) => (
              <div key={q.id} style={{display:"flex",alignItems:"center",gap:"1rem",padding:".4rem 0",borderBottom:"1px solid rgba(196,149,106,0.15)"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:".7rem",color:"#c4956a",opacity:.6,minWidth:"1.5rem"}}>{i+1}</span>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:".85rem",fontWeight:300,color:"#6b4c2a"}}>{q.title}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button
              onClick={() => setStep("questions")}
              style={{background:"#2a1200",border:"none",color:"#fdf0e0",fontFamily:"'Source Serif 4',serif",fontSize:".82rem",letterSpacing:".18em",textTransform:"uppercase",padding:"1.1rem 2.8rem",cursor:"pointer"}}
            >마음거울 시작하기</button>
            <button
              onClick={() => setStep("intro")}
              style={{background:"transparent",border:"1px solid rgba(196,149,106,0.5)",color:"#9a7856",fontFamily:"'Source Serif 4',serif",fontSize:".78rem",letterSpacing:".15em",textTransform:"uppercase",padding:"1.1rem 1.8rem",cursor:"pointer"}}
            >← 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 나머지 화면들 ───────────────────────────────────────────────
  const progress = (currentQ / questions.length) * 100;
  const q = questions[currentQ];
  const canProceed = currentAnswer.trim().length > 0;

  const getBg = () => {
    if (step === "intro2") return "#0f1520";
    if (step === "questions") return q.bg;
    if (step === "analyzing") return stage === 1 ? "#f5ede0" : "#0f1520";
    if (step === "result") return "#faf5ef";
    if (step === "result2") return "#0f1520";
    return "#fef6ed";
  };

  return (
    <div style={{
      minHeight:"100vh", background:getBg(), transition:"background 0.7s ease",
      fontFamily:"Georgia,serif", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"2rem", position:"relative", overflow:"hidden"
    }}>
      <style>{`
        ${FONTS}
        *{box-sizing:border-box;margin:0;padding:0}
        .q-label{font-family:'Source Serif 4',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;margin-bottom:.6rem;opacity:.5}
        .q-title{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,4vw,2.8rem);font-weight:700;font-style:italic;line-height:1.15;margin-bottom:1.5rem}
        .q-prompt{font-family:'Source Serif 4',serif;font-size:.88rem;font-weight:300;line-height:1.9;margin-bottom:2rem;opacity:.75}
        .char-count{font-family:'Source Serif 4',serif;font-size:.7rem;opacity:.35;text-align:right;margin-top:.4rem}
        .btn-row{margin-top:1.75rem;display:flex;align-items:center;justify-content:space-between}
        .next-btn{background:transparent;border:none;font-family:'Source Serif 4',serif;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;padding:0;display:flex;align-items:center;gap:.75rem;opacity:.25;transition:opacity .3s;pointer-events:none}
        .next-btn.active{opacity:1;pointer-events:auto}
        .skip-btn{background:transparent;border:none;font-family:'Source Serif 4',serif;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;padding:0;opacity:.35;transition:opacity .3s;text-decoration:underline;text-underline-offset:3px}
        .skip-btn:hover{opacity:.65}
        .back-btn{background:transparent;border:none;font-family:'Source Serif 4',serif;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;padding:0;display:flex;align-items:center;gap:.5rem;opacity:.35;transition:opacity .3s}
        .back-btn:hover{opacity:.7}
        .back-btn:disabled{opacity:.15;cursor:default}
        .analyzing{text-align:center}
        .analyzing-title{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.6rem);font-style:italic;color:#6b4c2a;animation:breathe 3s ease-in-out infinite;line-height:1.4}
        .analyzing-title2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.6rem);font-style:italic;color:#4a8ab4;animation:breathe 3s ease-in-out infinite;line-height:1.4}
        .analyzing-sub{font-family:'Source Serif 4',serif;font-size:.78rem;letter-spacing:.15em;color:#b8a080;margin-top:1.25rem;text-transform:uppercase}
        .analyzing-sub2{font-family:'Source Serif 4',serif;font-size:.78rem;letter-spacing:.15em;color:#4a6a8a;margin-top:1.25rem;text-transform:uppercase}
        @keyframes breathe{0%,100%{opacity:.35;transform:scale(.98)}50%{opacity:1;transform:scale(1)}}
        @keyframes rippleA{0%{transform:scale(0.3);opacity:0.8}100%{transform:scale(1);opacity:0}}
        .result-wrap{width:100%;max-width:640px;max-height:88vh;overflow-y:auto;scrollbar-width:none;position:relative;z-index:1}
        .result-wrap::-webkit-scrollbar{display:none}
        .result-eyebrow{font-family:'Source Serif 4',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:#c4956a;margin-bottom:.5rem}
        .result-eyebrow2{font-family:'Source Serif 4',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:#4a8ab4;margin-bottom:.5rem}
        .result-title{font-family:'Playfair Display',serif;font-size:1.9rem;color:#2a1200;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid #c4956a}
        .result-title2{font-family:'Playfair Display',serif;font-size:1.9rem;color:#c8e0f0;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid #4a8ab4}
        .result-body{font-family:'Source Serif 4',serif;font-size:.93rem;font-weight:300;line-height:2;color:#3a2010;white-space:pre-wrap}
        .result-body2{font-family:'Source Serif 4',serif;font-size:.93rem;font-weight:300;line-height:2;color:#c8d8e8;white-space:pre-wrap}
        .result-label{font-family:'Source Serif 4',serif;font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:#c4956a;margin-top:2.5rem;margin-bottom:.4rem;display:block}
        .result-divider{width:100%;height:1px;background:rgba(196,149,106,0.2);margin-bottom:1rem}
        .result-label2{font-family:'Source Serif 4',serif;font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:#4a8ab4;margin-top:2.5rem;margin-bottom:.4rem;display:block}
        .result-divider2{width:100%;height:1px;background:rgba(74,138,180,0.2);margin-bottom:1rem}
        .result-body h2{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;font-style:italic;color:#2a1200;margin-top:2.5rem;margin-bottom:.75rem;padding-left:.75rem;border-left:3px solid #c4956a}
        .result-body2 h2{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;font-style:italic;color:#c8e0f0;margin-top:2.5rem;margin-bottom:.75rem;padding-left:.75rem;border-left:3px solid #4a8ab4}
        .result-body blockquote{font-style:italic;opacity:.75;padding-left:.75rem;border-left:2px solid #c4956a;margin:.5rem 0}
        .result-body2 blockquote{font-style:italic;opacity:.75;padding-left:.75rem;border-left:2px solid #4a8ab4;margin:.5rem 0}
        .result-actions{display:flex;gap:1rem;margin-top:3rem;flex-wrap:wrap}
        .restart-btn{background:transparent;border:1px solid #c4956a;color:#8b4513;font-family:'Source Serif 4',serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.75rem 1.75rem;transition:all .3s}
        .restart-btn:hover{background:#2a1200;color:#fdf0e0;border-color:#2a1200}
        .copy-btn{background:#2a1200;border:1px solid #2a1200;color:#fdf0e0;font-family:'Source Serif 4',serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.75rem 1.75rem;transition:all .3s}
        .copy-btn:hover{background:#8b4513;border-color:#8b4513}
        .stage2-btn{background:#1a3a5a;border:1px solid #4a8ab4;color:#c8e0f0;font-family:'Source Serif 4',serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.75rem 1.75rem;transition:all .3s}
        .stage2-btn:hover{background:#2a5a8a}
        .copy-btn2{background:#1a3a5a;border:1px solid #4a8ab4;color:#c8e0f0;font-family:'Source Serif 4',serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.75rem 1.75rem;transition:all .3s}
        .copy-btn2:hover{background:#2a5a8a}
        .restart-btn2{background:transparent;border:1px solid #4a8ab4;color:#4a8ab4;font-family:'Source Serif 4',serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.75rem 1.75rem;transition:all .3s}
        .restart-btn2:hover{background:#1a3a5a;color:#c8e0f0}
      `}</style>

      {step === "intro2" && (
        <div style={{width:"100%",maxWidth:640,position:"relative",zIndex:1}}>
          <div style={{color:"#4a8ab4",fontFamily:"'Source Serif 4',serif",fontSize:".7rem",letterSpacing:".25em",textTransform:"uppercase",marginBottom:"1.5rem"}}>마음거울 · 2단계</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.4rem,6vw,3.6rem)",fontWeight:400,lineHeight:1.15,color:"#c8e0f0",marginBottom:"2rem"}}>당신은<br/>어떻게<br/>생각하나요</h1>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"1rem",fontWeight:300,color:"#8ab4d4",lineHeight:1.9,marginBottom:"1.25rem"}}>
            1단계가 감정과 관계 패턴을 봤다면,<br/>
            2단계는 사고 구조와 인지 스타일을 봐요.<br/>
            더 깊은 층위의 질문들이에요.
          </p>
          <div style={{background:"rgba(74,138,180,0.1)",borderLeft:"3px solid #4a8ab4",padding:"1.1rem 1.25rem",marginBottom:"2rem"}}>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:".68rem",letterSpacing:".2em",textTransform:"uppercase",color:"#4a8ab4",marginBottom:".6rem"}}>시작 전에</div>
            {["이번 질문들은 조금 더 복잡해요. 생각이 정리되지 않아도 괜찮아요.","떠오르는 대로, 완성되지 않아도 써주세요."].map((t,i) => (
              <div key={i} style={{fontFamily:"'Source Serif 4',serif",fontSize:".82rem",fontWeight:300,color:"#8ab4d4",lineHeight:1.85,display:"flex",alignItems:"flex-start",gap:".5rem",marginBottom:".2rem"}}>
                <span style={{opacity:.5}}>—</span>{t}
              </div>
            ))}
          </div>
          <div style={{width:"48px",height:"1px",background:"#4a8ab4",margin:"2rem 0"}}/>
          <div style={{marginBottom:"2rem"}}>
            {QUESTIONS2.map((q,i) => (
              <div key={q.id} style={{display:"flex",alignItems:"center",gap:"1.25rem",padding:".8rem 0",borderBottom:"1px solid rgba(74,138,180,.25)"}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontStyle:"italic",color:"#4a8ab4",minWidth:"28px",opacity:.7}}>{i+1}</span>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:".9rem",fontWeight:300,color:"#8ab4d4"}}>{q.title}</span>
              </div>
            ))}
          </div>
          <button
            style={{background:"#1a3a5a",border:"none",color:"#c8e0f0",fontFamily:"'Source Serif 4',serif",fontSize:".82rem",letterSpacing:".18em",textTransform:"uppercase",padding:"1.1rem 2.8rem",cursor:"pointer"}}
            onClick={() => setStep("questions")}
          >시작하기</button>
        </div>
      )}

      {step === "questions" && (
        <div style={{width:"100%",maxWidth:640,position:"relative",zIndex:1,color:q.textColor}}>
          <Decoration type={q.deco} color={q.accentColor}/>
          <div style={{width:"100%",height:"2px",background:"rgba(0,0,0,0.08)",marginBottom:"3rem",borderRadius:"2px"}}>
            <div style={{height:"100%",width:`${progress}%`,background:q.accentColor,borderRadius:"2px",transition:"width 0.5s ease"}}/>
          </div>
          <div className="q-label" style={{color:q.accentColor}}>{currentQ+1} / {questions.length}</div>
          <h2 className="q-title">{q.title}</h2>
          <p className="q-prompt">{q.prompt}</p>
          <textarea
            ref={textareaRef}
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder={q.placeholder}
            onKeyDown={e => { if(e.key==="Enter" && e.metaKey) handleNext(); }}
            style={{
              width:"100%",minHeight:"160px",background:"transparent",border:"none",
              borderBottom:`2px solid ${q.borderColor}`,color:q.textColor,
              fontFamily:"'Source Serif 4',serif",fontSize:"0.97rem",fontWeight:300,
              lineHeight:1.85,padding:"0.5rem 0",resize:"none",outline:"none"
            }}
          />
          <div className="char-count" style={{color:q.accentColor}}>{charCount}자</div>
          <div className="btn-row">
            <button className="back-btn" onClick={handleBack} disabled={currentQ===0} style={{color:q.accentColor}}>
              <span>←</span><span>이전</span>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
              {q.skippable && (
                <button className="skip-btn" onClick={handleSkip} style={{color:q.accentColor}}>패스</button>
              )}
              <button className={`next-btn ${canProceed?"active":""}`} onClick={handleNext} style={{color:q.accentColor}}>
                <span>{currentQ<questions.length-1?"다음 질문":"분석 시작"}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="analyzing" style={{position:"relative"}}>
          <svg width="300" height="300" viewBox="0 0 200 200" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0,opacity:0.4}}>
            <ellipse cx="100" cy="100" rx="8" ry="4" fill="none" stroke={stage===1?"#c4956a":"#4a8ab4"} strokeWidth="1.2" style={{animation:"rippleA 3.5s ease-out infinite"}}/>
            <ellipse cx="100" cy="100" rx="28" ry="14" fill="none" stroke={stage===1?"#c4956a":"#4a8ab4"} strokeWidth="1" style={{animation:"rippleA 3.5s ease-out 0.7s infinite"}}/>
            <ellipse cx="100" cy="100" rx="52" ry="26" fill="none" stroke={stage===1?"#c4956a":"#4a8ab4"} strokeWidth="0.8" style={{animation:"rippleA 3.5s ease-out 1.4s infinite"}}/>
            <ellipse cx="100" cy="100" rx="76" ry="38" fill="none" stroke={stage===1?"#c4956a":"#4a8ab4"} strokeWidth="0.6" style={{animation:"rippleA 3.5s ease-out 2.1s infinite"}}/>
            <ellipse cx="100" cy="100" rx="95" ry="47" fill="none" stroke={stage===1?"#c4956a":"#4a8ab4"} strokeWidth="0.4" style={{animation:"rippleA 3.5s ease-out 2.8s infinite"}}/>
          </svg>
          <p className={stage===1?"analyzing-title":"analyzing-title2"} style={{position:"relative",zIndex:1}}>당신의 이야기를<br/>읽고 있어요</p>
          <p className={stage===1?"analyzing-sub":"analyzing-sub2"} style={{position:"relative",zIndex:1}}>잠시만요</p>
        </div>
      )}

      {step === "result" && (
        <div className="result-wrap" ref={resultRef}>
          <div className="result-eyebrow">분석 보고서 — 1단계</div>
          <h2 className="result-title">감정과 관계 패턴</h2>
          <div className="result-body" dangerouslySetInnerHTML={{__html: analysis
            .replace(/## (.+)/g, '<div class="result-label">$1</div><div class="result-divider"></div>')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\n\n/g, '</p><p>')
          }}/>
          <div className="result-actions">
            <button className="copy-btn" onClick={copyResult}>결과 복사</button>
            <button className="restart-btn" onClick={downloadResult}>결과 저장</button>
            <button className="stage2-btn" onClick={startStage2}>2단계로 →</button>
            <button className="restart-btn" onClick={restart}>다시 시작</button>
          </div>
          <FeedbackWidget />
        </div>
      )}

      {step === "result2" && (
        <div className="result-wrap" ref={resultRef}>
          <div className="result-eyebrow2">분석 보고서 — 2단계</div>
          <h2 className="result-title2">사고 구조와 인지 스타일</h2>
          <div className="result-body2" dangerouslySetInnerHTML={{__html: analysis2
            .replace(/## (.+)/g, '<div class="result-label2">$1</div><div class="result-divider2"></div>')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\n\n/g, '</p><p>')
          }}/>
          <div className="result-actions">
            <button className="copy-btn2" onClick={copyResult}>결과 복사</button>
            <button className="restart-btn2" onClick={downloadResult}>결과 저장</button>
            <button className="restart-btn2" onClick={restart}>처음으로</button>
          </div>
          <FeedbackWidget />
        </div>
      )}
    </div>
  );
}
