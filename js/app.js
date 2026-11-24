(function () {
  'use strict';

  window.PulseFit = window.PulseFit || {};
  var Storage = window.PulseFitStorage || {};

  var SUPPORTED_LANGS = ['es', 'en', 'pt', 'fr', 'it', 'de', 'ru', 'ja'];
  var LOCALE = { es: 'es-ES', en: 'en-US', pt: 'pt-BR', fr: 'fr-FR', it: 'it-IT', de: 'de-DE', ru: 'ru-RU', ja: 'ja-JP' };
  var curLang = 'es';
  var I18N = window.PULSEFIT_I18N || {};

  var ALL_EXERCISES = [
    // Pecho
    { key: 'bench_press', es: 'Press de banca plana', en: 'Flat bench press', pt: 'Supino reto', fr: 'Développé couché', it: 'Panca piana', de: 'Bankdrücken (flach)', ru: 'Жим штанги лежа', ja: 'ベンチプレス', muscle: 'pecho', pattern: 'empuje_h', equipment: ['barra', 'banco'], tipo: 'barra' },
    { key: 'db_bench_press', es: 'Press plano con mancuernas', en: 'Flat dumbbell press', pt: 'Supino reto com halteres', fr: 'Développé couché avec haltères', it: 'Distensioni su panca con manubri', de: 'Kurzhantel-Bankdrücken', ru: 'Жим гантелей лежа', ja: 'ダンベルベンチプレス', muscle: 'pecho', pattern: 'empuje_h', equipment: ['mancuernas', 'banco'], tipo: 'mancuernas' },
    { key: 'chest_press_mach', es: 'Press de pecho en máquina multifuncional', en: 'Machine chest press', pt: 'Supino na máquina multifuncional', fr: 'Presse pectoraux sur machine', it: 'Distensioni su panca alla macchina', de: 'Brustpresse (Maschine)', ru: 'Жим от груди в тренажере', ja: 'チェストプレスマシン', muscle: 'pecho', pattern: 'empuje_h', equipment: ['maquinas_pecho_hombro'], tipo: 'maquina' },
    { key: 'push_ups', es: 'Flexiones de brazos (lagartijas)', en: 'Push-ups', pt: 'Flexões de braço', fr: 'Pompes', it: 'Piegamenti sulle braccia', de: 'Liegestütze', ru: 'Отжимания от пола', ja: 'プッシュアップ (腕立て伏せ)', muscle: 'pecho', pattern: 'empuje_h', equipment: ['peso_corporal'], tipo: 'peso_corporal' },
    { key: 'db_incline_press', es: 'Press inclinado con mancuernas', en: 'Incline dumbbell press', pt: 'Supino inclinado com halteres', fr: 'Développé incliné avec haltères', it: 'Distensioni inclinate con manubri', de: 'Schrägbankdrücken mit Kurzhanteln', ru: 'Жим гантелей на наклонной скамье', ja: 'インクラインダンベルプレス', muscle: 'pecho', pattern: 'empuje_h', equipment: ['mancuernas', 'banco'], tipo: 'mancuernas' },
    { key: 'db_flyes', es: 'Aperturas con mancuernas', en: 'Dumbbell flyes', pt: 'Crucifixo com halteres', fr: 'Écartés avec haltères', it: 'Croci con manubri', de: 'Kurzhantel-Fliegende', ru: 'Разведение гантелей лежа', ja: 'ダンベルフライ', muscle: 'pecho', pattern: 'aislamiento', equipment: ['mancuernas', 'banco'], tipo: 'mancuernas' },
    { key: 'pec_deck', es: 'Aperturas en máquina (pec deck)', en: 'Pec deck fly', pt: 'Voador / Peck deck', fr: 'Écarté sur machine (pec deck)', it: 'Pectoral machine (pec deck)', de: 'Pec Deck / Butterfly', ru: 'Баттерфляй (Пек-дек)', ja: 'ペックデックフライ', muscle: 'pecho', pattern: 'aislamiento', equipment: ['maquinas_pecho_hombro'], tipo: 'maquina' },
    { key: 'cable_chest_fly', es: 'Cruces de poleas para pecho', en: 'Cable chest fly', pt: 'Crucifixo no cabo', fr: 'Écartés à la poulie', it: 'Croci ai cavi', de: 'Kabelzug-Fliegende', ru: 'Сведение рук в кроссовере', ja: 'ケーブルチェストフライ', muscle: 'pecho', pattern: 'aislamiento', equipment: ['poleas'], tipo: 'poleas' },
    { key: 'dips', es: 'Fondos en paralelas', en: 'Parallel bar dips', pt: 'Mergulho nas paralelas', fr: 'Dips aux barres parallèles', it: 'Dip alle parallele', de: 'Barren-Dips', ru: 'Отжимания на брусьях', ja: 'ディップス', muscle: 'pecho', pattern: 'empuje_v', equipment: ['barra_dominadas'], tipo: 'peso_corporal' },

    // Espalda
    { key: 'deadlift', es: 'Peso muerto', en: 'Deadlift', pt: 'Levantamento terra', fr: 'Soulevé de terre', it: 'Stacco da terra', de: 'Kreuzheben', ru: 'Становая тяга', ja: 'デッドリフト', muscle: 'espalda', pattern: 'bisagra', equipment: ['barra'], tipo: 'barra' },
    { key: 'barbell_row', es: 'Remo con barra', en: 'Barbell row', pt: 'Remada com barra', fr: 'Rowing barre', it: 'Rematore con bilanciere', de: 'Langhantelrudern', ru: 'Тяга штанги в наклоне', ja: 'バーベルベントオーバーロウ', muscle: 'espalda', pattern: 'tiron_h', equipment: ['barra'], tipo: 'barra' },
    { key: 'db_row', es: 'Remo con mancuerna', en: 'Dumbbell row', pt: 'Remada com haltere', fr: 'Rowing avec haltère', it: 'Rematore con manubrio', de: 'Einarmiges Kurzhantelrudern', ru: 'Тяга гантели в наклоне', ja: 'ワンハンドダンベルロウ', muscle: 'espalda', pattern: 'tiron_h', equipment: ['mancuernas'], tipo: 'mancuernas', perSide: true },
    { key: 'lat_pulldown', es: 'Jalón al pecho', en: 'Lat pulldown', pt: 'Puxada alta', fr: 'Tirage poitrine', it: 'Lat machine avanti', de: 'Latzug zur Brust', ru: 'Тяга верхнего блока к груди', ja: 'ラットプルダウン', muscle: 'espalda', pattern: 'tiron_v', equipment: ['maquina_jalon_remo'], tipo: 'maquina' },
    { key: 'close_lat_pulldown', es: 'Jalón al pecho agarre cerrado', en: 'Close-grip lat pulldown', pt: 'Puxada alta pegada fechada', fr: 'Tirage poitrine prise serrée', it: 'Lat machine presa stretta', de: 'Latzug im engen Griff', ru: 'Тяга верхнего блока узким хватом', ja: 'ナローグラットプルダウン', muscle: 'espalda', pattern: 'tiron_v', equipment: ['maquina_jalon_remo'], tipo: 'maquina' },
    { key: 'row_mach', es: 'Remo en máquina multifuncional', en: 'Machine row', pt: 'Remada na máquina multifuncional', fr: 'Rowing sur machine', it: 'Rematore alla macchina', de: 'Rudern an der Maschine', ru: 'Тяга в тренажере (гребля)', ja: 'シーテッドローマシン', muscle: 'espalda', pattern: 'tiron_h', equipment: ['maquina_jalon_remo'], tipo: 'maquina' },
    { key: 'pull_ups', es: 'Dominadas pronas', en: 'Pull-ups', pt: 'Barra fixa pronada', fr: 'Tractions en pronation', it: 'Trazioni alla sbarra', de: 'Klimmzüge (Obergriff)', ru: 'Подтягивания прямым хватом', ja: 'プルアップ (順手懸垂)', muscle: 'espalda', pattern: 'tiron_v', equipment: ['barra_dominadas'], tipo: 'peso_corporal' },
    { key: 'chin_ups', es: 'Dominadas supinas', en: 'Chin-ups', pt: 'Barra fixa supinada', fr: 'Tractions en supination', it: 'Trazioni presa inversa', de: 'Klimmzüge (Untergriff)', ru: 'Подтягивания обратным хватом', ja: 'チンアップ (逆手懸垂)', muscle: 'espalda', pattern: 'tiron_v', equipment: ['barra_dominadas'], tipo: 'peso_corporal' },
    { key: 'seated_cable_row', es: 'Remo sentado en polea', en: 'Seated cable row', pt: 'Remada baixa no cabo', fr: 'Tirage horizontal à la poulie', it: 'Pulley basso al cavo', de: 'Kabelrudern sitzend', ru: 'Горизонтальная тяга блока', ja: 'シーテッドケーブルロウ', muscle: 'espalda', pattern: 'tiron_h', equipment: ['poleas'], tipo: 'poleas' },
    { key: 'db_shrugs', es: 'Encogimientos de hombros con mancuernas', en: 'Dumbbell shrugs', pt: 'Encolhimento de ombros com halteres', fr: 'Shrugs avec haltères', it: 'Scrollate con manubri', de: 'Kurzhantel-Shrugs', ru: 'Шраги с гантелями', ja: 'ダンベルシュラッグ', muscle: 'espalda', pattern: 'aislamiento', equipment: ['mancuernas'], tipo: 'mancuernas' },

    // Hombros
    { key: 'military_press', es: 'Press militar con barra', en: 'Barbell overhead press', pt: 'Desenvolvimento militar com barra', fr: 'Développé militaire barre', it: 'Military press con bilanciere', de: 'Military Press (Langhantel)', ru: 'Армейский жим штанги стоя', ja: 'ミリタリープレス (オーバーヘッドプレス)', muscle: 'hombros', pattern: 'empuje_v', equipment: ['barra'], tipo: 'barra' },
    { key: 'db_shoulder_press', es: 'Press de hombros con mancuernas', en: 'Dumbbell shoulder press', pt: 'Desenvolvimento com halteres', fr: 'Développé épaules avec haltères', it: 'Distensioni spalle con manubri', de: 'Schulterdrücken mit Kurzhanteln', ru: 'Жим гантелей сидя/стоя', ja: 'ダンベルショルダープレス', muscle: 'hombros', pattern: 'empuje_v', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'db_military_press', es: 'Press militar con mancuernas', en: 'Dumbbell military press', pt: 'Desenvolvimento militar com halteres', fr: 'Développé militaire avec haltères', it: 'Military press con manubri', de: 'Militärpress mit Kurzhanteln', ru: 'Армейский жим гантелей', ja: 'ダンベルミリタリープレス', muscle: 'hombros', pattern: 'empuje_v', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'shoulder_press_mach', es: 'Press de hombros en máquina', en: 'Machine shoulder press', pt: 'Desenvolvimento na máquina', fr: 'Presse épaules sur machine', it: 'Shoulder press alla macchina', de: 'Schulterpresse (Maschine)', ru: 'Жим на плечи в тренажере', ja: 'ショルダープレスマシン', muscle: 'hombros', pattern: 'empuje_v', equipment: ['maquinas_pecho_hombro'], tipo: 'maquina' },
    { key: 'db_lateral_raise', es: 'Elevaciones laterales con mancuernas', en: 'Dumbbell lateral raises', pt: 'Elevações laterais com halteres', fr: 'Élévations latérales avec haltères', it: 'Alzate laterali con manubri', de: 'Seitheben mit Kurzhanteln', ru: 'Махи гантелями в стороны', ja: 'サイドレイズ', muscle: 'hombros', pattern: 'aislamiento', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'db_rear_delt', es: 'Elevaciones posteriores con mancuernas', en: 'Dumbbell rear delt flyes', pt: 'Elevações posteriores com halteres', fr: 'Élévations postérieures com halteres', it: 'Alzate posteriori con manubri', de: 'Vorgebeugtes Seitheben', ru: 'Разведение гантелей в наклоне', ja: 'リアレイズ', muscle: 'hombros', pattern: 'aislamiento', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'cable_face_pull', es: 'Face pull en polea', en: 'Cable face pull', pt: 'Face pull no cabo', fr: 'Face pull à la poulie', it: 'Face pull ai cavi', de: 'Face Pulls am Kabelzug', ru: 'Тяга каната к лицу (Face Pull)', ja: 'ケーブルフェイスプル', muscle: 'hombros', pattern: 'aislamiento', equipment: ['poleas'], tipo: 'poleas' },
    { key: 'pike_push_ups', es: 'Flexiones pica (hombros)', en: 'Pike push-ups', pt: 'Flexões em pique', fr: 'Pompes en pique', it: 'Pike push-up', de: 'Pike-Liegestütze', ru: 'Отжимания уголком (Pike)', ja: 'パイクプッシュアップ', muscle: 'hombros', pattern: 'empuje_v', equipment: ['peso_corporal'], tipo: 'peso_corporal' },

    // Brazos
    { key: 'barbell_curl', es: 'Curl con barra', en: 'Barbell curl', pt: 'Rosca com barra', fr: 'Curl barre', it: 'Curl con bilanciere', de: 'Langhantel-Curl', ru: 'Подъем штанги на бицепс', ja: 'バーベルカール', muscle: 'biceps', pattern: 'aislamiento', equipment: ['barra'], tipo: 'barra' },
    { key: 'db_curl', es: 'Curl con mancuernas', en: 'Dumbbell curl', pt: 'Rosca com halteres', fr: 'Curl avec haltères', it: 'Curl con manubri', de: 'Kurzhantel-Curl', ru: 'Подъем гантелей на бицепс', ja: 'ダンベルカール', muscle: 'biceps', pattern: 'aislamiento', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'biceps_cable', es: 'Bíceps en polea', en: 'Cable bicep curl', pt: 'Rosca no cabo', fr: 'Curl biceps à la poulie', it: 'Curl bicipiti ai cavi', de: 'Kabelzug-Bizepscurl', ru: 'Сгибание рук на бицепс в блоке', ja: 'ケーブルバイセップスカール', muscle: 'biceps', pattern: 'aislamiento', equipment: ['poleas'], tipo: 'poleas' },
    { key: 'db_hammer_curl', es: 'Curl martillo con mancuernas', en: 'Dumbbell hammer curl', pt: 'Rosca martelo com halteres', fr: 'Curl marteau avec haltères', it: 'Curl a martello con manubri', de: 'Hammercurls', ru: 'Молотковые сгибания (Молотки)', ja: 'ハンマーカール', muscle: 'biceps', pattern: 'aislamiento', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'triceps_cable', es: 'Tríceps en polea', en: 'Cable triceps pushdown', pt: 'Tríceps no cabo', fr: 'Extension triceps à la poulie', it: 'Pushdown tricipiti ai cavi', de: 'Trizepsdrücken am Kabelzug', ru: 'Разгибание рук на трицепс в блоке', ja: 'ケーブルトライセプスプッシュダウン', muscle: 'triceps', pattern: 'aislamiento', equipment: ['poleas'], tipo: 'poleas' },
    { key: 'db_triceps_ext', es: 'Extensión de tríceps con mancuerna', en: 'Dumbbell overhead triceps extension', pt: 'Extensão de tríceps com haltere', fr: 'Extension triceps avec haltère', it: 'Estensioni tricipiti con manubrio', de: 'Kurzhantel-Trizepsdrücken über Kopf', ru: 'Французский жим с гантелью из-за головы', ja: 'ダンベルオーバーヘッドトライセプスエクステンション', muscle: 'triceps', pattern: 'aislamiento', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'db_triceps_copa', es: 'Extensión de tríceps en copa (mancuerna)', en: 'Cup-grip dumbbell triceps extension', pt: 'Extensão de tríceps em copa (halter)', fr: 'Extension triceps en coupe (haltère)', it: 'Estensione tricipiti a coppa (manubrio)', de: 'Trizepsdrücken im Bechergriff (Kurzhantel)', ru: 'Разгибание трицепса «чашкой» с гантелью', ja: 'カップグリップ・ダンベルトライセプスエクステンション', muscle: 'triceps', pattern: 'aislamiento', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'bench_dips', es: 'Fondos en banco para tríceps', en: 'Bench dips for triceps', pt: 'Tríceps no banco', fr: 'Dips sur banc pour triceps', it: 'Dip su panca per tricipiti', de: 'Bank-Dips für Trizeps', ru: 'Обратные отжимания от скамьи', ja: 'ベンチディップス', muscle: 'triceps', pattern: 'empuje_v', equipment: ['banco'], tipo: 'peso_corporal' },

    // Piernas
    { key: 'barbell_squat', es: 'Sentadilla con barra', en: 'Barbell back squat', pt: 'Agachamento com barra', fr: 'Squat à la barre', it: 'Squat con bilanciere', de: 'Kniebeugen mit Langhantel', ru: 'Приседания со штангой', ja: 'バーベルバックスクワット', muscle: 'piernas', pattern: 'sentadilla', equipment: ['barra'], tipo: 'barra' },
    { key: 'leg_press', es: 'Prensa de piernas', en: 'Leg press', pt: 'Leg press', fr: 'Presse à cuisses', it: 'Leg press', de: 'Beinpresse', ru: 'Жим ногами в тренажере', ja: 'レッグプレス', muscle: 'piernas', pattern: 'sentadilla', equipment: ['maquinas_pierna'], tipo: 'maquina' },
    { key: 'leg_extension', es: 'Extensión de cuádriceps en máquina', en: 'Leg extension', pt: 'Cadeira extensora', fr: 'Extension jambes machine', it: 'Leg extension', de: 'Beinstrecker (Maschine)', ru: 'Разгибание ног сидя в тренажере', ja: 'レッグエクステンション', muscle: 'piernas', pattern: 'aislamiento', equipment: ['maquinas_pierna'], tipo: 'maquina' },
    { key: 'leg_curl', es: 'Curl femoral en máquina', en: 'Leg curl', pt: 'Cadeira flexora', fr: 'Curl jambes machine', it: 'Leg curl', de: 'Beinbeuger (Maschine)', ru: 'Сгибание ног в тренажере', ja: 'レッグカール', muscle: 'piernas', pattern: 'aislamiento', equipment: ['maquinas_pierna'], tipo: 'maquina' },
    { key: 'db_goblet_squat', es: 'Sentadilla goblet con mancuerna', en: 'Dumbbell goblet squat', pt: 'Agachamento goblet com haltere', fr: 'Squat goblet avec haltère', it: 'Goblet squat con manubrio', de: 'Goblet Squat mit Kurzhantel', ru: 'Гоблет-приседания с гантелью', ja: 'ゴブレットスクワット', muscle: 'piernas', pattern: 'sentadilla', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'db_lunges', es: 'Zancadas con mancuernas', en: 'Dumbbell lunges', pt: 'Passadas com halteres', fr: 'Fentes avec haltères', it: 'Affondi con manubri', de: 'Ausfallschritte mit Kurzhanteln', ru: 'Выпады с гантелями', ja: 'ダンベルランジ', muscle: 'piernas', pattern: 'sentadilla', equipment: ['mancuernas'], tipo: 'mancuernas', perSide: true },
    { key: 'romanian_deadlift', es: 'Peso muerto rumano con mancuernas', en: 'Dumbbell Romanian deadlift', pt: 'Levantamento terra romeno com halteres', fr: 'Soulevé de terre roumain avec haltères', it: 'Stacco rumeno con manubri', de: 'Rumänisches Kreuzheben mit Kurzhanteln', ru: 'Румынская тяга с гантелями', ja: 'ルーマニアンデッドリフト', muscle: 'piernas', pattern: 'bisagra', equipment: ['mancuernas'], tipo: 'mancuernas' },
    { key: 'bodyweight_squat', es: 'Sentadilla libre (peso corporal)', en: 'Bodyweight squat', pt: 'Agachamento livre', fr: 'Squat poids du corps', it: 'Squat a corpo libero', de: 'Kniebeugen (Körpergewicht)', ru: 'Воздушные приседания (собственный вес)', ja: '自重スクワット', muscle: 'piernas', pattern: 'sentadilla', equipment: ['peso_corporal'], tipo: 'peso_corporal' },
    { key: 'bulgarian_split_squat', es: 'Sentadilla búlgara', en: 'Bulgarian split squat', pt: 'Agachamento búlgaro', fr: 'Squat bulgare', it: 'Squat bulgaro', de: 'Bulgarische Kniebeugen', ru: 'Болгарские приседания', ja: 'ブルガリアンスクワット', muscle: 'piernas', pattern: 'sentadilla', equipment: ['peso_corporal'], tipo: 'peso_corporal' },
    { key: 'glute_bridge', es: 'Puente de glúteos', en: 'Glute bridge', pt: 'Elevação pélvica', fr: 'Pont de fessiers', it: 'Ponte glutei', de: 'Glute Bridge / Beckenheben', ru: 'Ягодичный мостик', ja: 'グルートブリッジ', muscle: 'piernas', pattern: 'bisagra', equipment: ['peso_corporal'], tipo: 'peso_corporal' },
    { key: 'barbell_hip_thrust', es: 'Hip thrust con barra', en: 'Barbell hip thrust', pt: 'Hip thrust com barra', fr: 'Hip thrust avec barre', it: 'Hip thrust con bilanciere', de: 'Hip Thrust mit Langhantel', ru: 'Жим бедер со штангой (hip thrust)', ja: 'バーベルヒップスラスト', muscle: 'piernas', pattern: 'bisagra', equipment: ['barra'], tipo: 'barra' },
    { key: 'calf_raises', es: 'Elevación de talones (gemelos)', en: 'Standing calf raises', pt: 'Elevação de panturrilhas', fr: 'Mollets debout', it: 'Calf raise in piedi', de: 'Wadenheben im Stehen', ru: 'Подъемы на носки стоя (икры)', ja: 'スタンディングカーフレイズ', muscle: 'piernas', pattern: 'aislamiento', equipment: ['peso_corporal'], tipo: 'peso_corporal' },
    { key: 'machine_calf_raise', es: 'Gemelos en máquina', en: 'Machine calf raise', pt: 'Elevação de panturrilhas na máquina', fr: 'Mollets sur machine', it: 'Calf raise alla macchina', de: 'Wadenheben an der Maschine', ru: 'Подъемы на носки в тренажере', ja: 'マシンカーフレイズ', muscle: 'piernas', pattern: 'aislamiento', equipment: ['maquinas_pierna'], tipo: 'maquina' },

    // Core
    { key: 'plank', es: 'Plancha abdominal', en: 'Plank', pt: 'Prancha abdominal', fr: 'Gainage planche', it: 'Plank addominale', de: 'Plank / Unterarmstütz', ru: 'Планка', ja: 'プランク', muscle: 'core', pattern: 'core', equipment: ['peso_corporal'], tipo: 'peso_corporal' },
    { key: 'cable_crunch', es: 'Crunch abdominal en polea', en: 'Cable crunch', pt: 'Abdominal no cabo', fr: 'Crunch à la poulie', it: 'Crunch ai cavi', de: 'Cable Crunch am Kabelzug', ru: 'Скручивания на блоке (Кранчи)', ja: 'ケーブルクランチ', muscle: 'core', pattern: 'core', equipment: ['poleas'], tipo: 'poleas' },
    { key: 'hanging_leg_raise', es: 'Elevación de piernas colgado', en: 'Hanging leg raises', pt: 'Elevação de pernas na barra', fr: 'Relevé de jambes à la barre', it: 'Alzate gambe alla sbarra', de: 'Beinheben hängend', ru: 'Подъем ног в висе', ja: 'ハンギングレッグレイズ', muscle: 'core', pattern: 'core', equipment: ['barra_dominadas'], tipo: 'peso_corporal' }
  ];

  var CATALOG = {
    all: ALL_EXERCISES,
    maquina: [],
    barra: [],
    mancuernas: [],
    poleas: [],
    peso_corporal: [],
    otro: []
  };

  var EX_NAME_MAP = {};
  var NORM_EX_MAP = {};

  ALL_EXERCISES.forEach(function (item) {
    if (CATALOG[item.tipo]) CATALOG[item.tipo].push(item);
    EX_NAME_MAP[item.key] = item;
    NORM_EX_MAP[item.key.toLowerCase()] = item.key;
    SUPPORTED_LANGS.forEach(function (lang) {
      if (item[lang]) NORM_EX_MAP[item[lang].trim().toLowerCase()] = item.key;
    });
  });

  // Los catálogos nuevos pueden sobrescribir el nombre desde js/i18n/ (liftExerciseNames).
  function getExerciseName(key, lang) {
    var dict = I18N[lang] || I18N.es || {};
    var names = dict.liftExerciseNames || {};
    if (names[key]) return names[key];
    var item = EX_NAME_MAP[key];
    if (item) return item[lang] || item.es;
    return key;
  }

  /* ---------- selector inteligente de ejercicios (pesas) ---------- */
  var LIFT_EQUIP_GROUPS = ['mancuernas', 'barra', 'poleas', 'maquinas_pierna', 'maquinas_pecho_hombro', 'peso_corporal', 'casa'];
  var LIFT_MUSCLE_FILTERS = ['all', 'pecho', 'espalda', 'hombros', 'brazos', 'piernas', 'core'];
  var CUSTOM_EXERCISE_VALUE = '__custom__';

  // Un mismo movimiento puede pertenecer a varios grupos (ej.: las mancuernas
  // también son "equipo en casa"). Así el selector se adapta sin duplicar catálogos.
  function getExerciseLiftGroups(item) {
    var groups = [];
    if (!item) return groups;
    var eq = item.equipment || [];
    if (item.tipo === 'mancuernas') groups.push('mancuernas');
    if (item.tipo === 'barra') groups.push('barra');
    if (item.tipo === 'poleas') groups.push('poleas');
    if (item.tipo === 'maquina') {
      if (eq.indexOf('maquinas_pierna') >= 0) groups.push('maquinas_pierna');
      if (eq.indexOf('maquinas_pecho_hombro') >= 0 || eq.indexOf('maquina_jalon_remo') >= 0) {
        groups.push('maquinas_pecho_hombro');
      }
    }
    if (item.tipo === 'peso_corporal') groups.push('peso_corporal');
    if (item.tipo === 'mancuernas' || item.tipo === 'peso_corporal' || eq.indexOf('banco') >= 0) {
      groups.push('casa');
    }
    return groups;
  }

  function normalizeLiftGroup(tipo) {
    if (LIFT_EQUIP_GROUPS.indexOf(tipo) >= 0) return tipo;
    if (tipo === 'maquina' || tipo === 'maquinas') return 'maquinas_pecho_hombro';
    if (tipo === 'otro' || tipo === 'all') return 'casa';
    return 'mancuernas';
  }

  function getLiftMuscleFilter(item) {
    if (!item) return 'all';
    if (item.muscle === 'biceps' || item.muscle === 'triceps') return 'brazos';
    return LIFT_MUSCLE_FILTERS.indexOf(item.muscle) >= 0 ? item.muscle : 'all';
  }

  function muscleMatchesFilter(item, filter) {
    if (!filter || filter === 'all') return true;
    if (filter === 'brazos') return item.muscle === 'biceps' || item.muscle === 'triceps';
    return item.muscle === filter;
  }

  function getCanonicalExerciseKey(rawName) {
    if (!rawName) return '';
    var lower = String(rawName).trim().toLowerCase();
    return NORM_EX_MAP[lower] || lower;
  }

  var EQUIPMENT_INFO = [
    { id: 'mancuernas', i18nKey: 'equipMancuernas' },
    { id: 'barra', i18nKey: 'equipBarra' },
    { id: 'banco', i18nKey: 'equipBanco' },
    { id: 'poleas', i18nKey: 'equipPoleas' },
    { id: 'maquina_jalon_remo', i18nKey: 'equipJalonRemo' },
    { id: 'maquinas_pierna', i18nKey: 'equipPierna' },
    { id: 'maquinas_pecho_hombro', i18nKey: 'equipPechoHombro' },
    { id: 'barra_dominadas', i18nKey: 'equipDominadas' },
    { id: 'peso_corporal', i18nKey: 'equipPesoCorporal' }
  ];

  var EQUIP_PRESETS = {
    all: ['mancuernas', 'barra', 'banco', 'poleas', 'maquina_jalon_remo', 'maquinas_pierna', 'maquinas_pecho_hombro', 'barra_dominadas', 'peso_corporal'],
    home: ['mancuernas', 'banco', 'barra_dominadas', 'peso_corporal'],
    bodyweight: ['peso_corporal']
  };

  var GOALS = {
    hypertrophy: {
      key: 'hypertrophy',
      rest: 90,
      setsStr: '3-4 × 8-12',
      defaultSets: 3,
      defaultReps: 10
    },
    strength: {
      key: 'strength',
      rest: 150,
      setsStr: '4-5 × 4-6',
      defaultSets: 4,
      defaultReps: 5
    },
    toning: {
      key: 'toning',
      rest: 60,
      setsStr: '3 × 12-15',
      defaultSets: 3,
      defaultReps: 12
    },
    weight_loss: {
      key: 'weight_loss',
      rest: 45,
      setsStr: '3-4 × 15-20',
      defaultSets: 3,
      defaultReps: 15
    }
  };

  var SPLIT_DAYS = {
    current: [5, 0, 2, 4],
    ppl: [0, 1, 2, 4, 5],
    upper_lower: [0, 1, 3, 4],
    full_body: [0, 2, 4]
  };

  var SPLIT_CANDIDATES = {
    current: {
      5: [
        ['bench_press', 'db_bench_press', 'chest_press_mach', 'push_ups'],
        ['chest_press_mach', 'db_flyes', 'pec_deck', 'cable_chest_fly', 'dips'],
        ['db_shoulder_press', 'military_press', 'shoulder_press_mach', 'pike_push_ups'],
        ['db_lateral_raise', 'cable_face_pull'],
        ['triceps_cable', 'db_triceps_ext', 'bench_dips', 'dips']
      ],
      0: [
        ['deadlift', 'romanian_deadlift', 'barbell_squat', 'glute_bridge'],
        ['lat_pulldown', 'pull_ups', 'close_lat_pulldown', 'chin_ups'],
        ['db_row', 'barbell_row', 'row_mach', 'seated_cable_row'],
        ['db_curl', 'barbell_curl', 'biceps_cable', 'db_hammer_curl'],
        ['db_shrugs', 'cable_face_pull', 'db_rear_delt']
      ],
      2: [
        ['db_bench_press', 'bench_press', 'chest_press_mach', 'push_ups'],
        ['shoulder_press_mach', 'military_press', 'db_shoulder_press', 'pike_push_ups'],
        ['db_flyes', 'pec_deck', 'cable_chest_fly', 'dips'],
        ['db_lateral_raise', 'cable_face_pull'],
        ['db_triceps_ext', 'triceps_cable', 'bench_dips', 'dips']
      ],
      4: [
        ['barbell_row', 'db_row', 'row_mach', 'seated_cable_row'],
        ['row_mach', 'seated_cable_row', 'db_row', 'pull_ups'],
        ['close_lat_pulldown', 'lat_pulldown', 'chin_ups', 'pull_ups'],
        ['barbell_curl', 'db_curl', 'biceps_cable', 'db_hammer_curl'],
        ['db_rear_delt', 'cable_face_pull', 'db_shrugs']
      ]
    },
    ppl: {
      0: [
        ['bench_press', 'db_bench_press', 'chest_press_mach', 'push_ups'],
        ['db_incline_press', 'military_press', 'shoulder_press_mach', 'dips'],
        ['db_flyes', 'pec_deck', 'cable_chest_fly'],
        ['db_lateral_raise', 'cable_face_pull'],
        ['triceps_cable', 'db_triceps_ext', 'bench_dips']
      ],
      1: [
        ['lat_pulldown', 'pull_ups', 'close_lat_pulldown', 'chin_ups'],
        ['barbell_row', 'db_row', 'row_mach', 'seated_cable_row'],
        ['db_rear_delt', 'cable_face_pull', 'db_shrugs'],
        ['barbell_curl', 'db_curl', 'biceps_cable'],
        ['db_hammer_curl', 'chin_ups']
      ],
      2: [
        ['barbell_squat', 'leg_press', 'db_goblet_squat', 'bodyweight_squat'],
        ['romanian_deadlift', 'leg_curl', 'deadlift', 'glute_bridge'],
        ['leg_extension', 'db_lunges', 'bodyweight_squat'],
        ['calf_raises'],
        ['plank', 'hanging_leg_raise', 'cable_crunch']
      ],
      4: [
        ['db_shoulder_press', 'military_press', 'shoulder_press_mach', 'pike_push_ups'],
        ['db_bench_press', 'bench_press', 'chest_press_mach', 'push_ups'],
        ['dips', 'db_flyes', 'pec_deck', 'cable_chest_fly'],
        ['db_lateral_raise', 'cable_face_pull'],
        ['db_triceps_ext', 'triceps_cable', 'bench_dips']
      ],
      5: [
        ['deadlift', 'barbell_squat', 'leg_press', 'db_goblet_squat'],
        ['pull_ups', 'lat_pulldown', 'close_lat_pulldown', 'chin_ups'],
        ['db_row', 'barbell_row', 'row_mach', 'seated_cable_row'],
        ['db_curl', 'barbell_curl', 'biceps_cable'],
        ['calf_raises', 'hanging_leg_raise', 'plank']
      ]
    },
    upper_lower: {
      0: [
        ['bench_press', 'db_bench_press', 'chest_press_mach', 'push_ups'],
        ['barbell_row', 'db_row', 'row_mach', 'seated_cable_row'],
        ['db_shoulder_press', 'military_press', 'shoulder_press_mach', 'pike_push_ups'],
        ['lat_pulldown', 'pull_ups', 'close_lat_pulldown'],
        ['triceps_cable', 'db_triceps_ext', 'bench_dips'],
        ['db_curl', 'barbell_curl', 'biceps_cable']
      ],
      1: [
        ['barbell_squat', 'leg_press', 'db_goblet_squat', 'bodyweight_squat'],
        ['romanian_deadlift', 'leg_curl', 'deadlift', 'glute_bridge'],
        ['leg_extension', 'db_lunges'],
        ['calf_raises'],
        ['plank', 'hanging_leg_raise', 'cable_crunch']
      ],
      3: [
        ['db_incline_press', 'bench_press', 'chest_press_mach', 'push_ups'],
        ['pull_ups', 'lat_pulldown', 'close_lat_pulldown', 'chin_ups'],
        ['db_lateral_raise', 'cable_face_pull', 'military_press'],
        ['row_mach', 'seated_cable_row', 'db_row', 'barbell_row'],
        ['barbell_curl', 'db_hammer_curl', 'biceps_cable'],
        ['db_triceps_ext', 'triceps_cable', 'dips']
      ],
      4: [
        ['deadlift', 'romanian_deadlift', 'leg_curl', 'glute_bridge'],
        ['leg_press', 'barbell_squat', 'db_goblet_squat', 'bodyweight_squat'],
        ['db_lunges', 'leg_extension'],
        ['calf_raises'],
        ['hanging_leg_raise', 'plank', 'cable_crunch']
      ]
    },
    full_body: {
      0: [
        ['barbell_squat', 'leg_press', 'db_goblet_squat', 'bodyweight_squat'],
        ['bench_press', 'db_bench_press', 'chest_press_mach', 'push_ups'],
        ['barbell_row', 'db_row', 'row_mach', 'seated_cable_row'],
        ['db_shoulder_press', 'military_press', 'db_lateral_raise', 'pike_push_ups'],
        ['plank', 'hanging_leg_raise']
      ],
      2: [
        ['deadlift', 'romanian_deadlift', 'leg_curl', 'glute_bridge'],
        ['lat_pulldown', 'pull_ups', 'close_lat_pulldown', 'chin_ups'],
        ['db_incline_press', 'shoulder_press_mach', 'dips', 'push_ups'],
        ['db_lunges', 'leg_extension', 'calf_raises'],
        ['db_curl', 'triceps_cable', 'db_triceps_ext']
      ],
      4: [
        ['leg_press', 'barbell_squat', 'db_goblet_squat', 'bodyweight_squat'],
        ['chest_press_mach', 'db_bench_press', 'bench_press', 'push_ups'],
        ['row_mach', 'seated_cable_row', 'db_row', 'barbell_row'],
        ['db_lateral_raise', 'cable_face_pull'],
        ['hanging_leg_raise', 'cable_crunch', 'plank']
      ]
    }
  };

  var ROUTINE_DEF = {
    5: [
      ['bench_press', '4 × 6-10'],
      ['chest_press_mach', '3 × 10-12'],
      ['db_shoulder_press', '3 × 8-12'],
      ['db_lateral_raise', '3 × 12-15'],
      ['triceps_cable', '3 × 10-15']
    ],
    0: [
      ['deadlift', '3 × 5'],
      ['lat_pulldown', '3 × 8-12'],
      ['db_row', '3 × 10', 'perSide'],
      ['db_curl', '3 × 10-12'],
      ['db_shrugs', '3 × 12-15']
    ],
    2: [
      ['db_bench_press', '3 × 8-12'],
      ['shoulder_press_mach', '3 × 10-12'],
      ['db_flyes', '3 × 12-15'],
      ['db_lateral_raise', '3 × 12-15'],
      ['db_triceps_ext', '3 × 10-12']
    ],
    4: [
      ['barbell_row', '4 × 6-10'],
      ['row_mach', '3 × 10-12'],
      ['close_lat_pulldown', '3 × 10-12'],
      ['barbell_curl', '3 × 8-12'],
      ['db_rear_delt', '3 × 12-15']
    ]
  };

  var ORDER = [5, 0, 2, 4]; // sábado, lunes, miércoles, viernes
  var MEAL_KEYS = ['desayuno', 'almuerzo', 'merienda', 'cena', 'otros'];
  var LS_DAYS = (Storage.KEYS && Storage.KEYS.DAYS) || 'cf_days';
  var LS_LIFTS = (Storage.KEYS && Storage.KEYS.LIFTS) || 'cf_lifts';
  var LS_LANG = (Storage.KEYS && Storage.KEYS.LANG) || 'pulsefit_lang';
  var LS_CONFIG = (Storage.KEYS && Storage.KEYS.CONFIG) || 'pulsefit_routine_config';
  var LS_CARDIO_CONFIG = (Storage.KEYS && Storage.KEYS.CARDIO_CONFIG) || 'pulsefit_cardio_config';
  var LS_PLAN = (Storage.KEYS && Storage.KEYS.PLAN) || 'pulsefit_weekly_plan';
  var LS_MEASURES = (Storage.KEYS && Storage.KEYS.MEASURES) || 'pulsefit_body_measures';
  var LS_MEASURE_UNIT = (Storage.KEYS && Storage.KEYS.MEASURE_UNIT) || 'pulsefit_measure_unit';
  var LS_NOTIF_ASKED = 'pulsefit_notif_asked';
  var days = {}, lifts = {}, weeklyPlan = null, measures = {}, measureUnit = 'kg';
  var calMonth = null, selectedCalDate = null, measureMetric = 'weight';

  var CARDIO_EQUIPMENT_INFO = [
    { id: 'outdoor_walk', i18nKey: 'cardioEquipOutdoorWalk' },
    { id: 'treadmill', i18nKey: 'cardioEquipTreadmill' },
    { id: 'stationary_bike', i18nKey: 'cardioEquipStationaryBike' },
    { id: 'outdoor_bike', i18nKey: 'cardioEquipOutdoorBike' },
    { id: 'elliptical', i18nKey: 'cardioEquipElliptical' },
    { id: 'stairmaster', i18nKey: 'cardioEquipStairmaster' },
    { id: 'rowing_machine', i18nKey: 'cardioEquipRowingMachine' },
    { id: 'jump_rope', i18nKey: 'cardioEquipJumpRope' }
  ];

  var CARDIO_PRESETS = {
    all: ['outdoor_walk', 'treadmill', 'stationary_bike', 'outdoor_bike', 'elliptical', 'stairmaster', 'rowing_machine', 'jump_rope'],
    home_outdoor: ['outdoor_walk', 'outdoor_bike', 'jump_rope']
  };

  var CARDIO_GOALS = {
    fat_loss: {
      key: 'fat_loss',
      nameKey: 'cardioGoalFatLoss',
      targetKey: 'cardioTargetFatLoss',
      descKey: 'cardioGoalDescFatLoss',
      defaultMinutes: 45,
      defaultIntensity: 'moderada',
      targetDuration: '35-50 min',
      targetIntensity: 'moderada'
    },
    endurance: {
      key: 'endurance',
      nameKey: 'cardioGoalEndurance',
      targetKey: 'cardioTargetEndurance',
      descKey: 'cardioGoalDescEndurance',
      defaultMinutes: 40,
      defaultIntensity: 'moderada',
      targetDuration: '30-45 min',
      targetIntensity: 'moderada'
    },
    hiit: {
      key: 'hiit',
      nameKey: 'cardioGoalHiit',
      targetKey: 'cardioTargetHiit',
      descKey: 'cardioGoalDescHiit',
      defaultMinutes: 20,
      defaultIntensity: 'alta',
      targetDuration: '15-25 min',
      targetIntensity: 'alta'
    },
    health_steps: {
      key: 'health_steps',
      nameKey: 'cardioGoalHealthSteps',
      targetKey: 'cardioTargetHealthSteps',
      descKey: 'cardioGoalDescHealthSteps',
      defaultMinutes: 30,
      defaultIntensity: 'suave',
      defaultSteps: 8000,
      targetDuration: '20-30 min',
      targetIntensity: 'suave'
    }
  };

  var CARDIO_PROTOCOLS = {
    outdoor_walk: {
      fat_loss: {
        es: 'Caminata a paso vivo (5-6 km/h) en terreno plano o con ligera pendiente natural',
        en: 'Brisk walk (5-6 km/h) on flat terrain or gentle natural slopes',
        pt: 'Caminhada em ritmo acelerado (5-6 km/h) em terreno plano ou aclives leves',
        fr: 'Marche rapide (5-6 km/h) sur terrain plat ou légères montées',
        it: 'Camminata a passo svelto (5-6 km/h) su terreno pianeggiante o leggere salite',
        de: 'Zügiges Gehen (5-6 km/h) auf flachem Gelände oder leichten Steigungen',
        ru: 'Быстрая ходьба (5-6 км/ч) по ровной местности или с легким уклоном',
        ja: '平地または緩やかな傾斜での早歩き (時速5〜6km)'
      },
      endurance: {
        es: 'Marcha rápida y sostenida con variaciones de ritmo y subidas',
        en: 'Sustained brisk power walk with pace variations and uphill segments',
        pt: 'Marcha rápida e contínua com variações de ritmo e subidas',
        fr: 'Marche sportive soutenue avec variations de cadence et dénivelés',
        it: 'Marcia veloce e sostenuta con variazioni di passo e pendenze',
        de: 'Dauerhaftes Power-Walking mit Tempovariationen und Steigungen',
        ru: 'Длительная спортивная ходьба с чередованием темпа и подъемами',
        ja: 'ペースの変化と上り坂を交えた持続的なパワーウォーキング'
      },
      hiit: {
        es: 'Intervalos: 1 min paso rápido/trote ligero / 1 min caminata suave de recuperación',
        en: 'Intervals: 1 min power walk/light jog / 1 min easy recovery walk',
        pt: 'Intervalos: 1 min caminhada rápida/trote / 1 min caminhada leve de recuperação',
        fr: 'Intervalles : 1 min marche rapide/trot / 1 min marche lente de récupération',
        it: 'Intervalli: 1 min passo rapido/corsetta / 1 min camminata lenta di recupero',
        de: 'Intervalle: 1 Min. schnelles Gehen/leichtes Joggen / 1 Min. langsames Gehen zur Erholung',
        ru: 'Интервалы: 1 мин быстрая ходьба/легкий бег / 1 мин медленная восстановительная ходьба',
        ja: 'インターバル: 1分間早歩き・軽いジョグ / 1分間ゆっくり歩行で回復'
      },
      health_steps: {
        es: 'Paseo activo y fluido a ritmo cómodo buscando sumar 8.000 pasos diarios',
        en: 'Comfortable steady walk aiming to reach the 8,000 daily steps goal',
        pt: 'Passeio ativo e agradável com o objetivo de alcançar 8.000 passos diários',
        fr: 'Balade active à allure confortable pour atteindre l\'objectif de 8 000 pas',
        it: 'Passeggiata attiva a passo confortevole per raggiungere gli 8.000 passi',
        de: 'Angenehmer Spaziergang in gleichmäßigem Tempo für das Ziel von 8.000 Schritten',
        ru: 'Спокойная прогулка в комфортном темпе для набора 8 000 шагов в день',
        ja: '1日8,000歩の達成を目指す、心地よいペースでのウォーキング'
      }
    },
    treadmill: {
      fat_loss: {
        es: 'Inclinación 3-5%, velocidad moderada constante (5-6 km/h) en Zona 2',
        en: 'Incline 3-5%, steady moderate speed (5-6 km/h) in Zone 2',
        pt: 'Inclinação de 3-5%, velocidade moderada constante (5-6 km/h) na Zona 2',
        fr: 'Pente 3-5 %, vitesse modérée constante (5-6 km/h) en Zone 2',
        it: 'Inclinazione 3-5%, velocità moderata costante (5-6 km/h) in Zona 2',
        de: 'Steigung 3-5%, konstante moderate Geschwindigkeit (5-6 km/h) in Zone 2',
        ru: 'Уклон 3-5%, постоянная умеренная скорость (5-6 км/ч) в Зоне 2',
        ja: '傾斜3〜5%、ゾーン2を維持する一定の中速度 (時速5〜6km)'
      },
      endurance: {
        es: 'Trote o caminata rápida continua a ritmo sostenido con 1-2% de inclinación',
        en: 'Continuous jog or brisk walk at sustained pace with 1-2% incline',
        pt: 'Trote ou caminhada rápida contínua em ritmo sustentado a 1-2% de inclinação',
        fr: 'Course ou marche rapide continue à allure soutenue avec 1-2 % de pente',
        it: 'Corsa o camminata veloce continua a ritmo sostenuto con 1-2% di inclinazione',
        de: 'Kontinuierliches Joggen oder schnelles Gehen bei 1-2% Steigung',
        ru: 'Непрерывный легкий бег или быстрая ходьба при уклоне 1-2%',
        ja: '傾斜1〜2%での持続的なジョギングまたは速歩'
      },
      hiit: {
        es: 'Intervalos: 30s carrera intensa / 60s caminata suave de recuperación (8-10 rondas)',
        en: 'Intervals: 30s sprint / 60s slow walk recovery (8-10 rounds)',
        pt: 'Intervalos: 30s corrida intensa / 60s caminhada leve (8-10 voltas)',
        fr: 'Intervalles : 30s course rapide / 60s marche lente (8-10 séries)',
        it: 'Intervalli: 30s corsa veloce / 60s camminata lenta (8-10 round)',
        de: 'Intervalle: 30 Sek. Sprint / 60 Sek. langsames Gehen zur Erholung (8-10 Runden)',
        ru: 'Интервалы: 30 сек спринт / 60 сек медленная ходьба для восстановления (8-10 раундов)',
        ja: 'インターバル: 30秒スプリント / 60秒ゆっくり歩行 (8〜10ラウンド)'
      },
      health_steps: {
        es: 'Caminata suave y regular a velocidad cómoda para acumular pasos sin fatiga',
        en: 'Smooth gentle walk at comfortable speed to bank steps without fatigue',
        pt: 'Caminhada suave e regular em ritmo agradável para somar passos sem fadiga',
        fr: 'Marche douce et régulière à allure tranquille pour accumuler les pas',
        it: 'Camminata leggera e regolare a velocità comoda per accumulare passi',
        de: 'Lockerer und gleichmäßiger Spaziergang bei angenehmem Tempo ohne Ermüdung',
        ru: 'Легкая и размеренная ходьба в удобном темпе для набора шагов',
        ja: '疲労を残さずに歩数を稼ぐ、無理のないペースでのスムーズな歩行'
      }
    },
    stationary_bike: {
      fat_loss: {
        es: 'Pedaleo continuo a cadencia media (70-80 RPM) con resistencia moderada',
        en: 'Continuous spin at moderate cadence (70-80 RPM) and medium resistance',
        pt: 'Pedalada contínua em cadência média (70-80 RPM) com carga moderada',
        fr: 'Pédalage continu à cadence moyenne (70-80 tr/min) et résistance modérée',
        it: 'Pedalata continua a cadenza media (70-80 RPM) con resistenza moderata',
        de: 'Gleichmäßiges Treten bei mittlerer Trittfrequenz (70-80 U/min) und moderatem Widerstand',
        ru: 'Равномерное кручение со средней частотой (70-80 об/мин) и умеренным сопротивлением',
        ja: '中程度の負荷で一定のケイデンス (70〜80 RPM) を維持'
      },
      endurance: {
        es: 'Pedaleo sostenido a ritmo firme con resistencia media-alta constante',
        en: 'Sustained firm cycling with steady medium-high resistance',
        pt: 'Pedalada contínua firme com resistência média-alta estável',
        fr: 'Pédalage soutenu et régulier avec résistance moyenne-élevée continue',
        it: 'Pedalata sostenuta a ritmo deciso con resistenza medio-alta costante',
        de: 'Ausdauerndes Treten in zügigem Tempo mit konstant mittlerem bis hohem Widerstand',
        ru: 'Длительное педалирование в хорошем темпе со стабильным средне-высоким сопротивлением',
        ja: '中〜高負荷で力強く一定のペースを維持する持続走'
      },
      hiit: {
        es: 'Sprints: 20s esfuerzo máximo a alta resistencia / 40s pedaleo muy suave (8-12 rondas)',
        en: 'Sprints: 20s all-out high resistance / 40s easy recovery spin (8-12 rounds)',
        pt: 'Tiros: 20s esforço máximo com carga alta / 40s pedalada leve (8-12 voltas)',
        fr: 'Sprints : 20s effort maximal forte résistance / 40s pédalage doux (8-12 séries)',
        it: 'Sprint: 20s sforzo massimale ad alta resistenza / 40s pedalata lenta (8-12 round)',
        de: 'Sprints: 20 Sek. Vollgas bei hohem Widerstand / 40 Sek. ganz leichtes Treten (8-12 Runden)',
        ru: 'Спринты: 20 сек максимум усилий с высоким сопротивлением / 40 сек легкое кручение (8-12 раундов)',
        ja: 'スプリント: 20秒高負荷全力 / 40秒軽い回転で回復 (8〜12ラウンド)'
      },
      health_steps: {
        es: 'Pedaleo suave y fluido para activación cardiovascular de bajo impacto',
        en: 'Gentle smooth pedaling for low-impact cardiovascular activation',
        pt: 'Pedalada leve e suave para ativação cardiovascular de baixo impacto',
        fr: 'Pédalage doux et fluide pour une activation cardiovasculaire sans impact',
        it: 'Pedalata dolce e fluida per attivazione cardiovascolare a baixo impatto',
        de: 'Sanftes und flüssiges Treten zur gelenkschonenden Herz-Kreislauf-Aktivierung',
        ru: 'Мягкое и плавное педалирование для кардио-активации без ударной нагрузки',
        ja: '関節への負担が少ない、スムーズで軽快なペダリング'
      }
    },
    outdoor_bike: {
      fat_loss: {
        es: 'Recorrido en terreno llano manteniendo cadencia constante y respiración cómoda',
        en: 'Ride on flat terrain maintaining steady cadence and comfortable breathing',
        pt: 'Percurso em terreno plano mantendo cadência estável e respiração controlada',
        fr: 'Sortie sur terrain plat à cadence régulière et respiration fluide',
        it: 'Pedalata su percorso pianeggiante a cadenza costante e respiro regolare',
        de: 'Fahrt auf flacher Strecke bei gleichmäßiger Trittfrequenz und ruhiger Atmung',
        ru: 'Поездка по ровной местности с постоянным каденсом и комфортным дыханием',
        ja: '平坦なコースで一定のケイデンスと安定した呼吸をキープ'
      },
      endurance: {
        es: 'Ruta continua a velocidad ágil y sostenida adaptando los cambios de marcha',
        en: 'Continuous distance ride at sustained brisk speed utilizing gear shifts',
        pt: 'Trajeto contínuo em velocidade ágil e firme adaptando as marchas',
        fr: 'Longue sortie à allure vive et soutenue en adaptant les vitesses',
        it: 'Percorso lungo a velocità sostenuta gestendo bene i rapporti',
        de: 'Kontinuierliche Tour in flottem Tempo mit passendem Einsatz der Schaltung',
        ru: 'Длительный заезд в быстром темпе с грамотным переключением передач',
        ja: '適切なギアチェンジを行いながら、軽快かつ持続的なスピードで走行'
      },
      hiit: {
        es: 'Intervalos: 30s aceleración máxima o subida en cuesta / 60s pedaleo relajado',
        en: 'Intervals: 30s max acceleration or uphill sprint / 60s easy coasting',
        pt: 'Intervalos: 30s arrancada máxima ou subida forte / 60s pedalada suave',
        fr: 'Intervalles : 30s accélération maximale ou côte / 60s pedalage souple',
        it: 'Intervalli: 30s allungo massimale o salita / 60s pedalata rilassata',
        de: 'Intervalle: 30 Sek. Maximalsprint oder Berganstieg / 60 Sek. lockeres Ausrollen',
        ru: 'Интервалы: 30 сек ускорение или подъем в горку / 60 сек спокойное кручение',
        ja: 'インターバル: 30秒全力ダッシュまたは坂道登坂 / 60秒流し走行'
      },
      health_steps: {
        es: 'Paseo recreativo en bicicleta al aire libre a ritmo suave y relajado',
        en: 'Leisurely outdoor bike ride at an easy and pleasant pace',
        pt: 'Passeio recreativo de bicicleta ao ar livre em ritmo tranquilo',
        fr: 'Balade récréative à vélo en extérieur à allure douce et agréable',
        it: 'Giro ricreativo in bicicletta all\'aperto a passo tranquillo',
        de: 'Gemütliche Fahrradtour im Freien in entspanntem und ruhigem Tempo',
        ru: 'Приятная велосипедная прогулка на свежем воздухе в легком темпе',
        ja: '屋外での心地よくリラックスしたサイクリング'
      }
    },
    elliptical: {
      fat_loss: {
        es: 'Zancada continua a resistencia moderada y ritmo parejo de bajo impacto',
        en: 'Continuous steady stride at moderate resistance with low joint stress',
        pt: 'Passada contínua com carga moderada e ritmo constante de baixo impacto',
        fr: 'Foulée continue à résistance modérée et cadence régulière sans chocs',
        it: 'Passo continuo a resistenza moderata e ritmo costante a basso impatto',
        de: 'Gleichmäßige Bewegung bei moderatem Widerstand und gelenkschonendem Rhythmus',
        ru: 'Непрерывный шаг с умеренным сопротивлением и низким воздействием на суставы',
        ja: '関節に優しい中程度の負荷で一定のリズムを刻むストライド'
      },
      endurance: {
        es: 'Cadencia sostenida activando tanto el tren inferior como el empuje de brazos',
        en: 'Sustained firm cadence actively pushing and pulling with upper body',
        pt: 'Cadência firme sustentada ativando membros inferiores e empurrando braços',
        fr: 'Cadence soutenue en sollicitant activement le haut et le bas du corps',
        it: 'Cadenza sostenuta coordinando spinta delle gambe e braccia',
        de: 'Dauerhafte Kadenz unter aktivem Armeinsatz für Ober- und Unterkörper',
        ru: 'Уверенный темп с активной работой ног и выталкиванием рукояток руками',
        ja: '脚の踏み込みと腕の押し引きを連動させた持続的なペース'
      },
      hiit: {
        es: 'Intervalos: 30s cadencia máxima con resistencia / 60s pedaleo suave (8-10 rondas)',
        en: 'Intervals: 30s max stride speed with resistance / 60s easy glide (8-10 rounds)',
        pt: 'Intervalos: 30s velocidade máxima com carga / 60s passada lenta (8-10 voltas)',
        fr: 'Intervalles : 30s cadence maximale avec résistance / 60s foulée lente (8-10 séries)',
        it: 'Intervalli: 30s cadenza massima con resistenza / 60s passo lento (8-10 round)',
        de: 'Intervalle: 30 Sek. maximales Tempo mit Widerstand / 60 Sek. lockere Bewegung (8-10 Runden)',
        ru: 'Интервалы: 30 сек максимальная скорость под нагрузкой / 60 сек легкий шаг (8-10 раундов)',
        ja: 'インターバル: 30秒負荷をかけた最大スピード / 60秒ゆったりストライド (8〜10ラウンド)'
      },
      health_steps: {
        es: 'Sesión suave y continua para favorecer la movilidad y quemar calorías sin impacto',
        en: 'Gentle continuous glide promoting mobility and joint-friendly calorie burn',
        pt: 'Sessão leve e contínua promovendo mobilidade e gasto calórico sem impacto',
        fr: 'Séance douce et continue pour stimuler la mobilité sans contrainte articulaire',
        it: 'Sessione dolce e continua per mobilità e consumo energetico a basso impatto',
        de: 'Sanfte und kontinuierliche Einheit zur Förderung der Mobilität ohne Stoßbelastung',
        ru: 'Плавная непрерывная сессия для подвижности и сжигания калорий без ударов',
        ja: '衝撃なく可動域を広げ消費カロリーを高めるスムーズなセッション'
      }
    },
    stairmaster: {
      fat_loss: {
        es: 'Subida a ritmo constante y parejo manteniendo la espalda erguida (sin apoyarse)',
        en: 'Steady climbing pace maintaining upright posture without leaning on rails',
        pt: 'Subida em ritmo constante mantendo postura ereta (sem apoiar peso nos braços)',
        fr: 'Montée régulière et constante en gardant le dos bien droit sans appui excessif',
        it: 'Salita a ritmo costante con schiena dritta senza appoggiarsi ai mancorrenti',
        de: 'Gleichmäßiges Steigen bei aufrechter Haltung (ohne Abstützen auf den Griffen)',
        ru: 'Подъем в постоянном темпе с прямой спиной (не опираясь руками на поручни)',
        ja: '手すりに寄りかからず背筋を伸ばした状態での一定ペースの昇降'
      },
      endurance: {
        es: 'Subida continua a ritmo medio sostenido exigiendo piernas y sistema aeróbico',
        en: 'Continuous climbing at challenging medium pace pushing legs and lungs',
        pt: 'Subida contínua em ritmo médio sustentado exigindo pernas e fôlego',
        fr: 'Montée continue à rythme moyen soutenu sollicitant cuisses et souffle',
        it: 'Salita continua a velocità media sostenuta impegnativa per gambe e fiato',
        de: 'Kontinuierliches Steigen in forderndem mittlerem Tempo für Beine und Ausdauer',
        ru: 'Непрерывный подъем в хорошем среднем темпе для нагрузки на ноги и легкие',
        ja: '脚力と心肺機能をしっかり刺激する持続的な中〜高速昇降'
      },
      hiit: {
        es: 'Intervalos: 30s velocidad rápida (o de 2 en 2 escalones) / 60s subida lenta de recuperación',
        en: 'Intervals: 30s fast steps (or double steps) / 60s slow stepping recovery',
        pt: 'Intervalos: 30s subida rápida (ou de 2 em 2 degraus) / 60s passo lento',
        fr: 'Intervalles : 30s montée rapide (ou 2 par 2) / 60s pas lents de récupération',
        it: 'Intervalli: 30s salita rapida (o a 2 a 2 gradini) / 60s passo lento di recupero',
        de: 'Intervalle: 30 Sek. schnelles Steigen (oder 2 Stufen auf einmal) / 60 Sek. langsames Steigen',
        ru: 'Интервалы: 30 сек быстрое шагание (или через ступеньку) / 60 сек медленный шаг',
        ja: 'インターバル: 30秒素早い昇降（または2段飛ばし）/ 60秒ゆっくり昇降で回復'
      },
      health_steps: {
        es: 'Subida suave y controlada para sumar escalones y fortalecer glúteos y piernas',
        en: 'Gentle controlled stepping to build vertical steps and strengthen legs',
        pt: 'Subida suave e controlada somando degraus e ativando pernas e glúteos',
        fr: 'Montée douce et contrôlée pour accumuler les marches et tonifier les jambes',
        it: 'Salita leggera e controllata per sommare gradini e tonificare le gambe',
        de: 'Ruhiges und kontrolliertes Treppensteigen zur Stärkung von Beinen und Gesäß',
        ru: 'Спокойный контролируемый подъем для набора ступеней и тонуса ног',
        ja: '段数を積み重ね、臀部と脚を引き締めるコントロールされた軽やかな昇降'
      }
    },
    rowing_machine: {
      fat_loss: {
        es: 'Paladas largas y rítmicas (20-22 SPM) con empuje potente de piernas y ritmo constante',
        en: 'Long rhythmic strokes (20-22 SPM) with strong leg drive at steady pace',
        pt: 'Remadas longas e ritmadas (20-22 SPM) com empurrão firme de pernas e ritmo constante',
        fr: 'Coups amples et rythmés (20-22 SPM) avec poussée puissante des jambes',
        it: 'Palate lunghe e ritmiche (20-22 SPM) con spinta decisa delle gambe e ritmo costante',
        de: 'Lange rhythmische Züge (20-22 SPM) mit kraftvollem Beinstoß bei konstantem Tempo',
        ru: 'Длинные ритмичные гребки (20-22 гр/мин) с мощным толчком ног и стабильным темпом',
        ja: '強い脚の蹴り出しと一定のペースによる長いリズミカルなストローク (20〜22 SPM)'
      },
      endurance: {
        es: 'Ritmo sostenido y continuo (24-26 SPM) con respiración controlada y cadencia firme',
        en: 'Sustained continuous stroke (24-26 SPM) with controlled breathing and firm cadence',
        pt: 'Remada contínua sustentada (24-26 SPM) com respiração firme e cadência constante',
        fr: 'Cadence soutenue et continue (24-26 SPM) avec souffle maîtrisé et allure ferme',
        it: 'Vogata continua e sostenuta (24-26 SPM) a respirazione controllata e cadenza salda',
        de: 'Dauerhafter und gleichmäßiger Rhythmus (24-26 SPM) mit kontrollierter Atmung',
        ru: 'Стабильный непрерывный ритм (24-26 гр/мин) с контролируемым дыханием',
        ja: '呼吸をコントロールしながら力強いリズムを刻む持続ストローク (24〜26 SPM)'
      },
      hiit: {
        es: 'Intervalos: 250m a máxima potencia / 45s remo suave de recuperación (6-8 rondas)',
        en: 'Intervals: 250m all-out sprint / 45s paddle recovery (6-8 rounds)',
        pt: 'Intervalos: 250m potência máxima / 45s remada leve de recuperação (6-8 voltas)',
        fr: 'Intervalles : 250m sprint maximal / 45s rame douce de récupération (6-8 séries)',
        it: 'Intervalli: 250m sprint a tutta / 45s vogata leggera di recupero (6-8 round)',
        de: 'Intervalle: 250m All-Out-Sprint / 45 Sek. ganz leichtes Paddeln (6-8 Runden)',
        ru: 'Интервалы: 250м спринт на максимальной мощности / 45 сек легкая гребля (6-8 раундов)',
        ja: 'インターバル: 250m全力スプリント / 45秒流し漕ぎ (6〜8ラウンド)'
      },
      health_steps: {
        es: 'Remo suave y relajado trabajando postura, espalda y piernas sin sobrecarga',
        en: 'Gentle relaxed rowing focusing on posture, back, and leg activation',
        pt: 'Remada suave e relaxada ativando postura, costas e pernas sem sobrecarga',
        fr: 'Rame douce et détendue favorisant la posture et le gainage en douceur',
        it: 'Vogata leggera e rilassata per curare postura, dorso e gambe senza sforzo',
        de: 'Sanftes und entspanntes Rudern für Haltung, Rücken und Beine ohne Überlastung',
        ru: 'Легкая расслабленная гребля для осанки, спины и ног без перегрузок',
        ja: '過度な負荷をかけずに姿勢、背中、脚を意識したリラックスしたローイング'
      }
    },
    jump_rope: {
      fat_loss: {
        es: 'Saltos continuos a ritmo moderado con descansos de 30s cada 2-3 minutos de salto',
        en: 'Continuous steady jumping with 30s rest every 2-3 minutes of skipping',
        pt: 'Saltos contínuos em ritmo moderado com pausas de 30s a cada 2-3 minutos',
        fr: 'Sauts réguliers à cadence modérée avec pauses de 30s toutes les 2-3 minutes',
        it: 'Saltelli continui a ritmo moderato con pause di 30s ogni 2-3 minuti',
        de: 'Kontinuierliches Springen bei moderatem Tempo mit 30 Sek. Pause alle 2-3 Minuten',
        ru: 'Прыжки в умеренном темпе с 30-секундным отдыхом каждые 2-3 минуты',
        ja: '2〜3分跳ぶごとに30秒の休憩を挟む、中強度の連続ジャンプ'
      },
      endurance: {
        es: 'Rondas continuas de 3 min saltando sin parar / 1 min descanso activo caminando',
        en: 'Rounds of 3 min continuous skipping / 1 min active walking rest',
        pt: 'Rounds de 3 min pulando continuamente / 1 min descanso ativo caminhando',
        fr: 'Rounds de 3 min de saut continu / 1 min repos actif en marchant',
        it: 'Round di 3 min di salto continuo / 1 min riposo attivo camminando',
        de: 'Runden von 3 Min. ununterbrochenem Springen / 1 Min. aktive Gehpause',
        ru: 'Раунды по 3 мин непрерывных прыжков / 1 мин активного отдыха шагом',
        ja: '3分間連続ジャンプ / 1分間ウォーキングのアクティブレストを繰り返す'
      },
      hiit: {
        es: 'Tabata o intervalos: 20s máxima velocidad o dobles / 10s descanso total (8 rondas)',
        en: 'Tabata / intervals: 20s max speed or double-unders / 10s rest (8 rounds)',
        pt: 'Tabata ou tiros: 20s velocidade máxima ou saltos duplos / 10s descanso (8 voltas)',
        fr: 'Tabata / fractionné : 20s vitesse maximale ou double-unders / 10s repos (8 séries)',
        it: 'Tabata o intervalli: 20s velocità massima o doppi salti / 10s riposo (8 round)',
        de: 'Tabata / Intervalle: 20 Sek. Höchstgeschwindigkeit oder Double-Unders / 10 Sek. Pause (8 Runden)',
        ru: 'Табата / интервалы: 20 сек максимум скорости или двойные прыжки / 10 сек отдых (8 раундов)',
        ja: 'タバタ / インターバル: 20秒最高速または二重跳び / 10秒完全休息 (8ラウンド)'
      },
      health_steps: {
        es: 'Series cortas de 50-100 saltos suaves alternadas con caminata en el lugar',
        en: 'Short sets of 50-100 gentle skips alternated with marching in place',
        pt: 'Séries curtas de 50-100 saltos leves alternadas com caminhada no lugar',
        fr: 'Petites séries de 50-100 sauts doux alternées avec marche sur place',
        it: 'Serie brevi di 50-100 saltelli leggeri alternate a marcia sul posto',
        de: 'Kurze Serien von 50-100 leichten Sprüngen abgewechselt mit Gehen am Platz',
        ru: 'Короткие серии по 50-100 легких прыжков с чередованием шагов на месте',
        ja: '足踏みと交互に行う50〜100回の軽やかなショートジャンプ'
      }
    }
  };

  /* ---------- constructor dinámico de detalles de cardio ---------- */
  var CARDIO_DETAIL_GROUP_BY_ACTIVITY = {
    treadmill: 'treadmill',
    stationary_bike: 'bike',
    elliptical: 'level',
    stairmaster: 'level',
    rowing_machine: 'rower',
    outdoor_walk: 'terrain',
    outdoor_bike: 'terrain',
    jump_rope: 'terrain',
    otro: 'terrain'
  };

  function speedOptions() {
    var out = [];
    for (var v = 3; v <= 16; v++) out.push([String(v), v + ' km/h']);
    return out;
  }

  var SPEED_OPTIONS = speedOptions();

  // Cada grupo define los controles táctiles que se muestran al elegir una máquina.
  // `default` es el valor inicial; `requires` oculta el control si no aplica.
  var CARDIO_DETAIL_FIELDS = {
    treadmill: [
      { id: 'cdIncline', options: [['flat', 'cdInclineFlat'], ['low', 'cdInclineLow'], ['mid', 'cdInclineMid'], ['high', 'cdInclineHigh']], 'default': 'low' },
      { id: 'cdMode', options: [['continuous', 'cdModeContinuous'], ['intervals', 'cdModeIntervals']], 'default': 'continuous' },
      { id: 'cdSpeedBase', options: SPEED_OPTIONS, 'default': '5' },
      { id: 'cdSpeedPeak', options: SPEED_OPTIONS, 'default': '10', requires: 'cdMode:intervals' }
    ],
    bike: [
      { id: 'cdResistance', options: [['light', 'cdResLight'], ['moderate', 'cdResModerate'], ['heavy', 'cdResHeavy'], ['climb', 'cdResClimb']], 'default': 'moderate' },
      { id: 'cdBikeMode', options: [['constant', 'cdBikeModeConstant'], ['intervals', 'cdBikeModeIntervals']], 'default': 'constant' }
    ],
    level: [
      { id: 'cdLevel', options: [['soft', 'cdLevelSoft'], ['moderate', 'cdLevelModerate'], ['intense', 'cdLevelIntense'], ['max', 'cdLevelMax']], 'default': 'moderate' },
      { id: 'cdRhythm', options: [['constant', 'cdRhythmConstant'], ['intervals', 'cdRhythmIntervals']], 'default': 'constant' }
    ],
    rower: [
      { id: 'cdDamper', options: [['low', 'cdDamper1'], ['mid', 'cdDamper2'], ['high', 'cdDamper3']], 'default': 'mid' },
      { id: 'cdRowerFocus', options: [['continuous', 'cdRowerContinuous'], ['intervals', 'cdRowerIntervals']], 'default': 'continuous' }
    ],
    terrain: [
      { id: 'cdTerrain', options: [['flat', 'cdTerrainFlat'], ['hill', 'cdTerrainHill'], ['fast', 'cdTerrainFast'], ['easy', 'cdTerrainEasy']], 'default': 'flat' }
    ]
  };

  // Guarda la última elección de cada control aunque se cambie de máquina.
  var detailState = {};

  var cardioConfig = {
    goal: 'fat_loss',
    equipment: CARDIO_PRESETS.all.slice()
  };

  function loadCardioConfig() {
    if (Storage.loadCardioConfig) {
      Storage.loadCardioConfig(cardioConfig, CARDIO_GOALS);
      return;
    }
    try {
      var g = JSON.parse(localStorage.getItem(LS_CARDIO_CONFIG));
      if (g && typeof g === 'object') {
        if (g.goal && CARDIO_GOALS[g.goal]) cardioConfig.goal = g.goal;
        if (Array.isArray(g.equipment) && g.equipment.length) cardioConfig.equipment = g.equipment;
        ['plan', 'mode', 'enabled'].forEach(function (k) { delete cardioConfig[k]; });
        delete cardioConfig.days;
        if (typeof g.plan === 'string') cardioConfig.plan = g.plan;
        if (typeof g.mode === 'string') cardioConfig.mode = g.mode;
        if (typeof g.enabled === 'boolean') cardioConfig.enabled = g.enabled;
        if (g.days != null) cardioConfig.days = g.days;
      }
    } catch (e) {}
  }

  function saveCardioConfig() {
    if (Storage.saveCardioConfig) {
      Storage.saveCardioConfig(cardioConfig);
      return;
    }
    try {
      localStorage.setItem(LS_CARDIO_CONFIG, JSON.stringify(cardioConfig));
    } catch (e) {}
  }

  function getCardioEquipmentName(id, lang) {
    if (id === 'otro') return t('optOtherCardio');
    var item = CARDIO_EQUIPMENT_INFO.find(function (it) { return it.id === id; });
    if (item) return t(item.i18nKey);
    return id;
  }

  function getCardioGoalName(goalKey) {
    var dict = (I18N[curLang] || I18N.es).cardioGoalNames || {};
    return dict[goalKey] || (I18N.es.cardioGoalNames || {})[goalKey] || goalKey;
  }

  function getIntensityLabel(val) {
    if (val === 'suave') return t('intensityLow');
    if (val === 'alta') return t('intensityHigh');
    return t('intensityMedium');
  }

  function getCardioProtocolText(equipId, goalKey, lang) {
    var equipProto = CARDIO_PROTOCOLS[equipId];
    if (!equipProto) return '';
    var goalProto = equipProto[goalKey] || equipProto.fat_loss;
    if (!goalProto) return '';
    return goalProto[lang] || goalProto.es || '';
  }

  function getDetailGroup(actId) {
    return CARDIO_DETAIL_GROUP_BY_ACTIVITY[actId] || 'terrain';
  }

  function findDetailField(id) {
    for (var group in CARDIO_DETAIL_FIELDS) {
      if (!CARDIO_DETAIL_FIELDS.hasOwnProperty(group)) continue;
      var fields = CARDIO_DETAIL_FIELDS[group];
      for (var i = 0; i < fields.length; i++) {
        if (fields[i].id === id) return fields[i];
      }
    }
    return null;
  }

  function getDetailValue(id) {
    var el = $(id);
    if (el && el.value) return el.value;
    if (detailState[id]) return detailState[id];
    var field = findDetailField(id);
    return field ? field['default'] : '';
  }

  function detailOptionLabel(fieldId, value) {
    var field = findDetailField(fieldId);
    if (!field) return '';
    for (var i = 0; i < field.options.length; i++) {
      if (field.options[i][0] === value) return field.options[i][1];
    }
    return '';
  }

  function isDetailFieldVisible(field, values) {
    if (!field.requires) return true;
    var p = field.requires.split(':');
    return values[p[0]] === p[1];
  }

  function renderCardioDetailBuilder() {
    var box = $('cardioDetailBuilder');
    if (!box) return;
    var actId = $('cardioActivity') ? $('cardioActivity').value : '';
    var group = getDetailGroup(actId);
    var fields = CARDIO_DETAIL_FIELDS[group] || [];
    var values = {};
    fields.forEach(function (f) { values[f.id] = getDetailValue(f.id); });

    var controls = fields.map(function (f) {
      var opts = f.options.map(function (o) {
        var isSel = (o[0] === values[f.id]) ? ' selected' : '';
        var i18n = o[1].indexOf('cd') === 0 ? ' data-i18n="' + esc(o[1]) + '"' : '';
        return '<option value="' + esc(o[0]) + '"' + i18n + isSel + '>' + esc(t(o[1])) + '</option>';
      }).join('');
      var visible = isDetailFieldVisible(f, values);
      return '<label class="detail-field" id="' + esc(f.id) + 'Field"' + (visible ? '' : ' hidden') + '>' +
        '<span data-i18n="' + esc(f.id) + '">' + esc(t(f.id)) + '</span>' +
        '<select id="' + esc(f.id) + '">' + opts + '</select></label>';
    }).join('');

    box.innerHTML = '<div class="builder-title" data-i18n="cdBuilderTitle">' + esc(t('cdBuilderTitle')) + '</div>' +
      '<div class="builder-grid">' + controls + '</div>';
    updateCardioDetailPreview();
  }

  function collectDetailValues() {
    var vals = {};
    var group = getDetailGroup($('cardioActivity') ? $('cardioActivity').value : '');
    (CARDIO_DETAIL_FIELDS[group] || []).forEach(function (f) {
      vals[f.id] = getDetailValue(f.id);
      detailState[f.id] = vals[f.id];
    });
    return vals;
  }

  function composeCardioDetail(actId, values, lang) {
    var group = getDetailGroup(actId);
    var name = getCardioEquipmentName(actId, lang);
    var parts = [];
    var v = values || {};

    if (group === 'treadmill') {
      parts.push(t('cdIncline') + ' ' + t(detailOptionLabel('cdIncline', v.cdIncline)));
      if (v.cdMode === 'intervals') {
        parts.push(t('cdModeIntervals') + ' ' + v.cdSpeedBase + ' km/h → ' + v.cdSpeedPeak + ' km/h');
      } else {
        parts.push(t('cdModeContinuous') + ' ' + v.cdSpeedBase + ' km/h');
      }
    } else if (group === 'bike') {
      parts.push(t('cdResistance') + ' ' + t(detailOptionLabel('cdResistance', v.cdResistance)));
      parts.push(t(detailOptionLabel('cdBikeMode', v.cdBikeMode)));
    } else if (group === 'level') {
      parts.push(t('cdLevel') + ' ' + t(detailOptionLabel('cdLevel', v.cdLevel)));
      parts.push(t(detailOptionLabel('cdRhythm', v.cdRhythm)));
    } else if (group === 'rower') {
      parts.push(t('cdDamper') + ' ' + t(detailOptionLabel('cdDamper', v.cdDamper)));
      parts.push(t(detailOptionLabel('cdRowerFocus', v.cdRowerFocus)));
    } else {
      parts.push(t('cdTerrain') + ' ' + t(detailOptionLabel('cdTerrain', v.cdTerrain)));
    }

    return name + ': ' + parts.filter(Boolean).join(' · ');
  }

  function updateCardioDetailPreview() {
    var preview = $('cardioDetailPreview');
    if (!preview) return;
    var actSel = $('cardioActivity');
    if (!actSel || !actSel.value) { preview.hidden = true; return; }
    preview.textContent = composeCardioDetail(actSel.value, collectDetailValues(), curLang);
    preview.hidden = false;
  }

  function applyCardioDetailState(state) {
    detailState = {};
    if (state && state.values && typeof state.values === 'object') {
      Object.keys(state.values).forEach(function (k) { detailState[k] = state.values[k]; });
    }
    renderCardioDetailBuilder();
  }

  var routineConfig = {
    goal: 'hypertrophy',
    split: 'current',
    equipment: EQUIP_PRESETS.all.slice()
  };

  function loadConfig() {
    if (Storage.loadConfig) {
      Storage.loadConfig(routineConfig, GOALS, SPLIT_DAYS);
      return;
    }
    try {
      var g = JSON.parse(localStorage.getItem(LS_CONFIG));
      if (g && typeof g === 'object') {
        if (g.goal && GOALS[g.goal]) routineConfig.goal = g.goal;
        if (g.split && SPLIT_DAYS[g.split]) routineConfig.split = g.split;
        if (Array.isArray(g.equipment) && g.equipment.length) routineConfig.equipment = g.equipment;
      }
    } catch (e) {}
  }

  function saveConfig() {
    if (Storage.saveConfig) {
      Storage.saveConfig(routineConfig);
      return;
    }
    try {
      localStorage.setItem(LS_CONFIG, JSON.stringify(routineConfig));
    } catch (e) {}
  }

  function isExerciseAvailable(key, activeEquip) {
    var item = EX_NAME_MAP[key];
    if (!item) return true;
    if (!item.equipment || !item.equipment.length) return true;
    for (var i = 0; i < item.equipment.length; i++) {
      if (activeEquip.indexOf(item.equipment[i]) < 0) return false;
    }
    return true;
  }

  function getDayExercises(splitKey, dayKey, activeEquip, goalKey) {
    var candidates = (SPLIT_CANDIDATES[splitKey] && SPLIT_CANDIDATES[splitKey][dayKey]) || [];
    var goalDef = GOALS[goalKey] || GOALS.hypertrophy;
    var result = [];
    var chosen = {};

    candidates.forEach(function (slot) {
      var picked = null;
      for (var i = 0; i < slot.length; i++) {
        var k = slot[i];
        if (!chosen[k] && isExerciseAvailable(k, activeEquip)) {
          picked = k;
          break;
        }
      }
      if (picked) {
        chosen[picked] = true;
        var exObj = EX_NAME_MAP[picked];
        var setsReps = goalDef.setsStr;
        if (picked === 'plank') setsReps = '3 × 30-60s';
        result.push({
          key: picked,
          setsReps: setsReps,
          perSide: exObj ? !!exObj.perSide : false
        });
      }
    });

    return result;
  }

  function getSplitSessionInfo(splitKey, dayKey) {
    var dict = (I18N[curLang] || I18N.es).splitSessions || {};
    var splitDict = dict[splitKey] || ((I18N.es.splitSessions || {})[splitKey] || {});
    var sess = splitDict[dayKey];
    if (sess) return sess;
    var fallbackRoutines = (I18N[curLang] || I18N.es).routines || {};
    return fallbackRoutines[dayKey] || { name: '', sub: '' };
  }

  function getSplitName(splitKey) {
    var names = (I18N[curLang] || I18N.es).splitNames || {};
    return names[splitKey] || splitKey;
  }

  function getGoalName(goalKey) {
    var names = (I18N[curLang] || I18N.es).goalNames || {};
    return names[goalKey] || goalKey;
  }

  function getEquipmentName(id) {
    var item = EQUIPMENT_INFO.find(function (it) { return it.id === id; });
    return item ? t(item.i18nKey) : id;
  }

  function getMuscleName(m) {
    var muscles = (I18N[curLang] || I18N.es).muscles || {};
    return muscles[m] || (I18N.es.muscles || {})[m] || m;
  }

  function $(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function today() { var d = new Date(); d.setHours(12, 0, 0, 0); return d; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function dow(d) { return (d.getDay() + 6) % 7; } // lunes = 0
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function tile(v, label) { return '<div class="stat"><b>' + v + '</b><span>' + label + '</span></div>'; }
  function say(id, t, err) { var m = $(id); if (m) { m.textContent = t || ''; m.className = 'msg' + (err ? ' err' : ''); } }
  function did(s) { return !!(days[s] && days[s].exercised); }

  /* ---------- fecha de entrenamiento (hoy / días pasados) ---------- */
  function todayIso() { return Storage.todayIso ? Storage.todayIso() : iso(today()); }

  function currentDate() {
    var el = $('workoutDate');
    var value = (el && el.value) ? el.value : todayIso();
    return Storage.normalizeDate ? Storage.normalizeDate(value) : (value || todayIso());
  }

  function isPastDate(s) { return !!s && s < todayIso(); }

  function syncDateMirrors(date) {
    ['date', 'gdate'].forEach(function (id) { var m = $(id); if (m) m.value = date; });
  }

  /* ---------- acciones compartidas por los tres historiales ---------- */
  var ICON_EDIT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  var ICON_DELETE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

  // editing = { type: 'day' | 'lift', key: clave en days/lifts, date: ISO }
  var editing = null;
  var armedDelete = null, armTimer = null;

  function actionButtons(kind, id, name) {
    var label = name == null ? '' : String(name);
    var editLabel = esc(t('btnEdit') + (label ? ' ' + label : ''));
    var delLabel = esc(t('btnDelete') + (label ? ' ' + label : ''));
    return '<div class="row-actions">' +
      '<button type="button" class="icon-btn" data-edit-' + kind + '="' + esc(id) + '" aria-label="' + editLabel + '" title="' + esc(t('btnEdit')) + '">' + ICON_EDIT + '</button>' +
      '<button type="button" class="icon-btn danger" data-del-' + kind + '="' + esc(id) + '" aria-label="' + delLabel + '" title="' + esc(t('btnDelete')) + '">' + ICON_DELETE + '</button>' +
      '</div>';
  }

  /* ---------- resúmenes compactos y tarjetas compartidas por los historiales ---------- */
  var COMPACT_LABELS = {
    es: {
      names: { treadmill: 'Cinta', stationary_bike: 'Bici fija', outdoor_bike: 'Bici', outdoor_walk: 'Caminata', elliptical: 'Elíptica', stairmaster: 'Escalera', rowing_machine: 'Remo', jump_rope: 'Soga', otro: 'Cardio' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: 'incl.',
      modes: { intervals: 'Intervalos', continuous: 'Continuo' },
      resistance: { light: 'Res. baja', moderate: 'Res. media', heavy: 'Res. alta', climb: 'Res. subida' },
      level: { soft: 'Suave', moderate: 'Medio', intense: 'Alto', max: 'Máx.' },
      rhythm: { constant: 'Constante', intervals: 'Intervalos' },
      damper: { low: 'Nv.1-3', mid: 'Nv.4-6', high: 'Nv.7-10' },
      rower: { continuous: 'Continuo', intervals: 'Series' },
      terrain: { flat: 'Plano', hill: 'Pendiente', fast: 'Rápido', easy: 'Suave' },
      kmh: 'km/h', showMore: 'Ver más', showLess: 'Ver menos'
    },
    en: {
      names: { treadmill: 'Treadmill', stationary_bike: 'Bike', outdoor_bike: 'Bike', outdoor_walk: 'Walk', elliptical: 'Elliptical', stairmaster: 'Stairs', rowing_machine: 'Rower', jump_rope: 'Rope', otro: 'Cardio' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: 'incline',
      modes: { intervals: 'Intervals', continuous: 'Continuous' },
      resistance: { light: 'Low res.', moderate: 'Med res.', heavy: 'High res.', climb: 'Climb' },
      level: { soft: 'Low', moderate: 'Medium', intense: 'High', max: 'Max' },
      rhythm: { constant: 'Steady', intervals: 'Intervals' },
      damper: { low: 'Lv.1-3', mid: 'Lv.4-6', high: 'Lv.7-10' },
      rower: { continuous: 'Steady', intervals: 'Intervals' },
      terrain: { flat: 'Flat', hill: 'Hill', fast: 'Fast', easy: 'Easy' },
      kmh: 'km/h', showMore: 'More', showLess: 'Less'
    },
    pt: {
      names: { treadmill: 'Esteira', stationary_bike: 'Bici fixa', outdoor_bike: 'Bici', outdoor_walk: 'Caminhada', elliptical: 'Elíptico', stairmaster: 'Escada', rowing_machine: 'Remo', jump_rope: 'Corda', otro: 'Cardio' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: 'incl.',
      modes: { intervals: 'Intervalos', continuous: 'Contínuo' },
      resistance: { light: 'Res. baixa', moderate: 'Res. média', heavy: 'Res. alta', climb: 'Res. subida' },
      level: { soft: 'Suave', moderate: 'Médio', intense: 'Alto', max: 'Máx.' },
      rhythm: { constant: 'Constante', intervals: 'Intervalos' },
      damper: { low: 'Nv.1-3', mid: 'Nv.4-6', high: 'Nv.7-10' },
      rower: { continuous: 'Contínuo', intervals: 'Séries' },
      terrain: { flat: 'Plano', hill: 'Subida', fast: 'Rápido', easy: 'Suave' },
      kmh: 'km/h', showMore: 'Ver mais', showLess: 'Ver menos'
    },
    fr: {
      names: { treadmill: 'Tapis', stationary_bike: 'Vélo fixe', outdoor_bike: 'Vélo', outdoor_walk: 'Marche', elliptical: 'Elliptique', stairmaster: 'Escalier', rowing_machine: 'Rameur', jump_rope: 'Corde', otro: 'Cardio' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: 'incl.',
      modes: { intervals: 'Intervalles', continuous: 'Continu' },
      resistance: { light: 'Rés. faible', moderate: 'Rés. moyenne', heavy: 'Rés. forte', climb: 'Rés. montée' },
      level: { soft: 'Doux', moderate: 'Moyen', intense: 'Élevé', max: 'Max.' },
      rhythm: { constant: 'Constant', intervals: 'Intervalles' },
      damper: { low: 'Niv.1-3', mid: 'Niv.4-6', high: 'Niv.7-10' },
      rower: { continuous: 'Continu', intervals: 'Séries' },
      terrain: { flat: 'Plat', hill: 'Pente', fast: 'Rapide', easy: 'Doux' },
      kmh: 'km/h', showMore: 'Voir plus', showLess: 'Voir moins'
    },
    it: {
      names: { treadmill: 'Tapis', stationary_bike: 'Bici fissa', outdoor_bike: 'Bici', outdoor_walk: 'Camminata', elliptical: 'Ellittica', stairmaster: 'Scale', rowing_machine: 'Remo', jump_rope: 'Corda', otro: 'Cardio' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: 'incl.',
      modes: { intervals: 'Intervalli', continuous: 'Continuo' },
      resistance: { light: 'Res. bassa', moderate: 'Res. media', heavy: 'Res. alta', climb: 'Res. salita' },
      level: { soft: 'Dolce', moderate: 'Medio', intense: 'Alto', max: 'Max' },
      rhythm: { constant: 'Costante', intervals: 'Intervalli' },
      damper: { low: 'Liv.1-3', mid: 'Liv.4-6', high: 'Liv.7-10' },
      rower: { continuous: 'Continuo', intervals: 'Serie' },
      terrain: { flat: 'Piano', hill: 'Dislivello', fast: 'Veloce', easy: 'Dolce' },
      kmh: 'km/h', showMore: 'Mostra altro', showLess: 'Mostra meno'
    },
    de: {
      names: { treadmill: 'Laufband', stationary_bike: 'Rad', outdoor_bike: 'Rad', outdoor_walk: 'Gehen', elliptical: 'Ellipse', stairmaster: 'Stufen', rowing_machine: 'Rudern', jump_rope: 'Seil', otro: 'Cardio' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: 'Steig.',
      modes: { intervals: 'Intervalle', continuous: 'Dauerhaft' },
      resistance: { light: 'Leicht', moderate: 'Mittel', heavy: 'Schwer', climb: 'Steigung' },
      level: { soft: 'Leicht', moderate: 'Mittel', intense: 'Hoch', max: 'Max' },
      rhythm: { constant: 'Konstant', intervals: 'Intervalle' },
      damper: { low: 'Stufe 1-3', mid: 'Stufe 4-6', high: 'Stufe 7-10' },
      rower: { continuous: 'Dauerhaft', intervals: 'Intervalle' },
      terrain: { flat: 'Flach', hill: 'Steigung', fast: 'Schnell', easy: 'Leicht' },
      kmh: 'km/h', showMore: 'Mehr', showLess: 'Weniger'
    },
    ru: {
      names: { treadmill: 'Беговая', stationary_bike: 'Велосипед', outdoor_bike: 'Велосипед', outdoor_walk: 'Прогулка', elliptical: 'Эллипсоид', stairmaster: 'Ступени', rowing_machine: 'Гребля', jump_rope: 'Скакалка', otro: 'Кардио' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: 'укл.',
      modes: { intervals: 'Интервалы', continuous: 'Непрерывно' },
      resistance: { light: 'Низкое', moderate: 'Среднее', heavy: 'Высокое', climb: 'Подъём' },
      level: { soft: 'Мягкий', moderate: 'Средний', intense: 'Высокий', max: 'Макс.' },
      rhythm: { constant: 'Постоянный', intervals: 'Интервалы' },
      damper: { low: 'Ур.1-3', mid: 'Ур.4-6', high: 'Ур.7-10' },
      rower: { continuous: 'Непрерывно', intervals: 'Отрезки' },
      terrain: { flat: 'Ровно', hill: 'Подъём', fast: 'Быстро', easy: 'Легко' },
      kmh: 'км/ч', showMore: 'Ещё', showLess: 'Свернуть'
    },
    ja: {
      names: { treadmill: 'トレッドミル', stationary_bike: 'バイク', outdoor_bike: 'バイク', outdoor_walk: 'ウォーク', elliptical: 'エリプティカル', stairmaster: 'ステア', rowing_machine: 'ローイング', jump_rope: '縄跳び', otro: '有酸素' },
      incline: { flat: '0%', low: '2-4%', mid: '5-8%', high: '9-12%' }, inclineSuffix: '傾斜',
      modes: { intervals: 'インターバル', continuous: '連続' },
      resistance: { light: '低', moderate: '中', heavy: '高', climb: '登り' },
      level: { soft: '弱', moderate: '中', intense: '強', max: '最大' },
      rhythm: { constant: '一定', intervals: 'インターバル' },
      damper: { low: '段1-3', mid: '段4-6', high: '段7-10' },
      rower: { continuous: '連続', intervals: 'セット' },
      terrain: { flat: '平坦', hill: '上り', fast: '速い', easy: '軽め' },
      kmh: 'km/h', showMore: 'もっと見る', showLess: '閉じる'
    }
  };

  function compactDict() { return COMPACT_LABELS[curLang] || COMPACT_LABELS.es; }

  function escapeRegExp(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function shortenCardioName(s) {
    return String(s || '').split('(')[0].split('/')[0].split(',')[0].trim();
  }

  // Registros antiguos: quita el nombre repetido de la máquina y acorta el detalle.
  function cleanLegacyDetail(raw, r, fullName, shortName, w) {
    var s = String(raw || '');
    if (r.notes) s = s.split(r.notes).join(' ');
    [fullName, shortName].forEach(function (n) {
      if (n) s = s.replace(new RegExp(escapeRegExp(n), 'gi'), ' ');
    });
    s = s.replace(/\((?:suave|moderada|alta|low|medium|high|leicht|mittel|hoch|baja|média|faible|moyen|élevé|低|中|高)\)/gi, ' ');
    s = s.replace(/(inclinaci[oó]n|inclination|incline|inclina[cç][aã]o|steigung|傾斜)\s*(?:plana?|plano|flat|low|high)?\s*(\d+(?:[.,-]\d+)*\s*%)/gi,
      function (m, p1, p2) { return String(p2).replace(',', '.') + ' ' + w.inclineSuffix; });
    s = s.replace(/(intervalos?|intervals?|intervalles?|intervalli|intervalle)[^0-9]*(\d+(?:[.,]\d+)?)\s*(?:km\/h)?\s*(?:->|→|to|bis|a)\s*(\d+(?:[.,]\d+)?)(?:\s*km\/h)?/gi,
      function (m, p1, p2, p3) { return w.modes.intervals + ' ' + p2 + '-' + p3 + ' ' + w.kmh; });
    s = s.replace(/\s*->\s*/g, '-').replace(/\s*:\s*/g, ' ');
    s = s.replace(/\s{2,}/g, ' ').replace(/\s*·\s*/g, ' · ').replace(/^(?:\s|·)+|(?:\s|·)+$/g, '');
    return s;
  }

  // Resumen de una sesión de cardio en una sola línea, sin repetir la máquina.
  function compactCardioSummary(r) {
    if (!r) return '';
    var w = compactDict();
    var actId = r.activity || (r.detailFields && r.detailFields.activity) || '';
    var fullName = actId ? getCardioEquipmentName(actId, curLang) : '';
    var name = (w.names && w.names[actId]) || shortenCardioName(fullName);
    var parts = [];
    if (name) parts.push(name);
    if (r.intensity) parts.push(getIntensityLabel(r.intensity));

    var values = r.detailFields && r.detailFields.values;
    if (values && typeof values === 'object' && Object.keys(values).length) {
      var group = getDetailGroup(actId);
      var seg = [];
      if (group === 'treadmill') {
        if (w.incline[values.cdIncline]) seg.push(w.incline[values.cdIncline] + ' ' + w.inclineSuffix);
        var mode = values.cdMode === 'intervals' ? w.modes.intervals : w.modes.continuous;
        if (values.cdMode === 'intervals' && values.cdSpeedBase && values.cdSpeedPeak) {
          mode += ' ' + values.cdSpeedBase + '-' + values.cdSpeedPeak + ' ' + w.kmh;
        } else if (values.cdSpeedBase) {
          mode += ' ' + values.cdSpeedBase + ' ' + w.kmh;
        }
        seg.push(mode);
      } else if (group === 'bike') {
        if (w.resistance[values.cdResistance]) seg.push(w.resistance[values.cdResistance]);
        seg.push(values.cdBikeMode === 'intervals' ? w.modes.intervals : w.modes.continuous);
      } else if (group === 'level') {
        if (w.level[values.cdLevel]) seg.push(w.level[values.cdLevel]);
        seg.push(values.cdRhythm === 'intervals' ? w.rhythm.intervals : w.rhythm.constant);
      } else if (group === 'rower') {
        if (w.damper[values.cdDamper]) seg.push(w.damper[values.cdDamper]);
        seg.push(values.cdRowerFocus === 'intervals' ? w.rower.intervals : w.rower.continuous);
      } else if (w.terrain[values.cdTerrain]) {
        seg.push(w.terrain[values.cdTerrain]);
      }
      parts = parts.concat(seg.filter(Boolean));
    } else if (r.entreno) {
      var legacy = cleanLegacyDetail(r.entreno, r, fullName, name, w);
      if (legacy) parts.push(legacy);
    }
    if (r.notes) parts.push(r.notes);
    return parts.filter(Boolean).join(' · ');
  }

  var EMPTY_MEAL_RE = /^(nada|none|ningun[ao]?|sin nada|n\/a|na|-)$/i;
  function hasMealContent(r) {
    return MEAL_KEYS.some(function (m) {
      var v = String(r[m] == null ? '' : r[m]).trim();
      return !!v && !EMPTY_MEAL_RE.test(v);
    });
  }

  // Solo comidas con contenido real, en una línea separada por " · ".
  function compactMealHtml(r) {
    if (!r) return '';
    return MEAL_KEYS.filter(function (m) {
      var v = String(r[m] == null ? '' : r[m]).trim();
      return !!v && !EMPTY_MEAL_RE.test(v);
    }).map(function (m) {
      return '<span class="hist-meal"><b>' + esc(t(m)) + ':</b> ' + esc(String(r[m]).trim()) + '</span>';
    }).join('<span class="hist-sep"> · </span>');
  }

  function histPill(text, cls) {
    return '<span class="hist-pill' + (cls ? ' ' + cls : '') + '">' + esc(text) + '</span>';
  }
  function histMetricList(items) {
    return items.filter(Boolean).join('<span class="hist-sep">·</span>');
  }
  function histPlainText(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function histDetail(html) {
    if (!html) return '';
    var long = histPlainText(html).length > 140;
    return '<div class="hist-detail-line" data-toggle-detail="1" role="button" tabindex="0" aria-expanded="false">' + html + '</div>' +
      (long ? '<button type="button" class="hist-more" data-toggle-detail="1" aria-expanded="false">' + esc(compactDict().showMore) + '</button>' : '');
  }
  function histDetailText(summary, mealsHtml) {
    var out = summary ? '<span>' + esc(summary) + '</span>' : '';
    if (mealsHtml) out += (out ? '<br>' : '') + '<span class="hist-meals">' + mealsHtml + '</span>';
    return out;
  }
  function histCard(mainHtml, detailHtml, actionsHtml) {
    return '<article class="hist-card">' +
      '<div class="hist-card-main">' + mainHtml + '</div>' +
      (actionsHtml || '') +
      (detailHtml ? '<div class="hist-card-detail">' + detailHtml + '</div>' : '') +
      '</article>';
  }
  function liftDate(v) {
    return /^\d{4}-\d{2}-\d{2}$/.test(v.date || '') ? v.date : todayIso();
  }

  function showEditBar(date) {
    var bar = $('editBar');
    if (!bar) return;
    bar.hidden = false;
    var status = $('editStatus');
    var d = date || (editing && editing.date);
    if (status) status.textContent = t('editingSession') + (d ? ': ' + fmtDate(d) : '');
  }

  function setEditing(next) {
    editing = next;
    if (next) showEditBar(next.date);
    else {
      var bar = $('editBar');
      if (bar) bar.hidden = true;
    }
  }

  function cancelEdit() {
    setEditing(null);
    clearForm();
    say('msg', '');
    say('gmsg', '');
  }

  function editDayRecord(date) {
    if (!days[date]) return;
    setEditing({ type: 'day', key: date, date: date });
    showTab('cardio');
    setWorkoutDate(date, { load: false, scroll: false });
    fillForm(date, { scroll: true });
    say('msg', t('editingSession') + ': ' + fmtDate(date));
  }

  function editLiftRecord(id) {
    var v = lifts[id];
    if (!v) return;
    var date = /^\d{4}-\d{2}-\d{2}$/.test(v.date || '') ? v.date : todayIso();
    setEditing({ type: 'lift', key: id, date: date });
    showTab('pesas');
    // Carga también el formulario de cardio de esa fecha para mantener ambos
    // formularios coherentes con #workoutDate.
    setWorkoutDate(date, { scroll: false });

    if ($('gtype')) $('gtype').value = normalizeLiftGroup(v.tipo || 'mancuernas');
    var exObj = (v.exerciseKey && EX_NAME_MAP[v.exerciseKey]) ? EX_NAME_MAP[v.exerciseKey] : null;
    if (!exObj && v.ejercicio) {
      exObj = EX_NAME_MAP[getCanonicalExerciseKey(v.ejercicio)] || null;
    }
    if ($('liftMuscleSelect')) $('liftMuscleSelect').value = exObj ? getLiftMuscleFilter(exObj) : 'all';
    renderLiftExerciseSelect({ exerciseKey: exObj ? exObj.key : '' });
    fillExList();
    if (!exObj) {
      if ($('liftExerciseSelect')) $('liftExerciseSelect').value = CUSTOM_EXERCISE_VALUE;
      if ($('gex')) $('gex').value = v.ejercicio || '';
      updateCustomExerciseVisibility();
    } else if ($('gex')) {
      $('gex').value = '';
    }
    if ($('gsets')) $('gsets').value = num(v.series) || 1;
    if ($('greps')) $('greps').value = num(v.reps) || 1;
    if ($('gkg')) $('gkg').value = v.kg == null ? '' : v.kg;
    var note = $('gLastRecordNote');
    if (note) note.style.display = 'none';
    if ($('gf') && $('gf').scrollIntoView) $('gf').scrollIntoView({ behavior: 'smooth', block: 'center' });
    say('gmsg', t('editingSession') + ': ' + fmtDate(date));
  }

  function refreshHistoryViews() {
    renderDays();
    renderTotalHistory();
    renderSelectedLifts(currentDate());
    renderLifts();
    if (typeof renderMeasures === 'function') renderMeasures();
  }

  function armOrDelete(btn, kind, id) {
    id = String(id);
    var same = armedDelete && armedDelete.kind === kind && armedDelete.id === id;
    if (!same) {
      armedDelete = { kind: kind, id: id };
      btn.textContent = t('confirmDelete');
      btn.classList.add('armed');
      btn.setAttribute('aria-label', t('confirmDelete'));
      clearTimeout(armTimer);
      armTimer = setTimeout(function () { armedDelete = null; refreshHistoryViews(); }, 3000);
      return;
    }

    clearTimeout(armTimer);
    armedDelete = null;
    var wasEditing = editing && ((kind === 'day' && editing.type === 'day' && editing.key === id) ||
      (kind === 'lift' && editing.type === 'lift' && editing.key === id));
    if (kind === 'day') {
      if (Storage.deleteDay) Storage.deleteDay(days, id);
      else { delete days[id]; save(LS_DAYS, days); }
    } else if (kind === 'measure') {
      if (Storage.deleteMeasure) Storage.deleteMeasure(measures, id);
      else { delete measures[id]; save(LS_MEASURES, measures); }
    } else {
      if (Storage.deleteLift) Storage.deleteLift(lifts, id);
      else { delete lifts[id]; save(LS_LIFTS, lifts); }
    }
    if (wasEditing) {
      setEditing(null);
      clearForm();
    }
    render();
  }

  function toggleHistDetail(el) {
    var card = el.closest ? el.closest('.hist-card') : null;
    if (!card) return;
    var expanded = card.classList.toggle('expanded');
    var w = compactDict();
    var btn = card.querySelector('.hist-more');
    if (btn) {
      btn.textContent = expanded ? w.showLess : w.showMore;
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
    var line = card.querySelector('.hist-detail-line');
    if (line) line.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function handleHistoryAction(e) {
    var toggle = e.target && e.target.closest ? e.target.closest('[data-toggle-detail]') : null;
    if (toggle) { toggleHistDetail(toggle); return; }
    var btn = e.target && e.target.closest ? e.target.closest('button') : null;
    if (!btn) return;
    if (btn.id === 'btnCancelEdit') { cancelEdit(); return; }
    var editDay = btn.getAttribute('data-edit-day');
    if (editDay) { editDayRecord(editDay); return; }
    var delDay = btn.getAttribute('data-del-day');
    if (delDay) { armOrDelete(btn, 'day', delDay); return; }
    var editLift = btn.getAttribute('data-edit-lift');
    if (editLift) { editLiftRecord(editLift); return; }
    var delLift = btn.getAttribute('data-del-lift');
    if (delLift) { armOrDelete(btn, 'lift', delLift); return; }
    var delMeasure = btn.getAttribute('data-del-measure');
    if (delMeasure) { armOrDelete(btn, 'measure', delMeasure); }
  }

  document.addEventListener('click', handleHistoryAction);
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList &&
        e.target.classList.contains('hist-detail-line')) {
      e.preventDefault();
      toggleHistDetail(e.target);
    }
  });

  function renderSelectedLifts(date) {
    var box = $('selectedLifts');
    if (!box) return;
    var list = (Storage.getLiftsByDate && Storage.getLiftsByDate(lifts, date)) || [];
    if (!list.length) {
      box.innerHTML = '<p class="empty">' + esc(t('noLiftsOnDate')) + '</p>';
      return;
    }
    box.innerHTML = list.map(function (it) {
      var v = it.v;
      return '<div class="selected-lift"><div class="what">' + esc(v.ejercicio) +
        ' <small>· ' + esc(getTypeLabel(v.tipo)) + '</small><br>' +
        fmt(num(v.series), 0) + ' × ' + fmt(num(v.reps), 0) + ' ' + t('withConnector') + ' ' + fmt(num(v.kg), 1) + ' kg</div>' +
        actionButtons('lift', it.id, v.ejercicio) + '</div>';
    }).join('');
  }

  function updateWorkoutDateUI() {
    var el = $('workoutDate');
    if (!el) return;
    var date = currentDate(), tIso = todayIso(), isToday = (date === tIso);
    el.max = tIso;
    if (el.value !== date) el.value = date;
    syncDateMirrors(date);

    var badge = $('workoutDateBadge');
    if (badge) {
      badge.textContent = isToday ? t('btnToday') : fmtDate(date);
      badge.hidden = false;
    }
    var btnToday = $('btnToday');
    if (btnToday) btnToday.hidden = isToday;

    var notice = $('pastDayNotice');
    if (notice) {
      notice.hidden = isToday;
      notice.className = 'msg past-day-notice';
      notice.textContent = isToday ? '' : t('editingPastDay').replace('{date}', fmtDate(date));
    }
    renderSelectedLifts(date);
  }

  function setWorkoutDate(date, opts) {
    opts = opts || {};
    var el = $('workoutDate');
    if (!el) return;
    var value = Storage.normalizeDate ? Storage.normalizeDate(date) : (date || todayIso());
    if (value > todayIso()) {
      say('msg', t('futureDateNotAllowed'), true);
      value = todayIso();
    }
    el.value = value;
    updateWorkoutDateUI();
    if (opts.load !== false) {
      if (days[value]) {
        fillForm(value, { scroll: !!opts.scroll });
      } else {
        clearForm(true);
      }
    }
  }

  function t(k) {
    var dict = I18N[curLang] || I18N.es;
    return dict[k] !== undefined ? dict[k] : (I18N.es[k] !== undefined ? I18N.es[k] : k);
  }

  function fmtDate(s) {
    var loc = LOCALE[curLang] || 'es-ES';
    return parse(s).toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function fmt(n, dec) {
    var loc = LOCALE[curLang] || 'es-ES';
    return (Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)).toLocaleString(loc, { maximumFractionDigits: dec });
  }

  function getTypeLabel(tipo) {
    var types = (I18N[curLang] || I18N.es).types || {};
    return types[tipo] || (I18N.es.types || {})[tipo] || tipo;
  }

  function getRoutineInfo(wd) {
    var dict = (I18N[curLang] || I18N.es).routines || {};
    return dict[wd] || (I18N.es.routines[wd] || { name: '', sub: '' });
  }

  function load(key) {
    if (Storage.load) return Storage.load(key);
    try { var g = JSON.parse(localStorage.getItem(key) || 'null'); return g && typeof g === 'object' ? g : {}; } catch (e) { return {}; }
  }
  function save(key, obj) {
    if (Storage.save) { Storage.save(key, obj); return; }
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }

  function detectLang() {
    try {
      var stored = localStorage.getItem(LS_LANG);
      if (stored && SUPPORTED_LANGS.indexOf(stored) >= 0) return stored;
    } catch (e) {}
    var nav = (navigator.languages && navigator.languages.length ? navigator.languages[0] : (navigator.language || 'es')).toLowerCase();
    var code = nav.split('-')[0];
    if (SUPPORTED_LANGS.indexOf(code) >= 0) return code;
    return 'es';
  }

  function applyLang(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) < 0) lang = 'es';
    curLang = lang;
    window.PulseFit.curLang = lang;
    try { localStorage.setItem(LS_LANG, lang); } catch (e) {}
    document.documentElement.lang = lang;
    if ($('langSelect')) $('langSelect').value = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var val = t(k);
      if (val) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-ph');
      var val = t(k);
      if (val) el.placeholder = val;
    });

    // Opciones generadas dinámicamente (constructor de cardio, etc.).
    document.querySelectorAll('option[data-i18n]').forEach(function (opt) {
      var val = t(opt.getAttribute('data-i18n'));
      if (val) opt.textContent = val;
    });

    var gtype = $('gtype');
    if (gtype) {
      for (var i = 0; i < gtype.options.length; i++) {
        var opt = gtype.options[i];
        opt.textContent = getTypeLabel(opt.value);
      }
    }

    var cfgGoal = $('cfgGoal');
    if (cfgGoal) {
      for (var gi = 0; gi < cfgGoal.options.length; gi++) {
        var gOpt = cfgGoal.options[gi];
        var gKey = 'goal' + gOpt.value.charAt(0).toUpperCase() + gOpt.value.slice(1).replace(/_([a-z])/g, function (m, p1) { return p1.toUpperCase(); });
        var gText = t(gKey);
        if (gText) gOpt.textContent = gText;
      }
    }

    var cfgSplit = $('cfgSplit');
    if (cfgSplit) {
      for (var si = 0; si < cfgSplit.options.length; si++) {
        var sOpt = cfgSplit.options[si];
        var sKey = 'split' + sOpt.value.charAt(0).toUpperCase() + sOpt.value.slice(1).replace(/_([a-z])/g, function (m, p1) { return p1.toUpperCase(); });
        var sText = t(sKey);
        if (sText) sOpt.textContent = sText;
      }
    }

    var cardioCfgGoal = $('cardioCfgGoal');
    if (cardioCfgGoal) {
      for (var cgi = 0; cgi < cardioCfgGoal.options.length; cgi++) {
        var cgOpt = cardioCfgGoal.options[cgi];
        var cgKey = cgOpt.getAttribute('data-i18n');
        if (cgKey) {
          var cgText = t(cgKey);
          if (cgText) cgOpt.textContent = cgText;
        }
      }
    }

    var cardioIntensity = $('cardioIntensity');
    if (cardioIntensity) {
      for (var cii = 0; cii < cardioIntensity.options.length; cii++) {
        var ciOpt = cardioIntensity.options[cii];
        var ciKey = ciOpt.getAttribute('data-i18n');
        if (ciKey) {
          var ciText = t(ciKey);
          if (ciText) ciOpt.textContent = ciText;
        }
      }
    }

    var btnSyncTimerText = $('btnSyncTimerText');
    if (btnSyncTimerText && GOALS[routineConfig.goal]) {
      btnSyncTimerText.textContent = GOALS[routineConfig.goal].rest + 's ' + t('timerRest').toLowerCase();
    }

    var prog = t('progressionItems');
    if (Array.isArray(prog) && $('progList')) {
      $('progList').innerHTML = prog.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('');
    }

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-title');
      var val = t(k);
      if (val) el.title = val;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      var val = t(k);
      if (val) el.setAttribute('aria-label', val);
    });

    if (typeof updateTimerLabels === 'function') updateTimerLabels();

    renderCardioDetailBuilder();
    renderLiftMuscleSelect();
    renderLiftExerciseSelect();
    fillExList();
    if (editing) showEditBar();
    render();
  }

  /* ---------- plan semanal, calendario, comparación y medidas ---------- */
  function validIso(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return false;
    var p = s.split('-'), y = +p[0], m = +p[1] - 1, d = +p[2];
    var dt = new Date(y, m, d, 12, 0, 0, 0);
    return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
  }

  function attr(s) {
    return esc(s).replace(/'/g, '&#39;');
  }

  function defaultPlan() {
    return { weekdays: {}, dates: {} };
  }

  function normalizePlan(p) {
    if (Storage.normalizePlan) return Storage.normalizePlan(p);
    var out = defaultPlan();
    if (!p || typeof p !== 'object') return out;
    ['weekdays', 'dates'].forEach(function (scope) {
      var src = p[scope];
      if (!src || typeof src !== 'object') return;
      Object.keys(src).forEach(function (k) {
        var e = src[k];
        if (!e || typeof e !== 'object') return;
        var modes = ['rest', 'cardio', 'routine', 'combo'];
        var mode = modes.indexOf(e.mode) >= 0 ? e.mode : 'auto';
        if (mode === 'auto') return;
        var clean = { mode: mode, name: String(e.name || '') };
        if (typeof e.weights === 'string' && e.weights.length <= 120) clean.weights = e.weights;
        if (typeof e.cardio === 'boolean') clean.cardio = e.cardio;
        else if (typeof e.cardio === 'string' && e.cardio.length <= 80) clean.cardio = e.cardio;
        if (scope === 'weekdays') {
          var i = parseInt(k, 10);
          if (i >= 0 && i <= 6) out.weekdays[String(i)] = clean;
        } else if (validIso(k)) {
          out.dates[k] = clean;
        }
      });
    });
    return out;
  }

  var PLAN_AUTO_HINTS = {
    es: 'pesas + cardio según lo activo',
    en: 'follows your active weights + cardio plans',
    pt: 'segundo os planos ativos de pesos + cardio',
    fr: 'selon vos plans actifs musculation + cardio',
    it: 'secondo i piani attivi pesi + cardio',
    de: 'entspricht deinen aktiven Kraft- + Cardio-Plänen',
    ru: 'по активным планам силовых + кардио',
    ja: 'アクティブな筋トレ＋有酸素プランに従う'
  };
  var CUSTOM_ROUTINE_KEYS = [
    'pulsefit_custom_routines', 'pulsefit_saved_routines', 'pulsefit_routine_templates',
    'pulsefit_templates', 'pulsefit_my_routines', 'pulsefit_customRoutines', 'pulsefit_routines'
  ];
  var ROUTINE_NAME_KEYS = ['name', 'title', 'label', 'routineName', 'templateName', 'rutina', 'plantilla'];

  function planAutoLabel() {
    var hint = PLAN_AUTO_HINTS[curLang] || PLAN_AUTO_HINTS.es;
    return t('planAuto') + ' (' + hint + ')';
  }

  /* ---------- plan combinado: pesas + cardio ---------- */
  // El plan "Auto" toma la sesión de pesas de la división activa y la
  // modalidad de cardio configurada en la pestaña Cardio. Cualquier día puede
  // sobrescribirse con pesas, cardio, ambos o descanso desde los desplegables.
  function cardioIsEnabled() {
    var cfg = cardioConfig || {};
    if (cfg.enabled === false || cfg.mode === 'off' ||
        cfg.plan === 'off' || cfg.plan === 'none' || cfg.plan === 'disabled') return false;
    return !!(CARDIO_GOALS[cfg.goal] && Array.isArray(cfg.equipment) && cfg.equipment.length);
  }

  function cardioPlanName() {
    var goalName = getCardioGoalName(cardioConfig.goal);
    return goalName ? t('tabCardio') + ' · ' + goalName : t('tabCardio');
  }

  function cardioPlanDetail(limit) {
    var list = (cardioConfig.equipment || []).map(function (id) {
      return getCardioEquipmentName(id, curLang);
    }).filter(Boolean);
    if (limit && list.length > limit) {
      return list.slice(0, limit).join(' · ') + ' +' + (list.length - limit);
    }
    return list.join(' · ');
  }

  function cardioScheduledOn(wd, hasWeights) {
    var cfg = cardioConfig || {};
    var day = cfg.days;
    if (Array.isArray(day)) return day.indexOf(wd) >= 0;
    if (day === 'rest') return !hasWeights;
    if (day && typeof day === 'object') return !!day[String(wd)];
    if (cfg.plan === 'rest_days' || cfg.mode === 'rest_days') return !hasWeights;
    return true;
  }

  function weightsOptionForWeekday(wd) {
    var split = routineConfig.split;
    if ((SPLIT_DAYS[split] || []).indexOf(wd) < 0) return null;
    var sess = getSplitSessionInfo(split, wd) || {};
    return {
      name: String(sess.name || '').trim() || t('planRoutine'),
      optionValue: 'routine:' + split + ':' + wd,
      split: split,
      dayKey: wd,
      assigned: false
    };
  }

  function explicitWeightsPart(raw, wd) {
    if (!raw) return null;
    var opt = raw.weights ? findRoutineOption(raw.weights) : null;
    if (!opt && raw.name) opt = findRoutineOption(raw.name);
    if (opt) {
      var pieces = /^routine:([^:]+):(\d+)$/.exec(opt.value);
      return {
        name: opt.name,
        optionValue: opt.value,
        split: pieces ? pieces[1] : routineConfig.split,
        dayKey: pieces ? +pieces[2] : wd,
        assigned: true
      };
    }
    var name = String(raw.name || '').trim();
    if (!name) return null;
    return {
      name: name,
      optionValue: '',
      split: routineConfig.split,
      dayKey: wd,
      assigned: true
    };
  }

  // Si el usuario elige "Pesas + Cardio" en un día sin sesión en la división
  // activa, se usa la primera sesión de esa división para no perder las pesas.
  function defaultComboWeightsPart(wd) {
    var auto = weightsOptionForWeekday(wd);
    if (auto) return auto;
    var split = routineConfig.split;
    var days = (SPLIT_DAYS[split] || []).slice().sort(function (a, b) { return (+a) - (+b); });
    if (!days.length) return null;
    var dayKey = days[0];
    var sess = getSplitSessionInfo(split, dayKey) || {};
    return {
      name: String(sess.name || '').trim() || t('planRoutine'),
      optionValue: 'routine:' + split + ':' + dayKey,
      split: split,
      dayKey: dayKey,
      assigned: false
    };
  }

  function buildPlanEntry(raw, wd, source) {
    var isAuto = !raw || raw.mode === 'auto';
    var weightsPart = null, cardioPart = null;
    if (isAuto) {
      weightsPart = weightsOptionForWeekday(wd);
      if (cardioIsEnabled() && cardioScheduledOn(wd, !!weightsPart)) {
        cardioPart = { name: cardioPlanName(), goal: cardioConfig.goal };
      }
    } else if (raw.mode === 'routine' || raw.mode === 'combo') {
      weightsPart = explicitWeightsPart(raw, wd) ||
        (raw.mode === 'combo' ? defaultComboWeightsPart(wd) : weightsOptionForWeekday(wd));
      if (raw.mode === 'combo' || raw.cardio === true) {
        cardioPart = { name: cardioPlanName(), goal: cardioConfig.goal };
      }
    } else if (raw.mode === 'cardio') {
      cardioPart = { name: cardioPlanName(), goal: cardioConfig.goal };
    }

    var mode = weightsPart ? (cardioPart ? 'combo' : 'routine') : (cardioPart ? 'cardio' : 'rest');
    var name;
    if (weightsPart && cardioPart) name = weightsPart.name + ' + ' + cardioPart.name;
    else if (weightsPart) name = weightsPart.name;
    else if (cardioPart) name = cardioPart.name;
    else name = t('planRest');

    return {
      mode: mode,
      name: name,
      auto: isAuto,
      source: isAuto ? 'auto' : source,
      parts: { weights: weightsPart, cardio: cardioPart }
    };
  }

  function readStoredJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function pushUniqueName(list, seen, name) {
    var value = String(name == null ? '' : name).trim();
    if (!value || value.length > 80) return;
    var key = value.toLocaleLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    list.push(value);
  }

  function routineNameOf(value) {
    if (!value || typeof value !== 'object') return '';
    for (var i = 0; i < ROUTINE_NAME_KEYS.length; i++) {
      var k = ROUTINE_NAME_KEYS[i];
      if (typeof value[k] === 'string' && value[k].trim()) return value[k].trim();
    }
    return '';
  }

  function collectCustomRoutineNames(value, out, seen, depth) {
    if (!value || depth > 4) return;
    if (typeof value === 'string') { pushUniqueName(out, seen, value); return; }
    if (Array.isArray(value)) {
      value.forEach(function (item) { collectCustomRoutineNames(item, out, seen, depth + 1); });
      return;
    }
    if (typeof value !== 'object') return;
    var name = routineNameOf(value);
    var isRoutine = !!(value.days || value.sessions || value.exercises || value.weekdays || value.rows || value.items);
    if (name && isRoutine) pushUniqueName(out, seen, name);
    Object.keys(value).forEach(function (k) {
      if (ROUTINE_NAME_KEYS.indexOf(k) >= 0) return;
      var child = value[k];
      if (child && typeof child === 'object') collectCustomRoutineNames(child, out, seen, depth + 1);
    });
  }

  // Rutinas creadas/guardadas por el usuario: API pública, claves propias,
  // nombres asignados en el plan y metadatos de sesiones guardadas.
  function getCustomRoutineNames() {
    var out = [], seen = {};
    var pf = window.PulseFit || {};
    ['customRoutines', 'savedRoutines', 'routineTemplates', 'templates', 'routines'].forEach(function (prop) {
      if (pf[prop]) collectCustomRoutineNames(pf[prop], out, seen, 0);
    });
    CUSTOM_ROUTINE_KEYS.forEach(function (key) {
      var parsed = readStoredJson(key);
      if (parsed) collectCustomRoutineNames(parsed, out, seen, 0);
    });
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || CUSTOM_ROUTINE_KEYS.indexOf(key) >= 0) continue;
        if (!/(custom|saved|my)[_-]?(routines?|templates?)|(routines?|templates?)[_-]?(custom|saved|my)/i.test(key)) continue;
        var stored = readStoredJson(key);
        if (stored) collectCustomRoutineNames(stored, out, seen, 0);
      }
    } catch (e) {}
    var plan = weeklyPlan || {};
    [plan.weekdays, plan.dates].forEach(function (scope) {
      Object.keys(scope || {}).forEach(function (k) {
        var e = scope[k];
        if (e && e.mode === 'routine' && e.name) pushUniqueName(out, seen, e.name);
      });
    });
    [days, lifts].forEach(function (records) {
      Object.keys(records || {}).forEach(function (k) {
        var r = records[k];
        if (!r || typeof r !== 'object') return;
        ['routine', 'rutina', 'routineName', 'template', 'plantilla'].forEach(function (prop) {
          if (typeof r[prop] === 'string') pushUniqueName(out, seen, r[prop]);
        });
      });
    });
    if (routineConfig && routineConfig.name) pushUniqueName(out, seen, routineConfig.name);
    return out;
  }

  // Catálogo único para ambos desplegables: sesiones reales de TODAS las
  // divisiones disponibles + rutinas/plantillas guardadas por el usuario.
  function getRoutineOptionCatalog() {
    var options = [], usedNames = {}, builtInNames = {};

    function splitLongName(splitKey) {
      var key = 'split' + splitKey.charAt(0).toUpperCase() +
        splitKey.slice(1).replace(/_([a-z])/g, function (m, p1) { return p1.toUpperCase(); });
      var value = t(key);
      return (typeof value === 'string' && value !== key) ? value : getSplitName(splitKey);
    }

    function add(id, name, qualifier, aliases, builtIn, forceQualify) {
      var base = String(name || '').trim() || t('planRoutine');
      var q = String(qualifier || '').trim();
      var prefix = (forceQualify && q) ? base + ' · ' + q : base;
      var finalName = prefix;
      var n = 2;
      while (usedNames[finalName.toLocaleLowerCase()]) {
        finalName = prefix + ' ' + (n++);
      }
      usedNames[finalName.toLocaleLowerCase()] = true;
      if (builtIn) builtInNames[finalName.toLocaleLowerCase()] = true;
      var allAliases = [base];
      (aliases || []).forEach(function (a) {
        if (a && allAliases.indexOf(String(a)) < 0) allAliases.push(String(a));
      });
      if (builtIn) {
        allAliases.forEach(function (a) { builtInNames[String(a).toLocaleLowerCase()] = true; });
      }
      options.push({ value: id, name: finalName, aliases: allAliases });
    }

    var splitKeys = Object.keys(SPLIT_DAYS);
    if (splitKeys.indexOf(routineConfig.split) >= 0) {
      splitKeys = [routineConfig.split].concat(splitKeys.filter(function (k) { return k !== routineConfig.split; }));
    }

    // Se agrupa primero para que los nombres no dependan del orden (ni de la
    // división activa): "Empuje A · PPL" sigue siendo el mismo al cambiar de split.
    var raw = [];
    splitKeys.forEach(function (splitKey) {
      var splitName = getSplitName(splitKey);
      var splitOptionName = splitLongName(splitKey);
      raw.push({
        id: 'split:' + splitKey,
        name: splitOptionName,
        qualifier: '',
        aliases: [splitOptionName, splitName]
      });
      var dayNames = t('dayNames') || [];
      (SPLIT_DAYS[splitKey] || []).slice().sort(function (a, b) { return (+a) - (+b); }).forEach(function (dayKey) {
        var sess = getSplitSessionInfo(splitKey, dayKey) || {};
        var dayName = dayNames[dayKey] || String((+dayKey) + 1);
        var name = String(sess.name || '').trim() || (splitName + ' · ' + dayName);
        raw.push({
          id: 'routine:' + splitKey + ':' + dayKey,
          name: name,
          qualifier: splitName,
          aliases: [name]
        });
      });
    });

    var counts = {};
    raw.forEach(function (o) {
      var k = o.name.toLocaleLowerCase();
      counts[k] = (counts[k] || 0) + 1;
    });
    raw.forEach(function (o) {
      add(o.id, o.name, o.qualifier, o.aliases, true,
        counts[o.name.toLocaleLowerCase()] > 1 && !!o.qualifier);
    });

    getCustomRoutineNames().forEach(function (name) {
      var base = String(name || '').trim();
      if (!base || builtInNames[base.toLocaleLowerCase()] || usedNames[base.toLocaleLowerCase()]) return;
      add('routine:custom:' + (options.length + 1), base, '', [base], false, false);
    });

    return options;
  }

  function findRoutineOption(valueOrName) {
    var options = getRoutineOptionCatalog();
    var raw = String(valueOrName == null ? '' : valueOrName);
    var i, opt;
    for (i = 0; i < options.length; i++) {
      if (options[i].value === raw) return options[i];
    }
    var legacy = /^routine:(\d+)$/.exec(raw);
    if (legacy) {
      var activePrefix = 'routine:' + routineConfig.split + ':';
      var activeOptions = options.filter(function (o) { return o.value.indexOf(activePrefix) === 0; });
      return activeOptions[+legacy[1]] || options[+legacy[1]] || null;
    }
    var needle = raw.trim().toLocaleLowerCase();
    if (!needle) return null;
    var activeKeys = ['routine:' + routineConfig.split + ':', 'split:' + routineConfig.split];
    for (var pass = 0; pass < 2; pass++) {
      for (i = 0; i < options.length; i++) {
        opt = options[i];
        var isActive = activeKeys.some(function (prefix) { return opt.value.indexOf(prefix) === 0; });
        if ((pass === 0) !== isActive) continue;
        if (opt.name.toLocaleLowerCase() === needle ||
            opt.aliases.some(function (a) { return String(a).toLocaleLowerCase() === needle; })) return opt;
      }
    }
    return null;
  }

  function planModeName(raw) {
    if (!raw || raw.mode === 'auto') return t('planAuto');
    if (raw.mode === 'rest') return t('planRest');
    if (raw.mode === 'cardio') return cardioPlanName();
    if (raw.mode === 'combo') {
      var w = explicitWeightsPart(raw, 0) || defaultComboWeightsPart(0);
      return w ? (w.name + ' + ' + cardioPlanName()) : (t('tabWeights') + ' + ' + t('tabCardio'));
    }
    var opt = raw.weights ? findRoutineOption(raw.weights) : (raw.name ? findRoutineOption(raw.name) : null);
    return (opt && opt.name) || raw.name || t('planRoutine');
  }

  function optionName(value) {
    if (value === 'auto') return t('planAuto');
    if (value === 'rest') return t('planRest');
    if (value === 'cardio') return t('tabCardio');
    if (value === 'combo') return t('tabWeights') + ' + ' + t('tabCardio');
    var opt = findRoutineOption(value);
    return opt ? opt.name : t('planRoutine');
  }

  // Todas las opciones siguen disponibles en el editor del calendario y en el
  // plan semanal: Auto, Descanso, Cardio, Pesas + Cardio, divisiones completas
  // (Full Body, Torso/Pierna, PPL, ...) y cada sesión A/B/C de esas divisiones.
  function planOptionsHtml(selected, includeAuto) {
    var html = includeAuto ? '<option value="auto"' + (selected === 'auto' ? ' selected' : '') + '>' + esc(planAutoLabel()) + '</option>' : '';
    html += '<option value="rest"' + (selected === 'rest' ? ' selected' : '') + '>' + esc(t('planRest')) + '</option>';
    html += '<option value="cardio"' + (selected === 'cardio' ? ' selected' : '') + '>' + esc(t('tabCardio')) + '</option>';
    html += '<option value="combo"' + (selected === 'combo' ? ' selected' : '') + '>' + esc(optionName('combo')) + '</option>';
    getRoutineOptionCatalog().forEach(function (opt) {
      html += '<option value="' + attr(opt.value) + '"' + (selected === opt.value ? ' selected' : '') + '>' + esc(opt.name) + '</option>';
    });
    return html;
  }

  function weekdayPlanEntry(wd) {
    return buildPlanEntry(weeklyPlan.weekdays[wd], wd, 'weekday');
  }

  function resolvePlanEntry(dateIso) {
    var key = validIso(dateIso) ? dateIso : todayIso();
    var wd = dow(parse(key));
    var override = weeklyPlan.dates[key];
    if (override && override.mode && override.mode !== 'auto') {
      return buildPlanEntry(override, wd, 'date');
    }
    return weekdayPlanEntry(wd);
  }

  function planValueOf(entry) {
    if (entry.auto) return 'auto';
    if (entry.mode === 'rest' || entry.mode === 'cardio' || entry.mode === 'combo') return entry.mode;
    var w = entry.parts && entry.parts.weights;
    if (w && w.optionValue) {
      var chosen = findRoutineOption(w.optionValue);
      if (chosen) return chosen.value;
    }
    var opt = findRoutineOption(entry.name);
    return opt ? opt.value : 'auto';
  }

  function savePlanValue(scope, key, value) {
    var target = (scope === 'dates') ? weeklyPlan.dates : weeklyPlan.weekdays;
    if (value === 'auto') {
      delete target[key];
    } else if (value === 'rest' || value === 'cardio') {
      target[key] = { mode: value, name: '' };
    } else if (value === 'combo') {
      target[key] = { mode: 'combo', name: '', cardio: true };
    } else {
      target[key] = { mode: 'routine', name: optionName(value), weights: value };
    }
    window.PulseFit.weeklyPlan = weeklyPlan;
    if (Storage.savePlan) Storage.savePlan(weeklyPlan); else save(LS_PLAN, weeklyPlan);
  }

  function trainedOn(dateIso) {
    if (did(dateIso)) return true;
    return !!(Storage.getLiftsByDate && Storage.getLiftsByDate(lifts, dateIso).length);
  }

  function renderCalendar() {
    var grid = $('calGrid');
    if (!grid) return;
    var base = calMonth || new Date(today().getFullYear(), today().getMonth(), 1, 12);
    var y = base.getFullYear(), m = base.getMonth();
    if ($('calTitle')) {
      $('calTitle').textContent = base.toLocaleDateString(LOCALE[curLang] || 'es-ES', { month: 'long', year: 'numeric' });
    }
    if ($('calWeekdays')) {
      var letters = t('weekLetters') || ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
      $('calWeekdays').innerHTML = letters.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('');
    }
    var first = new Date(y, m, 1, 12), start = addDays(first, -dow(first));
    var ts = todayIso(), html = '';
    for (var i = 0; i < 42; i++) {
      var d = addDays(start, i), s = iso(d);
      var p = resolvePlanEntry(s);
      var cls = 'cal-day' + (d.getMonth() !== m ? ' other' : '') + (trainedOn(s) ? ' trained' : '') +
        (p.mode === 'rest' ? ' rest' : '') + (p.mode === 'combo' ? ' combo' : '') +
        (s === ts ? ' today' : '') + (s === selectedCalDate ? ' selected' : '');
      var mark = trainedOn(s) ? '✓' : (p.mode === 'rest' ? '–' : (p.mode === 'combo' ? '+' : '·'));
      html += '<button type="button" class="' + cls + '" data-cal-date="' + attr(s) + '"' +
        ' title="' + attr(p.name) + '" aria-label="' + attr(fmtDate(s) + ' · ' + p.name) + '"><span class="cal-num">' + d.getDate() + '</span>' +
        '<span class="cal-mark" aria-hidden="true">' + mark + '</span></button>';
    }
    grid.innerHTML = html;
    renderCalendarDayEditor();
  }

  function renderCalendarDayEditor() {
    var box = $('calDayEditor');
    if (!box) return;
    if (!selectedCalDate) { box.hidden = true; return; }
    box.hidden = false;
    var entry = resolvePlanEntry(selectedCalDate);
    if ($('calDayLabel')) $('calDayLabel').textContent = fmtDate(selectedCalDate);
    if ($('calDayPlanSelect')) $('calDayPlanSelect').innerHTML = planOptionsHtml(planValueOf(entry), true);
    if ($('calDayClear')) $('calDayClear').hidden = !weeklyPlan.dates[selectedCalDate];
    if ($('calDaySummary')) {
      var summary = t('planCurrent') + ': ' + entry.name;
      if (entry.parts && entry.parts.cardio) {
        summary += ' · ' + t('planCardioAssigned') + ': ' + getCardioGoalName(entry.parts.cardio.goal || cardioConfig.goal);
        var equipDetail = cardioPlanDetail(3);
        if (equipDetail) summary += ' (' + equipDetail + ')';
      }
      if (entry.source === 'auto') summary += ' · ' + t('planAuto');
      else if (entry.source === 'date') summary += ' · ' + t('planSpecificDay');
      if (trainedOn(selectedCalDate)) summary += ' · ' + t('planLegendTrained');
      $('calDaySummary').textContent = summary;
    }
  }

  // Un chip por parte del plan (pesas y cardio) evita concatenaciones largas
  // que antes se cortaban con "..." en la columna derecha del plan semanal.
  function weekPlanTagsHtml(entry) {
    var chips = [], parts = entry.parts || {};
    var cardioName = (parts.cardio && parts.cardio.name) ? parts.cardio.name : t('tabCardio');
    if (parts.weights && parts.weights.name) {
      chips.push({ label: parts.weights.name, title: parts.weights.name });
    }
    if (parts.cardio) {
      // Con pesas, el chip de cardio queda corto ("Cardio"); el detalle del
      // objetivo se conserva en el tooltip. Si es solo cardio, se muestra
      // completo ("Cardio · Quema de Grasa") y se ajusta con white-space:normal.
      chips.push({ label: parts.weights ? t('tabCardio') : cardioName, title: cardioName });
    }
    if (!chips.length) {
      var fallback = entry.name || t('planRest');
      chips.push({ label: fallback, title: fallback });
    }
    var cls = 'tag ' + (entry.mode === 'rest' ? 'no' : 'yes');
    return chips.map(function (chip) {
      return '<span class="' + cls + '" title="' + attr(chip.title) + '">' + esc(chip.label) + '</span>';
    }).join('');
  }

  function renderWeekPlanner() {
    var box = $('weekPlan');
    if (!box) return;
    var names = t('dayNames') || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var monday = addDays(today(), -dow(today())), wdToday = dow(today());
    box.innerHTML = names.map(function (name, i) {
      var entry = weekdayPlanEntry(i);
      var dateIso = iso(addDays(monday, i));
      return '<div class="week-plan-row' + (i === wdToday ? ' today' : '') + '">' +
        '<span class="plan-day">' + esc(name) + '</span>' +
        '<select data-week-day="' + i + '" aria-label="' + attr(name + ' · ' + t('planDayPlan')) + '">' +
          planOptionsHtml(planValueOf(entry), true) + '</select>' +
        '<div class="week-plan-tags">' + weekPlanTagsHtml(entry) + '</div>' +
        '<span class="sr-only">' + esc(fmtDate(dateIso)) + '</span>' +
        '</div>';
    }).join('');
  }

  function renderTodayPlan() {
    var bar = $('todayPlanBar');
    if (!bar) return;
    var entry = resolvePlanEntry(todayIso());
    var tag = $('todayPlanTag'), info = $('todayPlanInfo'), btn = $('btnTodayPlanGo');
    var tagLabel = entry.mode === 'rest' ? t('planRest') :
      (entry.mode === 'combo' ? (t('tabWeights') + ' + ' + t('tabCardio')) :
        (entry.mode === 'cardio' ? t('tabCardio') : t('planRoutine')));
    if (tag) {
      tag.className = 'tag ' + (entry.mode === 'rest' ? 'no' : 'yes');
      tag.textContent = tagLabel;
    }
    if (info) {
      var text = t('planTodayPrefix') + ': ' + entry.name;
      if (entry.parts && entry.parts.cardio) {
        text += ' · ' + t('planCardioAssigned') + ': ' + getCardioGoalName(entry.parts.cardio.goal || cardioConfig.goal);
      }
      if (entry.source === 'date') text += ' · ' + t('planSpecificDay');
      else if (entry.auto) text += ' · ' + t('planAuto');
      if (trainedOn(todayIso())) text += ' · ' + t('planDoneToday');
      info.textContent = text;
    }
    if (btn) {
      btn.textContent = entry.mode === 'rest' ? t('btnViewPlan') :
        (entry.mode === 'cardio' ? t('tabCardio') : t('btnViewRoutine'));
      btn.setAttribute('data-plan-target', entry.mode === 'cardio' ? 'cardio' :
        (entry.mode === 'routine' || entry.mode === 'combo' ? 'pesas' : 'plan'));
    }
  }

  /* ---------- comparación de periodos ---------- */
  function weekRange(offset) {
    var monday = addDays(today(), -dow(today()) + (offset * 7));
    return { start: iso(monday), end: iso(addDays(monday, 6)) };
  }

  function monthRange(offset) {
    var now = today();
    var first = new Date(now.getFullYear(), now.getMonth() + offset, 1, 12);
    var last = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 12);
    return { start: iso(first), end: iso(last) };
  }

  function periodStats(range) {
    var trained = {}, minutes = 0, volume = 0;
    Object.keys(days).forEach(function (date) {
      var r = days[date];
      if (!r || date < range.start || date > range.end) return;
      if (r.exercised) trained[date] = 1;
      minutes += num(r.minutes);
    });
    Object.keys(lifts).forEach(function (id) {
      var v = lifts[id];
      if (!v || v.date < range.start || v.date > range.end) return;
      trained[v.date] = 1;
      volume += num(v.series) * num(v.reps) * num(v.kg);
    });
    return { workouts: Object.keys(trained).length, minutes: minutes, volume: volume };
  }

  function deltaHtml(cur, prev, dec) {
    var diff = cur - prev;
    var cls = diff > 0 ? 'up' : (diff < 0 ? 'down' : 'flat');
    var sign = diff > 0 ? '+' : '';
    var pct = prev > 0 ? (diff / prev) * 100 : null;
    var pctText = pct != null ? (sign + fmt(pct, 0) + '%') : (cur > 0 ? t('compareNew') : '0%');
    return '<span class="delta ' + cls + '">' + sign + fmt(diff, dec) + ' · ' + pctText + '</span>';
  }

  function compareBlockHtml(title, cur, prev) {
    var rows = [
      { label: t('compareWorkouts'), key: 'workouts', dec: 0 },
      { label: t('compareCardioMin'), key: 'minutes', dec: 0 },
      { label: t('compareVolume'), key: 'volume', dec: 0 }
    ];
    var html = '<div class="compare-grid">' +
      '<div class="compare-head">' + esc(title) + '</div>' +
      '<div class="compare-head">' + esc(t('compareCurrent')) + '</div>' +
      '<div class="compare-head">' + esc(t('comparePrevious')) + '</div>' +
      '<div class="compare-head">' + esc(t('compareChange')) + '</div>';
    rows.forEach(function (row) {
      html += '<div class="compare-label">' + esc(row.label) + '</div>' +
        '<div class="compare-val">' + fmt(cur[row.key], row.dec) + '</div>' +
        '<div class="compare-prev">' + fmt(prev[row.key], row.dec) + '</div>' +
        '<div>' + deltaHtml(cur[row.key], prev[row.key], row.dec) + '</div>';
    });
    return html + '</div>';
  }

  function renderComparison() {
    if (!$('compareWeek') || !$('compareMonth')) return;
    $('compareWeek').innerHTML = compareBlockHtml(t('compareWeek'), periodStats(weekRange(0)), periodStats(weekRange(-1)));
    $('compareMonth').innerHTML = compareBlockHtml(t('compareMonth'), periodStats(monthRange(0)), periodStats(monthRange(-1)));
  }

  /* ---------- medidas corporales ---------- */
  var MEASURE_FIELDS = [
    { key: 'weight', label: 'labelWeight', mass: true },
    { key: 'waist', label: 'labelWaist', mass: false },
    { key: 'chest', label: 'labelChest', mass: false },
    { key: 'arms', label: 'labelArms', mass: false },
    { key: 'legs', label: 'labelLegs', mass: false }
  ];

  function loadMeasureUnit() {
    var raw = load(LS_MEASURE_UNIT);
    if (raw === 'lb' || (raw && raw.unit === 'lb')) return 'lb';
    return 'kg';
  }

  function saveMeasureUnit() {
    try { localStorage.setItem(LS_MEASURE_UNIT, measureUnit); } catch (e) {}
  }

  function convertMeasure(value, field, fromUnit, toUnit) {
    var n = num(value);
    if (!field.mass || fromUnit === toUnit) return n;
    return fromUnit === 'lb' ? (n * 0.45359237) : (n / 0.45359237);
  }

  function measuresAsc() {
    if (Storage.getMeasuresAsc) return Storage.getMeasuresAsc(measures);
    return Object.keys(measures).map(function (id) {
      var v = measures[id];
      return v ? { id: id, v: v } : null;
    }).filter(Boolean).sort(function (a, b) { return a.v.date < b.v.date ? -1 : (a.v.date > b.v.date ? 1 : 0); });
  }

  function measureSvg(points, unit) {
    if (points.length < 2) return '<p class="chart-empty">' + esc(t('measureChartEmpty')) + '</p>';
    var W = 600, H = 180, padX = 28, padY = 18;
    var values = points.map(function (p) { return p.value; });
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    if (min === max) { min -= 1; max += 1; }
    var range = max - min;
    var spanX = W - (padX * 2), spanY = H - (padY * 2);
    var coords = points.map(function (p, i) {
      return {
        x: padX + (points.length === 1 ? spanX / 2 : (i * spanX / (points.length - 1))),
        y: padY + spanY * (1 - (p.value - min) / range)
      };
    });
    var line = coords.map(function (c) { return c.x.toFixed(1) + ',' + c.y.toFixed(1); }).join(' ');
    var area = 'M ' + coords[0].x.toFixed(1) + ',' + (H - padY) + ' L ' + line + ' L ' +
      coords[coords.length - 1].x.toFixed(1) + ',' + (H - padY) + ' Z';
    var grid = [0, 0.5, 1].map(function (f) {
      var y = padY + (spanY * f);
      var val = max - (range * f);
      return '<line x1="' + padX + '" y1="' + y.toFixed(1) + '" x2="' + (W - padX) + '" y2="' + y.toFixed(1) +
        '" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 4"/>' +
        '<text x="' + padX + '" y="' + (y - 4).toFixed(1) + '" fill="var(--muted)" font-size="10">' + esc(fmt(val, 1)) + '</text>';
    }).join('');
    var dots = coords.map(function (c, i) {
      return '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="3.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="1.5">' +
        '<title>' + esc(fmtDate(points[i].date) + ': ' + fmt(points[i].value, 1) + ' ' + unit) + '</title></circle>';
    }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + attr(t('measureEvolution') + ' · ' + t('labelMeasureMetric')) + '">' +
      grid + '<path d="' + area + '" fill="var(--soft)" opacity=".7"/>' +
      '<polyline points="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots +
      '<text x="' + padX + '" y="' + (H - 3) + '" fill="var(--muted)" font-size="10" text-anchor="start">' + esc(fmtDate(points[0].date)) + '</text>' +
      '<text x="' + (W - padX) + '" y="' + (H - 3) + '" fill="var(--muted)" font-size="10" text-anchor="end">' + esc(fmtDate(points[points.length - 1].date)) + '</text>' +
      '</svg>';
  }

  function measureDeleteButton(id, date) {
    var label = esc(t('btnDelete') + ' ' + date);
    return '<div class="row-actions"><button type="button" class="icon-btn danger" data-del-measure="' + attr(id) +
      '" aria-label="' + label + '" title="' + esc(t('btnDelete')) + '">' + ICON_DELETE + '</button></div>';
  }

  function renderMeasures() {
    var unitSel = $('measureUnit');
    if (unitSel) unitSel.value = measureUnit;
    var dateEl = $('measureDate');
    if (dateEl && !dateEl.value) dateEl.value = todayIso();

    var list = measuresAsc();
    var last = list.length ? list[list.length - 1] : null;
    var prev = list.length > 1 ? list[list.length - 2] : null;

    var lastBox = $('measureLast');
    if (lastBox) {
      if (!last) {
        lastBox.innerHTML = '<p class="empty" style="padding:6px 0">' + esc(t('measureEmpty')) + '</p>';
      } else {
        var pills = MEASURE_FIELDS.filter(function (f) { return num(last.v[f.key]) > 0; }).map(function (f) {
          var unit = f.mass ? measureUnit : 'cm';
          var value = convertMeasure(last.v[f.key], f, last.v.unit || 'kg', measureUnit);
          var html = '<span class="measure-pill">' + esc(t(f.label)) + ': ' + fmt(value, 1) + ' ' + esc(unit) + '</span>';
          if (prev && num(prev.v[f.key]) > 0) {
            var before = convertMeasure(prev.v[f.key], f, prev.v.unit || 'kg', measureUnit);
            var diff = value - before;
            var cls = diff > 0 ? 'up' : (diff < 0 ? 'down' : '');
            if (diff !== 0) {
              html += '<span class="measure-pill ' + cls + '">' + (diff > 0 ? '+' : '') + fmt(diff, 1) + '</span>';
            }
          }
          return html;
        }).join('');
        lastBox.innerHTML = '<div class="measure-last-head"><strong>' + esc(t('measureLast')) + '</strong>' +
          '<span class="tag yes">' + esc(fmtDate(last.v.date)) + '</span></div>' +
          (pills ? '<div class="measure-pills">' + pills + '</div>' : '');
      }
    }

    var metricSel = $('measureMetric');
    if (metricSel) {
      var options = MEASURE_FIELDS.map(function (f) {
        var unit = f.mass ? measureUnit : 'cm';
        return '<option value="' + f.key + '"' + (measureMetric === f.key ? ' selected' : '') + '>' +
          esc(t(f.label) + ' (' + unit + ')') + '</option>';
      }).join('');
      if (metricSel.innerHTML !== options) metricSel.innerHTML = options;
    }

    var chartBox = $('measureChart');
    if (chartBox) {
      var field = MEASURE_FIELDS.filter(function (f) { return f.key === measureMetric; })[0] || MEASURE_FIELDS[0];
      var points = list.filter(function (it) { return num(it.v[field.key]) > 0; }).map(function (it) {
        return { date: it.v.date, value: convertMeasure(it.v[field.key], field, it.v.unit || 'kg', measureUnit) };
      });
      chartBox.innerHTML = measureSvg(points, field.mass ? measureUnit : 'cm');
    }

    var listBox = $('measureList');
    if (listBox) {
      if (!list.length) {
        listBox.innerHTML = '<p class="empty">' + esc(t('measureEmpty')) + '</p>';
      } else {
        listBox.innerHTML = list.slice().reverse().map(function (it) {
          var v = it.v;
          var main = '<span class="hist-date">' + esc(fmtDate(v.date)) + '</span>' +
            '<span class="hist-metrics">' + MEASURE_FIELDS.filter(function (f) { return num(v[f.key]) > 0; }).map(function (f) {
              var value = convertMeasure(v[f.key], f, v.unit || 'kg', measureUnit);
              return histPill(t(f.label) + ' ' + fmt(value, 1) + (f.mass ? ' ' + measureUnit : ' cm'));
            }).join('') + '</span>';
          return histCard(main, '', measureDeleteButton(it.id, fmtDate(v.date)));
        }).join('');
      }
    }
  }

  function handlePlanEvents() {
    if ($('calPrev')) $('calPrev').addEventListener('click', function () {
      var base = calMonth || new Date(today().getFullYear(), today().getMonth(), 1, 12);
      calMonth = new Date(base.getFullYear(), base.getMonth() - 1, 1, 12);
      renderCalendar();
    });
    if ($('calNext')) $('calNext').addEventListener('click', function () {
      var base = calMonth || new Date(today().getFullYear(), today().getMonth(), 1, 12);
      calMonth = new Date(base.getFullYear(), base.getMonth() + 1, 1, 12);
      renderCalendar();
    });
    if ($('calGrid')) $('calGrid').addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('[data-cal-date]') : null;
      if (!btn) return;
      selectedCalDate = btn.getAttribute('data-cal-date');
      renderCalendar();
    });
    if ($('calDayPlanSelect')) $('calDayPlanSelect').addEventListener('change', function (e) {
      if (!selectedCalDate) return;
      savePlanValue('dates', selectedCalDate, e.target.value);
      render();
    });
    if ($('calDayClear')) $('calDayClear').addEventListener('click', function () {
      if (!selectedCalDate) return;
      delete weeklyPlan.dates[selectedCalDate];
      if (Storage.savePlan) Storage.savePlan(weeklyPlan); else save(LS_PLAN, weeklyPlan);
      render();
    });
    if ($('weekPlan')) $('weekPlan').addEventListener('change', function (e) {
      var sel = e.target && e.target.closest ? e.target.closest('[data-week-day]') : null;
      if (!sel) return;
      savePlanValue('weekdays', sel.getAttribute('data-week-day'), sel.value);
      render();
    });
    if ($('btnTodayPlanGo')) $('btnTodayPlanGo').addEventListener('click', function () {
      var mode = this.getAttribute('data-plan-target') || 'plan';
      showTab(mode === 'cardio' ? 'cardio' :
        (mode === 'pesas' || mode === 'routine' || mode === 'combo' ? 'pesas' : 'plan'));
    });
    if ($('measureUnit')) $('measureUnit').addEventListener('change', function (e) {
      measureUnit = e.target.value === 'lb' ? 'lb' : 'kg';
      saveMeasureUnit();
      renderMeasures();
    });
    if ($('measureMetric')) $('measureMetric').addEventListener('change', function (e) {
      measureMetric = e.target.value;
      renderMeasures();
    });
    if ($('measureForm')) $('measureForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var ids = ['measureWeight', 'measureWaist', 'measureChest', 'measureArms', 'measureLegs'];
      var payload = { date: $('measureDate').value, unit: measureUnit };
      var any = false;
      ids.forEach(function (id) {
        var el = $(id);
        if (!el || el.value === '') return;
        var n = num(el.value);
        if (n > 0) { payload[id.replace('measure', '').toLowerCase()] = n; any = true; }
      });
      if (!any) { say('measureMsg', t('measureMissing'), true); return; }
      if (Storage.addMeasure) Storage.addMeasure(measures, payload);
      else {
        var id = payload.date + '-' + Math.random().toString(36).slice(2, 8);
        payload.ts = Date.now();
        measures[id] = payload;
        save(LS_MEASURES, measures);
      }
      ids.forEach(function (id) { $(id).value = ''; });
      $('measureDate').value = todayIso();
      render();
      say('measureMsg', t('measureSaved'));
    });
  }

  /* ---------- cardio ---------- */
  function renderCardioConfigPanel() {
    var goalSel = $('cardioCfgGoal');
    if (goalSel && goalSel.value !== cardioConfig.goal) goalSel.value = cardioConfig.goal;

    var badge = $('cardioCfgBadge');
    if (badge) {
      badge.textContent = getCardioGoalName(cardioConfig.goal) + ' · ' + cardioConfig.equipment.length + ' ' + t('cardioEquipBadgeSuffix');
    }

    var chipsBox = $('cardioEquipChips');
    if (chipsBox) {
      chipsBox.innerHTML = CARDIO_EQUIPMENT_INFO.map(function (item) {
        var on = cardioConfig.equipment.indexOf(item.id) >= 0;
        return '<label class="equip-chip' + (on ? ' active' : '') + '" data-cardio-equip="' + item.id + '">' +
          '<input type="checkbox"' + (on ? ' checked' : '') + '><span>' + esc(t(item.i18nKey)) + '</span></label>';
      }).join('');
    }
  }

  window.prefillCardio = function (equipId) {
    var goalKey = cardioConfig.goal;
    var goalDef = CARDIO_GOALS[goalKey] || CARDIO_GOALS.fat_loss;
    var equipName = getCardioEquipmentName(equipId, curLang);

    syncDateMirrors(currentDate());

    var actSel = $('cardioActivity');
    if (actSel) {
      var hasOpt = false;
      for (var i = 0; i < actSel.options.length; i++) {
        if (actSel.options[i].value === equipId) {
          hasOpt = true;
          break;
        }
      }
      if (!hasOpt) {
        var opt = document.createElement('option');
        opt.value = equipId;
        opt.textContent = equipName;
        actSel.appendChild(opt);
      }
      actSel.value = equipId;
    }

    if ($('minutes')) $('minutes').value = goalDef.defaultMinutes;
    if ($('cardioIntensity')) $('cardioIntensity').value = goalDef.defaultIntensity;
    if ($('steps')) {
      $('steps').value = goalDef.defaultSteps || '';
    }
    if ($('ex')) $('ex').checked = true;
    // El detalle se construye solo con los selectores; las notas quedan libres.
    applyCardioDetailState(null);
    if ($('entreno')) $('entreno').value = '';

    showTab('cardio');
    var f = $('f');
    if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () {
      if ($('minutes')) $('minutes').focus();
    }, 250);
  };

  function renderSuggestedCardio() {
    var body = $('cardioSuggestedBody');
    if (!body) return;

    var goalKey = cardioConfig.goal;
    var goalDef = CARDIO_GOALS[goalKey] || CARDIO_GOALS.fat_loss;

    var goalBadge = $('cardioGoalBadge');
    if (goalBadge) goalBadge.textContent = getCardioGoalName(goalKey);

    var targetBadge = $('cardioTargetBadge');
    if (targetBadge) {
      var targetText = t(goalDef.targetKey);
      targetBadge.textContent = targetText || (goalDef.targetDuration + ' · ' + getIntensityLabel(goalDef.targetIntensity));
    }

    var goalDesc = t(goalDef.descKey);
    var descHtml = '<div class="today-rest-box" style="margin-top:10px"><p style="margin:0;font-size:13px;color:var(--fg)">' + esc(goalDesc) + '</p></div>';

    if (!cardioConfig.equipment.length) {
      body.innerHTML = descHtml + '<p class="msg" style="margin:12px 0 4px">' + esc(t('noCardioEquipAvailable')) + '</p>';
      return;
    }

    var rowsHtml = cardioConfig.equipment.map(function (equipId) {
      var equipName = getCardioEquipmentName(equipId, curLang);
      var protoText = getCardioProtocolText(equipId, goalKey, curLang);
      var targetStr = goalDef.targetDuration + ' · ' + getIntensityLabel(goalDef.targetIntensity);

      return '<div class="today-ex-row">' +
        '<div class="today-ex-left">' +
          '<div class="today-ex-title">' + esc(equipName) + '</div>' +
          (protoText ? '<div class="today-ex-meta">' + esc(protoText) + '</div>' : '') +
        '</div>' +
        '<div class="today-ex-right">' +
          '<span class="today-ex-target">' + esc(targetStr) + '</span>' +
          '<button type="button" class="btn-quick-log" onclick="window.prefillCardio(\'' + esc(equipId) + '\')">' + esc(t('btnLogExercise')) + '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML = descHtml + '<div class="today-ex-list">' + rowsHtml + '</div>';
  }

  function renderCardioActivitySelect() {
    var sel = $('cardioActivity');
    if (!sel) return;
    var currentVal = sel.value;

    var activeList = cardioConfig.equipment.length ? cardioConfig.equipment : CARDIO_PRESETS.all;

    var optionsHtml = activeList.map(function (id) {
      var name = getCardioEquipmentName(id, curLang);
      var isSel = (id === currentVal) ? ' selected' : '';
      return '<option value="' + esc(id) + '"' + isSel + '>' + esc(name) + '</option>';
    }).join('');

    if (currentVal && currentVal !== 'otro' && activeList.indexOf(currentVal) < 0) {
      optionsHtml = '<option value="' + esc(currentVal) + '" selected>' + esc(getCardioEquipmentName(currentVal, curLang)) + '</option>' + optionsHtml;
    }

    optionsHtml += '<option value="otro"' + (currentVal === 'otro' ? ' selected' : '') + '>' + esc(t('optOtherCardio')) + '</option>';
    sel.innerHTML = optionsHtml;
  }

  function renderDays() {
    var tDay = today(), ts = iso(tDay), keys = Object.keys(days).sort(), i, s;

    // semana actual
    var monday = addDays(tDay, -dow(tDay)), strip = '', letters = t('weekLetters') || ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    for (i = 0; i < 7; i++) {
      var d = addDays(monday, i); s = iso(d);
      var on = did(s);
      strip += '<div class="wd"><div class="dot' + (on ? ' on' : '') + (s === ts ? ' today' : '') + (d > tDay ? ' future' : '') + '">' + (on ? '✓' : '') + '</div>' + (letters[i] || '') + '</div>';
    }
    $('week').innerHTML = strip;

    // racha
    var streak = 0, c = did(ts) ? tDay : addDays(tDay, -1);
    while (did(iso(c))) { streak++; c = addDays(c, -1); }

    var all = keys.map(function (k) { return days[k]; });
    var trained = all.filter(function (r) { return r.exercised; }).length;
    var km = all.reduce(function (a, r) { return a + num(r.km); }, 0);
    var kcal = all.reduce(function (a, r) { return a + num(r.kcal); }, 0);
    var steps = all.reduce(function (a, r) { return a + num(r.steps); }, 0);
    var mins = all.reduce(function (a, r) { return a + num(r.minutes); }, 0);
    var withMeals = all.filter(hasMealContent).length;

    $('stats').innerHTML =
      tile(streak, streak === 1 ? t('streak1') : t('streakN')) +
      tile(trained, trained === 1 ? t('cardioSession1') : t('cardioSessionN')) +
      tile(fmt(km, 2), t('totalKm')) +
      tile(fmt(kcal, 0), t('activeKcal')) +
      tile(fmt(steps, 0), t('steps')) +
      tile(fmt(mins, 0), t('cardioMinutes')) +
      tile(withMeals, withMeals === 1 ? t('mealsLogged1') : t('mealsLoggedN'));

    var lastDetailEl = $('lastCardioDetail');
    if (lastDetailEl) {
      var lastRecord = null;
      for (var li = keys.length - 1; li >= 0; li--) {
        if (days[keys[li]].entreno) { lastRecord = days[keys[li]]; break; }
      }
      if (lastRecord) {
        lastDetailEl.textContent = t('cdLastSession') + ': ' + (compactCardioSummary(lastRecord) || lastRecord.entreno || '');
        lastDetailEl.hidden = false;
      } else {
        lastDetailEl.textContent = '';
        lastDetailEl.hidden = true;
      }
    }

    // historial: una tarjeta compacta por día (máximo dos filas)
    if (!keys.length) { $('hist').innerHTML = '<p class="empty">' + esc(t('emptyHist')) + '</p>'; return; }
    var cards = keys.slice().reverse().map(function (k) {
      var r = days[k];
      var metrics = [];
      if (num(r.km)) metrics.push(histPill(fmt(num(r.km), 2) + ' ' + t('thKm')));
      if (num(r.kcal)) metrics.push(histPill(fmt(num(r.kcal), 0) + ' ' + t('thKcal')));
      if (num(r.steps)) metrics.push(histPill(fmt(num(r.steps), 0) + ' ' + t('steps')));
      if (num(r.minutes)) metrics.push(histPill(fmt(num(r.minutes), 0) + ' ' + t('thMin').toLowerCase()));
      var main = '<span class="hist-date">' + esc(fmtDate(k)) + '</span>' +
        '<span class="tag ' + (r.exercised ? 'yes' : 'no') + '">' + esc(r.exercised ? t('statusWorked') : t('statusRest')) + '</span>' +
        (metrics.length ? '<span class="hist-metrics">' + histMetricList(metrics) + '</span>' : '');
      var detail = histDetailText(compactCardioSummary(r), compactMealHtml(r));
      return histCard(main, histDetail(detail), actionButtons('day', k, fmtDate(k)));
    }).join('');
    $('hist').innerHTML = cards;
  }

  var TEXT_IDS = ['entreno', 'desayuno', 'almuerzo', 'merienda', 'cena', 'otros'];
  function clearForm(keepDate) {
    if (!keepDate) setWorkoutDate(todayIso(), { load: false });
    var date = currentDate();
    syncDateMirrors(date);
    ['km', 'kcal', 'steps', 'minutes'].concat(TEXT_IDS).forEach(function (id) { $(id).value = ''; });
    $('ex').checked = true;
    if ($('cardioIntensity')) $('cardioIntensity').value = 'moderada';
    if ($('cardioActivity') && $('cardioActivity').options.length) {
      $('cardioActivity').selectedIndex = 0;
    }
    applyCardioDetailState(null);
    if ($('gtype') && $('gtype').options.length) $('gtype').selectedIndex = 0;
    if ($('liftMuscleSelect')) $('liftMuscleSelect').value = 'all';
    if ($('gex')) $('gex').value = '';
    renderLiftExerciseSelect({ keepSelection: false });
    var goalDef = GOALS[routineConfig.goal] || GOALS.hypertrophy;
    if ($('gsets')) $('gsets').value = goalDef.defaultSets;
    if ($('greps')) $('greps').value = goalDef.defaultReps;
    if ($('gkg')) $('gkg').value = '';
    var lastRecordNote = $('gLastRecordNote');
    if (lastRecordNote) lastRecordNote.style.display = 'none';
    say('msg', '');
  }
  function fillForm(k, opts) {
    opts = opts || {};
    var r = days[k]; if (!r) return;
    if ($('workoutDate') && currentDate() !== k) {
      $('workoutDate').value = k;
      updateWorkoutDateUI();
    }
    syncDateMirrors(k);
    ['km', 'kcal', 'steps', 'minutes'].forEach(function (id) { $(id).value = r[id] == null ? '' : r[id]; });
    TEXT_IDS.forEach(function (id) {
      // `entreno` guarda el detalle compuesto; las notas van en `notes`.
      // Los registros antiguos sin `notes` mantienen su texto libre como nota.
      $(id).value = id === 'entreno' ? (r.notes != null ? r.notes : (r.entreno || '')) : (r[id] || '');
    });
    $('ex').checked = !!r.exercised;
    if ($('cardioIntensity')) {
      $('cardioIntensity').value = r.intensity || 'moderada';
    }
    if ($('cardioActivity')) {
      if (r.activity) {
        var actSel = $('cardioActivity');
        var hasOpt = false;
        for (var i = 0; i < actSel.options.length; i++) {
          if (actSel.options[i].value === r.activity) {
            hasOpt = true;
            break;
          }
        }
        if (!hasOpt) {
          var opt = document.createElement('option');
          opt.value = r.activity;
          opt.textContent = getCardioEquipmentName(r.activity, curLang);
          actSel.insertBefore(opt, actSel.firstChild);
        }
        actSel.value = r.activity;
      } else {
        $('cardioActivity').selectedIndex = 0;
      }
    }
    applyCardioDetailState(r.detailFields || null);
    var msgKey = isPastDate(k) ? 'editingPastDay' : 'editingDay';
    say('msg', t(msgKey).replace('{date}', fmtDate(k)));
    if (opts.scroll !== false) $('f').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  $('f').addEventListener('submit', function (e) {
    e.preventDefault();
    var date = currentDate(); if (!date) return;
    syncDateMirrors(date);
    var actId = $('cardioActivity') ? $('cardioActivity').value : '';
    var detailValues = collectDetailValues();
    var detailText = actId ? composeCardioDetail(actId, detailValues, curLang) : '';
    var notes = $('entreno') ? $('entreno').value.trim() : '';
    var r = {
      date: date,
      exercised: $('ex').checked,
      activity: actId,
      intensity: $('cardioIntensity') ? $('cardioIntensity').value : 'moderada',
      km: num($('km').value),
      kcal: num($('kcal').value),
      steps: num($('steps').value),
      minutes: num($('minutes').value),
      // El detalle compuesto se guarda en `entreno` para que historial y
      // estadísticas lo muestren sin cambios; `notes` conserva el texto extra.
      detailFields: { activity: actId, values: detailValues },
      entreno: detailText + (notes ? (detailText ? ' · ' : '') + notes : '')
    };
    if (notes) r.notes = notes;
    TEXT_IDS.forEach(function (id) {
      if (id === 'entreno') return;
      var v = $(id).value.trim(); if (v) r[id] = v;
    });
    var wasEditingDay = editing && editing.type === 'day' ? editing.key : null;
    if (wasEditingDay) {
      // Actualiza la clave exacta (y la mueve si se cambió la fecha al editar).
      if (Storage.updateDay) {
        Storage.updateDay(days, wasEditingDay, date, r);
      } else {
        if (wasEditingDay !== date) delete days[wasEditingDay];
        days[date] = r;
        save(LS_DAYS, days);
      }
    } else if (Storage.saveDay) {
      Storage.saveDay(days, date, r);
    } else {
      days[date] = r;
      save(LS_DAYS, days);
    }
    if (editing && !wasEditingDay) setEditing(null);
    if (wasEditingDay) setEditing(null);
    clearForm(true);
    render();
    updateWorkoutDateUI();
    say('msg', t('savedDay').replace('{date}', fmtDate(date)));
  });

  $('reset').addEventListener('click', function () { clearForm(); });

  if ($('workoutDate')) {
    $('workoutDate').addEventListener('change', function () { setWorkoutDate(this.value, { scroll: false }); });
  }
  if ($('btnToday')) {
    $('btnToday').addEventListener('click', function () { setWorkoutDate(todayIso(), { scroll: false }); });
  }

  // Las acciones de historial se delegan en handleHistoryAction (ver arriba).

  if ($('cardioCfgGoal')) {
    $('cardioCfgGoal').addEventListener('change', function () {
      cardioConfig.goal = this.value;
      saveCardioConfig();
      renderCardioConfigPanel();
      renderSuggestedCardio();
      renderPlanViews();
    });
  }

  if ($('btnCardioAllGym')) {
    $('btnCardioAllGym').addEventListener('click', function () {
      cardioConfig.equipment = CARDIO_PRESETS.all.slice();
      saveCardioConfig();
      renderCardioConfigPanel();
      renderSuggestedCardio();
      renderCardioActivitySelect();
      renderPlanViews();
    });
  }

  if ($('btnCardioHomeOutdoor')) {
    $('btnCardioHomeOutdoor').addEventListener('click', function () {
      cardioConfig.equipment = CARDIO_PRESETS.home_outdoor.slice();
      saveCardioConfig();
      renderCardioConfigPanel();
      renderSuggestedCardio();
      renderCardioActivitySelect();
      renderPlanViews();
    });
  }

  if ($('cardioEquipChips')) {
    $('cardioEquipChips').addEventListener('click', function (e) {
      var chip = e.target.closest('.equip-chip');
      if (!chip) return;
      var equipId = chip.getAttribute('data-cardio-equip');
      if (!equipId) return;
      var idx = cardioConfig.equipment.indexOf(equipId);
      if (idx >= 0) {
        if (cardioConfig.equipment.length > 1) {
          cardioConfig.equipment.splice(idx, 1);
        }
      } else {
        cardioConfig.equipment.push(equipId);
      }
      saveCardioConfig();
      renderCardioConfigPanel();
      renderSuggestedCardio();
      renderCardioActivitySelect();
      renderPlanViews();
    });
  }

  if ($('btnQuickFillCardio')) {
    $('btnQuickFillCardio').addEventListener('click', function () {
      if (cardioConfig.equipment.length) {
        window.prefillCardio(cardioConfig.equipment[0]);
      } else {
        say('msg', t('noCardioEquipAvailable'), true);
      }
    });
  }

  if ($('cardioActivity')) {
    $('cardioActivity').addEventListener('change', function () {
      renderCardioDetailBuilder();
    });
  }

  if ($('cardioDetailBuilder')) {
    $('cardioDetailBuilder').addEventListener('change', function (e) {
      var sel = e.target;
      if (!sel || !sel.id || sel.tagName !== 'SELECT') return;
      detailState[sel.id] = sel.value;
      var values = collectDetailValues();
      var group = getDetailGroup($('cardioActivity') ? $('cardioActivity').value : '');
      (CARDIO_DETAIL_FIELDS[group] || []).forEach(function (f) {
        var fieldEl = $(f.id + 'Field');
        if (fieldEl) fieldEl.hidden = !isDetailFieldVisible(f, values);
      });
      updateCardioDetailPreview();
    });
  }

  /* ---------- pesas ---------- */
  function syncTimerToGoal(goalKey) {
    var goalDef = GOALS[goalKey] || GOALS.hypertrophy;
    var sec = goalDef.rest;
    timerPreset = sec;
    if (!timerRunning) {
      timerLeft = sec;
      clearTimerRinging();
      updateTimerUI();
    }
    var btnSync = $('btnSyncTimerText');
    if (btnSync) btnSync.textContent = sec + 's ' + t('timerRest').toLowerCase();
    var restBadge = $('todayRestBadge');
    if (restBadge) restBadge.textContent = t('suggestedRestLabel') + ': ' + sec + 's';
  }

  function updateConfigBadge() {
    var badge = $('cfgBadge');
    if (badge) {
      badge.textContent = getGoalName(routineConfig.goal) + ' · ' + getSplitName(routineConfig.split);
    }
    var todayBadge = $('todaySplitBadge');
    if (todayBadge) {
      todayBadge.textContent = getSplitName(routineConfig.split) + ' · ' + getGoalName(routineConfig.goal);
    }
  }

  function renderConfigPanel() {
    var goalSel = $('cfgGoal');
    if (goalSel && goalSel.value !== routineConfig.goal) goalSel.value = routineConfig.goal;
    var splitSel = $('cfgSplit');
    if (splitSel && splitSel.value !== routineConfig.split) splitSel.value = routineConfig.split;

    updateConfigBadge();

    var chipsBox = $('equipChips');
    if (chipsBox) {
      chipsBox.innerHTML = EQUIPMENT_INFO.map(function (item) {
        var on = routineConfig.equipment.indexOf(item.id) >= 0;
        return '<label class="equip-chip' + (on ? ' active' : '') + '" data-equip="' + item.id + '">' +
          '<input type="checkbox"' + (on ? ' checked' : '') + '><span>' + esc(t(item.i18nKey)) + '</span></label>';
      }).join('');
    }
  }

  window.prefillExercise = function (key) {
    var exObj = EX_NAME_MAP[key];
    var name = getExerciseName(key, curLang);
    if (!exObj) {
      if ($('liftExerciseSelect')) $('liftExerciseSelect').value = CUSTOM_EXERCISE_VALUE;
      if ($('gex')) $('gex').value = name;
      updateCustomExerciseVisibility();
    } else {
      var groups = getExerciseLiftGroups(exObj);
      if ($('gtype')) $('gtype').value = groups[0] || 'casa';
      if ($('liftMuscleSelect')) $('liftMuscleSelect').value = getLiftMuscleFilter(exObj);
      renderLiftExerciseSelect({ exerciseKey: key, keepSelection: false });
      if ($('gex')) $('gex').value = '';
      updateCustomExerciseVisibility();
    }
    syncDateMirrors(currentDate());
    autocompleteLastRecord(name, { keepEquipment: true });
    showTab('pesas');
    var gf = $('gf');
    if (gf) gf.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () {
      if ($('gkg')) $('gkg').focus();
    }, 250);
  };

  function renderTodayRoutine() {
    var body = $('todayRoutineBody');
    if (!body) return;

    var wd = dow(today());
    var split = routineConfig.split;
    var goal = routineConfig.goal;
    var dayNames = t('dayNames') || [];
    var planEntry = resolvePlanEntry(todayIso());

    updateConfigBadge();

    var goalDef = GOALS[goal] || GOALS.hypertrophy;
    var restBadge = $('todayRestBadge');
    if (restBadge) restBadge.textContent = t('suggestedRestLabel') + ': ' + goalDef.rest + 's';
    var btnSync = $('btnSyncTimerText');
    if (btnSync) btnSync.textContent = goalDef.rest + 's ' + t('timerRest').toLowerCase();

    // Bloque de cardio de la pestaña Cardio; se añade al final cuando el día
    // combina pesas y cardio (o sustituye a las pesas cuando solo toca cardio).
    function cardioBoxHtml(part) {
      var goalKey = (part && part.goal) || cardioConfig.goal;
      var goalName = getCardioGoalName(goalKey);
      var detail = cardioPlanDetail(3);
      return '<div class="today-rest-box" style="margin-top:10px">' +
        '<h3 style="color:var(--fg);font-size:15px;margin:0">' +
          esc((dayNames[wd] || '') + ' · ' + ((part && part.name) || cardioPlanName())) + '</h3>' +
        '<p class="msg" style="margin:4px 0 0">' + esc(t('planCardioAssigned') + ': ' + goalName + (detail ? ' · ' + detail : '')) + '</p>' +
        '<button type="button" class="btn-quick-log" style="margin-top:8px" onclick="window.PulseFit.showTab(\'cardio\')">' +
          esc(t('tabCardio')) + '</button>' +
        '</div>';
    }

    if (planEntry.mode === 'cardio') {
      body.innerHTML = cardioBoxHtml(planEntry.parts.cardio);
      return;
    }

    if (planEntry.mode === 'rest') {
      var note = (t('splitNotes') && t('splitNotes')[split]) || t('rtNote');
      body.innerHTML =
        '<div class="today-rest-box">' +
          '<h3 style="color:var(--fg);font-size:15px;margin:0">' + esc((dayNames[wd] || '') + ' · ' + t('todayRestDayTitle')) + '</h3>' +
          '<p class="msg" style="margin:4px 0 0">' + esc(t('todayRestDayDesc')) + '</p>' +
          '<p class="msg" style="margin:4px 0 0;color:var(--accent);font-size:13px">' + esc(note) + '</p>' +
        '</div>';
      return;
    }

    var weightsPart = (planEntry.parts && planEntry.parts.weights) || null;
    var exSplit = (weightsPart && weightsPart.split) || split;
    var exDay = (weightsPart && weightsPart.dayKey != null) ? weightsPart.dayKey : wd;
    if (!SPLIT_DAYS[exSplit]) { exSplit = split; exDay = wd; }
    var sess = getSplitSessionInfo(exSplit, exDay) || {};
    var dayExs = getDayExercises(exSplit, exDay, routineConfig.equipment, goal);
    var assigned = !!(weightsPart && weightsPart.assigned);
    var displayName = (weightsPart && weightsPart.name) || sess.name || t('planRoutine');
    var subText = assigned ? t('planAssignedNote') : (sess.sub || '');
    var dayHeaderHtml = '<div style="margin-bottom:6px"><h3 style="color:var(--fg);font-size:15px;margin:0">' +
      esc((dayNames[wd] || '') + ' · ' + displayName) + '</h3><p class="rt-sub" style="margin:2px 0 6px">' +
      esc(subText) + '</p></div>';

    var html;
    if (!dayExs.length) {
      var emptyNote = assigned ? (t('planAssignedNote') + ' · ' + t('btnViewRoutine')) : t('noExercisesAvailable');
      html = dayHeaderHtml + '<p class="msg" style="margin:6px 0">' + esc(emptyNote) + '</p>';
    } else {
      var rowsHtml = dayExs.map(function (ex) {
        var exObj = EX_NAME_MAP[ex.key];
        var exName = getExerciseName(ex.key, curLang);
        var muscleStr = exObj ? getMuscleName(exObj.muscle) : '';
        var equipStr = exObj && exObj.equipment && exObj.equipment.length ? exObj.equipment.map(getEquipmentName).join(' + ') : '';
        var metaStr = [muscleStr, equipStr].filter(Boolean).join(' · ');
        var repUnits = t('repUnits') || {};
        var unitSuffix = ex.perSide && repUnits.perSide ? ' ' + repUnits.perSide : '';
        var targetStr = ex.setsReps + unitSuffix;

        return '<div class="today-ex-row">' +
          '<div class="today-ex-left">' +
            '<div class="today-ex-title">' + esc(exName) + '</div>' +
            (metaStr ? '<div class="today-ex-meta">' + esc(metaStr) + '</div>' : '') +
          '</div>' +
          '<div class="today-ex-right">' +
            '<span class="today-ex-target">' + esc(targetStr) + '</span>' +
            '<button type="button" class="btn-quick-log" onclick="window.prefillExercise(\'' + esc(ex.key) + '\')">' + esc(t('btnLogExercise')) + '</button>' +
          '</div>' +
        '</div>';
      }).join('');
      html = dayHeaderHtml + '<div class="today-ex-list">' + rowsHtml + '</div>';
    }

    if (planEntry.parts && planEntry.parts.cardio) html += cardioBoxHtml(planEntry.parts.cardio);
    body.innerHTML = html;
  }

  function renderRoutine() {
    var wd = dow(today());
    var split = routineConfig.split;
    var goal = routineConfig.goal;
    var splitDays = SPLIT_DAYS[split] || [0];
    var isRestToday = splitDays.indexOf(wd) < 0;

    var sessToday = getSplitSessionInfo(split, wd);
    var headTemplate = isRestToday ? t('rtRest') : t('rtToday');
    $('rtHead').textContent = headTemplate.replace('{name}', sessToday.name);

    var note = (t('splitNotes') && t('splitNotes')[split]) || t('rtNote');
    $('rtNote').textContent = note;

    var dayNames = t('dayNames') || [];
    var repUnits = t('repUnits') || {};

    $('rtGrid').innerHTML = splitDays.map(function (k) {
      var sess = getSplitSessionInfo(split, k);
      var dayTitle = (dayNames[k] || '') + ' · ' + sess.name;
      var items = getDayExercises(split, k, routineConfig.equipment, goal);
      var itemsHtml = '';
      if (!items.length) {
        itemsHtml = '<li style="color:var(--muted);list-style:none">' + esc(t('noExercisesAvailable')) + '</li>';
      } else {
        itemsHtml = items.map(function (it) {
          var exName = getExerciseName(it.key, curLang);
          var unitSuffix = it.perSide && repUnits.perSide ? ' ' + repUnits.perSide : '';
          return '<li>' + esc(exName) + ' <span>' + esc(it.setsReps + unitSuffix) + '</span></li>';
        }).join('');
      }
      return '<div class="rt' + (wd === k ? ' today' : '') + '"><h3>' + esc(dayTitle) + '</h3><p class="rt-sub">' + esc(sess.sub) + '</p><ul>' + itemsHtml + '</ul></div>';
    }).join('');
  }

  function renderLifts() {
    var box = $('gHist'), marks = $('gMarks');
    var list = Object.keys(lifts).map(function (id) { return { id: id, v: lifts[id] }; }).filter(function (it) { return it.v; });
    if (!list.length) {
      box.innerHTML = '<p class="empty">' + esc(t('emptyLifts')) + '</p>';
      marks.innerHTML = '<p class="empty">' + esc(t('emptyMarks')) + '</p>';
      return;
    }
    list.sort(function (a, b) { return a.v.date < b.v.date ? 1 : a.v.date > b.v.date ? -1 : (a.v.ts || 0) - (b.v.ts || 0); });
    box.innerHTML = list.map(function (it) {
      var v = it.v, date = liftDate(v);
      var metrics = [histPill(fmt(num(v.series), 0) + '×' + fmt(num(v.reps), 0)), histPill(fmt(num(v.kg), 1) + ' kg')];
      var main = '<span class="hist-date">' + esc(fmtDate(date)) + '</span>' +
        '<span class="tag yes">' + esc(t('statusWorked')) + '</span>' +
        '<span class="hist-metrics">' + histMetricList(metrics) + '</span>';
      var detail = histDetailText(String(v.ejercicio || '') + ' · ' + getTypeLabel(v.tipo), '');
      return histCard(main, histDetail(detail), actionButtons('lift', it.id, v.ejercicio));
    }).join('');

    var best = {};
    list.forEach(function (it) {
      var v = it.v, k = String(v.ejercicio).trim().toLowerCase(), b = best[k], kg = num(v.kg);
      if (!b || kg > b.kg || (kg === b.kg && v.date > b.date)) best[k] = { name: v.ejercicio, kg: kg, reps: num(v.reps), date: v.date };
    });
    marks.innerHTML = Object.keys(best).sort().map(function (k) {
      var b = best[k];
      var main = '<span class="hist-date">' + esc(b.name) + '</span>' +
        '<span class="hist-metrics">' + histMetricList([
          histPill(fmt(b.kg, 1) + ' kg', 'accent'),
          histPill(fmt(b.reps, 0) + ' ' + t('thReps'))
        ]) + '</span>' +
        '<span class="hist-pill">' + esc(fmtDate(b.date)) + '</span>';
      return histCard(main, '', '');
    }).join('');
  }

  function renderGymTotals() {
    var dates = {}, names = {}, sets = 0, reps = 0, vol = 0, top = 0;
    Object.keys(lifts).forEach(function (id) {
      var v = lifts[id]; if (!v) return;
      var s = num(v.series), r = num(v.reps), k = num(v.kg);
      dates[v.date] = 1; names[String(v.ejercicio).trim().toLowerCase()] = 1;
      sets += s; reps += s * r; vol += s * r * k; if (k > top) top = k;
    });
    var nd = Object.keys(dates).length, ne = Object.keys(names).length;
    $('gstats').innerHTML =
      tile(nd, nd === 1 ? t('liftDay1') : t('liftDayN')) +
      tile(fmt(sets, 0), t('sets')) +
      tile(fmt(reps, 0), t('reps')) +
      tile(fmt(vol, 0) + ' kg', t('totalVolume')) +
      tile(ne, ne === 1 ? t('distinctEx1') : t('distinctExN')) +
      tile(fmt(top, 1) + ' kg', t('maxWeight'));
  }

  // Historial combinado de la pestaña Total: cada fila lleva sus propias acciones.
  function renderTotalHistory() {
    var box = $('allHist');
    if (!box) return;
    var rows = [];

    Object.keys(days).forEach(function (date) {
      var r = days[date];
      if (!r) return;
      var summary = compactCardioSummary(r);
      var metrics = [];
      if (num(r.km)) metrics.push(histPill(fmt(num(r.km), 2) + ' ' + t('thKm')));
      if (num(r.kcal)) metrics.push(histPill(fmt(num(r.kcal), 0) + ' ' + t('thKcal')));
      if (num(r.minutes)) metrics.push(histPill(fmt(num(r.minutes), 0) + ' ' + t('thMin').toLowerCase()));
      var main = '<span class="hist-date">' + esc(fmtDate(date)) + '</span>' +
        '<span class="tag ' + (r.exercised ? 'yes' : 'no') + '">' + esc(r.exercised ? t('statusWorked') : t('statusRest')) + '</span>' +
        '<span class="tag kind">' + esc(t('tabCardio')) + '</span>' +
        (metrics.length ? '<span class="hist-metrics">' + histMetricList(metrics) + '</span>' : '');
      rows.push({
        date: date,
        ts: 0,
        html: histCard(main, histDetail(histDetailText(summary, compactMealHtml(r))), actionButtons('day', date, summary || fmtDate(date)))
      });
    });

    Object.keys(lifts).forEach(function (id) {
      var v = lifts[id];
      if (!v) return;
      var date = liftDate(v);
      var name = String(v.ejercicio || '');
      var metrics = [histPill(fmt(num(v.series), 0) + '×' + fmt(num(v.reps), 0)), histPill(fmt(num(v.kg), 1) + ' kg')];
      var main = '<span class="hist-date">' + esc(fmtDate(date)) + '</span>' +
        '<span class="tag yes">' + esc(t('statusWorked')) + '</span>' +
        '<span class="tag kind">' + esc(t('tabWeights')) + '</span>' +
        '<span class="hist-metrics">' + histMetricList(metrics) + '</span>';
      rows.push({
        date: date,
        ts: num(v.ts),
        html: histCard(main, histDetail(histDetailText(name + ' · ' + getTypeLabel(v.tipo), '')), actionButtons('lift', id, name))
      });
    });

    if (!rows.length) {
      box.innerHTML = '<p class="empty">' + esc(t('emptyAllHist')) + '</p>';
      return;
    }
    rows.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return b.ts - a.ts;
    });
    box.innerHTML = rows.map(function (r) { return r.html; }).join('');
  }

  function autocompleteLastRecord(rawName, opts) {
    opts = opts || {};
    var noteEl = $('gLastRecordNote');
    if (!rawName) {
      if (noteEl) noteEl.style.display = 'none';
      return;
    }
    if (rawName === t('optCustomExercise') || rawName === t('optOtherExercise')) {
      $('gex').value = '';
      if (noteEl) noteEl.style.display = 'none';
      return;
    }
    var canKey = getCanonicalExerciseKey(rawName);
    var matchLifts = [];
    Object.keys(lifts).forEach(function (id) {
      var r = lifts[id];
      if (!r || !r.ejercicio) return;
      if (getCanonicalExerciseKey(r.ejercicio) === canKey || String(r.ejercicio).trim().toLowerCase() === rawName.trim().toLowerCase()) {
        matchLifts.push(r);
      }
    });

    if (matchLifts.length) {
      matchLifts.sort(function (a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : (a.ts || 0) - (b.ts || 0);
      });
      var last = matchLifts[0];
      if (last.kg != null) $('gkg').value = last.kg;
      if (last.reps != null) $('greps').value = last.reps;
      if (last.series != null) $('gsets').value = last.series;
      // Si el ejercicio viene del menú, el equipo ya está elegido: no lo pisamos.
      if (!opts.keepEquipment && last.tipo && $('gtype')) $('gtype').value = normalizeLiftGroup(last.tipo);
      if (noteEl) {
        var hint = t('lastRecordHint')
          .replace('{sets}', last.series)
          .replace('{reps}', last.reps)
          .replace('{kg}', last.kg)
          .replace('{date}', fmtDate(last.date));
        noteEl.textContent = hint;
        noteEl.style.display = 'block';
      }
    } else {
      if (noteEl) noteEl.style.display = 'none';
      var goalDef = GOALS[routineConfig.goal] || GOALS.hypertrophy;
      if (!$('gsets').value) $('gsets').value = goalDef.defaultSets;
      if (!$('greps').value) $('greps').value = goalDef.defaultReps;
    }
  }

  function renderLiftMuscleSelect() {
    var sel = $('liftMuscleSelect');
    if (!sel) return;
    var prev = sel.value || 'all';
    sel.innerHTML = LIFT_MUSCLE_FILTERS.map(function (m) {
      var label = m === 'all' ? t('liftMuscleAll') : (m === 'brazos' ? t('liftMuscleBrazos') : getMuscleName(m));
      return '<option value="' + esc(m) + '">' + esc(label) + '</option>';
    }).join('');
    sel.value = prev;
  }

  function renderLiftExerciseSelect(opts) {
    opts = opts || {};
    var sel = $('liftExerciseSelect');
    if (!sel) return;
    var equip = normalizeLiftGroup($('gtype') ? $('gtype').value : 'mancuernas');
    var muscle = $('liftMuscleSelect') ? $('liftMuscleSelect').value : 'all';
    var filtered = ALL_EXERCISES.filter(function (item) {
      return getExerciseLiftGroups(item).indexOf(equip) >= 0 && muscleMatchesFilter(item, muscle);
    });

    var prev = sel.value;
    var html = '<option value="">' + esc(t('optSelectExercise')) + '</option>';
    filtered.forEach(function (item) {
      html += '<option value="' + esc(item.key) + '">' + esc(getExerciseName(item.key, curLang)) + '</option>';
    });
    html += '<option value="' + CUSTOM_EXERCISE_VALUE + '">' + esc(t('optOtherExercise')) + '</option>';
    sel.innerHTML = html;

    var chosen = opts.exerciseKey || (opts.keepSelection === false ? '' : prev);
    if (chosen && chosen !== CUSTOM_EXERCISE_VALUE && !filtered.some(function (it) { return it.key === chosen; })) {
      chosen = '';
    }
    sel.value = chosen;
    updateCustomExerciseVisibility();
  }

  function updateCustomExerciseVisibility() {
    var sel = $('liftExerciseSelect'), wrap = $('gexCustomWrap');
    if (!sel || !wrap) return;
    wrap.hidden = sel.value !== CUSTOM_EXERCISE_VALUE;
  }

  // Sugerencias del campo libre: solo aparece cuando se elige "+ Otro ejercicio".
  function fillExList() {
    var list = $('gexlist');
    if (!list) return;
    var equip = normalizeLiftGroup($('gtype') ? $('gtype').value : 'mancuernas');
    var filtered = ALL_EXERCISES.filter(function (item) {
      return getExerciseLiftGroups(item).indexOf(equip) >= 0 && isExerciseAvailable(item.key, routineConfig.equipment);
    });
    list.innerHTML = filtered.map(function (item) {
      return '<option value="' + esc(getExerciseName(item.key, curLang)) + '"></option>';
    }).join('');
  }

  if ($('gtype')) {
    $('gtype').addEventListener('change', function () {
      renderLiftExerciseSelect({ keepSelection: false });
      fillExList();
    });
  }
  if ($('liftMuscleSelect')) {
    $('liftMuscleSelect').addEventListener('change', function () {
      renderLiftExerciseSelect({ keepSelection: false });
    });
  }
  if ($('liftExerciseSelect')) {
    $('liftExerciseSelect').addEventListener('change', function () {
      updateCustomExerciseVisibility();
      if (this.value && this.value !== CUSTOM_EXERCISE_VALUE) {
        autocompleteLastRecord(getExerciseName(this.value, curLang), { keepEquipment: true });
      } else {
        var noteEl = $('gLastRecordNote');
        if (noteEl) noteEl.style.display = 'none';
      }
    });
  }
  if ($('gex')) {
    $('gex').addEventListener('input', function () { autocompleteLastRecord(this.value); });
    $('gex').addEventListener('change', function () { autocompleteLastRecord(this.value); });
  }

  $('gf').addEventListener('submit', function (e) {
    e.preventDefault();
    var sel = $('liftExerciseSelect');
    var selectedKey = sel ? sel.value : '';
    var ex = '', exerciseKey = '';
    if (selectedKey === CUSTOM_EXERCISE_VALUE) {
      ex = $('gex') ? $('gex').value.trim() : '';
      if (!ex) { say('gmsg', t('missingCustomExercise'), true); return; }
    } else if (selectedKey && EX_NAME_MAP[selectedKey]) {
      exerciseKey = selectedKey;
      ex = getExerciseName(selectedKey, curLang);
    } else {
      say('gmsg', t('missingFields'), true);
      return;
    }
    var date = currentDate(), series = num($('gsets').value), reps = num($('greps').value), kg = num($('gkg').value);
    syncDateMirrors(date);
    if (!date || !ex) { say('gmsg', t('missingFields'), true); return; }
    if (series < 1 || reps < 1) { say('gmsg', t('missingSetsReps'), true); return; }
    var payload = {
      tipo: $('gtype').value,
      ejercicio: ex,
      exerciseKey: exerciseKey,
      series: series,
      reps: reps,
      kg: kg,
      ts: Date.now()
    };
    var wasEditingLift = editing && editing.type === 'lift' ? editing.key : null;
    if (editing && !wasEditingLift) setEditing(null);
    var savedMsgKey = 'addedLift';
    if (wasEditingLift) {
      if (Storage.updateLift) {
        Storage.updateLift(lifts, wasEditingLift, date, payload);
      } else {
        var previous = lifts[wasEditingLift];
        if (previous) {
          var edited = { date: date };
          Object.keys(payload).forEach(function (k) { edited[k] = payload[k]; });
          edited.ts = previous.ts || Date.now();
          lifts[wasEditingLift] = edited;
          save(LS_LIFTS, lifts);
        }
      }
      savedMsgKey = 'updatedLift';
      setEditing(null);
    } else if (Storage.addLift) {
      Storage.addLift(lifts, date, payload);
    } else {
      var id = date + '-' + Math.random().toString(36).slice(2, 8);
      var record = { date: date };
      Object.keys(payload).forEach(function (k) { record[k] = payload[k]; });
      lifts[id] = record;
      save(LS_LIFTS, lifts);
    }
    clearForm(true);
    render();
    updateWorkoutDateUI();
    say('gmsg', t(savedMsgKey).replace('{ex}', ex));
    if (!wasEditingLift) autocompleteLastRecord(ex);
  });

  // Las filas de pesas (gHist, selectedLifts y Total) usan el delegado global.

  if ($('cfgGoal')) {
    $('cfgGoal').addEventListener('change', function () {
      routineConfig.goal = this.value;
      saveConfig();
      syncTimerToGoal(this.value);
      var goalDef = GOALS[this.value] || GOALS.hypertrophy;
      $('gsets').value = goalDef.defaultSets;
      $('greps').value = goalDef.defaultReps;
      renderConfigPanel();
      renderTodayRoutine();
      renderRoutine();
    });
  }

  if ($('cfgSplit')) {
    $('cfgSplit').addEventListener('change', function () {
      routineConfig.split = this.value;
      saveConfig();
      renderConfigPanel();
      renderTodayRoutine();
      renderRoutine();
      // El plan semanal y el resumen "Plan de hoy" siguen los días/sesiones
      // reales de la división activa, incluso en las opciones "Auto".
      renderTodayPlan();
      renderCalendar();
      renderWeekPlanner();
    });
  }

  if ($('btnQuickAllGym')) {
    $('btnQuickAllGym').addEventListener('click', function () {
      routineConfig.equipment = EQUIP_PRESETS.all.slice();
      saveConfig();
      renderConfigPanel();
      renderTodayRoutine();
      renderRoutine();
      fillExList();
    });
  }

  if ($('btnQuickHome')) {
    $('btnQuickHome').addEventListener('click', function () {
      routineConfig.equipment = EQUIP_PRESETS.home.slice();
      saveConfig();
      renderConfigPanel();
      renderTodayRoutine();
      renderRoutine();
      fillExList();
    });
  }

  if ($('btnQuickNoEquip')) {
    $('btnQuickNoEquip').addEventListener('click', function () {
      routineConfig.equipment = EQUIP_PRESETS.bodyweight.slice();
      saveConfig();
      renderConfigPanel();
      renderTodayRoutine();
      renderRoutine();
      fillExList();
    });
  }

  if ($('equipChips')) {
    $('equipChips').addEventListener('click', function (e) {
      var chip = e.target.closest('.equip-chip');
      if (!chip) return;
      var equipId = chip.getAttribute('data-equip');
      if (!equipId) return;
      var idx = routineConfig.equipment.indexOf(equipId);
      if (idx >= 0) {
        if (routineConfig.equipment.length > 1) {
          routineConfig.equipment.splice(idx, 1);
        }
      } else {
        routineConfig.equipment.push(equipId);
      }
      saveConfig();
      renderConfigPanel();
      renderTodayRoutine();
      renderRoutine();
      fillExList();
    });
  }

  if ($('btnSyncTimer')) {
    $('btnSyncTimer').addEventListener('click', function () {
      var goalDef = GOALS[routineConfig.goal] || GOALS.hypertrophy;
      startTimerWith(goalDef.rest);
    });
  }

  // Las vistas del plan dependen de las dos pestañas: al cambiar pesas o
  // cardio hay que actualizarlas todas para que no queden desincronizadas.
  function renderPlanViews() {
    renderTodayPlan();
    renderCalendar();
    renderWeekPlanner();
    renderTodayRoutine();
  }

  function render() {
    updateWorkoutDateUI();
    renderTodayPlan();
    renderCalendar();
    renderWeekPlanner();
    renderComparison();
    renderMeasures();
    renderDays();
    renderCardioConfigPanel();
    renderSuggestedCardio();
    renderCardioActivitySelect();
    renderConfigPanel();
    renderTodayRoutine();
    renderRoutine();
    renderLifts();
    renderGymTotals();
    renderTotalHistory();
    if (window.PulseFitCharts && window.PulseFitCharts.refresh) {
      window.PulseFitCharts.refresh();
    } else if (window.PulseFitCharts && window.PulseFitCharts.render) {
      window.PulseFitCharts.render();
    } else if (typeof renderProgressionChart === 'function') {
      renderProgressionChart();
    }
  }

  /* ---------- notificaciones ---------- */
  var notifBannerDismissed = false;

  function notificationsSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  function updateNotifBanner() {
    var banner = $('notifBanner');
    if (!banner) return;
    var show = notificationsSupported() &&
      Notification.permission === 'default' &&
      !notifBannerDismissed;
    banner.hidden = !show;
  }

  function markNotifAsked() {
    try { localStorage.setItem(LS_NOTIF_ASKED, '1'); } catch (e) {}
  }

  function notifAsked() {
    try { return localStorage.getItem(LS_NOTIF_ASKED) === '1'; } catch (e) { return false; }
  }

  // Pide permiso dentro de un gesto del usuario (necesario en móviles).
  function requestNotifPermission() {
    if (!notificationsSupported()) return Promise.resolve('unsupported');
    markNotifAsked();
    return new Promise(function (resolve) {
      var result;
      try {
        // Safari antiguo usa callback; los navegadores modernos devuelven una promesa.
        result = Notification.requestPermission(function (perm) {
          updateNotifBanner();
          resolve(perm);
        });
      } catch (e) {
        updateNotifBanner();
        resolve('denied');
        return;
      }
      if (result && typeof result.then === 'function') {
        result.then(function (perm) {
          updateNotifBanner();
          resolve(perm);
        }).catch(function () {
          updateNotifBanner();
          resolve('denied');
        });
      }
    });
  }

  // Solicitud temprana al abrir la PWA: un solo intento automático por dispositivo.
  // Si el navegador exige un gesto, el banner superior queda visible para hacerlo con un toque.
  function initNotifications() {
    updateNotifBanner();
    if (!notificationsSupported()) return;
    if (Notification.permission !== 'default') return;
    if (notifAsked()) return;
    markNotifAsked();
    try {
      var p = Notification.requestPermission();
      if (p && typeof p.then === 'function') {
        p.then(function () { updateNotifBanner(); }).catch(function () {});
      }
    } catch (e) {}
  }

  function showRestNotification() {
    if (!notificationsSupported() || Notification.permission !== 'granted') return;
    var title = 'PulseFit';
    var options = {
      body: t('timerDone') || '¡Descanso terminado!',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      silent: false,
      requireInteraction: true,
      vibrate: [400, 150, 400, 150, 600],
      // Tag único: el sistema nunca la toma como actualización de una notificación previa.
      tag: 'pulsefit-rest-' + Date.now(),
      renotify: true
    };
    var done = false;

    function fallback() {
      if (done) return;
      done = true;
      try { new Notification(title, options); } catch (e) {}
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      var guard = setTimeout(fallback, 1500);
      navigator.serviceWorker.ready.then(function (reg) {
        if (done) return;
        if (!reg || !reg.showNotification) {
          clearTimeout(guard);
          fallback();
          return;
        }
        reg.showNotification(title, options).then(function () {
          clearTimeout(guard);
          done = true;
        }).catch(function () {
          clearTimeout(guard);
          fallback();
        });
      }).catch(function () {
        clearTimeout(guard);
        fallback();
      });
    } else {
      fallback();
    }
  }

  if ($('btnEnableNotifications')) {
    $('btnEnableNotifications').addEventListener('click', function () {
      requestNotifPermission().then(function () { updateNotifBanner(); });
    });
  }

  if ($('btnNotifDismiss')) {
    $('btnNotifDismiss').addEventListener('click', function () {
      notifBannerDismissed = true;
      updateNotifBanner();
    });
  }

  /* ---------- temporizador de descanso ---------- */
  var timerPreset = 60;
  var timerLeft = 60;
  var timerRunning = false;
  var timerInterval = null;
  var timerEndTime = 0;
  var timerRinging = false;
  var timerFlashTimeout = null;

  // Instancia global de AudioContext. En móviles (sobre todo iOS) el audio
  // debe crearse y desbloquearse dentro de un gesto del usuario.
  var audioCtx = null;
  var AudioContextClass = window.AudioContext || window.webkitAudioContext;

  function getAudioContext() {
    try {
      if (!audioCtx && AudioContextClass) audioCtx = new AudioContextClass();
    } catch (e) {
      audioCtx = null;
    }
    return audioCtx;
  }

  // Debe llamarse dentro del evento click que inicia el temporizador.
  // Reproduce un oscilador silencioso de 0.01s para desbloquear el audio.
  function unlockAudio() {
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended' && ctx.resume) {
        ctx.resume().catch(function () {});
      }
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.01);
    } catch (e) {}
  }

  // Secuencia clara de 3 pitidos cortos: 880Hz, 880Hz y 1174Hz.
  function playTimerBeep() {
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended' && ctx.resume) {
        ctx.resume().catch(function () {});
      }
      var now = ctx.currentTime;
      var notes = [
        { f: 880, start: 0, dur: 0.15 },
        { f: 880, start: 0.25, dur: 0.15 },
        { f: 1174, start: 0.50, dur: 0.30 }
      ];
      notes.forEach(function (n) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.start);
        gain.gain.setValueAtTime(0.0001, now + n.start);
        gain.gain.exponentialRampToValueAtTime(0.6, now + n.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.02);
      });
    } catch (e) {}
  }

  function triggerTimerVibration() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([400, 150, 400, 150, 600]);
      } catch (e) {}
    }
  }

  // Respaldo visual para iOS, donde Safari no soporta navigator.vibrate.
  function flashTimerContainer() {
    var restEl = $('restTimer');
    if (!restEl) return;
    restEl.classList.remove('timer-flash');
    void restEl.offsetWidth; // reinicia la animación si ya estaba activa
    restEl.classList.add('timer-flash');
    if (timerFlashTimeout) clearTimeout(timerFlashTimeout);
    timerFlashTimeout = setTimeout(function () {
      restEl.classList.remove('timer-flash');
      timerFlashTimeout = null;
    }, 3000);
  }

  function formatTimeDigits(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s);
  }

  function updateTimerLabels() {
    var playBtn = $('timerPlayBtn');
    if (playBtn) {
      if (timerRunning) {
        playBtn.textContent = t('timerPause');
      } else if (timerLeft > 0 && timerLeft < timerPreset) {
        playBtn.textContent = t('timerResume');
      } else {
        playBtn.textContent = t('timerStart');
      }
    }
    var st = $('timerStatus');
    if (st && timerRinging) {
      st.textContent = t('timerDone');
    }
  }

  function updateTimerUI() {
    var timeStr = formatTimeDigits(timerLeft);
    if ($('timerDigits')) $('timerDigits').textContent = timeStr;
    if ($('timerPillTime')) $('timerPillTime').textContent = timeStr;

    document.querySelectorAll('.timer-preset-btn').forEach(function (b) {
      var sec = parseInt(b.getAttribute('data-sec'), 10);
      b.classList.toggle('active', sec === timerPreset);
    });

    updateTimerLabels();

    var restEl = $('restTimer');
    var st = $('timerStatus');
    if (restEl) {
      restEl.classList.toggle('ringing', timerRinging);
    }
    if (st) {
      st.hidden = !timerRinging;
      if (timerRinging) st.textContent = t('timerDone');
    }
  }

  function clearTimerRinging() {
    if (timerRinging) {
      timerRinging = false;
      var restEl = $('restTimer');
      if (restEl) {
        restEl.classList.remove('ringing');
        restEl.classList.remove('timer-flash');
      }
      if (timerFlashTimeout) { clearTimeout(timerFlashTimeout); timerFlashTimeout = null; }
      var st = $('timerStatus');
      if (st) st.hidden = true;
    }
  }

  function timerTick() {
    if (!timerRunning) return;
    // Precisión por marca de tiempo real: no depende de que el intervalo se ejecute a tiempo.
    var endTime = timerEndTime;
    var remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    if (remaining !== timerLeft) {
      timerLeft = remaining;
      updateTimerUI();
    }
    if (remaining <= 0) {
      if (timerRunning) finishTimer();
    }
  }

  function finishTimer() {
    if (!timerRunning) return;
    timerRunning = false;
    timerLeft = 0;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerRinging = true;
    updateTimerUI();
    playTimerBeep();
    triggerTimerVibration();
    flashTimerContainer();
    showRestNotification();
  }

  function startTimerWith(sec) {
    unlockAudio();
    // Aprovecha el gesto del usuario para pedir permiso si aún no se decidió.
    if (notificationsSupported() && Notification.permission === 'default') {
      requestNotifPermission();
    }
    clearTimerRinging();
    timerPreset = sec;
    timerLeft = sec;
    var endTime = Date.now() + sec * 1000;
    timerEndTime = endTime;
    timerRunning = true;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(timerTick, 200);
    updateTimerUI();
  }

  function togglePlayPause() {
    unlockAudio();
    if (notificationsSupported() && Notification.permission === 'default') {
      requestNotifPermission();
    }
    clearTimerRinging();
    if (timerRunning) {
      // Pausar
      var now = Date.now();
      timerLeft = Math.max(0, Math.ceil((timerEndTime - now) / 1000));
      timerRunning = false;
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      updateTimerUI();
    } else {
      // Reanudar o Iniciar
      if (timerLeft <= 0) {
        timerLeft = timerPreset || 60;
      }
      timerEndTime = Date.now() + timerLeft * 1000;
      timerRunning = true;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(timerTick, 200);
      updateTimerUI();
    }
  }

  function resetTimer() {
    unlockAudio();
    clearTimerRinging();
    timerRunning = false;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerLeft = timerPreset || 60;
    updateTimerUI();
  }

  function toggleTimerMinimize(minimized) {
    var pill = $('timerPill'), card = $('timerCard');
    if (!pill || !card) return;
    if (minimized) {
      card.hidden = true;
      pill.hidden = false;
    } else {
      card.hidden = false;
      pill.hidden = true;
    }
  }

  // Event Listeners del temporizador
  document.querySelectorAll('.timer-preset-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var sec = parseInt(this.getAttribute('data-sec'), 10);
      if (sec) startTimerWith(sec);
    });
  });

  if ($('timerPlayBtn')) $('timerPlayBtn').addEventListener('click', togglePlayPause);
  if ($('timerResetBtn')) $('timerResetBtn').addEventListener('click', resetTimer);
  if ($('timerToggleBtn')) $('timerToggleBtn').addEventListener('click', function () { toggleTimerMinimize(true); });
  if ($('timerPill')) $('timerPill').addEventListener('click', function () {
    clearTimerRinging();
    toggleTimerMinimize(false);
  });

  // Al volver a la app (o al mostrarla) recalcula con Date.now() y dispara
  // la alarma si el tiempo ya se cumplió mientras estaba minimizada o en segundo plano.
  function syncTimerOnResume() {
    updateNotifBanner();
    if (timerRunning) timerTick();
  }

  document.addEventListener('visibilitychange', syncTimerOnResume);
  window.addEventListener('pageshow', syncTimerOnResume);
  window.addEventListener('focus', syncTimerOnResume);

  /* ---------- pestañas ---------- */
  var TABS = ['cardio', 'pesas', 'total', 'plan'];
  function showTab(name) {
    if (name === 'caminata') name = 'cardio';
    if (TABS.indexOf(name) < 0) name = 'cardio';
    TABS.forEach(function (tName) {
      var on = tName === name, b = $('tab-' + tName);
      if (b) {
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      }
      var p = $('panel-' + tName);
      if (p) {
        p.hidden = !on;
      }
    });
    if (name === 'total') {
      if (window.PulseFitCharts && window.PulseFitCharts.refresh) {
        window.PulseFitCharts.refresh();
      } else if (window.PulseFitCharts && window.PulseFitCharts.render) {
        window.PulseFitCharts.render();
      } else if (typeof renderProgressionChart === 'function') {
        renderProgressionChart();
      }
    }
  }
  TABS.forEach(function (tName, i) {
    var b = $('tab-' + tName);
    if (!b) return;
    b.addEventListener('click', function () { showTab(tName); try { location.hash = tName; } catch (e) {} });
    b.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i + TABS.length - 1) % TABS.length : -1;
      if (j < 0) return;
      e.preventDefault(); showTab(TABS[j]); $('tab-' + TABS[j]).focus();
      try { location.hash = TABS[j]; } catch (err) {}
    });
  });
  window.addEventListener('hashchange', function () { showTab(location.hash.replace('#', '')); });

  /* ---------- arranque ---------- */
  if (Storage.loadDays) {
    days = Storage.loadDays();
  } else {
    days = load(LS_DAYS);
  }
  if (Storage.loadLifts) {
    lifts = Storage.loadLifts();
  } else {
    lifts = load(LS_LIFTS);
  }
  loadConfig();
  loadCardioConfig();
  weeklyPlan = normalizePlan(Storage.loadPlan ? Storage.loadPlan() : load(LS_PLAN));
  measures = (Storage.loadMeasures ? Storage.loadMeasures() : load(LS_MEASURES)) || {};
  measureUnit = loadMeasureUnit();

  // Exponer API y referencias en PulseFit
  window.PulseFit.getState = function () {
    return {
      days: days,
      lifts: lifts,
      curLang: curLang,
      routineConfig: routineConfig,
      cardioConfig: cardioConfig,
      weeklyPlan: weeklyPlan,
      measures: measures,
      measureUnit: measureUnit
    };
  };
  window.PulseFit.getDays = function () { return days; };
  window.PulseFit.getLifts = function () { return lifts; };
  window.PulseFit.setDays = function (d) { days = d; window.PulseFit.days = d; };
  window.PulseFit.setLifts = function (l) { lifts = l; window.PulseFit.lifts = l; };
  window.PulseFit.getWorkoutDate = currentDate;
  window.PulseFit.setWorkoutDate = function (d) { setWorkoutDate(d, { scroll: false }); };
  window.PulseFit.getEditing = function () { return editing; };
  window.PulseFit.editDayRecord = editDayRecord;
  window.PulseFit.editLiftRecord = editLiftRecord;
  window.PulseFit.cancelEdit = cancelEdit;
  window.PulseFit.setRoutineConfig = function (c) {
    if (c.goal && GOALS[c.goal]) routineConfig.goal = c.goal;
    if (c.split && SPLIT_DAYS[c.split]) routineConfig.split = c.split;
    if (Array.isArray(c.equipment) && c.equipment.length) routineConfig.equipment = c.equipment;
    saveConfig();
    renderConfigPanel();
    renderTodayRoutine();
    renderRoutine();
    renderTodayPlan();
    renderCalendar();
    renderWeekPlanner();
  };
  window.PulseFit.setCardioConfig = function (c) {
    c = c || {};
    if (c.goal && CARDIO_GOALS[c.goal]) cardioConfig.goal = c.goal;
    if (Array.isArray(c.equipment) && c.equipment.length) cardioConfig.equipment = c.equipment;
    ['plan', 'mode', 'enabled'].forEach(function (k) {
      if (typeof c[k] === 'string' || typeof c[k] === 'boolean') cardioConfig[k] = c[k];
      else delete cardioConfig[k];
    });
    if (c.days != null) cardioConfig.days = c.days;
    else delete cardioConfig.days;
    saveCardioConfig();
    renderCardioConfigPanel();
    renderSuggestedCardio();
    renderCardioActivitySelect();
    renderPlanViews();
  };
  window.PulseFit.setPlan = function (p) {
    weeklyPlan = normalizePlan(p);
    window.PulseFit.weeklyPlan = weeklyPlan;
  };
  window.PulseFit.setMeasures = function (m) {
    measures = (m && typeof m === 'object') ? m : {};
    window.PulseFit.measures = measures;
  };
  window.PulseFit.setMeasureUnit = function (u) {
    measureUnit = (u === 'lb') ? 'lb' : 'kg';
    window.PulseFit.measureUnit = measureUnit;
  };
  window.PulseFit.showTab = showTab;
  window.PulseFit.resolvePlanEntry = resolvePlanEntry;
  window.PulseFit.planOptionsHtml = planOptionsHtml;
  window.PulseFit.applyLang = applyLang;
  window.PulseFit.requestNotifPermission = requestNotifPermission;
  window.PulseFit.render = render;
  window.PulseFit.t = t;
  window.PulseFit.say = say;
  window.PulseFit.fmtDate = fmtDate;
  window.PulseFit.fmt = fmt;
  window.PulseFit.num = num;
  window.PulseFit.esc = esc;
  window.PulseFit.curLang = curLang;
  window.PulseFit.LOCALE = LOCALE;
  window.PulseFit.SUPPORTED_LANGS = SUPPORTED_LANGS;
  window.PulseFit.EX_NAME_MAP = EX_NAME_MAP;
  window.PulseFit.getExerciseName = getExerciseName;
  window.PulseFit.getExerciseLiftGroups = getExerciseLiftGroups;
  window.PulseFit.getCanonicalExerciseKey = getCanonicalExerciseKey;
  window.PulseFit.days = days;
  window.PulseFit.lifts = lifts;
  window.PulseFit.routineConfig = routineConfig;
  window.PulseFit.cardioConfig = cardioConfig;
  window.PulseFit.weeklyPlan = weeklyPlan;
  window.PulseFit.measures = measures;
  window.PulseFit.measureUnit = measureUnit;

  handlePlanEvents();
  renderCardioDetailBuilder();
  renderLiftMuscleSelect();
  renderLiftExerciseSelect({ keepSelection: false });
  showTab(location.hash.replace('#', ''));
  clearForm();

  var initLang = detectLang();
  $('langSelect').addEventListener('change', function (e) { applyLang(e.target.value); });
  applyLang(initLang);
  syncTimerToGoal(routineConfig.goal);
  updateTimerUI();

  // Solicitud temprana de notificaciones al abrir la PWA (init / DOMContentLoaded).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
  } else {
    initNotifications();
  }

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function () {}); });
  }
})();
