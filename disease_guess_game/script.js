/* ============================================================
  病历侦探小游戏 - 完整逻辑
  包含：18个病历、难度分级、提示系统、连对统计、庆祝动画
   ============================================================ */
"use strict";
console.log("✅ 脚本加载成功");

// ==================== 病历数据库 ====================
const allCases = [
    // ---- 简单 ----
    {
        difficulty: "easy",
        dept: "内科",
        description: "患者，女，45岁，空腹血糖 8.6 mmol/L，餐后2小时血糖 14.2 mmol/L，主诉多饮、多尿、多食，体重减轻1个月。",
        disease: "2型糖尿病",
        aliases: ["糖尿病", "二型糖尿病", "t2dm", "2型糖尿"],
        hint: "与胰岛素抵抗相关，常见三多一少症状，血糖明显升高。",
        knowledge: `<b>2型糖尿病</b>是最常见的糖尿病类型，占糖尿病患者90%以上，以胰岛素相对不足或抵抗为特征。\n\n<span class="highlight">护理重点：</span>饮食控制（低GI饮食、定时定量）、规律运动、血糖监测、足部护理（检查皮肤、防烫伤）、遵医嘱使用降糖药或胰岛素，宣教低血糖识别和处理。`
    },
    {
        difficulty: "easy",
        dept: "心内科",
        description: "患者，男，60岁，头痛、头晕多年，体检发现血压 162/102 mmHg，多次复测均高于正常值，无其他器质性病因。",
        disease: "高血压",
        aliases: ["原发性高血压", "高血压病"],
        hint: "最常见的慢性心血管疾病，需长期服药管理。",
        knowledge: `<b>高血压</b>是指收缩压≥140 mmHg和/或舒张压≥90 mmHg。是心脑血管疾病最重要的危险因素。\n\n<span class="highlight">护理重点：</span>低盐（每日<6g）低脂饮食、规律服药不能擅自停药、每日监测血压（同侧、同时、同体位）、避免情绪激动、防止直立性低血压（起身宜缓）。`
    },
    {
        difficulty: "easy",
        dept: "呼吸科",
        description: "患儿，女，6岁，发热4天，皮疹2天。皮疹为红色斑丘疹，从耳后、发际开始，蔓延至全身，口腔黏膜可见柯氏斑（Koplik斑）。",
        disease: "麻疹",
        aliases: ["麻疹", "measles"],
        hint: "儿童常见传染病，口腔内有特征性Koplik斑，皮疹从头向下蔓延。",
        knowledge: `<b>麻疹</b>是由麻疹病毒引起的急性呼吸道传染病，传染性极强。Koplik斑是早期诊断的特征性体征。\n\n<span class="highlight">护理要点：</span>隔离至出疹后5天，保持眼鼻口腔清洁，高热护理（温水擦浴，避免乙醇擦浴），补充水分，警惕肺炎、脑炎等并发症。`
    },
    {
        difficulty: "easy",
        dept: "骨科",
        description: "老年女性，75岁，摔倒后右髋部疼痛，右下肢不能活动，查体：右下肢外旋45°畸形，右腿较左腿缩短约2cm，X线可见股骨颈骨折线。",
        disease: "股骨颈骨折",
        aliases: ["股骨颈骨折", "髋部骨折"],
        hint: "老年人最常见骨折，与骨质疏松有关，典型表现为患肢外旋缩短。",
        knowledge: `<b>股骨颈骨折</b>是老年人常见骨折，常因骨质疏松+轻微外力导致。\n\n<span class="highlight">护理重点：</span>保持患肢外展中立位（禁止内收内旋）、预防深静脉血栓（抗血栓弹力袜、踝泵运动）、预防压力性损伤、鼓励早期功能锻炼、宣教防跌倒措施。`
    },

    // ---- 中等 ----
    {
        difficulty: "medium",
        dept: "呼吸科",
        description: "患者，男，65岁，反复咳嗽、咳痰10年，每年发作持续3个月以上，近2年活动后气短加重。肺功能检查：吸入支气管扩张剂后FEV₁/FVC < 70%。",
        disease: "慢性阻塞性肺疾病",
        aliases: ["慢阻肺", "copd", "慢性阻塞性肺病", "慢支", "慢性支气管炎"],
        hint: "以持续气流受限为特征，吸烟是首要危险因素，肺功能FEV₁/FVC < 70%是诊断标准。",
        knowledge: `<b>慢性阻塞性肺疾病（COPD）</b>是以不完全可逆的气流受限为特征的肺疾病，主要与吸烟有关。\n\n<span class="highlight">护理重点：</span>戒烟指导（最关键干预）、<span class="highlight">腹式呼吸+缩唇呼吸训练</span>、家庭氧疗（低流量吸氧，1-2L/min，每天≥15小时）、预防感染（接种流感疫苗）、监测呼吸困难程度。`
    },
    {
        difficulty: "medium",
        dept: "内分泌科",
        description: "女性，28岁，怕热多汗、心悸、手抖、体重下降3个月，查体：甲状腺Ⅱ°肿大，可闻及血管杂音，眼球突出，心率110次/分。",
        disease: "甲状腺功能亢进症",
        aliases: ["甲亢", "graves病", "甲状腺亢进", "甲状腺功能亢进"],
        hint: "高代谢症候群（怕热、多汗、消瘦）+甲状腺肿大+心率加快，注意眼征。",
        knowledge: `<b>甲状腺功能亢进症</b>由甲状腺激素分泌过多引起，Graves病最常见（自身免疫性）。\n\n<span class="highlight">护理重点：</span>高热量高蛋白高维生素饮食（禁高碘食物如海带、紫菜）、<span class="highlight">监测脉率和体温</span>、遵医嘱服抗甲状腺药物（定期查血常规，警惕粒细胞减少）、眼睛护理（润眼液、外出戴墨镜）、警惕甲状腺危象。`
    },
    {
        difficulty: "medium",
        dept: "泌尿外科",
        description: "老年男性，68岁，进行性排尿困难2年，夜尿增多（4-6次），尿频、排尿等待、尿流细弱。直肠指检：前列腺增大，质地均匀，中央沟变浅。",
        disease: "良性前列腺增生",
        aliases: ["前列腺增生", "bph", "前列腺肥大"],
        hint: "老年男性常见，以排尿症状（储尿期+排尿期+排尿后）为主要表现。",
        knowledge: `<b>良性前列腺增生（BPH）</b>是老年男性最常见的泌尿外科疾病。\n\n<span class="highlight">护理措施：</span>指导患者及时排尿（不憋尿）、避免使用抗胆碱能药物及利尿剂、睡前少饮水（减少夜尿）、观察有无急性尿潴留、行手术治疗者术后注意膀胱冲洗速度和颜色变化、预防出血。`
    },
    {
        difficulty: "medium",
        dept: "心内科",
        description: "患者，男，52岁，突发胸骨后压榨性疼痛，放射至左肩，持续30分钟不缓解，伴大汗、恶心、濒死感。心电图：Ⅱ、Ⅲ、aVF导联ST段弓背向上抬高。",
        disease: "急性心肌梗死",
        aliases: ["心梗", "心肌梗死", "急性心梗", "ami"],
        hint: "胸骨后持续压榨性疼痛>30分钟，硝酸甘油不能缓解，心电图ST段抬高。",
        knowledge: `<b>急性心肌梗死（AMI）</b>是冠状动脉急性闭塞导致心肌缺血坏死，为心脏急症。\n\n<span class="highlight">急救护理：</span>立即卧床休息、吸氧（2-4L/min）、建立静脉通路、监护心律、嚼服阿司匹林300mg（无禁忌时）、按医嘱镇痛（吗啡等）、<span class="highlight">尽早行再灌注治疗（PCI或溶栓）</span>。绝对卧床休息，避免用力排便（防诱发心律失常）。`
    },
    {
        difficulty: "medium",
        dept: "神经内科",
        description: "患者，男，70岁，突发右侧肢体无力、口角歪斜、言语不清2小时，既往高血压病史。CT：未见颅内出血灶。",
        disease: "脑梗死",
        aliases: ["脑梗", "缺血性脑卒中", "脑梗塞", "缺血性中风", "脑卒中"],
        hint: "突发局灶性神经功能缺损，CT排除出血，发病在时间窗内可溶栓。",
        knowledge: `<b>脑梗死</b>（缺血性脑卒中）是最常见的脑卒中类型，占60%-80%。\n\n<span class="highlight">护理重点：</span>严密监测生命体征（特别是血压、意识）、维持气道通畅、<span class="highlight">溶栓治疗护理</span>（监测出血倾向）、早期康复（肢体功能锻炼、防肌肉萎缩）、吞咽障碍者防误吸、卧床患者防压力性损伤。`
    },
    {
        difficulty: "medium",
        dept: "妇产科",
        description: "孕妇，30岁，妊娠36周，近2周出现头痛、视物模糊，血压156/104 mmHg，尿蛋白（+++），双下肢浮肿（++）。",
        disease: "子痫前期",
        aliases: ["重度妊高症", "妊娠高血压综合征", "先兆子痫", "妊娠期高血压疾病"],
        hint: "妊娠晚期出现高血压+蛋白尿+水肿三联征，需警惕发展为子痫（抽搐）。",
        knowledge: `<b>子痫前期</b>是妊娠特有的高血压疾病，重度以血压≥160/110 mmHg为标准。\n\n<span class="highlight">护理重点：</span>绝对卧床（左侧卧位改善胎盘血供）、<span class="highlight">硫酸镁解痉</span>（监测膝反射、尿量、呼吸，备葡萄糖酸钙解救）、监测胎动和胎心、控制液体入量、低盐饮食，预防子痫发作（保持环境安静，避免刺激）。`
    },

    // ---- 困难 ----
    {
        difficulty: "hard",
        dept: "消化科",
        description: "患者，男，40岁，反复上腹部烧灼感3年，餐后1小时加重，服用抗酸药可缓解，胃镜：胃角黏膜溃疡，直径0.8cm，边缘规则，Hp检测阳性。",
        disease: "消化性溃疡",
        aliases: ["胃溃疡", "消化性溃疡", "peptic ulcer"],
        hint: "Hp感染是最主要病因，胃溃疡餐后加重，十二指肠溃疡空腹/夜间痛，抗酸治疗有效。",
        knowledge: `<b>消化性溃疡</b>包括胃溃疡（GU）和十二指肠溃疡（DU）。Hp感染与NSAID使用是两大主要病因。\n\n<span class="highlight">护理重点：</span>规律饮食（细嚼慢咽、少量多餐）、戒酒戒烟、遵医嘱完成<span class="highlight">根除Hp方案</span>（铋剂四联，疗程14天，需全程服完）、监测有无出血（黑便、呕血）、穿孔（突发腹痛加剧）等并发症。`
    },
    {
        difficulty: "hard",
        dept: "肾内科",
        description: "患者，男，35岁，颜面及双下肢水肿，大量蛋白尿（>3.5g/d），血清白蛋白18g/L，血脂升高，无明显血尿和高血压。",
        disease: "肾病综合征",
        aliases: ["肾综", "nephrotic syndrome"],
        hint: "四联征：大量蛋白尿、低白蛋白血症、水肿、高脂血症——缺一不可。",
        knowledge: `<b>肾病综合征</b>是以大量蛋白尿（>3.5g/d）、低白蛋白血症（<30g/L）、水肿和高脂血症为特征的临床综合征。\n\n<span class="highlight">护理重点：</span>低盐低脂饮食、优质蛋白（0.8-1g/kg/d）、皮肤护理（水肿皮肤易破、感染）、监测尿量和体重、<span class="highlight">激素治疗护理</span>（长期使用糖皮质激素：防感染、防骨质疏松、不可骤然停药）、警惕血栓形成。`
    },
    {
        difficulty: "hard",
        dept: "血液科",
        description: "患者，女，20岁，面色苍白、乏力、头晕3个月，月经量多，查体：睑结膜苍白。血常规：Hb 72g/L，MCV 72fL，MCHC 0.28，血清铁蛋白降低。",
        disease: "缺铁性贫血",
        aliases: ["缺铁性贫血", "铁缺乏症", "iron deficiency anemia"],
        hint: "小细胞低色素性贫血，铁蛋白降低，有慢性失血病史（月经过多、痔疮等）。",
        knowledge: `<b>缺铁性贫血</b>是最常见的贫血类型，以小细胞低色素性贫血为特征。\n\n<span class="highlight">护理重点：</span>查找并治疗原发病（月经过多、溃疡出血等）、口服铁剂指导（饭后服、禁同服茶/咖啡/钙、可与VC同服促吸收、大便变黑属正常、疗程：症状消失后续服3-6个月）、饮食补铁（动物内脏、红肉、绿叶蔬菜）。`
    },
    {
        difficulty: "hard",
        dept: "传染科",
        description: "患者，男，30岁，高热5天，体温呈阶梯状上升，相对缓脉（心率与体温不成比例），腹部隐痛，右下腹轻压痛，肥达试验O凝集素1:160，H凝集素1:320，粪便细菌培养阳性。",
        disease: "伤寒",
        aliases: ["伤寒", "typhoid fever", "肠伤寒"],
        hint: "阶梯热+相对缓脉是特征性表现，肥达试验有诊断意义，伤寒杆菌引起。",
        knowledge: `<b>伤寒</b>是由伤寒杆菌引起的急性消化道传染病，粪-口传播。典型特征：阶梯热（前1周）、相对缓脉、脾大、玫瑰疹。\n\n<span class="highlight">护理重点：</span>消化道隔离（彻底消毒大小便）、<span class="highlight">高热时禁忌酒精擦浴和冰袋（可诱发肠出血、穿孔）</span>，推荐物理降温（冰敷颈部腹股沟）、卧床休息、流质软食（禁止粗糙硬食，防肠穿孔）、严密观察肠出血和肠穿孔。`
    },
    {
        difficulty: "hard",
        dept: "神经内科",
        description: "患者，女，65岁，进行性肢体震颤5年，以静止性震颤为主，双侧上肢呈「搓丸样」动作，肌强直，行走时小碎步、前倾，转身困难，慌张步态。",
        disease: "帕金森病",
        aliases: ["帕金森", "震颤麻痹", "parkinson"],
        hint: "静止性震颤+肌强直+运动迟缓+姿势步态不稳四主征，多巴胺不足所致。",
        knowledge: `<b>帕金森病</b>是以中脑黑质多巴胺能神经元变性丢失为特征的神经退行性疾病。\n\n<span class="highlight">护理重点：</span>安全护理（防跌倒、防烫伤）、<span class="highlight">左旋多巴用药护理</span>（餐前1h或餐后1.5h服药，避免高蛋白饮食影响吸收）、吞咽训练防误吸、鼓励主动功能锻炼（康复体操、平衡训练）、便秘护理、心理支持（长病程易抑郁）。`
    },
    {
        difficulty: "hard",
        dept: "呼吸科",
        description: "患者，男，25岁，清晨反复发作性喘息、胸闷、气短，伴咳嗽，可自行或用药后缓解，夜间及晨起加重，有过敏性鼻炎病史，PEF变异率>20%。",
        disease: "支气管哮喘",
        aliases: ["哮喘", "bronchial asthma", "支气管哮喘"],
        hint: "发作性喘息+可逆气流受限+夜间/晨间加重，过敏史，PEF变异率增大。",
        knowledge: `<b>支气管哮喘</b>是以气道慢性炎症和气道高反应性为特征的异质性疾病，发作性可逆气流受限。\n\n<span class="highlight">护理重点：</span>找出并回避变应原（尘螨、花粉、食物等）、正确使用吸入器（MDI先振荡、呼气后吸入、吸后屏气10秒、漱口防真菌感染）、<span class="highlight">峰流速仪（PEF）监测</span>（个人最佳值>80%绿区安全）、急性发作时立即吸入SABA（沙丁胺醇）、控制期长期低剂量ICS。`
    },
    {
        difficulty: "hard",
        dept: "免疫科",
        description: "女性，35岁，面部蝶形红斑，关节痛，光过敏，口腔溃疡，尿蛋白（+），抗核抗体（ANA）阳性（1:320），抗dsDNA抗体阳性，血细胞减少。",
        disease: "系统性红斑狼疮",
        aliases: ["红斑狼疮", "sle", "狼疮", "系统性红斑狼疮"],
        hint: "多系统损害+蝶形红斑+光过敏+ANA阳性，年轻女性多见，自身免疫病。",
        knowledge: `<b>系统性红斑狼疮（SLE）</b>是一种多系统受累的自身免疫性疾病，好发于育龄期女性。\n\n<span class="highlight">护理重点：</span><span class="highlight">防晒（外出遮阳、防晒霜，避免紫外线诱发加重）</span>、口腔黏膜护理、长期激素治疗护理（感染防控、骨质疏松、血糖）、避免使用诱发药物（普鲁卡因胺等）、避免疲劳和感染诱因、监测肾功能（最重要器官损害）。`
    },
    {
        difficulty: "hard",
        dept: "外科",
        description: "患者，男，55岁，进行性吞咽困难3个月，由固体食物到半流质，伴消瘦，胸骨后或剑突下疼痛。胃镜：食管中段溃疡型病变，病理：鳞状细胞癌。",
        disease: "食管癌",
        aliases: ["食道癌", "食管癌", "esophageal cancer"],
        hint: "进行性吞咽困难是最典型症状，由固体到液体逐渐加重，胃镜确诊。",
        knowledge: `<b>食管癌</b>常见于食管中段，鳞癌多见，与吸烟、饮酒、热烫食物等有关。\n\n<span class="highlight">护理重点：</span>术前营养支持（肠内营养）、维持气道通畅、<span class="highlight">术后胸腔引流管护理</span>（妥善固定、防扭曲、观察液量颜色）、半卧位预防反流、禁食期间肠外营养支持、吻合口瘘观察（术后5-10天发热/胸痛）、饮食指导（由稀到稠，少量多餐）。`
    }
];

