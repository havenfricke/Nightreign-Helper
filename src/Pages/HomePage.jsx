import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

// Updated timeline with tasks
const timeline = [
  {
    label: "Exploration",
    time: 1,
    color: "green",
    tasks: ["Level 5", "4 Flasks", "Stonesword Key"]
  },
  {
    label: "30 second warning before start of close",
    time: 240,
    color: "yellow",
    tasks: ["Center Castle Bottom", "Locations of interest (Non-weakness damage type)"]
  },
  {
    label: "1st circle starts closing",
    time: 270,
    color: "red",
    tasks: ["Center Castle Bottom", "Locations of interest (Non-weakness damage type)"]
  },
  {
    label: "Exploration",
    time: 450,
    color: "green",
    tasks: ["Level 10", "4-5 Flasks", "Highest rune yield possible"]
  },
  {
    label: "30 second warning before start of close",
    time: 630,
    color: "yellow",
    tasks: ["Finish current activities", "Farm runes on outer edge of closing circle"]
  },
  {
    label: "2nd circle starts closing",
    time: 660,
    color: "red",
    tasks: ["Finish current activities", "Farm runes on outer edge of closing circle"]
  },
  {
    label: "Night Boss begins",
    time: 840,
    color: "pink",
    tasks: ["Win"]
  },
  {
    label: "Exploration",
    time: 841,
    color: "green",
    tasks: ["Level 14", "6-7 Flasks", "Locations of interest (Weakness damage type)"]
  },
  {
    label: "30 second warning before start of close",
    time: 1080,
    color: "yellow",
    tasks: ["No more than 3 major field bosses", "Center Castle Top", "Locations of interest (Weakness damage type)"]
  },
  {
    label: "1st circle starts closing",
    time: 1110,
    color: "red",
    tasks: ["No more than 3 major field bosses", "Center Castle Top", "Locations of interest (weakness damage type)"]
  },
  {
    label: "1st circle fully closed",
    time: 1290,
    color: "green",
    tasks: ["No more than 3 major field bosses", "Center Castle Top", "Locations of interest (Weakness damage type)"]
  },
  {
    label: "30 second warning before start of close",
    time: 1470,
    color: "yellow",
    tasks: ["Finish current activities", "Smithing Stones", "Locations of interest (Weakness damage type)"]
  },
  {
    label: "2nd circle starts closing",
    time: 1500,
    color: "red",
    tasks: ["Finish current activities", "Smithing Stones", "Farm runes on outer edge of closing circle"]
  },
  {
    label: "Night Boss begins",
    time: 1680,
    color: "pink",
    tasks: ["Win"]
  }
];

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function HomePage() {
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentColor, setCurrentColor] = useState("yellow");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [taskState, setTaskState] = useState({});

  const startTimestampRef = useRef(Date.now());

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - startTimestampRef.current) / 1000);

      // Pause at first Night Boss time
      if (delta >= 840 && elapsed < 840) {
        setElapsed(840);
        setIsPaused(true);
        return;
      }

      if (delta >= 1680) {
        setElapsed(1680);
        clearInterval(interval);
        return;
      }

      setElapsed(delta);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

 useEffect(() => {
  // Find the most recent event up to the current elapsed time
  const index = timeline
    .map((event, i) => ({ ...event, index: i }))
    .filter(event => event.time <= elapsed)
    .sort((a, b) => b.time - a.time)[0]?.index;

  if (index !== undefined && index !== currentEventIndex) {
    const event = timeline[index];
    setCurrentMessage(event.label);
    setCurrentColor(event.color);
    setCurrentEventIndex(index);

    const taskKeys = event.tasks?.map((_, i) => `${index}-${i}`);
    setTaskState((prevState) => {
      const updated = { ...prevState };
      taskKeys.forEach((key) => {
        if (!(key in updated)) updated[key] = false;
      });
      return updated;
    });
  }
}, [elapsed]);

  const handleTaskToggle = (key) => {
    setTaskState((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleResume = () => {
    startTimestampRef.current = Date.now() - elapsed * 1000; // sync to current elapsed
    setIsPaused(false);
  };

  const currentEvent = timeline[currentEventIndex] || timeline[0];
  const nextEvent = timeline[currentEventIndex + 1];
  const totalInterval = nextEvent ? nextEvent.time - currentEvent.time : 1;
  const elapsedInterval = elapsed - currentEvent.time;
  const progress = nextEvent ? Math.min((elapsedInterval / totalInterval) * 100, 100) : 100;

  return (
    <section className="home-page">
      <p id="time">{formatTime(elapsed)}</p>

      {currentEvent && (
        <p id="event-message" style={{ color: currentEvent.color }}>
          {currentEvent.label}
        </p>
      )}


      <progress
        value={progress}
        max="100"
        style={{
          width: "80%",
          height: "20px",
          marginTop: "1rem",
          appearance: "none"
        }}
      />

      {isPaused && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleResume} style={{ fontSize: "1.1rem", padding: "0.5rem 1rem" }}>
            Continue after Night Boss
          </button>
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        {currentEvent.tasks?.length > 0 && (
          <div>
            <ul>
              {currentEvent.tasks.map((task, i) => {
                const key = `${currentEventIndex}-${i}`;
                return (
                  <li key={key}>
                      {task}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default observer(HomePage);