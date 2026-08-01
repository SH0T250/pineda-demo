// Pineda OS demo seed data — APP_TODAY is Wednesday, June 25, 2025 everywhere.
export const APP_TODAY = { label: 'Wed, Jun 25', dow: 'Wednesday', full: 'Wednesday, June 25, 2025' }

export const company = {
  name: 'Pineda Heating & Air',
  short: 'Pineda OS',
  city: 'New Braunfels, TX',
  phone: '830-360-4802',
  email: 'chaun@pinedahvac.com',
  handle: 'pineda.hvac',
  tagline: 'The operating system for the modern trades business.',
}

export const techs = [
  { id: 'cp', initials: 'CP', name: 'Chaun P.', role: 'Owner', truck: 'Truck 1', area: 'New Braunfels', miles: 78, vehicle: 'Svc 1,200mi', vehicleTone: 'amber' },
  { id: 'md', initials: 'MD', name: 'Marcus D.', role: 'Sr. Tech', truck: 'Truck 2', area: 'Gruene', miles: 86, vehicle: 'Up to date', vehicleTone: 'green' },
  { id: 'tr', initials: 'TR', name: 'Travis R.', role: 'Tech', truck: 'Truck 3', area: 'Canyon Lk', miles: 54, vehicle: 'Oil overdue', vehicleTone: 'red' },
]

// Today's schedule — 6 jobs, 5 completed, 1 upcoming (booked by the AI agent)
export const jobs = [
  { time: '8:00a', client: 'Saenz, M.', task: 'Blower motor', tech: 'Chaun P.', addr: '1234 Gruene Rd', parts: '1/2 HP ECM', rev: 1180, profit: 548, done: true },
  { time: '9:30a', client: 'Comal Café', task: 'RTU contactor', tech: 'Travis R.', addr: '720 Common St', parts: '40A contactor', rev: 760, profit: 352, done: true },
  { time: '11:00a', client: 'Gruene Rentals', task: 'Diag + recharge', tech: 'Marcus D.', addr: '1601 Hunter Rd', parts: 'R-410A 3lb', rev: 980, profit: 470, done: true },
  { time: '1:30p', client: 'Hammond, R.', task: 'Condenser fan', tech: 'Chaun P.', addr: '88 Fair Oaks', parts: '1/4 HP motor', rev: 1090, profit: 470, done: true },
  { time: '3:30p', client: 'Vela, J.', task: 'System tune-up', tech: 'Marcus D.', addr: '210 Elm Creek', parts: '16x25 MERV 11', rev: 810, profit: 300, done: true },
  { time: '5:00p', client: 'Maria G.', task: 'AC not cooling — capacitor diag', tech: 'Chaun P.', addr: '415 Oak Run', parts: '—', rev: 0, profit: 0, done: false, aiBooked: true },
]

export const todayStats = {
  revenue: 4820, profit: 2140, marginPct: '44.4%', jobsDone: 5, miles: 218,
  topClients: [
    { name: 'Saenz, M.', amt: 1180 },
    { name: 'Hammond, R.', amt: 1090 },
    { name: 'Gruene Rentals', amt: 980 },
  ],
}

export const weekStrip = [
  { d: 'MON', n: 23 }, { d: 'TUE', n: 24 }, { d: 'WED', n: 25, active: true },
  { d: 'THU', n: 26 }, { d: 'FRI', n: 27 }, { d: 'SAT', n: 28 }, { d: 'SUN', n: 29 },
]

export const crew = [
  { ...techs[0], job: 'Saenz, M. — Blower motor swap', jobs: 2, revenue: 2270, x: 46, y: 52 },
  { ...techs[1], job: 'Gruene Rentals — Recharge', jobs: 2, revenue: 1790, x: 64, y: 34 },
  { ...techs[2], job: 'Comal Café — RTU contactor', jobs: 1, revenue: 760, x: 24, y: 26 },
]

export const assets = {
  tagged: 47, value: 38400, unaccounted: 1,
  items: [
    { name: 'Appion G5Twin Recovery Machine', tag: 'AST-007 · Truck 1 · Chaun P.', value: 1285, status: 'ON TRUCK', tone: 'green' },
    { name: 'Fieldpiece SMAN480V Manifold', tag: 'AST-014 · Truck 2 · Marcus D.', value: 549, status: 'ON TRUCK', tone: 'green' },
    { name: 'CPS 6-CFM Vacuum Pump', tag: 'AST-022 · Truck 3 · Travis R.', value: 415, status: 'SIGNED OUT', tone: 'amber' },
    { name: 'Milwaukee M18 Fuel Impact Kit', tag: 'AST-031 · Truck 3 · Travis R. · last scan Jun 18', value: 399, status: 'MISSING', tone: 'red' },
    { name: 'Yellow Jacket Nitrogen Regulator', tag: 'AST-019 · Truck 1 · Chaun P.', value: 268, status: 'ON TRUCK', tone: 'green' },
  ],
}

