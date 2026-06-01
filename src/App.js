import { useState, useRef, useEffect } from "react";

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
    placeholder: "예: 나에게 제일 중요한 사람은 ___인데, 왜냐하면...",
    bg: "#c8bfdf", textColor: "#1a0f35", accentColor: "#5c4a8a", borderColor: "#9b89c4",
    deco: "mirror", skippable: false
  },
  {
    id: 3,
    title: "억울했던 순간",
    prompt: "누군가에게 오해받거나 억울했던 적 있나요? 그때 하고 싶었던 말이 있다면 여기서 해보세요.",
    placeholder: "예: 그때 나는 정말 ___하고 싶었는데...",
    bg: "#e8c8b8", textColor: "#2a0e00", accentColor: "#a0522d", borderColor: "#c47a5a",
    deco: "shards", skippable: true
  },
  {
    id: 4,
    title: "자꾸 떠오르는 것",
    prompt: "오래 전 일인데도 자꾸 머릿속에 맴도는 사건이나 장면이 있으신가요? 그게 왜 떠오르는지 생각해 보신 적 있으세요? 한 번도 생각해 보신 적 없으시다면 지금 해보시겠어요. 물론 패스하셔도 전혀 상관없어요.",
    placeholder: "예: 몇 년이 지났는데도 자꾸 생각나는 건...",
    bg: "#e8d48a", textColor: "#1e1400", accentColor: "#8b6914", borderColor: "#c9a84c",
    deco: "spiral", skippable: true
  },
  {
    id: 5,
    title: "반복되는 그 말, 그 상황",
    prompt: "살면서 '또 이러네' 싶었던 순간이 있으셨나요? 비슷한 상황, 비슷한 감정이 반복된다는 느낌이요. 어떤 상황이었는지, 그때 어떤 마음이었는지 써주세요.",
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
    prompt: "친한 사람이 당신이 보기엔 분명 좋지 않은 선택을 하려 합니다. 그가 조언을 구하든 구하지 않든 — 당신은 어떻게 해요? 그 순간 드는 생각까지요.",
    placeholder: "떠오르는 대로 써주세요...",
    bg: "#1a2535", textColor: "#c8d8e8", accentColor: "#4a8ab4", borderColor: "#2a4a6a",
    deco: null, skippable: false
  },
  {
    id: 2,
    title: "반박 앞에서",
    prompt: "당신이 확신하던 생각을 누군가 조목조목 반박했습니다. 반박을 듣는 바로 그 순간 몸과 마음에서 어떤 일이 일어나나요? 그 자리가 끝나고 혼자가 됐을 때, 그 반박을 어떻게 대하나요?",
    placeholder: "생각, 감정, 몸의 반응, 이후 행동까지...",
    bg: "#1e1e2e", textColor: "#c8c8e8", accentColor: "#6a5acd", borderColor: "#3a3a6a",
    deco: null, skippable: false
  },
  {
    id: 3,
    title: "막힌 문제",
    prompt: "며칠째 붙잡고 있는데도 풀리지 않는 문제가 있어요. 계속 파고드나요, 잠시 멈추나요, 사람을 찾나요? 그 에너지는 어디서 나오고, 그때 당신의 상태는 어때요?",
    placeholder: "그때 당신의 상태도 함께 적어주세요...",
    bg: "#1a2520", textColor: "#c8e0c8", accentColor: "#3a8a5a", borderColor: "#2a5a3a",
    deco: null, skippable: false
  },
  {
    id: 4,
    title: "설명할 수 없는 신호",
    prompt: "뭔가 이상하거나 불편한데 왜 그런지 설명할 수 없을 때가 있어요. 목이 조여온다거나, 누군가를 보자마자 어깨에 힘이 들어간다거나, 특정 장소에 가면 이유 없이 피곤해진다거나. 당신은 그런 신호를 어떻게 대하나요? 무시했을 때와 따라갔을 때 각각 어떤 결과가 있었나요?",
    placeholder: "떠오르는 방식대로 적어주세요...",
    bg: "#251a20", textColor: "#e0c8d0", accentColor: "#8a3a5a", borderColor: "#5a2a3a",
    deco: null, skippable: true
  },
  {
    id: 5,
    title: "예상 밖의 결과",
    prompt: "열심히 준비했는데 결과가 예상과 완전히 달랐어요. 가장 먼저 누구 또는 무엇을 떠올리나요? 그다음엔 어떻게 움직이나요?",
    placeholder: "예: 나 자신, 운이나 타이밍, 특정한 누군가...",
    bg: "#201a25", textColor: "#d8c8e8", accentColor: "#7a4a9a", borderColor: "#4a2a6a",
    deco: null, skippable: false
  },
  {
    id: 6,
    title: "복잡한 걸 이해하는 방식",
    prompt: "복잡한 걸 이해해야 할 때 어디서부터 시작하나요? 말로 정리하나요, 그림을 그리나요, 혼자 오래 생각하나요, 사람과 이야기하나요? 그 방법이 안 통할 때 두 번째 선택은 뭔가요?",
    placeholder: "당신만의 방식을 적어주세요...",
    bg: "#1a2030", textColor: "#c8d0e8", accentColor: "#3a5a9a", borderColor: "#2a3a6a",
    deco: null, skippable: false
  },
  {
    id: 7,
    title: "지금 진짜 필요한 것",
    prompt: "지금 이 순간 당신에게 진짜 필요한 것이 있다면 뭘까요? 바람이나 목표 같은 먼 이야기가 아니라, 지금 여기서 간절하게 원하거나 놓치고 있다고 느끼는 것을요. 떠오르는 대로 써주세요.",
    placeholder: "딱 하나만 꼽지 않아도 괜찮아요...",
    bg: "#202020", textColor: "#e0e0e0", accentColor: "#8a8a8a", borderColor: "#4a4a4a",
    deco: null, skippable: false
  }
];

