/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

type Screen = 'menu' | 'settings' | 'difficulty' | 'stats' | 'help' | 'chars' | 'game';
type CharId = 'luntik' | 'kuzya' | 'mila' | null;
type SettingsTab = 'sound' | 'video' | 'language';
type Language = 'ru' | 'en';

const TRANSLATIONS = {
  ru: {
    title: 'ПЯТЬ НОЧЕЙ С ЛУНТИКОМ',
    subtitle: 'выживи до рассвета',
    play: 'Играть',
    chars: 'Характеристики',
    difficulty: 'Режимы / Ночи',
    stats: 'Статистика',
    help: 'Справка',
    settings: 'Настройки',
    exit: 'Выход',
    back: 'Назад',
    settingsTitle: 'Настройки',
    sound: 'Звук',
    video: 'Видео',
    language: 'Язык',
    masterVolume: 'Общая громкость',
    musicVolume: 'Музыка',
    sfxVolume: 'Звуки игры',
    ambienceVolume: 'Атмосфера',
    muteAll: 'Отключить звук',
    resolution: 'Разрешение',
    fullscreen: 'Полный экран',
    vsync: 'Вертикальная синхронизация',
    shadows: 'Тени',
    quality: 'Качество графики',
    low: 'Низкое',
    medium: 'Среднее',
    high: 'Высокое',
    interfaceLang: 'Язык интерфейса',
    gameLang: 'Язык субтитров',
    difficultyTitle: 'Режимы и Ночи',
    night: 'Ночь',
    statsTitle: 'Статистика игрока',
    nightsSurvived: 'Прожитых ночей',
    maxNight: 'Максимальная ночь',
    deaths: 'Смертей',
    timePlayed: 'Время в игре',
    achievements: 'Достижения',
    challenges: 'Челленджи',
    leaderboard: 'Рейтинг',
    helpTitle: 'Справка и Управление',
    howToPlay: 'Как играть',
    controls: 'Управление',
    exitConfirm: 'Уверены? Прогресс сохранён.',
  },
  en: {
    title: "FIVE NIGHTS AT LUNTIK'S",
    subtitle: 'survive till dawn',
    play: 'Play',
    chars: 'Characteristics',
    difficulty: 'Modes / Nights',
    stats: 'Statistics',
    help: 'Help',
    settings: 'Settings',
    exit: 'Exit',
    back: 'Back',
    settingsTitle: 'Settings',
    sound: 'Sound',
    video: 'Video',
    language: 'Language',
    masterVolume: 'Master Volume',
    musicVolume: 'Music',
    sfxVolume: 'SFX',
    ambienceVolume: 'Ambience',
    muteAll: 'Mute All',
    resolution: 'Resolution',
    fullscreen: 'Fullscreen',
    vsync: 'V-Sync',
    shadows: 'Shadows',
    quality: 'Graphics Quality',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    interfaceLang: 'Interface Language',
    gameLang: 'Subtitle Language',
    difficultyTitle: 'Modes & Nights',
    night: 'Night',
    statsTitle: 'Player Statistics',
    nightsSurvived: 'Nights Survived',
    maxNight: 'Max Night',
    deaths: 'Deaths',
    timePlayed: 'Time Played',
    achievements: 'Achievements',
    challenges: 'Challenges',
    leaderboard: 'Leaderboard',
    helpTitle: 'Help & Controls',
    howToPlay: 'How to Play',
    controls: 'Controls',
    exitConfirm: 'Sure? Progress is saved.',
  }
};

const nights = [
  { num: 1, name: { ru: 'Первая ночь', en: 'Night One' }, desc: { ru: 'Знакомство. Враги медлительны, но уже опасны.', en: 'Introduction. Enemies are slow but already dangerous.' }, unlocked: true, difficulty: 1 },
  { num: 2, name: { ru: 'Вторая ночь', en: 'Night Two' }, desc: { ru: 'Новые механики активируются. Будь осторожен.', en: 'New mechanics activate. Be careful.' }, unlocked: true, difficulty: 2 },
  { num: 3, name: { ru: 'Третья ночь', en: 'Night Three' }, desc: { ru: 'Они становятся агрессивнее. Не расслабляйся.', en: 'They become more aggressive. Stay alert.' }, unlocked: true, difficulty: 3 },
  { num: 4, name: { ru: 'Четвёртая ночь', en: 'Night Four' }, desc: { ru: 'Ночной кошмар. Одна ошибка — смерть.', en: 'Nightmare night. One mistake means death.' }, unlocked: false, difficulty: 4 },
  { num: 5, name: { ru: 'Финальная ночь', en: 'Final Night' }, desc: { ru: 'Все враги активны. Выживи до 6:00.', en: 'All enemies active. Survive till 6 AM.' }, unlocked: false, difficulty: 5 },
  { num: 6, name: { ru: 'Пользовательская', en: 'Custom Night' }, desc: { ru: 'Настрой сложность под себя — от 0 до 20.', en: 'Set difficulty your way — 0 to 20.' }, unlocked: false, difficulty: 0, custom: true },
];

const achievements = [
  { id: 1, icon: '🌙', name: { ru: 'Первая ночь', en: 'First Night' }, desc: { ru: 'Пережи первую ночь', en: 'Survive the first night' }, unlocked: true },
  { id: 2, icon: '💀', name: { ru: 'Первая смерть', en: 'First Death' }, desc: { ru: 'Погибни первый раз', en: 'Die for the first time' }, unlocked: true },
  { id: 3, icon: '🔦', name: { ru: 'Экономист', en: 'Economist' }, desc: { ru: 'Сохрани 50% заряда до 6 утра', en: 'Keep 50% power till 6 AM' }, unlocked: false },
  { id: 4, icon: '👁️', name: { ru: 'Вездесущий', en: 'Omniscient' }, desc: { ru: 'Проверь все камеры за ночь', en: 'Check all cameras in one night' }, unlocked: false },
  { id: 5, icon: '🏆', name: { ru: 'Чемпион', en: 'Champion' }, desc: { ru: 'Пройди все 5 ночей', en: 'Complete all 5 nights' }, unlocked: false },
  { id: 6, icon: '👹', name: { ru: 'Безумец', en: 'Madman' }, desc: { ru: 'Пройди ночь 6 на уровне 20/20', en: 'Complete night 6 at 20/20' }, unlocked: false },
];

const challenges = [
  { id: 1, name: { ru: 'Без света', en: 'Lights Off' }, desc: { ru: 'Пройди ночь без фонарика', en: 'Complete night without flashlight' }, reward: '500 очков', active: false },
  { id: 2, name: { ru: 'Скоростной забег', en: 'Speed Run' }, desc: { ru: 'Пережи ночь за минимальное время', en: 'Survive night in minimum time' }, reward: '750 очков', active: true },
  { id: 3, name: { ru: 'Железные нервы', en: 'Iron Nerves' }, desc: { ru: 'Не открывай камеры первые 2 часа', en: "Don't open cameras for first 2 hours" }, reward: '1000 очков', active: false },
];

