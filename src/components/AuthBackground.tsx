'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { WarpBackground } from "./ui/warp-background";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";
import { useEffect, useState } from "react";

const AI_TAGLINES = [
  "Exploring AI Frontiers",
  "Machine Learning Insights",
  "Neural Networks Deep Dive",
  "AI Development Trends",
  "Future of Automation",
  "Cognitive Computing",
];

export function AuthBackground() {
  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % AI_TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
      <WarpBackground
        className="w-full h-screen flex items-center justify-center p-4"
        beamDelayMax={2}
        beamDuration={2.5}
      >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="bg-background/80 backdrop-blur-md border-border/20 shadow-lg overflow-hidden relative max-w-md w-full">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/30" />
          
          <CardContent className="flex flex-col gap-6 p-8 items-center text-center">
            <div className="flex flex-col items-center gap-4">
              <Rocket className="h-12 w-12 text-primary animate-pulse ml-6" />
              <div className="space-y-4">
                <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-neutral-500">
                  Bloai
                </CardTitle>
                <div className="h-12 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTagline}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg font-medium bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                    >
                      {AI_TAGLINES[currentTagline]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <CardDescription className="text-base text-muted-foreground/80">
                  Your gateway to AI technology breakthroughs and 
                  <span className="block mt-1 font-semibold text-primary">
                    developer ecosystem
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </WarpBackground>
  );
}