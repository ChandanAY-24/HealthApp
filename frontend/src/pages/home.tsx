import React, { useState, useEffect, useMemo } from 'react';
import { store } from '../store';
import { useActions } from '../actions';
import {
  Heart,
  Activity,
  Moon,
  Plus,
  Check,
  Calendar,
  Download,
  ArrowRight,
  FlaskConical,
  Footprints,
  Thermometer,
} from '../ui/icons';
import { HighLowBarChart, LivePulseLine, Sparkline } from '../ui/charts';
import { navigateTo } from '../router';

type MetricTab = 'heart' | 'oxygen' | 'bp' | 'temp';
type TimeRange = '7d' | '14d' | '30d';

export const HomePage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const { notify } = useActions();

  // Active Metric & Range inside Hero Card
  const [activeMetric, setActiveMetric] = useState<MetricTab>('heart');
  const [timeRange, setTimeRange] = useState<TimeRange>('14d');

  // Breathing Box State
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Ready' | 'Inhale' | 'Hold' | 'Exhale'>('Ready');
  const [breathCount, setBreathCount] = useState(4);

  // Live Pulse oscillation
  const [liveBpm, setLiveBpm] = useState(72);

  // Water Hydration count (local override + sync)
  const [waterGlasses, setWaterGlasses] = useState(5);

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  // Subtle live pulse fluctuation (70-74 bpm)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveBpm((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 69 && next <= 75 ? next : 72;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Breathing Box cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s)
  useEffect(() => {
    if (!breathActive) {
      setBreathPhase('Ready');
      setBreathCount(4);
      return;
    }

    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev > 1) return prev - 1;
        setBreathPhase((curr) => {
          if (curr === 'Inhale') return 'Hold';
          if (curr === 'Hold') return 'Exhale';
          return 'Inhale';
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathActive]);

  const toggleBreath = () => {
    if (!breathActive) {
      setBreathActive(true);
      setBreathPhase('Inhale');
      setBreathCount(4);
    } else {
      setBreathActive(false);
      setBreathPhase('Ready');
      notify('Mindful breathing session paused');
    }
  };

  // Vitals data calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const hrReadings = useMemo(
    () => state.vitals.filter((v) => v.type === 'heart_rate'),
    [state.vitals]
  );
  const oxReadings = useMemo(
    () => state.vitals.filter((v) => v.type === 'oxygen'),
    [state.vitals]
  );
  const bpReadings = useMemo(
    () => state.vitals.filter((v) => v.type === 'blood_pressure'),
    [state.vitals]
  );
  const tempReadings = useMemo(
    () => state.vitals.filter((v) => v.type === 'temperature'),
    [state.vitals]
  );

  const daysCount = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;

  const currentReadings = useMemo(() => {
    switch (activeMetric) {
      case 'heart':
        return hrReadings.slice(0, daysCount);
      case 'oxygen':
        return oxReadings.slice(0, daysCount);
      case 'bp':
        return bpReadings.slice(0, daysCount);
      case 'temp':
        return tempReadings.slice(0, daysCount);
    }
  }, [activeMetric, daysCount, hrReadings, oxReadings, bpReadings, tempReadings]);

  const unit =
    activeMetric === 'heart'
      ? 'bpm'
      : activeMetric === 'oxygen'
      ? '%'
      : activeMetric === 'bp'
      ? 'mmHg'
      : '°C';

  const metricLabel =
    activeMetric === 'heart'
      ? 'Heart rate'
      : activeMetric === 'oxygen'
      ? 'Blood oxygen'
      : activeMetric === 'bp'
      ? 'Blood pressure'
      : 'Body temperature';

  const avgVal =
    currentReadings.length > 0
      ? Math.round(
          currentReadings.reduce((acc, r) => acc + (r.avg || (r.systolic || 0)), 0) /
            currentReadings.length
        )
      : 72;

  const latestReading = currentReadings[0];
  const recentVal = latestReading
    ? latestReading.avg || (latestReading.systolic ? `${latestReading.systolic}/${latestReading.diastolic}` : 72)
    : 72;

  // Sparkline history arrays
  const hrSpark = useMemo(
    () => hrReadings.slice(0, 14).map((r) => r.avg || 72).reverse(),
    [hrReadings]
  );
  const oxSpark = useMemo(
    () => oxReadings.slice(0, 14).map((r) => r.avg || 98).reverse(),
    [oxReadings]
  );

  // Key KPI values
  const latestHr = hrReadings[0]?.avg || 72;
  const latestSpO2 = oxReadings[0]?.avg || 98;
  const stepsToday = state.activity[0]?.steps || 9420;
  const stepsGoal = 10000;
  const stepsRatio = Math.min(1, stepsToday / stepsGoal);

  const latestSleep = state.sleep[0];
  const sleepHrs = latestSleep ? Math.floor(latestSleep.totalDurationMinutes / 60) : 7;
  const sleepMins = latestSleep ? latestSleep.totalDurationMinutes % 60 : 45;
  const sleepScore = latestSleep?.score || 88;

  // Meds & Appointments
  const todayMeds = state.medications;
  const takenMedsCount = todayMeds.filter((m) => !!m.history[todayStr]).length;

  const toggleMedication = (id: string, name: string) => {
    store.toggleMedicationDose(id, todayStr);
    notify(`${name} dose updated`);
  };

  // Workouts
  const recentWorkouts = state.workouts.slice(0, 4);
  const totalWorkoutMins = recentWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);

  // Lab Results
  const recentLabs = state.labResults.slice(0, 4);

  // Greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const ringScale =
    breathPhase === 'Inhale'
      ? 'scale(1.18)'
      : breathPhase === 'Hold'
      ? 'scale(1.18)'
      : breathPhase === 'Exhale'
      ? 'scale(0.74)'
      : 'scale(0.85)';

  return (
    <div className="page home">
      {/* Page Header with Greeting & Action Buttons */}
      <div className="home__header">
        <div className="home__greeting">
          <span className="home__eyebrow">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <h1>
            {greeting}, {state.profile.name.split(' ')[0]}
          </h1>
          <p>
            Resting heart rate is <b>2 bpm lower</b> than last week. {takenMedsCount} of{' '}
            {todayMeds.length} medicines taken today.
          </p>
        </div>
        <div className="home__actions">
          <button
            type="button"
            className="btn"
            onClick={() => navigateTo('reports')}
          >
            <Download size={15} />
            <span>Share a report</span>
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => notify('Health entry logged')}
          >
            <Plus size={15} />
            <span>Log</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Tiles Bar (Authentic Lime Tile 1) */}
      <section className="tiles" aria-label="Today">
        {/* Tile 1: Resting Heart Rate (Authentic Lime Color) */}
        <a
          className="tile tile--lime"
          href="#vitals"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('vitals');
          }}
        >
          <span className="tile__label">
            <Heart size={16} />
            Resting heart
          </span>
          <span className="tile__value">
            {latestHr} <small>bpm</small>
          </span>
          <span className="tile__foot">
            <span className="delta delta--up">-2%</span>
            <span>vs last week</span>
            <Sparkline values={hrSpark} className="spark" />
          </span>
        </a>

        {/* Tile 2: Blood Oxygen */}
        <a
          className="tile"
          href="#vitals"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('vitals');
          }}
        >
          <span className="tile__label">
            <Activity size={16} />
            Blood oxygen
          </span>
          <span className="tile__value">
            {latestSpO2} <small>%</small>
          </span>
          <span className="tile__foot">
            <span className="delta delta--up">+0.5%</span>
            <span>In the healthy range</span>
            <Sparkline values={oxSpark} className="spark" />
          </span>
        </a>

        {/* Tile 3: Steps Today */}
        <a
          className="tile"
          href="#activity"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('activity');
          }}
        >
          <span className="tile__label">
            <Footprints size={16} />
            Steps today
          </span>
          <span className="tile__value">
            {stepsToday.toLocaleString()} <small>of {stepsGoal.toLocaleString()}</small>
          </span>
          <span className="tile__foot tile__foot--bar">
            <span className="tbar">
              <i style={{ width: `${Math.round(stepsRatio * 100)}%` }} />
            </span>
            <span>{Math.round(stepsRatio * 100)}%</span>
          </span>
        </a>

        {/* Tile 4: Last Night Sleep */}
        <a
          className="tile"
          href="#sleep"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('sleep');
          }}
        >
          <span className="tile__label">
            <Moon size={16} />
            Last night
          </span>
          <span className="tile__value">
            {sleepHrs}h {sleepMins}m
          </span>
          <span className="tile__foot tile__foot--bar">
            <span
              className="stack"
              role="img"
              aria-label="Deep 1h 45m, light 4h 10m, REM 1h 20m, awake 30m"
            >
              <i className="s0" style={{ flex: 1.75 }} />
              <i className="s1" style={{ flex: 4.16 }} />
              <i className="s2" style={{ flex: 1.33 }} />
              <i className="s3" style={{ flex: 0.5 }} />
            </span>
            <span>{sleepScore} score</span>
          </span>
        </a>
      </section>

      {/* 12-Column Grid Layout */}
      <div className="home__grid">
        {/* ==================================================================
            ROW 1: Hero Card (span 8) + Live Pulse (span 4)
            ================================================================== */}
        {/* Hero Card: Vitals History Chart */}
        <section className="card hero-card" aria-labelledby="hero-h">
          <div className="chead">
            <span className="chead__ico is-lime">
              {activeMetric === 'heart' ? (
                <Heart size={18} />
              ) : activeMetric === 'oxygen' ? (
                <Activity size={18} />
              ) : activeMetric === 'bp' ? (
                <Heart size={18} />
              ) : (
                <Thermometer size={18} />
              )}
            </span>
            <div className="chead__text">
              <h2 id="hero-h">Vitals</h2>
              <p>
                {metricLabel}, last {daysCount} days
              </p>
            </div>
            <div className="range-pills" style={{ display: 'flex', gap: '4px' }}>
              {(['7d', '14d', '30d'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`chip ${timeRange === r ? 'chip--active' : ''}`}
                  onClick={() => setTimeRange(r)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 'var(--fs-xs)',
                    borderRadius: '99px',
                    fontWeight: 600,
                    background: timeRange === r ? 'var(--lime)' : 'var(--card-alt)',
                    color: timeRange === r ? 'var(--on-lime)' : 'var(--ink-2)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-card__sum">
            <div>
              <small>Average</small>
              <b>
                {avgVal}
                <em>{unit}</em>
              </b>
            </div>
            <div>
              <small>Latest</small>
              <b>
                {recentVal}
                <em>{unit}</em>
              </b>
            </div>
            <div className="hero-card__delta">
              <span className="delta delta--up">-3%</span>
              <small>vs the {daysCount} days before</small>
            </div>
          </div>

          <HighLowBarChart
            readings={currentReadings}
            unit={unit}
            metricLabel={metricLabel}
          />

          <div className="mtabs" role="group" aria-label="Metric">
            <button
              type="button"
              aria-pressed={activeMetric === 'heart'}
              onClick={() => setActiveMetric('heart')}
            >
              <Heart size={15} />
              Heart
            </button>
            <button
              type="button"
              aria-pressed={activeMetric === 'oxygen'}
              onClick={() => setActiveMetric('oxygen')}
            >
              <Activity size={15} />
              Oxygen
            </button>
            <button
              type="button"
              aria-pressed={activeMetric === 'bp'}
              onClick={() => setActiveMetric('bp')}
            >
              <Heart size={15} />
              Pressure
            </button>
            <button
              type="button"
              aria-pressed={activeMetric === 'temp'}
              onClick={() => setActiveMetric('temp')}
            >
              <Thermometer size={15} />
              Temp
            </button>
            <a
              className="mtabs__more"
              href="#vitals"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('vitals');
              }}
            >
              All vitals
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* Live Pulse Stream Card (Span 4, Deep Background) */}
        <section className="card pulse" aria-labelledby="pulse-h">
          <div className="chead">
            <span className="chead__ico pulse__live">
              <i />
            </span>
            <div className="chead__text">
              <h2 id="pulse-h" style={{ color: '#fff' }}>
                Live pulse stream
              </h2>
              <p>Optical sensor · Bluetooth LE</p>
            </div>
          </div>

          <div className="pulse__fig">
            <b>{liveBpm}</b>
            <span>
              BPM
              <small>Real-time</small>
            </span>
          </div>

          <div className="pulse__trace">
            <LivePulseLine bpm={liveBpm} />
          </div>

          <div className="pulse__stats">
            <div>
              <small>Resting</small>
              <b>{latestHr}</b>
              <em>bpm</em>
            </div>
            <div>
              <small>Variability</small>
              <b>48</b>
              <em>ms</em>
            </div>
            <div>
              <small>Target</small>
              <b>60-100</b>
            </div>
          </div>
        </section>

        {/* ==================================================================
            ROW 2: Doses (span 4) + Breathe (span 4) + Stack [Water + Next] (span 4)
            ================================================================== */}
        {/* Today's Medicines Card */}
        <section className="card doses" aria-labelledby="doses-h">
          <div className="chead">
            <div className="chead__text">
              <h2 id="doses-h">Today’s medicines</h2>
              <p>
                {takenMedsCount} of {todayMeds.length} done · 96% on time
              </p>
            </div>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => navigateTo('meds')}
            >
              Schedule
            </button>
          </div>

          <div className="doses__track" aria-hidden="true">
            {todayMeds.map((m) => (
              <i key={m.id} className={m.history[todayStr] ? 'is-taken' : ''} />
            ))}
          </div>

          <ul className="doses__list">
            {todayMeds.map((med) => {
              const isTaken = !!med.history[todayStr];
              return (
                <li
                  key={med.id}
                  className={`dose ${isTaken ? 'is-taken' : ''}`}
                >
                  <button
                    type="button"
                    className="dose__check"
                    aria-label={`Take ${med.name}`}
                    aria-pressed={isTaken}
                    onClick={() => toggleMedication(med.id, med.name)}
                  >
                    <Check size={18} />
                  </button>
                  <button
                    type="button"
                    className="dose__text"
                    onClick={() => navigateTo('meds')}
                  >
                    <b>
                      {med.name} <span>{med.dosage}</span>
                    </b>
                    <small>
                      {isTaken ? `Taken ${med.timeSlot}` : `${med.timeSlot} · with food`}
                    </small>
                  </button>
                  <span className="dose__at">{med.timeSlot}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Take a Minute (Paced Box Breathing) */}
        <section className="card breathe" aria-labelledby="br-h">
          <div className="chead">
            <div className="chead__text">
              <h2 id="br-h">Take a minute</h2>
              <p>4-7-8 breathing · 12 min this week</p>
            </div>
          </div>

          <div className="breathe__stage">
            <span className="breathe__halo" aria-hidden="true" />
            <span
              className="breathe__ring"
              style={{ transform: ringScale }}
              aria-hidden="true"
            />
            <div className="breathe__text" aria-live="polite">
              <b>{breathPhase}</b>
              {breathActive && <small>{breathCount} of 4</small>}
            </div>
          </div>

          <button
            type="button"
            className={`btn btn--block ${breathActive ? '' : 'btn--primary'}`}
            onClick={toggleBreath}
          >
            {breathActive ? 'Stop' : 'Start session'}
          </button>
        </section>

        {/* Home Stack: Water Hydration + Next Appointment */}
        <div className="home__stack">
          {/* Water Card */}
          <section className="card water" aria-labelledby="w-h">
            <div className="chead">
              <div className="chead__text">
                <h2 id="w-h">Water</h2>
                <p>
                  {waterGlasses} of 8 glasses · {(waterGlasses * 0.25).toFixed(1)} L
                </p>
              </div>
              <button
                type="button"
                className="ibtn ibtn--sm ibtn--lime"
                aria-label="Add a glass"
                onClick={() => {
                  const next = Math.min(8, waterGlasses + 1);
                  setWaterGlasses(next);
                  notify(`${next} of 8 glasses logged`);
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="glasses" role="group" aria-label="Glasses of water">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`glass ${i < waterGlasses ? 'is-full' : ''}`}
                  aria-label={`${i + 1} glasses`}
                  aria-pressed={i < waterGlasses}
                  onClick={() => {
                    const next = i + 1 === waterGlasses ? i : i + 1;
                    setWaterGlasses(next);
                  }}
                >
                  <i />
                </button>
              ))}
            </div>
          </section>

          {/* Next Appointment Card */}
          <section className="card next" aria-labelledby="na-h">
            <div className="chead">
              <div className="chead__text">
                <h2 id="na-h">Next appointment</h2>
                <p>In 3 days · Routine check-up</p>
              </div>
            </div>

            <button
              type="button"
              className="next__row"
              onClick={() => navigateTo('care')}
            >
              <span className="next__date">
                <small>NOV</small>
                <b>27</b>
              </span>
              <span className="cell__text">
                <b>Annual Physical & Blood Panel</b>
                <small>09:30 AM · Dr. Sarah Jenkins</small>
              </span>
            </button>

            <div className="next__foot">
              <span className="av av--sm" style={{ fontWeight: 700 }}>
                SJ
              </span>
              <span>Internal Medicine, Metro Health</span>
              <button
                type="button"
                className="linkbtn"
                onClick={() => navigateTo('care')}
              >
                Details
              </button>
            </div>
          </section>
        </div>

        {/* ==================================================================
            ROW 3: Latest Results (span 7) + This Week Workouts (span 5)
            ================================================================== */}
        {/* Latest Results Card */}
        <section className="card results" aria-labelledby="res-h">
          <div className="chead">
            <div className="chead__text">
              <h2 id="res-h">Latest results</h2>
              <p>3 new from Central Diagnostic Labs</p>
            </div>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => navigateTo('records')}
            >
              All records
            </button>
          </div>

          <div className="reslist">
            {recentLabs.map((lab) => (
              <a
                key={lab.id}
                className="res is-new"
                href="#records"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('records');
                }}
              >
                <span className="res__ico">
                  <FlaskConical size={19} />
                </span>
                <span className="cell__text">
                  <b>{lab.testName}</b>
                  <small>
                    Reference: {lab.refMin}-{lab.refMax} {lab.unit}
                  </small>
                </span>
                <span className="res__meta">
                  <span
                    className="delta delta--up"
                    style={{
                      background: 'var(--good-soft)',
                      color: 'var(--good)',
                    }}
                  >
                    In range
                  </span>
                  <small>{lab.date}</small>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* This Week Workouts Card */}
        <section className="card week" aria-labelledby="wk-h">
          <div className="chead">
            <div className="chead__text">
              <h2 id="wk-h">This week</h2>
              <p>
                {recentWorkouts.length} workouts · {totalWorkoutMins} active minutes
              </p>
            </div>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => navigateTo('activity')}
            >
              Workouts
            </button>
          </div>

          <div className="week__body">
            <ul className="week__list">
              {recentWorkouts.map((w) => (
                <li key={w.id}>
                  <a
                    href="#activity"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('activity');
                    }}
                  >
                    <span className="week__ico">
                      <Activity size={17} />
                    </span>
                    <span className="cell__text">
                      <b>{w.type} Session</b>
                      <small>
                        {w.date} · {w.caloriesBurned} kcal
                      </small>
                    </span>
                    <b className="week__n">
                      {w.durationMinutes} <small>min</small>
                    </b>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
