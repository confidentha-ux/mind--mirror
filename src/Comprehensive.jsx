import { useState, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

const COMPREHENSIVE_PROMPT = `당신은 마음거울의 종합 분석가입니다.
사용자는 이미 다섯 개의 개별 검사 결과를 받았습니다.
당신의 역할은 분석을 추가하는 것이 아닙니다.
다섯 개를 각각 봤을 때는 보이지 않던 것, 겹쳤을 때만 드러나는 패턴 하나를 찾는 것입니다.

입력 구조와 가중치:
- [첫 번째 검사 – 기본 성향]: 유형 분류 결과. 텍스트가 짧다. 맥락으로만 사용할 것. 가중치 낮음.
- [두 번째 검사 – 감정과 관계 패턴]: 특정 상황에서의 반응 패턴. 가중치 중간.
- [세 번째 검사 – 사고 구조]: 반응 아래에서 작동하는 해석과 판단의 구조. 가중치 높음.
- [네 번째 검사 – 메모리]: 사용자가 직접 쓴 날것의 텍스트. 가장 중요한 재료. 가중치 높음.
- [다섯 번째 검사 – 새창열기]: 같은 재료를 다른 각도로 본 것. 세 번째, 네 번째를 보완. 가중치 중간.
- 텍스트 양이 많은 검사를 더 중요하게 취급하지 마라. 가중치 기준을 따를 것.

교차 분석의 원칙:
- 두 개 이상에서 반복될 때만 패턴으로 인정한다
- 가장 강한 교차점 하나를 깊게 파라. 여러 개 나열하지 마라
- 강점과 비용이 같은 뿌리에서 나올 때 그 역설을 포착하라
- 사용자가 직접 입력한 것에서만 근거를 가져올 것
- 입력에 없는 과거, 어린 시절, 오래된 믿음은 추론하지 마라
- 불확실할 때는 추론을 줄여라. 가능성 표현으로 포장해서 늘리지 마라
-'나는 사랑받기 어려운 사람인 것 같다'는 응답은 위기 신호가 아니라 자기인식의 한 형태로 다룰 것. 과도하게 반응하거나 위로 모드로 전환하지 마라

언어 원칙:
- 볼드 절대 사용 금지
- 소제목 절대 사용 금지
- 존댓말. 따뜻하되 분석의 거리를 잃지 말 것
- 위로 모드로 흐르지 마라. 정확함이 우선이다
- 전체가 하나의 흐름처럼 읽혀야 한다

## 겹쳤을 때 보이는 것
다섯 결과를 겹쳤을 때만 보이는 가장 강한 패턴 하나를 깊고 정확하게. 8-10문장.

## 그것이 당신에게 한 일
그 패턴이 이 사람에게 어떤 강점을 만들었고, 동시에 어떤 비용을 치르게 했는지. 6-8문장.

## 지금 당신에게 남는 질문
처방하지 마라. 이 사람이 스스로 가져갈 수 있는 질문 하나로 끝낼 것. 2-3문장.

한국어로 작성하세요.`;

function parseSection(text, key) {
  if (!text) return "";
  const allKeys = [
    "겹쳤을 때 보이는 것", "그것이 당신에게 한 일", "지금 당신에게 남는 질문",
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
    <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(38,50,44,0.4)", lineHeight: 1.8 }}>기록했어요.</p>
  );

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="여기에 남겨주세요..."
        rows={3}
        style={{
          width: "100%",
          background: "rgba(38,50,44,0.04)",
          border: "1px solid rgba(168,123,123,0.3)",
          color: "#26322C",
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.88rem", fontWeight: 300, lineHeight: 1.8,
          padding: "0.75rem 1rem", resize: "none", outline: "none",
          marginBottom: "0.5rem",
        }}
      />
      <button
        onClick={handleSave}
        style={{
          background: "none",
          border: "1px solid rgba(168,123,123,0.4)",
          color: "#A87B7B",
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
          padding: "0.5rem 1.4rem", cursor: "pointer",
        }}
      >기록하기</button>
    </div>
  );
}

