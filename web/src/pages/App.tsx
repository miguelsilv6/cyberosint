import { useState } from 'react';
import { api } from '../api/client';

export function App() {
  const [token, setToken] = useState('');
  const [cases, setCases] = useState<any[]>([]);
  const [caseId, setCaseId] = useState('');
  const [artifacts, setArtifacts] = useState<any[]>([]);

  const login = async () => {
    const data = await api('/auth/login', 'POST', { email: 'admin@local', password: 'admin123' });
    setToken(data.accessToken);
  };

  const loadCases = async () => setCases(await api('/cases', 'GET', undefined, token));
  const createCase = async () => {
    await api('/cases', 'POST', { name: 'Case Demo', description: 'OSINT demo' }, token);
    await loadCases();
  };
  const loadArtifacts = async () => setArtifacts(await api(`/cases/${caseId}/artifacts`, 'GET', undefined, token));

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>Forensic OSINT Platform (MVP)</h1>
      <button onClick={login}>1) Login</button>
      <button onClick={loadCases} disabled={!token}>2) List Cases</button>
      <button onClick={createCase} disabled={!token}>3) Create Case</button>
      <div>
        <h2>Cases</h2>
        <ul>{cases.map((c) => <li key={c.id}>{c.name} - {c.id}</li>)}</ul>
      </div>
      <div>
        <h2>Case Detail Tabs (Skeleton)</h2>
        <input placeholder="Case ID" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
        <button onClick={loadArtifacts} disabled={!token || !caseId}>Artifacts Tab</button>
        <p>Tabs: Ingest | Artifacts | Entities/Graph | IA & Validation | Reports</p>
        <pre>{JSON.stringify(artifacts, null, 2)}</pre>
      </div>
    </div>
  );
}