export const inbox = {
  stats: 'Answered 7 calls · booked 4 · 0 missed today',
  items: [
    { who: 'Maria G.', meta: '2:14p · 0:24', badge: 'URGENT', tone: 'red', text: '“AC quit cooling and I’ve got a baby at home — can someone come today?”', actions: ['Book this afternoon', 'Call back'], note: 'AI booked → today 5:00p' },
    { who: 'Web request · Delgado, R.', meta: 'System replacement quote', badge: 'AI BOOKED', tone: 'green', text: 'AI booked Thu 9a — full system replacement consult at 512 Landa St.', actions: [] },
    { who: 'Comal Café', meta: '11:02a · 0:11', badge: 'NEW', tone: 'amber', text: '“RTU on the roof is making a noise…”', actions: ['Book follow-up', 'Call back'] },
  ],
}

export const parts = [
  { item: '45/5 MFD Dual Cap', vendor: 'Gemaire', pn: 'TRCFD455', cost: 18.40, markup: '120%', sell: 40.48, margin: 22.08 },
  { item: '1/2 HP ECM Motor', vendor: 'Baker Dist.', pn: 'MOT18605', cost: 284.00, markup: '75%', sell: 497.00, margin: 213.00 },
  { item: '40A 2P Contactor', vendor: 'Johnstone', pn: 'C240B', cost: 22.10, markup: '110%', sell: 46.41, margin: 24.31 },
  { item: 'R-410A 25lb Jug', vendor: 'US Air Cond.', pn: 'RA410-25', cost: 138.00, markup: '85%', sell: 255.30, margin: 117.30 },
  { item: '1/4 HP Fan Motor', vendor: 'Gemaire', pn: 'FM1009', cost: 96.50, markup: '80%', sell: 173.70, margin: 77.20 },
]

export const quote = {
  id: '#Q-1042', client: 'Saenz, M.', addr: '1234 Gruene Rd, New Braunfels',
  lines: [
    { name: '1/2 HP ECM Motor', sub: 'MOT18605', qty: 1, sell: 497.00 },
    { name: '45/5 MFD Dual Cap', sub: 'TRCFD455', qty: 1, sell: 40.48 },
    { name: 'Labor', sub: '2.5 hrs @ $145', qty: 2.5, sell: 362.50 },
  ],
  jobCost: 452.40, price: 899.98, gross: 447.58, grossPct: '49.7%', overhead: 162.00, net: 285.58, netPct: '31.7%',
}

export const financing = {
  client: 'Delgado, R.', project: 'Full system replacement · 512 Landa St', amount: 9480, preQual: 12000,
  options: [
    { apr: '0% APR', term: '18 months · deferred interest', mo: 527 },
    { apr: '9.99% APR', term: '60 months', mo: 201, popular: true },
    { apr: '6.99% APR', term: '84 months', mo: 143 },
  ],
}

export const jobComplete = {
  id: '#J-2087', client: 'Saenz, M.', title: '3-Ton Condenser Replacement', addr: '1234 Gruene Rd, New Braunfels',
  completed: '2:40p · Jun 10', manHours: '10.0', crewNote: '2 techs · 5h', materials: 1840, matNote: '3 line items',
  work: [
    'Removed failed 13-SEER condenser & recovered refrigerant',
    'Set new 3-ton 15.2-SEER2 condenser on composite pad',
    'Brazed line set, pressure-tested, pulled vacuum to 500 microns',
    'Weighed in R-410A · verified 10°F subcooling at startup',
  ],
}

export const warranties = {
  units: [
    { name: 'Goodman GLXS4BA · 3-Ton Condenser', mfr: 'Goodman', term: 'MFR 10-YR', model: 'GLXS4BA3610', serial: '2306-1148823' },
    { name: 'Goodman CAPF37 · Evaporator Coil', mfr: 'Goodman', term: 'MFR 10-YR', model: 'CAPF3737B6', serial: '2305-7741290' },
    { name: 'ecobee Smart Pro · Thermostat', mfr: 'ecobee', term: 'MFR 3-YR', model: 'EB-STATE6P', serial: 'EB-0934-5521' },
  ],
  docs: ['Warranty cert', 'Install manual', 'AHRI cert', 'Invoice PDF'],
  labor: [
    { client: 'Saenz, M.', unit: '3-Ton Condenser', dates: 'Installed Jun 10, 2025 · covered thru Jun 2027', days: '716 days of labor coverage left', status: 'ACTIVE', tone: 'green' },
    { client: 'Hammond, R.', unit: 'Air Handler + Coil', dates: 'Installed Sep 12, 2024 · covered thru Sep 2026', days: '444 days of labor coverage left', status: 'ACTIVE', tone: 'green' },
    { client: 'Whitewater Rec', unit: '5-Ton RTU', dates: 'Installed Aug 03, 2023 · covered thru Aug 2025', days: '68 days left · customer nudged to renew', status: 'EXPIRING', tone: 'amber' },
  ],
}