// ==================== 游戏状态 ====================
let state = {
    difficulty: "easy",       // 当前难度
    currentCase: null,        // 当前病历对象
    caseIndex: 0,             // 当前题号（展示用）
    score: 0,                 // 总积分
    totalAnswered: 0,         // 总回答次数（不重复计当前题）
    correctCount: 0,          // 答对次数
    recentCases: [],          // 最近出现过的题目disease名（同难度内10题不重复）
    streak: 0,                // 当前连对数
    maxStreak: 0,             // 历史最大连对
    guessedCorrect: false,    // 当前题是否已猜对
    hintUsed: false,          // 当前题是否使用了提示
    revealed: false,          // 当前题是否已揭露答案（放弃）
    wrongCount: 0,            // 当前题连续猜错次数（用于自动提示）
    answeredCases: new Set(), // 已做过的题目disease名称（用于检测题库耗尽）
    hintPenalty: 10           // 使用提示扣分
};

// ==================== DOM引用 ====================
const $ = id => document.getElementById(id);
const caseDescDiv    = $("caseDescription");
const diseaseInput   = $("diseaseInput");
const submitBtn      = $("submitBtn");
const nextBtn        = $("nextBtn");
const giveupBtn      = $("giveupBtn");
const resultArea     = $("resultArea");
const knowledgeModal  = $("knowledgeModal");
const knowledgeContent = $("knowledgeContent");
const hintBtn        = $("hintBtn");
const hintArea       = $("hintArea");
const scoreSpan      = $("scoreCount");
const totalSpan      = $("totalCount");
const accuracySpan   = $("accuracyRate");
const streakSpan     = $("streakCount");
const caseNumSpan    = $("caseNum");
const caseDeptSpan   = $("caseDept");
const celebOverlay   = $("celebrationOverlay");
const celebEmoji     = $("celebEmoji");
const celebText      = $("celebText");
const knowledgeTag   = $("knowledgeDiseaseTag");

