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
      label: 'Problem Statement',
      icon: '⚠️',
    },
    {
      id: 'questions',
      label: 'Key Questions',
      icon: '❓',
    },
    {
      id: 'exercise',
      label: 'Exercise',
      icon: '✏️',
    },
    {
      id: 'instructions',
      label: 'Instructions',
      icon: '📋',
    },
    {
      id: 'architecture',
      label: 'System Architecture',
      icon: '🏗️',
    },
    {
      id: 'implementation',
      label: 'Implementation Details',
      icon: '⚙️',
    },
    {
      id: 'endgoal',
      label: 'End Goal',
      icon: '🎁',
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
        <h1 style={styles.mainTitle}>🚢 Case Study: Vessel Identification & AI Agent</h1>
        <p style={styles.subtitle}>
          A comprehensive system design for maritime vessel identity resolution with AI-powered retrieval
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
            Vessel data across multiple systems is inherently inconsistent and fragmented. This case study demonstrates 
            an AI-driven approach to maritime vessel identity resolution, addressing the challenge of disambiguating 
            vessel records when data quality and consistency issues are present across distributed sources.
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Key Technical Areas:</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Data Engineering:</strong> Methodology for cleaning and normalizing maritime data from heterogeneous sources
              </li>
              <li style={styles.listItem}>
                <strong>Entity Resolution:</strong> Machine learning and algorithmic approaches to determine vessel identity from multiple data attributes
              </li>
              <li style={styles.listItem}>
                <strong>Knowledge Graph Architecture:</strong> Graph-based representation enabling efficient querying and relationship discovery
              </li>
              <li style={styles.listItem}>
                <strong>System Design:</strong> Integration of multiple data sources with automated validation and conflict resolution
              </li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* Overview Section */}
      <SectionRenderer id="overview" title="Overview">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            The core objective is to resolve the vessel identity problem, where data from multiple sources must be 
            analyzed to establish a unified, canonical representation of each vessel. Multiple identifiers can represent 
            the same vessel, and consistency issues across data sources complicate this process.
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Data Sources</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Static Registry Data:</strong> Vessel classification, registration jurisdiction, ownership, and historical characteristics
              </li>
              <li style={styles.listItem}>
                <strong>Dynamic AIS Data:</strong> Real-time position reporting, route information, and current voyage parameters
              </li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Primary Identifiers</h4>
            <Mermaid chart={`graph LR
    A["Vessel Identity"] --> B["IMO Number<br/>(International Standard)"]
    A --> C["MMSI Number<br/>(Operational Identifier)"]
    B --> D["7 digits<br/>Permanent Identifier"]
    C --> E["9 digits<br/>Subject to Change"]
    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style B fill:#10b981,stroke:#065f46,color:#fff
    style C fill:#f59e0b,stroke:#92400e,color:#fff`}
            />
          </div>

          <div style={styles.highlightBox}>
            <div style={styles.highlightTitle}>🎯 Central Problem</div>
            <p style={styles.paragraph}>
              Multiple systems track overlapping vessel data using different identifiers and update schedules. 
              The system must establish equivalence between records representing the same physical vessel across heterogeneous sources.
            </p>
          </div>
        </div>
      </SectionRenderer>

      {/* Problem Statement Section */}
      <SectionRenderer id="problem" title="Problem Statement">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            Vessel data in operational systems exhibits systematic inconsistencies across multiple dimensions:
          </p>

          <Mermaid chart={`graph TB
    A["Reality Check:<br/>Raw Vessel Data"] --> B["🔴 Bad IMO Numbers<br/>Duplicates, Invalid Formats"]
    A --> C["🔴 Changing MMSIs<br/>When ownership changes"]
    A --> D["🔴 Name Variations<br/>Same ship, different names"]
    A --> E["🔴 One-to-Many Issues<br/>1 IMO → multiple MMSIs"]
    A --> F["🔴 Many-to-One Issues<br/>Multiple IMOs → 1 MMSI"]
    style A fill:#ef4444,stroke:#991b1b,color:#fff
    style B fill:#dc2626,stroke:#7f1d1d,color:#fff
    style C fill:#dc2626,stroke:#7f1d1d,color:#fff
    style D fill:#dc2626,stroke:#7f1d1d,color:#fff
    style E fill:#dc2626,stroke:#7f1d1d,color:#fff
    style F fill:#dc2626,stroke:#7f1d1d,color:#fff`}
          />

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>What We Need to Do</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Figure out which records are the same ship.</strong> Even when the data disagrees.
              </li>
              <li style={styles.listItem}>
                <strong>Clean up the conflicts.</strong> Pick the most likely identity.
              </li>
              <li style={styles.listItem}>
                <strong>Build a searchable system.</strong> So people can actually find vessels reliably.
              </li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* Key Questions Section */}
      <SectionRenderer id="questions" title="Technical Requirements">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            The system must address several critical technical challenges:
          </p>

          <ol style={styles.list}>
            <li style={styles.listItem}>
              <strong>Entity Matching Algorithm</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Implement fuzzy matching across vessel identifiers using name similarity, IMO/MMSI correlation, vessel class, and historical age data.
              </p>
            </li>
            <li style={styles.listItem}>
              <strong>Data Quality Assessment</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Validate identifier formats, detect structural anomalies in IMO and MMSI codes, and flag registrations in non-existent jurisdictions.
              </p>
            </li>
            <li style={styles.listItem}>
              <strong>Temporal Tracking</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Maintain versioned records with timestamps to establish vessel identity evolution across ownership changes and name modifications.
              </p>
            </li>
            <li style={styles.listItem}>
              <strong>Conflict Resolution Framework</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Apply scoring algorithms and human-in-the-loop validation to establish canonical vessel identities when sources disagree.
              </p>
            </li>
            <li style={styles.listItem}>
              <strong>Architecture & Performance</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Deploy graph database architecture for relationship queries, implement structured query patterns, and apply caching strategies for operational efficiency.
              </p>
            </li>
            <li style={styles.listItem}>
              <strong>Conversational AI Integration</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Translate natural language queries to structured database queries via LLM, with validation mechanisms to prevent hallucination.
              </p>
            </li>
            <li style={styles.listItem}>
              <strong>Grounding Mechanisms</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Implement data validation layers and query verification procedures to ensure AI responses are grounded in actual database results.
              </p>
            </li>
            <li style={styles.listItem}>
              <strong>Performance Metrics</strong>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Measure system accuracy, response latency, user satisfaction, and establish baseline performance indicators.
              </p>
            </li>
          </ol>
        </div>
      </SectionRenderer>

      {/* Exercise Section */}
      <SectionRenderer id="exercise" title="System Requirements">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            The system must demonstrate the following capabilities:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>
              ✅ <strong>Data Analysis</strong> - Parse and understand vessel data attributes and structure
            </li>
            <li style={styles.listItem}>
              ✅ <strong>Entity Matching Implementation</strong> - Implement fuzzy matching and scoring algorithms for vessel identity resolution
            </li>
            <li style={styles.listItem}>
              ✅ <strong>System Architecture Diagram</strong> - Visualize data flow from source to end-user interface
            </li>
            <li style={styles.listItem}>
              ✅ <strong>Technology Selection & Justification</strong> - Select appropriate database, API, and tooling with documented rationale
            </li>
            <li style={styles.listItem}>
              ✅ <strong>AI Pipeline Documentation</strong> - Explain query processing from natural language input through database response
            </li>
            <li style={styles.listItem}>
              ✅ <strong>Performance Optimization</strong> - Implement caching and query optimization strategies
            </li>
          </ul>

          <div style={styles.highlightBox}>
            <div style={styles.highlightTitle}>📊 Provided Dataset:</div>
            <p style={styles.paragraph}>
              <code>case_study_dataset_202509152039.csv</code> - Contains vessel records with IMO, MMSI, names, vessel types, flag states, dimensions, and related attributes
            </p>
          </div>
        </div>
      </SectionRenderer>

      {/* Instructions Section */}
      <SectionRenderer id="instructions" title="Implementation Stack">
        <div style={styles.sectionContent}>
          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Technology Components</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Backend Service:</strong> Python-based REST API for data processing and entity resolution
              </li>
              <li style={styles.listItem}>
                <strong>Frontend Interface:</strong> React-based UI for data visualization and query interaction (current application)
              </li>
              <li style={styles.listItem}>
                <strong>Graph Database:</strong> Neo4j for relationship modeling and efficient querying
              </li>
              <li style={styles.listItem}>
                <strong>Conversational AI:</strong> LLM-based natural language processing layer
              </li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Evaluation Criteria</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>System design demonstrates architectural thinking and appropriate technology selection</li>
              <li style={styles.listItem}>Implementation is functional with clear code samples that compile and execute</li>
              <li style={styles.listItem}>Analysis includes diagrams documenting data flow and system interactions</li>
              <li style={styles.listItem}>Technical decisions are well-reasoned and documented</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Deliverables</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>✓ A design doc explaining your choices</li>
              <li style={styles.listItem}>✓ Diagrams (Mermaid, draw.io, whatever) showing how it works</li>
              <li style={styles.listItem}>✓ Real code samples that show the concepts</li>
              <li style={styles.listItem}>✓ A README that explains everything</li>
              <li style={styles.listItem}>✓ A working prototype showing the core ideas</li>
            </ul>
          </div>
        </div>
      </SectionRenderer>

      {/* System Architecture Section */}
      <SectionRenderer id="architecture" title="System Architecture">
        <div style={styles.sectionContent}>
          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>How It All Fits Together</h4>
            <Mermaid chart={`graph TD
    A["User Types Question<br/>in Chat"] -->|Natural Language| B["LLM<br/>GPT-4, Claude, etc"]
    B -->|Understands Intent| C["Agent System<br/>Routes to right tool"]
    C -->|Queries| D["Neo4j<br/>Knowledge Graph"]
    C -->|Validates| E["RAG Guard<br/>Fact Checking"]
    D -->|Returns Data| E
    E -->|Fact-checked| F["LLM Replies<br/>in English"]
    F -->|Answer| A
    
    H["Data Pipeline"] -->|Ingest| I["CSV Data"]
    I -->|Validate| J["Validation Rules<br/>Format checks"]
    J -->|Deduplicate| K["Entity Resolver<br/>Fuzzy matching"]
    K -->|Build| D
    
    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style B fill:#8b5cf6,stroke:#5b21b6,color:#fff
    style C fill:#8b5cf6,stroke:#5b21b6,color:#fff
    style D fill:#10b981,stroke:#065f46,color:#fff
    style E fill:#f59e0b,stroke:#92400e,color:#fff
    style F fill:#3b82f6,stroke:#1e40af,color:#fff`}
            />
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Each Piece Does This:</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Validation Pipeline:</strong> "Is this IMO number actually valid? Does it have 7 digits?"
              </li>
              <li style={styles.listItem}>
                <strong>Entity Resolver:</strong> "Records X and Y look like the same ship, should we merge them?"
              </li>
              <li style={styles.listItem}>
                <strong>Knowledge Graph (Neo4j):</strong> Stores all the ships and how they're related
              </li>
              <li style={styles.listItem}>
                <strong>LLM + Agents:</strong> Figures out what the user is actually asking for
              </li>
              <li style={styles.listItem}>
                <strong>RAG Guard:</strong> Makes sure the answer is actually based on real data, not hallucinated
              </li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Data Workflow</h4>
            <Mermaid chart={`graph LR
    A["CSV File"] -->|Parse| B["Raw Records"]
    B -->|Validate| C["Clean Records"]
    C -->|Entity Resolution| D["Groups/Merges"]
    D -->|Build Graph| E["Neo4j DB"]
    E -->|Query| F["Cache Layer"]
    F -->|LLM Processing| G["User Response"]
    
    style A fill:#06b6d4,stroke:#0e7490,color:#fff
    style B fill:#f59e0b,stroke:#92400e,color:#fff
    style C fill:#10b981,stroke:#065f46,color:#fff
    style D fill:#8b5cf6,stroke:#5b21b6,color:#fff
    style E fill:#ec4899,stroke:#831843,color:#fff
    style F fill:#3b82f6,stroke:#1e40af,color:#fff
    style G fill:#10b981,stroke:#065f46,color:#fff`}
            />
          </div>
        </div>
      </SectionRenderer>

      {/* Implementation Details Section */}
      <SectionRenderer id="implementation" title="Implementation Details">
        <div style={styles.sectionContent}>
          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Data Validation Example</h4>
            <div style={styles.codeBlock}>
              {`# Vessel record validation
class VesselValidator:
    def validate_imo(self, imo):
        """IMO must be 7 digits"""
        return isinstance(imo, int) and 1000000 <= imo <= 9999999
    
    def validate_mmsi(self, mmsi):
        """MMSI must be 9 digits"""
        return isinstance(mmsi, int) and 100000000 <= mmsi <= 999999999
    
    def detect_duplicates(self, records):
        """Find potential duplicates by similarity"""
        duplicates = []
        for i, rec1 in enumerate(records):
            for rec2 in records[i+1:]:
                score = similarity_score(rec1, rec2)
                if score > 0.85:  # High similarity threshold
                    duplicates.append((rec1, rec2, score))
        return duplicates`}
            </div>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Entity Resolution Example</h4>
            <div style={styles.codeBlock}>
              {`# Entity resolution and matching
class EntityResolver:
    def match_vessels(self, vessel1, vessel2):
        """Score similarity between two vessel records"""
        score = 0.0
        
        # IMO exact match
        if vessel1.imo == vessel2.imo:
            score += 0.4
        
        # Name similarity (fuzzy)
        name_sim = fuzz.token_set_ratio(
            vessel1.name, vessel2.name
        ) / 100
        score += name_sim * 0.3
        
        # Flag + Type match
        if vessel1.flag == vessel2.flag:
            score += 0.15
        if vessel1.vessel_type == vessel2.vessel_type:
            score += 0.15
        
        return score
    
    def merge_records(self, records, threshold=0.85):
        """Merge duplicate records above threshold"""
        merged_groups = []
        processed = set()
        
        for i, rec in enumerate(records):
            if i in processed:
                continue
            group = [rec]
            for j, other in enumerate(records[i+1:], i+1):
                if j not in processed:
                    if self.match_vessels(rec, other) > threshold:
                        group.append(other)
                        processed.add(j)
            merged_groups.append(group)
        
        return merged_groups`}
            </div>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Knowledge Graph Schema</h4>
            <div style={styles.codeBlock}>
              {`# Neo4j Knowledge Graph Schema
NODES:
  ├── Vessel
  │   ├── imo (unique)
  │   ├── mmsi (can change)
  │   ├── name
  │   ├── flag
  │   ├── vessel_type
  │   ├── built_year
  │   └── gross_tonnage
  │
  ├── VesselType
  │   └── name (e.g., Tanker, Bulk Carrier)
  │
  ├── Country
  │   └── name (flag nations)
  │
  └── Owner/Operator
      └── name

RELATIONSHIPS:
  ├── Vessel -[:IS_TYPE]-> VesselType
  ├── Vessel -[:FLAGGED_BY]-> Country
  ├── Vessel -[:MANAGED_BY]-> Owner
  ├── Vessel -[:FORMER_MMSI]-> Vessel (temporal)
  ├── Vessel -[:POTENTIAL_DUPLICATE]-> Vessel
  └── Owner -[:OWNS]-> Vessel`}
            </div>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>LLM-Powered Query Generation</h4>
            <div style={styles.codeBlock}>
              {`# Multi-agent LLM orchestration
class ConversationalAI:
    def process_query(self, user_query: str) -> QueryResponse:
        """
        1. Parse natural language query
        2. Determine intent (search, filter, aggregate)
        3. Generate Cypher query
        4. Execute with caching
        5. Ground response with data
        """
        
        # Step 1: Intent classification
        intent = self.classify_intent(user_query)
        # "search" | "filter" | "aggregate" | "relationship"
        
        # Step 2: Entity extraction
        entities = self.extract_entities(user_query)
        # {"vessel_name": "...", "flag": "...", ...}
        
        # Step 3: Generate Cypher
        cypher = self.llm_generate_cypher(
            user_query, intent, entities
        )
        
        # Step 4: Execute with caching
        cache_key = hash(cypher)
        if cache_key in self.cache:
            results = self.cache[cache_key]
        else:
            results = self.kg.execute_cypher(cypher)
            self.cache[cache_key] = results
        
        # Step 5: Generate grounded response
        response = self.ground_and_respond(
            user_query, results, cypher
        )
        
        return response`}
            </div>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Caching & Session Management</h4>
            <div style={styles.codeBlock}>
              {`# Query caching and session context
class SessionManager:
    def __init__(self):
        self.session_cache = {}  # User session ID -> context
        self.query_cache = {}    # Query hash -> results
        self.ttl = 3600  # 1 hour cache TTL
    
    def get_session_context(self, user_id: str) -> Dict:
        """Get conversation history and context"""
        if user_id in self.session_cache:
            return self.session_cache[user_id]
        return {"history": [], "filters": {}}
    
    def cache_query(self, query_hash: str, results: Any):
        """Cache query results with TTL"""
        self.query_cache[query_hash] = {
            "results": results,
            "timestamp": time.time()
        }
    
    def get_cached_result(self, query_hash: str) -> Optional[Any]:
        """Get cached result if not expired"""
        if query_hash in self.query_cache:
            cached = self.query_cache[query_hash]
            if time.time() - cached["timestamp"] < self.ttl:
                return cached["results"]
            else:
                del self.query_cache[query_hash]
        return None
    
    def update_session(self, user_id: str, query: str, response: str):
        """Update conversation history"""
        if user_id not in self.session_cache:
            self.session_cache[user_id] = {"history": [], "filters": {}}
        
        self.session_cache[user_id]["history"].append({
            "query": query,
            "response": response,
            "timestamp": time.time()
        })`}
            </div>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>RAG Guard Implementation</h4>
            <div style={styles.codeBlock}>
              {`# RAG guard to prevent hallucinations
class RAGGuard:
    def validate_response(self, response: str, 
                         results: Dict) -> bool:
        """Verify response is grounded in actual data"""
        
        # 1. Check all vessel names mentioned exist in results
        mentioned_vessels = extract_vessel_names(response)
        result_vessels = {v["name"] for v in results}
        
        for vessel in mentioned_vessels:
            if vessel not in result_vessels:
                return False
        
        # 2. Check numeric claims against actual data
        claimed_numbers = extract_numbers(response)
        actual_numbers = extract_result_numbers(results)
        
        for num in claimed_numbers:
            if num not in actual_numbers:
                return False
        
        # 3. Check relationships are factual
        if not self.verify_relationships(response, results):
            return False
        
        return True
    
    def ground_response(self, llm_response: str, 
                       results: Dict) -> str:
        """Ensure response only uses factual data"""
        if not self.validate_response(llm_response, results):
            return self.synthesize_safe_response(results)
        return llm_response`}
            </div>
          </div>
        </div>
      </SectionRenderer>

      {/* End Goal Section */}
      <SectionRenderer id="endgoal" title="Evaluation Criteria">
        <div style={styles.sectionContent}>
          <p style={styles.paragraph}>
            The system implementation will be evaluated on the following dimensions:
          </p>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Technical Competencies</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                ✓ <strong>Semantic Understanding</strong> - Demonstrates clear understanding of vessel identity problem and data quality challenges
              </li>
              <li style={styles.listItem}>
                ✓ <strong>Entity Resolution Algorithm</strong> - Implements effective matching and scoring methodology for vessel disambiguation
              </li>
              <li style={styles.listItem}>
                ✓ <strong>Architecture Design</strong> - System design is logical with justified technology selections
              </li>
              <li style={styles.listItem}>
                ✓ <strong>AI Integration</strong> - Demonstrates understanding of LLM agent patterns and tool orchestration
              </li>
              <li style={styles.listItem}>
                ✓ <strong>Implementation Quality</strong> - Code is functional, well-documented, and demonstrates core concepts
              </li>
            </ul>
          </div>

          <div style={styles.highlightBox}>
            <div style={styles.highlightTitle}>🎯 Success Metrics</div>
            <ul style={styles.list}>
              <li style={styles.listItem}>System correctly processes and disambiguates vessel data with measurable accuracy</li>
              <li style={styles.listItem}>Entity matching algorithm achieves &gt;85% accuracy on test cases</li>
              <li style={styles.listItem}>Natural language interface allows intuitive query construction and response generation</li>
              <li style={styles.listItem}>All LLM responses are grounded in verified database results</li>
              <li style={styles.listItem}>Query caching provides significant performance improvement for repeated queries</li>
              <li style={styles.listItem}>System scales appropriately to handle multiple thousands of vessel records</li>
            </ul>
          </div>

          <div style={styles.subsection}>
            <h4 style={styles.subsectionTitle}>Conceptual Mastery</h4>
            <p style={styles.paragraph}>
              This case study integrates data engineering, machine learning system design, graph database architecture, 
              and large language model integration. A complete implementation demonstrates proficiency in combining multiple 
              technology domains to solve a cohesive real-world problem. The evaluation emphasizes not only functional correctness 
              but also the clarity of technical reasoning, architectural decision-making, and the ability to build systems that 
              are both theoretically sound and practically operational.
            </p>
          </div>
        </div>
      </SectionRenderer>

      <div style={{ height: '20px' }} />
    </div>
  );
};

export default CaseStudy;
