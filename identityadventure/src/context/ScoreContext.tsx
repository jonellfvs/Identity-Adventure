import { createContext, useContext } from "react";
import { useMBTIScore } from "../hooks/useScore";

const MBTIContext = createContext<ReturnType<typeof useMBTIScore> | null>(null);

export function MBTIProvider({ children }: { children: React.ReactNode }) {
  const mbti = useMBTIScore(); // ONE shared instance

  return (
    <MBTIContext.Provider value={mbti}>
      {children}
    </MBTIContext.Provider>
  );
}

export function useMBTI() {
  const context = useContext(MBTIContext);
  if (!context) throw new Error("useMBTI must be used inside MBTIProvider");
  return context;
}