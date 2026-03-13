import React, { useEffect, useState, useRef, useCallback } from 'react';
import DEBUG from '../debug';
import { API_BASE_URL } from '../api';
import { Network } from 'vis-network';

export default function GraphViewer({ filters, graphBuilt, rawGraphData }) {
  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [vesselCount, setVesselCount] = useState(0);
  const [dataLimit, setDataLimit] = useState(20);
  const networkRef = useRef(null);
  const containerRef = useRef(null);

  // Set vessel count from cached data
  useEffect(() => {
    if (!graphBuilt) return;
    
    if (rawGraphData?.nodes) {
      const vessels = rawGraphData.nodes.filter(n => n.labels?.includes('Vessel'));
      DEBUG.log('GRAPHVIEWER', `Setting vessel count to: ${vessels.length}`);
      setVesselCount(vessels.length);
    } else {
      // Fallback to API call
      DEBUG.log('GRAPHVIEWER', 'Fetching vessel count from API...');
      DEBUG.api('GET', `${API_BASE_URL}/api/kg/filters`);
      fetch(`${API_BASE_URL}/api/kg/filters`)
        .then(r => {
          DEBUG.apiResponse('GET', `${API_BASE_URL}/api/kg/filters`, r.status);
          return r.json();
        })
        .then(data => {
          DEBUG.info('GRAPHVIEWER', 'Filters API response received', data);
          const count = data.vessel_count || data.vessel_names?.length || 0;
          DEBUG.log('GRAPHVIEWER', `Setting vessel count to: ${count}`);
          setVesselCount(count);
        })
        .catch(err => {
          DEBUG.apiError('GET', '/api/kg/filters', err);
        });
    }
  }, [graphBuilt, rawGraphData]);

  // Apply filters client-side instead of fetching from API
  const fetchGraph = useCallback(async () => {
    if (!graphBuilt) return;
    setLoading(true);
    DEBUG.log('GRAPHVIEWER', 'Applying filters to graph data', filters);
    
    try {
      let data = rawGraphData ? { ...rawGraphData } : { nodes: [], relationships: [] };
      
      if (!data.nodes || data.nodes.length === 0) {
        // If no cached data, fetch from API (fallback)
        DEBUG.log('GRAPHVIEWER', 'No cached data, fetching from API...');
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.vessel_type) params.set('vessel_type', filters.vessel_type);
        if (filters.vessel_name) params.set('vessel_name', filters.vessel_name);
        if (filters.flag) params.set('flag', filters.flag);
        if (filters.validation_status) params.set('validation_status', filters.validation_status);

        const url = `${API_BASE_URL}/api/kg/data?${params}`;
        DEBUG.api('GET', url);
        const res = await fetch(url);
        DEBUG.apiResponse('GET', url, res.status);
        
        if (res.ok) {
          data = await res.json();
        }
      } else {
        // Client-side filtering on cached data
        DEBUG.log('GRAPHVIEWER', 'Filtering cached graph data...');
        let filteredNodes = [...data.nodes];
        
        // Apply filters
        if (filters.category) {
          filteredNodes = filteredNodes.filter(n => 
            n.properties?.category === filters.category || n.category === filters.category
          );
        }
        if (filters.vessel_type) {
          filteredNodes = filteredNodes.filter(n => 
            n.properties?.vessel_type === filters.vessel_type || n.vessel_type === filters.vessel_type
          );
        }
        if (filters.vessel_name) {
          filteredNodes = filteredNodes.filter(n => 
            n.id === filters.vessel_name || n.properties?.name === filters.vessel_name || n.name === filters.vessel_name
          );
        }
        if (filters.flag) {
          filteredNodes = filteredNodes.filter(n => 
            n.properties?.flag === filters.flag || n.flag === filters.flag
          );
        }
        if (filters.validation_status) {
          filteredNodes = filteredNodes.filter(n => 
            n.properties?.validation_status === filters.validation_status || n.validation_status === filters.validation_status
          );
        }
        
        // Filter relationships based on filtered nodes
        const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
        const filteredRels = data.relationships?.filter(r => 
          filteredNodeIds.has(r.startNode) && filteredNodeIds.has(r.endNode)
        ) || [];
        
        data = {
          nodes: filteredNodes,
          relationships: filteredRels,
        };
        DEBUG.log('GRAPHVIEWER', `Filtered to ${filteredNodes.length} nodes and ${filteredRels.length} relationships`);
      }
      
      // Limit nodes for performance
      if (data.nodes && data.nodes.length > dataLimit) {
        const vessels = data.nodes.filter(n => n.labels?.includes('Vessel'));
        const others = data.nodes.filter(n => !n.labels?.includes('Vessel'));
        const limitedVessels = vessels.slice(0, dataLimit);
        const limitedVesselIds = new Set(limitedVessels.map(v => v.id));
        const limitedRels = data.relationships.filter(r => limitedVesselIds.has(r.startNode));
        
        data = {
          nodes: [...limitedVessels, ...others.slice(0, 100)],
          relationships: limitedRels,
        };
        DEBUG.log('GRAPHVIEWER', `Limited to ${limitedVessels.length} vessels`);
      }
      
      setGraphData(data || { nodes: [], relationships: [] });
    } catch (err) {
      if (err.name === 'AbortError') {
        DEBUG.warn('GRAPHVIEWER', 'Graph fetch timeout - try adjusting filters');
      } else {
        DEBUG.apiError('GET', '/api/kg/data', err);
      }
      setGraphData({ nodes: [], relationships: [] });
    }
    setLoading(false);
  }, [filters, graphBuilt, dataLimit, rawGraphData]);

  useEffect(() => { 
    fetchGraph(); 
  }, [fetchGraph]);

  // Handle window resize for responsive graph layout
  useEffect(() => {
    let resizeTimeout;
    const handleWindowResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (networkRef.current && containerRef.current) {
          networkRef.current.redraw();
        }
      }, 250); // Debounce resize events to prevent excessive redraws
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // Render vis-network when graph data changes
  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    // Transform data for vis-network
    const visNodes = graphData.nodes.map(n => ({
      id: n.id,
      label: n.properties?.name || n.properties?.value || n.properties?.code || n.labels?.[0] || '',
      color: n.color || '#3498db',
      size: n.labels?.includes('Vessel') ? 30 : 20,
      title: `<strong>${n.labels?.join(', ')}</strong><br/>${n.properties?.name || ''}`,
      physics: true,
    }));

    const visEdges = graphData.relationships.map(r => ({
      id: r.id,
      from: r.startNode,
      to: r.endNode,
      label: r.type,
      smooth: { type: 'continuous' },
    }));

    // Optimize physics based on graph size
    const nodeCount = visNodes.length;
    const enablePhysics = nodeCount <= 100;
    const stabilizationIterations = nodeCount > 50 ? 50 : 100;
    const isNewNetwork = !networkRef.current;

    const options = {
      physics: {
        enabled: enablePhysics,
        stabilization: { 
          iterations: stabilizationIterations,
          fit: false, // Don't auto-fit during stabilization to prevent view jumps
          updateInterval: 25,
        },
        barnesHut: {
          gravitationalConstant: -26000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1,
        },
      },
      interaction: {
        navigationButtons: false, // Disable navigation buttons to prevent layout shift
        keyboard: true,
        zoomView: true,
        dragView: true,
      },
      layout: {
        randomSeed: 42,
      },
    };

    // Create or update network
    if (!networkRef.current) {
      networkRef.current = new Network(containerRef.current, { nodes: visNodes, edges: visEdges }, options);
      // Fit view only on initial creation to show entire graph
      networkRef.current.fit({ animation: { duration: 400 } });
      // Stop physics after stabilization to prevent continuous computation
      if (enablePhysics) {
        networkRef.current.once('stabilizationIterationsDone', () => {
          networkRef.current.setOptions({ physics: false });
        });
      }
    } else {
      networkRef.current.setData({ nodes: visNodes, edges: visEdges });
      networkRef.current.setOptions(options);
    }

    // Attach/reattach click handler with current graphData reference
    if (networkRef.current) {
      // Remove old listeners
      networkRef.current.off('click');
      
      // Add new click handler with current data
      networkRef.current.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graphData.nodes.find(n => n.id === nodeId);
          setSelected(node);
        } else {
          setSelected(null);
        }
      });
    }

    // Handle container resize for web mode responsive layout
    let resizeTimeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (networkRef.current && containerRef.current) {
          networkRef.current.redraw();
        }
      }, 250); // Increase debounce to prevent excessive redraws
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [graphData]);

  if (!graphBuilt) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <p style={{ color: 'var(--text-muted)' }}>Build the knowledge graph to see the visualization.</p>
      </div>
    );
  }

  // Transform data for display
  const nvlNodes = graphData.nodes.map(n => ({
    id: n.id,
    size: n.labels?.includes('Vessel') ? 30 : n.labels?.includes('VesselCategory') ? 35 : 20,
    color: n.color || '#3498db',
    caption: n.properties?.name || n.properties?.value || n.properties?.code || n.labels?.[0] || '',
    _raw: n,
  }));

  const nvlRels = graphData.relationships.map(r => ({
    id: r.id,
    from: r.startNode,
    to: r.endNode,
    caption: r.type,
    _raw: r,
  }));

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'visible', minHeight: 0, boxSizing: 'border-box', position: 'relative' }}>
      {/* Toolbar */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: 8,
        fontSize: '0.82rem', color: 'var(--text-muted)',
        background: 'var(--background)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span title="Total nodes in current view">Nodes: <strong style={{ color: 'var(--text)' }}>{nvlNodes.length}</strong></span>
          <span title="Total relationships/edges in current view">Relationships: <strong style={{ color: 'var(--text)' }}>{nvlRels.length}</strong></span>
          {loading && <span style={{ color: 'var(--warning)' }}>Loading…</span>}
          <button
            style={{ marginLeft: 'auto', background: 'var(--border)', color: 'var(--text)', padding: '4px 12px', fontSize: '0.78rem' }}
            onClick={fetchGraph}
            title="Reload graph with current filters"
          >
            ⟳ Refresh
          </button>
        </div>
        
        {/* Control Panel */}
        <div className="controls" style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ color: 'var(--text-muted)' }} title="Total unique vessels in dataset">
            Total Vessels: <strong style={{ color: 'var(--text)' }}>{vesselCount}</strong>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label title="Limit how many vessels to display (for performance)">Max Vessels:</label>
            <select 
              value={dataLimit} 
              onChange={(e) => setDataLimit(Number(e.target.value))}
              style={{ padding: '4px 8px', fontSize: '0.75rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px' }}
              title="Choose how many vessels to visualize at once"
            >
              <option value="10">20</option>
              <option value="40">40</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value={vesselCount + 1000}>All ({vesselCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Graph container */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--background)', minHeight: 0 }}>
        {graphData.nodes.length === 0 ? (
          <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              {loading ? (
                <>
                  <div style={{ animation: 'spin 1s linear infinite', fontSize: '2rem', marginBottom: 8 }}>⟳</div>
                  <p>Loading graph data...</p>
                </>
              ) : (
                <>
                  <p>No data to visualize</p>
                  <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Try adjusting filters or build the graph again</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      {/* Detail panel - positioned outside graph container to avoid overflow clipping */}
      {selected && (
        <div className="detail-panel" style={{
          position: 'fixed', bottom: 16, right: 16, width: 'clamp(280px, 90%, 350px)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 14,
          maxHeight: 'clamp(200px, 70vh, 70%)', overflowY: 'auto', fontSize: '0.8rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 50,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
            <strong title={`${selected.labels?.join(', ')}`} style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
              {selected.labels?.join(', ')}
            </strong>
            <button
              style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0 4px', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => setSelected(null)}
              title="Close details panel"
            >✕</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(selected.properties || {}).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td 
                    style={{ 
                      color: 'var(--text-muted)', 
                      padding: '6px 4px', 
                      verticalAlign: 'top',
                      fontWeight: 600,
                      wordBreak: 'break-word'
                    }} 
                    title={`Property: ${k}`}
                  >
                    {k}
                  </td>
                  <td style={{ padding: '6px 4px', wordBreak: 'break-word', color: 'var(--text)' }}>
                    {k === 'validation_status' ? (
                      <span className={`badge ${v === 'valid' ? 'valid' : 'invalid'}`}>{v}</span>
                    ) : String(v).substring(0, 50)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
