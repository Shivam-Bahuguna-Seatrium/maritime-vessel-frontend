import React, { useState } from 'react';
import DEBUG from '../debug';
import { API_BASE_URL } from '../api';

/**
 * DebugPanel – Troubleshooting component for CSV loading and deployment issues.
 * 
 * Useful for:
 *  - Testing CSV endpoints
 *  - Viewing server paths and environment info
 *  - Manually configuring CSV file paths (for Vercel deployments)
 *  - Checking system status and diagnostics
 */

export default function DebugPanel({ isOpen, onClose }) {
  const [pathsData, setPathsData] = useState(null);
  const [csvPath, setCsvPath] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---- Fetch CSV paths for debugging ----
  const handleCheckPaths = async () => {
    setLoading('paths');
    try {
      DEBUG.api('GET', `${API_BASE_URL}/api/csv-paths`);
      const response = await fetch(`${API_BASE_URL}/api/csv-paths`);
      const data = await response.json();
      setPathsData(data);
      setResult({ status: 'success', message: 'CSV paths retrieved' });
      DEBUG.info('DEBUG_PANEL', 'CSV paths', data);
    } catch (e) {
      setResult({ status: 'error', message: `Failed to fetch paths: ${e.message}` });
      DEBUG.apiError('GET', `${API_BASE_URL}/api/csv-paths`, e);
    } finally {
      setLoading('');
    }
  };

  // ---- Configure CSV path ----
  const handleConfigureCSV = async () => {
    if (!csvPath.trim()) {
      setResult({ status: 'error', message: 'Please enter a CSV path' });
      return;
    }

    setLoading('configure');
    try {
      DEBUG.api('POST', `${API_BASE_URL}/api/configure-csv`, { csv_path: csvPath });
      const response = await fetch(`${API_BASE_URL}/api/configure-csv?csv_path=${encodeURIComponent(csvPath)}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.status === 'ok' && data.available) {
        setResult({
          status: 'success',
          message: `CSV configured successfully: ${data.records} records loaded`,
          details: data,
        });
        DEBUG.info('DEBUG_PANEL', 'CSV configured', data);
      } else {
        setResult({
          status: 'error',
          message: data.message || 'Failed to configure CSV',
          details: data,
        });
      }
    } catch (e) {
      setResult({ status: 'error', message: `Failed to configure CSV: ${e.message}` });
      DEBUG.apiError('POST', `${API_BASE_URL}/api/configure-csv`, e);
    } finally {
      setLoading('');
    }
  };

  // ---- Test auto-load ----
  const handleTestAutoLoad = async () => {
    setLoading('autoload');
    try {
      DEBUG.api('GET', `${API_BASE_URL}/api/load-default`);
      const response = await fetch(`${API_BASE_URL}/api/load-default`);
      const data = await response.json();
      
      setResult({
        status: data.available ? 'success' : 'warning',
        message: data.message,
        details: data,
      });
      DEBUG.info('DEBUG_PANEL', 'Auto-load test', data);
    } catch (e) {
      setResult({ status: 'error', message: `Failed to test auto-load: ${e.message}` });
      DEBUG.apiError('GET', `${API_BASE_URL}/api/load-default`, e);
    } finally {
      setLoading('');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: '100%',
      maxWidth: '500px',
      height: '70vh',
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
      borderTop: '2px solid #0078d4',
      boxShadow: '-2px -2px 10px rgba(0,0,0,0.3)',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      fontSize: '12px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #333',
        backgroundColor: '#252526',
      }}>
        <h3 style={{ margin: 0 }}>🔧 Debug Panel – CSV Configuration</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#e0e0e0',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 8px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* CSV Path Configuration */}
        <section>
          <h4 style={{ margin: '0 0 8px 0', color: '#0078d4' }}>Configuration</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={csvPath}
              onChange={(e) => setCsvPath(e.target.value)}
              placeholder="/var/task/case_study_dataset_202509152039.csv"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '6px 8px',
                backgroundColor: '#3c3c3c',
                border: '1px solid #555',
                color: '#e0e0e0',
                fontSize: '11px',
              }}
            />
            <button
              onClick={handleConfigureCSV}
              disabled={loading === 'configure'}
              style={{
                padding: '6px 12px',
                backgroundColor: loading === 'configure' ? '#666' : '#0078d4',
                color: '#fff',
                border: 'none',
                cursor: loading === 'configure' ? 'not-allowed' : 'pointer',
                fontSize: '11px',
                borderRadius: '3px',
              }}
            >
              {loading === 'configure' ? '...' : 'Set Path'}
            </button>
          </div>
        </section>

        {/* Test Buttons */}
        <section>
          <h4 style={{ margin: '0 0 8px 0', color: '#0078d4' }}>Tests</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleCheckPaths}
              disabled={loading === 'paths'}
              style={{
                padding: '6px 12px',
                backgroundColor: loading === 'paths' ? '#666' : '#e0e0e0',
                color: '#1e1e1e',
                border: 'none',
                cursor: loading === 'paths' ? 'not-allowed' : 'pointer',
                fontSize: '11px',
                borderRadius: '3px',
              }}
            >
              {loading === 'paths' ? '...' : 'Check Paths'}
            </button>
            <button
              onClick={handleTestAutoLoad}
              disabled={loading === 'autoload'}
              style={{
                padding: '6px 12px',
                backgroundColor: loading === 'autoload' ? '#666' : '#e0e0e0',
                color: '#1e1e1e',
                border: 'none',
                cursor: loading === 'autoload' ? 'not-allowed' : 'pointer',
                fontSize: '11px',
                borderRadius: '3px',
              }}
            >
              {loading === 'autoload' ? '...' : 'Test Auto-Load'}
            </button>
          </div>
        </section>

        {/* Results */}
        {result && (
          <section>
            <h4 style={{
              margin: '0 0 8px 0',
              color: result.status === 'success' ? '#4ec9b0' : result.status === 'error' ? '#f48771' : '#dcdcaa',
            }}>
              {result.status === 'success' ? '✓' : result.status === 'error' ? '✗' : '⚠'} {result.message}
            </h4>
            {result.details && (
              <pre style={{
                backgroundColor: '#252526',
                padding: '8px',
                borderRadius: '3px',
                overflow: 'auto',
                fontSize: '10px',
                maxHeight: '200px',
                margin: 0,
              }}>
                {JSON.stringify(result.details, null, 2)}
              </pre>
            )}
          </section>
        )}

        {/* CSV Paths Info */}
        {pathsData && (
          <section>
            <h4 style={{ margin: '0 0 8px 0', color: '#0078d4' }}>Server Paths</h4>
            <div style={{
              backgroundColor: '#252526',
              padding: '8px',
              borderRadius: '3px',
              fontSize: '10px',
              lineHeight: '1.6',
            }}>
              <div><strong>CWD:</strong> {pathsData.cwd}</div>
              <div><strong>Script:</strong> {pathsData.script_dir}</div>
              <div><strong>Env CSV_FILE_PATH:</strong> {pathsData.env_csv_path || '(not set)'}</div>
              <hr style={{ margin: '8px 0', borderColor: '#555' }} />
              <div><strong>Paths Checked ({pathsData.total_paths}):</strong></div>
              <div style={{ marginTop: '4px' }}>
                {pathsData.paths_checked.map((p, i) => (
                  <div key={i} style={{
                    padding: '4px 0',
                    color: p.exists ? '#4ec9b0' : '#f48771',
                  }}>
                    [{p.exists ? '✓' : '✗'}] {p.path}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Helpful Info */}
        <section>
          <h4 style={{ margin: '0 0 8px 0', color: '#0078d4' }}>Vercel Deployment Tips</h4>
          <ul style={{ fontSize: '11px', margin: '0', paddingLeft: '16px', lineHeight: '1.6' }}>
            <li>For Vercel: Try paths like <code>/var/task/case_study_dataset_202509152039.csv</code></li>
            <li>Set <code>CSV_FILE_PATH</code> environment variable in Vercel settings</li>
            <li>Use "Check Paths" to see what paths the server is checking</li>
            <li>Use "Test Auto-Load" to verify the /api/load-default endpoint</li>
            <li>Use "Set Path" to manually configure the CSV location</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
