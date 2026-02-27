import { useMemo, useState } from 'react';
import { api } from '../api/client';

type CaseItem = { id: string; name: string; description?: string };
type ArtifactItem = {
  id: string;
  sourceType: string;
  sourceUri: string;
  rawSha256: string;
  normalizedSha256?: string;
  status: string;
};

const TABS = ['Ingest', 'Artifacts', 'Entities/Graph', 'IA & Validation', 'Reports'];

// UI em estilo dark-dashboard inspirada em plataformas OSINT operacionais.
export function App() {
  const [token, setToken] = useState('');
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [caseId, setCaseId] = useState('');
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [activeTab, setActiveTab] = useState('Artifacts');
  const [status, setStatus] = useState('Pronto');

  const selectedCase = useMemo(() => cases.find((c) => c.id === caseId), [cases, caseId]);

  const login = async () => {
    const data = await api('/auth/login', 'POST', { email: 'admin@local', password: 'admin123' });
    setToken(data.accessToken);
    setStatus('Login efetuado');
  };

  const loadCases = async () => {
    const response = await api('/cases', 'GET', undefined, token);
    setCases(response);
    if (response?.[0]?.id && !caseId) setCaseId(response[0].id);
    setStatus(`Casos carregados: ${response.length}`);
  };

  const createCase = async () => {
    await api('/cases', 'POST', { name: `Case Demo ${Date.now()}`, description: 'OSINT demo' }, token);
    await loadCases();
    setStatus('Novo caso criado');
  };

  const loadArtifacts = async () => {
    if (!caseId) return;
    const response = await api(`/cases/${caseId}/artifacts`, 'GET', undefined, token);
    setArtifacts(response);
    setStatus(`Artefactos carregados: ${response.length}`);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">FO</div>
          <div>
            <h1>Forensic OSINT</h1>
            <p>MVP Workspace</p>
          </div>
        </div>

        <nav className="menu">
          <button className="menu-item active">Dashboard</button>
          <button className="menu-item">Investigations</button>
          <button className="menu-item">Entities</button>
          <button className="menu-item">Evidence Vault</button>
          <button className="menu-item">Reports</button>
        </nav>

        <div className="sidebar-footer">
          <small>Estado API</small>
          <strong>{token ? 'Autenticado' : 'Não autenticado'}</strong>
        </div>
      </aside>

      <main className="main">
        <header className="topbar card">
          <div>
            <h2>Case Intelligence Console</h2>
            <p>Fluxo: Auth → Cases → Ingest → Normalize → Audit</p>
          </div>
          <div className="topbar-actions">
            <button onClick={login} className="btn primary">Login</button>
            <button onClick={loadCases} className="btn" disabled={!token}>Carregar Cases</button>
            <button onClick={createCase} className="btn" disabled={!token}>Novo Case</button>
          </div>
        </header>

        <section className="stats-grid">
          <article className="card stat">
            <span>Cases</span>
            <strong>{cases.length}</strong>
          </article>
          <article className="card stat">
            <span>Artifacts</span>
            <strong>{artifacts.length}</strong>
          </article>
          <article className="card stat">
            <span>Active Case</span>
            <strong>{selectedCase?.name || '—'}</strong>
          </article>
          <article className="card stat">
            <span>Status</span>
            <strong>{status}</strong>
          </article>
        </section>

        <section className="workspace-grid">
          <article className="card">
            <h3>Cases</h3>
            <div className="case-list">
              {cases.map((c) => (
                <button
                  key={c.id}
                  className={`case-item ${c.id === caseId ? 'selected' : ''}`}
                  onClick={() => setCaseId(c.id)}
                >
                  <span>{c.name}</span>
                  <small>{c.id.slice(0, 8)}...</small>
                </button>
              ))}
            </div>
          </article>

          <article className="card">
            <h3>Case Workspace</h3>
            <div className="tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="panel">
              <div className="panel-actions">
                <input
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="Case ID"
                />
                <button className="btn" onClick={loadArtifacts} disabled={!token || !caseId}>
                  Carregar Artifacts
                </button>
              </div>

              {activeTab === 'Artifacts' ? (
                <div className="artifact-table-wrap">
                  <table className="artifact-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>SHA Raw</th>
                        <th>SHA Normalized</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artifacts.map((a) => (
                        <tr key={a.id}>
                          <td title={a.sourceUri}>{a.id.slice(0, 8)}...</td>
                          <td>{a.sourceType}</td>
                          <td>{a.status}</td>
                          <td>{a.rawSha256?.slice(0, 14)}...</td>
                          <td>{a.normalizedSha256 ? `${a.normalizedSha256.slice(0, 14)}...` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="placeholder">
                  <p>Tab selecionada: <strong>{activeTab}</strong></p>
                  <p>Esta área já está preparada para evolução das próximas fases.</p>
                </div>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
