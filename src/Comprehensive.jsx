import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

const COMPREHENSIVE_PROMPT = `당신은 마음거울의 종합 분석가입니다.

당신의 역할은 네 가지 검사의 결과를 단순히 요약하거나 합치는 것이 아닙니다.
각 검사가 혼자서는 볼 수 없었던 것을, 네 개를 겹쳐봤을 때 비로소 드러나는 패턴을 발견하는 것입니다.

교차 분석의 원칙:
- 한 검사에서만 보이는 것은 패턴이 아니다. 두 개 이상에서 반복될 때 의미가 있다.
- 검사마다 다른 각도에서 같은 것을 가리키고 있을 때, 그 교차점을 찾아라.
- 한 검사에서는 강점으로, 다른 검사에서는 비용으로 나타나는 역설을 포착하라.
- 결과들 사이의 긴장이나 모순도 중요한 정보다. 무시하지 마라.

언어 원칙:
- 볼드(**텍스트**) 절대 사용 금지
- 소제목(###) 절대 사용 금지
- 단정 금지. "이런 가능성이 있습니다" "이렇게 보입니다" 형식으로
- 존댓말. 따뜻하되 거리를 유지할 것
- 각 섹션 4-5문장. 짧고 깊게.
- 전체가 하나의 흐름처럼 읽혀야 한다

출력 구조 (반드시 이 헤더를 정확히 사용할 것):

## 네 개의 거울이 가리킨 곳
네 검사가 각기 다른 방식으로 포착한 공통 패턴 한 가지.
"첫 번째 검사에서는 ~로, 두 번째 검사에서는 ~로 나타났습니다" 형식으로 교차를 보여줄 것.

## 반복되는 구조
행동, 감정, 사고 중 두 개 이상에서 반복되는 구조.
장점과 비용을 함께. 단정 없이.

## 네 결과가 함께 드러낸 것
각 검사를 따로 봤을 땐 보이지 않았는데, 겹쳐봤을 때 비로소 보이는 것.
긴장, 모순, 공백, 또는 아직 말해지지 않은 것.

## 오늘의 당신에게
지금 이 순간 가장 의미 있어 보이는 관찰 하나.
질문 형식으로 끝낼 것.

한국어로 작성하세요.`;

function parseSection(text, key) {
  if (!text) return "";
  const allKeys = [
    "Reflection", "Recognition", "Oracle", "Story", "Empowerment",
    "여기까지 오셨네요", "당신이 자주 느끼는 감정", "사람 사이에서 반복되는 것",
    "말하지 못한 말", "감정의 결", "이제 질문은 당신에게",
    "두 번째 질문들까지", "생각하는 방식", "갈등을 해결하는 방식",
    "몸이 먼저 아는 것", "지금 당신에게 필요한 것",
    "네 개의 거울이 가리킨 곳", "반복되는 구조", "네 결과가 함께 드러낸 것", "오늘의 당신에게",
  ];
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idx = allKeys.indexOf(key);
  const rest = allKeys.slice(idx + 1).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = rest.length > 0
    ? new RegExp(`##\\s*${escaped}([\\s\\S]*?)(?:##\\s*(?:${rest.join("|")})|$)`)
    : new RegExp(`##\\s*${escaped}([\\s\\S]*?)$`);
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function TodaySentenceWidget({ onSave }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim());
    setSaved(true);
  };

  if (saved) return (
    <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.88rem",fontWeight:300,color:"rgba(240,237,232,0.5)",lineHeight:1.8}}>기록했어요.</p>
  );

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="오늘 여기서 하나만 가져간다면..."
        rows={2}
        style={{
          width: "100%", background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(201,168,76,0.25)",
          color: "rgba(240,237,232,0.8)",
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.88rem", fontWeight: 300, lineHeight: 1.8,
          padding: "0.75rem 1rem", resize: "none", outline: "none",
          marginBottom: "0.5rem",
        }}
      />
      <button
        onClick={handleSave}
        style={{
          background: "none", border: "1px solid rgba(201,168,76,0.35)",
          color: "rgba(201,168,76,0.7)",
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.78rem", padding: "0.4rem 1.2rem", cursor: "pointer",
        }}
      >기록하기</button>
    </div>
  );
}