// ==================== 工具函数 ====================
function normalize(str) {
    if (!str) return "";
    return str.trim().toLowerCase()
        .replace(/[\s　]+/g, "")
        .replace(/（.*?）/g, "")  // 去括号注释
        .replace(/\(.*?\)/g, "");
}

function isMatch(input, c) {
    const norm = normalize(input);
    if (!norm || norm.length < 1) return false;
    const mainNorm = normalize(c.disease);
    if (norm === mainNorm) return true;
    for (let alias of c.aliases) {
        if (normalize(alias) === norm) return true;
    }
    // 包含匹配（用户输入是答案的子集，长度>=2）
    if (mainNorm.includes(norm) && norm.length >= 2) return true;
    // 答案包含用户输入（用户输入更精确）
    if (norm.includes(mainNorm) && mainNorm.length >= 2) return true;
    return false;
}

// 从当前难度池随机抽一道（10题内不重复）
const RECENT_WINDOW = 10; // 最近不重复窗口大小

function pickCase() {
    const pool = allCases.filter(c => c.difficulty === state.difficulty);
    if (pool.length === 0) return allCases[0];

    // 排除最近 RECENT_WINDOW 道题中已出现的（若候选不足则缩小排除范围）
    let excluded = new Set(state.recentCases);
    let candidates = pool.filter(c => !excluded.has(c.disease));

    // 若排除后无候选（题库条数 ≤ 窗口大小），逐步减少排除范围直到有候选
    if (candidates.length === 0) {
        // 只排除上一道（至少不连续重复）
        const last = state.recentCases[state.recentCases.length - 1];
        candidates = last ? pool.filter(c => c.disease !== last) : pool;
        if (candidates.length === 0) candidates = pool;
    }

    const idx = Math.floor(Math.random() * candidates.length);
    return { ...candidates[idx] };
}