export const invoices = {
  outstanding: 6620, open: 4,
  items: [
    { client: 'Whitewater Rec', amt: 2310, status: 'OVERDUE', tone: 'red' },
    { client: 'Saenz, M.', amt: 2040, status: 'SENT', tone: 'amber' },
    { client: 'Gruene Rentals', amt: 1460, status: 'VIEWED', tone: 'amber' },
    { client: 'Vela, J.', amt: 810, status: 'SENT', tone: 'amber' },
    { client: 'Hammond, R.', amt: 1090, status: 'PAID', tone: 'green' },
  ],
  deductions: [
    { name: 'Mileage', sub: '18,420 mi', amt: 12894 },
    { name: 'Parts & materials', sub: '', amt: 41360 },
    { name: 'Sec. 179 equipment', sub: '', amt: 28500 },
    { name: 'Insurance / licenses', sub: '', amt: 4180 },
  ],
  taxSavings: 21300,
}

export const health = {
  kpis: [
    { name: 'Revenue · MTD', value: '$86,400', delta: '↑ 12% vs last mo', tone: 'green' },
    { name: 'Gross Margin', value: '46.2%', delta: '↑ 1.8 pts QoQ', tone: 'green' },
    { name: 'A/R Outstanding', value: '$18,240', delta: '3 invoices over 30 days', tone: 'red' },
    { name: 'Close Rate', value: '63%', delta: '41 of 65 quotes won', tone: 'muted' },
  ],
  revenue: [
    { m: 'Jan', v: 58 }, { m: 'Feb', v: 61 }, { m: 'Mar', v: 67 },
    { m: 'Apr', v: 72 }, { m: 'May', v: 77 }, { m: 'Jun', v: 86.4 },
  ],
  yoy: '+31% YoY',
  aging: [
    { bucket: 'CURRENT', amt: '$11.2k', tone: 'green' },
    { bucket: '1–30 DAYS', amt: '$4.3k', tone: 'amber' },
    { bucket: '31–60', amt: '$1.9k', tone: 'amber' },
    { bucket: '60+ DAYS', amt: '$0.8k', tone: 'red' },
  ],
}

export const reputation = {
  rating: '4.9', total: '300 reviews', note: 'across 4 channels · +18 this month',
  channels: [
    { name: 'Google', rating: '4.9', count: 148 },
    { name: 'Facebook', rating: '4.9', count: 61 },
    { name: 'Yelp', rating: '4.7', count: 52 },
    { name: 'Nextdoor', rating: '5.0', count: 39 },
  ],
  social: [{ name: 'Instagram', note: '1.2k followers' }, { name: 'LinkedIn', note: 'Connected' }],
  review: {
    who: 'Rick D.', meta: 'Google · 2d ago', badge: 'NEEDS REPLY',
    text: '“Chaun had our AC back on in under an hour. Fair price, texted the invoice same day. Highly recommend.”',
  },
}

export const maria = {
  name: 'Maria G.', initials: 'MG', since: 'Client since 2024 · 2 systems on file', loc: 'NB, TX',
  tiles: [
    { name: 'My Equipment', sub: '2 systems · warranties' },
    { name: 'Invoices & Pay', sub: '$0 due · autopay on' },
    { name: 'Book Service', sub: 'next: today 5:00p' },
    { name: 'Financing', sub: 'pre-approved $8,500' },
    { name: 'Documents', sub: '8 files · manuals' },
    { name: 'Leave a Review', sub: '1 tap · earn $25 off' },
  ],
  nudge: 'Fall tune-up due soon — keeps your 10-yr warranty valid · 3 weeks left',
  systems: [
    { name: 'System 1 · Goodman 3-Ton + ecobee', sub: 'Installed Sep 2024 · under warranty', tone: 'green' },
    { name: 'System 2 · Goodman GSX140421 · 3.5 Ton', sub: 'Installed 2019 · out of labor warranty', tone: 'amber' },
  ],
}

export const snapKnow = {
  equip: 'Goodman GSX140421 · 3.5 Ton · 14 SEER',
  diagnosis: 'Your outdoor fan motor is seizing. The unit runs but can’t push heat out — it’ll trip on high pressure soon.',
  urgency: 'Service needed now',
}

export const assistant = [
  { from: 'them', text: 'My AC stopped blowing cold and it’s 98° out. I’ve got a 4-month-old at home.', tag: 'Priority: High' },
  { from: 'ai', text: 'On it — comfort and safety first. One question: is the outdoor unit still running, or is it silent?' },
  { from: 'them', text: 'It’s humming, but the fan on top isn’t spinning.' },
  { from: 'ai', text: 'That’s a likely failing run capacitor — usually a same-day fix. I can get Chaun out this afternoon.' },
]

export const assistantOffer = { slot: 'Today · 3:30–5:00 PM', desc: 'Capacitor diagnosis · Est. $189–$310' }

export const money = (n) => '$' + n.toLocaleString('en-US', n % 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {})