export default function Comprehensive({ onBack }) {
  const [comprehensive, setComprehensive] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [todaySentence, setTodaySentence] = useState(null);

  const quickRaw = localStorage.getItem("mindmirror_quicktest");
  const result1 = localStorage.getItem("mindmirror_result1") || "";
  const result2 = localStorage.getItem("mindmirror_result2") || "";
  const oracleRaw = localStorage.getItem("mindmirror_oracle") || "";
  const newWindowRaw = localStorage.getItem("mindmirror_newwindow") || "";
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
    if (newWindowRaw) parts.push(`[다섯 번째 검사 – 새창열기]\n${newWindowRaw}`);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1600,
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
    if (newWindowRaw) parts.push(`[ 내 마음의 새창열기 ]\n${newWindowRaw}`);
    if (comprehensive) parts.push(`[ 종합 분석 ]\n${comprehensive}`);
    if (todaySentence) parts.push(`[ 오늘의 기록 ]\n"${todaySentence.sentence}"`);
    navigator.clipboard.writeText(parts.join("\n\n---\n\n"));
    alert("복사되었습니다.");
  };

  const handleSaveSentence = (sentence) => {
    const now = new Date();
    const data = { sentence, date: `${now.getMonth() + 1}월 ${now.getDate()}일`, timestamp: Date.now() };
    localStorage.setItem("oracle_today_sentence", JSON.stringify(data));
    setTodaySentence(data);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#EDE8E0",
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
            color: "#A87B7B", marginBottom: "1.5rem",
          }}>내 마음의 전체화면</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem,4vw,2.6rem)",
            fontWeight: 400,
            color: "#26322C",
            lineHeight: 1.2, marginBottom: "2rem",
          }}>반복된 것과 어긋난 것이 함께 보일 때</h1>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9, marginBottom: "0.75rem" }}>내 마음의 전체화면은 앞선 결과를 다시 요약하지 않습니다.<br />답들 사이에서 반복되는 흐름과, 유난히 다르게 빛나는 지점을 함께 봅니다.</p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9, marginBottom: "0.75rem" }}>나는 어디에서 익숙한 나로 돌아갔고,<br />어디에서 다른 가능성을 보였을까요?</p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9 }}>이제 흩어져 있던 답들이 나의 전체화면으로 모입니다.</p>
        </div>

        {/* 오늘의 한 문장 (기존 저장된 것) */}
        {todaySentence && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(168,123,123,0.5)", marginBottom: "0.4rem" }}>오늘의 기록 · {todaySentence.date}</div>
            <div style={{ width: "100%", height: "1px", background: "rgba(168,123,123,0.2)", marginBottom: "1rem" }} />
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontStyle: "italic", color: "#A87B7B", lineHeight: 1.85 }}>"{todaySentence.sentence}"</div>
          </div>
        )}

        {/* AI 교차 분석 */}
        <div style={{ marginBottom: "3rem" }}>
          {!comprehensive && !loading && (
            <div>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(38,50,44,0.45)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
                {hasAny
                  ? "지금까지의 답들은 모두 같은 방향을 가리키지 않을 수 있습니다. 반복된 길과 새로 열린 가능성을 함께 비춰드릴게요."
                  : "도구를 하나 이상 완료하면 전체화면을 시작할 수 있어요."}
              </p>
              {hasAny && (
                <button onClick={generateComprehensive} style={{
                  background: "none", border: "1px solid rgba(168,123,123,0.4)",
                  color: "#A87B7B", fontFamily: "'Source Serif 4',serif",
                  fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  padding: "0.65rem 1.5rem", cursor: "pointer",
                }}>전체화면 보기 →</button>
              )}
            </div>
          )}

          {loading && (
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(38,50,44,0.35)", animation: "breathe 2s ease-in-out infinite" }}>잠시 후, 당신의 답들은 나의 전체화면으로 모입니다...</p>
          )}

          {comprehensive && !loading && (
            <div style={{
              background: "#4A6358",
              padding: "2.5rem 2rem",
              marginBottom: "1rem",
            }}>
              {[
                { key: "겹쳤을 때 보이는 것" },
                { key: "그것이 당신에게 한 일" },
                { key: "지금 당신에게 남는 질문" },
              ].map(({ key }, i, arr) => {
                const content = parseSection(comprehensive, key);
                const isLast = i === arr.length - 1;
                return content ? (
                  <div key={key} style={{ marginBottom: isLast ? 0 : "2rem" }}>
                    <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(196,152,152,0.55)", marginBottom: "0.6rem" }}>{key}</div>
                    <div style={{ width: "100%", height: "1px", background: "rgba(196,152,152,0.15)", marginBottom: "1rem" }} />
                    <div style={{
                      fontFamily: isLast ? "'Playfair Display',serif" : "'Source Serif 4',serif",
                      fontStyle: isLast ? "italic" : "normal",
                      fontSize: isLast ? "0.95rem" : "0.9rem",
                      fontWeight: 300,
                      color: isLast ? "rgba(240,237,232,0.9)" : "rgba(240,237,232,0.72)",
                      lineHeight: 2, whiteSpace: "pre-wrap",
                    }}>{content}</div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* 엔딩 */}
        <div style={{ borderTop: "1px solid rgba(38,50,44,0.12)", paddingTop: "3rem", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 2, marginBottom: "1rem" }}>
            오늘 당신은 꽤 새로운 일을 해보았어요.<br />
            자신에게 일어난 사건과 남이 한 말이 아니라,<br />
            자신의 말로 자신을 바라본 거예요.<br />
            쉽지 않은 일이죠?
          </p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 2, marginBottom: "1rem" }}>
            그러니 여기까지 온 자신을 자랑스럽게 여기고,<br />
            잘했다 칭찬해주셔도 돼요.<br />
            인생에 꽤 드문 일을 해보신 거예요.
          </p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 2, marginBottom: "1rem" }}>
            언젠가 마음이 다시 흔들리는 날,<br />
            오늘 여기서 바라본 자신의 말을 다시 꺼내보세요.<br />
            그때의 나와 지금의 나가 달라져 있을 수도 있고,<br />
            놀랍도록 같을 수도 있어요.<br />
            어느 쪽이든, 그것도 당신을 이해하는 하나의 방식이에요.
          </p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 2, marginBottom: "2rem" }}>
            그때의 나는 오늘 쓴 글을 다르게 읽을지도 모릅니다.<br />
            같은 글을 다시 읽었는데 다르게 느껴지는 것처럼요.<br />
            나 자신을 다시 보면 다르게 보일 겁니다.
          </p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 2, marginBottom: "2.5rem" }}>
            오늘 결과를 가까운 사람에게 보여주세요.<br />
            오래 함께했는데도 몰랐던 것들이 보이기 시작할 거예요.<br />
            당신의 AI와 함께 더 깊이 이야기해보셔도 좋아요.
          </p>

          {/* 기록 파트 */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(38,50,44,0.5)", lineHeight: 1.9, marginBottom: "0.4rem" }}>오늘 여기서 어떤 순간이 가장 마음에 남았나요?</p>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(38,50,44,0.5)", lineHeight: 1.9, marginBottom: "1rem" }}>오늘 새롭게 발견한 나는 누구인가요?</p>
            {!todaySentence ? (
              <TodaySentenceWidget onSave={handleSaveSentence} />
            ) : (
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontStyle: "italic", color: "#A87B7B", lineHeight: 1.85 }}>"{todaySentence.sentence}"</p>
            )}
          </div>

          {/* 피드백 */}
          <div>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(38,50,44,0.4)", lineHeight: 1.9, marginBottom: "0.5rem" }}>
              당신이 남겨주신 피드백이 다른 이들을 더 선명하게 비출 마음거울이 되는 데 도움이 됩니다.
            </p>
            <a href="https://forms.gle/A6xXdAVUQoaNqaEWA" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: "#A87B7B", textDecoration: "underline", textUnderlineOffset: "3px" }}>피드백 남기기 →</a>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={copyAll} style={{
            background: "none", border: "1px solid rgba(168,123,123,0.4)",
            color: "#A87B7B", fontFamily: "'Source Serif 4',serif",
            fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "1.1rem 2.8rem", cursor: "pointer",
          }}>결과 복사</button>
        </div>

      </div>
    </div>
  );
}