// 答题结束后更新最近出题队列
function pushRecentCase(diseaseName) {
    state.recentCases.push(diseaseName);
    if (state.recentCases.length > RECENT_WINDOW) {
        state.recentCases.shift(); // 超出窗口则移除最早的
    }
}

// ==================== UI更新 ====================
function updateStats() {
    scoreSpan.textContent = state.score;
    totalSpan.textContent = state.totalAnswered;
    const rate = state.totalAnswered > 0
        ? Math.round((state.correctCount / state.totalAnswered) * 100) + "%"
        : "—";
    accuracySpan.textContent = rate;

    const streakText = state.streak >= 3
        ? `<span class="streak-flame">🔥</span>${state.streak}`
        : state.streak;
    streakSpan.innerHTML = streakText;
}

function showResult(type, msg) {
    resultArea.className = `result-area ${type}`;
    resultArea.innerHTML = msg;
    resultArea.style.display = "block";
    // 触发重排以重播动画
    resultArea.style.animation = "none";
    requestAnimationFrame(() => {
        resultArea.style.animation = "";
    });
}

function hideResult() {
    resultArea.style.display = "none";
}

// 显示科普弹窗
function showKnowledge(c) {
    knowledgeTag.textContent = c.disease;
    knowledgeContent.innerHTML = c.knowledge;
    knowledgeModal.style.display = "flex";
}