const leaderboard = [
  { rank: 1, name: 'DarkSoul99', nights: 47, score: 15420, crown: true },
  { rank: 2, name: 'NightWatcher', nights: 38, score: 12100 },
  { rank: 3, name: 'PhobiaKing', nights: 31, score: 9850 },
  { rank: 4, name: 'Ты', nights: 3, score: 840, isPlayer: true },
  { rank: 5, name: 'GhostHunter', nights: 2, score: 620 },
];

const controlsList = [
  { ru: 'Камера влево/вправо', en: 'Camera left/right', key: 'A / D' },
  { ru: 'Закрыть дверь слева', en: 'Close left door', key: 'Q' },
  { ru: 'Закрыть дверь справа', en: 'Close right door', key: 'E' },
  { ru: 'Включить фонарик', en: 'Toggle flashlight', key: 'F' },
  { ru: 'Панель камер', en: 'Camera panel', key: 'ПРОБЕЛ' },
  { ru: 'Пауза', en: 'Pause', key: 'ESC' },
];

const CHARACTERS = {
  luntik: {
    id: 'luntik' as CharId,
    img: 'https://cdn.poehali.dev/projects/c32e205c-17d8-4a89-81ab-bdfc2c7ec03c/files/cb1af320-05eb-4deb-abb8-dd8a972a84e8.jpg',
    name: { ru: 'Лунтик', en: 'Luntik' },
    shortDesc: { ru: 'Главный преследователь. Добрый снаружи, опасный внутри.', en: 'Main pursuer. Kind outside, dangerous inside.' },
    fullDesc: { ru: 'Лунтик — существо с Луны, которое заблудилось в твоём офисе. Внешне он выглядит мило, но не дай себя обмануть. Когда он в плохом настроении, он движется к офису с удвоенной скоростью. Он очень обидчив — одно грубое слово в чате, и он уже у твоей двери.', en: 'Luntik is a creature from the Moon who got lost in your office. He looks cute, but don\'t be fooled. When in a bad mood, he moves twice as fast. He\'s very sensitive — one rude word in chat and he\'s already at your door.' },
    speed: 70,
    aggression: 60,
    sensitivity: 90,
    abilities: [
      { ru: 'Лунный рывок — ускоряется на 5 секунд', en: 'Moon Dash — speeds up for 5 seconds' },
      { ru: 'Обида — грубость в чате +30% к скорости', en: 'Grudge — rudeness in chat +30% speed' },
      { ru: 'Прятки — может скрыться с камер на 30 сек', en: 'Hide — can disappear from cameras for 30 sec' },
    ],
    color: '#9B59B6',
    threat: { ru: 'Высокая', en: 'High' },
  },
  kuzya: {
    id: 'kuzya' as CharId,
    img: 'https://cdn.poehali.dev/projects/c32e205c-17d8-4a89-81ab-bdfc2c7ec03c/files/40e67a41-c937-4b07-9770-782ee2066633.jpg',
    name: { ru: 'Кузя', en: 'Kuzya' },
    shortDesc: { ru: 'Рассудительный гусеница. Медленный, но методичный.', en: 'Thoughtful caterpillar. Slow but methodical.' },
    fullDesc: { ru: 'Кузя — умная гусеница, которая использует тактику. Он не торопится, но никогда не отступает. В чате он любит задавать вопросы — если ты не отвечаешь или отвечаешь грубо, он начинает проверять обе двери поочерёдно. Его сложнее всего остановить, когда он уже рядом.', en: 'Kuzya is a smart caterpillar who uses tactics. He doesn\'t rush, but never retreats. In chat he likes asking questions — if you ignore him or answer rudely, he starts checking both doors alternately. He\'s hardest to stop once he\'s nearby.' },
    speed: 40,
    aggression: 80,
    sensitivity: 50,
    abilities: [
      { ru: 'Тактика — проверяет обе двери по очереди', en: 'Tactics — checks both doors alternately' },
      { ru: 'Упорство — не реагирует на закрытую дверь', en: 'Persistence — ignores closed doors longer' },
      { ru: 'Молчание — игнорирование его злит', en: 'Silence — being ignored makes him angry' },
    ],
    color: '#27AE60',
    threat: { ru: 'Средняя', en: 'Medium' },
  },
  mila: {
    id: 'mila' as CharId,
    img: 'https://cdn.poehali.dev/projects/c32e205c-17d8-4a89-81ab-bdfc2c7ec03c/files/6290915f-0b9a-468b-bf5e-c8feae76da8a.jpg',
    name: { ru: 'Мила', en: 'Mila' },
    shortDesc: { ru: 'Быстрая пчела. Появляется внезапно, исчезает ещё быстрее.', en: 'Fast bee. Appears suddenly, disappears even faster.' },
    fullDesc: { ru: 'Мила — пчела, которая летает по всему зданию. Она самая быстрая из всех персонажей. В чате она флиртует и любит комплименты — если ты груб с ней, она атакует с воздуха, минуя двери. Единственная, кого не остановить дверью — нужно выключать свет.', en: 'Mila is a bee who flies all over the building. She\'s the fastest of all characters. In chat she flirts and loves compliments — be rude and she attacks from the air, bypassing doors. She\'s the only one doors can\'t stop — you need to turn off lights.' },
    speed: 95,
    aggression: 40,
    sensitivity: 75,
    abilities: [
      { ru: 'Полёт — обходит закрытые двери', en: 'Flight — bypasses closed doors' },
      { ru: 'Молниеносность — телепортируется в соседнюю камеру', en: 'Lightning — teleports to adjacent camera' },
      { ru: 'Обида на грубость — мгновенная атака', en: 'Offended — instant attack on rudeness' },
    ],
    color: '#F39C12',
    threat: { ru: 'Критическая', en: 'Critical' },
  },
};

type CharKey = keyof typeof CHARACTERS;

const GAME_MESSAGES = {
  luntik: [
    { from: 'char', ru: 'Привет! Как дела у тебя там?', en: 'Hello! How are you in there?' },
    { from: 'char', ru: 'Тут так темно... Можно я зайду?', en: 'It\'s so dark here... Can I come in?' },
    { from: 'char', ru: 'Мне холодно. Открой дверь...', en: 'I\'m cold. Open the door...' },
  ],
  kuzya: [
    { from: 'char', ru: 'Интересно, что ты там делаешь?', en: 'I wonder what you\'re doing in there?' },
    { from: 'char', ru: 'Ты слышишь меня? Отвечай!', en: 'Can you hear me? Answer me!' },
    { from: 'char', ru: 'Я никуда не уйду. Жди меня.', en: 'I\'m not leaving. Wait for me.' },
  ],
  mila: [
    { from: 'char', ru: 'Привееет! Ты такой милый :)', en: 'Hiiii! You\'re so cute :)' },
    { from: 'char', ru: 'Скажи мне что-нибудь приятное~', en: 'Say something nice to me~' },
    { from: 'char', ru: 'Я умею летать, знаешь ли...', en: 'I can fly, you know...' },
  ],
};

