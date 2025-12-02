import React, { useRef, useState } from "react";
import "./BirthdayH5.css";
import { useBeep } from "./hooks";
import StepEnvelope from "./StepEnvelope";
import StepTimeline from "./StepTimeline";
import StepConfess from "./StepConfess";
import StepCake from "./StepCake";
import StepContract from "./StepContract";
import StepFinal from "./StepFinal";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export default function BirthdayH5() {
  const [step, setStep] = useState<Step>(0);
  const beep = useBeep();
  const bgRef = useRef<HTMLAudioElement | null>(null);

  const clampStep = (n: number): Step => Math.max(0, Math.min(n, 5)) as Step;
  const next = () => setStep((s) => clampStep(s + 1));
  const prev = () => setStep((s) => clampStep(s - 1));
  const playBg = () => {
    const el = bgRef.current;
    if (el) {
      el.volume = 0.3;
      el.play().catch(() => {});
    }
  };

  return (
    <div className="h5-root">
      <div className="card">
        {step === 0 && (
          <StepEnvelope
            onStart={() => {
              beep(520, 180, "triangle");
              playBg();
              next();
            }}
          />
        )}
        {step === 1 && (
          <StepTimeline
            onNext={() => {
              beep(760, 120, "sine");
              next();
            }}
            onPrev={prev}
          />
        )}
        {step === 2 && (
          <StepConfess
            onNext={() => {
              beep(880, 160, "square");
              next();
            }}
            onPrev={prev}
          />
        )}
        {step === 3 && (
          <StepCake
            onNext={() => {
              beep(440, 220, "sine");
              next();
            }}
            onPrev={prev}
          />
        )}
        {step === 4 && (
          <StepContract
            onNext={() => {
              beep(300, 200, "sawtooth");
              next();
            }}
            onPrev={prev}
          />
        )}
        {step === 5 && <StepFinal onRestart={() => setStep(0)} onPrev={prev} />}
      </div>
      <audio ref={bgRef} src="bg-music.mp3" loop preload="none" playsInline />
    </div>
  );
}
