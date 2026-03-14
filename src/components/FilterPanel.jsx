import React, { useEffect, useState } from 'react';
import DEBUG from '../debug';
import { API_BASE_URL } from '../api';

/**
 * FilterPanel – hierarchical dropdown filters for the Knowledge Graph.
 *
 * When graphCache is provided: all filtering is done client-side (zero backend calls).
 * When graphCache is null: falls back to backend API calls (legacy / cold-start path).
 *
 * Filter chain: Category → Vessel Type → Vessel Name → Flag → Validation Status
 */

/**
 * Compute cascading dropdown options client-side from the compact vesselMeta array.
 * Each level is narrowed by all selections above it in the chain.
 */
function computeCascadeOptions(vesselMeta, filters) {
  // Categories always show every available category regardless of other selections
  const allCategories = [...new Set(vesselMeta.map(v => v.category).filter(Boolean))].sort();

  let filtered = vesselMeta;
  if (filters.category) filtered = filtered.filter(v => v.category === filters.category);
  const vessel_types = [...new Set(filtered.map(v => v.vessel_type).filter(Boolean))].sort();

  if (filters.vessel_type) filtered = filtered.filter(v => v.vessel_type === filters.vessel_type);
  const vessel_names = [...new Set(filtered.map(v => v.name).filter(Boolean))].sort();

  if (filters.vessel_name) filtered = filtered.filter(v => v.name === filters.vessel_name);
  const flags = [...new Set(filtered.map(v => v.flag).filter(Boolean))].sort();

  if (filters.flag) filtered = filtered.filter(v => v.flag === filters.flag);
  const validation_statuses = [...new Set(filtered.map(v => v.validation_status).filter(Boolean))].sort();

  return { categories: allCategories, vessel_types, vessel_names, flags, validation_statuses };
}

