import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

const COMPREHENSIVE_PROMPT = `당신은 마음거울의 종합 분석가입니다.

당신의 역할은 네 가지 도구의 결과를 단순히 요약하거나 합치는 것이 아닙니다.
각 도구가 혼자서는 볼 수 없었던 것을, 네 개를 겹쳐봤을 때 비로소 드러나는 패턴을 발견하는 것입니다.

예를 들어:
- 퀵테스트에서 "혼자 처리한다"는 경향이 보이고
- 첫화면에서 "말하고 싶지만 때를 놓친다"가 반복되고  
- OS에서 "막힌 문제를 혼자 안고 간다"가 나왔다면
→ 네 개가 같은 구조를 다른 층위에서 가리키고 있는 것입니다. 그것을 짚어주세요.

교차 분석의 원칙:
- 한 도구에서만 보이는 것은 패턴이 아니다. 두 개 이상에서 반복될 때 의미가 있다.
- 도구마다 다른 각도에서 같은 것을 가리키고 있을 때, 그 교차점을 찾아라.
- 한 도구에서는 강점으로, 다른 도구에서는 비용으로 나타나는 역설을 포착하라.
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
네 도구가 각기 다른 방식으로 포착한 공통 패턴 한 가지.
"A 도구에서는 ~로, B 도구에서는 ~로 나타났습니다" 형식으로 교차를 보여줄 것.

## 반복되는 구조
행동, 감정, 사고 중 두 개 이상에서 반복되는 구조.
장점과 비용을 함께. 단정 없이.

## 네 결과가 함께 드러낸 것
각 도구를 따로 봤을 땐 보이지 않았는데, 겹쳐봤을 때 비로소 보이는 것.
긴장, 모순, 공백, 또는 아직 말해지지 않은 것.

## 오늘의 당신에게
지금 이 순간 가장 의미 있어 보이는 관찰 하나.
질문 형식으로 끝낼 것.

한국어로 작성하세요.`;

function SunriseCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 240, cy = 195, R = 260;
    let t = 0;

    function rayPoint(degFromTop, r) {
      const rad = degFromTop * Math.PI / 180;
      return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
    }

    function draw() {
      ctx.clearRect(0, 0, 480, 200);

      const op1 = Math.max(0, 0.12 + 0.2 * Math.sin(t));
      for (const deg of [-90, -75, -60, 90, 75, 60]) {
        const p = rayPoint(deg, R);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(201,168,76,${op1})`; ctx.lineWidth = 0.8; ctx.stroke();
      }

      const op2 = Math.max(0, 0.22 + 0.3 * Math.sin(t + 0.8));
      for (const deg of [-45, -30, 45, 30]) {
        const p = rayPoint(deg, R);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(201,168,76,${op2})`; ctx.lineWidth = 1; ctx.stroke();
      }

      const op3 = Math.max(0, 0.45 + 0.4 * Math.sin(t + 1.6));
      for (const deg of [-15, 0, 15]) {
        const p = rayPoint(deg, R);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(201,168,76,${op3})`; ctx.lineWidth = 1.3; ctx.stroke();
      }

      const opH = Math.max(0, 0.55 + 0.35 * Math.sin(t + 0.3));
      for (let deg = -90; deg <= 90; deg += 5) {
        if (Math.abs(deg) < 45) continue;
        const p = rayPoint(deg, R);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(201,168,76,${opH * 0.6})`;
        ctx.lineWidth = 0.6; ctx.stroke();
      }

      [150, 110, 75].forEach((r, i) => {
        const ops = [op1, op2, op3];
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI, 0, false);
        ctx.strokeStyle = `rgba(201,168,76,${ops[i] * 0.6})`;
        ctx.lineWidth = 0.6; ctx.stroke();
      });

      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(480, cy);
      ctx.strokeStyle = "rgba(240,237,232,0.6)"; ctx.lineWidth = 1.5; ctx.stroke();

      const glowOp = Math.max(0, 0.5 + 0.4 * Math.sin(t));
      ctx.beginPath(); ctx.arc(cx, cy, 58, Math.PI, 0, false);
      ctx.closePath(); ctx.fillStyle = `rgba(201,168,76,${glowOp * 0.12})`; ctx.fill();
      ctx.strokeStyle = `rgba(201,168,76,${glowOp})`; ctx.lineWidth = 1.8; ctx.stroke();

      ctx.beginPath(); ctx.arc(cx, cy, 36, Math.PI, 0, false);
      ctx.closePath(); ctx.fillStyle = `rgba(201,168,76,${glowOp * 0.25})`; ctx.fill();
      ctx.strokeStyle = `rgba(201,168,76,${glowOp})`; ctx.lineWidth = 1.3; ctx.stroke();

      ctx.beginPath(); ctx.arc(cx, cy, 14, Math.PI, 0, false);
      ctx.closePath(); ctx.fillStyle = `rgba(201,168,76,${0.7 + 0.25 * Math.sin(t)})`; ctx.fill();

      t += 0.02;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={200}
      style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
    />
  );
}

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