function hideKnowledge() {
    knowledgeModal.style.display = "none";
}

// 庆祝遮罩（短暂显示后消失）
function showCelebration(isStreak) {
    const emojis = ["🎉", "✨", "🏆", "⭐", "💯"];
    const streakMsgs = ["连对达成！", "太厉害了！", "医术精湛！"];
    celebEmoji.textContent = isStreak
        ? "🔥"
        : emojis[Math.floor(Math.random() * emojis.length)];
    celebText.textContent = isStreak
        ? `连对 ${state.streak} 次！${streakMsgs[Math.min(state.streak-2, streakMsgs.length-1)]}`
        : "诊断正确！";
    celebOverlay.style.display = "flex";
    setTimeout(() => {
        celebOverlay.style.display = "none";
    }, 1200);
}

// ==================== 核心逻辑 ====================
function loadNewCase() {
    state.currentCase = pickCase();
    state.caseIndex++;
    state.guessedCorrect = false;
    state.hintUsed = false;
    state.revealed = false;
    state.wrongCount = 0;

    // 打字机效果显示病历
    typewriterEffect(caseDescDiv, state.currentCase.description);

    caseNumSpan.textContent = state.caseIndex;
    caseDeptSpan.textContent = `科室：${state.currentCase.dept}`;

    diseaseInput.value = "";
    hideResult();
    hideKnowledge();
    hintBtn.disabled = false;
    hintBtn.textContent = "💡 获取提示";
    hintArea.style.display = "none";
    hintArea.textContent = "";

    diseaseInput.focus();
}

// 简单打字机效果
function typewriterEffect(el, text) {
    el.textContent = "";
    el.classList.add("typewriter");
    let i = 0;
    const speed = Math.max(12, Math.min(28, Math.floor(1200 / text.length)));
    const timer = setInterval(() => {
        if (i < text.length) {
            el.textContent += text[i];
            i++;
        } else {
            clearInterval(timer);
            el.classList.remove("typewriter");
        }
    }, speed);
}

function handleSubmit() {
    const userInput = diseaseInput.value.trim();
    if (!userInput) {
        showResult("warning", "⚠️ 请输入疾病名称后再提交诊断。");
        return;
    }
    if (state.guessedCorrect) {
        showResult("info", `✅ 你已经正确诊断了"${state.currentCase.disease}"！点击"下一病历"继续挑战。`);
        return;
    }
    if (state.revealed) {
        showResult("info", `📖 已查看答案，请点击「下一病历」继续挑战。`);
        return;
    }

    if (isMatch(userInput, state.currentCase)) {
        // 答对！
        state.guessedCorrect = true;
        state.correctCount++;
        state.totalAnswered++;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;
        state.answeredCases.add(state.currentCase.disease);
        pushRecentCase(state.currentCase.disease);
        collectCase(state.currentCase);

        // 计分（使用提示扣分）
        let earned = getDifficultyScore();
        if (state.hintUsed) earned = Math.max(0, earned - state.hintPenalty);
        state.score += earned;

        updateStats();

        const isStreakBonus = state.streak >= 2;
        showResult("correct",
            `🎉 诊断正确！疾病：<b>${state.currentCase.disease}</b>　+${earned}分${state.hintUsed ? "（已使用提示）" : ""}`
        );
        showKnowledge(state.currentCase);
        showCelebration(isStreakBonus);
        checkAchievements({ justCorrect: true });
        diseaseInput.blur();
    } else {
        // 答错：累加错误计数，给出对应级别渐进提示
        state.wrongCount++;
        state.streak = 0;
        updateStats();

        const hintText = getProgressiveHint(state.wrongCount, state.currentCase.disease);
        let errorMsg = `❌ 诊断错误。"${userInput}" 不是正确答案，仔细分析病历特征，再试试！<br>${hintText}`;

        showProgressiveHint(state.wrongCount);

        showResult("wrong", errorMsg);
        diseaseInput.select();
    }
}

