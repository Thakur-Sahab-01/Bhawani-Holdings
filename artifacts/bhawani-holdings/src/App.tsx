import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Link, useLocation, Router as WouterRouter } from 'wouter';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, CircleHelp, Construction, House, Instagram, Mail, Menu, MessageCircle, Send, X } from 'lucide-react';
import './site.css';

const queryClient = new QueryClient();
const ASSET = '/images/projects/';
const CONTACT = 'maabhawaniconstruction1401@gmail.com';
const WHATSAPP = 'https://wa.me/918853341008';
const CHANNEL = 'https://whatsapp.com/channel/0029Vb90dRyGzzKWmdoPy928';
const SOCIAL = {
  parent: 'https://www.instagram.com/bhawaniholdings/',
  construction: 'https://www.instagram.com/mbcpvtltd/',
  property: 'https://www.instagram.com/mbppvtltd/',
};

type Photo = { image: string; title: string; caption: string; category: string; location?: string; alt: string };
const photos: Photo[] = [
  { image: 'foundation-brick-course.jpg', title: 'Brick foundation course', caption: 'Brickwork laid within an excavated foundation trench.', category: 'Foundation', alt: 'Brick course being laid along a narrow excavated foundation trench' },
  { image: 'on-site-measurement.jpg', title: 'On-site measurement', caption: 'A measuring tape used to check a section of site work.', category: 'Site Development', alt: 'Close view of an on-site measurement using a tape measure' },
  { image: 'brick-boundary-wall-progress.jpg', title: 'Boundary wall masonry', caption: 'Brick boundary-wall construction in progress across an open site.', category: 'Boundary Wall', alt: 'Brick boundary wall at a rural worksite with masonry activity visible' },
  { image: 'boundary-wall-site-work.jpg', title: 'Boundary wall site view', caption: 'Masonry wall and surrounding site conditions.', category: 'Boundary Wall', alt: 'Low brick boundary wall across an open site bordered by trees' },
  { image: 'concrete-compound-wall.jpg', title: 'Concrete compound wall', caption: 'Concrete wall panels and an adjoining site area.', category: 'Site Development', alt: 'Concrete compound wall surrounding an open site' },
  { image: 'boundary-wall-and-masonry.jpg', title: 'Wall and masonry work', caption: 'Boundary wall with brickwork visible along the site edge.', category: 'Masonry', alt: 'Boundary wall with brick masonry and open fields beyond' },
  { image: 'concrete-wall-progress.jpg', title: 'Concrete wall progress', caption: 'Concrete wall panels viewed from the adjoining site.', category: 'Boundary Wall', alt: 'Concrete boundary wall panels at a rural construction site' },
  { image: 'brick-masonry-progress.jpg', title: 'Masonry site view', caption: 'Wall and brickwork elements across an active work area.', category: 'Masonry', alt: 'Masonry and wall elements visible across a construction site' },
  { image: 'pump-house-entrance.jpg', title: 'Pump-house entrance', caption: 'Entrance gate, paved approach and pump-house facility in view.', category: 'Site Development', location: 'Patti, Pratapgarh, Uttar Pradesh', alt: 'Pump-house entrance with blue metal gate, paved approach and boundary wall' },
  { image: 'foundation-team-work.jpg', title: 'Foundation preparation', caption: 'Workers preparing a foundation section on site.', category: 'Foundation', alt: 'Workers preparing a concrete foundation trench by hand' },
];
const categories = ['All Projects', 'Boundary Wall', 'Foundation', 'Masonry', 'Site Development'];
const routeInfo: Record<string, { title: string; description: string }> = {
  '/': { title: 'BHAWANI Holdings | Construction & Real Estate in Uttar Pradesh', description: 'Explore BHAWANI Holdings, bringing Maa Bhawani Construction and Maa Bhawani Properties together.' },
  '/construction': { title: 'Maa Bhawani Construction | BHAWANI Holdings', description: 'Civil construction, infrastructure works and project execution enquiries.' },
  '/properties': { title: 'Maa Bhawani Properties | BHAWANI Holdings', description: 'Relationship-led real estate discovery and brokerage enquiries in Banda, Uttar Pradesh.' },
  '/projects': { title: 'Project photographs | BHAWANI Holdings', description: 'A gallery of supplied Maa Bhawani Construction site photographs.' },
  '/about': { title: 'About BHAWANI Holdings', description: 'The BHAWANI Holdings group and its two business divisions.' },
  '/contact': { title: 'Contact BHAWANI Holdings', description: 'Choose the right contact route for your BHAWANI enquiry.' },
  '/enquiry-construction': { title: 'Construction enquiry | BHAWANI Holdings', description: 'Share details about a construction or civil works requirement.' },
  '/enquiry-property': { title: 'Property enquiry | BHAWANI Holdings', description: 'Share a real estate buyer, seller or property enquiry.' },
  '/enquiry-subcontractors': { title: 'Subcontractor enquiry | BHAWANI Holdings', description: 'Register construction capability and operating area.' },
  '/enquiry-partners': { title: 'Business partner enquiry | BHAWANI Holdings', description: 'Introduce a business partnership proposal to BHAWANI Holdings.' },
  '/privacy': { title: 'Privacy | BHAWANI Holdings', description: 'How information entered on BHAWANI Holdings website forms is handled.' },
};

