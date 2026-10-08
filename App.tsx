import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Page = "dashboard" | "markets" | "decision" | "onboarding" | "company" | "reports";

type Company = {
  name: string;
  sector: string;
  employees: number;
  founded: number;
  city: string;
};

type Report = {
  id: number;
  year: number;
  revenue: number;
  margin: number;
  employees: number;
  notes: string;
};

type AppData = {
  firstName: string;
  role: string;
  company: Company;
  reports: Report[];
};

const initialData: AppData = {
  firstName: "Alexandre",
  role: "Dirigeant",
  company: {
    name: "Atelier North",
    sector: "Nettoyage industriel",
    employees: 34,
    founded: 2018,
    city: "Lyon",
  },
  reports: [
    {
      id: 1,
      year: 2022,
      revenue: 1980000,
      margin: 17.2,
      employees: 26,
      notes: "Structuration de l’équipe commerciale.",
    },
    {
      id: 2,
      year: 2023,
      revenue: 2350000,
      margin: 18.4,
      employees: 31,
      notes: "Forte croissance du portefeuille grands comptes.",
    },
    {
      id: 3,
      year: 2024,
      revenue: 2620000,
      margin: 15.9,
      employees: 34,
      notes: "Investissements importants et ouverture d’une nouvelle agence.",
    },
  ],
};

const navigation: { id: Page; label: string; icon: IconName }[] = [
  { id: "dashboard", label: "Accueil", icon: "grid" },
  { id: "markets", label: "Marchés publics", icon: "briefcase" },
  { id: "decision", label: "Aide à la décision", icon: "target" },
  { id: "onboarding", label: "Onboarding", icon: "spark" },
  { id: "company", label: "Ma société", icon: "building" },
  { id: "reports", label: "Rapports annuels", icon: "file" },
];