function handleGiveUp() {
    if (state.guessedCorrect) {
        showResult("info", `✅ 你已经答对了，点击"下一病历"继续吧。`);
        return;
    }
    state.revealed = true;
    state.totalAnswered++;
    state.streak = 0;
    state.answeredCases.add(state.currentCase.disease);
    pushRecentCase(state.currentCase.disease);
    updateStats();
    showResult("info",
        `🏳️ 已放弃。正确答案是：<b>${state.currentCase.disease}</b>`
    );
    showKnowledge(state.currentCase);
}

function handleNext() {
    // 检测当前难度题库是否已全部答完
    if (isDifficultyComplete()) {
        showCompletionModal();
        return;
    }
    loadNewCase();
}

// 判断当前难度题库是否耗尽
function isDifficultyComplete() {
    const pool = allCases.filter(c => c.difficulty === state.difficulty);
    return pool.every(c => state.answeredCases.has(c.disease));
}

// 弹出题库完成弹窗
function showCompletionModal() {
    const difficultyNames = { easy: "简单", medium: "中等", hard: "困难" };
    const diffName = difficultyNames[state.difficulty] || "当前";
    const pool = allCases.filter(c => c.difficulty === state.difficulty);
    const totalInPool = pool.length;
    const accuracy = state.totalAnswered > 0
        ? Math.round((state.correctCount / state.totalAnswered) * 100)
        : 0;

    $("modalDifficulty").textContent = diffName;
    $("modalTotal").textContent = totalInPool;
    $("modalScore").textContent = state.score;
    $("modalAccuracy").textContent = accuracy + "%";
    $("modalMaxStreak").textContent = state.maxStreak;
    $("completionModal").style.display = "flex";

    // 触发通关成就
    checkAchievements({ justCompleted: state.difficulty });
}

function getDifficultyScore() {
    const map = { easy: 10, medium: 20, hard: 35 };
    return map[state.difficulty] || 10;
}

// ==================== 渐进式提示系统 ====================
// 根据错误次数返回逐级精确的提示
function getProgressiveHint(wrongCount, diseaseName) {
    const len = diseaseName.length;

    const levels = [
        // 第1次猜错：字数
        `💡 提示 Lv1：该疾病名称共 <b>${len}</b> 个字。`,
        // 第2次猜错：首字
        `💡 提示 Lv2：疾病名称共 ${len} 个字，第一个字是「<b>${diseaseName[0]}</b>」。`,
        // 第3次猜错：首尾字
        `💡 提示 Lv3：疾病名称共 ${len} 个字，首字「<b>${diseaseName[0]}</b>」，尾字「<b>${diseaseName[len-1]}</b>」。`,
        // 第4次猜错：隔位揭示（首字+中间字+尾字）
        (() => {
            if (len <= 2) return `💡 提示 Lv4：答案就是「<b>${diseaseName}</b>」…再想想？`;
            if (len === 3) return `💡 提示 Lv4：首字「<b>${diseaseName[0]}</b>」，尾字「<b>${diseaseName[2]}</b>」，中间是「<b>${diseaseName[1]}</b>」。`;
            const mid = Math.floor(len / 2);
            return `💡 提示 Lv4：首字「<b>${diseaseName[0]}</b>」，第${mid+1}字「<b>${diseaseName[mid]}</b>」，尾字「<b>${diseaseName[len-1]}</b>」。`;
        })(),
        // 第5次猜错：几乎揭晓，只缺一字
        (() => {
            const chars = [...diseaseName];
            const hideIdx = Math.floor(len / 2);
            const masked = chars.map((ch, i) => i === hideIdx ? '<span style="color:#dc2626;font-weight:800;">?</span>' : ch).join('');
            return `💡 提示 Lv5：答案：「${masked}」（还剩一字未知）。`;
        })()
    ];

    // 超出级别：直接揭晓
    if (wrongCount > levels.length) {
        return `💡 提示 Lv${wrongCount}：你已经很接近了！答案是「<b>${diseaseName}</b>」。`;
    }

    return levels[wrongCount - 1] || levels[0];
}

// 显示渐进提示到提示区域
function showProgressiveHint(wrongCount) {
    const hintText = getProgressiveHint(wrongCount, state.currentCase.disease);
    hintArea.innerHTML = hintText;
    hintArea.style.display = "block";
    hintBtn.disabled = true;
    hintBtn.textContent = `💡 提示 Lv${wrongCount}`;
}

// 手动提示按钮：使用与自动提示相同的内容，首次手动点等同于Lv1
function handleHint() {
    if (state.guessedCorrect || state.revealed) return;

    // 如果还没开始猜错，手动提示从Lv1开始
    if (state.wrongCount === 0) {
        state.wrongCount = 1;
    } else {
        state.wrongCount++;
    }
    state.hintUsed = true;

    showProgressiveHint(state.wrongCount);
    hintArea.style.display = "block";
}

// ==================== 难度切换 ====================
document.querySelectorAll(".diff-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.difficulty = btn.dataset.diff;
        state.answeredCases = new Set();  // 切换难度重置已答记录
        state.recentCases = [];           // 切换难度重置最近出题队列
        $("completionModal").style.display = "none";
        loadNewCase();
    });
});

// ==================== 事件绑定 ====================
submitBtn.addEventListener("click", handleSubmit);
nextBtn.addEventListener("click", handleNext);
giveupBtn.addEventListener("click", handleGiveUp);
hintBtn.addEventListener("click", handleHint);

diseaseInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleSubmit();
});

// 点击庆祝遮罩可提前关闭
celebOverlay.addEventListener("click", () => {
    celebOverlay.style.display = "none";
});

