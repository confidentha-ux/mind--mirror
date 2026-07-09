import { useEffect, useState } from "react";

const SECTION_MESSAGES = {
  1: {
    fact: "첫 번째 문을 열었어요.",
    meaning: "내가 먼저 향하는 방향을\n한 번 봤어요.",
    loading: "결과를 불러오는 중이에요."
  },
  2: {
    fact: "두 번째 방까지 왔어요.",
    meaning: "내 안에서 자주 켜지는 감정을\n조금 가까이 봤어요.",
    loading: "결과를 불러오는 중이에요."
  },
  3: {
    fact: "세 번째 거울 앞에 섰어요.",
    meaning: "내가 어떻게 생각하는지,\n그 구조를 한 번 봤어요.",
    loading: "결과를 불러오는 중이에요."
  },
  4: {
    fact: "네 번째 기억을 열었어요.",
    meaning: "꺼내기 쉽지 않은 것을\n꺼내봤어요.",
    loading: "결과를 불러오는 중이에요."
  },
  5: {
    fact: "다섯 번째 창까지 왔어요.",
    meaning: "같은 기억을 다른 눈으로\n한 번 봤어요.",
    loading: "결과를 불러오는 중이에요."
  }
};

const Ripple = ({ delay, size }) => (
  <div style={{
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    border: "1px solid rgba(201,168,76,0.45)",
    animation: `raindrop 2.4s ease-out ${delay}s infinite`,
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%) scale(0)",
    pointerEvents: "none",
  }} />
);

// section: 1~5 (현재 완료된 섹션 번호)
// isComprehensive: true면 5개 원 모두 채워진 상태
export default function LoadingScreen({ section = 1, isComprehensive = false }) {
  const [visible, setVisible] = useState([false, false, false]);
  const msg = SECTION_MESSAGES[section] || SECTION_MESSAGES[1];

  useEffect(() => {
    setVisible([false, false, false]);
    const t1 = setTimeout(() => setVisible([true, false, false]), 700);
    const t2 = setTimeout(() => setVisible([true, true, false]), 1600);
    const t3 = setTimeout(() => setVisible([true, true, true]), 2500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [section]);

  const filledCount = isComprehensive ? 5 : section;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#26322C",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "48px",
      padding: "40px 24px",
      fontFamily: "'Noto Serif KR', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&display=swap');
        @keyframes raindrop {
          0%   { transform: translate(-50%, -50%) scale(0.05); opacity: 0.8; }
          60%  { opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        @keyframes drop {
          0%   { transform: translate(-50%, -80%) scale(0.8); opacity: 0; }
          15%  { opacity: 0.6; }
          42%  { transform: translate(-50%, -50%) scale(1); opacity: 0.65; }
          58%  { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPop {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.35); }
        }
      `}</style>

      {/* 빗방울 + 동심원 */}
      <div style={{ position: "relative", width: "120px", height: "120px" }}>
        <Ripple delay={0.9} size={80} />
        <Ripple delay={1.5} size={100} />
        <Ripple delay={2.1} size={120} />
        <Ripple delay={2.7} size={140} />
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: "5px", height: "9px",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          backgroundColor: "rgba(201,168,76,0.6)",
          animation: "drop 2.4s ease-in infinite",
          zIndex: 2,
        }} />
      </div>

      {/* 텍스트 */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        textAlign: "center",
        maxWidth: "280px",
      }}>
        {visible[0] && (
          <p style={{
            fontSize: "17px",
            color: "rgba(247,242,232,0.9)",
            lineHeight: "1.8",
            margin: 0,
            fontWeight: "500",
            whiteSpace: "pre-line",
            animation: "fadeUp 0.7s ease-out both",
          }}>{msg.fact}</p>
        )}
        {visible[1] && (
          <p style={{
            fontSize: "14px",
            color: "rgba(247,242,232,0.55)",
            lineHeight: "1.85",
            margin: 0,
            whiteSpace: "pre-line",
            animation: "fadeUp 0.7s ease-out both",
          }}>{msg.meaning}</p>
        )}
        {visible[2] && (
          <p style={{
            fontSize: "12px",
            color: "rgba(201,168,76,0.45)",
            lineHeight: "1.6",
            margin: 0,
            animation: "fadeUp 0.7s ease-out both",
          }}>{msg.loading}</p>
        )}
      </div>

      {/* 섹션 진행 원 */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            width: "10px", height: "10px", borderRadius: "50%",
            backgroundColor: i <= filledCount ? "#C9A84C" : "transparent",
            border: `2px solid ${i <= filledCount ? "#C9A84C" : "rgba(201,168,76,0.2)"}`,
            transition: "all 0.4s ease",
            animation: i === section && !isComprehensive ? "dotPop 1.2s ease-in-out infinite" : "none",
          }} />
        ))}
      </div>
    </div>
  );
}