const systemPrompt = `당신은 따뜻하고 예리한 인지구조 분석가입니다.
사용자가 제공한 7가지 답변을 분석합니다.

각 질문의 분석 의도:
1. 나는 누구인가요 → 자기개념과 정체성 언어
2. 내 사람들 → 관계 스키마와 대상 분류 방식
3. 억울했던 순간 → 귀인 방식, 억압된 감정
4. 자꾸 떠오르는 것 → 미해결 감정, 무의식적 집착
5. 반복되는 그 말, 그 상황 → 행동 패턴과 관계 반복
6. 부러웠던 순간 → 결핍과 욕구
7. 빛났던 순간 → 자기효능감과 핵심 가치관

분석 원칙:
- 모든 항목에 실제 발화를 직접 인용할 것
- 판단하지 말 것. 관찰 → 가능성 → 확인질문 구조로 기술할 것
- 예: "~라고 하셨네요. 혹시 ~일 가능성이 있을까요? 그렇다면 ~은 어떻게 느껴지세요?"
- 침묵 데이터는 반드시 양해를 구하고 생존전략 관점으로 볼 것
- 예: "이 질문은 넘어가셨네요. 실례가 되지 않는다면 — 답하지 않는 것도 오랫동안 자신을 지켜온 방식일 수 있어요."
- 아첨하지 말 것
- 임상 진단이 아님을 명시할 것

출력 구조:

## 여는 말
"여기까지 답해주셨네요. 쉽지 않은 질문들이었을 텐데요."

## 주요 감정 키워드
3가지 감정 키워드와 그 연결고리. 키워드들이 어떻게 연결되는지 설명할 것.

## 관계에서 반복되는 패턴
관찰 → 가능성 → 확인질문 구조로 3가지.

## 말하지 못한 말들
관찰 → 가능성 → 확인질문 구조로 3가지.

## 정체성의 일관성
1번과 7번 교차 분석. 단정 없이 가능성으로.

## 정서 톤
전체 답변의 감정 온도. 관찰만.

## 침묵 데이터
양해를 구하고, 생존전략 관점으로.

## 시간 구조
과거/현재/미래 중 어디에 머무는지.

## 당신에게 드리는 질문 하나
분석 요약 아님. 스스로 궁금해질 질문 하나만.

## 한계 고지
임상 진단이 아닙니다. 당신이 쓴 말들에서 찾은 패턴을 돌려드리는 거예요.

한국어로 작성하세요.`;