// 题库完成弹窗按钮
$("modalRestart").addEventListener("click", () => {
    $("completionModal").style.display = "none";
    state.answeredCases = new Set();
    state.recentCases = [];
    state.caseIndex = 0;
    loadNewCase();
});

$("modalClose").addEventListener("click", () => {
    $("completionModal").style.display = "none";
});

// 知识弹窗关闭按钮
$("knowledgeCloseBtn").addEventListener("click", hideKnowledge);

// 点击弹窗遮罩关闭
knowledgeModal.addEventListener("click", (e) => {
    if (e.target === knowledgeModal) hideKnowledge();
});

// ==================== 成就系统 ====================
const ACHIEVEMENTS = [
    {
        id: "first_blood",
        icon: "🩺",
        name: "初出茅庐",
        desc: "答对第一道病历"
    },
    {
        id: "streak_3",
        icon: "🔥",
        name: "三连诊断",
        desc: "连续答对 3 题"
    },
    {
        id: "streak_5",
        icon: "⚡",
        name: "五连诊断",
        desc: "连续答对 5 题"
    },
    {
        id: "streak_10",
        icon: "👑",
        name: "十连诊断",
        desc: "连续答对 10 题"
    },
    {
        id: "no_hint",
        icon: "✨",
        name: "火眼金睛",
        desc: "零提示一次答对"
    },
    {
        id: "clean_5",
        icon: "🎯",
        name: "完美诊断",
        desc: "连续 5 题均未使用任何提示"
    },
    {
        id: "comeback",
        icon: "💪",
        name: "百折不挠",
        desc: "猜错 5 次以上仍然答对"
    },
    {
        id: "score_100",
        icon: "🌟",
        name: "积分达人",
        desc: "累计积分达到 100"
    },
    {
        id: "score_300",
        icon: "💎",
        name: "积分大师",
        desc: "累计积分达到 300"
    },
    {
        id: "clear_easy",
        icon: "🏅",
        name: "简单全通",
        desc: "完成简单难度全部题库"
    },
    {
        id: "clear_medium",
        icon: "🏆",
        name: "中等全通",
        desc: "完成中等难度全部题库"
    },
    {
        id: "clear_hard",
        icon: "🎖️",
        name: "困难全通",
        desc: "完成困难难度全部题库"
    }
];

// 从 localStorage 读取已解锁成就
function loadAchievements() {
    try {
        return JSON.parse(localStorage.getItem("dgg_achievements") || "{}");
    } catch { return {}; }
}

// 保存成就到 localStorage
function saveAchievements() {
    localStorage.setItem("dgg_achievements", JSON.stringify(unlockedAchievements));
}

let unlockedAchievements = loadAchievements(); // { id: { time: "2026-06-01 14:00" } }

// 连续无提示计数器（跨题持久）
let cleanStreakCount = 0; // 未用提示连续答对次数

// 解锁成就（若未解锁则弹 toast）
function unlockAchievement(id) {
    if (unlockedAchievements[id]) return; // 已解锁，跳过
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    unlockedAchievements[id] = { time: timeStr };
    saveAchievements();

    updateAchievementBadge();
    showAchievementToast(ach);
}

// 浮动 toast 提示
let toastTimer = null;
function showAchievementToast(ach) {
    const toast = $("achievementToast");
    $("toastIcon").textContent = ach.icon;
    $("toastName").textContent = ach.name;
    toast.classList.remove("hiding");
    toast.style.display = "flex";

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add("hiding");
        setTimeout(() => { toast.style.display = "none"; }, 350);
    }, 2800);
}

// 更新头部成就小红点：仅当有「未查看的新成就」时显示
function updateAchievementBadge() {
    const totalUnlocked = Object.keys(unlockedAchievements).length;
    const seen = parseInt(localStorage.getItem("dgg_ach_seen") || "0", 10);
    const badge = $("achievementBadge");
    const newCount = totalUnlocked - seen;
    if (newCount > 0) {
        badge.textContent = newCount;
        badge.style.display = "inline-flex";
    } else {
        badge.style.display = "none";
    }
}

// 检测所有成就（在答对/完成难度后调用）
function checkAchievements({ justCorrect = false, justCompleted = null } = {}) {
    if (justCorrect) {
        if (state.correctCount >= 1) unlockAchievement("first_blood");
        if (state.streak >= 3)  unlockAchievement("streak_3");
        if (state.streak >= 5)  unlockAchievement("streak_5");
        if (state.streak >= 10) unlockAchievement("streak_10");
        if (!state.hintUsed)    unlockAchievement("no_hint");
        if (state.wrongCount >= 5) unlockAchievement("comeback");
        if (state.score >= 100) unlockAchievement("score_100");
        if (state.score >= 300) unlockAchievement("score_300");

        // 连续无提示计数
        if (!state.hintUsed) {
            cleanStreakCount++;
            if (cleanStreakCount >= 5) unlockAchievement("clean_5");
        } else {
            cleanStreakCount = 0;
        }
    }
    if (justCompleted === "easy")   unlockAchievement("clear_easy");
    if (justCompleted === "medium") unlockAchievement("clear_medium");
    if (justCompleted === "hard")   unlockAchievement("clear_hard");
}