function useMetadata(path: string) {
  useEffect(() => {
    const meta = routeInfo[path] ?? { title: 'Page not found | BHAWANI Holdings', description: 'The page you are looking for could not be found.' };
    document.title = meta.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.setAttribute('name', 'description'); document.head.appendChild(description); }
    description.setAttribute('content', meta.description);
    let theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) { theme = document.createElement('meta'); theme.setAttribute('name', 'theme-color'); document.head.appendChild(theme); }
    theme.setAttribute('content', '#651e2b');
  }, [path]);
}

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const nav = [['Home', '/'], ['Construction', '/construction'], ['Properties', '/properties'], ['Projects', '/projects'], ['About', '/about'], ['Contact', '/contact']];
  useEffect(() => setOpen(false), [path]);
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand" aria-label="BHAWANI Holdings home"><img src="/images/brand/bhawani-holdings-logo.gif" alt="" /><span><b>BHAWANI</b><small>HOLDINGS</small></span></Link>
      <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        {nav.map(([label, href]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>{label}</Link>)}
        <Link href="/contact" className="nav-enquire">Enquire <ArrowUpRight size={15} /></Link>
      </nav>
      <button className="menu-toggle" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span>{open ? <X /> : <Menu />}</span></button>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer"><div className="footer-main wrap">
    <div className="footer-brand"><Link href="/" className="brand"><img src="/images/brand/bhawani-holdings-logo.gif" alt="" /><span><b>BHAWANI</b><small>HOLDINGS</small></span></Link><p>A Uttar Pradesh business group bringing together construction and real estate conversations.</p><a href={SOCIAL.parent} target="_blank" rel="noreferrer" aria-label="BHAWANI Holdings Instagram" className="social-link"><Instagram size={17} /> Instagram</a></div>
    <div><h3>Explore</h3><Link href="/construction">Maa Bhawani Construction</Link><Link href="/properties">Maa Bhawani Properties</Link><Link href="/projects">Site photographs</Link><Link href="/about">About the group</Link></div>
    <div><h3>Start a conversation</h3><Link href="/enquiry-construction">Construction enquiry</Link><Link href="/enquiry-property">Property enquiry</Link><Link href="/enquiry-subcontractors">Subcontractor enquiry</Link><Link href="/enquiry-partners">Business partner enquiry</Link></div>
    <div><h3>Contact</h3><a href={`mailto:${CONTACT}`}>{CONTACT}</a><a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp · +91 88533 41008</a><a href={CHANNEL} target="_blank" rel="noreferrer">Construction WhatsApp channel</a><Link href="/privacy">Privacy notice</Link></div>
  </div><div className="footer-bottom wrap"><span>© {new Date().getFullYear()} BHAWANI Holdings</span><span>Quality · Trust · Long-term vision</span><span>Uttar Pradesh, India</span></div></footer>;
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([{ text: 'Namaste. I’m the automated BHAWANI website assistant. I can guide you using verified site information and enquiry routes.', user: false }]);
  const answer = (raw: string) => {
    const q = raw.toLowerCase();
    if (/property|real estate|plot|house|land|buy|sell|broker/.test(q)) return <>Maa Bhawani Properties handles relationship-led real estate discovery and brokerage enquiries around Banda, subject to availability. No live listings are shown here; please verify ownership, title, approvals and terms independently. <Link href="/enquiry-property">Property enquiry</Link> or <a href={SOCIAL.property} target="_blank" rel="noreferrer">Instagram @mbppvtltd</a>.</>;
    if (/construction|civil|boundary|pump|build/.test(q)) return <>Maa Bhawani Construction focuses on civil construction, infrastructure work and project execution. <Link href="/enquiry-construction">Construction enquiry</Link> or WhatsApp <a href={WHATSAPP}>+91 88533 41008</a>.</>;
    if (/subcontract/.test(q)) return <>Share your capability through the <Link href="/enquiry-subcontractors">subcontractor enquiry</Link>. For construction contact, WhatsApp <a href={WHATSAPP}>+91 88533 41008</a>.</>;
    if (/partner|collaborat/.test(q)) return <>Introduce a proposal through the <Link href="/enquiry-partners">business partner enquiry</Link>. A submission is a request for contact, not a guarantee of a commercial agreement.</>;
    if (/contact|phone|whatsapp|email/.test(q)) return <>Construction contact: <a href="mailto:maabhawaniconstruction1401@gmail.com">{CONTACT}</a>, WhatsApp <a href={WHATSAPP}>+91 88533 41008</a>. You can also reach <a href={SOCIAL.parent} target="_blank" rel="noreferrer">BHAWANI Holdings</a> or <a href={SOCIAL.property} target="_blank" rel="noreferrer">Maa Bhawani Properties</a> on Instagram.</>;
    if (/where|location|banda/.test(q)) return 'BHAWANI Holdings is based in Uttar Pradesh, India. Maa Bhawani Properties has a local focus around Banda. Please confirm any current office availability directly before visiting.';
    if (/hi|hello|namaste/.test(q)) return 'Namaste. Choose Construction, Property or Contact below, or ask your question.';
    return <>I don’t have a verified answer for that. Please use our <Link href="/contact">contact routes</Link> or an <Link href="/enquiry-construction">enquiry form</Link>. Construction WhatsApp: <a href={WHATSAPP}>+91 88533 41008</a>.</>;
  };
  const send = (text = question) => { const cleaned = text.trim(); if (!cleaned) return; setMessages(current => [...current, { text: cleaned, user: true }, { text: '', user: false }]); setQuestion(''); };
  const submit = (event: FormEvent) => { event.preventDefault(); send(); };
  return <><button className="chat-launch" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="faq-chat"><MessageCircle size={18} /> Ask BHAWANI</button>
    {open && <section id="faq-chat" className="chat-panel" role="dialog" aria-label="Automated BHAWANI FAQ assistant">
      <div className="chat-head"><div><strong>BHAWANI Assistant</strong><small>Automated · verified site facts</small></div><button aria-label="Close assistant" onClick={() => setOpen(false)}><X /></button></div>
      <div className="chat-log" aria-live="polite">{messages.map((msg, index) => <div key={index} className={`chat-message ${msg.user ? 'from-user' : ''}`}>{msg.user ? msg.text : index === 0 ? msg.text : answer(messages[index - 1]?.text || '')}</div>)}</div>
      <div className="chat-quick">{['Construction', 'Property', 'Subcontractor', 'Contact'].map(topic => <button key={topic} onClick={() => send(topic)}>{topic}</button>)}</div>
      <form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="chat-question">Ask a question</label><input id="chat-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a question" /><button aria-label="Send question" type="submit"><Send size={17} /></button></form>
      <div className="chat-foot"><Link href="/contact">All enquiry routes</Link><a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us</a></div>
    </section>}</>;
}