type IconName =
  | "grid"
  | "spark"
  | "building"
  | "file"
  | "bell"
  | "chevron"
  | "arrow-up"
  | "arrow-down"
  | "users"
  | "coins"
  | "percent"
  | "plus"
  | "check"
  | "alert"
  | "menu"
  | "close"
  | "trash"
  | "briefcase"
  | "external"
  | "search"
  | "refresh"
  | "target";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    spark: <><path d="M12 3l1.1 3.4A6.5 6.5 0 0017.6 11L21 12l-3.4 1.1a6.5 6.5 0 00-4.5 4.5L12 21l-1.1-3.4a6.5 6.5 0 00-4.5-4.5L3 12l3.4-1.1a6.5 6.5 0 004.5-4.5L12 3z" /></>,
    building: <><path d="M4 21V5a2 2 0 012-2h9a2 2 0 012 2v16" /><path d="M17 9h2a1 1 0 011 1v11M8 7h1M12 7h1M8 11h1M12 11h1M8 15h1M12 15h1M2 21h20" /></>,
    file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    bell: <><path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    chevron: <path d="M9 18l6-6-6-6" />,
    "arrow-up": <><path d="M12 19V5M6 11l6-6 6 6" /></>,
    "arrow-down": <><path d="M12 5v14M18 13l-6 6-6-6" /></>,
    users: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    coins: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    percent: <><path d="M19 5L5 19M7 5h.01M17 19h.01" /><circle cx="7" cy="5" r="2" /><circle cx="17" cy="19" r="2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <path d="M20 6L9 17l-5-5" />,
    alert: <><path d="M10.3 3.7L2.2 18a2 2 0 001.8 3h16a2 2 0 001.8-3L13.7 3.7a2 2 0 00-3.4 0zM12 9v4M12 17h.01" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="M18 6L6 18M6 6l12 12" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18M10 12v2h4v-2" /></>,
    external: <><path d="M14 3h7v7M10 14L21 3" /><path d="M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
    refresh: <><path d="M20 6v5h-5M4 18v-5h5" /><path d="M18.5 9A7 7 0 006 6.5L4 11M5.5 15A7 7 0 0018 17.5l2-4.5" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button className={`button button-${variant} ${className}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

const money = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

const shortMoney = (value: number) => `${(value / 1000000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} M€`;

function KpiCard({
  label,
  value,
  change,
  icon,
  tone,
  sublabel,
}: {
  label: string;
  value: string;
  change?: number;
  icon: IconName;
  tone: string;
  sublabel?: string;
}) {
  const positive = (change ?? 0) >= 0;
  return (
    <article className="card kpi-card">
      <div className={`kpi-icon ${tone}`}><Icon name={icon} size={19} /></div>
      <div className="kpi-copy">
        <span className="eyebrow">{label}</span>
        <strong>{value}</strong>
        {change !== undefined ? (
          <span className={`trend ${positive ? "positive" : "negative"}`}>
            <Icon name={positive ? "arrow-up" : "arrow-down"} size={13} />
            {Math.abs(change).toLocaleString("fr-FR", { maximumFractionDigits: 1 })}% <em>vs N-1</em>
          </span>
        ) : <span className="muted-small">{sublabel}</span>}
      </div>
    </article>
  );
}

function RevenueChart({ reports }: { reports: Report[] }) {
  const sorted = [...reports].sort((a, b) => a.year - b.year);
  const max = Math.max(...sorted.map((r) => r.revenue), 1) * 1.15;
  const min = Math.min(...sorted.map((r) => r.revenue), 0) * 0.85;
  const range = max - min || 1;
  const points = sorted.map((report, index) => ({
    x: sorted.length === 1 ? 50 : 8 + (index / (sorted.length - 1)) * 84,
    y: 82 - ((report.revenue - min) / range) * 65,
    report,
  }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = points.length ? `${line} L ${points[points.length - 1].x} 87 L ${points[0].x} 87 Z` : "";

  return (
    <div className="chart-wrap">
      <svg className="chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Évolution du chiffre d’affaires">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[22, 44, 66, 87].map((y) => <line key={y} x1="5" y1={y} x2="96" y2={y} className="grid-line" />)}
        <path d={area} fill="url(#chartGradient)" />
        <path d={line} className="chart-line" vectorEffect="non-scaling-stroke" />
        {points.map((point) => <circle key={point.report.year} cx={point.x} cy={point.y} r="1.8" className="chart-dot" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="chart-labels">
        {points.map((point) => (
          <div key={point.report.year}>
            <strong>{shortMoney(point.report.revenue)}</strong>
            <span>{point.report.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ data, onNavigate }: { data: AppData; onNavigate: (page: Page) => void }) {
  const sorted = [...data.reports].sort((a, b) => b.year - a.year);
  const current = sorted[0];
  const previous = sorted[1];
  const revenueChange = current && previous && previous.revenue ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
  const employeeChange = current && previous && previous.employees ? ((current.employees - previous.employees) / previous.employees) * 100 : 0;
  const marginChange = current && previous ? current.margin - previous.margin : 0;

  const alerts = [
    ...(marginChange <= -2 ? [{ tone: "warning", title: "Érosion de la marge", text: `La marge recule de ${Math.abs(marginChange).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} points sur le dernier exercice.` }] : []),
    ...(revenueChange < 0 ? [{ tone: "danger", title: "Baisse du chiffre d’affaires", text: `Le CA a diminué de ${Math.abs(revenueChange).toFixed(1)} % par rapport à N-1.` }] : []),
    ...(employeeChange > 8 ? [{ tone: "info", title: "Effectif en croissance", text: `L’équipe a progressé de ${employeeChange.toFixed(1)} % en un an. Anticipez vos besoins.` }] : []),
  ];

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <span className="date-label">SYNTHÈSE · EXERCICE {current?.year ?? "—"}</span>
          <h1>Bonjour {data.firstName},</h1>
          <p>Voici l’essentiel à retenir sur votre activité.</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" onClick={() => onNavigate("reports")}><Icon name="plus" size={17} /> Ajouter un rapport</Button>
          <Button onClick={() => onNavigate("decision")}><Icon name="target" size={17} /> Décider sur un marché</Button>
        </div>
      </header>

      <section className="kpi-grid">
        <KpiCard label="Chiffre d’affaires" value={current ? shortMoney(current.revenue) : "—"} change={revenueChange} icon="coins" tone="blue" />
        <KpiCard label="Marge nette" value={current ? `${current.margin.toLocaleString("fr-FR")} %` : "—"} change={marginChange} icon="percent" tone="violet" />
        <KpiCard label="Effectif" value={current ? `${current.employees}` : "—"} change={employeeChange} icon="users" tone="green" />
        <KpiCard label="Dernière mise à jour" value={current ? `${current.year}` : "—"} icon="check" tone="sand" sublabel="Données à jour" />
      </section>

      <section className="dashboard-grid">
        <article className="card chart-card">
          <div className="card-heading">
            <div><h2>Évolution du chiffre d’affaires</h2><p>Historique sur les {data.reports.length} derniers exercices</p></div>
            <span className="pill">Chiffre d’affaires</span>
          </div>
          <RevenueChart reports={data.reports} />
        </article>

        <aside className="card alerts-card">
          <div className="card-heading">
            <div><h2>Points d’attention</h2><p>{alerts.length} signal{alerts.length > 1 ? "aux" : ""} détecté{alerts.length > 1 ? "s" : ""}</p></div>
            <span className="count-badge">{alerts.length}</span>
          </div>
          <div className="alerts-list">
            {alerts.length ? alerts.map((alert, index) => (
              <div className={`alert alert-${alert.tone}`} key={index}>
                <div className="alert-icon"><Icon name="alert" size={17} /></div>
                <div><strong>{alert.title}</strong><p>{alert.text}</p></div>
              </div>
            )) : (
              <div className="empty-state"><Icon name="check" /><strong>Tout est sous contrôle</strong><p>Aucun signal critique détecté.</p></div>
            )}
          </div>
          <button className="text-link" onClick={() => onNavigate("reports")}>Voir les rapports <Icon name="chevron" size={15} /></button>
        </aside>
      </section>

      <section className="card company-strip">
        <div className="company-monogram">{data.company.name.slice(0, 2).toUpperCase()}</div>
        <div className="company-main"><span className="eyebrow">VOTRE ENTREPRISE</span><h2>{data.company.name}</h2><p>{data.company.sector} · {data.company.city}</p></div>
        <div className="company-stat"><span>Création</span><strong>{data.company.founded}</strong></div>
        <div className="company-stat"><span>Effectif</span><strong>{data.company.employees} personnes</strong></div>
        <div className="status-badge"><i /><span>Profil à jour</span></div>
        <Button variant="secondary" onClick={() => onNavigate("company")}>Voir la fiche <Icon name="chevron" size={15} /></Button>
      </section>
    </main>
  );
}

function Onboarding({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(data);
  const reportYears = draft.reports.map((report) => report.year);
  const latestReport = [...draft.reports].sort((a, b) => b.year - a.year)[0];
  const updateCompany = (key: keyof Company, value: string) =>
    setDraft({ ...draft, company: { ...draft.company, [key]: ["employees", "founded"].includes(key) ? Number(value) : value } });

  const next = () => {
    if (step < 3) setStep(step + 1);
    else save(draft);
  };

  return (
    <main className="page narrow-page">
      <header className="page-header onboarding-header">
        <div><span className="date-label">CONFIGURATION</span><h1>Configurez votre espace</h1><p>Trois étapes rapides pour personnaliser vos indicateurs.</p></div>
      </header>
      <div className="stepper">
        {["Votre profil", "Votre société", "Rapports annuels"].map((label, index) => (
          <button className={`step ${step === index + 1 ? "active" : ""} ${step > index + 1 ? "done" : ""}`} onClick={() => setStep(index + 1)} key={label}>
            <span>{step > index + 1 ? <Icon name="check" size={15} /> : index + 1}</span>
            <div><strong>{label}</strong><small>Étape {index + 1}</small></div>
          </button>
        ))}
      </div>
      <section className="card form-card">
        {step === 1 && <>
          <div className="form-intro"><div className="form-icon"><Icon name="users" /></div><div><h2>Faisons connaissance</h2><p>Ces informations nous permettent de personnaliser votre expérience.</p></div></div>
          <div className="form-grid">
            <Field label="Prénom" value={draft.firstName} onChange={(value) => setDraft({ ...draft, firstName: value })} />
            <Field label="Fonction" value={draft.role} onChange={(value) => setDraft({ ...draft, role: value })} />
          </div>
        </>}
        {step === 2 && <>
          <div className="form-intro"><div className="form-icon"><Icon name="building" /></div><div><h2>Parlez-nous de votre société</h2><p>Renseignez les informations principales de votre entreprise.</p></div></div>
          <div className="form-grid">
            <Field label="Nom de la société" value={draft.company.name} onChange={(v) => updateCompany("name", v)} />
            <Field label="Secteur d’activité" value={draft.company.sector} onChange={(v) => updateCompany("sector", v)} />
            <Field label="Effectif" type="number" value={draft.company.employees} onChange={(v) => updateCompany("employees", v)} />
            <Field label="Année de création" type="number" value={draft.company.founded} onChange={(v) => updateCompany("founded", v)} />
            <Field label="Ville" value={draft.company.city} onChange={(v) => updateCompany("city", v)} />
          </div>
        </>}
        {step === 3 && <>
          <div className="form-intro"><div className="form-icon"><Icon name="file" /></div><div><h2>Vos rapports sont prêts</h2><p>Nous avons détecté {draft.reports.length} exercices. Vous pourrez les compléter à tout moment.</p></div></div>
          <div className="summary-box">
            <div><span>Rapports disponibles</span><strong>{draft.reports.length}</strong></div>
            <div><span>Période couverte</span><strong>{reportYears.length ? `${Math.min(...reportYears)} — ${Math.max(...reportYears)}` : "À compléter"}</strong></div>
            <div><span>Dernier CA déclaré</span><strong>{latestReport ? shortMoney(latestReport.revenue) : "À compléter"}</strong></div>
          </div>
        </>}
        <div className="form-actions">
          <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))}>Retour</Button>
          <Button onClick={next}>{step === 3 ? "Terminer la configuration" : "Continuer"} <Icon name="chevron" size={15} /></Button>
        </div>
      </section>
    </main>
  );
}

function CompanyPage({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [company, setCompany] = useState(data.company);
  const update = (key: keyof Company, value: string) =>
    setCompany({ ...company, [key]: ["employees", "founded"].includes(key) ? Number(value) : value });
  return (
    <main className="page">
      <header className="page-header"><div><span className="date-label">PROFIL ENTREPRISE</span><h1>Ma société</h1><p>Centralisez les informations clés de votre entreprise.</p></div><span className="status-badge large"><i /> Profil à jour</span></header>
      <section className="company-hero card">
        <div className="company-monogram large">{company.name.slice(0, 2).toUpperCase()}</div>
        <div><span className="eyebrow">FICHE ENTREPRISE</span><h2>{company.name}</h2><p>{company.sector} · Fondée en {company.founded}</p></div>
      </section>
      <section className="card form-card company-form">
        <div className="section-title"><h2>Informations générales</h2><p>Gardez vos données à jour pour améliorer la pertinence des analyses.</p></div>
        <div className="form-grid">
          <Field label="Nom de la société" value={company.name} onChange={(v) => update("name", v)} />
          <Field label="Secteur d’activité" value={company.sector} onChange={(v) => update("sector", v)} />
          <Field label="Effectif actuel" type="number" value={company.employees} onChange={(v) => update("employees", v)} />
          <Field label="Année de création" type="number" value={company.founded} onChange={(v) => update("founded", v)} />
          <Field label="Ville du siège" value={company.city} onChange={(v) => update("city", v)} />
        </div>
        <div className="form-actions"><span className="save-note"><Icon name="check" size={14} /> Sauvegarde locale et sécurisée</span><Button onClick={() => save({ ...data, company })}>Enregistrer les modifications</Button></div>
      </section>
    </main>
  );
}

function ReportsPage({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState({ year: new Date().getFullYear() - 1, revenue: 0, margin: 0, employees: data.company.employees, notes: "" });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save({ ...data, reports: [...data.reports.filter((item) => item.year !== report.year), { ...report, id: Date.now() }] });
    setShowForm(false);
  };

  return (
    <main className="page">
      <header className="page-header"><div><span className="date-label">DONNÉES FINANCIÈRES</span><h1>Rapports annuels</h1><p>Suivez l’évolution de votre performance exercice après exercice.</p></div><Button onClick={() => setShowForm(!showForm)}><Icon name={showForm ? "close" : "plus"} size={17} /> {showForm ? "Fermer" : "Ajouter un rapport"}</Button></header>
      {showForm && (
        <form className="card report-form" onSubmit={submit}>
          <div className="section-title"><h2>Nouvel exercice</h2><p>Ajoutez les indicateurs consolidés de votre rapport annuel.</p></div>
          <div className="form-grid report-fields">
            <Field label="Exercice" type="number" value={report.year} onChange={(v) => setReport({ ...report, year: Number(v) })} />
            <Field label="Chiffre d’affaires (€)" type="number" value={report.revenue} onChange={(v) => setReport({ ...report, revenue: Number(v) })} />
            <Field label="Marge nette (%)" type="number" value={report.margin} onChange={(v) => setReport({ ...report, margin: Number(v) })} />
            <Field label="Effectif moyen" type="number" value={report.employees} onChange={(v) => setReport({ ...report, employees: Number(v) })} />
            <label className="field field-wide"><span>Notes de l’exercice</span><textarea value={report.notes} onChange={(e) => setReport({ ...report, notes: e.target.value })} placeholder="Contexte, faits marquants, investissements…" /></label>
          </div>
          <div className="form-actions"><Button variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button><Button type="submit">Enregistrer le rapport</Button></div>
        </form>
      )}
      <section className="reports-list">
        {[...data.reports].sort((a, b) => b.year - a.year).map((item, index, all) => {
          const previous = all[index + 1];
          const evolution = previous && previous.revenue ? ((item.revenue - previous.revenue) / previous.revenue) * 100 : null;
          return (
            <article className="card report-row" key={item.id}>
              <div className="report-year"><span>EXERCICE</span><strong>{item.year}</strong>{index === 0 && <em>Le plus récent</em>}</div>
              <div className="report-metric"><span>Chiffre d’affaires</span><strong>{money(item.revenue)}</strong>{evolution !== null && <small className={evolution >= 0 ? "positive" : "negative"}>{evolution >= 0 ? "+" : ""}{evolution.toFixed(1)} % vs N-1</small>}</div>
              <div className="report-metric"><span>Marge nette</span><strong>{item.margin.toLocaleString("fr-FR")} %</strong><small>Résultat net / CA</small></div>
              <div className="report-metric"><span>Effectif</span><strong>{item.employees}</strong><small>Collaborateurs</small></div>
              <div className="report-notes"><span>Note</span><p>{item.notes || "Aucune note pour cet exercice."}</p></div>
              <button className="icon-button danger-hover" aria-label={`Supprimer le rapport ${item.year}`} onClick={() => save({ ...data, reports: data.reports.filter((r) => r.id !== item.id) })}><Icon name="trash" size={17} /></button>
            </article>
          );
        })}
      </section>
    </main>
  );
}

type BoampFacet = { name: string; count: number };
type BoampRecord = {
  recordid: string;
  fields: {
    idweb?: string;
    objet?: string;
    nomacheteur?: string;
    titulaire?: string;
    dateparution?: string;
    datelimitereponse?: string;
    code_departement?: string | string[];
    procedure_libelle?: string;
    url_avis?: string;
  };
};
type BoampResponse = {
  nhits: number;
  records: BoampRecord[];
  facet_groups?: { name: string; facets: BoampFacet[] }[];
};

const BOAMP_API = "https://boamp-datadila.opendatasoft.com/api/records/1.0/search/";

const goNoGoCriteria = [
  { id: "fit", label: "Le besoin correspond-il à notre savoir-faire ?", description: "Prestations, méthodes, certifications et niveau de qualité demandés.", weight: 20 },
  { id: "capacity", label: "Avons-nous assez de personnel disponible ?", description: "Équipes mobilisables sans fragiliser les contrats actuels.", weight: 20 },
  { id: "references", label: "Avons-nous des références comparables ?", description: "Références récentes auprès de collectivités ou grands sites.", weight: 15 },
  { id: "margin", label: "Le marché peut-il être rentable ?", description: "Prix cible, masse salariale, matériel et déplacements inclus.", weight: 20 },
  { id: "deadline", label: "Pouvons-nous répondre dans les temps ?", description: "Temps disponible pour analyser le DCE et produire les pièces.", weight: 10 },
  { id: "competition", label: "Avons-nous un avantage différenciant ?", description: "Proximité, qualité, spécialisation ou organisation par rapport aux concurrents.", weight: 15 },
] as const;

type CriterionId = (typeof goNoGoCriteria)[number]["id"];
type FinalDecision = "pending" | "go" | "no-go";

function canonicalCompany(name: string) {
  const normalized = name.toUpperCase();
  const groups = [
    ["ONET", "Onet"],
    ["DERICHEBOURG", "Derichebourg Propreté"],
    ["ATALIAN", "Atalian Propreté"],
    ["SAMSIC", "Samsic Facility"],
    ["ABER", "Aber Propreté"],
    ["GSF", "GSF"],
  ];
  return groups.find(([needle]) => normalized.includes(needle))?.[1] ?? name.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) return "Date non précisée";
  if (Number.isNaN(new Date(value).getTime())) return "Date non précisée";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function MarketsPage({
  data,
  decisionMode = false,
  onOpenDecision,
}: {
  data: AppData;
  decisionMode?: boolean;
  onOpenDecision?: (offerId: string) => void;
}) {
  const { company, reports } = data;
  const [query, setQuery] = useState("nettoyage des locaux");
  const [activeQuery, setActiveQuery] = useState("nettoyage des locaux");
  const [opportunities, setOpportunities] = useState<BoampResponse | null>(null);
  const [history, setHistory] = useState<BoampResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [scores, setScores] = useState<Record<CriterionId, number>>(() => {
    try {
      const stored = localStorage.getItem("mxw-go-no-go-scores");
      if (!stored) return { fit: 5, capacity: 3, references: 5, margin: 3, deadline: 3, competition: 5 };
      const parsed = { fit: 5, capacity: 3, references: 5, margin: 3, deadline: 3, competition: 5, ...JSON.parse(stored) } as Record<CriterionId, number>;
      return Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [key, value >= 4 ? 5 : value <= 2 ? 1 : 3]),
      ) as Record<CriterionId, number>;
    } catch {
      return { fit: 5, capacity: 3, references: 5, margin: 3, deadline: 3, competition: 5 };
    }
  });
  const [finalDecision, setFinalDecision] = useState<FinalDecision>(() => {
    return (localStorage.getItem("mxw-go-no-go-decision") as FinalDecision | null) ?? "pending";
  });
  const [decisionSaved, setDecisionSaved] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(() => localStorage.getItem("mxw-selected-offer"));
  const [peopleRequired, setPeopleRequired] = useState(() => Number(localStorage.getItem("mxw-offer-people")) || 8);

  useEffect(() => {
    const controller = new AbortController();
    const createUrl = (nature: string, rows: number, includeFacets = false) => {
      const params = new URLSearchParams({
        dataset: "boamp",
        q: activeQuery,
        rows: String(rows),
        "refine.nature_libelle": nature,
      });
      if (rows) params.set("sort", "dateparution");
      if (includeFacets) params.append("facet", "titulaire");
      return `${BOAMP_API}?${params.toString()}`;
    };

    setLoading(true);
    setError("");
    Promise.all([
      fetch(createUrl("Avis de marché", 8), { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error("La source BOAMP ne répond pas.");
        return response.json() as Promise<BoampResponse>;
      }),
      fetch(createUrl("Résultat de marché", 0, true), { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error("La source BOAMP ne répond pas.");
        return response.json() as Promise<BoampResponse>;
      }),
    ])
      .then(([openNotices, awardedNotices]) => {
        setOpportunities(openNotices);
        setHistory(awardedNotices);
        setSelectedOfferId((current) => current ?? openNotices.records[0]?.recordid ?? null);
      })
      .catch((reason) => {
        if (reason.name !== "AbortError") setError("Impossible de charger les données BOAMP pour le moment. Réessayez dans quelques instants.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [activeQuery, refreshKey]);

  const leaders = useMemo(() => {
    const facets = history?.facet_groups?.find((group) => group.name === "titulaire")?.facets ?? [];
    const aggregated = new Map<string, number>();
    facets.forEach((facet) => {
      const names = facet.name.split(",").map((name) => name.trim()).filter(Boolean);
      const uniqueNames = new Set(names.map(canonicalCompany));
      uniqueNames.forEach((name) => aggregated.set(name, (aggregated.get(name) ?? 0) + facet.count));
    });
    return [...aggregated.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  const topThreeCount = leaders.slice(0, 3).reduce((total, company) => total + company.count, 0);
  const concentration = history?.nhits ? Math.min(100, (topThreeCount / history.nhits) * 100) : 0;
  const verdict = concentration < 20 ? "Marché accessible" : concentration < 40 ? "Concurrence structurée" : "Marché concentré";
  const selectedOffer = opportunities?.records.find((record) => record.recordid === selectedOfferId) ?? opportunities?.records[0];
  const selectedFields = selectedOffer?.fields;
  const selectedDepartments = Array.isArray(selectedFields?.code_departement)
    ? selectedFields.code_departement.join(", ")
    : selectedFields?.code_departement;
  const staffCoverage = company.employees ? Math.round((peopleRequired / company.employees) * 100) : 0;
  const sectorMatch = selectedFields?.objet && /nettoyage|propret|entretien/i.test(selectedFields.objet) ? 92 : 58;
  const deadlineDays = selectedFields?.datelimitereponse
    ? Math.ceil((new Date(selectedFields.datelimitereponse).getTime() - Date.now()) / 86400000)
    : null;
  const decisionScore = Math.round(goNoGoCriteria.reduce((total, criterion) => total + (scores[criterion.id] / 5) * criterion.weight, 0));
  const blockingCriteria = goNoGoCriteria.filter((criterion) => scores[criterion.id] === 1);
  const calculatedDecision = blockingCriteria.length ? "NO GO" : decisionScore >= 70 ? "GO" : decisionScore >= 55 ? "GO SOUS CONDITIONS" : "NO GO";

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      setActiveQuery(query.trim());
      setRefreshKey((key) => key + 1);
    }
  };

  const updateScore = (criterion: CriterionId, score: number) => {
    const next = { ...scores, [criterion]: score };
    setScores(next);
    setDecisionSaved(false);
    localStorage.setItem("mxw-go-no-go-scores", JSON.stringify(next));
  };

  const saveDecision = () => {
    localStorage.setItem("mxw-go-no-go-decision", finalDecision);
    localStorage.setItem("mxw-go-no-go-scores", JSON.stringify(scores));
    setDecisionSaved(true);
  };

  return (
    <main className="page markets-page">
      <header className="page-header markets-header">
        <div>
          <span className="date-label">{decisionMode ? "HUMAN IN THE LOOP · GO / NO GO" : "VEILLE MARCHÉS PUBLICS · API BOAMP"}</span>
          <h1>{decisionMode ? "Décider si nous répondons" : "Votre marché est-il déjà verrouillé ?"}</h1>
          <p>{decisionMode ? "Analysez l’offre, confrontez-la à vos capacités puis prenez la décision finale." : `Analyse des avis et attributions publiés pour le secteur « ${company.sector} ».`}</p>
        </div>
        <span className="source-badge"><i /> Données BOAMP en direct</span>
      </header>

      {!decisionMode && <section className="market-hero">
        <div className="market-hero-copy">
          <span className="mistral-badge"><i /> ANALYSE D’AIDE À LA DÉCISION</span>
          <h2>{loading ? "Analyse du marché en cours…" : verdict}</h2>
          <p>
            {loading
              ? "Nous interrogeons les avis et résultats de marchés publiés par le BOAMP."
              : concentration < 20
                ? "Les attributions sont réparties entre de nombreux opérateurs. Les grands groupes sont présents, mais les données ne montrent pas de verrouillage national du marché."
                : "Quelques opérateurs reviennent fréquemment. Une réponse différenciante et un ciblage géographique précis seront essentiels."}
          </p>
          <div className="hero-meta">
            <span><Icon name="check" size={15} /> Source officielle</span>
            <span><Icon name="refresh" size={15} /> Actualisation à chaque recherche</span>
          </div>
        </div>
        <div className="decision-score">
          <span>INDICE D’OUVERTURE</span>
          <strong>{loading ? "—" : `${Math.max(0, Math.round(100 - concentration))}`}</strong>
          <small>/ 100</small>
          <div className="score-track"><i style={{ width: `${loading ? 0 : 100 - concentration}%` }} /></div>
          <p>Plus l’indice est élevé, plus les attributions semblent dispersées.</p>
        </div>
      </section>}

      {!decisionMode && <form className="market-search card" onSubmit={submitSearch}>
        <div className="search-icon"><Icon name="search" size={19} /></div>
        <label>
          <span>Rechercher un segment BOAMP</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. nettoyage des locaux, propreté industrielle…" />
        </label>
        <Button type="submit"><Icon name="refresh" size={16} /> Analyser</Button>
      </form>}

      {error ? (
        <section className="card api-error">
          <div><Icon name="alert" /><span><strong>Données temporairement indisponibles</strong>{error}</span></div>
          <Button variant="secondary" onClick={() => setRefreshKey((key) => key + 1)}>Réessayer</Button>
        </section>
      ) : (
        <>
          <section className="market-kpis">
            <article className="card market-kpi"><span>AVIS DE MARCHÉ TROUVÉS</span><strong>{loading ? "—" : opportunities?.nhits.toLocaleString("fr-FR")}</strong><p>pour « {activeQuery} »</p></article>
            <article className="card market-kpi"><span>RÉSULTATS HISTORIQUES</span><strong>{loading ? "—" : history?.nhits.toLocaleString("fr-FR")}</strong><p>attributions analysables</p></article>
            <article className="card market-kpi highlight"><span>PART DES 3 PREMIERS</span><strong>{loading ? "—" : `${concentration.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`}</strong><p>des résultats correspondant à la recherche</p></article>
          </section>

          {decisionMode && <section className="decision-flow">
            <div className="flow-steps">
              {[
                ["1", "Comprendre l’offre"],
                ["2", "Mesurer le matching"],
                ["3", "Évaluer humainement"],
                ["4", "Décider"],
              ].map(([number, label], index) => (
                <div className="flow-step active" key={number}>
                  <span>{index < 2 ? <Icon name="check" size={14} /> : number}</span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>

            <div className="offer-matching-grid">
              <article className="card selected-offer-card">
                <div className="offer-card-header">
                  <div><span className="date-label">OFFRE SÉLECTIONNÉE</span><h2>{selectedFields?.objet || "Sélectionnez une offre à évaluer"}</h2></div>
                  {selectedFields?.url_avis && <a className="external-link" href={selectedFields.url_avis} target="_blank" rel="noreferrer">Avis complet <Icon name="external" size={14} /></a>}
                </div>
                <div className="offer-facts">
                  <div><span>Acheteur</span><strong>{selectedFields?.nomacheteur || "Non renseigné"}</strong></div>
                  <div><span>Département</span><strong>{selectedDepartments || "Non renseigné"}</strong></div>
                  <div><span>Publication</span><strong>{formatDate(selectedFields?.dateparution)}</strong></div>
                  <div><span>Date limite</span><strong>{formatDate(selectedFields?.datelimitereponse)}</strong><small>{deadlineDays !== null && deadlineDays >= 0 ? `${deadlineDays} jours restants` : "Échéance à vérifier"}</small></div>
                  <div><span>Procédure</span><strong>{selectedFields?.procedure_libelle || "Voir l’avis BOAMP"}</strong></div>
                  <div><span>Référence BOAMP</span><strong>{selectedFields?.idweb || "Non renseignée"}</strong></div>
                </div>
                <div className="offer-warning"><Icon name="alert" size={18} /><p><strong>À vérifier dans le DCE</strong>Montant estimé, allotissement, certifications exigées, reprise du personnel, fréquence des prestations et critères de notation.</p></div>
              </article>

              <aside className="card matching-card">
                <div className="matching-header">
                  <div><span className="date-label">MATCHING SOCIÉTÉ</span><h2>{company.name}</h2><p>{company.sector} · {company.city}</p></div>
                  <div className="match-score"><strong>{sectorMatch}</strong><span>%</span><small>compatibilité</small></div>
                </div>
                <div className="matching-signals">
                  <div><span><Icon name="check" size={15} /> Secteur d’activité</span><strong>Très bon match</strong></div>
                  <div><span><Icon name={staffCoverage <= 35 ? "check" : "alert"} size={15} /> Capacité humaine</span><strong className={staffCoverage > 35 ? "warning-text" : ""}>{staffCoverage <= 35 ? "Compatible" : "À sécuriser"}</strong></div>
                  <div><span><Icon name="file" size={15} /> Historique financier</span><strong>{reports.length} exercices disponibles</strong></div>
                  <div><span><Icon name="building" size={15} /> Couverture géographique</span><strong>À confirmer</strong></div>
                </div>
                <div className="people-field">
                  <span>Personnes nécessaires pour ce marché</span>
                  <div>
                    <button onClick={() => { const next = Math.max(1, peopleRequired - 1); setPeopleRequired(next); localStorage.setItem("mxw-offer-people", String(next)); }}>−</button>
                    <input type="number" min="1" max={company.employees} value={peopleRequired} onChange={(event) => { const next = Math.max(1, Number(event.target.value)); setPeopleRequired(next); localStorage.setItem("mxw-offer-people", String(next)); }} />
                    <button onClick={() => { const next = peopleRequired + 1; setPeopleRequired(next); localStorage.setItem("mxw-offer-people", String(next)); }}>+</button>
                  </div>
                  <small>{peopleRequired} sur {company.employees} collaborateurs · {staffCoverage} % de l’effectif</small>
                </div>
              </aside>
            </div>
          </section>}

          {decisionMode && <section className="card go-no-go-section">
            <div className="go-no-go-header">
              <div>
                <span className="date-label">ÉVALUATION HUMAINE · ÉTAPE 3</span>
                <h2>La machine suggère, vous tranchez</h2>
                <p>Pour chaque question, répondez Oui, À confirmer ou Non. Un « Non » est bloquant : le score ne remplace jamais votre jugement.</p>
              </div>
              <div className={`calculated-verdict ${calculatedDecision === "GO" ? "go" : calculatedDecision === "NO GO" ? "no-go" : "conditional"}`}>
                <span>RECOMMANDATION CALCULÉE</span>
                <strong>{calculatedDecision}</strong>
                <small>{decisionScore} / 100</small>
              </div>
            </div>

            <div className="criteria-list">
              {goNoGoCriteria.map((criterion) => (
                <div className="criterion-row" key={criterion.id}>
                  <div className="criterion-copy">
                    <div><strong>{criterion.label}</strong><span>Poids {criterion.weight} %</span></div>
                    <p>{criterion.description}</p>
                  </div>
                  <div className="score-buttons" role="group" aria-label={`Évaluation : ${criterion.label}`}>
                    {[
                      { score: 5, label: "Oui", icon: "check" as IconName },
                      { score: 3, label: "À confirmer", icon: "alert" as IconName },
                      { score: 1, label: "Non", icon: "close" as IconName },
                    ].map((choice) => (
                      <button
                        className={`${scores[criterion.id] === choice.score ? "active" : ""} score-${choice.score}`}
                        key={choice.score}
                        onClick={() => updateScore(criterion.id, choice.score)}
                        aria-pressed={scores[criterion.id] === choice.score}
                      >
                        <Icon name={choice.icon} size={14} /> {choice.label}
                      </button>
                    ))}
                  </div>
                  <span className={`criterion-status status-${scores[criterion.id]}`}>
                    {scores[criterion.id] === 1 ? "Bloquant" : scores[criterion.id] === 3 ? "À vérifier" : "Validé"}
                  </span>
                </div>
              ))}
            </div>

            <div className="decision-footer">
              <div className="decision-summary">
                <div className="decision-gauge">
                  <div className="decision-gauge-value" style={{ width: `${decisionScore}%` }} />
                </div>
                <p>
                  {blockingCriteria.length
                    ? `${blockingCriteria.length} critère${blockingCriteria.length > 1 ? "s" : ""} bloquant${blockingCriteria.length > 1 ? "s" : ""} : ${blockingCriteria.map((criterion) => criterion.label).join(", ")}.`
                    : decisionScore >= 70
                      ? "Le dossier présente un niveau de compatibilité suffisant pour engager une réponse."
                      : decisionScore >= 55
                        ? "La réponse est envisageable après sécurisation des critères les moins bien notés."
                        : "Le rapport effort / probabilité de succès paraît insuffisant en l’état."}
                </p>
              </div>
              <div className="final-decision">
                <span>VOTRE DÉCISION</span>
                <div>
                  <button className={finalDecision === "go" ? "selected go-choice" : ""} onClick={() => { setFinalDecision("go"); setDecisionSaved(false); }}><Icon name="check" size={16} /> GO</button>
                  <button className={finalDecision === "no-go" ? "selected no-go-choice" : ""} onClick={() => { setFinalDecision("no-go"); setDecisionSaved(false); }}><Icon name="close" size={16} /> NO GO</button>
                </div>
                <Button onClick={saveDecision} variant={finalDecision === "pending" ? "secondary" : "primary"}>Valider ma décision</Button>
                {decisionSaved && <small><Icon name="check" size={13} /> Décision enregistrée</small>}
              </div>
            </div>
          </section>}

          {!decisionMode && <section className="market-grid">
            <article className="card leaders-card">
              <div className="card-heading">
                <div><h2>Acteurs les plus souvent cités</h2><p>Titulaires parmi les résultats de marchés correspondants</p></div>
                <span className="pill">Historique BOAMP</span>
              </div>
              <div className="leaders-list">
                {loading ? [1, 2, 3, 4, 5].map((item) => <div className="leader-skeleton" key={item} />) : leaders.map((leader, index) => {
                  const maxCount = leaders[0]?.count || 1;
                  return (
                    <div className="leader-row" key={leader.name}>
                      <span className="leader-rank">{index + 1}</span>
                      <div><strong>{leader.name}</strong><div className="leader-bar"><i style={{ width: `${(leader.count / maxCount) * 100}%` }} /></div></div>
                      <span>{leader.count.toLocaleString("fr-FR")} citations</span>
                    </div>
                  );
                })}
              </div>
              <div className="analysis-note">
                <Icon name="target" size={20} />
                <p><strong>Lecture MXW</strong> Les noms sont regroupés lorsque plusieurs variantes évidentes désignent le même groupe. Une citation BOAMP n’équivaut pas nécessairement à un marché unique.</p>
              </div>
            </article>

            <aside className="card recommendation-card">
              <span className="recommendation-label">NOTRE RECOMMANDATION</span>
              <div className="recommendation-icon"><Icon name="check" /></div>
              <h2>Répondre, sous conditions</h2>
              <p>La présence de grands acteurs ne suffit pas à conclure que le marché est fermé. Votre PME peut se différencier sur trois leviers :</p>
              <ul>
                <li><span>01</span><div><strong>Proximité opérationnelle</strong><p>Valoriser les délais d’intervention et l’ancrage local.</p></div></li>
                <li><span>02</span><div><strong>Preuves sectorielles</strong><p>Présenter des références comparables et des indicateurs qualité.</p></div></li>
                <li><span>03</span><div><strong>Lecture des lots</strong><p>Cibler les lots compatibles avec votre capacité plutôt que l’accord-cadre entier.</p></div></li>
              </ul>
              <small>Décision à confirmer après lecture du DCE et analyse de vos capacités.</small>
            </aside>
          </section>}

          <section className="opportunities-section">
            <div className="section-heading">
              <div><span className="date-label">{decisionMode ? "CHANGER D’OFFRE" : "OPPORTUNITÉS À EXAMINER"}</span><h2>{decisionMode ? "Sélectionnez l’offre à évaluer" : "Derniers avis publiés"}</h2></div>
              <span>{opportunities?.records.length ?? 0} avis affichés · triés par date de publication</span>
            </div>
            <div className="opportunities-list">
              {loading ? [1, 2, 3].map((item) => <div className="card opportunity-card loading-card" key={item} />) : opportunities?.records.map((record) => {
                const fields = record.fields;
                const departments = Array.isArray(fields.code_departement) ? fields.code_departement.join(", ") : fields.code_departement;
                return (
                  <article className="card opportunity-card" key={record.recordid}>
                    <div className="opportunity-date"><span>Publié le</span><strong>{formatDate(fields.dateparution)}</strong></div>
                    <div className="opportunity-content">
                      <div className="opportunity-tags"><span>AVIS DE MARCHÉ</span>{departments && <span>DÉP. {departments}</span>}</div>
                      <h3>{fields.objet || "Objet non renseigné"}</h3>
                      <p>{fields.nomacheteur || "Acheteur non renseigné"}</p>
                    </div>
                    <div className="opportunity-deadline"><span>Date limite</span><strong>{formatDate(fields.datelimitereponse)}</strong></div>
                    <div className="opportunity-actions">
                      <button
                        className={selectedOffer?.recordid === record.recordid ? "evaluate-button selected" : "evaluate-button"}
                        onClick={() => {
                          setSelectedOfferId(record.recordid);
                          localStorage.setItem("mxw-selected-offer", record.recordid);
                          if (onOpenDecision && !decisionMode) onOpenDecision(record.recordid);
                          else document.querySelector(".decision-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                      >
                        {selectedOffer?.recordid === record.recordid && decisionMode ? <><Icon name="check" size={14} /> Sélectionnée</> : "Évaluer"}
                      </button>
                      <a className="external-link" href={fields.url_avis} target="_blank" rel="noreferrer" aria-label="Voir l’avis sur BOAMP"><Icon name="external" size={14} /></a>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="data-disclaimer">Source : Bulletin officiel des annonces des marchés publics, jeu de données BOAMP via l’API OpenDataSoft. Les volumes correspondent aux avis contenant les termes recherchés et constituent un signal d’aide à la décision, pas une étude juridique exhaustive.</p>
          </section>
        </>
      )}
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [data, setData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem("mxw-data");
      if (!stored) return initialData;
      const parsed = JSON.parse(stored) as AppData;
      if (!parsed?.company || !Array.isArray(parsed.reports)) return initialData;
      if (parsed.company.sector === "Conseil & services") {
        return { ...parsed, company: { ...parsed.company, sector: "Nettoyage industriel" } };
      }
      return parsed;
    } catch {
      return initialData;
    }
  });

  const alertsCount = useMemo(() => {
    const reports = [...data.reports].sort((a, b) => b.year - a.year);
    if (reports.length < 2) return 0;
    return (reports[0].margin - reports[1].margin <= -2 ? 1 : 0) +
      (reports[0].revenue < reports[1].revenue ? 1 : 0) +
      (reports[1].employees && (reports[0].employees - reports[1].employees) / reports[1].employees > 0.08 ? 1 : 0);
  }, [data.reports]);

  const save = (next: AppData) => {
    setData(next);
    localStorage.setItem("mxw-data", JSON.stringify(next));
  };
  const navigate = (next: Page) => { setPage(next); setMenuOpen(false); };

  return (
    <div className="app-shell">
      <header className="main-navigation">
        <div className="brand"><div className="brand-mark">M</div><div><strong>MXW</strong><span>Decision Studio</span></div></div>
        <nav className={menuOpen ? "open" : ""}>
          {navigation.map((item) => (
            <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => navigate(item.id)}>
              <Icon name={item.icon} size={17} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <div className="nav-company"><div className="mini-logo">{data.company.name.slice(0, 2).toUpperCase()}</div><div><strong>{data.company.name}</strong><span>Profil à jour</span></div></div>
          <div className="notification-wrap">
            <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Icon name="bell" size={18} />{alertsCount > 0 && <b>{alertsCount}</b>}</button>
            {notificationsOpen && <div className="notification-popover"><div><strong>Notifications</strong><span>{alertsCount} nouvelle{alertsCount > 1 ? "s" : ""}</span></div><p><Icon name="alert" size={17} /><span><strong>Marge à surveiller</strong>Votre marge nette recule sur le dernier exercice.</span></p><button onClick={() => { navigate("dashboard"); setNotificationsOpen(false); }}>Voir le tableau de bord</button></div>}
          </div>
          <button className="nav-avatar" onClick={() => navigate("company")} aria-label="Voir le profil">{data.firstName.slice(0, 1)}D</button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}><Icon name={menuOpen ? "close" : "menu"} /></button>
        </div>
      </header>

      <div className="content-shell">
        {page === "dashboard" && <Dashboard data={data} onNavigate={navigate} />}
        {page === "markets" && <MarketsPage data={data} onOpenDecision={() => navigate("decision")} />}
        {page === "decision" && <MarketsPage data={data} decisionMode />}
        {page === "onboarding" && <Onboarding data={data} save={(next) => { save(next); navigate("dashboard"); }} />}
        {page === "company" && <CompanyPage data={data} save={save} />}
        {page === "reports" && <ReportsPage data={data} save={save} />}
      </div>
      {menuOpen && <button className="backdrop" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" />}
    </div>
  );
}