// 渲染成就大厅
function renderAchievementsModal() {
    const list = $("achievementsList");
    const total = ACHIEVEMENTS.length;
    const unlocked = Object.keys(unlockedAchievements).length;
    $("achievementsProgress").textContent = `已解锁 ${unlocked} / ${total}`;

    list.innerHTML = ACHIEVEMENTS.map(ach => {
        const isUnlocked = !!unlockedAchievements[ach.id];
        const timeText = isUnlocked ? `<div class="ach-unlocked-time">🕐 ${unlockedAchievements[ach.id].time}</div>` : "";
        return `
        <div class="achievement-item ${isUnlocked ? "unlocked" : "locked"}">
            <div class="ach-icon">${ach.icon}</div>
            <div class="ach-info">
                <div class="ach-name">${ach.name}</div>
                <div class="ach-desc">${ach.desc}</div>
                ${timeText}
            </div>
        </div>`;
    }).join("");
}

// 成就入口按钮 & 成就弹窗关闭
$("achievementsBtn").addEventListener("click", () => {
    renderAchievementsModal();
    $("achievementsModal").style.display = "flex";
    // 标记已读：记录当前解锁数量，消除红点
    const seen = Object.keys(unlockedAchievements).length;
    localStorage.setItem("dgg_ach_seen", String(seen));
    $("achievementBadge").style.display = "none";
});
$("achievementsCloseBtn").addEventListener("click", () => {
    $("achievementsModal").style.display = "none";
});
$("achievementsModal").addEventListener("click", e => {
    if (e.target === $("achievementsModal")) $("achievementsModal").style.display = "none";
});

// 初始化时更新成就角标
updateAchievementBadge();

// ==================== 病例收藏系统 ====================
// 从 localStorage 读取收藏
function loadCollection() {
    try {
        return JSON.parse(localStorage.getItem("dgg_collection") || "[]");
    } catch { return []; }
}
function saveCollection() {
    localStorage.setItem("dgg_collection", JSON.stringify(collectedCases));
}

let collectedCases = loadCollection(); // [{ disease, dept, difficulty, knowledge, time }]

// 答对时将病历加入收藏（去重：同疾病名只存一次）
function collectCase(caseData) {
    if (collectedCases.some(c => c.disease === caseData.disease)) return; // 已收藏
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    collectedCases.push({
        disease: caseData.disease,
        dept: caseData.dept,
        difficulty: caseData.difficulty,
        knowledge: caseData.knowledge,
        time: timeStr
    });
    saveCollection();
    updateCollectionBadge();
}

// 渲染收藏弹窗
let collectionFilter = "all"; // 当前筛选

function renderCollectionModal() {
    const diffNames = { easy: "简单", medium: "中等", hard: "困难" };
    const total = 18; // 总病历数
    $("collectionProgress").textContent = `已收集 ${collectedCases.length} / ${total}`;

    const filtered = collectionFilter === "all"
        ? collectedCases
        : collectedCases.filter(c => c.difficulty === collectionFilter);

    const list = $("collectionList");
    if (filtered.length === 0) {
        list.innerHTML = `<div class="collection-empty">📭 ${collectionFilter === "all" ? "还没有收集任何病例，快去答对吧！" : "该难度暂无收藏"}</div>`;
        return;
    }

    list.innerHTML = filtered.map(c => `
        <div class="collection-case-item">
            <div class="collection-case-header">
                <span class="collection-case-dept">${c.dept}</span>
                <span class="collection-case-disease">${c.disease}</span>
                <span class="collection-case-diff ${c.difficulty}">${diffNames[c.difficulty]}</span>
            </div>
            <div class="collection-case-knowledge">${c.knowledge}</div>
            <div class="collection-case-time">🕐 ${c.time}</div>
        </div>
    `).join("");
}

// 筛选标签点击
document.querySelectorAll(".collection-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".collection-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        collectionFilter = tab.dataset.filter;
        renderCollectionModal();
    });
});

// 打开收藏弹窗
$("collectionBtn").addEventListener("click", () => {
    collectionFilter = "all";
    document.querySelectorAll(".collection-tab").forEach((t, i) => t.classList.toggle("active", i === 0));
    renderCollectionModal();
    $("collectionModal").style.display = "flex";
    // 标记已读
    const seen = collectedCases.length;
    localStorage.setItem("dgg_col_seen", String(seen));
    $("collectionBadge").style.display = "none";
});
$("collectionCloseBtn").addEventListener("click", () => {
    $("collectionModal").style.display = "none";
});
$("collectionModal").addEventListener("click", e => {
    if (e.target === $("collectionModal")) $("collectionModal").style.display = "none";
});

// 更新收藏角标：仅当有未查看的
function updateCollectionBadge() {
    const total = collectedCases.length;
    const seen = parseInt(localStorage.getItem("dgg_col_seen") || "0", 10);
    const badge = $("collectionBadge");
    const newCount = total - seen;
    if (newCount > 0) {
        badge.textContent = newCount;
        badge.style.display = "inline-flex";
    } else {
        badge.style.display = "none";
    }
}

// 初始化收藏角标
updateCollectionBadge();

// ==================== 深色模式 ====================
const darkModeToggle = $("darkModeToggle");

// 页面加载时读取已保存的偏好
(function applyStoredTheme() {
    const saved = localStorage.getItem("dgg_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateDarkIcon(theme);
})();

function updateDarkIcon(theme) {
    darkModeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    darkModeToggle.title = theme === "dark" ? "切换浅色模式" : "切换深色模式";
}

darkModeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("dgg_theme", next);
    updateDarkIcon(next);
});

// ==================== 初始化 ====================
function init() {
    state.score = 0;
    state.totalAnswered = 0;
    state.correctCount = 0;
    state.streak = 0;
    state.caseIndex = 0;
    updateStats();
    loadNewCase();
}

init();