export default function Comprehensive({ onBack, onNext }) {
  const [comprehensive, setComprehensive] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

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

  async function generateComprehensive() {
    setLoading(true);
    if (quick) parts.push(`[첫 번째 검사 – 기본 성향]\n유형: ${quick.type}\n${quick.desc}\n${quick.de`
if (result1) parts.push(`[두 번째 검사 – 감정과 관계 패턴]\n${result1}`);
if (result2) parts.push(`[세 번째 검사 – 사고 구조]\n${result2}`);
if (oracleRaw) parts.push(`[네 번째 검사 – 가능성 탐색]\n${oracleRaw}`);

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
      setComprehensive("## 네 개의 거울이 본 것\n잠시 연결이 되지 않았어요. 다시 시도해주세요.");
    }
    setLoading(false);
  }

  const copyAll = () => {
    const parts = [];
    if (quick) parts.push(`[ 내 디폴트 값 ]\n유형: ${quick.type}\n${quick.desc}`);
    if (result1) parts.push(`[ 내 마음의 첫화면 ]\n${result1}`);
    if (result2) parts.push(`[ 내 마음의 OS ]\n${result2}`);
    if (oracleRaw) parts.push(`[ 내 마음의 새창열기 ]\n${oracleRaw}`);
    if (comprehensive) parts.push(`[ 종합 분석 ]\n${comprehensive}`);
    if (today) parts.push(`[ 오늘의 한 문장 ]\n"${today.sentence}"`);
    navigator.clipboard.writeText(parts.join("\n\n---\n\n"));
    alert("복사되었습니다.");
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

        {/* 해돋이 */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SunriseCanvas />
        </div>

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
          <p style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "0.93rem", fontWeight: 300,
            color: "rgba(247,242,232,0.6)", lineHeight: 1.9,
          }}>내 마음의 전체화면은 앞선 결과를 다시 요약하지 않습니다. 답들 사이에서 반복되는 흐름과, 유난히 다르게 빛나는 지점을 함께 봅니다. 나는 어디에서 익숙한 나로 돌아갔고, 어디에서 다른 가능성을 보였을까요? 이제 흩어져 있던 답들이 하나의 장면으로 모입니다.</p>
         </div>

        {/* 오늘의 한 문장 */}
        {today && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "0.62rem", letterSpacing: "0.25em",
              textTransform: "uppercase", color: "rgba(201,168,76,0.45)",
              marginBottom: "0.4rem",
            }}>오늘의 한 문장 · {today.date}</div>
            <div style={{ width: "100%", height: "1px", background: "rgba(201,168,76,0.2)", marginBottom: "1rem" }} />
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem", fontStyle: "italic",
              color: "#c9a84c", lineHeight: 1.85,
            }}>"{today.sentence}"</div>
          </div>
        )}

        {/* AI 교차 분석 */}
        <div style={{ marginBottom: "3rem" }}>
          {!comprehensive && !loading && (
            <div>
              <p style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.88rem", fontWeight: 300,
                color: "rgba(240,237,232,0.4)", lineHeight: 1.9,
                marginBottom: "1.25rem",
              }}>
                {hasAny
                  ? "지금까지의 답들은 모두 같은 방향을 가리키지 않을 수 있습니다. 반복된 길과 새로 열린 가능성을 함께 비춰드릴게요."
                  : "도구를 하나 이상 완료하면 전체화면을 시작할 수 있어요."}
              </p>
              {hasAny && (
                <button
                  onClick={generateComprehensive}
                  style={{
                    background: "none",
                    border: "1px solid rgba(201,168,76,0.4)",
                    color: "rgba(240,237,232,0.7)",
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.78rem", letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "0.65rem 1.5rem", cursor: "pointer",
                  }}
                >전체화면 보기 →</button>
              )}
            </div>
          )}

          {loading && (
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.95rem", fontStyle: "italic",
              color: "rgba(240,237,232,0.4)",
              animation: "breathe 2s ease-in-out infinite",
            }}>어긋난 답도 중요한 답입니다. 잠시 후, 당신의 답들이 나의 전체 화면으로 모입니다...</p>
          )}

          {comprehensive && !loading && (
            <div>
              {[
                { key: "네 개의 거울이 가리킨 곳", eyebrow: "네 개의 거울이 가리킨 곳" },
                { key: "반복되는 구조", eyebrow: "반복되는 구조" },
                { key: "네 결과가 함께 드러낸 것", eyebrow: "네 결과가 함께 드러낸 것" },
                { key: "오늘의 당신에게", eyebrow: "오늘의 당신에게" },
              ].map(({ key, eyebrow }) => {
                const content = parseSection(comprehensive, key);
                return content ? (
                  <div key={key} style={{ marginBottom: "1.75rem" }}>
                    <div style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.6rem", letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.35)",
                      marginBottom: "0.6rem",
                    }}>{eyebrow}</div>
                    <div style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.9rem", fontWeight: 300,
                      color: "rgba(240,237,232,0.65)",
                      lineHeight: 2, whiteSpace: "pre-wrap",
                    }}>{content}</div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          <button
            onClick={copyAll}
            style={{
              background: "none",
              border: "1px solid rgba(201,168,76,0.4)",
              color: "rgba(240,237,232,0.7)",
              fontFamily: "'Source Serif 4', serif",
              fontSize: "0.8rem", padding: "0.5rem 1.25rem", cursor: "pointer",
            }}
          >결과 복사</button>
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: "none",
                border: "1px solid rgba(240,237,232,0.3)",
                color: "rgba(240,237,232,0.6)",
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.8rem", padding: "0.5rem 1.25rem", cursor: "pointer",
              }}
            >다음 →</button>
          )}
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none",
              color: "rgba(240,237,232,0.3)",
              fontFamily: "'Source Serif 4', serif",
              fontSize: "0.8rem", cursor: "pointer",
            }}
          >← 돌아가기</button>
        </div>

        {/* 하단 */}
        <div style={{ textAlign: "center", paddingBottom: "2rem" }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.85rem", fontStyle: "italic",
            color: "#B89A5E", letterSpacing: "0.08em",
          }}>γνῶθι σεαυτόν · 너 자신을 알라</div>
        </div>

      </div>
    </div>
  );
}
