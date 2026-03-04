import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/common/ThemeToggle';
import { Github, Linkedin, ArrowRight, Code2, Database, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const LandingPortfolioPage: React.FC = () => {
  const { t } = useTranslation(['portfolio', 'common']);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-textMain transition-colors duration-300 font-sans selection:bg-accent selection:text-surface">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-secondary/30 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="text-xl font-black tracking-tighter">
            <span className="text-accent">DEV</span>PORTFOLIO.
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
               onClick={() => navigate('/login')}
               className="group hidden sm:flex cursor-pointer items-center gap-2 rounded-full bg-textMain hover:bg-textMain/90 px-5 py-2 text-sm font-semibold text-surface transition-all hover:scale-105 shadow-md"
            >
              {t('common:login', 'Sign In System')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-5" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="max-w-4xl"
          >
            <motion.p variants={fadeIn} className="mb-4 font-mono text-accent text-lg font-medium">
              {t('portfolio:hero.greeting')}
            </motion.p>
            <motion.h1
              variants={fadeIn}
              className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.1] mb-6"
            >
              {t('portfolio:hero.role')} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-orange-400">
                {t('portfolio:hero.engineer')}
              </span>
            </motion.h1>
            <motion.p variants={fadeIn} className="max-w-2xl text-lg sm:text-xl text-textMuted mb-10 leading-relaxed">
              {t('portfolio:hero.description')} <strong className="text-textMain">{t('portfolio:hero.project_name')}</strong>.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer h-12 rounded-full bg-accent hover:bg-accent/90 px-8 font-bold text-surface shadow-lg shadow-accent/20 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              >
                {t('portfolio:hero.explore')}
              </button>
              <div className="flex items-center gap-4 ml-4">
                <a href="#" className="p-2 text-textMuted hover:text-accent transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="p-2 text-textMuted hover:text-accent transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-surface" id="skills">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-5xl font-black tracking-tight mb-16">
              {t('portfolio:skills.title')}
            </motion.h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div variants={fadeIn} className="rounded-3xl bg-surface p-8 border border-secondary/50 shadow-sm hover:shadow-md transition-shadow">
                <Layout className="mb-6 h-12 w-12 text-accent" />
                <h3 className="mb-4 text-2xl font-bold text-textMain">{t('portfolio:skills.frontend')}</h3>
                <p className="mb-6 text-textMuted leading-relaxed">
                  {t('portfolio:skills.frontend_desc')}
                </p>
                <ul className="space-y-3 font-medium text-textMain/80">
                  <li>React 19 & TypeScript</li>
                  <li>Tailwind CSS v4</li>
                  <li>Framer Motion</li>
                  <li>Zustand / Redux</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeIn} className="rounded-3xl bg-accent/5 border-2 border-accent/20 text-textMain p-8 shadow-xl shadow-accent/5 relative overflow-hidden transition-all hover:border-accent/40">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Database className="h-32 w-32 text-accent" />
                </div>
                <Database className="mb-6 h-12 w-12 text-accent" />
                <h3 className="mb-4 text-2xl font-bold">{t('portfolio:skills.backend')}</h3>
                <p className="mb-6 text-textMuted leading-relaxed">
                  {t('portfolio:skills.backend_desc')}
                </p>
                <ul className="space-y-3 font-medium text-textMain/90">
                  <li>Node.js & Express</li>
                  <li>PostgreSQL & Prisma ORM</li>
                  <li>Socket.io (Real-time sync)</li>
                  <li>JWT Authentication</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeIn} className="rounded-3xl bg-surface p-8 border border-secondary/50 shadow-sm hover:shadow-md transition-shadow">
                <Code2 className="mb-6 h-12 w-12 text-accent" />
                <h3 className="mb-4 text-2xl font-bold text-textMain">{t('portfolio:skills.devops')}</h3>
                <p className="mb-6 text-textMuted leading-relaxed">
                  {t('portfolio:skills.devops_desc')}
                </p>
                <ul className="space-y-3 font-medium text-textMain/80">
                  <li>Docker & Docker Compose</li>
                  <li>Nginx Reverse Proxy</li>
                  <li>Git / GitHub Actions</li>
                  <li>ESLint & Prettier</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="py-32" id="projects">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              {t('portfolio:projects.title')}
            </h2>
            <p className="max-w-2xl text-xl text-textMuted">
              {t('portfolio:projects.subtitle')}
            </p>
          </div>

          <div className="space-y-32">
            {/* Project Feature 1 */}
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-4/3 rounded-3xl bg-surface border border-secondary/50 overflow-hidden group shadow-xl cursor-pointer"
                onClick={() => navigate('/pos')}
                title="Click to view live Demo"
              >
                <img src="/mockups/pos_mockup.png" alt="POS Menu Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-700 bg-black/40 hover:bg-black/20">
                  <span className="text-4xl mb-2 drop-shadow-lg">{t('portfolio:projects.preview_pos')}</span>
                  <span className="text-sm border border-white/80 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100 translate-y-4 group-hover:translate-y-0 backdrop-blur-sm bg-black/20">Try Live Demo</span>
                </div>
              </motion.div>
              <div>
                <div className="inline-block rounded-full bg-accent/10 px-4 py-1.5 font-mono text-sm font-semibold text-accent mb-6">
                  {t('portfolio:projects.feature_1')}
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-6">{t('portfolio:projects.pos_sync')}</h3>
                <p className="text-lg text-textMuted mb-8 leading-relaxed">
                  {t('portfolio:projects.pos_sync_desc')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React Query', 'Socket.io', 'Tailwind CSS'].map(tag => (
                    <span key={tag} className="rounded-lg bg-surface px-4 py-2 text-sm font-semibold border border-secondary/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Feature 2 */}
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-block rounded-full bg-accent/10 px-4 py-1.5 font-mono text-sm font-semibold text-accent mb-6">
                  {t('portfolio:projects.feature_2')}
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-6">{t('portfolio:projects.payment')}</h3>
                <p className="text-lg text-textMuted mb-8 leading-relaxed">
                  {t('portfolio:projects.payment_desc')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['VietQR API', 'Webhooks', 'Express.js'].map(tag => (
                    <span key={tag} className="rounded-lg bg-surface px-4 py-2 text-sm font-semibold border border-secondary/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-4/3 rounded-3xl bg-surface border border-secondary/50 overflow-hidden group shadow-xl order-1 lg:order-2 cursor-pointer"
                onClick={() => navigate('/kitchen')}
                title="Click to view Kitchen Demo"
              >
                <img src="/mockups/kitchen_mockup.png" alt="Kitchen Display System" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-700 bg-black/40 hover:bg-black/20">
                  <span className="text-4xl mb-2 drop-shadow-lg">{t('portfolio:projects.preview_payment')}</span>
                  <span className="text-sm border border-white/80 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100 translate-y-4 group-hover:translate-y-0 backdrop-blur-sm bg-black/20">Kitchen Live Demo</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="border-t border-secondary/50 bg-secondary/10 dark:bg-black/40 py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-8">{t('portfolio:footer.ready')}</h2>
          <p className="text-xl text-textMuted mb-10 max-w-2xl mx-auto">
            {t('portfolio:footer.description')}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="cursor-pointer h-14 rounded-full bg-textMain hover:bg-textMain/90 px-10 font-bold text-surface text-lg shadow-2xl transition-all hover:-translate-y-1 focus:outline-none"
          >
            {t('portfolio:footer.access')}
          </button>
          
          <div className="mt-32 pt-8 border-t border-secondary/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-textMuted text-sm">
            <p>{t('portfolio:footer.copyright')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Github</a>
              <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-accent transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPortfolioPage;