export default function Comprehensive({ onBack, onNext }) {
  const [comprehensive, setComprehensive] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [todaySentence, setTodaySentence] = useState(null);

  const quickRaw = localStorage.getItem("mindmirror_quicktest");
  const result1 = localStorage.getItem("mindmirror_result1") || "";
  const result2 = localStorage.getItem("mindmirror_result2") || "";
  const oracleRaw = localStorage.getItem("mindmirror_oracle") || "";
  const todayRaw = localStorage.getItem("oracle_today_sentence");

  const quick = quickRaw ? JSON.parse(quickRaw) : null;
  const today = todayRaw ? JSON.parse(todayRaw) : null;

  const hasAny = !!(quick || result1 || result2 || oracleRaw);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (today) setTodaySentence(today);
  }, []);

  async function generateComprehensive() {
    setLoading(true);
    const parts = [];
    if (quick) parts.push(`[첫 번째 검사 – 기본 성향]\n유형: ${quick.type}\n${quick.desc}`);
    if (result1) parts.push(`[두 번째 검사 – 감정과 관계 패턴]\n${result1}`);
    if (result2) parts.push(`[세 번째 검사 – 사고 구조]\n${result2}`);
    if (oracleRaw) parts.push(`[네 번째 검사 – 메모리]\n${oracleRaw}`);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system: COMPREHENSIVE_PROMPT,
          messages: [{ role: "user", content: parts.join("\n\n---\n\n") }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setComprehensive(text);
    } catch (e) {
      setComprehensive("## 네 개의 거울이 가리킨 곳\n잠시 연결이 되지 않았어요. 다시 시도해주세요.");
    }
    setLoading(false);
  }

  const copyAll = () => {
    const parts = [];
    if (quick) parts.push(`[ 내 기본값 ]\n유형: ${quick.type}\n${quick.desc}`);
    if (result1) parts.push(`[ 내 마음의 초기화면 ]\n${result1}`);
    if (result2) parts.push(`[ 내 마음의 운영체계 ]\n${result2}`);
    if (oracleRaw) parts.push(`[ 내 마음의 메모리 ]\n${oracleRaw}`);
    if (comprehensive) parts.push(`[ 종합 분석 ]\n${comprehensive}`);
    if (todaySentence) parts.push(`[ 오늘의 한 문장 ]\n"${todaySentence.sentence}"`);
    navigator.clipboard.writeText(parts.join("\n\n---\n\n"));
    alert("복사되었습니다.");
  };

  const handleSaveSentence = (sentence) => {
    const today = new Date();
    const data = { sentence, date: `${today.getMonth()+1}월 ${today.getDate()}일`, timestamp: Date.now() };
    localStorage.setItem("oracle_today_sentence", JSON.stringify(data));
    setTodaySentence(data);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1F3A32",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "3rem 1.5rem 5rem",
    }}>
      <style>{FONTS + `
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 580,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>

        {/* 제목 */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "0.6rem", letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#D6B870", marginBottom: "1.5rem",
          }}>내 마음의 전체화면</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem,6vw,3.6rem)",
            fontWeight: 400, fontStyle: "italic",
            color: "rgba(247,242,232,0.9)",
            lineHeight: 1.15, marginBottom: "2rem",
          }}>반복된 것과 어긋난 것이 함께 보일 때</h1>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(247,242,232,0.6)",lineHeight:1.9,marginBottom:"0.75rem"}}>내 마음의 전체화면은 앞선 결과를 다시 요약하지 않습니다. 답들 사이에서 반복되는 흐름과, 유난히 다르게 빛나는 지점을 함께 봅니다.</p>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(247,242,232,0.6)",lineHeight:1.9,marginBottom:"0.75rem"}}>나는 어디에서 익숙한 나로 돌아갔고, 어디에서 다른 가능성을 보였을까요?</p>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(247,242,232,0.6)",lineHeight:1.9}}>이제 흩어져 있던 답들이 하나의 장면으로 모입니다.</p>
        </div>

        {/* 오늘의 한 문장 (기존 저장된 것) */}
        {todaySentence && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(201,168,76,0.45)",marginBottom:"0.4rem"}}>오늘의 한 문장 · {todaySentence.date}</div>
            <div style={{width:"100%",height:"1px",background:"rgba(201,168,76,0.2)",marginBottom:"1rem"}}/>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontStyle:"italic",color:"#c9a84c",lineHeight:1.85}}>"{todaySentence.sentence}"</div>
          </div>
        )}

        {/* AI 교차 분석 */}
        <div style={{ marginBottom: "3rem" }}>
          {!comprehensive && !loading && (
            <div>
              <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.88rem",fontWeight:300,color:"rgba(240,237,232,0.4)",lineHeight:1.9,marginBottom:"1.25rem"}}>
                {hasAny
                  ? "지금까지의 답들은 모두 같은 방향을 가리키지 않을 수 있습니다. 반복된 길과 새로 열린 가능성을 함께 비춰드릴게요."
                  : "도구를 하나 이상 완료하면 전체화면을 시작할 수 있어요."}
              </p>
              {hasAny && (
                <button onClick={generateComprehensive} style={{background:"none",border:"1px solid rgba(201,168,76,0.4)",color:"rgba(240,237,232,0.7)",fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",letterSpacing:"0.18em",textTransform:"uppercase",padding:"0.65rem 1.5rem",cursor:"pointer"}}>전체화면 보기 →</button>
              )}
            </div>
          )}

          {loading && (
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontStyle:"italic",color:"rgba(240,237,232,0.4)",animation:"breathe 2s ease-in-out infinite"}}>잠시 후, 당신의 답들이 하나의 장면으로 모입니다...</p>
          )}

          {comprehensive && !loading && (
            <div>
              {[
                { key: "네 개의 거울이 가리킨 곳" },
                { key: "반복되는 구조" },
                { key: "네 결과가 함께 드러낸 것" },
                { key: "오늘의 당신에게" },
              ].map(({ key }) => {
                const content = parseSection(comprehensive, key);
                return content ? (
                  <div key={key} style={{ marginBottom: "1.75rem" }}>
                    <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(201,168,76,0.35)",marginBottom:"0.6rem"}}>{key}</div>
                    <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.9rem",fontWeight:300,color:"rgba(240,237,232,0.65)",lineHeight:2,whiteSpace:"pre-wrap"}}>{content}</div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* 엔딩 */}
        <div style={{borderTop:"1px solid rgba(201,168,76,0.15)",paddingTop:"3rem",marginBottom:"3rem"}}>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontStyle:"italic",color:"rgba(247,242,232,0.7)",lineHeight:1.9,marginBottom:"2rem"}}>여기까지 왔어요.</p>

          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.6)",lineHeight:2,marginBottom:"1rem"}}>오늘 당신은 꽤 드문 일을 했어요.<br/>자신에 대해 남이 준 말 말고,<br/>지금 자신의 말로 자신을 바라본 거예요.</p>

          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.6)",lineHeight:2,marginBottom:"1rem"}}>그게 생각보다 쉽지 않은 일이에요.<br/>그러니 오늘만큼은<br/>여기까지 온 자신에게 조용히 고맙다고 말해줘도 괜찮아요.</p>

          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.6)",lineHeight:2,marginBottom:"1rem"}}>언젠가 마음이 다시 궁금해지는 날,<br/>오늘의 답을 다시 읽어보세요.<br/>같은 글도 다시 읽으면 다르게 보이듯,<br/>나 자신도 다시 보면 다르게 보일 때가 있으니까요.</p>

          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.6)",lineHeight:2,marginBottom:"2rem"}}>오늘 결과를 가까운 사람에게 보여주세요.<br/>오래 함께했는데도 몰랐던 것들이 보이기 시작해요.<br/>분석지를 복사해서 당신의 AI와 더 깊이 이야기해보세요.</p>

          {/* 한 문장 쓰기 */}
          <div style={{marginBottom:"2rem"}}>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.88rem",fontWeight:300,color:"rgba(240,237,232,0.5)",lineHeight:1.9,marginBottom:"1rem"}}>오늘 여기서 하나만 가져간다면 — 무엇인가요?</p>
            {!todaySentence ? (
              <TodaySentenceWidget onSave={handleSaveSentence} />
            ) : (
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontStyle:"italic",color:"rgba(201,168,76,0.6)",lineHeight:1.85}}>"{todaySentence.sentence}"</p>
            )}
          </div>

          {/* 피드백 */}
          <div>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.82rem",fontWeight:300,color:"rgba(240,237,232,0.3)",lineHeight:1.9,marginBottom:"0.5rem"}}>오늘 어떤 순간이 가장 마음에 남았나요?<br/>당신의 한 줄이 이 거울을 더 선명하게 만들어요.</p>
            <a href="https://forms.gle/A6xXdAVUQoaNqaEWA" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(184,154,94,0.5)",textDecoration:"underline",textUnderlineOffset:"3px"}}>피드백 남기기 →</a>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{display:"flex",gap:"1.5rem",alignItems:"center",flexWrap:"wrap",marginBottom:"3rem"}}>
          <button onClick={copyAll} style={{background:"none",border:"1px solid rgba(201,168,76,0.4)",color:"rgba(240,237,232,0.7)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",padding:"0.5rem 1.25rem",cursor:"pointer"}}>결과 복사</button>
          {onNext && (
            <button onClick={onNext} style={{background:"none",border:"1px solid rgba(240,237,232,0.3)",color:"rgba(240,237,232,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",padding:"0.5rem 1.25rem",cursor:"pointer"}}>다음 →</button>
          )}
          <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(240,237,232,0.3)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",cursor:"pointer"}}>← 돌아가기</button>
        </div>

        {/* 하단 */}
        <div style={{textAlign:"center",paddingBottom:"2rem"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.85rem",fontStyle:"italic",color:"#B89A5E",letterSpacing:"0.08em"}}>γνῶθι σεαυτόν · 너 자신을 알라</div>
        </div>

      </div>
    </div>
  );
}