function Layout({ children, path }: { children: ReactNode; path: string }) {
  useMetadata(path);
  return <><a className="skip-link" href="#main">Skip to content</a><Header path={path} /><main id="main">{children}</main><Footer /><ChatWidget /></>;
}

function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div>; }
function SectionHead({ label, title, text }: { label: string; title: ReactNode; text?: string }) {
  return <div className="section-head"><Eyebrow>{label}</Eyebrow><h2 className="serif">{title}</h2>{text && <p>{text}</p>}</div>;
}
function ActionLink({ href, children, kind = 'solid' }: { href: string; children: ReactNode; kind?: 'solid' | 'outline' | 'light' }) {
  return <Link href={href} className={`button button-${kind}`}>{children}<ArrowUpRight size={16} /></Link>;
}
function ExternalAction({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="button button-outline" target="_blank" rel="noreferrer">{children}<ArrowUpRight size={16} /></a>;
}

function Gallery({ limit }: { limit?: number }) {
  const [category, setCategory] = useState('All Projects');
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<Photo | null>(null);
  const filtered = useMemo(() => photos.filter(photo => category === 'All Projects' || photo.category === category).slice(0, limit), [category, limit]);
  const photoIndex = selected === null ? -1 : photos.findIndex(photo => photo.image === filtered[selected]?.image);
  const move = (step: number) => { if (photoIndex < 0) return; const nextPhoto = photos[(photoIndex + step + photos.length) % photos.length]; const nextIndex = filtered.findIndex(photo => photo.image === nextPhoto.image); if (nextIndex >= 0) setSelected(nextIndex); };
  useEffect(() => {
    if (selected === null && !detail) return;
    const handle = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSelected(null); setDetail(null); } if (selected !== null && event.key === 'ArrowRight') move(1); if (selected !== null && event.key === 'ArrowLeft') move(-1); };
    document.addEventListener('keydown', handle); document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handle); document.body.style.overflow = ''; };
  }, [selected, detail, photoIndex, filtered]);
  return <>
    {!limit && <div className="filter-row" aria-label="Filter project photographs">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => { setCategory(item); setSelected(null); }}>{item}</button>)}</div>}
    <div className={`photo-grid ${limit ? 'photo-grid-featured' : ''}`}>{filtered.map((photo, index) => <button key={photo.image} className="photo-card" onClick={() => setSelected(index)} aria-label={`View ${photo.title} photograph`}>
      <span className="photo-frame"><img src={ASSET + photo.image} alt={photo.alt} loading="lazy" /><span className="photo-open"><ArrowUpRight size={19} /></span></span>
      <span className="photo-meta"><span><b>{photo.title}</b><small>{photo.caption}</small></span><small className="photo-category">{photo.category}</small></span>
    </button>)}</div>
    {!limit && <p className="gallery-note">Photographs supplied by Maa Bhawani Construction. Captions describe visible work only; images do not imply independent certification or final handover. No precise location data is displayed.</p>}
    {selected !== null && filtered[selected] && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Photograph: ${filtered[selected].title}`} onClick={() => setSelected(null)}>
      <button className="lightbox-close" aria-label="Close photograph" onClick={() => setSelected(null)}><X /></button>
      <button className="lightbox-arrow prev" aria-label="Previous photograph" onClick={event => { event.stopPropagation(); move(-1); }}><ChevronLeft /></button>
      <div className="lightbox-content" onClick={event => event.stopPropagation()}><img src={ASSET + filtered[selected].image} alt={filtered[selected].alt} /><div className="lightbox-caption"><span><b>{filtered[selected].title}</b><small>{filtered[selected].caption}{filtered[selected].location ? ` · ${filtered[selected].location}` : ''}</small></span><button onClick={() => setDetail(filtered[selected])}>View photo details <ArrowUpRight size={14} /></button></div></div>
      <button className="lightbox-arrow next" aria-label="Next photograph" onClick={event => { event.stopPropagation(); move(1); }}><ChevronRight /></button>
    </div>}
    {detail && <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label="Photo details" onClick={() => setDetail(null)}><article className="detail-modal" onClick={event => event.stopPropagation()}><button className="detail-close" onClick={() => setDetail(null)} aria-label="Close details"><X /></button><Eyebrow>Site photograph · {detail.category}</Eyebrow><h2 className="serif">{detail.title}</h2><p>{detail.caption}</p>{detail.location && <p className="detail-location">{detail.location}</p>}<p className="gallery-note">Supplied photo record. Caption describes visible work only.</p><ActionLink href="/enquiry-construction">Ask about construction</ActionLink></article></div>}
  </>;
}

function Home() {
  return <Layout path="/"><section className="home-hero">
    <div className="hero-text"><div className="hero-index"><span>01</span><span>UTTAR PRADESH · INDIA</span></div><Eyebrow>One group. Two grounded pursuits.</Eyebrow><h1 className="serif">Building foundations.<br /><em>Creating possibilities.</em></h1><p>Construction and property conversations rooted in practical execution, clear information and trust.</p><div className="hero-actions"><ActionLink href="/projects">Explore site work</ActionLink><ActionLink href="/contact" kind="light">Start a conversation</ActionLink></div><div className="hero-scroll"><span>Scroll to explore</span><ArrowDownRight size={17} /></div></div>
    <div className="hero-visual"><img src={ASSET + 'brick-boundary-wall-progress.jpg'} alt="Brick boundary wall masonry in progress at a construction site" fetchPriority="high" /><div className="hero-photo-label"><span>MAA BHAWANI CONSTRUCTION</span><small>Visible work · Site photograph</small></div><div className="hero-mark">B</div></div>
  </section>
  <section className="intro-section wrap"><div className="intro-kicker"><Eyebrow>The group</Eyebrow><span>01 / 04</span></div><div className="intro-copy"><h2 className="serif">A shared standard.<br /><em>Distinct strengths.</em></h2><p>BHAWANI Holdings brings Maa Bhawani Construction and Maa Bhawani Properties together under one group identity. A place to understand each division, see supplied site photographs, and start the right conversation.</p><ActionLink href="/about" kind="outline">About the group</ActionLink></div></section>
  <section className="division-section"><div className="wrap"><SectionHead label="Two divisions" title={<>Practical work.<br /><em>Considered choices.</em></>} text="Explore the business that best fits your requirement." /><div className="division-grid">
    <article className="division-card construction"><img src={ASSET + 'foundation-team-work.jpg'} alt="Workers preparing a foundation section" loading="lazy" /><div className="division-shade" /><div className="division-content"><span>01 / CONSTRUCTION</span><h3 className="serif">Maa Bhawani<br />Construction</h3><p>Civil construction, infrastructure works and project execution, with attention to workmanship and site coordination.</p><div className="division-links"><ActionLink href="/construction" kind="light">Explore construction</ActionLink><a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} /></a></div></div></article>
    <article className="division-card property"><div className="property-art" aria-hidden="true"><div className="arch arch-one" /><div className="arch arch-two" /><div className="property-sun" /><span>LAND · PLACE · POSSIBILITY</span></div><div className="division-content"><span>02 / REAL ESTATE</span><h3 className="serif">Maa Bhawani<br />Properties</h3><p>Relationship-led real estate discovery and brokerage enquiries, with an initial focus around Banda, subject to availability.</p><div className="division-links"><ActionLink href="/properties" kind="light">Explore properties</ActionLink><a href={SOCIAL.property} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a></div></div></article>
  </div></div></section>
  <section className="work-section wrap"><div className="work-heading"><SectionHead label="Selected site photographs" title={<>Work, as it is.<br /><em>On the ground.</em></>} text="A selection of supplied photographs showing boundary-wall, foundation, masonry and pump-house site work." /><ActionLink href="/projects" kind="outline">View all photographs</ActionLink></div><Gallery limit={4} /></section>
  <section className="values-band"><div className="wrap values-layout"><div><Eyebrow>How we think</Eyebrow><h2 className="serif">Built on trust.<br /><em>Driven by quality.</em></h2></div><div className="values-copy"><p>BHAWANI’s ambition is to grow through disciplined execution, transparent relationships and attention to the work that matters. Different business divisions, one shared commitment to clear conversations and long-term value.</p><div className="value-list"><div><span>01</span><b>Quality first</b><small>Thoughtful work and attention to detail.</small></div><div><span>02</span><b>Trust always</b><small>Clarity, accountability and respect.</small></div><div><span>03</span><b>Long-term vision</b><small>Grow responsibly, one foundation at a time.</small></div></div><ActionLink href="/about" kind="outline">More about BHAWANI</ActionLink></div></div></section>
  <EnquiryBand /><ContactStrip />
  </Layout>;
}

function ConstructionPage() {
  const serviceItems = [['Civil construction', 'Construction support for defined civil works and site requirements.'], ['Infrastructure works', 'Infrastructure-related civil work, including boundary walls and associated structures where contracted.'], ['Project execution', 'Work planning, site coordination and execution against an agreed scope.'], ['Subcontractor enquiries', 'Discuss relevant scopes, capability and project location.']];
  return <Layout path="/construction"><PageHero eyebrow="Business division 01" title={<>Built with discipline.<br /><em>Delivered with trust.</em></>} text="Maa Bhawani Construction focuses on civil construction, infrastructure works and project execution, with an emphasis on workmanship and site coordination." image="boundary-wall-site-work.jpg" imageAlt="Brick boundary wall along a leafy site" action={<><ActionLink href="/enquiry-construction">Discuss a requirement</ActionLink><ExternalAction href={CHANNEL}>Follow site updates</ExternalAction></>} />
    <section className="content-section wrap two-column"><div><Eyebrow>What we do</Eyebrow><h2 className="serif">Practical execution.<br /><em>Strong foundations.</em></h2><p>Project scope and availability are discussed individually. Share the drawings, quantities, specifications, location and timeline so the requirement can be understood clearly.</p></div><div className="service-list">{serviceItems.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={18} /></article>)}</div></section>
    <section className="gallery-section"><div className="wrap"><SectionHead label="MBC site photographs" title={<>Civil work on the ground.<br /><em>Progress you can see.</em></>} text="Supplied photographs from boundary-wall and pump-house civil work. Images show different stages and site views." /><Gallery limit={6} /><div className="center-action"><ActionLink href="/projects" kind="outline">Explore the photo gallery</ActionLink></div></div></section>
    <section className="process-section"><div className="wrap process-layout"><div><Eyebrow>How we work</Eyebrow><h2 className="serif">Clear scope.<br /><em>Clearer follow-through.</em></h2><p>Every requirement is different. These are the practical conversations that help shape one.</p></div><div className="process-list"><p><b>01</b><span><strong>Define the scope</strong>Drawings, quantities, specifications, location and timeline.</span></p><p><b>02</b><span><strong>Align resources</strong>Manpower, materials, responsibilities and reporting.</span></p><p><b>03</b><span><strong>Execute and communicate</strong>Track progress and raise issues early.</span></p><p><b>04</b><span><strong>Close with accountability</strong>Review scope, documentation and agreed handover needs.</span></p></div></div></section>
    <ContactStrip construction />
  </Layout>;
}

function PropertiesPage() {
  return <Layout path="/properties"><PageHero eyebrow="Business division 02" title={<>Find the right real estate.<br /><em>Make a considered move.</em></>} text="Maa Bhawani Properties is being built around relationship-led real estate discovery and brokerage enquiries, helping clients begin with clearer requirements." image="concrete-compound-wall.jpg" imageAlt="Concrete compound wall at an open rural site" action={<><ActionLink href="/enquiry-property">Make a property enquiry</ActionLink><ExternalAction href={SOCIAL.property}>Connect on Instagram</ExternalAction></>} />
    <section className="content-section wrap two-column"><div><Eyebrow>Our approach</Eyebrow><h2 className="serif">Good decisions start<br />with <em>clear information.</em></h2><p>We aim to understand each client’s needs before exploring relevant real estate opportunities. This website does not represent live inventory; availability and all property details must be confirmed separately.</p></div><div className="property-points"><article><House /><h3>Real estate discovery</h3><p>Discuss location, intended use, budget range and preferred timeline.</p></article><article><MessageCircle /><h3>Brokerage enquiries</h3><p>Share requirements for a potential match and a follow-up conversation.</p></article><article><ArrowRight /><h3>Buyer and seller connections</h3><p>Introduce relevant parties where scope, authority and interest are clear.</p></article><article><Construction /><h3>Local market focus</h3><p>Start with Banda and nearby areas, subject to available listings and verified information.</p></article></div></section>
    <section className="due-diligence"><div className="wrap diligence-grid"><div><Eyebrow>Before you commit</Eyebrow><h2 className="serif">Due diligence<br /><em>matters.</em></h2><p>Confirm the facts independently before a real estate transaction.</p></div><div className="diligence-list"><p><b>Ownership and title</b>Confirm ownership records and encumbrances with qualified professionals.</p><p><b>Land use and approvals</b>Check relevant permissions and statutory requirements.</p><p><b>Price and terms</b>Document brokerage, payments and responsibilities in writing.</p><p><b>Independent legal review</b>Use a qualified local lawyer and relevant authorities before signing or paying.</p></div></div></section>
    <ContactStrip property />
  </Layout>;
}

function PageHero({ eyebrow, title, text, image, imageAlt, action }: { eyebrow: string; title: ReactNode; text: string; image: string; imageAlt: string; action: ReactNode }) {
  return <section className="interior-hero"><div className="interior-copy"><Eyebrow>BHAWANI · {eyebrow}</Eyebrow><h1 className="serif">{title}</h1><p>{text}</p><div className="hero-actions">{action}</div></div><div className="interior-image"><img src={ASSET + image} alt={imageAlt} fetchPriority="high" /><span className="interior-image-caption">Supplied site photograph</span></div></section>;
}

function ProjectsPage() {
  return <Layout path="/projects"><PageHero eyebrow="Project photographs" title={<>Real work.<br /><em>Visible progress.</em></>} text="Browse supplied Maa Bhawani Construction photographs. Select a category or open an image for a closer look." image="pump-house-entrance.jpg" imageAlt="Pump-house entrance, gate and paved approach" action={<ActionLink href="#gallery">Browse gallery</ActionLink>} /><section className="gallery-section projects-gallery" id="gallery"><div className="wrap"><SectionHead label="Photo records" title={<>A closer look at<br /><em>the work itself.</em></>} text="Categories describe visible work in the photographs. No completion dates or unsupported project status are implied." /><Gallery /></div></section></Layout>;
}

function AboutPage() {
  return <Layout path="/about"><PageHero eyebrow="About the group" title={<>Built on trust.<br /><em>Driven by ambition.</em></>} text="BHAWANI Holdings is the parent brand bringing together businesses focused on construction, real estate discovery and long-term value." image="foundation-team-work.jpg" imageAlt="Workers preparing concrete foundation work" action={<ActionLink href="/contact">Start a conversation</ActionLink>} />
    <section className="about-story wrap"><div><Eyebrow>One shared identity</Eyebrow><h2 className="serif">Different strengths.<br /><em>One shared standard.</em></h2></div><div><p>BHAWANI Holdings brings together Maa Bhawani Construction and Maa Bhawani Properties. The group’s approach centers on disciplined execution, transparent relationships and a commitment to quality.</p><p>Our ambition is to build responsibly, serve consistently and create value that lasts—one considered conversation at a time.</p><ActionLink href="/projects" kind="outline">See supplied site photographs</ActionLink></div></section>
    <section className="about-divisions"><div className="wrap"><SectionHead label="The group" title={<>Two business divisions.<br /><em>Clear points of entry.</em></>} /><div className="about-card-grid"><article><span>01</span><h3 className="serif">Maa Bhawani Construction</h3><p>Civil construction, infrastructure works and project execution.</p><Link href="/construction">Explore Construction <ArrowUpRight size={15} /></Link></article><article><span>02</span><h3 className="serif">Maa Bhawani Properties</h3><p>Relationship-led real estate discovery and brokerage enquiries.</p><Link href="/properties">Explore Properties <ArrowUpRight size={15} /></Link></article></div></div></section>
    <EnquiryBand />
  </Layout>;
}

function ContactPage() {
  return <Layout path="/contact"><section className="contact-hero wrap"><div><Eyebrow>Contact BHAWANI</Eyebrow><h1 className="serif">Choose the right route.<br /><em>Start with clear details.</em></h1><p>Choose a dedicated form for your requirement, or reach out through a verified business channel.</p></div><div className="contact-mark">B<span>H</span></div></section>
    <section className="contact-content"><div className="wrap"><SectionHead label="Enquiries" title={<>One point of entry.<br /><em>Four clear routes.</em></>} text="Each dedicated form collects the information needed for the relevant team to review your enquiry." /><div className="route-grid">{[
      ['01', 'Construction & civil works', 'Project location, scope, work type and timeline.', '/enquiry-construction', 'Construction enquiry'],
      ['02', 'Real estate discovery', 'Buyer, seller, landowner and real estate-professional enquiries.', '/enquiry-property', 'Property enquiry'],
      ['03', 'Subcontractor registration', 'Specialization, operating location and relevant experience.', '/enquiry-subcontractors', 'Register capability'],
      ['04', 'Business collaboration', 'Company details, partnership area and proposal summary.', '/enquiry-partners', 'Send a proposal'],
    ].map(([n, title, body, href, cta]) => <article className="route-card" key={n}><span>{n} / ROUTE</span><h3 className="serif">{title}</h3><p>{body}</p><Link href={href}>{cta} <ArrowUpRight size={16} /></Link></article>)}</div></div></section>
    <section className="contact-directory wrap"><div><Eyebrow>Verified business contacts</Eyebrow><h2 className="serif">Direct lines<br /><em>to the group.</em></h2></div><div className="directory-links"><a href={`mailto:${CONTACT}`}><span><Mail /></span><small>Construction email</small><b>{CONTACT}</b></a><a href={WHATSAPP} target="_blank" rel="noreferrer"><span><MessageCircle /></span><small>WhatsApp Business</small><b>+91 88533 41008</b></a><a href={SOCIAL.parent} target="_blank" rel="noreferrer"><span><Instagram /></span><small>Parent brand</small><b>@bhawaniholdings</b></a><a href={SOCIAL.construction} target="_blank" rel="noreferrer"><span><Instagram /></span><small>Maa Bhawani Construction</small><b>@mbcpvtltd</b></a><a href={SOCIAL.property} target="_blank" rel="noreferrer"><span><Instagram /></span><small>Maa Bhawani Properties</small><b>@mbppvtltd</b></a><a href={CHANNEL} target="_blank" rel="noreferrer"><span><MessageCircle /></span><small>Construction updates</small><b>WhatsApp channel</b></a></div></section>
  </Layout>;
}

type FieldSpec = { name: string; label: string; kind?: 'select' | 'textarea' | 'email' | 'tel' | 'text'; required?: boolean; options?: string[]; optional?: boolean };
const forms: Record<string, { type: 'construction' | 'property' | 'subcontractor' | 'partner'; title: string; intro: string; fields: FieldSpec[] }> = {
  '/enquiry-construction': { type: 'construction', title: 'Let’s understand your construction requirement.', intro: 'Share the location, scope and expected timeline for civil construction, infrastructure or project execution work.', fields: [
    { name: 'name', label: 'Full name', required: true }, { name: 'phone', label: 'Phone / WhatsApp', kind: 'tel', required: true }, { name: 'email', label: 'Email address', kind: 'email', required: true }, { name: 'location', label: 'Project location', required: true }, { name: 'workType', label: 'Work type', kind: 'select', required: true, options: ['Civil construction', 'Boundary wall work', 'Foundation work', 'Masonry', 'Site development', 'Infrastructure works', 'Other civil work'] }, { name: 'projectSize', label: 'Approximate project size', optional: true }, { name: 'message', label: 'Message', kind: 'textarea', required: true },
  ] },
  '/enquiry-property': { type: 'property', title: 'Tell us what real estate you need.', intro: 'Submit a buyer, seller, landowner or real estate-professional enquiry. Availability and property details are confirmed separately.', fields: [
    { name: 'name', label: 'Full name', required: true }, { name: 'phone', label: 'Phone / WhatsApp', kind: 'tel', required: true }, { name: 'email', label: 'Email address', kind: 'email', required: true }, { name: 'propertyType', label: 'Property type', kind: 'select', required: true, options: ['Residential plot', 'House', 'Land', 'Small commercial property', 'Other'] }, { name: 'location', label: 'Preferred location', required: true }, { name: 'budget', label: 'Budget range', optional: true }, { name: 'message', label: 'Message', kind: 'textarea', required: true },
  ] },
  '/enquiry-subcontractors': { type: 'subcontractor', title: 'Register your subcontracting capability.', intro: 'Tell us which civil work categories you cover, where you operate and what experience you can bring.', fields: [
    { name: 'name', label: 'Full name', required: true }, { name: 'phone', label: 'Phone / WhatsApp', kind: 'tel', required: true }, { name: 'email', label: 'Email address', kind: 'email', required: true }, { name: 'specialization', label: 'Work specialization', kind: 'select', required: true, options: ['Boundary wall works', 'Pump house / civil structures', 'Masonry', 'Concrete / PCC / RCC', 'Plaster / finishing', 'Other civil works'] }, { name: 'location', label: 'Operating location', required: true }, { name: 'experience', label: 'Experience', kind: 'textarea', optional: true }, { name: 'message', label: 'Message', kind: 'textarea', required: true },
  ] },
  '/enquiry-partners': { type: 'partner', title: 'Introduce your partnership proposal.', intro: 'Share your organisation, area of collaboration and a concise summary of the proposal for BHAWANI to review.', fields: [
    { name: 'name', label: 'Full name', required: true }, { name: 'phone', label: 'Phone / WhatsApp', kind: 'tel', required: true }, { name: 'email', label: 'Email address', kind: 'email', required: true }, { name: 'company', label: 'Company / organisation', optional: true }, { name: 'partnershipType', label: 'Partnership type', kind: 'select', required: true, options: ['Construction projects', 'Real estate', 'Supplier / vendor', 'Strategic collaboration', 'Other business proposal'] }, { name: 'location', label: 'Location', required: true }, { name: 'message', label: 'Message', kind: 'textarea', required: true },
  ] },
};

function EnquiryPage({ path }: { path: string }) {
  const config = forms[path];
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const onChange = (field: string, value: string) => setValues(current => ({ ...current, [field]: value }));
  const validPhone = (phone: string) => /^\+?[\d\s().-]{8,20}$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (loading) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!validPhone(values.phone || '')) { setStatus({ kind: 'error', text: 'Enter a valid phone number with at least 10 digits.' }); return; }
    setLoading(true); setStatus(null);
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: config.type, fields: values }) });
      let result: { id?: unknown; status?: unknown; error?: unknown; message?: unknown } | null = null;
      try { result = await response.json(); } catch { /* An empty or non-JSON reply is not a submission confirmation. */ }
      if (!response.ok) {
        let message = 'We could not submit your enquiry. Please try again or contact us directly.';
        if (typeof result?.error === 'string') message = result.error;
        else if (typeof result?.message === 'string') message = result.message;
        throw new Error(message);
      }
      if (response.status !== 201 || result?.status !== 'received' || typeof result.id !== 'number' || !Number.isSafeInteger(result.id)) {
        throw new Error('The enquiry service did not confirm that your details were stored. Please try again or contact us directly.');
      }
      setStatus({ kind: 'success', text: 'Your enquiry was submitted successfully. This confirmation reflects the response from the enquiry service; it does not guarantee availability or a commercial outcome.' });
      setValues({});
      form.reset();
    } catch (error) {
      const message = error instanceof TypeError
        ? 'The enquiry service is currently unavailable. Please try again later or contact us directly.'
        : error instanceof Error ? error.message : 'We could not submit your enquiry. Please try again or contact us directly.';
      setStatus({ kind: 'error', text: message });
    }
    finally { setLoading(false); }
  };
  return <Layout path={path}><section className="form-hero"><div className="wrap"><Eyebrow>BHAWANI · ENQUIRY ROUTE</Eyebrow><h1 className="serif">{config.title}</h1><p>{config.intro}</p><Link href="/contact" className="back-link"><ArrowLeft size={15} /> All enquiry routes</Link></div></section>
    <section className="form-area wrap"><div className="form-main"><div className="form-card"><Eyebrow>Share your details</Eyebrow><h2 className="serif">A clear first step.</h2><p>Fields marked required are needed to submit. Please do not include passwords, payment card details or sensitive identity documents.</p>
      <form onSubmit={submit} noValidate><div className="form-grid">{config.fields.map(field => <div key={field.name} className={`form-field ${field.kind === 'textarea' ? 'field-wide' : ''}`}><label htmlFor={`field-${field.name}`}>{field.label}{field.required && <span> *</span>}{field.optional && <small> OPTIONAL</small>}</label>
        {field.kind === 'textarea' ? <textarea id={`field-${field.name}`} name={field.name} required={field.required} maxLength={5000} value={values[field.name] || ''} onChange={event => onChange(field.name, event.target.value)} placeholder={`Tell us about your ${field.label.toLowerCase()}`} rows={4} /> :
          field.kind === 'select' ? <select id={`field-${field.name}`} name={field.name} required={field.required} value={values[field.name] || ''} onChange={event => onChange(field.name, event.target.value)}><option value="">Choose an option</option>{field.options?.map(option => <option key={option}>{option}</option>)}</select> :
          <input id={`field-${field.name}`} name={field.name} type={field.kind === 'email' ? 'email' : field.kind === 'tel' ? 'tel' : 'text'} required={field.required} maxLength={field.name === 'email' ? 254 : 180} autoComplete={field.name === 'name' ? 'name' : field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : undefined} value={values[field.name] || ''} onChange={event => onChange(field.name, event.target.value)} placeholder={field.name === 'email' ? 'you@example.com' : field.name === 'phone' ? '+91 98765 43210' : `Enter ${field.label.toLowerCase()}`} />}
      </div>)}</div><div className="form-actions"><button className="button button-solid" type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit enquiry'}{!loading && <ArrowUpRight size={16} />}</button>{loading && <span className="loading-indicator"><span /> Sending securely to the enquiry service</span>}</div>
        {status && <div className={`form-status ${status.kind}`} role="status" aria-live="polite">{status.kind === 'success' ? <Check size={19} /> : <CircleHelp size={19} />}<span>{status.text}</span></div>}
      </form></div></div><aside className="form-aside"><div className="form-aside-sticky"><Eyebrow>Before you send</Eyebrow><h3 className="serif">Clear information.<br /><em>Better follow-up.</em></h3><p>Your form is sent to the website enquiry endpoint. The response confirms only whether that endpoint accepted the submission; this page makes no claim about email delivery or further storage.</p><hr /><p><strong>Prefer a direct construction contact?</strong></p><a href={WHATSAPP} target="_blank" rel="noreferrer" className="contact-direct"><MessageCircle size={17} /> WhatsApp · +91 88533 41008</a><a href={`mailto:${CONTACT}`} className="contact-direct"><Mail size={17} /> Email Maa Bhawani Construction</a><p className="form-privacy">Please don’t share sensitive identity or financial documents. <Link href="/privacy">Read the privacy notice.</Link></p></div></aside></section>
  </Layout>;
}

function EnquiryBand() {
  return <section className="enquiry-band"><div className="wrap enquiry-band-inner"><div><Eyebrow>Start with the right team</Eyebrow><h2 className="serif">Let's discuss<br /><em>what comes next.</em></h2><p>Choose a dedicated route and tell us what you have in mind.</p></div><div className="enquiry-options"><Link href="/enquiry-construction"><span>01</span>Construction enquiry<ArrowUpRight /></Link><Link href="/enquiry-property"><span>02</span>Property enquiry<ArrowUpRight /></Link><Link href="/enquiry-subcontractors"><span>03</span>Subcontractor enquiry<ArrowUpRight /></Link><Link href="/enquiry-partners"><span>04</span>Business partner enquiry<ArrowUpRight /></Link></div></div></section>;
}

function ContactStrip({ construction, property }: { construction?: boolean; property?: boolean }) {
  const title = construction ? <>Have a construction<br /><em>requirement?</em></> : property ? <>Tell us what<br /><em>you’re looking for.</em></> : <>Let's build something<br /><em>meaningful.</em></>;
  const text = construction ? 'Share the project location, scope, approximate size and expected timeline.' : property ? 'Share your real estate requirement. Specific listings and availability must be confirmed.' : 'Construction, real estate or a potential partnership—start with the right team.';
  return <section className="contact-strip"><div className="wrap contact-strip-inner"><div><Eyebrow>Start a conversation</Eyebrow><h2 className="serif">{title}</h2><p>{text}</p></div><div className="contact-strip-actions">{construction ? <a className="button button-solid" href={WHATSAPP} target="_blank" rel="noreferrer">Message on WhatsApp <ArrowUpRight size={16} /></a> : property ? <ExternalAction href={SOCIAL.property}>Message MBP on Instagram</ExternalAction> : <ActionLink href="/contact">Choose an enquiry route</ActionLink>}<a href={`mailto:${CONTACT}`} className="text-link"><Mail size={16} /> {CONTACT}</a>{construction && <a href={CHANNEL} target="_blank" rel="noreferrer" className="text-link">Follow the WhatsApp channel <ArrowUpRight size={15} /></a>}</div></div></section>;
}

function PrivacyPage() {
  return <Layout path="/privacy"><section className="form-hero"><div className="wrap"><Eyebrow>BHAWANI HOLDINGS</Eyebrow><h1 className="serif">Privacy, in plain language.</h1><p>A note about the information entered through this website.</p></div></section><section className="privacy-content wrap"><article><h2 className="serif">Information you provide</h2><p>Enquiry forms request contact and requirement details relevant to the route selected. When the enquiry service is configured, the fields are stored in the site’s private database so the business can review and follow up. A successful response confirms storage, not email delivery or a particular response time.</p><h2 className="serif">How information is handled</h2><p>Only provide details needed to respond to your enquiry. This website does not provide a public enquiry list or admin interface. Please do not submit passwords, payment-card details, precise identity documents or other sensitive information.</p><h2 className="serif">Photos and location</h2><p>Project photographs are supplied site records. GPS coordinates and private photo metadata are removed. Captions describe visible work and do not imply independent certification, project ownership or final handover.</p><h2 className="serif">Contact</h2><p>For construction contact, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> or WhatsApp <a href={WHATSAPP}>+91 88533 41008</a>.</p><p className="privacy-updated">Website privacy information · Please contact BHAWANI for questions about an enquiry.</p></article></section></Layout>;
}

function NotFoundPage() {
  return <Layout path="/missing"><section className="not-found"><div className="not-found-number">404</div><Eyebrow>Page not found</Eyebrow><h1 className="serif">This path doesn’t<br /><em>lead anywhere.</em></h1><p>The page may have moved, or the address may be incomplete.</p><div className="hero-actions"><ActionLink href="/">Return home</ActionLink><ActionLink href="/contact" kind="outline">Find a contact route</ActionLink></div></section></Layout>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={Home} /><Route path="/construction" component={ConstructionPage} /><Route path="/properties" component={PropertiesPage} />
    <Route path="/projects" component={ProjectsPage} /><Route path="/about" component={AboutPage} /><Route path="/contact" component={ContactPage} />
    <Route path="/enquiry-construction">{() => <EnquiryPage path="/enquiry-construction" />}</Route>
    <Route path="/enquiry-property">{() => <EnquiryPage path="/enquiry-property" />}</Route>
    <Route path="/enquiry-subcontractors">{() => <EnquiryPage path="/enquiry-subcontractors" />}</Route>
    <Route path="/enquiry-partners">{() => <EnquiryPage path="/enquiry-partners" />}</Route>
    <Route path="/privacy" component={PrivacyPage} /><Route component={NotFoundPage} />
  </Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
