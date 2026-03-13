import React, { useState, useEffect } from 'react';
import Mermaid from './Mermaid';

const CaseStudy = () => {
  const [expandedSection, setExpandedSection] = useState('introduction');

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(16px, 5vw, 24px)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text)',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 100px)',
      lineHeight: '1.6',
    },
    header: {
      textAlign: 'center',
      marginBottom: 'clamp(20px, 5vw, 32px)',
      borderBottom: '2px solid var(--primary)',
      paddingBottom: '16px',
    },
    mainTitle: {
      fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
      fontWeight: 700,
      marginBottom: '8px',
      color: 'var(--text)',
    },
    subtitle: {
      fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
      color: 'var(--text-muted)',
      fontStyle: 'italic',
    },
    toc: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: 'clamp(12px, 3vw, 24px)',
      marginBottom: 'clamp(20px, 5vw, 32px)',
    },
    tocTitle: {
      fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
      fontWeight: 600,
      marginBottom: '12px',
      color: 'var(--text)',
    },
    tocList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '8px',
    },
    tocItem: {
      padding: '8px 12px',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.2s',
      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
    },
    tocItemActive: {
      background: 'var(--primary)',
      color: '#fff',
    },
    section: {
      marginBottom: 'clamp(25px, 5vw, 40px)',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      marginBottom: '16px',
      padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
      background: 'var(--surface)',
      borderRadius: '6px',
      border: '1px solid var(--border)',
      transition: 'all 0.2s',
      flexWrap: 'wrap',
    },
    sectionHeaderHover: {
      background: 'var(--surface)',
      borderColor: 'var(--primary)',
    },
    sectionTitle: {
      fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
      fontWeight: 700,
      color: 'var(--text)',
      flex: 1,
      minWidth: '200px',
    },
    toggleIcon: {
      fontSize: '1.2rem',
      transition: 'transform 0.2s',
    },
    sectionContent: {
      paddingLeft: 'clamp(8px, 2vw, 16px)',
      paddingRight: 'clamp(8px, 2vw, 16px)',
    },
    subsection: {
      marginBottom: '24px',
    },
    subsectionTitle: {
      fontSize: 'clamp(1rem, 3vw, 1.15rem)',
      fontWeight: 600,
      color: 'var(--primary)',
      marginBottom: '8px',
      marginTop: '16px',
    },
    paragraph: {
      lineHeight: '1.6',
      marginBottom: '12px',
      color: 'var(--text)',
      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
    },
    list: {
      marginLeft: 'clamp(12px, 4vw, 24px)',
      marginBottom: '16px',
    },
    listItem: {
      marginBottom: '8px',
      lineHeight: '1.6',
      color: 'var(--text)',
      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
    },
    codeBlock: {
      background: '#1e1e1e',
      color: '#d4d4d4',
      padding: 'clamp(12px, 3vw, 16px)',
      borderRadius: '6px',
      borderLeft: '4px solid var(--primary)',
      overflow: 'auto',
      fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
      fontFamily: 'Courier New, monospace',
      marginBottom: '16px',
      lineHeight: '1.4',
    },
    diagram: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      padding: 'clamp(12px, 3vw, 16px)',
      borderRadius: '6px',
      fontFamily: 'Courier New, monospace',
      fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
      marginBottom: '16px',
      whiteSpace: 'pre-wrap',
      color: 'var(--text-muted)',
      overflow: 'auto',
    },
    highlightBox: {
      background: 'rgba(88, 166, 255, 0.1)',
      border: '1px solid var(--primary)',
      borderRadius: '6px',
      padding: '16px',
      marginBottom: '16px',
    },
    highlightTitle: {
      fontWeight: 600,
      color: 'var(--primary)',
      marginBottom: '8px',
    },
    flowChart: {
      background: 'var(--surface)',
      border: '2px solid var(--border)',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      textAlign: 'center',
      fontFamily: 'Courier New, monospace',
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
      whiteSpace: 'pre-wrap',
    },
  };

  const sections = [
    {
      id: 'introduction',
      label: 'Introduction',
      icon: '📖',
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: '🎯',
    },
    {
      id: 'problem',
      label: 'What I\'ve Implemented',
      icon: '✅',
    },
    {
      id: 'questions',
      label: 'Tech Stack',
      icon: '💻',
    },
    {
      id: 'exercise',
      label: 'How It Works',
      icon: '⚙️',
    },
    {
      id: 'instructions',
      label: 'Implementation Stack',
      icon: '📋',
    },
    {
      id: 'architecture',
      label: 'System Architecture',
      icon: '🏗️',
    },
    {
      id: 'implementation',
      label: 'What I Actually Built',
      icon: '🔧',
    },
    {
      id: 'endgoal',
      label: 'Future Roadmap',
      icon: '🚀',
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const SectionRenderer = ({ id, title, children }) => {
    const isExpanded = expandedSection === id;
    return (
      <div style={styles.section}>
        <div
          style={{
            ...styles.sectionHeader,
            ...(isExpanded ? styles.sectionHeaderHover : {}),
          }}
          onClick={() => toggleSection(id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>
            {sections.find((s) => s.id === id)?.icon}
          </span>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <span
            style={{
              ...styles.toggleIcon,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>
        </div>
        {isExpanded && <div style={styles.sectionContent}>{children}</div>}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>🚢 Building a Vessel Identification System</h1>
        <p style={styles.subtitle}>
          A hands-on implementation of maritime data validation, graph visualization, and entity resolution
        </p>
      </div>

      <div style={styles.toc}>
        <h3 style={styles.tocTitle}>Table of Contents</h3>
        <ul style={styles.tocList}>
          {sections.map((section) => (
            <li
              key={section.id}
              style={{
                ...styles.tocItem,
                ...(expandedSection === section.id ? styles.tocItemActive : {}),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  expandedSection === section.id
                    ? 'var(--primary)'
                    : 'var(--border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = expandedSection === section.id ? 'var(--primary)' : 'transparent';
              }}
              onClick={() => toggleSection(section.id)}
            >
              {section.icon} {section.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Introduction Section */}
      <SectionRenderer
        id="introduction"
        title="Introduction"
      >
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            I've built a system to help identify and track maritime vessels across multiple data sources. The core problem is that vessel data is messy—
            the same ship might be listed under different names, with changing identifiers (IMO, MMSI), and inconsistent information across registries and AIS feeds.
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>What I Built:</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Data Upload & Validation:</strong> CSV upload with automated validation rules for vessel identifiers, coordinates, and timestamps
              </li>
              <li style={styles.listItem}>
                <strong>Knowledge Graph:</strong> In-memory graph structure (with Neo4j ready) to store vessels and their relationships
              </li>
              <li style={styles.listItem}>
                <strong>Graph Visualization:</strong> Interactive graph viewer using vis-network to explore vessel data visually
              </li>
              <li style={styles.listItem}>
                <strong>Filter & Search:</strong> Dynamic filtering by vessel type, flag, name, and validation status
              </li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* Overview Section */}
      <SectionRenderer id="overview" title="Overview">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            My approach is straightforward: accept CSV files with vessel data, validate them, build a graph, and let users explore visually.
            The data comes from registries (static vessel info) and tracking systems (like AIS feeds with position data). Different sources use different identifiers.
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>The Data I Work With</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>IMO Number:</strong> 7-digit unique identifier assigned by maritime authorities (permanent)
              </li>
              <li style={styles.listItem}>
                <strong>MMSI Number:</strong> 9-digit code used by radio systems (can change with ownership)
              </li>
              <li style={styles.listItem}>
                <strong>Vessel Name:</strong> Often changes with ownership, can be ambiguous
              </li>
              <li style={styles.listItem}>
                <strong>Flag State & Type:</strong> Registration country and vessel classification
              </li>
              <li style={styles.listItem}>
                <strong>Physical Specs:</strong> Length, tonnage, built year (help confirm identity)
              </li>
            </ul>
          </div>

          <div style={styles.highlightBox}>
            <div style={styles.highlightTitle}>🎯 The Challenge</div>
            <p style={styles.paragraph}>
              A vessel record from registry database might have name "Maersk Sealand" with IMO 9012345. The same ship in AIS data might be listed as "SEATRADE" with MMSI 123456789. I had to build a system that figures out these are the same vessel.
            </p>
          </div>
        </div>
      </SectionRenderer>

      {/* Problem Statement Section */}
      <SectionRenderer id="problem" title="What I've Implemented">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            I built a working system with these core features:
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>1. CSV Upload & Data Loading</h4>
            <p style={styles.paragraph}>
              Users can upload a CSV file containing vessel records. The system reads and stores the data in memory for processing.
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>2. Validation Pipeline</h4>
            <p style={styles.paragraph}>
              I implemented 8+ validation rules:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>IMO number format (must be 7 digits)</li>
              <li style={styles.listItem}>MMSI number format (must be 9 digits)</li>
              <li style={styles.listItem}>Geographic coordinates (latitude/longitude bounds)</li>
              <li style={styles.listItem}>Vessel dimensions (length, tonnage, draught)</li>
              <li style={styles.listItem}>Build year (reasonable range)</li>
              <li style={styles.listItem}>Timestamps (not in future)</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>3. Knowledge Graph Building</h4>
            <p style={styles.paragraph}>
              After validation, the system builds a graph where:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}}>Each vessel is a node with properties (name, IMO, MMSI, type, flag, etc.)</li>
              <li style={styles.listItem}}>Relationships connect vessels to their type, flag state, and other attributes</li>
              <li style={styles.listItem}}>Invalid records are marked with red nodes, valid ones with green</li>
              <li style={styles.listItem}}>The graph can be queried and explored visually</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>4. Interactive Visualization</h4>
            <p style={styles.paragraph}>
              The frontend displays the graph using vis-network library. Users can:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem'}>Filter by vessel type, flag, name, or validation status</li>
              <li style={styles.listItem'}>Click nodes to see detailed properties</li>
              <li style={styles.listItem'}>Zoom, pan, and explore the graph</li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* Tech Stack Section */}
      <SectionRenderer id="questions" title="Tech Stack">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            I chose these technologies because they're reliable, well-documented, and easy to work with:
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Frontend</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>React + Vite:</strong> Fast development server, instant HMR, optimized builds
              </li>
              <li style={styles.listItem}>
                <strong>vis-network:</strong> Graph visualization with physics simulation (force-directed layout)
              </li>
              <li style={styles.listItem}>
                <strong>CSS Variables:</strong> Light/dark mode support and consistent theming
              </li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Backend</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>FastAPI + Python:</strong> Modern async API with automatic interactive docs
              </li>
              <li style={styles.listItem}>
                <strong>In-Memory Graph:</strong> Quick prototyping, no external dependencies initially
              </li>
              <li style={styles.listItem}>
                <strong>Neo4j Ready:</strong> Designed to swap in real Neo4j when needed
              </li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Deployment</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Backend:</strong> Vercel (serverless Python functions)
              </li>
              <li style={styles.listItem}>
                <strong>Frontend:</strong> Vercel (static hosting + Vite build)
              </li>
              <li style={styles.listItem}>
                <strong>GitHub:</strong> Two separate repos for clean separation
              </li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* How It Works Section */}
      <SectionRenderer id="exercise" title="How It Works">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            Here's the user workflow I built:
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Step 1: Upload CSV</h4>
            <p style={styles.paragraph}>
              Click the upload button on the Dashboard and select your vessel data CSV. The file gets parsed and stored in application state.
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Step 2: Run Validation</h4>
            <p style={styles.paragraph}>
              Click "Validate" to run the validation pipeline. The system checks each record against the validation rules and marks invalid records.
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Step 3: Build Graph</h4>
            <p style={styles.paragraph}>
              Click "Build Graph" to construct the knowledge graph from validated data. Nodes are created for vessels, types, and flags. Relationships connect them.
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Step 4: Explore</h4>
            <p style={styles.paragraph}>
              Switch to the Knowledge Graph tab. Use filters to find specific vessels or vessel types. Click nodes to see detailed properties.
            </p>
          </div>

          <div style={styles.highlightBox}>
            <div style={styles.highlightTitle}>📚 Sample Data</div>
            <p style={styles.paragraph}>
              The system comes with a sample dataset: <code>case_study_dataset_202509152039.csv</code> with ~1000 vessel records from maritime registries.
            </p>
          </div>
        </div>
      </SectionRenderer>

      {/* Implementation Stack Section */}
      <SectionRenderer id="instructions" title="Implementation Stack">
        <div style={styles.sectionContent}>
          <int style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Tech Stack Components</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Backend Service:</strong> FastAPI (Python) for REST API and data processing
              </li>
              <li style={styles.listItem}>
                <strong>Frontend Interface:</strong> React + Vite with vis-network for graph visualization
              </li>
              <li style={styles.listItem}>
                <strong>Graph Database:</strong> In-memory implementation (Neo4j-compatible interface ready for upgrade)
              </li>
              <li style={styles.listItem}>
                <strong>Deployment:</strong> Vercel for both backend (serverless) and frontend (static)
              </li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Core Features Implemented</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>✅ CSV file upload and parsing</li>
              <li style={styles.listItem}>✅ Data validation with 8+ validation rules</li>
              <li style={styles.listItem}>✅ Knowledge graph construction (vessels, types, flags)</li>
              <li style={styles.listItem}>✅ Interactive graph visualization with filtering</li>
              <li style={styles.listItem}>✅ Node click-through for detailed properties</li>
              <li style={styles.listItem}>✅ Responsive UI with light/dark mode</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Backend API Endpoints</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}><code>POST /api/upload</code> - Upload CSV file</li>
              <li style={styles.listItem}><code>POST /api/validate</code> - Run validation pipeline</li>
              <li style={styles.listItem}><code>POST /api/build-graph</code> - Build knowledge graph</li>
              <li style={styles.listItem'><code>GET /api/kg/data</code> - Fetch graph data with filters</li>
              <li style={styles.listItem}><code>GET /api/kg/filters</code> - Get available filter options</li>
              <li style={styles.listItem}><code>GET /api/status</code> - Check current system state</li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* System Architecture Section */}
      <SectionRenderer id="architecture" title="System Architecture">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            My system separates concerns between frontend and backend, with each handling specific responsibilities:
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Backend Flow</h4>
            <p style={styles.paragraph}>
              User uploads CSV → Parser reads data → Validation pipeline checks each record → Knowledge graph builder constructs relationships → Data stored in memory/graph
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Frontend Flow</h4>
            <p style={styles.paragraph}>
              React components manage state → User clicks buttons → API calls to backend → Graph data returned → vis-network renders visualization
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Why This Architecture</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Separation of concerns:</strong> Backend handles data, frontend handles UI</li>
              <li style={styles.listItem}><strong>Scalability:</strong> Easy to add Neo4j later without affecting frontend</li>
              <li style={styles.listItem}><strong>Testability:</strong> API endpoints can be tested independently</li>
              <li style={styles.listItem}><strong>Independent deployment:</strong> Two separate repos for clean versioning</li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* Implementation Details Section */}
      <SectionRenderer id="implementation" title="What I Actually Built">
        <div style={styles.sectionContent}>
          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Validation Rules</h4>
            <p style={styles.paragraph}>
              I implemented validation for IMO/MMSI formats, geographic coordinates, vessel dimensions, build year, and log timestamps. Each rule marks records as valid/invalid.
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Graph Construction</h4>
            <p style={styles.paragraph}>
              For each vessel record, I create a Vessel node with all its properties, then create type/flag/class relationships. Valid vessels get green nodes, invalid get red.
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Filtering</h4>
            <p style={styles.paragraph}>
              Users can filter by vessel type, flag state, name search, or validation status. The frontend sends filter parameters to the backend, which returns matching graph data.
            </p>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Visualization</h4>
            <p style={styles.paragraph}>
              vis-network renders the graph with physics simulation (force-directed layout). Nodes are draggable, zoomable, and clickable for details.
            </p>
          </div>
        </div>
      </SectionRenderer>

      {/* Future Roadmap Section */}
      <SectionRenderer id="endgoal" title="Future Roadmap">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            Here's what I want to build next to make this system more powerful:
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>🔮 Advanced Entity Matching</h4>
            <p style={styles.paragraph}>
              Right now I handle basic validation. Next, I want to implement fuzzy matching to automatically detect when two vessels in the dataset are likely the same vessel (e.g., same IMO but different names). This would reduce duplicate manual work of identifying duplicates.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Similarity scoring algorithm (IMO, name, specs, flag)</li>
              <li style={styles.listItem}>Merge duplicate records automatically</li>
              <li style={styles.listItem}>Before/after comparison for data cleanup</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>💬 Natural Language Chat Interface</h4>
            <p style={styles.paragraph}>
              Currently users have to understand the graph structure to explore. I want to add a chat interface where users can ask questions in plain English like "Show me all tankers registered in Singapore" or "Find vessels that changed their name recently", and the system formulates Cypher queries automatically.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>LLM-based query generation from natural language</li>
              <li style={styles.listItem}>Chat history and session context</li>
              <li style={styles.listItem}>Response grounding to prevent hallucinations (only say what the data shows)</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>🎨 Interactive Drawing Tool</h4>
            <p style={styles.paragraph}>
              Let users draw relationships directly in the graph (like draw.io style). "I think these two vessels are the same person—drag to connect them and add a note." This would speed up manual entity resolution work.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Click and drag to create new relationships</li>
              <li style={styles.listItem}>Annotate with confidence scores and reasoning</li>
              <li style={styles.listItem}>Export corrected graph</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>📊 Neo4j Production Database</h4>
            <p style={styles.paragraph}>
              The current in-memory graph works for prototyping but doesn't persist data. I want to connect to a real Neo4j instance so data is durable and can be queried with full Cypher language support.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Neo4j cloud instance (Aura)</li>
              <li style={styles.listItem}>Data persistence across sessions</li>
              <li style={styles.listItem}>Full Cypher query support</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>📈 Performance & Scale</h4>
            <p style={styles.paragraph}>
              Currently tested with ~1000 vessels. I want to handle 100,000+ vessels efficiently with pagination, lazy loading, and query optimization.
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Pagination and virtual scrolling for large datasets</li>
              <li style={styles.listItem}>Query result caching</li>
              <li style={styles.listItem}>Batch graph updates for large imports</li>
            </ul>
          </div>

          <div style={styles.highlightBox}>
            <div style={styles.highlightTitle}>🚀 Deployment Next Steps</div>
            <p style={styles.paragraph}>
              The system is deployed and working locally. Next priorities: get Neo4j connected, add the chat interface, and stress-test with real maritime datasets.
            </p>
          </div>
        </div>
      </SectionRenderer>

      <div style={{ height: '20px' }} />
    </div>
  );
};

export default CaseStudy;