const systemPrompt2 = `당신은 예리하고 정확한 인지구조 분석가입니다.
사용자가 제공한 7가지 답변을 분석하여 사고 구조와 인지 스타일을 파악합니다.

각 질문의 분석 의도:
1. 친구의 결정 → 갈등 처리 방식, 관계에서의 경계
2. 반박 앞에서 → 인지적 유연성, 자아 방어 방식
3. 막힌 문제 → 문제 해결 전략, 에너지 원천
4. 설명할 수 없는 신호 → 직관과 논리의 균형, 신체 인식
5. 예상 밖의 결과 → 귀인 방식, 회복 탄력성
6. 복잡한 걸 이해하는 방식 → 인지 스타일, 학습 패턴
7. 지금 진짜 필요한 것 → 현재 상태, 핵심 욕구

분석 원칙:
- 모든 항목에 실제 발화를 직접 인용할 것
- 판단하지 말 것. 관찰 → 가능성 → 확인질문 구조로 기술할 것
- 침묵 데이터는 반드시 양해를 구하고 생존전략 관점으로 볼 것
- 아첨하지 말 것
- 임상 진단이 아님을 명시할 것

출력 구조:

## 여는 말
"두 번째 질문들까지 답해주셨네요. 이번엔 조금 다른 층위의 이야기였을 거예요."

## 사고 이동 패턴
분석형 / 직관형 / 서사형 / 전략형 중 어디에 가까운지. 근거와 함께. 관찰 → 가능성 → 확인질문 구조로.

## 전제 구조
이 사람이 세상을 어떻게 해석하는지. 어떤 가정 위에서 움직이는지.

## 갈등 처리 방식
1번과 2번을 교차 분석. 관찰 → 가능성 → 확인질문 구조로.

## 메타인지 수준
자기 관찰 빈도, 가설 유지 여부, 패턴 감지 속도. 관찰만.

## 신체 신호와 인지의 관계
4번 답변 중심. 몸과 머리가 어떻게 연결되어 있는지.

## 지금 이 사람에게 필요한 것
7번 답변과 전체 패턴을 연결. 단정 없이 가능성으로.

## 당신에게 드리는 질문 하나
분석 요약 아님. 스스로 궁금해질 질문 하나만.

## 한계 고지
임상 진단이 아닙니다. 당신이 쓴 말들에서 찾은 패턴을 돌려드리는 거예요.

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

export default function App() {
  const [stage, setStage] = useState(1);
  const [step, setStep] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analysis2, setAnalysis2] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  const questions = stage === 1 ? QUESTIONS : QUESTIONS2;
useEffect(() => {
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
  if ((step === "result" && analysis || step === "result2" && analysis2)) {
  localStorage.removeItem("mindmirror_answers");
  localStorage.removeItem("mindmirror_stage");
  localStorage.removeItem("mindmirror_currentQ");
}
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
      setAnalysis(text || "분석 실패");
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
      setAnalysis2(text || "분석 실패");
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
  };

  const progress = (currentQ / questions.length) * 100;
  const q = questions[currentQ];
  const canProceed = currentAnswer.trim().length > 0;

  const getBg = () => {
    if (step === "intro") return "#fef6ed";
    if (step === "intro2") return "#0f1520";
    if (step === "questions") return q.bg;
    if (step === "analyzing") return stage === 1 ? "#f5ede0" : "#0f1520";
    if (step === "result") return "#faf5ef";
    if (step === "result2") return "#0f1520";
    return "#fef6ed";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: getBg(),
      transition: "background 0.7s ease",
      fontFamily: "Georgia,serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .container{width:100%;max-width:640px;position:relative;z-index:1}
        .intro-eyebrow{font-family:'Source Serif 4',serif;font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:#c4956a;margin-bottom:1.5rem}
        .intro-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,6vw,3.6rem);font-weight:400;line-height:1.15;color:#2a1200;margin-bottom:2rem}
        .intro-body{font-family:'Source Serif 4',serif;font-size:1rem;font-weight:300;color:#6b4c2a;line-height:1.9;margin-bottom:1.25rem}
        .intro-italic{font-family:'Source Serif 4',serif;font-size:.93rem;font-weight:300;font-style:italic;color:#9a7856;line-height:1.9;margin-bottom:1.5rem}
        .intro-notice-box{background:rgba(196,149,106,0.1);border-left:3px solid #c4956a;padding:1.1rem 1.25rem;margin-bottom:2rem}
        .intro-notice-title{font-family:'Source Serif 4',serif;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:#c4956a;margin-bottom:.6rem}
        .intro-notice-item{font-family:'Source Serif 4',serif;font-size:.82rem;font-weight:300;color:#6b4c2a;line-height:1.85;display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.2rem}
        .intro-notice-item::before{content:"—";opacity:.5;flex-shrink:0}
        .divider{width:48px;height:1px;background:#c4956a;margin:2rem 0}
        .divider2{width:48px;height:1px;background:#4a8ab4;margin:2rem 0}
        .q-list{margin-bottom:2rem}
        .q-list-item{display:flex;align-items:center;gap:1.25rem;padding:.8rem 0;border-bottom:1px solid rgba(196,149,106,.25)}
        .q-list-item2{display:flex;align-items:center;gap:1.25rem;padding:.8rem 0;border-bottom:1px solid rgba(74,138,180,.25)}
        .q-num{font-family:'Playfair Display',serif;font-size:1.1rem;font-style:italic;color:#c4956a;min-width:28px;opacity:.7}
        .q-num2{font-family:'Playfair Display',serif;font-size:1.1rem;font-style:italic;color:#4a8ab4;min-width:28px;opacity:.7}
        .q-name{font-family:'Source Serif 4',serif;font-size:.9rem;font-weight:300;color:#5a3c1e}
        .q-name2{font-family:'Source Serif 4',serif;font-size:.9rem;font-weight:300;color:#8ab4d4}
        .start-btn{background:#2a1200;border:none;color:#fdf0e0;font-family:'Source Serif 4',serif;font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;padding:1.1rem 2.8rem;cursor:pointer;transition:all .3s}
        .start-btn:hover{background:#8b4513}
        .start-btn2{background:#1a3a5a;border:none;color:#c8e0f0;font-family:'Source Serif 4',serif;font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;padding:1.1rem 2.8rem;cursor:pointer;transition:all .3s}
        .start-btn2:hover{background:#2a5a8a}
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
        .result-wrap{width:100%;max-width:640px;max-height:88vh;overflow-y:auto;scrollbar-width:none;position:relative;z-index:1}
        .result-wrap::-webkit-scrollbar{display:none}
        .result-eyebrow{font-family:'Source Serif 4',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:#c4956a;margin-bottom:.5rem}
        .result-eyebrow2{font-family:'Source Serif 4',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:#4a8ab4;margin-bottom:.5rem}
        .result-title{font-family:'Playfair Display',serif;font-size:1.9rem;color:#2a1200;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid #c4956a}
        .result-title2{font-family:'Playfair Display',serif;font-size:1.9rem;color:#c8e0f0;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid #4a8ab4}
        .result-body{font-family:'Source Serif 4',serif;font-size:.93rem;font-weight:300;line-height:2;color:#3a2010;white-space:pre-wrap}
        .result-body2{font-family:'Source Serif 4',serif;font-size:.93rem;font-weight:300;line-height:2;color:#c8d8e8;white-space:pre-wrap}
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

      {step === "intro" && (
        <div className="container">
          <div className="intro-eyebrow">AI 인지구조 분석 — 1단계</div>
          <h1 className="intro-title">당신은<br/>어떻게<br/>생각하나요</h1>
          <p className="intro-body">살면서 왜 같은 상황이 반복되는지,<br/>왜 특정 순간에 늘 비슷한 감정이 오는지<br/>궁금했던 적 있나요.</p>
          <p className="intro-italic">
            일곱 가지 질문에 솔직하게 답해주시면,<br/>
            AI가 당신의 말에서 패턴을 찾아 돌려드려요.<br/>
            거울 하나 건네드리겠습니다.
          </p>
          <div className="intro-notice-box">
            <div className="intro-notice-title">시작 전에</div>
            <div className="intro-notice-item">틀린 답은 없어요. 생각나는 대로, 편한 만큼만 쓰시면 돼요.</div>
            <div className="intro-notice-item">질문마다 자유롭게 돌아가서 수정할 수 있어요.</div>
            <div className="intro-notice-item">패스하고 싶은 질문은 건너뛰셔도 괜찮아요.</div>
            <div className="intro-notice-item">입력하신 내용은 저장되지 않아요.</div>
            <div className="intro-notice-item">임상 진단이 아니에요.</div>
          </div>
          <div className="divider"/>
          <div className="q-list">
            {QUESTIONS.map((q,i) => (
              <div className="q-list-item" key={q.id}>
                <span className="q-num">{i+1}</span>
                <span className="q-name">{q.title}</span>
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={() => setStep("questions")}>시작하기</button>
        </div>
      )}

      {step === "intro2" && (
        <div className="container">
          <div style={{color:"#4a8ab4", fontFamily:"'Source Serif 4',serif", fontSize:".7rem", letterSpacing:".25em", textTransform:"uppercase", marginBottom:"1.5rem"}}>AI 인지구조 분석 — 2단계</div>
          <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.4rem,6vw,3.6rem)", fontWeight:400, lineHeight:1.15, color:"#c8e0f0", marginBottom:"2rem"}}>당신은<br/>어떻게<br/>생각하나요</h1>
          <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"1rem", fontWeight:300, color:"#8ab4d4", lineHeight:1.9, marginBottom:"1.25rem"}}>
            1단계가 감정과 관계 패턴을 봤다면,<br/>
            2단계는 사고 구조와 인지 스타일을 봐요.<br/>
            더 깊은 층위의 질문들이에요.
          </p>
          <div style={{background:"rgba(74,138,180,0.1)", borderLeft:"3px solid #4a8ab4", padding:"1.1rem 1.25rem", marginBottom:"2rem"}}>
            <div style={{fontFamily:"'Source Serif 4',serif", fontSize:".68rem", letterSpacing:".2em", textTransform:"uppercase", color:"#4a8ab4", marginBottom:".6rem"}}>시작 전에</div>
            <div style={{fontFamily:"'Source Serif 4',serif", fontSize:".82rem", fontWeight:300, color:"#8ab4d4", lineHeight:1.85, display:"flex", alignItems:"flex-start", gap:".5rem", marginBottom:".2rem"}}>
              <span style={{opacity:.5}}>—</span>이번 질문들은 조금 더 복잡해요. 생각이 정리되지 않아도 괜찮아요.
            </div>
            <div style={{fontFamily:"'Source Serif 4',serif", fontSize:".82rem", fontWeight:300, color:"#8ab4d4", lineHeight:1.85, display:"flex", alignItems:"flex-start", gap:".5rem", marginBottom:".2rem"}}>
              <span style={{opacity:.5}}>—</span>떠오르는 대로, 완성되지 않아도 써주세요.
            </div>
          </div>
          <div className="divider2"/>
          <div className="q-list">
            {QUESTIONS2.map((q,i) => (
              <div className="q-list-item2" key={q.id}>
                <span className="q-num2">{i+1}</span>
                <span className="q-name2">{q.title}</span>
              </div>
            ))}
          </div>
          <button className="start-btn2" onClick={() => setStep("questions")}>시작하기</button>
        </div>
      )}

      {step === "questions" && (
        <div className="container" style={{color: q.textColor}}>
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
              width:"100%", minHeight:"160px",
              background:"transparent", border:"none",
              borderBottom:`2px solid ${q.borderColor}`,
              color:q.textColor,
              fontFamily:"'Source Serif 4',serif",
              fontSize:"0.97rem", fontWeight:300,
              lineHeight:1.85, padding:"0.5rem 0",
              resize:"none", outline:"none"
            }}
          />
          <div className="char-count" style={{color:q.accentColor}}>{charCount}자</div>
          <div className="btn-row">
            <button className="back-btn" onClick={handleBack} disabled={currentQ === 0} style={{color:q.accentColor}}>
              <span>←</span><span>이전</span>
            </button>
            <div style={{display:"flex", alignItems:"center", gap:"1.5rem"}}>
              {q.skippable && (
                <button className="skip-btn" onClick={handleSkip} style={{color:q.accentColor}}>패스</button>
              )}
              <button className={`next-btn ${canProceed ? "active" : ""}`} onClick={handleNext} style={{color:q.accentColor}}>
                <span>{currentQ < questions.length-1 ? "다음 질문" : "분석 시작"}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="analyzing">
          <p className={stage === 1 ? "analyzing-title" : "analyzing-title2"}>당신의 이야기를<br/>읽고 있어요</p>
          <p className={stage === 1 ? "analyzing-sub" : "analyzing-sub2"}>잠시만요</p>
        </div>
      )}

      {step === "result" && (
        <div className="result-wrap" ref={resultRef}>
          <div className="result-eyebrow">분석 보고서 — 1단계</div>
          <h2 className="result-title">감정과 관계 패턴</h2>
          <div
            className="result-body"
            dangerouslySetInnerHTML={{
              __html: analysis
                .replace(/## (.+)/g, '<h2>$1</h2>')
                .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                .replace(/"(.+?)"/g, '<blockquote>"$1"</blockquote>')
            }}
          />
          <div className="result-actions">
            <button className="copy-btn" onClick={copyResult}>결과 복사</button><button className="restart-btn" onClick={downloadResult}>결과 저장</button>
            <button className="stage2-btn" onClick={startStage2}>2단계로 →</button>
            <button className="restart-btn" onClick={restart}>다시 시작</button>
          </div>
        </div>
      )}

      {step === "result2" && (
        <div className="result-wrap" ref={resultRef}>
          <div className="result-eyebrow2">분석 보고서 — 2단계</div>
          <h2 className="result-title2">사고 구조와 인지 스타일</h2>
          <div
            className="result-body2"
            dangerouslySetInnerHTML={{
              __html: analysis2
                .replace(/## (.+)/g, '<h2>$1</h2>')
                .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                .replace(/"(.+?)"/g, '<blockquote>"$1"</blockquote>')
            }}
          />
          <div className="result-actions">
            <button className="copy-btn2" onClick={copyResult}>결과 복사</button><button className="restart-btn2" onClick={downloadResult}>결과 저장</button>
            <button className="restart-btn2" onClick={restart}>처음으로</button>
          </div>
        </div>
      )}
    </div>
  );
}
