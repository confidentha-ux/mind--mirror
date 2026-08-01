import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
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
다섯 결과를 함께 보았을 때 반복해서 나타나는 가장 강한 판단 기준을 설명하라. 상황에 따라 달라진 반응이나 전체 흐름에서 벗어난 답이 있다면, 그것이 어떤 조건에서 나타났는지도 함께 보여줘라. 8-10문장.

## 그 기준이 당신의 판단에 미친 영향
반복된 판단 기준이 어떤 선택을 쉽게 만들었는지, 무엇을 빠르게 알아차리게 했는지 설명하라. 동시에 그 기준 때문에 뒤로 밀리거나 충분히 살피지 못했을 가능성이 있는 요소도 구체적으로 보여줘라. 6-8문장.

## 지금 남는 질문
앞선 분석을 바탕으로, 사용자가 자신의 판단 기준을 한 번 더 살펴볼 수 있는 질문 하나를 제시하라. 행동을 권하거나 답을 정해주지 마라. 2-3문장.

한국어로 작성하세요.`;

function parseSection(text, key) {
  if (!text) return "";
  const allKeys = [
    "겹쳤을 때 보이는 것", "그 기준이 당신의 판단에 미친 영향", "지금 남는 질문",
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

  const handleBlur = () => {
    if (text.trim()) onSave(text.trim());
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
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
        }}
      />
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

  // ── Situation 3 선택 변화 (프롤로그 최초 vs 섹션5 최종) ──
  const s3 = (() => {
    try {
      const pRaw = localStorage.getItem("mindmirror_prologue");
      const r5Raw = localStorage.getItem("mindmirror_revisit_section5");
      if (!pRaw || !r5Raw) return null;
      const p = JSON.parse(pRaw);
      const r5 = JSON.parse(r5Raw);
      const firstText = p?.[2];        // 프롤로그 S3 선택 (긴 문장)
      const finalText = r5?.answer;    // 섹션5 최종 선택 (짧은 문장)
      if (!firstText || !finalText) return null;

      // 인덱스로 매핑 (순서 일치: 0=자리이동, 1=전직, 2=유예)
      const firstIdx = firstText.includes("다른 자리") ? 0 : firstText.includes("전혀 다른") ? 1 : 2;
      const finalIdx = finalText.includes("다른 자리") ? 0 : finalText.includes("전혀 다른") ? 1 : 2;
      const labels = ["지금 있는 곳에서 다른 자리로", "전혀 다른 곳으로", "미루고 기다린다"];
      const shortLabels = ["자리이동", "새로운 도전", "유예"];

      // 9가지 조합별 해석 (판정 없이, 관찰 톤 — plain하게)
      const commentTable = [
        [
          "이번에도 자리이동을 골랐습니다. 처음 선택이 흔들리지 않았습니다.",
          "이번에는 새로운 도전을 골랐습니다. 처음과는 다른 답이었습니다.",
          "이번에는 유예를 골랐습니다. 자리이동에 대한 확신이 잠시 물러섰습니다.",
        ],
        [
          "이번에는 자리이동을 골랐습니다. 낯선 쪽 대신 익숙한 쪽을 택했습니다.",
          "이번에도 새로운 도전을 골랐습니다. 낯선 쪽을 향한 마음이 그대로였습니다.",
          "이번에는 유예를 골랐습니다. 뛰어들기 전에 한 번 더 보고 싶어졌습니다.",
        ],
        [
          "이번에는 자리이동을 골랐습니다. 기다리던 마음이 익숙한 쪽으로 움직였습니다.",
          "이번에는 새로운 도전을 골랐습니다. 기다리던 마음이 가장 낯선 쪽으로 움직였습니다.",
          "이번에도 유예를 골랐습니다. 서두르지 않는 마음이 그대로였습니다.",
        ],
      ];

      return {
        changed: firstIdx !== finalIdx,
        firstLabel: labels[firstIdx],
        finalLabel: labels[finalIdx],
        firstShort: shortLabels[firstIdx],
        finalShort: shortLabels[finalIdx],
        comment: commentTable[firstIdx][finalIdx],
        reason: r5?.reason || null,
      };
    } catch (e) { return null; }
  })();

  const hasAny = !!(quick || result1 || result2 || oracleRaw);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (today) setTodaySentence(today);
  }, []);

  // 화면 진입 시 자동으로 분석 생성 (버튼 없이)
  useEffect(() => {
    if (hasAny && !comprehensive && !loading) {
      generateComprehensive();
    }
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

  // 분석 생성 중에는 다른 섹션과 동일하게 풀스크린 로딩화면 (짙은 초록)
  if (loading) return <LoadingScreen section={5} isComprehensive={true} />;

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
          }}>반복된 흐름과 달라진 지점이 함께 보일 때</h1>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9, marginBottom: "0.75rem" }}>다섯 개의 거울은 서로 다른 상황에서 당신이 무엇을 먼저 살피고, 무엇을 중요하게 여기며, 무엇을 지키려 했는지를 비추었습니다.</p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9, marginBottom: "0.75rem" }}>여러 답을 한곳에 놓으면 상황이 달라져도 반복해서 나타난 판단의 기준이 보입니다. 평소와 다른 기준이 작동한 순간도 함께 드러납니다.</p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9 }}>나는 어떤 상황에서 익숙한 기준으로 판단했고, 어디에서 평소와 다른 가능성을 살펴보았을까요?</p>
        </div>

        {/* 오늘의 한 문장 (기존 저장된 것) */}
        {todaySentence && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(168,123,123,0.5)", marginBottom: "0.4rem" }}>오늘의 기록 · {todaySentence.date}</div>
            <div style={{ width: "100%", height: "1px", background: "rgba(168,123,123,0.2)", marginBottom: "1rem" }} />
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontStyle: "italic", color: "#A87B7B", lineHeight: 1.85 }}>"{todaySentence.sentence}"</div>
          </div>
        )}

        {/* AI 교차 분석 (자동 생성) */}
        <div style={{ marginBottom: "3rem" }}>
          {!comprehensive && !loading && !hasAny && (
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(38,50,44,0.45)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              도구를 하나 이상 완료하면 전체화면을 시작할 수 있어요.
            </p>
          )}

          {comprehensive && !loading && (
            <div style={{
              background: "#4A6358",
              padding: "2.5rem 2rem",
              marginBottom: "1rem",
            }}>
              {[
                { key: "겹쳤을 때 보이는 것" },
                { key: "그 기준이 당신의 판단에 미친 영향" },
                { key: "지금 남는 질문" },
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

          {/* Situation 3 선택 변화 블록 — 분석이 나온 뒤에만 */}
          {comprehensive && !loading && s3 && (
            <div style={{ marginTop: "2.5rem", padding: "2rem", border: "1px solid rgba(168,123,123,0.3)", background: "rgba(168,123,123,0.04)" }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#A87B7B", marginBottom: "1.25rem" }}>당신의 선택</div>

              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9, marginBottom: "1.75rem" }}>
                처음 세 가지 상황을 만났을 때, 당신은 그 순간 가장 자연스럽게 느껴지는 선택을 했습니다.
                다섯 개의 거울을 지나며 자신의 감정, 우선순위, 반복되는 반응, 기억의 영향, 관점을 바꾸었을 때 보이는 가능성을 살펴보았습니다.
                그 뒤 같은 상황에서 여러 조건을 다시 확인하고, 한 번 더 선택했습니다.
              </p>

              <div style={{ marginBottom: "0.9rem" }}>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(38,50,44,0.4)", marginRight: "0.75rem" }}>처음</span>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem", fontWeight: 300, color: "rgba(38,50,44,0.8)" }}>{s3.firstLabel}</span>
              </div>
              <div style={{ marginBottom: "1.75rem" }}>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(38,50,44,0.4)", marginRight: "0.75rem" }}>다시 선택한 것</span>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem", fontWeight: 300, color: "rgba(38,50,44,0.8)" }}>{s3.finalLabel}</span>
              </div>

              <div style={{ width: "100%", height: "1px", background: "rgba(168,123,123,0.15)", marginBottom: "1.25rem" }} />

              {s3.reason ? (
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(38,50,44,0.4)", marginBottom: "0.5rem" }}>이번 판단에서 중요하게 본 기준</div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1rem", color: "#8A6363", lineHeight: 1.8 }}>"{s3.reason}"</p>
                </div>
              ) : (
                <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1rem", color: "#8A6363", lineHeight: 1.8, marginBottom: "1.75rem" }}>
                  {s3.comment}
                </p>
              )}

              <div style={{ width: "100%", height: "1px", background: "rgba(168,123,123,0.15)", marginBottom: "1.75rem" }} />

              {s3.changed ? (
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9, marginBottom: "1.75rem" }}>
                  당신은 처음과 다른 선택을 했습니다.
                  선택이 바뀌었다는 사실보다 중요한 것은, 선택할 때 중요하게 본 기준이 달라졌다는 점입니다.<br /><br />
                  처음에는 한 가지 조건이 더 크게 보였지만, 다섯 개의 거울을 지난 뒤에는 이전에 충분히 살피지 않았던 조건도 함께 고려하게 되었습니다.
                  무엇을 얻을 수 있는지만이 아니라 무엇을 감수해야 하는지, 무엇을 지키고 싶은지, 지금의 자신에게 어떤 조건이 더 중요한지도 확인했습니다.<br /><br />
                  이번 선택은 처음의 판단이 잘못되었다는 뜻이 아닙니다. 처음에는 그때 보이던 기준으로 판단했고, 지금은 더 넓어진 조건 안에서 다시 판단한 것입니다.
                  {s3.reason && <><br /><br />당신이 직접 적은 문장은 무엇이 달라졌기 때문에 선택도 달라졌는지를 보여줍니다.</>}
                </p>
              ) : (
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "rgba(38,50,44,0.65)", lineHeight: 1.9, marginBottom: "1.75rem" }}>
                  당신은 처음과 같은 선택을 했습니다.
                  하지만 같은 선택이 같은 이유만을 의미하지는 않을 것입니다.<br /><br />
                  처음에는 익숙함, 기대, 불안, 보상처럼 가장 먼저 눈에 들어온 조건이 선택을 이끌었을 수 있습니다.
                  다시 선택할 때는 그 선택이 가져올 가능성과 부담, 포기해야 할 것과 지키고 싶은 것까지 함께 확인했습니다.<br /><br />
                  그 모든 조건을 살펴본 뒤에도 같은 선택을 했다면, 이번 선택은 단순히 처음의 반응을 반복한 것과는 다릅니다.
                  자신이 무엇을 중요하게 여기며, 어떤 부담을 감수할 수 있고, 무엇은 포기하고 싶지 않은지를 확인한 뒤 다시 선택한 것입니다.
                  {s3.reason && <><br /><br />당신이 직접 적은 문장은 왜 이 선택이 여전히 자신에게 중요한지를 보여줍니다.</>}
                </p>
              )}

              <div style={{ width: "100%", height: "1px", background: "rgba(168,123,123,0.15)", marginBottom: "1.75rem" }} />

              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "rgba(38,50,44,0.4)", marginBottom: "1rem" }}>판단의 기준을 안다는 것</div>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "rgba(38,50,44,0.6)", lineHeight: 1.9 }}>
                판단의 기준을 확인한다고 해서 언제나 선택이 달라지는 것은 아닙니다.
                달라질 수도 있고, 그대로일 수도 있습니다. 중요한 것은 선택의 변화 자체가 아니라, 자신이 무엇을 보고 그 판단에 이르렀는지를 아는 것입니다.<br /><br />
                판단의 기준을 알고 내린 선택은 순간적인 감정이나 익숙한 반응만으로 내린 선택보다 더 분명하게 자신의 것이 됩니다.
                선택한 뒤에도 왜 그런 결정을 했는지 돌아볼 수 있고, 새로운 사실을 알게 되었을 때 무엇을 다시 검토해야 하는지도 알 수 있습니다.<br /><br />
                이 과정은 같은 상황에서 같은 후회를 반복하거나, 자신의 판단을 이유 없이 부정하는 일을 줄이는 데 도움이 됩니다.
                판단이 달라졌을 때도 과거의 자신을 틀린 사람으로 몰아가지 않고, 당시에는 어떤 기준으로 보았으며 지금은 무엇이 달라졌는지를 구분할 수 있게 합니다.
                {s3.reason && <><br /><br />오늘 당신이 남긴 문장은 정답이 아니라, 지금의 당신이 확인한 판단 기준의 기록입니다.</>}
              </p>
            </div>
          )}
        </div>

        {/* 엔딩 */}
        <div style={{ borderTop: "1px solid rgba(38,50,44,0.12)", paddingTop: "3rem", marginBottom: "3rem" }}>

          {/* 기록 파트 */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(38,50,44,0.5)", lineHeight: 1.9, marginBottom: "0.4rem" }}>오늘 가장 마음에 남은 순간은 무엇이었나요?</p>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(38,50,44,0.5)", lineHeight: 1.9, marginBottom: "1rem" }}>오늘 확인한 나의 판단 기준 가운데, 앞으로도 기억하고 싶은 것은 무엇인가요?</p>
            {!todaySentence ? (
              <TodaySentenceWidget onSave={handleSaveSentence} />
            ) : (
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontStyle: "italic", color: "#A87B7B", lineHeight: 1.85 }}>"{todaySentence.sentence}"</p>
            )}
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(38,50,44,0.4)", lineHeight: 1.9, marginTop: "1rem" }}>
              오늘의 기록은 나중에 같은 선택 앞에 섰을 때 다시 꺼내볼 수 있습니다.
              그때 판단이 달라졌다면 무엇이 달라졌는지, 판단이 같다면 어떤 기준이 여전히 중요하게 남아 있는지를 비교해볼 수 있습니다.
            </p>
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
