import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './Stopwatch.css';

// Web Audio API Beep Generator (100% in-browser, no external MP3 dependencies)
const playChimeSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Play a friendly two-tone electronic chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.2); // A5
    gain2.gain.setValueAtTime(0.35, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.8);
  } catch {
    // AudioContext blocked by browser autoplay policy
  }
};

const Stopwatch = () => {
  const [mode, setMode] = useState('stopwatch'); // 'stopwatch' or 'timer'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Stopwatch State ---
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsed, setSwElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const swStartTimeRef = useRef(0);
  const swAccumulatedRef = useRef(0);
  const swAnimationRef = useRef(null);

  // --- Timer State ---
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTotalSecs, setTimerTotalSecs] = useState(300); // 5 mins default
  const [timerRemainingSecs, setTimerRemainingSecs] = useState(300);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const timerIntervalRef = useRef(null);

  // --- Stopwatch Engine (High accuracy with timestamp delta) ---
  const updateStopwatch = useCallback(() => {
    if (swRunning) {
      const now = performance.now();
      const current = swAccumulatedRef.current + (now - swStartTimeRef.current);
      setSwElapsed(current);
      swAnimationRef.current = requestAnimationFrame(updateStopwatch);
    }
  }, [swRunning]);

  useEffect(() => {
    if (swRunning) {
      swStartTimeRef.current = performance.now();
      swAnimationRef.current = requestAnimationFrame(updateStopwatch);
    } else {
      if (swAnimationRef.current) {
        cancelAnimationFrame(swAnimationRef.current);
      }
    }
    return () => {
      if (swAnimationRef.current) cancelAnimationFrame(swAnimationRef.current);
    };
  }, [swRunning, updateStopwatch]);

  const handleStartPauseStopwatch = () => {
    if (swRunning) {
      // Pause
      const now = performance.now();
      swAccumulatedRef.current += (now - swStartTimeRef.current);
      setSwElapsed(swAccumulatedRef.current);
      setSwRunning(false);
    } else {
      // Start/Resume
      swStartTimeRef.current = performance.now();
      setSwRunning(true);
    }
  };

  const handleResetStopwatch = () => {
    setSwRunning(false);
    swAccumulatedRef.current = 0;
    setSwElapsed(0);
    setLaps([]);
  };

  const handleRecordLap = () => {
    if (!swRunning && swElapsed === 0) return;
    const currentLapTime = laps.length === 0
      ? swElapsed
      : swElapsed - laps[0].overallTime;

    const newLap = {
      id: laps.length + 1,
      lapTime: currentLapTime,
      overallTime: swElapsed
    };
    setLaps([newLap, ...laps]);
  };

  // Identify fastest and slowest laps
  const fastestLapId = laps.length > 1
    ? [...laps].sort((a, b) => a.lapTime - b.lapTime)[0].id
    : null;
  const slowestLapId = laps.length > 1
    ? [...laps].sort((a, b) => b.lapTime - a.lapTime)[0].id
    : null;

  // --- Timer Engine ---
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemainingSecs((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            setTimerCompleted(true);
            playChimeSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning]);

  const handleStartPauseTimer = () => {
    if (timerRunning) {
      setTimerRunning(false);
    } else {
      if (timerRemainingSecs === 0) {
        // Reset to full before restarting
        setTimerRemainingSecs(timerTotalSecs);
      }
      setTimerCompleted(false);
      setTimerRunning(true);
    }
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerRemainingSecs(timerTotalSecs);
  };

  const applyCustomTimer = (h, m, s) => {
    const total = (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
    const validTotal = Math.max(1, total);
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerTotalSecs(validTotal);
    setTimerRemainingSecs(validTotal);
  };

  const handlePresetSelect = (seconds) => {
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerTotalSecs(seconds);
    setTimerRemainingSecs(seconds);
    setTimerHours(Math.floor(seconds / 3600));
    setTimerMinutes(Math.floor((seconds % 3600) / 60));
    setTimerSeconds(seconds % 60);
  };

  const handleAddMinute = () => {
    setTimerRemainingSecs(prev => prev + 60);
    setTimerTotalSecs(prev => prev + 60);
  };

  // --- Keyboard Shortcuts (Space, L, R) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (mode === 'stopwatch') handleStartPauseStopwatch();
        else handleStartPauseTimer();
      } else if (e.key === 'l' || e.key === 'L') {
        if (mode === 'stopwatch') handleRecordLap();
      } else if (e.key === 'r' || e.key === 'R') {
        if (mode === 'stopwatch') handleResetStopwatch();
        else handleResetTimer();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, swRunning, timerRunning, swElapsed, laps, isFullscreen]);

  // Lock body scroll in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('sw-fullscreen-open');
    } else {
      document.body.classList.remove('sw-fullscreen-open');
    }
    return () => {
      document.body.classList.remove('sw-fullscreen-open');
    };
  }, [isFullscreen]);

  // Format Helper: Milliseconds to HH:MM:SS.ms
  const formatTime = (ms) => {
    const totalCentis = Math.floor(ms / 10);
    const centis = totalCentis % 100;
    const totalSecs = Math.floor(ms / 1000);
    const secs = totalSecs % 60;
    const mins = Math.floor(totalSecs / 60) % 60;
    const hrs = Math.floor(totalSecs / 3600);

    const pad = (n, len = 2) => n.toString().padStart(len, '0');
    return {
      hrs: pad(hrs),
      mins: pad(mins),
      secs: pad(secs),
      centis: pad(centis)
    };
  };

  // Format Helper: Total seconds to HH:MM:SS
  const formatSeconds = (total) => {
    const secs = total % 60;
    const mins = Math.floor(total / 60) % 60;
    const hrs = Math.floor(total / 3600);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const swTime = formatTime(swElapsed);
  const timerProgress = timerTotalSecs > 0
    ? ((timerTotalSecs - timerRemainingSecs) / timerTotalSecs) * 100
    : 0;

  const faqs = [
    {
      question: "How accurate is this online stopwatch?",
      answer: "Extremely accurate. The stopwatch uses the browser's high-resolution Performance API (performance.now()), which calculates time intervals to within 5 microseconds (0.005 milliseconds). Even if your browser tab sleeps or is throttled in the background, timestamp delta calculations guarantee the elapsed time remains 100% synchronized."
    },
    {
      question: "Does the countdown timer play an alarm sound when time is up?",
      answer: "Yes! When the countdown timer hits 00:00:00, a pleasant two-tone electronic chime automatically plays using the browser's native Web Audio API, requiring zero downloads or external media files."
    },
    {
      question: "What keyboard shortcuts are available?",
      answer: "Press Space to Start or Pause the stopwatch/timer, press 'L' to record a split lap, press 'R' to reset, and press 'Escape' to exit Fullscreen Mode."
    },
    {
      question: "Can I use this timer for Pomodoro studying or gym workouts?",
      answer: "Yes! Use the 25-minute Pomodoro preset or custom interval presets, and click 'Fullscreen' to turn your computer or tablet into a giant, distraction-free countdown timer clock."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "Online Stopwatch & Countdown Timer - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/stopwatch",
      "description": "Free online stopwatch with lap recording and countdown timer with presets and audio alert. High precision, fullscreen mode, 100% browser-based.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All modern browsers",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://tools.trendbit.lol/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tools",
          "item": "https://tools.trendbit.lol/tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Online Stopwatch & Countdown Timer",
          "item": "https://tools.trendbit.lol/tools/stopwatch"
        }
      ]
    }
  ];

  return (
    <div className={`stopwatch-page ${isFullscreen ? 'page-in-fullscreen' : ''}`}>
      <SEOHead
        title="Online Stopwatch & Countdown Timer — Free Millisecond Precision & Lap Counter"
        description="Free online stopwatch with millisecond precision, split lap times, and countdown timer with audio chime alarm and fullscreen mode. 100% private in-browser tool."
        keywords="online stopwatch, stopwatch, free stopwatch, countdown timer, online timer, millisecond stopwatch, lap timer, pomodoro timer online, workout timer"
        canonicalUrl="/tools/stopwatch"
        structuredData={structuredData}
        faqData={faqs}
      />

      {!isFullscreen && (
        <div className="sw-header">
          <h1>Online Stopwatch & Countdown Timer</h1>
          <p className="sw-subtitle">
            Accurate millisecond stopwatch with split lap tracking, custom countdown timers with audio alerts, and fullscreen mode.
          </p>
        </div>
      )}

      {/* Main Workspace */}
      <div className={`sw-workspace ${isFullscreen ? 'fullscreen-active' : ''}`}>
        {/* Navigation & Mode Bar */}
        <div className="sw-mode-bar">
          <div className="sw-mode-tabs">
            <button
              className={`sw-tab-btn ${mode === 'stopwatch' ? 'active' : ''}`}
              onClick={() => setMode('stopwatch')}
            >
              ⏱️ Stopwatch
            </button>
            <button
              className={`sw-tab-btn ${mode === 'timer' ? 'active' : ''}`}
              onClick={() => setMode('timer')}
            >
              ⏳ Countdown Timer
            </button>
          </div>

          <button
            className={`sw-fullscreen-toggle ${isFullscreen ? 'active' : ''}`}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit Fullscreen' : '⛶ Fullscreen'}
          </button>
        </div>

        {/* Stopwatch Mode View */}
        {mode === 'stopwatch' ? (
          <div className="sw-stopwatch-container">
            {/* Giant Clock Face */}
            <div className="sw-clock-display">
              <span className="sw-time-unit">{swTime.hrs}</span>
              <span className="sw-colon">:</span>
              <span className="sw-time-unit">{swTime.mins}</span>
              <span className="sw-colon">:</span>
              <span className="sw-time-unit">{swTime.secs}</span>
              <span className="sw-ms-unit">.{swTime.centis}</span>
            </div>

            {/* Controls Bar */}
            <div className="sw-controls-row">
              <button
                className={`sw-action-btn ${swRunning ? 'btn-pause' : 'btn-start'}`}
                onClick={handleStartPauseStopwatch}
              >
                {swRunning ? '⏸ Pause' : '▶ Start'}
              </button>

              <button
                className="sw-action-btn btn-lap"
                onClick={handleRecordLap}
                disabled={!swRunning && swElapsed === 0}
              >
                🚩 Lap
              </button>

              <button
                className="sw-action-btn btn-reset"
                onClick={handleResetStopwatch}
                disabled={swRunning || swElapsed === 0}
              >
                🔄 Reset
              </button>
            </div>

            <div className="sw-keyboard-hint">
              <span>Hotkeys: <strong>Space</strong> (Start/Pause) • <strong>L</strong> (Lap) • <strong>R</strong> (Reset)</span>
            </div>

            {/* Laps Table */}
            {laps.length > 0 && (
              <div className="sw-laps-wrapper">
                <div className="sw-laps-header">
                  <h3>Recorded Laps ({laps.length})</h3>
                  <button
                    className="sw-copy-laps-btn"
                    onClick={() => {
                      const text = laps.map(l => {
                        const split = formatTime(l.lapTime);
                        const total = formatTime(l.overallTime);
                        return `Lap ${l.id}: ${split.mins}:${split.secs}.${split.centis} (Total: ${total.mins}:${total.secs}.${total.centis})`;
                      }).join('\n');
                      navigator.clipboard.writeText(text);
                      alert('Laps copied to clipboard!');
                    }}
                  >
                    📋 Copy Laps
                  </button>
                </div>

                <div className="sw-laps-table-container">
                  <table className="sw-laps-table">
                    <thead>
                      <tr>
                        <th>Lap</th>
                        <th>Split Time</th>
                        <th>Total Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laps.map((lap) => {
                        const split = formatTime(lap.lapTime);
                        const total = formatTime(lap.overallTime);
                        const isFastest = lap.id === fastestLapId;
                        const isSlowest = lap.id === slowestLapId;

                        return (
                          <tr
                            key={lap.id}
                            className={`${isFastest ? 'lap-fastest' : ''} ${isSlowest ? 'lap-slowest' : ''}`}
                          >
                            <td>
                              Lap {lap.id}
                              {isFastest && <span className="lap-tag tag-fast">Fastest</span>}
                              {isSlowest && <span className="lap-tag tag-slow">Slowest</span>}
                            </td>
                            <td>{split.mins}:{split.secs}.{split.centis}</td>
                            <td>{total.mins}:{total.secs}.{total.centis}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Countdown Timer Mode View */
          <div className="sw-timer-container">
            {/* Timer Display */}
            <div className={`sw-timer-display ${timerCompleted ? 'timer-alert' : ''}`}>
              {formatSeconds(timerRemainingSecs)}
            </div>

            {/* Progress Bar */}
            <div className="sw-progress-track">
              <div
                className="sw-progress-fill"
                style={{ width: `${timerProgress}%` }}
              />
            </div>

            {/* Timer Controls Bar */}
            <div className="sw-controls-row">
              <button
                className={`sw-action-btn ${timerRunning ? 'btn-pause' : 'btn-start'}`}
                onClick={handleStartPauseTimer}
              >
                {timerRunning ? '⏸ Pause' : '▶ Start'}
              </button>

              <button
                className="sw-action-btn btn-plus"
                onClick={handleAddMinute}
              >
                +1 Min
              </button>

              <button
                className="sw-action-btn btn-reset"
                onClick={handleResetTimer}
              >
                🔄 Reset
              </button>
            </div>

            {timerCompleted && (
              <div className="sw-timer-finished-banner">
                🔔 Time is up! Great job.
              </div>
            )}

            {/* Quick Timer Presets */}
            <div className="sw-presets-section">
              <span className="sw-presets-label">Quick Presets:</span>
              <div className="sw-presets-grid">
                <button className="sw-preset-btn" onClick={() => handlePresetSelect(60)}>1 Min</button>
                <button className="sw-preset-btn" onClick={() => handlePresetSelect(180)}>3 Mins</button>
                <button className="sw-preset-btn" onClick={() => handlePresetSelect(300)}>5 Mins</button>
                <button className="sw-preset-btn" onClick={() => handlePresetSelect(600)}>10 Mins</button>
                <button className="sw-preset-btn" onClick={() => handlePresetSelect(900)}>15 Mins</button>
                <button className="sw-preset-btn sw-preset-pomodoro" onClick={() => handlePresetSelect(1500)}>25 Min (Pomodoro)</button>
                <button className="sw-preset-btn" onClick={() => handlePresetSelect(1800)}>30 Mins</button>
                <button className="sw-preset-btn" onClick={() => handlePresetSelect(3600)}>1 Hour</button>
              </div>
            </div>

            {/* Custom Time Input Inputs */}
            <div className="sw-custom-inputs-card">
              <h4>Set Custom Duration:</h4>
              <div className="sw-inputs-row">
                <div className="sw-input-field">
                  <label htmlFor="sw-hours-input">Hours:</label>
                  <input
                    id="sw-hours-input"
                    type="number"
                    min="0"
                    max="99"
                    value={timerHours}
                    onChange={(e) => setTimerHours(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div className="sw-input-field">
                  <label htmlFor="sw-mins-input">Minutes:</label>
                  <input
                    id="sw-mins-input"
                    type="number"
                    min="0"
                    max="59"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div className="sw-input-field">
                  <label htmlFor="sw-secs-input">Seconds:</label>
                  <input
                    id="sw-secs-input"
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                <button
                  className="sw-set-time-btn"
                  onClick={() => applyCustomTimer(timerHours, timerMinutes, timerSeconds)}
                >
                  Set Duration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <>
          <AdBanner slot="stopwatch-bottom" format="horizontal" />

          {/* SEO & Educational Content */}
          <section className="tool-seo-content">
            <h2>About Our Free Online Stopwatch & Countdown Timer</h2>
            <p>
              The DevToolBox <strong>Online Stopwatch and Countdown Timer</strong> is an ultra-precise, client-side timekeeping utility 
              engineered for developers, speed-coders, students, athletes, and remote workers. Using high-resolution browser performance APIs, 
              it calculates intervals down to the millisecond with zero background lag or synchronization drift.
            </p>

            <h3>Why Use Our Browser Stopwatch?</h3>
            <ul>
              <li><strong>Millisecond Precision:</strong> Accurately tracks fractions of seconds for competitive events, coding sprints, and presentations.</li>
              <li><strong>Split Lap Recording:</strong> Record unlimited split laps with automatic identification of your fastest and slowest intervals.</li>
              <li><strong>Built-in Countdown Timer:</strong> Choose popular presets (including 25-minute Pomodoro intervals) or set custom hours, minutes, and seconds.</li>
              <li><strong>Native Synthesized Audio Alarm:</strong> Automatically plays a gentle two-tone chime when your countdown finishes, with zero audio file downloads.</li>
              <li><strong>Distraction-Free Fullscreen:</strong> Maximize the clock display to turn any monitor or tablet into a wall-sized timer.</li>
            </ul>

            <h3>Frequently Asked Questions</h3>
            <div className="sw-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: '700' }}>{faq.question}</h4>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>{faq.answer}</p>
                </div>
              ))}
            </div>

            <p style={{ marginTop: '1.5rem' }}>
              Explore our other productivity tools: Take notes in our <Link to="/tools/notepad">Online Notepad</Link>, 
              count characters with our <Link to="/tools/word-counter">Word Counter</Link>, or write documentation in our <Link to="/tools/markdown-previewer">Markdown Previewer</Link>.
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default Stopwatch;
