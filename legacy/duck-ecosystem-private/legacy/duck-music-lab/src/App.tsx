import { useState } from 'react'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🦆 DUCK Music Lab</h1>
        <p>Web DAW - In Development</p>
      </header>

      <main className="app-main">
        <section className="welcome">
          <h2>Welcome to DUCK Music Lab</h2>
          <p>Unified DAW for the browser. Ableton + Logic + FL Studio merged.</p>

          <div className="features">
            <div className="feature">
              <h3>🎛️ DAW Engine</h3>
              <p>Web Audio API, timeline, sequencer</p>
            </div>
            <div className="feature">
              <h3>🎹 Plugins</h3>
              <p>Synths, effects, mixer, mastering</p>
            </div>
            <div className="feature">
              <h3>🤖 AI Layer</h3>
              <p>Melody gen, voice cloning, smart organization</p>
            </div>
            <div className="feature">
              <h3>📦 Assets</h3>
              <p>10K+ samples, 5K+ presets, organized</p>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => setIsLoading(!isLoading)}
          >
            {isLoading ? 'Loading...' : 'Start Creating'}
          </button>
        </section>

        <section className="roadmap">
          <h2>Roadmap</h2>
          <ul>
            <li>Week 1-2: Core DAW engine</li>
            <li>Week 2-3: Plugins & effects</li>
            <li>Week 3-4: AI layer (melody, voice)</li>
            <li>Week 4-5: Asset browser</li>
            <li>Week 5-6: UI polish</li>
            <li>Week 6-7: Collaboration</li>
            <li>Week 7-8: Export & distribution</li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>Created by Pedro Belentani · DUCK Music Lab v0.1.0</p>
      </footer>
    </div>
  )
}

export default App