export default function FilterPanel({ graphBuilt, filters, onChange, graphCache }) {
  const [allOptions, setAllOptions] = useState({
    categories: [],
    vessel_types: [],
    vessel_names: [],
    flags: [],
    validation_statuses: [],
    vessel_count: 0,
  });
  const [filteredOptions, setFilteredOptions] = useState({
    categories: [],
    vessel_types: [],
    vessel_names: [],
    flags: [],
    validation_statuses: [],
  });

  // ── Initialise dropdown options ──────────────────────────────────────────
  // Priority: graphCache (client-side, zero cost) → backend API (fallback)
  useEffect(() => {
    if (!graphBuilt) return;

    if (graphCache?.allOptions) {
      // ✅ Use cached data – no backend call needed
      DEBUG.log('FILTERPANEL', 'Using cached filter options', graphCache.allOptions);
      const opts = graphCache.allOptions;
      setAllOptions(opts);
      setFilteredOptions({
        categories: opts.categories,
        vessel_types: opts.vessel_types,
        vessel_names: opts.vessel_names,
        flags: opts.flags,
        validation_statuses: opts.validation_statuses,
      });
    } else {
      // ⚠️ Fallback: fetch from backend (may fail on stateless serverless)
      DEBUG.log('FILTERPANEL', 'No cache – loading filters from backend...');
      DEBUG.api('GET', `${API_BASE_URL}/api/kg/filters`);
      fetch(`${API_BASE_URL}/api/kg/filters`)
        .then(r => {
          DEBUG.apiResponse('GET', `${API_BASE_URL}/api/kg/filters`, r.status);
          return r.json();
        })
        .then(data => {
          DEBUG.info('FILTERPANEL', 'Filters API response received', data);
          const newOptions = {
            categories: data.categories || [],
            vessel_types: data.vessel_types || [],
            vessel_names: data.vessel_names || [],
            flags: data.flags || [],
            validation_statuses: data.validation_statuses || [],
            vessel_count: data.vessel_count || 0,
          };
          DEBUG.log('FILTERPANEL', `Processed ${newOptions.categories.length} categories, ${newOptions.vessel_types.length} types`, newOptions);
          setAllOptions(newOptions);
          setFilteredOptions({
            categories: newOptions.categories,
            vessel_types: newOptions.vessel_types,
            vessel_names: newOptions.vessel_names,
            flags: newOptions.flags,
            validation_statuses: newOptions.validation_statuses,
          });
        })
        .catch((err) => {
          DEBUG.apiError('GET', '/api/kg/filters', err);
        });
    }
  }, [graphBuilt, graphCache]);

  // ── Cascade filter update ────────────────────────────────────────────────
  // Re-compute available options whenever the user changes a filter selection.
  useEffect(() => {
    DEBUG.log('FILTERPANEL', 'Cascade filter update, current filters:', filters);

    if (graphCache?.vesselMeta) {
      // ✅ Client-side cascade – zero backend calls
      const opts = computeCascadeOptions(graphCache.vesselMeta, filters);
      setFilteredOptions({
        categories: graphCache.allOptions.categories, // categories always show all
        vessel_types: opts.vessel_types,
        vessel_names: opts.vessel_names,
        flags: opts.flags,
        validation_statuses: opts.validation_statuses,
      });
    } else {
      // ⚠️ Fallback: cascade via backend API
      const fetchFilteredOptions = async () => {
        try {
          const params = new URLSearchParams();
          if (filters.category) params.append('category', filters.category);
          if (filters.vessel_type) params.append('vessel_type', filters.vessel_type);
          if (filters.vessel_name) params.append('vessel_name', filters.vessel_name);
          if (filters.flag) params.append('flag', filters.flag);

          if (params.toString()) {
            const res = await fetch(`${API_BASE_URL}/api/kg/filter-options?${params}`);
            if (res.ok) {
              const data = await res.json();
              DEBUG.log('FILTERPANEL', 'Filtered options from backend:', data);
              setFilteredOptions({
                categories: allOptions.categories,
                vessel_types: data.vessel_types || allOptions.vessel_types,
                vessel_names: data.vessel_names || allOptions.vessel_names,
                flags: data.flags || allOptions.flags,
                validation_statuses: data.validation_statuses || allOptions.validation_statuses,
              });
              return;
            }
          }
        } catch (err) {
          DEBUG.apiError('FILTERPANEL', '/api/kg/filter-options', err);
        }
        // Fallback to all options
        setFilteredOptions({
          categories: allOptions.categories,
          vessel_types: allOptions.vessel_types,
          vessel_names: allOptions.vessel_names,
          flags: allOptions.flags,
          validation_statuses: allOptions.validation_statuses,
        });
      };
      fetchFilteredOptions();
    }
  }, [filters, graphCache, allOptions]);

  const update = (key, value) => {
    const next = { ...filters, [key]: value || undefined };
    // Reset child filters when parent changes
    if (key === 'category') {
      delete next.vessel_type;
      delete next.vessel_name;
      delete next.flag;
      delete next.validation_status;
    } else if (key === 'vessel_type') {
      delete next.vessel_name;
      delete next.flag;
      delete next.validation_status;
    } else if (key === 'vessel_name') {
      delete next.flag;
      delete next.validation_status;
    } else if (key === 'flag') {
      delete next.validation_status;
    }
    onChange(next);
  };

  if (!graphBuilt) {
    return (
      <aside className="card filter-panel" style={{ width: 280, flexShrink: 0 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Build the knowledge graph first to enable filters.
        </p>
      </aside>
    );
  }

  const Tooltip = ({ label, tooltip, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <label style={labelStyle}>
        {label}
        {children}
      </label>
      {tooltip && (
        <div className="tooltip-container" style={{ marginTop: 6 }}>
          <span>ⓘ</span>
          <span className="tooltip-text">{tooltip}</span>
        </div>
      )}
    </div>
  );

  return (
    <aside className="filter-panel-container card" style={{ 
      width: 280, 
      flexShrink: 0, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 12,
    }}>
      <h3 style={{ fontSize: '0.95rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
        🔍 Filters 
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
          ({allOptions.vessel_count} vessels)
        </span>
      </h3>

      {/* Category */}
      <Tooltip 
        label="Category"
        tooltip="Vessel classification category (e.g., Tanker, Cargo, Container)"
      >
        <select 
          value={filters.category || ''} 
          onChange={e => update('category', e.target.value)}
          title="Select vessel category"
        >
          <option value="">All Categories</option>
          {filteredOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Tooltip>

      {/* Vessel Type */}
      <Tooltip 
        label="Vessel Type"
        tooltip="Specific type of vessel (e.g., Bulk Carrier, Oil Tanker)"
      >
        <select 
          value={filters.vessel_type || ''} 
          onChange={e => update('vessel_type', e.target.value)}
          title="Select vessel type"
        >
          <option value="">All Types</option>
          {filteredOptions.vessel_types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Tooltip>

      {/* Vessel Name */}
      <Tooltip 
        label="Vessel Name"
        tooltip="Search by specific vessel name"
      >
        <select 
          value={filters.vessel_name || ''} 
          onChange={e => update('vessel_name', e.target.value)}
          title="Select vessel name"
        >
          <option value="">All Vessels</option>
          {filteredOptions.vessel_names.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </Tooltip>

      {/* Flag */}
      <Tooltip 
        label="Flag"
        tooltip="Country of vessel registration (flag state)"
      >
        <select 
          value={filters.flag || ''} 
          onChange={e => update('flag', e.target.value)}
          title="Select flag country"
        >
          <option value="">All Flags</option>
          {filteredOptions.flags.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Tooltip>

      {/* Validation Status */}
      <Tooltip 
        label="Validation Status"
        tooltip="Data quality status: valid or invalid records"
      >
        <select 
          value={filters.validation_status || ''} 
          onChange={e => update('validation_status', e.target.value)}
          title="Select validation status"
        >
          <option value="">All</option>
          {filteredOptions.validation_statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Tooltip>

      {/* Reset */}
      <button
        style={{ marginTop: 8, background: 'var(--border)', color: 'var(--text)' }}
        onClick={() => onChange({})}
        title="Clear all filters and show all vessels"
      >
        ↻ Reset Filters
      </button>
    </aside>
  );
}

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: '0.82rem',
  color: 'var(--text-muted)',
};