export default function Index() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('sound');
  const [lang, setLang] = useState<Language>('ru');
  const [mounted, setMounted] = useState(false);
  const [exitPrompt, setExitPrompt] = useState(false);
  const [statsTab, setStatsTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard'>('overview');
  const [helpTab, setHelpTab] = useState<'howto' | 'controls'>('howto');
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false });
  const [selectedChar, setSelectedChar] = useState<CharId>(null);
  const [leftDoor, setLeftDoor] = useState(false);
  const [rightDoor, setRightDoor] = useState(false);
  const [power, setPower] = useState(100);
  const [gameTime, setGameTime] = useState(0);
  const [activeChat, setActiveChat] = useState<CharKey>('luntik');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{from: string; text: string; rude?: boolean}[]>([
    { from: 'luntik', text: 'Привет! Как дела у тебя там?' },
  ]);

  const [masterVol, setMasterVol] = useState(80);
  const [musicVol, setMusicVol] = useState(60);
  const [sfxVol, setSfxVol] = useState(75);
  const [ambienceVol, setAmbienceVol] = useState(90);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vsync, setVsync] = useState(true);
  const [shadows, setShadows] = useState(true);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');

  const t = TRANSLATIONS[lang];

  useEffect(() => { setMounted(true); }, []);

  const notify = useCallback((msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
  }, []);

  const goTo = (s: Screen) => {
    setMounted(false);
    setTimeout(() => { setScreen(s); setMounted(true); }, 200);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="horror-toggle" onClick={onChange}>
      <input type="checkbox" checked={checked} readOnly />
      <span className="toggle-slider" />
    </label>
  );

  const Slider = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center gap-3 mt-2">
      <input type="range" min={0} max={100} value={value} className="horror-slider flex-1"
        onChange={e => onChange(Number(e.target.value))} />
      <span className="text-sm font-mono w-8 text-right" style={{ color: '#CC0000' }}>{value}</span>
    </div>
  );

  const BackBtn = () => (
    <button className="back-btn mb-8" onClick={() => goTo('menu')}>
      <Icon name="ChevronLeft" size={16} />
      {t.back}
    </button>
  );

  const DifficultyDots = ({ level }: { level: number }) => (
    <div className="flex gap-1 mt-2">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="w-2 h-2 rounded-full"
          style={{ background: i <= level ? '#CC0000' : 'rgba(139,0,0,0.2)', boxShadow: i <= level ? '0 0 4px rgba(200,0,0,0.6)' : 'none' }} />
      ))}
    </div>
  );

  return (
    <div className="horror-bg min-h-screen relative">
      <div className="horror-overlay fixed inset-0 z-0" />
      <div className="scanlines" />
      <div className="vignette" />

      {/* Toast notification */}
      <div className="fixed top-6 left-1/2 z-[200] transition-all duration-300"
        style={{
          transform: `translateX(-50%) translateY(${toast.visible ? '0' : '-80px'})`,
          opacity: toast.visible ? 1 : 0,
          pointerEvents: 'none',
        }}>
        <div className="px-5 py-3 text-sm font-medium tracking-wide"
          style={{
            background: 'rgba(8,0,0,0.97)',
            border: '1px solid rgba(200,0,0,0.6)',
            color: '#e8d5c0',
            boxShadow: '0 0 20px rgba(139,0,0,0.4)',
            whiteSpace: 'nowrap',
          }}>
          <span style={{ color: '#CC0000', marginRight: '8px' }}>▸</span>
          {toast.msg}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.25s ease' }}>

        {/* ═══ MAIN MENU ═══ */}
        {screen === 'menu' && (
          <div className="flex flex-col min-h-screen">
            <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 pt-16">
              <div className="mb-2">
                <div className="text-xs tracking-[0.4em] mb-3" style={{ color: 'rgba(180,0,0,0.8)' }}>
                  ▸ {lang === 'ru' ? 'ХОРРОР ВЫЖИВАНИЕ' : 'HORROR SURVIVAL'} ◂
                </div>
                <h1 className="font-horror animate-flicker leading-none"
                  style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)', color: '#CC0000', textShadow: '0 0 40px rgba(200,0,0,0.5), 0 0 80px rgba(139,0,0,0.3)' }}>
                  {t.title}
                </h1>
                <p className="text-sm tracking-[0.3em] mt-1 uppercase font-light"
                  style={{ color: 'rgba(180,160,140,0.5)' }}>
                  {t.subtitle}
                </p>
              </div>

              <div className="mt-2 mb-10">
                <span className="text-xs font-mono px-2 py-0.5"
                  style={{ color: 'rgba(139,0,0,0.7)', border: '1px solid rgba(139,0,0,0.2)', letterSpacing: '0.15em' }}>
                  v1.0.0 ALPHA
                </span>
              </div>

              <div className="flex flex-col gap-2 max-w-xs">
                {[
                  { label: t.play, icon: 'Play', action: () => goTo('game'), accent: true },
                  { label: t.chars, icon: 'User', action: () => goTo('chars') },
                  { label: t.difficulty, icon: 'Moon', action: () => goTo('difficulty') },
                  { label: t.stats, icon: 'BarChart2', action: () => goTo('stats') },
                  { label: t.help, icon: 'HelpCircle', action: () => goTo('help') },
                  { label: t.settings, icon: 'Settings', action: () => goTo('settings') },
                  { label: t.exit, icon: 'LogOut', action: () => setExitPrompt(true), danger: true },
                ].map((item, i) => (
                  <button key={i} className="menu-btn"
                    style={{
                      color: item.accent ? '#fff' : (item as any).danger ? 'rgba(180,60,60,0.8)' : undefined,
                      borderColor: item.accent ? 'rgba(200,0,0,0.6)' : (item as any).danger ? 'rgba(139,0,0,0.2)' : undefined,
                      background: item.accent ? 'linear-gradient(90deg, rgba(139,0,0,0.3) 0%, transparent 70%)' : undefined,
                    }}
                    onClick={item.action}>
                    <span className="relative z-10 flex items-center gap-3">
                      <Icon name={item.icon as any} size={15} />
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 md:px-20 lg:px-32 pb-6 flex items-center justify-between">
              <span className="text-xs font-mono" style={{ color: 'rgba(120,100,80,0.5)', letterSpacing: '0.1em' }}>
                © 2024 DARK STUDIOS
              </span>
              <div className="horror-radio">
                {(['ru', 'en'] as Language[]).map(l => (
                  <label key={l} className={l === lang ? 'active' : ''} onClick={() => setLang(l)}>
                    {l.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {screen === 'settings' && (
          <div className="max-w-2xl mx-auto w-full px-6 py-12">
            <BackBtn />
            <h2 className="section-title text-4xl mb-8">{t.settingsTitle}</h2>

            <div className="flex gap-0 mb-8 border-b" style={{ borderColor: 'rgba(139,0,0,0.3)' }}>
              {([['sound', t.sound, 'Volume2'], ['video', t.video, 'Monitor'], ['language', t.language, 'Globe']] as [SettingsTab, string, string][]).map(([tab, label, icon]) => (
                <button key={tab}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium tracking-wider uppercase transition-all"
                  style={{
                    color: settingsTab === tab ? '#CC0000' : 'rgba(180,160,140,0.5)',
                    borderBottom: settingsTab === tab ? '2px solid #CC0000' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                  onClick={() => setSettingsTab(tab)}>
                  <Icon name={icon as any} size={14} />
                  {label}
                </button>
              ))}
            </div>

            {settingsTab === 'sound' && (
              <div className="space-y-0 animate-fade-up">
                {([
                  [t.masterVolume, masterVol, setMasterVol],
                  [t.musicVolume, musicVol, setMusicVol],
                  [t.sfxVolume, sfxVol, setSfxVol],
                  [t.ambienceVolume, ambienceVol, setAmbienceVol],
                ] as [string, number, (v: number) => void][]).map(([label, val, setter]) => (
                  <div key={label} className="setting-row">
                    <div className="text-sm font-medium tracking-wide" style={{ color: 'rgba(220,200,180,0.9)' }}>{label}</div>
                    <Slider value={val} onChange={setter} />
                  </div>
                ))}
                <div className="setting-row flex items-center justify-between">
                  <div className="text-sm font-medium tracking-wide" style={{ color: 'rgba(220,200,180,0.9)' }}>{t.muteAll}</div>
                  <Toggle checked={muted} onChange={() => setMuted(!muted)} />
                </div>
              </div>
            )}

            {settingsTab === 'video' && (
              <div className="space-y-0 animate-fade-up">
                <div className="setting-row">
                  <div className="text-sm font-medium tracking-wide mb-2" style={{ color: 'rgba(220,200,180,0.9)' }}>{t.quality}</div>
                  <div className="horror-radio flex-wrap">
                    {(['low', 'medium', 'high'] as const).map(q => (
                      <label key={q} className={quality === q ? 'active' : ''} onClick={() => setQuality(q)}>
                        {t[q]}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="setting-row">
                  <div className="text-sm font-medium tracking-wide mb-2" style={{ color: 'rgba(220,200,180,0.9)' }}>{t.resolution}</div>
                  <div className="horror-radio flex-wrap">
                    {['1280×720', '1920×1080', '2560×1440'].map(r => (
                      <label key={r} className={r === '1920×1080' ? 'active' : ''}>{r}</label>
                    ))}
                  </div>
                </div>
                {([
                  [t.fullscreen, isFullscreen, () => setIsFullscreen(!isFullscreen)],
                  [t.vsync, vsync, () => setVsync(!vsync)],
                  [t.shadows, shadows, () => setShadows(!shadows)],
                ] as [string, boolean, () => void][]).map(([label, val, toggle]) => (
                  <div key={label} className="setting-row flex items-center justify-between">
                    <div className="text-sm font-medium tracking-wide" style={{ color: 'rgba(220,200,180,0.9)' }}>{label}</div>
                    <Toggle checked={val} onChange={toggle} />
                  </div>
                ))}
              </div>
            )}

            {settingsTab === 'language' && (
              <div className="space-y-0 animate-fade-up">
                {[t.interfaceLang, t.gameLang].map((label) => (
                  <div key={label} className="setting-row">
                    <div className="text-sm font-medium tracking-wide mb-3" style={{ color: 'rgba(220,200,180,0.9)' }}>{label}</div>
                    <div className="horror-radio">
                      {(['ru', 'en'] as Language[]).map(l => (
                        <label key={l} className={l === lang ? 'active' : ''} onClick={() => setLang(l)}>
                          {l === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ DIFFICULTY ═══ */}
        {screen === 'difficulty' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12">
            <BackBtn />
            <h2 className="section-title text-4xl mb-2">{t.difficultyTitle}</h2>
            <p className="text-sm mb-10 tracking-wide" style={{ color: 'rgba(180,160,140,0.5)' }}>
              {lang === 'ru' ? 'Выбери ночь или особый режим' : 'Choose a night or special mode'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nights.map((night, i) => (
                <div key={night.num} className={`night-card p-5 ${night.unlocked ? '' : 'locked'}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => night.unlocked && notify(lang === 'ru' ? `🌙 Запуск: ${night.name.ru}` : `🌙 Starting: ${night.name.en}`)}>
                  {!night.unlocked && (
                    <div className="absolute top-3 right-3">
                      <Icon name="Lock" size={14} style={{ color: 'rgba(139,0,0,0.5)' }} />
                    </div>
                  )}
                  <div className="font-horror text-5xl mb-1"
                    style={{ color: night.unlocked ? '#CC0000' : 'rgba(100,0,0,0.4)' }}>
                    {night.custom ? '★' : `0${night.num}`}
                  </div>
                  <div className="font-semibold text-sm tracking-wide mb-2"
                    style={{ color: night.unlocked ? 'rgba(220,200,180,0.9)' : 'rgba(120,100,80,0.4)' }}>
                    {night.name[lang]}
                  </div>
                  <p className="text-xs leading-relaxed"
                    style={{ color: night.unlocked ? 'rgba(160,140,120,0.7)' : 'rgba(80,60,40,0.4)' }}>
                    {night.desc[lang]}
                  </p>
                  {!night.custom && <DifficultyDots level={night.difficulty} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STATS ═══ */}
        {screen === 'stats' && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12">
            <BackBtn />
            <h2 className="section-title text-4xl mb-8">{t.statsTitle}</h2>

            <div className="flex gap-0 mb-8 border-b flex-wrap" style={{ borderColor: 'rgba(139,0,0,0.3)' }}>
              {([
                ['overview', lang === 'ru' ? 'Обзор' : 'Overview', 'BarChart2'],
                ['achievements', t.achievements, 'Trophy'],
                ['challenges', t.challenges, 'Zap'],
                ['leaderboard', t.leaderboard, 'Users'],
              ] as [typeof statsTab, string, string][]).map(([tab, label, icon]) => (
                <button key={tab}
                  className="flex items-center gap-2 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-all"
                  style={{
                    color: statsTab === tab ? '#CC0000' : 'rgba(180,160,140,0.5)',
                    borderBottom: statsTab === tab ? '2px solid #CC0000' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                  onClick={() => setStatsTab(tab)}>
                  <Icon name={icon as any} size={13} />
                  {label}
                </button>
              ))}
            </div>

            {statsTab === 'overview' && (
              <div className="animate-fade-up space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: t.nightsSurvived, value: '3', icon: 'Moon' },
                    { label: t.maxNight, value: '3', icon: 'TrendingUp' },
                    { label: t.deaths, value: '7', icon: 'Skull' },
                    { label: t.timePlayed, value: '2ч 14м', icon: 'Clock' },
                  ].map(stat => (
                    <div key={stat.label} className="p-4 text-center"
                      style={{ border: '1px solid rgba(139,0,0,0.25)', background: 'rgba(10,0,0,0.8)' }}>
                      <Icon name={stat.icon as any} size={20} style={{ color: '#CC0000', margin: '0 auto 0.5rem' }} />
                      <div className="font-horror text-3xl mb-1" style={{ color: '#CC0000' }}>{stat.value}</div>
                      <div className="text-xs tracking-wide" style={{ color: 'rgba(160,140,120,0.6)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ border: '1px solid rgba(139,0,0,0.2)', background: 'rgba(10,0,0,0.8)', padding: '1.25rem' }}>
                  <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(139,0,0,0.8)' }}>
                    {lang === 'ru' ? 'Прогресс по ночам' : 'Night Progress'}
                  </div>
                  {nights.slice(0, 5).map(night => (
                    <div key={night.num} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: 'rgba(180,160,140,0.7)' }}>{night.name[lang]}</span>
                        <span style={{ color: 'rgba(139,0,0,0.8)' }}>{night.num <= 3 ? `${night.num} раз` : '—'}</span>
                      </div>
                      <div className="h-1 rounded" style={{ background: 'rgba(139,0,0,0.15)' }}>
                        <div className="stat-bar-fill rounded" style={{ width: night.num <= 3 ? `${night.num * 30}%` : '0%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {statsTab === 'achievements' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-up">
                {achievements.map(a => (
                  <div key={a.id} className={`achievement-card p-4 flex items-start gap-3 ${a.unlocked ? 'unlocked' : ''}`}>
                    <div className="text-2xl flex-shrink-0" style={{ opacity: a.unlocked ? 1 : 0.2 }}>{a.icon}</div>
                    <div>
                      <div className="text-sm font-semibold tracking-wide mb-1"
                        style={{ color: a.unlocked ? 'rgba(220,200,180,0.9)' : 'rgba(100,80,60,0.5)' }}>
                        {a.name[lang]}
                      </div>
                      <div className="text-xs" style={{ color: a.unlocked ? 'rgba(160,140,120,0.7)' : 'rgba(80,60,40,0.4)' }}>
                        {a.desc[lang]}
                      </div>
                      {!a.unlocked && (
                        <div className="text-xs mt-1 flex items-center gap-1" style={{ color: 'rgba(139,0,0,0.4)' }}>
                          <Icon name="Lock" size={10} />
                          {lang === 'ru' ? 'Заблокировано' : 'Locked'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {statsTab === 'challenges' && (
              <div className="space-y-3 animate-fade-up">
                {challenges.map(c => (
                  <div key={c.id} className="p-4 flex items-center justify-between"
                    style={{
                      border: `1px solid ${c.active ? 'rgba(200,0,0,0.5)' : 'rgba(80,80,80,0.3)'}`,
                      background: 'rgba(10,0,0,0.8)',
                      boxShadow: c.active ? '0 0 10px rgba(139,0,0,0.2)' : 'none',
                    }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {c.active && <div className="w-2 h-2 rounded-full animate-pulse-red" style={{ background: '#CC0000' }} />}
                        <span className="text-sm font-semibold" style={{ color: 'rgba(220,200,180,0.9)' }}>
                          {c.name[lang]}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(160,140,120,0.6)' }}>{c.desc[lang]}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-xs font-mono" style={{ color: '#CC0000' }}>{c.reward}</div>
                      <button className="text-xs mt-1 px-3 py-1 transition-all"
                        style={{ border: '1px solid rgba(139,0,0,0.4)', color: 'rgba(200,160,140,0.8)' }}
                        onClick={() => notify(lang === 'ru' ? `⚡ Челлендж "${c.name.ru}" принят!` : `⚡ Challenge "${c.name.en}" accepted!`)}>
                        {lang === 'ru' ? (c.active ? 'Активен' : 'Принять') : (c.active ? 'Active' : 'Accept')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {statsTab === 'leaderboard' && (
              <div className="animate-fade-up" style={{ border: '1px solid rgba(139,0,0,0.2)', background: 'rgba(10,0,0,0.8)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(139,0,0,0.2)' }}>
                  <div className="grid grid-cols-12 text-xs tracking-widest uppercase" style={{ color: 'rgba(139,0,0,0.7)' }}>
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">{lang === 'ru' ? 'Игрок' : 'Player'}</div>
                    <div className="col-span-3 text-center">{lang === 'ru' ? 'Ночей' : 'Nights'}</div>
                    <div className="col-span-3 text-right">{lang === 'ru' ? 'Очки' : 'Score'}</div>
                  </div>
                </div>
                {leaderboard.map(row => (
                  <div key={row.rank} className="px-4 py-3 border-b grid grid-cols-12 items-center"
                    style={{
                      borderColor: 'rgba(139,0,0,0.1)',
                      background: row.isPlayer ? 'rgba(139,0,0,0.1)' : 'transparent',
                    }}>
                    <div className="col-span-1 font-horror text-xl"
                      style={{ color: row.rank <= 3 ? '#CC0000' : 'rgba(120,100,80,0.5)' }}>
                      {row.crown ? '👑' : row.rank}
                    </div>
                    <div className="col-span-5 text-sm font-medium"
                      style={{ color: row.isPlayer ? '#CC0000' : 'rgba(220,200,180,0.8)' }}>
                      {row.name} {row.isPlayer && <span style={{ color: 'rgba(139,0,0,0.7)' }}>← ты</span>}
                    </div>
                    <div className="col-span-3 text-center text-sm" style={{ color: 'rgba(160,140,120,0.7)' }}>{row.nights}</div>
                    <div className="col-span-3 text-right font-mono text-sm"
                      style={{ color: row.rank <= 3 ? '#CC0000' : 'rgba(160,140,120,0.7)' }}>
                      {row.score.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ HELP ═══ */}
        {screen === 'help' && (
          <div className="max-w-2xl mx-auto w-full px-6 py-12">
            <BackBtn />
            <h2 className="section-title text-4xl mb-8">{t.helpTitle}</h2>

            <div className="flex gap-0 mb-8 border-b" style={{ borderColor: 'rgba(139,0,0,0.3)' }}>
              {([['howto', t.howToPlay, 'BookOpen'], ['controls', t.controls, 'Gamepad2']] as [typeof helpTab, string, string][]).map(([tab, label, icon]) => (
                <button key={tab}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium tracking-wider uppercase transition-all"
                  style={{
                    color: helpTab === tab ? '#CC0000' : 'rgba(180,160,140,0.5)',
                    borderBottom: helpTab === tab ? '2px solid #CC0000' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                  onClick={() => setHelpTab(tab)}>
                  <Icon name={icon as any} size={14} />
                  {label}
                </button>
              ))}
            </div>

            {helpTab === 'howto' && (
              <div className="space-y-4 animate-fade-up">
                {(lang === 'ru' ? [
                  { title: 'Выживи до 6:00', icon: '🌅', text: 'Твоя цель — продержаться с 12 ночи до 6 утра. В здании ожидают аниматроники — роботизированные существа, которые охотятся на тебя.' },
                  { title: 'Следи за камерами', icon: '📷', text: 'Используй систему камер, чтобы отслеживать местоположение врагов. Чем раньше ты заметишь опасность — тем больше шансов выжить.' },
                  { title: 'Управляй дверями', icon: '🚪', text: 'Закрытые двери защищают тебя, но тратят электричество. Баланс между наблюдением и защитой — ключ к победе.' },
                  { title: 'Следи за питанием', icon: '⚡', text: 'Каждое действие расходует электроэнергию. Если питание кончится — ты останешься в темноте наедине с ними.' },
                ] : [
                  { title: 'Survive till 6 AM', icon: '🌅', text: 'Your goal is to last from midnight to 6 AM. Animatronics — robotic creatures — are hunting you in the building.' },
                  { title: 'Watch the cameras', icon: '📷', text: 'Use the camera system to track enemy locations. The sooner you spot danger, the better your survival chances.' },
                  { title: 'Manage the doors', icon: '🚪', text: "Closed doors protect you but drain electricity. Balancing observation and protection is the key to victory." },
                  { title: 'Watch your power', icon: '⚡', text: "If power runs out, you'll be left in darkness with them." },
                ]).map((item, i) => (
                  <div key={i} className="flex gap-4 p-4"
                    style={{ border: '1px solid rgba(139,0,0,0.2)', background: 'rgba(10,0,0,0.8)' }}>
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="font-semibold mb-1 text-sm tracking-wide" style={{ color: 'rgba(220,200,180,0.9)' }}>{item.title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: 'rgba(160,140,120,0.7)' }}>{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {helpTab === 'controls' && (
              <div className="animate-fade-up" style={{ border: '1px solid rgba(139,0,0,0.2)', background: 'rgba(10,0,0,0.8)' }}>
                {controlsList.map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: 'rgba(139,0,0,0.1)' }}>
                    <span className="text-sm" style={{ color: 'rgba(180,160,140,0.8)' }}>{c[lang]}</span>
                    <kbd className="px-2 py-1 text-xs font-mono"
                      style={{ background: 'rgba(139,0,0,0.15)', border: '1px solid rgba(139,0,0,0.4)', color: '#CC0000', borderRadius: '3px' }}>
                      {c.key}
                    </kbd>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ CHARS ═══ */}
        {screen === 'chars' && !selectedChar && (
          <div className="max-w-3xl mx-auto w-full px-6 py-12">
            <BackBtn />
            <h2 className="section-title text-4xl mb-2">{lang === 'ru' ? 'Персонажи' : 'Characters'}</h2>
            <p className="text-sm mb-10 tracking-wide" style={{ color: 'rgba(180,160,140,0.5)' }}>
              {lang === 'ru' ? 'Нажми на персонажа, чтобы узнать о нём больше' : 'Click a character to learn more'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(Object.values(CHARACTERS) as typeof CHARACTERS[CharKey][]).map(char => (
                <div key={char.id as string}
                  className="night-card p-0 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedChar(char.id)}>
                  <div className="relative overflow-hidden" style={{ height: '220px' }}>
                    <img src={char.img} alt={char.name.ru}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'brightness(0.7) contrast(1.1)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
                    <div className="absolute bottom-3 left-4">
                      <div className="font-horror text-2xl" style={{ color: char.color, textShadow: `0 0 15px ${char.color}` }}>
                        {char.name[lang]}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(180,160,140,0.75)' }}>
                      {char.shortDesc[lang]}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'rgba(139,0,0,0.7)' }}>{lang === 'ru' ? 'Угроза:' : 'Threat:'}</span>
                      <span className="font-semibold" style={{ color: char.color }}>{char.threat[lang]}</span>
                    </div>
                    <div className="mt-3 text-xs font-medium tracking-wider uppercase flex items-center gap-1"
                      style={{ color: 'rgba(139,0,0,0.6)' }}>
                      <Icon name="ChevronRight" size={12} />
                      {lang === 'ru' ? 'Подробнее' : 'Details'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CHAR DETAIL ═══ */}
        {screen === 'chars' && selectedChar && (() => {
          const char = CHARACTERS[selectedChar as CharKey];
          return (
            <div className="max-w-2xl mx-auto w-full px-6 py-12">
              <button className="back-btn mb-8" onClick={() => setSelectedChar(null)}>
                <Icon name="ChevronLeft" size={16} />
                {lang === 'ru' ? 'Все персонажи' : 'All characters'}
              </button>

              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="flex-shrink-0" style={{ width: '160px', height: '180px' }}>
                  <img src={char.img} alt={char.name.ru}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.75) contrast(1.1)', border: `1px solid ${char.color}40` }} />
                </div>
                <div className="flex-1">
                  <h2 className="font-horror text-4xl mb-1" style={{ color: char.color, textShadow: `0 0 20px ${char.color}60` }}>
                    {char.name[lang]}
                  </h2>
                  <div className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
                    style={{ color: 'rgba(139,0,0,0.6)' }}>
                    <span>{lang === 'ru' ? 'Угроза:' : 'Threat:'}</span>
                    <span style={{ color: char.color }}>{char.threat[lang]}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(180,160,140,0.8)' }}>
                    {char.fullDesc[lang]}
                  </p>
                </div>
              </div>

              {/* Stats bars */}
              <div className="mb-6 p-4" style={{ border: '1px solid rgba(139,0,0,0.2)', background: 'rgba(10,0,0,0.8)' }}>
                <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(139,0,0,0.7)' }}>
                  {lang === 'ru' ? 'Характеристики' : 'Stats'}
                </div>
                {[
                  { label: lang === 'ru' ? 'Скорость' : 'Speed', value: char.speed },
                  { label: lang === 'ru' ? 'Агрессия' : 'Aggression', value: char.aggression },
                  { label: lang === 'ru' ? 'Чувствительность' : 'Sensitivity', value: char.sensitivity },
                ].map(s => (
                  <div key={s.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'rgba(180,160,140,0.7)' }}>{s.label}</span>
                      <span style={{ color: char.color }}>{s.value}%</span>
                    </div>
                    <div className="h-1.5 rounded" style={{ background: 'rgba(139,0,0,0.15)' }}>
                      <div className="h-1.5 rounded transition-all duration-1000"
                        style={{ width: `${s.value}%`, background: `linear-gradient(90deg, #8B0000, ${char.color})`, boxShadow: `0 0 6px ${char.color}80` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Abilities */}
              <div style={{ border: '1px solid rgba(139,0,0,0.2)', background: 'rgba(10,0,0,0.8)' }}>
                <div className="px-4 py-3 border-b text-xs uppercase tracking-widest" style={{ borderColor: 'rgba(139,0,0,0.2)', color: 'rgba(139,0,0,0.7)' }}>
                  {lang === 'ru' ? 'Умения' : 'Abilities'}
                </div>
                {char.abilities.map((a, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3 border-b" style={{ borderColor: 'rgba(139,0,0,0.1)' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: char.color, boxShadow: `0 0 4px ${char.color}` }} />
                    <span className="text-sm" style={{ color: 'rgba(200,180,160,0.85)' }}>{a[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ═══ GAME ═══ */}
        {screen === 'game' && (
          <div className="fixed inset-0 z-20 flex flex-col" style={{ background: '#0a0400' }}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
              style={{ borderColor: 'rgba(139,0,0,0.3)', background: 'rgba(5,0,0,0.9)' }}>
              <button className="back-btn" onClick={() => goTo('menu')}>
                <Icon name="ChevronLeft" size={16} />
                {lang === 'ru' ? 'Меню' : 'Menu'}
              </button>
              <div className="flex items-center gap-6">
                <div className="text-xs font-mono" style={{ color: 'rgba(180,160,140,0.7)' }}>
                  {lang === 'ru' ? 'НОЧЬ 1' : 'NIGHT 1'} — 12:00 AM
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={12} style={{ color: power > 30 ? '#CC0000' : '#FF0000' }} />
                  <div className="w-20 h-2 rounded" style={{ background: 'rgba(139,0,0,0.2)' }}>
                    <div className="h-2 rounded transition-all duration-300"
                      style={{ width: `${power}%`, background: power > 50 ? '#CC0000' : power > 25 ? '#FF6600' : '#FF0000', boxShadow: `0 0 6px currentColor` }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#CC0000' }}>{power}%</span>
                </div>
              </div>
            </div>

            {/* Main area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Office view */}
              <div className="flex-1 relative flex items-end justify-center pb-0"
                style={{ background: 'radial-gradient(ellipse at 50% 60%, #1a0800 0%, #050200 70%)', minHeight: 0 }}>

                {/* Room ceiling */}
                <div className="absolute top-0 left-0 right-0 h-16"
                  style={{ background: 'linear-gradient(to bottom, #030100, transparent)' }} />

                {/* Walls */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/4 h-full" style={{ background: 'linear-gradient(to right, #0a0400, transparent)', borderRight: '2px solid rgba(60,30,0,0.4)' }} />
                  <div className="flex-1" />
                  <div className="w-1/4 h-full" style={{ background: 'linear-gradient(to left, #0a0400, transparent)', borderLeft: '2px solid rgba(60,30,0,0.4)' }} />
                </div>

                {/* Left door */}
                <div className="absolute left-0 top-0 bottom-0 w-1/5 flex flex-col items-center justify-center gap-3">
                  <div className="w-full flex-1 relative"
                    style={{ background: leftDoor ? 'rgba(20,8,0,0.98)' : 'transparent', borderRight: '3px solid rgba(80,40,0,0.6)', transition: 'background 0.3s' }}>
                    {leftDoor && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a0800 25%, #0d0400 75%)', border: '2px solid rgba(100,50,0,0.5)' }}>
                          <div className="h-full flex flex-col justify-around p-2">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-1 rounded" style={{ background: 'rgba(60,30,0,0.4)' }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {!leftDoor && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-3/4 h-3/4 border" style={{ borderColor: 'rgba(60,30,0,0.3)' }} />
                      </div>
                    )}
                  </div>
                  <button
                    className="mb-4 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all"
                    style={{
                      background: leftDoor ? 'rgba(139,0,0,0.4)' : 'rgba(30,15,0,0.8)',
                      border: `1px solid ${leftDoor ? 'rgba(200,0,0,0.6)' : 'rgba(80,40,0,0.5)'}`,
                      color: leftDoor ? '#CC0000' : 'rgba(180,140,100,0.7)',
                      boxShadow: leftDoor ? '0 0 10px rgba(139,0,0,0.4)' : 'none',
                    }}
                    onClick={() => { setLeftDoor(!leftDoor); setPower(p => Math.max(0, p - 2)); }}>
                    {leftDoor ? '🔒' : '🚪'} {lang === 'ru' ? 'Л' : 'L'}
                  </button>
                </div>

                {/* Right door */}
                <div className="absolute right-0 top-0 bottom-0 w-1/5 flex flex-col items-center justify-center gap-3">
                  <div className="w-full flex-1 relative"
                    style={{ background: rightDoor ? 'rgba(20,8,0,0.98)' : 'transparent', borderLeft: '3px solid rgba(80,40,0,0.6)', transition: 'background 0.3s' }}>
                    {rightDoor && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a0800 25%, #0d0400 75%)', border: '2px solid rgba(100,50,0,0.5)' }}>
                          <div className="h-full flex flex-col justify-around p-2">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-1 rounded" style={{ background: 'rgba(60,30,0,0.4)' }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {!rightDoor && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-3/4 h-3/4 border" style={{ borderColor: 'rgba(60,30,0,0.3)' }} />
                      </div>
                    )}
                  </div>
                  <button
                    className="mb-4 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all"
                    style={{
                      background: rightDoor ? 'rgba(139,0,0,0.4)' : 'rgba(30,15,0,0.8)',
                      border: `1px solid ${rightDoor ? 'rgba(200,0,0,0.6)' : 'rgba(80,40,0,0.5)'}`,
                      color: rightDoor ? '#CC0000' : 'rgba(180,140,100,0.7)',
                      boxShadow: rightDoor ? '0 0 10px rgba(139,0,0,0.4)' : 'none',
                    }}
                    onClick={() => { setRightDoor(!rightDoor); setPower(p => Math.max(0, p - 2)); }}>
                    {rightDoor ? '🔒' : '🚪'} {lang === 'ru' ? 'П' : 'R'}
                  </button>
                </div>

                {/* Desk */}
                <div className="absolute bottom-0 left-1/2 w-2/3 h-16 -translate-x-1/2"
                  style={{ background: 'linear-gradient(to top, #2a1200, #1a0a00)', borderTop: '3px solid rgba(100,50,0,0.6)', borderRadius: '4px 4px 0 0' }}>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4">
                    <div className="w-8 h-8 rounded" style={{ background: 'rgba(139,0,0,0.2)', border: '1px solid rgba(139,0,0,0.3)' }} />
                    <div className="w-12 h-8 rounded" style={{ background: 'rgba(20,10,0,0.8)', border: '1px solid rgba(80,40,0,0.4)' }} />
                  </div>
                </div>

                {/* Overhead lamp glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32"
                  style={{ background: 'radial-gradient(ellipse, rgba(200,120,0,0.08) 0%, transparent 70%)' }} />

                {/* Status text */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest"
                  style={{ color: 'rgba(139,0,0,0.5)' }}>
                  {power < 20 ? (lang === 'ru' ? '⚠ ПИТАНИЕ КРИТИЧНО' : '⚠ POWER CRITICAL') : (lang === 'ru' ? '● ВЫ В ОФИСЕ' : '● YOU ARE IN OFFICE')}
                </div>
              </div>

              {/* Tablet / Chat panel */}
              <div className="w-72 flex-shrink-0 flex flex-col border-l"
                style={{ borderColor: 'rgba(139,0,0,0.2)', background: 'rgba(5,0,0,0.95)' }}>

                {/* Tablet header */}
                <div className="px-3 py-2 border-b flex items-center gap-2"
                  style={{ borderColor: 'rgba(139,0,0,0.2)', background: 'rgba(10,0,0,0.9)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse-red" style={{ background: '#CC0000' }} />
                  <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'rgba(139,0,0,0.8)' }}>
                    {lang === 'ru' ? 'ПЛАНШЕТ — СВЯЗЬ' : 'TABLET — COMMS'}
                  </span>
                </div>

                {/* Character tabs */}
                <div className="flex border-b" style={{ borderColor: 'rgba(139,0,0,0.15)' }}>
                  {(Object.keys(CHARACTERS) as CharKey[]).map(key => {
                    const c = CHARACTERS[key];
                    return (
                      <button key={key}
                        className="flex-1 py-2 text-xs transition-all"
                        style={{
                          color: activeChat === key ? '#fff' : 'rgba(140,120,100,0.5)',
                          borderBottom: activeChat === key ? `2px solid ${c.color}` : '2px solid transparent',
                          background: activeChat === key ? `${c.color}18` : 'transparent',
                          marginBottom: '-1px',
                        }}
                        onClick={() => {
                          setActiveChat(key);
                          const msgs = GAME_MESSAGES[key];
                          const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
                          setChatMessages(prev => [...prev, { from: key, text: randomMsg[lang === 'ru' ? 'ru' : 'en'] }]);
                        }}>
                        {c.name[lang]}
                      </button>
                    );
                  })}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: 0 }}>
                  {chatMessages.filter(m => m.from === activeChat || m.from === 'player').map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'player' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[85%] px-3 py-2 text-xs leading-relaxed"
                        style={{
                          background: msg.from === 'player'
                            ? (msg.rude ? 'rgba(139,0,0,0.35)' : 'rgba(30,15,0,0.9)')
                            : 'rgba(20,10,0,0.9)',
                          border: `1px solid ${msg.from === 'player' ? (msg.rude ? 'rgba(200,0,0,0.5)' : 'rgba(80,50,0,0.4)') : `${CHARACTERS[activeChat].color}30`}`,
                          color: msg.from === 'player' ? 'rgba(220,200,160,0.9)' : 'rgba(200,180,150,0.85)',
                          borderRadius: msg.from === 'player' ? '8px 2px 8px 8px' : '2px 8px 8px 8px',
                        }}>
                        {msg.rude && <span style={{ color: '#CC0000', marginRight: '4px' }}>⚠</span>}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatMessages.filter(m => m.from === activeChat || m.from === 'player').length === 0 && (
                    <div className="text-xs text-center mt-4" style={{ color: 'rgba(100,80,60,0.5)' }}>
                      {lang === 'ru' ? 'Нажми на вкладку персонажа' : 'Click a character tab'}
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-2 border-t" style={{ borderColor: 'rgba(139,0,0,0.2)' }}>
                  <div className="flex gap-1 mb-1">
                    {(lang === 'ru'
                      ? ['Привет!', 'Отстань', 'Уходи!!!']
                      : ['Hello!', 'Leave me', 'Go away!!!']).map((quick, qi) => (
                      <button key={qi}
                        className="flex-1 text-xs py-1 transition-all"
                        style={{
                          border: `1px solid ${qi === 2 ? 'rgba(200,0,0,0.4)' : 'rgba(80,50,0,0.4)'}`,
                          color: qi === 2 ? 'rgba(200,80,80,0.8)' : 'rgba(160,130,100,0.7)',
                          background: 'rgba(10,5,0,0.6)',
                        }}
                        onClick={() => {
                          const isRude = qi === 2;
                          setChatMessages(prev => [...prev, { from: 'player', text: quick, rude: isRude }]);
                          if (isRude) {
                            notify(lang === 'ru' ? `😈 ${CHARACTERS[activeChat].name.ru} злится!` : `😈 ${CHARACTERS[activeChat].name.en} is angry!`);
                            setPower(p => Math.max(0, p - 5));
                          }
                          const resp = GAME_MESSAGES[activeChat];
                          setTimeout(() => {
                            const r = resp[Math.floor(Math.random() * resp.length)];
                            setChatMessages(prev => [...prev, { from: activeChat, text: r[lang === 'ru' ? 'ru' : 'en'] }]);
                          }, 800);
                        }}>
                        {quick}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input
                      className="flex-1 px-2 py-1.5 text-xs outline-none"
                      style={{
                        background: 'rgba(15,5,0,0.8)',
                        border: '1px solid rgba(80,40,0,0.4)',
                        color: 'rgba(220,200,160,0.9)',
                      }}
                      placeholder={lang === 'ru' ? 'Напиши ответ...' : 'Type reply...'}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && chatInput.trim()) {
                          const rudeWords = ['уходи', 'отстань', 'заткнись', 'дурак', 'go away', 'shut up', 'leave'];
                          const isRude = rudeWords.some(w => chatInput.toLowerCase().includes(w));
                          setChatMessages(prev => [...prev, { from: 'player', text: chatInput, rude: isRude }]);
                          if (isRude) {
                            notify(lang === 'ru' ? `😈 ${CHARACTERS[activeChat].name.ru} злится!` : `😈 ${CHARACTERS[activeChat].name.en} is angry!`);
                            setPower(p => Math.max(0, p - 5));
                          }
                          const resp = GAME_MESSAGES[activeChat];
                          const r = resp[Math.floor(Math.random() * resp.length)];
                          setTimeout(() => {
                            setChatMessages(prev => [...prev, { from: activeChat, text: r[lang === 'ru' ? 'ru' : 'en'] }]);
                          }, 800);
                          setChatInput('');
                        }
                      }}
                    />
                    <button
                      className="px-3 py-1.5 text-xs font-bold"
                      style={{ background: 'rgba(139,0,0,0.3)', border: '1px solid rgba(139,0,0,0.5)', color: '#CC0000' }}
                      onClick={() => {
                        if (!chatInput.trim()) return;
                        const rudeWords = ['уходи', 'отстань', 'заткнись', 'дурак', 'go away', 'shut up', 'leave'];
                        const isRude = rudeWords.some(w => chatInput.toLowerCase().includes(w));
                        setChatMessages(prev => [...prev, { from: 'player', text: chatInput, rude: isRude }]);
                        if (isRude) {
                          notify(lang === 'ru' ? `😈 ${CHARACTERS[activeChat].name.ru} злится!` : `😈 ${CHARACTERS[activeChat].name.en} is angry!`);
                          setPower(p => Math.max(0, p - 5));
                        }
                        const resp = GAME_MESSAGES[activeChat];
                        const r = resp[Math.floor(Math.random() * resp.length)];
                        setTimeout(() => {
                          setChatMessages(prev => [...prev, { from: activeChat, text: r[lang === 'ru' ? 'ru' : 'en'] }]);
                        }, 800);
                        setChatInput('');
                      }}>
                      ▸
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ EXIT PROMPT ═══ */}
        {exitPrompt && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
            <div className="p-8 max-w-sm w-full mx-4"
              style={{ background: 'rgba(8,0,0,0.95)', border: '1px solid rgba(139,0,0,0.5)', boxShadow: '0 0 40px rgba(139,0,0,0.3)' }}>
              <h3 className="font-horror text-2xl mb-2" style={{ color: '#CC0000' }}>
                {lang === 'ru' ? 'Выход из игры' : 'Exit Game'}
              </h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(180,160,140,0.7)' }}>{t.exitConfirm}</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 text-sm font-semibold tracking-wider uppercase transition-all"
                  style={{ border: '1px solid rgba(139,0,0,0.5)', color: '#CC0000', background: 'rgba(139,0,0,0.1)' }}
                  onClick={() => { setExitPrompt(false); notify(lang === 'ru' ? '👋 До свидания...' : '👋 Goodbye...'); }}>
                  {lang === 'ru' ? 'Выйти' : 'Exit'}
                </button>
                <button className="flex-1 py-2 text-sm font-semibold tracking-wider uppercase transition-all"
                  style={{ border: '1px solid rgba(80,80,80,0.4)', color: 'rgba(180,160,140,0.7)' }}
                  onClick={() => setExitPrompt(false)}>
                  {lang === 'ru' ? 'Остаться' : 'Stay'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}