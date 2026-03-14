import React, { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import GraphViewer from './components/GraphViewer';
import ChatPanel from './components/ChatPanel';
import FilterPanel from './components/FilterPanel';
import CaseStudy from './components/CaseStudy';
import DebugPanel from './components/DebugPanel';
import DEBUG from './debug';

const TABS = ['Case Study', 'Dashboard', 'Knowledge Graph', 'Chat'];

// Get API base URL from environment or default to relative path
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// SessionStorage key for graph cache (versioned to invalidate on schema changes)
const GRAPH_CACHE_KEY = 'maritime_graph_cache_v1';

export default function App() {
  const [tab, setTab] = useState('Case Study');
  const [graphFilters, setGraphFilters] = useState({});
  const [debugPanelOpen, setDebugPanelOpen] = useState(false);
  const [status, setStatus] = useState({
    dataset_loaded: false,
    record_count: 0,
    validated: false,
    graph_built: false,
  });

  // ── Centralized Graph Cache ──────────────────────────────────────────────
  // Populated once after "Build Graph" and used by ALL components.
  // Shape: { allOptions, vesselMeta, allGraphData, fetchedAt }
  // Persisted to sessionStorage so browser-refresh keeps the data.
  const [graphCache, setGraphCache] = useState(() => {
    try {
      const raw = sessionStorage.getItem(GRAPH_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Authoritative graph_built flag: backend OR local cache
  const graphBuilt = status.graph_built || (graphCache !== null);

  // Log app initialization
  useEffect(() => {
    DEBUG.log('APP', '🚀 App initialized');
    DEBUG.log('APP', `Environment: ${window.location.hostname}:${window.location.port}`);
    DEBUG.log('APP', `API Base URL: ${DEFAULT_API_URL}`);
    if (graphCache) {
      DEBUG.log('APP', `Restored graph cache from sessionStorage: ${graphCache.allOptions?.vessel_count} vessels, ${graphCache.allGraphData?.nodes?.length} nodes`);
    }
  }, []);

  // Handle keyboard shortcut to open debug panel (Alt+D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        setDebugPanelOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      DEBUG.api('GET', `${DEFAULT_API_URL}/api/status`);
      const res = await fetch(`${DEFAULT_API_URL}/api/status`);
      DEBUG.apiResponse('GET', `${DEFAULT_API_URL}/api/status`, res.status, { ok: res.ok });
      if (res.ok) {
        const data = await res.json();
        // IMPORTANT: never override a locally-known graph_built=true with a stale
        // serverless response of false. The cache IS the truth.
        setStatus(prev => ({
          ...data,
          graph_built: data.graph_built || prev.graph_built,
        }));
        DEBUG.info('APP', 'Status refreshed', data);
      } else {
        DEBUG.warn('APP', `Status endpoint returned ${res.status}`);
      }
    } catch (err) {
      DEBUG.apiError('GET', `${DEFAULT_API_URL}/api/status`, err);
    }
  }, []);

  /**
   * Called by Dashboard after build-graph + data fetch succeeds.
   * Saves the complete graph cache to React state and sessionStorage.
   */
  const handleGraphBuilt = useCallback((cache) => {
    setGraphCache(cache);
    setStatus(prev => ({ ...prev, graph_built: true }));
    try {
      sessionStorage.setItem(GRAPH_CACHE_KEY, JSON.stringify(cache));
      DEBUG.info('APP', `Graph cache saved (${JSON.stringify(cache).length} bytes)`);
    } catch (e) {
      // SessionStorage quota exceeded – try saving minimal cache
      DEBUG.warn('APP', 'sessionStorage quota exceeded, saving minimal cache', e);
      try {
        const minimalCache = {
          allOptions: cache.allOptions,
          vesselMeta: cache.vesselMeta,
          allGraphData: null,
          fetchedAt: cache.fetchedAt,
        };
        sessionStorage.setItem(GRAPH_CACHE_KEY, JSON.stringify(minimalCache));
      } catch {
        // Can't persist – graphCache stays in React state only (survives tab switches)
      }
    }
    DEBUG.info('APP', 'Graph built and cached', {
      vessels: cache.allOptions?.vessel_count,
      nodes: cache.allGraphData?.nodes?.length,
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      {/* ---- Header (Fixed at top) ---- */}
      <header>
        <h1>
          🚢 Maritime Vessel Identity System
        </h1>
        <nav>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              title={`View ${t} tab`}
              style={{
                background: tab === t ? 'var(--primary)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (tab !== t) e.currentTarget.style.background = 'rgba(88, 166, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                if (tab !== t) e.currentTarget.style.background = 'transparent';
              }}
            >
              {t}
            </button>
          ))}
        </nav>

        {/* Status indicators with tooltips */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: '0.8rem', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }} className="status-indicators">
          <span title="Number of rows in uploaded dataset">
            Dataset: {status.dataset_loaded
              ? <span className="badge valid">{status.record_count} rows</span>
              : <span className="badge invalid">None</span>}
          </span>
          <span title="Dataset validation status">
            Validated: {status.validated
              ? <span className="badge valid">Yes</span>
              : <span className="badge warning">No</span>}
          </span>
          <span title="Knowledge graph building status">
            Graph: {graphBuilt
              ? <span className="badge valid">Built</span>
              : <span className="badge warning">Pending</span>}
          </span>
          
          {/* Debug button */}
          <button
            onClick={() => setDebugPanelOpen(!debugPanelOpen)}
            title="Debug Panel (Ctrl+D or Alt+D)"
            style={{
              background: debugPanelOpen ? '#0078d4' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '0.75rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!debugPanelOpen) e.currentTarget.style.background = 'rgba(0, 120, 212, 0.2)';
            }}
            onMouseLeave={(e) => {
              if (!debugPanelOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            🔧 Debug
          </button>
        </div>
      </header>

      {/* ---- Body ---- */}
      <main style={{ flex: 1, overflow: 'auto', overflowX: 'hidden' }}>
        {tab === 'Dashboard' && (
          <Dashboard status={{ ...status, graph_built: graphBuilt }} refreshStatus={refreshStatus} onGraphBuilt={handleGraphBuilt} />
        )}

        {tab === 'Knowledge Graph' && (
          <div style={{ display: 'flex', gap: 16, height: '100%' }} className="kg-layout">
            <FilterPanel
              graphBuilt={graphBuilt}
              filters={graphFilters}
              onChange={setGraphFilters}
              graphCache={graphCache}
            />
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="graph-container">
              <GraphViewer filters={graphFilters} graphBuilt={graphBuilt} refreshStatus={refreshStatus} graphCache={graphCache} />
            </div>
          </div>
        )}

        {tab === 'Chat' && (
          <ChatPanel graphBuilt={graphBuilt} graphCache={graphCache} />
        )}

        {tab === 'Case Study' && (
          <CaseStudy />
        )}
      </main>

      {/* Debug Panel */}
      <DebugPanel isOpen={debugPanelOpen} onClose={() => setDebugPanelOpen(false)} />
    </div>
  );
}
