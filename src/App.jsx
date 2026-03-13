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
  const [graphData, setGraphData] = useState(null); // Cache all graph data
  const [filterOptions, setFilterOptions] = useState(null); // Cache filter options

  // Log app initialization
  useEffect(() => {
    DEBUG.log('APP', '🚀 App initialized');
    DEBUG.log('APP', `Environment: ${window.location.hostname}:${window.location.port}`);
    DEBUG.log('APP', `API Base URL: ${DEFAULT_API_URL}`);
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
        setStatus(data);
        DEBUG.info('APP', 'Status refreshed', data);
      } else {
        DEBUG.warn('APP', `Status endpoint returned ${res.status}`);
      }
    } catch (err) {
      DEBUG.apiError('GET', `${DEFAULT_API_URL}/api/status`, err);
    }
  }, []);

  // Load all graph data once when graph is built
  useEffect(() => {
    if (status.graph_built && !graphData) {
      const loadGraphData = async () => {
        try {
          DEBUG.log('APP', '📊 Loading all graph data...');
          
          // Load both graph data and filter options in parallel
          const [graphRes, filterRes] = await Promise.all([
            fetch(`${DEFAULT_API_URL}/api/kg/data?limit=10000`),
            fetch(`${DEFAULT_API_URL}/api/kg/filters`),
          ]);

          if (graphRes.ok) {
            const gData = await graphRes.json();
            setGraphData(gData);
            DEBUG.info('APP', `Loaded ${gData.nodes?.length || 0} nodes and ${gData.relationships?.length || 0} relationships`);
          }

          if (filterRes.ok) {
            const fData = await filterRes.json();
            setFilterOptions(fData);
            DEBUG.info('APP', 'Loaded filter options', fData);
          }
        } catch (err) {
          DEBUG.apiError('APP', 'Loading graph data', err);
        }
      };

      loadGraphData();
    }
  }, [status.graph_built, graphData]);

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
            Graph: {status.graph_built
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
          <Dashboard status={status} refreshStatus={refreshStatus} />
        )}

        {tab === 'Knowledge Graph' && (
          <div style={{ display: 'flex', gap: 16, height: '100%' }} className="kg-layout">
            <FilterPanel
              graphBuilt={status.graph_built}
              filters={graphFilters}
              onChange={setGraphFilters}
              filterOptions={filterOptions}
            />
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="graph-container">
              <GraphViewer 
                filters={graphFilters} 
                graphBuilt={status.graph_built} 
                refreshStatus={refreshStatus}
                rawGraphData={graphData}
              />
            </div>
          </div>
        )}

        {tab === 'Chat' && (
          <ChatPanel graphBuilt={status.graph_built} rawGraphData={graphData} />
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
