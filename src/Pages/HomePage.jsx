import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

const timeline = [
  { label: "Exploration", time: 1, color: "green" },
  { label: "30 second warning before start of close", time: 240, color: "yellow" },
  { label: "1st circle starts closing", time: 270, color: "red" },
  { label: "1st circle fully closed", time: 450, color: "green" },
  { label: "30 second warning before start of close", time: 630, color: "yellow" },
  { label: "2nd circle starts closing", time: 660, color: "red" },
  { label: "Night Boss begins", time: 840, color: "pink" }
];

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function HomePage() {
  const [elapsed, setElapsed] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentColor, setCurrentColor] = useState("yellow");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;

        // Check for timeline events
        timeline.forEach((event, index) => {
          if (Math.floor(event.time) === Math.floor(next)) {
            setCurrentMessage(event.label);
            setCurrentColor(event.color);
            setCurrentEventIndex(index);
            console.log(`${event.label} at ${formatTime(event.time)}`);
          }
        });

        if (next >= 840) {
          clearInterval(interval);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Determine progress
  const currentEvent = timeline[currentEventIndex] || timeline[0];
  const nextEvent = timeline[currentEventIndex + 1];
  let progress = 0;

  if (nextEvent) {
    const totalInterval = nextEvent.time - currentEvent.time;
    const elapsedInterval = elapsed - currentEvent.time;
    progress = Math.min((elapsedInterval / totalInterval) * 100, 100);
  } else {
    progress = 100;
  }

  return (
    <section className="home-page">
      <p id="time">{formatTime(elapsed)}</p>

      {currentMessage && (
        <p id="event-message" style={{ color: currentColor }}>
          {currentMessage}
        </p>
      )}

      <progress 
        value={progress} 
        max="100" 
        style={{
          width: "100%",
          height: "20px",
          marginTop: "1rem",
          appearance: "none"
        }} 
      />
    </section>
  );
}

export default observer(HomePage);
