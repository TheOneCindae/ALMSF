import React, { useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunFilter = async () => {
    if (!file) {
      setErrorMsg("Please upload a CSV file first.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Prepare chart data format
  const chartData = React.useMemo(() => {
    if (!data || !data.input_signal) return [];

    return data.input_signal.map((val, idx) => ({
      time: idx,
      noisy: val,
      filtered: data.filtered_signal[idx] || 0,
    }));
  }, [data]);

  return (
    <div className="flex flex-col h-screen w-full bg-surface text-on-surface">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-6 py-4 bg-[#10131a] dark:bg-slate-950 rounded-none border-b border-white/15 z-50">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold tracking-widest text-[#e1fdff] font-['Space_Grotesk'] uppercase">
            ADAPTIVE-FILTERING
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary-container/10 border border-secondary-container/20">
            <div className={`w-2 h-2 rounded-full bg-secondary-container ${isProcessing ? 'animate-ping' : ''}`}></div>
            <span className="font-mono text-[10px] tracking-widest text-secondary-container uppercase">
              {isProcessing ? 'PROCESSING' : 'READY_STATE'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-all duration-300 group"
          >
            <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100">sensors</span>
            <span className="font-['Space_Grotesk'] text-[11px] font-bold tracking-widest text-slate-400 group-hover:text-slate-200 uppercase">
              {file ? file.name : 'UPLOAD CSV'}
            </span>
          </button>
          <button
            onClick={handleRunFilter}
            disabled={isProcessing}
            className="px-6 py-2 bg-primary-container text-on-primary font-['Space_Grotesk'] font-bold tracking-tighter uppercase transition-all duration-300 active:scale-95 hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50"
          >
            RUN FILTER
          </button>
          <div className="flex items-center ml-4 gap-2">
            <span className="material-symbols-outlined text-slate-500 hover:text-primary-container cursor-pointer transition-colors">settings</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Error Banner */}
        {errorMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-error-container text-on-error-container px-6 py-2 flex items-center gap-3 border outline-error border-error/50 shadow-lg">
            <span className="material-symbols-outlined text-error">warning</span>
            <span className="font-mono text-xs uppercase tracking-widest">{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="ml-4 font-bold text-error">X</button>
          </div>
        )}

        {/* SideNavBar */}
        <nav className="flex flex-col bg-[#191c22] dark:bg-slate-900 border-r border-white/10 w-64 z-40">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-surface-container-highest border border-white/10 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-primary-container">person</span>
              </div>
              <div>
                <div className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest text-primary-container">USER_01</div>
              </div>
            </div>
          </div>

          <div className="flex-1 mt-4">
            <a className="flex items-center gap-4 text-[#00f2ff] bg-white/5 border-l-2 border-[#00f2ff] py-4 px-6 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest group" href="#">
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">analytics</span>
              Signal Processing
            </a>
            <a className="flex items-center gap-4 text-slate-500 py-4 px-6 opacity-60 hover:opacity-100 hover:bg-white/5 transition-all font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest group" href="#">
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">waves</span>
              Noise Analysis
            </a>
          </div>

          <div className="p-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs text-secondary-container">memory</span>
                <span className="font-mono text-[9px] uppercase tracking-tighter text-slate-500">System Health</span>
              </div>
              <span className="font-mono text-[9px] text-secondary-container">98%</span>
            </div>
            <div className="w-full h-1 bg-white/5">
              <div className="h-full bg-secondary-container w-[98%]"></div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-surface-container-lowest overflow-y-auto custom-scrollbar pb-16">
          {/* Contextual Controls */}
          <section className="p-6 border-b border-white/5 grid grid-cols-12 gap-6 items-center">
            <div className="col-span-3">
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Detected Noise Source</label>
              <div className="px-4 py-2 bg-white/5 border-l border-white/20 font-mono text-xs uppercase tracking-widest text-primary">
                {data ? data.noise_type : 'AWAITING_DATA'}
              </div>
            </div>

            <div className="col-span-3">
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Processor Node</label>
              <div className="px-4 py-2 bg-white/5 font-mono text-xs text-slate-400">
                {data ? data.processor : 'N/A'}
              </div>
            </div>
          </section>

          {/* Key Metrics */}
          <section className="p-6 grid grid-cols-6 gap-4">
            <div className="bg-surface-container border-l-2 border-primary-container p-4">
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Filter Order (M)</div>
              <div className="font-mono text-2xl font-bold text-primary">{data ? data.filter_params.M : '--'} <span className="text-[10px] opacity-40 font-normal">taps</span></div>
            </div>
            <div className="bg-surface-container border-l-2 border-primary-container p-4">
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Step Size (μ)</div>
              <div className="font-mono text-2xl font-bold text-primary">{data ? data.filter_params.mu : '--'}</div>
            </div>
            <div className="bg-surface-container border-l-2 border-primary-container p-4">
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Input SNR</div>
              <div className="font-mono text-2xl font-bold text-primary">{data ? data.snr_before : '--'} <span className="text-[10px] opacity-40 font-normal">dB</span></div>
            </div>
            <div className="bg-surface-container border-l-2 border-secondary-container p-4">
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Output SNR</div>
              <div className="font-mono text-2xl font-bold text-secondary-container">{data ? data.snr_after : '--'} <span className="text-[10px] opacity-40 font-normal">dB</span></div>
            </div>
            <div className="bg-surface-container border-l-2 border-secondary-container p-4">
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">SNR Gain</div>
              <div className="font-mono text-2xl font-bold text-secondary-container">{data ? `+${(data.snr_after - data.snr_before).toFixed(2)}` : '--'} <span className="text-[10px] opacity-40 font-normal">dB</span></div>
            </div>
          </section>

          {/* Main Visualizer */}
          <section className="px-6 pb-6 h-[400px]">
            <div className="h-full bg-surface-container-low ghost-border relative flex flex-col p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="font-headline text-xl uppercase tracking-tighter mb-1">Adaptive Signal Reconstruction</h2>
                  <p className="font-mono text-[10px] opacity-40 uppercase">Domain: Time Series</p>
                </div>
              </div>
              <div className="flex-1 w-full ml-[-20px]">
                {data ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#666" fontSize={10} />
                      <YAxis stroke="#666" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                      <Legend />
                      <Line type="step" dataKey="noisy" stroke="#ffb4ab" strokeWidth={1} dot={false} isAnimationActive={false} name="Noisy Input" opacity={0.5} />
                      <Line type="monotone" dataKey="filtered" stroke="#2ff801" strokeWidth={2} dot={false} isAnimationActive={false} name="LMS Output" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/20 font-mono tracking-widest text-sm uppercase">WAITING FOR SIGNAL DATA...</div>
                )}
              </div>
            </div>
          </section>

          {/* Analysis Panels */}
          <section className="px-6 grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-7 bg-surface-container-low ghost-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-primary-container flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">biotech</span>
                  Compound Match Analysis
                </h3>
                <div className="font-mono text-[10px] text-slate-500">DATABASE: IR_DB_REFERENCE</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-on-surface-variant">
                      <th className="pb-3 font-medium uppercase tracking-tighter">Identity</th>
                      <th className="pb-3 font-medium uppercase tracking-tighter">CAS Number</th>
                      <th className="pb-3 font-medium uppercase tracking-tighter">Match %</th>
                      <th className="pb-3 font-medium uppercase tracking-tighter">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(data?.top_matches || []).map((match, idx) => (
                      <tr key={idx} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 text-primary font-medium">{match.name}</td>
                        <td className="py-4 opacity-40">{match.cas}</td>
                        <td className="py-4 text-secondary-container">{match.score}%</td>
                        <td className="py-4">
                          <div className="w-16 h-1 bg-white/5 overflow-hidden">
                            <div className="h-full bg-secondary-container" style={{ width: `${match.score}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!data && <tr><td colSpan="4" className="py-4 text-center opacity-30">NO MATCH DATA</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-span-5 bg-surface-container-low ghost-border p-6 flex flex-col">
              <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-[#ff00ff] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">hub</span>
                Functional Groups Identified
              </h3>
              <div className="flex flex-wrap gap-2">
                {(data?.functional_groups || []).map((fg, idx) => {
                  const colorClass = fg.score > 80 ? 'bg-secondary-container/10 border-secondary-container/30 text-secondary-container'
                    : fg.score > 60 ? 'bg-primary-container/10 border-primary-container/30 text-primary-container'
                      : 'bg-white/5 border-white/10 text-slate-400';
                  const dotClass = fg.score > 80 ? 'bg-secondary-container'
                    : fg.score > 60 ? 'bg-primary-container'
                      : 'bg-slate-500';

                  return (
                    <div key={idx} className={`px-3 py-1.5 border font-mono text-[10px] uppercase tracking-wider flex items-center gap-2 ${colorClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
                      {fg.name}
                    </div>
                  );
                })}
                {!data && <div className="text-white/20 font-mono text-xs">NO GROUPS DETECTED</div>}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 right-0 left-64 flex justify-between px-6 py-2 z-40 bg-[#10131a] dark:bg-black rounded-none border-t border-white/5 items-center">
        <div className="font-mono text-[10px] uppercase tracking-tighter text-[#2ff801] dark:text-green-400">
          CORE_OS v2.4.0 // SIGNAL_PROCESSING_LAB
        </div>
      </footer>
    </div>
  );
}
