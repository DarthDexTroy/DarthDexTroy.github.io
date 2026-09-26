import { FaEnvelope, FaExternalLinkAlt, FaFigma, FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'

export const NAV_ITEMS = [
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export const HERO_ROTATING_TEXT = [
  'AI/ML Builder',
  'Full-Stack Developer',
  'Hackathon Competitor',
]

export const HERO_CODE_SNIPPETS = [
  'model.fit(X, y)',
  'useState(null)',
  'torch.nn.Linear()',
  'yolo.predict(img)',
  'async fetchData()',
  'df.groupby(label)',
  'import torch as nn',
  "router.get('/api')",
  'loss.backward()',
  'X_train, X_test =',
  'groq.chat.complete',
  'ctx.clearRect(0,0)',
  'nn.Transformer()',
  'conf_score = 0.85',
  'React.useEffect()',
  'sklearn.metrics',
  'git commit -m fix',
  'docker run -p 8000',
  'optim.AdamW(lr=1e-4)',
  'np.dot(vec_a, vec_b)',
  'res.status(200).json',
  'useRef(null)',
  'embeddings.similarity',
  'pd.read_csv(data)',
  'useCallback(() => {})',
  'jwt.verify(token)',
  'tf.keras.layers',
  'F.relu(logits)',
  'prisma.user.findMany',
  'torch.no_grad()',
  'app.use(express.json)',
  'tensor.to("cuda")',
  'const [state, set]',
  'kubectl get pods',
  'dataloader = DataLoader',
  'supabase.auth.signUp',
  'plt.subplots(figsize)',
  'axios.get(url)',
  'precision_recall_f1',
  'npx vite build',
  'conv2d(in_ch, out_ch)',
  'framer.motion.div',
  'flask.Flask(__name__)',
  'git push origin main',
  'db.select().from(tbl)',
  'cors(origins="*")',
  'canvas.getContext("2d")',
  'docker-compose up',
  'items.map(item =>)',
  'npm run build',
  'event.preventDefault()',
  'window.requestAnim',
]

export const RESUME_PDF_URL = '/Vedha%20V%20Resume.pdf'

export const CONTACT_TERMINAL_TEXT = "> Hello, I'm open to research collabs, internships, and hackathon teams."

export const SKILL_CATEGORY_MAP = {
  Python: 'Core Language',
  Java: 'Core Language',
  'C++': 'Core Language',
  'React.js': 'Frontend',
  'React Native': 'Frontend',
  Vite: 'Frontend',
  Expo: 'Frontend',
  'Express.js': 'Backend',
  Flask: 'Backend',
  PyTorch: 'AI / ML',
  YOLOv8: 'AI / ML',
  'scikit-learn': 'AI / ML',
  Git: 'Dev Tool',
  Linux: 'OS / Infrastructure',
  Docker: 'OS / Infrastructure',
}

export const PROJECTS = [
  {
    title: 'PokeLearn',
    subtitle: 'HackAI 2026',
    accent: '#FFD700',
    details: [
      'Browser-based learning RPG in React 18 + Vite',
      'Gamified data science with Pokemon mechanics, 10 topic tracks',
      '4-tier adaptive placement, 200+ questions, Fisher-Yates shuffle',
      'Integrated Groq API (LLaMA 3.1) for ~250 tokens/sec AI tutoring',
    ],
    stack: ['React 18', 'Vite', 'Groq API', 'LLaMA 3.1'],
    award: false,
    links: [
      { label: 'Code', href: 'https://github.com/ishakumbam/PokeLearn', icon: FaGithub },
      { label: 'Devpost', href: 'https://devpost.com/software/application-meia3v', icon: FaExternalLinkAlt },
    ],
  },
  {
    title: 'FutureKey',
    subtitle: 'Spring 2026',
    accent: '#00FF88',
    details: [
      'React + Django real estate intelligence platform for Seattle/King County',
      'XGBoost price forecast model on geocoded housing data',
      'Interactive maps, property search, bid estimation via Django REST API',
    ],
    stack: ['React', 'Django', 'XGBoost', 'REST API'],
    award: false,
    links: [
      { label: 'Code', href: 'https://github.com/AI-Mentorship-S26/futurekey', icon: FaGithub },
    ],
  },
  {
    title: 'ClarityInvest',
    subtitle: 'Spring 2026',
    accent: '#00BFFF',
    details: [
      'Built a React + Vite investing platform supporting 5 account types (Brokerage, Roth IRA, HSA, 401(k), 529) with plain-English AI guidance via Groq API',
      'Rendered a Three.js (React Three Fiber) live global risk map connecting geopolitical events to portfolio impact with what-if scenario simulations',
    ],
    stack: ['React', 'Vite', 'Three.js', 'React Three Fiber', 'Groq API'],
    award: false,
    links: [
      { label: 'Code', href: 'https://github.com/DarthDexTroy/clarityinvest', icon: FaGithub },
    ],
  },
  {
    title: 'TrustEstate AI',
    subtitle: 'HackUTD 2025',
    accent: '#FF6B35',
    details: [
      '2nd Place – CBRE Challenge at HackUTD 2025, built as an AI-powered commercial real estate intelligence platform for evaluating properties and market opportunities.',
      'Developed a trust-scored AI assistant using Google Gemini that analyzes properties through natural-language queries and provides confidence scores, source citations, data-conflict detection, and financial insights.',
      'Built an interactive Google Maps dashboard with property search, filtering, market analytics, historical trends, and side-by-side comparison tools for evaluating multiple properties.',
    ],
    stack: ['React 18', 'TypeScript', 'Gemini', 'Google Maps', 'Recharts'],
    award: true,
    links: [
      { label: 'Code', href: 'https://github.com/DarthDexTroy/cbre-ai-assistant', icon: FaGithub },
      { label: 'Devpost', href: 'https://devpost.com/software/cbre-project', icon: FaExternalLinkAlt },
    ],
  },
  {
    title: 'Pediatric X-Ray Cancer Detection',
    subtitle: 'AIMD Fall 2025',
    accent: '#8B5CF6',
    details: [
      'Developed an AI-powered medical imaging system that analyzes pediatric X-rays to identify and localize potential abnormalities.',
      'Built an end-to-end PyTorch pipeline for image preprocessing, model training, and evaluation using large-scale chest X-ray datasets.',
      'Designed the system to generate preliminary findings and visual localization while keeping the final interpretation with the human reviewer.',
    ],
    stack: ['PyTorch', 'CNN', 'CheXpert', 'ML Ops'],
    award: true,
    links: null,
  },
  {
    title: '77 GHz Automotive Radar',
    subtitle: 'IEEE Fall 2024',
    accent: '#00E5FF',
    details: [
      'Developed a 77 GHz radar-based obstacle detection system designed to provide reliable proximity sensing when traditional camera visibility is limited.',
      'Designed and simulated the radar antenna system in Ansys HFSS to detect nearby objects and determine their distance and trajectory.',
      'Processed radar data through an embedded system and CAN Bus to display surrounding obstacles on a real-time 2D polar proximity interface.',
    ],
    stack: ['mmWave', 'CAN Bus', 'Ansys HFSS', 'Embedded'],
    award: false,
    links: null,
  },
  {
    title: 'Diagnostiq',
    subtitle: 'Axxess 2026',
    accent: '#EC4899',
    details: [
      'AI diagnostic assistant capturing clinician-patient conversations via speech-to-text',
      'Extracts key symptoms, generates patient-friendly summaries, and exports EMR reports',
      'Links prescribed medications directly to retail pharmacies (Walmart, CVS, Amazon)',
    ],
    stack: ['React', 'Featherless AI', 'Speech-to-Text', 'EMR Export'],
    award: false,
    links: [
      { label: 'Code', href: 'https://github.com/DarthDexTroy/diagnostiq', icon: FaGithub },
      { label: 'Devpost', href: 'https://devpost.com/software/diagnostiq', icon: FaExternalLinkAlt },
    ],
  },
  {
    title: 'myCheckUp',
    subtitle: 'Axxess 2026',
    accent: '#06B6D4',
    details: [
      'Healthcare web and mobile app featuring an interactive survey and chatbot system',
      'Collects patient health inputs to deliver automated, personalized care recommendations',
      'Secured with Google OAuth authentication and a Python/Flask backend REST API',
    ],
    stack: ['React', 'Python', 'Flask', 'Google OAuth'],
    award: false,
    links: [
      { label: 'Code', href: 'https://github.com/eric134/AxxessHackathon2025', icon: FaGithub },
      { label: 'Devpost', href: 'https://devpost.com/software/mycheckup', icon: FaExternalLinkAlt },
    ],
  },
  {
    title: 'Detecting Deficiencies',
    subtitle: 'HackUTD 2024',
    accent: '#F59E0B',
    details: [
      'Web app converting large-scale gas valve sensor telemetry into scatterplots',
      'Detects hydrate formation and flow deficiencies to alert lease operators in real time',
      'Built data analysis & visualization in Python (Pandas, Plotly), React, and Tailwind CSS',
    ],
    stack: ['Python', 'Pandas', 'Plotly', 'React', 'Tailwind CSS'],
    award: false,
    links: [
      { label: 'Figma', href: 'https://www.figma.com/design/hbRnkPUnRLnGO6FriYkCV6/HackUTD-App?node-id=0-1&t=jdwEtehtv1Q1hLGw-1', icon: FaFigma },
      { label: 'Devpost', href: 'https://devpost.com/software/hackutd-tekvaq', icon: FaExternalLinkAlt },
    ],
  },
  {
    title: 'YotaMatch',
    subtitle: 'HackUTD 2025',
    accent: '#10B981',
    details: [
      'Chat-based web app matching buyers to Toyota vehicles, trim packages, and financing',
      'Tailors vehicle recommendations based on customer lifestyle and budget input',
      'Maintains persistent conversation memory and state powered by Supabase backend',
    ],
    stack: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Supabase'],
    award: false,
    links: [
      { label: 'Code', href: 'https://github.com/DarthDexTroy/toyota-matchmaker', icon: FaGithub },
      { label: 'Devpost', href: 'https://devpost.com/software/toyota-website', icon: FaExternalLinkAlt },
    ],
  },
  {
    title: 'FitLifeAI – AI-Powered Fitness & Diet App',
    subtitle: 'AIMD Spring 2025',
    accent: '#00D4AA',
    details: [
      'Developed an AI-powered fitness and nutrition platform for UTD students that generates personalized health plans based on fitness goals, dietary preferences, and campus dining options.',
      'Built a full-stack application using Node.js and Supabase, integrated Ollama and Mistral AI for personalized recommendations.',
      'Developed Selenium web-scraping pipelines to incorporate UTD dining hall data.',
    ],
    stack: ['Node.js', 'Supabase', 'Selenium', 'Ollama', 'Mistral AI', 'HTML', 'CSS'],
    award: false,
    links: [
      { label: 'Code', href: 'https://github.com/AIMD-UTD/FitLifeAI', icon: FaGithub },
    ],
  },
]

export const CHRONOLOGICAL_PROJECTS = [
  PROJECTS[5],
  PROJECTS[8],
  PROJECTS[10],
  PROJECTS[4],
  PROJECTS[3],
  PROJECTS[9],
  PROJECTS[1],
  PROJECTS[2],
  PROJECTS[0],
  PROJECTS[6],
  PROJECTS[7],
]

export const LEFT_PROJECTS = [
  CHRONOLOGICAL_PROJECTS[0],
  CHRONOLOGICAL_PROJECTS[2],
  CHRONOLOGICAL_PROJECTS[4],
  CHRONOLOGICAL_PROJECTS[6],
  CHRONOLOGICAL_PROJECTS[8],
  CHRONOLOGICAL_PROJECTS[10],
]
export const RIGHT_PROJECTS = [
  CHRONOLOGICAL_PROJECTS[1],
  CHRONOLOGICAL_PROJECTS[3],
  CHRONOLOGICAL_PROJECTS[5],
  CHRONOLOGICAL_PROJECTS[7],
  CHRONOLOGICAL_PROJECTS[9],
]

export const CONTACT_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/vedhavaddepally',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vedha-vaddepally-9a842133b/',
    icon: FaLinkedin,
  },
  {
    label: 'Email',
    href: 'mailto:vvaddepally2006@gmail.com',
    icon: HiOutlineMail,
  },
]

export const NAV_SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/vedhavaddepally',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vedha-vaddepally-9a842133b/',
    icon: FaLinkedin,
  },
  {
    label: 'Email',
    href: 'mailto:vvaddepally2006@gmail.com',
    icon: FaEnvelope,
  },
]
