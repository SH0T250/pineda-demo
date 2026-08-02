// Pineda OS demo seed data — APP_TODAY is Wednesday, June 25, 2025 everywhere.
export const APP_TODAY = { label: 'Wed, Jun 25', dow: 'Wednesday', full: 'Wednesday, June 25, 2025' }

// Real business record — matches Chaun's filed QuickBooks paperwork and TDLR license.
export const company = {
  name: 'Pineda Heating & Air',
  legal: 'Pineda Heating and Air LLC',
  short: 'Pineda OS',
  street: '2141 Good Luck Rd',
  cityState: 'Seguin, TX 78155',
  city: 'New Braunfels, TX',
  serviceArea: 'Seguin · New Braunfels · Garden Ridge · Canyon Lake',
  phone: '830-360-4802',
  email: 'pinedahvac@yahoo.com',
  handle: 'pineda.hvac',
  license: 'TACLB 00111996E',
  regulator: 'Texas Department of Licensing and Regulation · 920 Colorado St, Austin, TX 78701',
  owner: 'Chaun Pineda',
  tagline: 'The operating system for the modern trades business.',
}

// Nancy Fischer's system replacement — the real 7/28/26 QuickBooks quote (#2014),
// kept verbatim as the "before" side of the quote comparison.
export const quickbooksQuote = {
  num: '2014',
  date: '07/28/2026',
  due: '07/28/2026',
  client: 'Nancy Fischer',
  addr: ['20007 Cedar Branch', 'Garden Ridge 78266'],
  service: 'Services',
  description: [
    'Goodman 5 ton gas inverter side discharge system',
    'Furnace', 'Coil', 'Condenser', 'Drain pan', 'Drain kill switch', 'Thermostat',
    'Repair any damage to ductwork', 'Thermostat',
    '10 years on major parts', '2 year labor warranty',
  ],
  amount: 15000, subtotal: 15000, tax: 0, total: 15000, payment: 7500, balance: 7500,
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

// ---- Air Filter section (client-facing) ------------------------------------
// One record per FILTER LOCATION, not per home. Due math: dueIn = intervalDays
// − sinceChanged, both in days, evaluated against the pinned APP_TODAY.
export const filterSeed = [
  {
    nickname: 'Upstairs · hallway ceiling',
    system: 'System 1 · Goodman 3-Ton',
    nominal: '20x25x1',
    actual: '19.5 × 24.5 × 0.75',
    thickness: '1"',
    ftype: '1-inch pleated',
    merv: 11,
    brand: 'Filtrete',
    pn: 'FLT-2025-M11',
    qty: 1,
    baseDays: 60,
    modifiers: ['Pets in home · −25%'],
    intervalDays: 45,
    sinceChanged: 33,
    lastChangedLabel: 'May 23, 2025',
    source: 'Photo identified',
    confidence: 'High',
    arrow: 'Airflow arrow points UP, into the ceiling',
    keepOnHand: 'A 6-pack is about a year for you',
    log: [
      { date: 'May 23, 2025', by: 'customer', note: 'Logged from the home card' },
      { date: 'Apr 8, 2025', by: 'tech', tech: 'Chaun P.', note: 'Verified on spring tune-up · size confirmed against slot' },
      { date: 'Feb 21, 2025', by: 'customer', note: '' },
      { date: 'Jan 4, 2025', by: 'customer', note: 'Cedar season — swapped early' },
    ],
  },
  {
    nickname: 'Downstairs · media cabinet at unit',
    system: 'System 2 · Goodman GSX140421',
    nominal: '16x25x4',
    actual: '15.75 × 24.75 × 3.75',
    thickness: '4"',
    ftype: '4-inch media',
    merv: 13,
    brand: 'Honeywell',
    pn: 'FC100A1029',
    qty: 1,
    baseDays: 180,
    modifiers: ['Pets in home · −25%'],
    intervalDays: 135,
    sinceChanged: 41,
    lastChangedLabel: 'May 15, 2025',
    source: 'Tech verified',
    confidence: 'High',
    arrow: 'Airflow arrow points toward the furnace',
    keepOnHand: 'Two spares covers the year',
    log: [
      { date: 'May 15, 2025', by: 'tech', tech: 'Marcus D.', note: 'Replaced during maintenance visit · OEM media' },
      { date: 'Jan 2, 2025', by: 'customer', note: '' },
    ],
  },
]

// Simulated photo-identification read (the staged AI path — reads printed text
// off the frame, never measures). Confirm step is mandatory before any buy link.
export const filterScanResult = {
  nominal: '20x25x1',
  actual: '19.5 × 24.5 × 0.75',
  thickness: '1"',
  brand: 'Filtrete',
  pn: 'FLT-2025-M11',
  merv: 11,
  ftype: '1-inch pleated',
  confidence: 'High',
  legible: true,
}

// Buy options — link-outs only, size pre-filled. No inventory, no fulfillment.
export const filterRetailers = [
  { name: 'FilterBuy', note: 'Best price · ships to your door', eta: 'Arrives in 4–6 days', url: 'https://filterbuy.com/search/?q=' },
  { name: 'Amazon', note: 'Fastest delivery for most homes', eta: 'Arrives in 1–2 days', url: 'https://www.amazon.com/s?k=' },
  { name: 'Home Depot · New Braunfels', note: 'In-store pickup today', eta: 'Ready in ~2 hours', url: 'https://www.homedepot.com/s/' },
]

export const filterHowTo = {
  steps: [
    'Turn the system OFF at the thermostat first — never swap a filter with the blower running.',
    'Open the return grille (two thumb latches on yours) and slide the old filter out.',
    'Check the arrow on the new filter — yours points UP, into the ceiling.',
    'Slide it in, close the grille, turn the system back on.',
    'Tap “I changed it” below so your history stays warranty-ready.',
  ],
  warning: 'If the grille is painted shut or the filter looks wet or moldy, stop — that’s a tech visit, not a chore.',
}

// Optimize System tab — history, health, recommendations. Honest framing only:
// no invented efficiency percentages.
export const optimize = {
  habits: [
    { label: 'Current filter has been in', value: '33 days' },
    { label: 'You change your filter every', value: '47 days on average' },
    { label: 'On time', value: '5 of your last 6 changes' },
  ],
  timeline: [68, 51, 44, 48, 39, 33], // days per interval, oldest → current
  target: 45,
  checklist: [
    { name: 'Air filter', status: 'Due in 12 days', tone: 'amber', note: 'On track — reorder now and the box beats the due date.' },
    { name: 'Professional tune-up', status: 'Due soon', tone: 'amber', note: 'Last full service Apr 8. Fall tune-up keeps the 10-yr warranty valid.' },
    { name: 'Outdoor unit clearance', status: 'Good', tone: 'green', note: '2+ feet of clear space on all sides at last visit.' },
    { name: 'Condensate drain line', status: 'Flushed Apr 8', tone: 'green', note: 'Flushed at the spring tune-up. Annual is the target.' },
    { name: 'Vents & returns', status: 'Good', tone: 'green', note: 'No blocked supplies or returns reported.' },
    { name: 'System 2 age', status: '7 years', tone: 'amber', note: 'Mid-life. Nothing urgent — worth a capacity check at the next visit.' },
  ],
  recommendations: [
    {
      title: 'Book the fall tune-up',
      body: 'Keeps your 10-year parts warranty valid and catches small problems while they’re cheap. Your last professional service was April 8.',
      action: 'Book it',
    },
    {
      title: 'Outdoor coil cleaning · System 2',
      body: 'No professional cleaning on record in 18 months. A dirty coil makes the system work harder, cool less, and wear out sooner.',
      action: 'Book it',
    },
  ],
}

export const money = (n) => '$' + n.toLocaleString('en-US', n % 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {})
