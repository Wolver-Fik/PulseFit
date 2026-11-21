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
    { key: 'glute_bridge', es: 'Puente de glúteos', en: 'Glute bridge', pt: 'Elevação pélvica', fr: 'Pont de fessiers', it: 'Ponte glutei', de: 'Glute Bridge / Beckenheben', ru: 'Ягодичный мостик', ja: 'グルートブリッジ', muscle: 'piernas', pattern: 'bisagra', equipment: ['peso_corporal'], tipo: 'peso_corporal' },
    { key: 'calf_raises', es: 'Elevación de talones (gemelos)', en: 'Standing calf raises', pt: 'Elevação de panturrilhas', fr: 'Mollets debout', it: 'Calf raise in piedi', de: 'Wadenheben im Stehen', ru: 'Подъемы на носки стоя (икры)', ja: 'スタンディングカーフレイズ', muscle: 'piernas', pattern: 'aislamiento', equipment: ['peso_corporal'], tipo: 'peso_corporal' },

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

  function getExerciseName(key, lang) {
    var item = EX_NAME_MAP[key];
    if (item) return item[lang] || item.es;
    return key;
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
  var days = {}, lifts = {};

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

    fillExList();
    render();
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
    var protoText = getCardioProtocolText(equipId, goalKey, curLang);

    $('date').value = iso(today());

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
    if ($('entreno')) {
      $('entreno').value = equipName + ' - ' + protoText;
    }

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
    var withMeals = all.filter(function (r) { return MEAL_KEYS.some(function (m) { return r[m]; }); }).length;

    $('stats').innerHTML =
      tile(streak, streak === 1 ? t('streak1') : t('streakN')) +
      tile(trained, trained === 1 ? t('cardioSession1') : t('cardioSessionN')) +
      tile(fmt(km, 2), t('totalKm')) +
      tile(fmt(kcal, 0), t('activeKcal')) +
      tile(fmt(steps, 0), t('steps')) +
      tile(fmt(mins, 0), t('cardioMinutes')) +
      tile(withMeals, withMeals === 1 ? t('mealsLogged1') : t('mealsLoggedN'));

    // historial
    if (!keys.length) { $('hist').innerHTML = '<p class="empty">' + esc(t('emptyHist')) + '</p>'; return; }
    var rows = keys.slice().reverse().map(function (k) {
      var r = days[k];
      var meals = MEAL_KEYS.filter(function (m) { return r[m]; }).map(function (m) { return '<div><b>' + t(m) + ':</b> ' + esc(r[m]) + '</div>'; }).join('');
      var details = [];
      if (r.activity) {
        var actName = getCardioEquipmentName(r.activity, curLang);
        var intLabel = r.intensity ? getIntensityLabel(r.intensity) : '';
        details.push('<b>' + esc(actName) + '</b>' + (intLabel ? ' <small style="color:var(--muted)">(' + esc(intLabel) + ')</small>' : ''));
      }
      if (r.entreno) {
        details.push(esc(r.entreno));
      }
      var what = details.length ? '<div style="color:var(--muted);font-size:12px;margin-top:4px">' + details.join(' · ') + '</div>' : '';
      return '<tr><td>' + esc(fmtDate(k)) + what + '</td>' +
        '<td><span class="tag ' + (r.exercised ? 'yes' : 'no') + '">' + (r.exercised ? t('statusWorked') : t('statusRest')) + '</span></td>' +
        '<td class="n">' + fmt(num(r.km), 2) + '</td><td class="n">' + fmt(num(r.kcal), 0) + '</td>' +
        '<td class="n">' + fmt(num(r.steps), 0) + '</td><td class="n">' + fmt(num(r.minutes), 0) + '</td>' +
        '<td class="meals">' + (meals || '<span style="color:var(--muted)">' + t('noMealsLogged') + '</span>') + '</td>' +
        '<td><button class="link" data-edit="' + k + '" type="button">' + t('btnEdit') + '</button> <button class="link danger" data-del="' + k + '" type="button">' + t('btnDelete') + '</button></td></tr>';
    }).join('');
    $('hist').innerHTML = '<table><thead><tr><th>' + t('thDate') + '</th><th>' + t('thStatus') + '</th><th class="n">' + t('thKm') + '</th><th class="n">' + t('thKcal') + '</th><th class="n">' + t('thSteps') + '</th><th class="n">' + t('thMin') + '</th><th>' + t('thMeals') + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  var TEXT_IDS = ['entreno', 'desayuno', 'almuerzo', 'merienda', 'cena', 'otros'];
  function clearForm() {
    $('date').value = iso(today());
    ['km', 'kcal', 'steps', 'minutes'].concat(TEXT_IDS).forEach(function (id) { $(id).value = ''; });
    $('ex').checked = true;
    if ($('cardioIntensity')) $('cardioIntensity').value = 'moderada';
    if ($('cardioActivity') && $('cardioActivity').options.length) {
      $('cardioActivity').selectedIndex = 0;
    }
    say('msg', '');
  }
  function fillForm(k) {
    var r = days[k]; if (!r) return;
    $('date').value = k;
    ['km', 'kcal', 'steps', 'minutes'].forEach(function (id) { $(id).value = r[id] == null ? '' : r[id]; });
    TEXT_IDS.forEach(function (id) { $(id).value = r[id] || ''; });
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
    say('msg', t('editingDay').replace('{date}', fmtDate(k)));
    $('f').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  $('f').addEventListener('submit', function (e) {
    e.preventDefault();
    var date = $('date').value; if (!date) return;
    var r = {
      date: date,
      exercised: $('ex').checked,
      activity: $('cardioActivity') ? $('cardioActivity').value : '',
      intensity: $('cardioIntensity') ? $('cardioIntensity').value : 'moderada',
      km: num($('km').value),
      kcal: num($('kcal').value),
      steps: num($('steps').value),
      minutes: num($('minutes').value)
    };
    TEXT_IDS.forEach(function (id) { var v = $(id).value.trim(); if (v) r[id] = v; });
    days[date] = r;
    if (Storage.saveDays) {
      Storage.saveDays(days);
    } else {
      save(LS_DAYS, days);
    }
    render();
    say('msg', t('savedDay').replace('{date}', fmtDate(date)));
  });
  $('reset').addEventListener('click', clearForm);

  var armed = null, armTimer = null;
  $('hist').addEventListener('click', function (e) {
    var tgt = e.target;
    if (tgt.dataset && tgt.dataset.edit) { fillForm(tgt.dataset.edit); return; }
    if (tgt.dataset && tgt.dataset.del) {
      var k = tgt.dataset.del;
      if (armed === k) {
        clearTimeout(armTimer);
        armed = null;
        delete days[k];
        if (Storage.saveDays) {
          Storage.saveDays(days);
        } else {
          save(LS_DAYS, days);
        }
        render();
      } else {
        armed = k;
        tgt.textContent = t('btnSure');
        clearTimeout(armTimer);
        armTimer = setTimeout(function () { armed = null; renderDays(); }, 3000);
      }
    }
  });

  if ($('cardioCfgGoal')) {
    $('cardioCfgGoal').addEventListener('change', function () {
      cardioConfig.goal = this.value;
      saveCardioConfig();
      renderCardioConfigPanel();
      renderSuggestedCardio();
    });
  }

  if ($('btnCardioAllGym')) {
    $('btnCardioAllGym').addEventListener('click', function () {
      cardioConfig.equipment = CARDIO_PRESETS.all.slice();
      saveCardioConfig();
      renderCardioConfigPanel();
      renderSuggestedCardio();
      renderCardioActivitySelect();
    });
  }

  if ($('btnCardioHomeOutdoor')) {
    $('btnCardioHomeOutdoor').addEventListener('click', function () {
      cardioConfig.equipment = CARDIO_PRESETS.home_outdoor.slice();
      saveCardioConfig();
      renderCardioConfigPanel();
      renderSuggestedCardio();
      renderCardioActivitySelect();
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
      var val = this.value;
      if (val && val !== 'otro') {
        var protoText = getCardioProtocolText(val, cardioConfig.goal, curLang);
        var equipName = getCardioEquipmentName(val, curLang);
        if (protoText && (!($('entreno').value) || $('entreno').value.indexOf(' - ') >= 0)) {
          $('entreno').value = equipName + ' - ' + protoText;
        }
      }
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
    var name = getExerciseName(key, curLang);
    $('gex').value = name;
    $('gdate').value = iso(today());
    autocompleteLastRecord(name);
    var exObj = EX_NAME_MAP[key];
    if (exObj && exObj.tipo && $('gtype')) $('gtype').value = exObj.tipo;
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
    var splitDays = SPLIT_DAYS[split] || [0];
    var isRest = splitDays.indexOf(wd) < 0;

    updateConfigBadge();

    var goalDef = GOALS[goal] || GOALS.hypertrophy;
    var restBadge = $('todayRestBadge');
    if (restBadge) restBadge.textContent = t('suggestedRestLabel') + ': ' + goalDef.rest + 's';
    var btnSync = $('btnSyncTimerText');
    if (btnSync) btnSync.textContent = goalDef.rest + 's ' + t('timerRest').toLowerCase();

    if (isRest) {
      var dayNames = t('dayNames') || [];
      var note = (t('splitNotes') && t('splitNotes')[split]) || t('rtNote');
      body.innerHTML =
        '<div class="today-rest-box">' +
          '<h3 style="color:var(--fg);font-size:15px;margin:0">' + esc((dayNames[wd] || '') + ' · ' + t('todayRestDayTitle')) + '</h3>' +
          '<p class="msg" style="margin:4px 0 0">' + esc(t('todayRestDayDesc')) + '</p>' +
          '<p class="msg" style="margin:4px 0 0;color:var(--accent);font-size:13px">' + esc(note) + '</p>' +
        '</div>';
      return;
    }

    var sess = getSplitSessionInfo(split, wd);
    var dayExs = getDayExercises(split, wd, routineConfig.equipment, goal);
    var dayNames = t('dayNames') || [];
    var dayHeaderHtml = '<div style="margin-bottom:6px"><h3 style="color:var(--fg);font-size:15px;margin:0">' +
      esc((dayNames[wd] || '') + ' · ' + sess.name) + '</h3><p class="rt-sub" style="margin:2px 0 6px">' + esc(sess.sub) + '</p></div>';

    if (!dayExs.length) {
      body.innerHTML = dayHeaderHtml + '<p class="msg" style="margin:6px 0">' + esc(t('noExercisesAvailable')) + '</p>';
      return;
    }

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

    body.innerHTML = dayHeaderHtml + '<div class="today-ex-list">' + rowsHtml + '</div>';
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
    var out = '', cur = null;
    list.forEach(function (it) {
      var v = it.v;
      if (v.date !== cur) { cur = v.date; out += '<div class="gday"><h3>' + esc(fmtDate(cur)) + '</h3></div>'; }
      out += '<div class="lift"><div class="what">' + esc(v.ejercicio) + ' <small>· ' + esc(getTypeLabel(v.tipo)) + '</small><br>' +
        fmt(num(v.series), 0) + ' × ' + fmt(num(v.reps), 0) + ' ' + t('withConnector') + ' ' + fmt(num(v.kg), 1) + ' kg</div>' +
        '<button class="link danger" data-ldel="' + esc(it.id) + '" type="button">' + t('btnDelete') + '</button></div>';
    });
    box.innerHTML = out;

    var best = {};
    list.forEach(function (it) {
      var v = it.v, k = String(v.ejercicio).trim().toLowerCase(), b = best[k], kg = num(v.kg);
      if (!b || kg > b.kg || (kg === b.kg && v.date > b.date)) best[k] = { name: v.ejercicio, kg: kg, reps: num(v.reps), date: v.date };
    });
    var rows = Object.keys(best).sort().map(function (k) {
      var b = best[k];
      return '<tr><td>' + esc(b.name) + '</td><td class="n">' + fmt(b.kg, 1) + ' kg</td><td class="n">' + fmt(b.reps, 0) + '</td><td>' + esc(fmtDate(b.date)) + '</td></tr>';
    }).join('');
    marks.innerHTML = '<table style="min-width:420px"><thead><tr><th>' + t('thExercise') + '</th><th class="n">' + t('thBestWeight') + '</th><th class="n">' + t('thReps') + '</th><th>' + t('thDate') + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
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

  function autocompleteLastRecord(rawName) {
    var noteEl = $('gLastRecordNote');
    if (!rawName) {
      if (noteEl) noteEl.style.display = 'none';
      return;
    }
    if (rawName === t('optCustomExercise')) {
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
      if (last.tipo && $('gtype')) $('gtype').value = last.tipo;
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

  function fillExList() {
    var typeFilter = $('gtype') ? $('gtype').value : 'all';
    var filtered = ALL_EXERCISES.filter(function (item) {
      var matchesEquip = isExerciseAvailable(item.key, routineConfig.equipment);
      if (!matchesEquip) return false;
      if (typeFilter && typeFilter !== 'all' && typeFilter !== 'otro') {
        return item.tipo === typeFilter;
      }
      return true;
    });

    var options = filtered.map(function (item) {
      var name = item[curLang] || item.es;
      return '<option value="' + esc(name) + '">';
    });
    options.push('<option value="' + esc(t('optCustomExercise')) + '">');
    $('gexlist').innerHTML = options.join('');
  }

  $('gtype').addEventListener('change', fillExList);
  $('gex').addEventListener('input', function () { autocompleteLastRecord(this.value); });
  $('gex').addEventListener('change', function () { autocompleteLastRecord(this.value); });

  $('gf').addEventListener('submit', function (e) {
    e.preventDefault();
    var ex = $('gex').value.trim(), date = $('gdate').value, series = num($('gsets').value), reps = num($('greps').value), kg = num($('gkg').value);
    if (ex === t('optCustomExercise')) {
      say('gmsg', t('missingFields'), true);
      return;
    }
    if (!date || !ex) { say('gmsg', t('missingFields'), true); return; }
    if (series < 1 || reps < 1) { say('gmsg', t('missingSetsReps'), true); return; }
    var id = date + '-' + Math.random().toString(36).slice(2, 8);
    var tipoVal = $('gtype').value;
    lifts[id] = { date: date, tipo: tipoVal, ejercicio: ex, series: series, reps: reps, kg: kg, ts: Date.now() };
    if (Storage.saveLifts) {
      Storage.saveLifts(lifts);
    } else {
      save(LS_LIFTS, lifts);
    }
    render();
    say('gmsg', t('addedLift').replace('{ex}', ex));
    autocompleteLastRecord(ex);
  });

  var gArmed = null, gTimer = null;
  $('gHist').addEventListener('click', function (e) {
    var tgt = e.target, id = tgt.dataset && tgt.dataset.ldel;
    if (!id) return;
    if (gArmed === id) {
      clearTimeout(gTimer);
      gArmed = null;
      delete lifts[id];
      if (Storage.saveLifts) {
        Storage.saveLifts(lifts);
      } else {
        save(LS_LIFTS, lifts);
      }
      render();
    } else {
      gArmed = id;
      tgt.textContent = t('btnSure');
      clearTimeout(gTimer);
      gTimer = setTimeout(function () { gArmed = null; renderLifts(); }, 3000);
    }
  });

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

  function render() {
    renderDays();
    renderCardioConfigPanel();
    renderSuggestedCardio();
    renderCardioActivitySelect();
    renderConfigPanel();
    renderTodayRoutine();
    renderRoutine();
    renderLifts();
    renderGymTotals();
    if (window.PulseFitCharts && window.PulseFitCharts.render) {
      window.PulseFitCharts.render();
    } else if (typeof renderProgressionChart === 'function') {
      renderProgressionChart();
    }
  }

  /* ---------- temporizador de descanso ---------- */
  var timerPreset = 60;
  var timerLeft = 60;
  var timerRunning = false;
  var timerInterval = null;
  var timerTargetEnd = 0;
  var timerRinging = false;
  var audioCtx = null;

  function getAudioContext() {
    try {
      if (!audioCtx) {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(function () {});
      }
    } catch (e) {}
    return audioCtx;
  }

  function playTimerBeep() {
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var now = ctx.currentTime;
      var notes = [
        { f: 784, start: 0, dur: 0.13 },
        { f: 880, start: 0.15, dur: 0.13 },
        { f: 1046.5, start: 0.30, dur: 0.28 }
      ];
      notes.forEach(function (n) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.start);
        gain.gain.setValueAtTime(0.0001, now + n.start);
        gain.gain.exponentialRampToValueAtTime(0.22, now + n.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.02);
      });
    } catch (e) {}
  }

  function triggerTimerVibration() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([250, 150, 250, 150, 350]);
      } catch (e) {}
    }
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
      if (restEl) restEl.classList.remove('ringing');
      var st = $('timerStatus');
      if (st) st.hidden = true;
    }
  }

  function timerTick() {
    if (!timerRunning) return;
    var now = Date.now();
    var rem = Math.max(0, Math.ceil((timerTargetEnd - now) / 1000));
    if (rem !== timerLeft) {
      timerLeft = rem;
      updateTimerUI();
    }
    if (rem <= 0) {
      timerRunning = false;
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      timerRinging = true;
      updateTimerUI();
      playTimerBeep();
      triggerTimerVibration();
    }
  }

  function startTimerWith(sec) {
    getAudioContext();
    clearTimerRinging();
    timerPreset = sec;
    timerLeft = sec;
    timerTargetEnd = Date.now() + sec * 1000;
    timerRunning = true;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(timerTick, 200);
    updateTimerUI();
  }

  function togglePlayPause() {
    getAudioContext();
    clearTimerRinging();
    if (timerRunning) {
      // Pausar
      var now = Date.now();
      timerLeft = Math.max(0, Math.ceil((timerTargetEnd - now) / 1000));
      timerRunning = false;
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      updateTimerUI();
    } else {
      // Reanudar o Iniciar
      if (timerLeft <= 0) {
        timerLeft = timerPreset || 60;
      }
      timerTargetEnd = Date.now() + timerLeft * 1000;
      timerRunning = true;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(timerTick, 200);
      updateTimerUI();
    }
  }

  function resetTimer() {
    getAudioContext();
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

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && timerRunning) {
      timerTick();
    }
  });

  /* ---------- pestañas ---------- */
  var TABS = ['cardio', 'pesas', 'total'];
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
      if (window.PulseFitCharts && window.PulseFitCharts.render) {
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

  // Exponer API y referencias en PulseFit
  window.PulseFit.getState = function () {
    return {
      days: days,
      lifts: lifts,
      curLang: curLang,
      routineConfig: routineConfig,
      cardioConfig: cardioConfig
    };
  };
  window.PulseFit.getDays = function () { return days; };
  window.PulseFit.getLifts = function () { return lifts; };
  window.PulseFit.setDays = function (d) { days = d; };
  window.PulseFit.setLifts = function (l) { lifts = l; };
  window.PulseFit.setRoutineConfig = function (c) {
    if (c.goal && GOALS[c.goal]) routineConfig.goal = c.goal;
    if (c.split && SPLIT_DAYS[c.split]) routineConfig.split = c.split;
    if (Array.isArray(c.equipment) && c.equipment.length) routineConfig.equipment = c.equipment;
    saveConfig();
  };
  window.PulseFit.setCardioConfig = function (c) {
    if (c.goal && CARDIO_GOALS[c.goal]) cardioConfig.goal = c.goal;
    if (Array.isArray(c.equipment) && c.equipment.length) cardioConfig.equipment = c.equipment;
    saveCardioConfig();
  };
  window.PulseFit.applyLang = applyLang;
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
  window.PulseFit.getCanonicalExerciseKey = getCanonicalExerciseKey;
  window.PulseFit.days = days;
  window.PulseFit.lifts = lifts;
  window.PulseFit.routineConfig = routineConfig;
  window.PulseFit.cardioConfig = cardioConfig;

  showTab(location.hash.replace('#', ''));
  clearForm();
  $('gdate').value = iso(today());

  var initLang = detectLang();
  $('langSelect').addEventListener('change', function (e) { applyLang(e.target.value); });
  applyLang(initLang);
  syncTimerToGoal(routineConfig.goal);
  updateTimerUI();

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
