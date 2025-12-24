
import { Word, Tense, EssayTopic, QuestionType, QuizQuestion } from './types';

export const MOCK_WORDS: Word[] = [
  {
    id: '1',
    spelling: 'adapt',
    phonetic: '/əˈdæpt/',
    partOfSpeech: 'v.',
    meaning: '适应；改编',
    example: 'It took him a while to adapt to the new surroundings.',
    exampleTrans: '他花了一段时间才适应新环境。',
    year: '2023年完形填空',
    frequency: 'HIGH',
    collocations: ['adapt to (适应)', 'adapt for (为...改编)'],
    confusion: [{ word: 'adopt', diff: 'adopt 意为收养、采纳' }],
    memoryTip: 'ad(朝向) + apt(适合) = 去适合 = 适应'
  },
  {
    id: '2',
    spelling: 'benefit',
    phonetic: '/ˈbenɪfɪt/',
    partOfSpeech: 'v./n.',
    meaning: '有益于；利益',
    example: 'The new policy will benefit the disabled.',
    exampleTrans: '新政策将惠及残疾人。',
    year: '2021年阅读理解',
    frequency: 'HIGH',
    collocations: ['benefit from (得益于)', 'for the benefit of (为了...的利益)']
  },
  {
    id: '3',
    spelling: 'economic',
    phonetic: '/ˌiːkəˈnɒmɪk/',
    partOfSpeech: 'adj.',
    meaning: '经济的',
    example: 'The country is facing great economic difficulties.',
    exampleTrans: '这个国家正面临巨大的经济困难。',
    year: '2022年翻译',
    frequency: 'HIGH',
    confusion: [{ word: 'economical', diff: 'economical 意为节约的、实惠的' }]
  },
  {
    id: '4',
    spelling: 'maintain',
    phonetic: '/meɪnˈteɪn/',
    partOfSpeech: 'v.',
    meaning: '维持；保持',
    example: 'It is hard to maintain a balance between work and life.',
    exampleTrans: '很难在工作和生活之间保持平衡。',
    year: '2020年单选',
    frequency: 'HIGH',
    collocations: ['maintain order (维持秩序)', 'maintain contact (保持联系)'],
    memoryTip: 'main(主要的) + tain(拿) = 拿住主要的 = 维持'
  },
  {
    id: '5',
    spelling: 'opportunity',
    phonetic: '/ˌɒpəˈtjuːnəti/',
    partOfSpeech: 'n.',
    meaning: '机会',
    example: 'I would like to take this opportunity to thank you all.',
    exampleTrans: '我想借此机会感谢大家。',
    year: '2023年作文',
    frequency: 'HIGH',
    collocations: ['seize the opportunity (抓住机会)', 'opportunity for (…的机会)']
  },
  {
    id: '6',
    spelling: 'efficient',
    phonetic: '/ɪˈfɪʃnt/',
    partOfSpeech: 'adj.',
    meaning: '效率高的',
    example: 'We need to find a more efficient way to solve the problem.',
    exampleTrans: '我们需要找到解决这个问题更高效的方法。',
    year: '2021年完形填空',
    frequency: 'HIGH',
    confusion: [{ word: 'effective', diff: 'effective 意为有效的（有效果），efficient 强调效率高' }]
  },
  {
    id: '7',
    spelling: 'consume',
    phonetic: '/kənˈsjuːm/',
    partOfSpeech: 'v.',
    meaning: '消耗；消费',
    example: 'Computers consume a huge amount of energy.',
    exampleTrans: '计算机消耗大量的能源。',
    year: '2022年阅读理解',
    frequency: 'HIGH',
    collocations: ['consume time (耗时)', 'consume energy (耗能)'],
    memoryTip: 'con(全部) + sume(拿) = 全部拿走 = 消耗'
  },
  {
    id: '8',
    spelling: 'attitude',
    phonetic: '/ˈætɪtjuːd/',
    partOfSpeech: 'n.',
    meaning: '态度',
    example: 'Your attitude towards life determines your future.',
    exampleTrans: '你对生活的态度决定了你的未来。',
    year: '2022年完形填空',
    frequency: 'HIGH',
    collocations: ['attitude to/towards (对…的态度)', 'positive attitude (积极的态度)']
  },
  {
    id: '9',
    spelling: 'available',
    phonetic: '/əˈveɪləbl/',
    partOfSpeech: 'adj.',
    meaning: '可获得的；有空的',
    example: 'Tickets are available at the box office.',
    exampleTrans: '售票处有票出售。',
    year: '2021年单选',
    frequency: 'HIGH',
    collocations: ['available for (可用于)', 'make available (使可用)']
  },
  {
    id: '10',
    spelling: 'community',
    phonetic: '/kəˈmjuːnəti/',
    partOfSpeech: 'n.',
    meaning: '社区；社会',
    example: 'He is well-known in the local community.',
    exampleTrans: '他在当地社区很有名。',
    year: '2020年阅读理解',
    frequency: 'HIGH',
    collocations: ['sense of community (归属感)', 'serve the community (服务社区)']
  },
  {
    id: '11',
    spelling: 'impact',
    phonetic: '/ˈɪmpækt/',
    partOfSpeech: 'n./v.',
    meaning: '影响；冲击',
    example: 'The internet has a great impact on our daily life.',
    exampleTrans: '互联网对我们的日常生活有很大影响。',
    year: '2023年作文',
    frequency: 'HIGH',
    collocations: ['have an impact on (对…有影响)']
  },
  {
    id: '12',
    spelling: 'solution',
    phonetic: '/səˈluːʃn/',
    partOfSpeech: 'n.',
    meaning: '解决办法',
    example: 'We must find a solution to the pollution problem.',
    exampleTrans: '我们必须找到解决污染问题的办法。',
    year: '2019年写作',
    frequency: 'HIGH',
    collocations: ['solution to (…的解决办法)']
  },
  {
    id: '13',
    spelling: 'prevent',
    phonetic: '/prɪˈvent/',
    partOfSpeech: 'v.',
    meaning: '预防；阻止',
    example: 'Nothing can prevent us from going forward.',
    exampleTrans: '没有什么能阻止我们要前进。',
    year: '2021年单选',
    frequency: 'HIGH',
    collocations: ['prevent sb from doing (阻止某人做某事)'],
    confusion: [{ word: 'protect', diff: 'protect 意为保护，prevent 意为阻止发生' }]
  },
  {
    id: '14',
    spelling: 'essential',
    phonetic: '/ɪˈsenʃl/',
    partOfSpeech: 'adj.',
    meaning: '必不可少的；本质的',
    example: 'Water is essential for life.',
    exampleTrans: '水对于生命是必不可少的。',
    year: '2022年单选',
    frequency: 'HIGH',
    collocations: ['it is essential that (…是必须的)']
  },
  {
    id: '15',
    spelling: 'challenge',
    phonetic: '/ˈtʃælɪndʒ/',
    partOfSpeech: 'n./v.',
    meaning: '挑战',
    example: 'He faced many challenges in his new job.',
    exampleTrans: '他在新工作中面临许多挑战。',
    year: '2019年阅读理解',
    frequency: 'HIGH',
    collocations: ['face a challenge (面临挑战)', 'accept a challenge (接受挑战)']
  },
  {
    id: '16',
    spelling: 'affect',
    phonetic: '/əˈfekt/',
    partOfSpeech: 'v.',
    meaning: '影响；感动',
    example: 'Smoking affects health.',
    exampleTrans: '吸烟影响健康。',
    year: '2021年单选',
    frequency: 'HIGH',
    collocations: ['greatly affect (极大地影响)'],
    confusion: [{ word: 'effect', diff: 'effect 通常作名词(效果)，affect 通常作动词(影响)' }]
  },
  {
    id: '17',
    spelling: 'afford',
    phonetic: '/əˈfɔːd/',
    partOfSpeech: 'v.',
    meaning: '买得起；承担得起',
    example: 'I cannot afford a new car.',
    exampleTrans: '我买不起新车。',
    year: '2020年完形填空',
    frequency: 'HIGH',
    collocations: ['afford to do (负担得起做某事)']
  },
  {
    id: '18',
    spelling: 'claim',
    phonetic: '/kleɪm/',
    partOfSpeech: 'v./n.',
    meaning: '声称；索取',
    example: 'He claimed to be an expert in this field.',
    exampleTrans: '他声称是这个领域的专家。',
    year: '2022年阅读理解',
    frequency: 'HIGH',
    collocations: ['claim responsibility (声称负责)']
  },
  {
    id: '19',
    spelling: 'demand',
    phonetic: '/dɪˈmɑːnd/',
    partOfSpeech: 'v./n.',
    meaning: '要求；需求',
    example: 'The workers demanded higher wages.',
    exampleTrans: '工人们要求更高的工资。',
    year: '2019年单选',
    frequency: 'HIGH',
    collocations: ['in demand (受欢迎)', 'meet the demand (满足需求)']
  },
  {
    id: '20',
    spelling: 'encourage',
    phonetic: '/ɪnˈkʌrɪdʒ/',
    partOfSpeech: 'v.',
    meaning: '鼓励',
    example: 'My parents encouraged me to learn English.',
    exampleTrans: '我父母鼓励我学英语。',
    year: '2020年完形填空',
    frequency: 'HIGH',
    collocations: ['encourage sb to do (鼓励某人做某事)']
  },
  {
    id: '21',
    spelling: 'frequently',
    phonetic: '/ˈfriːkwəntli/',
    partOfSpeech: 'adv.',
    meaning: '频繁地',
    example: 'He frequently visits the library.',
    exampleTrans: '他经常去图书馆。',
    year: '2022年单选',
    frequency: 'HIGH',
    confusion: [{ word: 'fluently', diff: 'fluently 意为流利地，frequently 意为频繁地' }]
  },
  {
    id: '22',
    spelling: 'gather',
    phonetic: '/ˈɡæðə(r)/',
    partOfSpeech: 'v.',
    meaning: '聚集；收集',
    example: 'A crowd gathered around the accident scene.',
    exampleTrans: '一群人聚集在事故现场周围。',
    year: '2019年阅读理解',
    frequency: 'HIGH',
    collocations: ['gather information (收集信息)']
  },
  {
    id: '23',
    spelling: 'intend',
    phonetic: '/ɪnˈtend/',
    partOfSpeech: 'v.',
    meaning: '打算；想要',
    example: 'I intend to study abroad next year.',
    exampleTrans: '我打算明年出国留学。',
    year: '2021年单选',
    frequency: 'HIGH',
    collocations: ['intend to do (打算做某事)']
  },
  {
    id: '24',
    spelling: 'involve',
    phonetic: '/ɪnˈvɒlv/',
    partOfSpeech: 'v.',
    meaning: '涉及；包含',
    example: 'The accident involved three cars.',
    exampleTrans: '这起事故涉及三辆车。',
    year: '2023年完形填空',
    frequency: 'HIGH',
    collocations: ['be involved in (卷入/参与)']
  },
  {
    id: '25',
    spelling: 'occur',
    phonetic: '/əˈkɜː(r)/',
    partOfSpeech: 'v.',
    meaning: '发生；出现',
    example: 'The idea occurred to me last night.',
    exampleTrans: '我昨晚突然想到了这个主意。',
    year: '2020年阅读理解',
    frequency: 'HIGH',
    collocations: ['it occurs to sb that (某人突然想到)']
  },
  {
    id: '26',
    spelling: 'positive',
    phonetic: '/ˈpɒzətɪv/',
    partOfSpeech: 'adj.',
    meaning: '积极的；肯定的',
    example: 'We should take a positive attitude towards failure.',
    exampleTrans: '我们应该对失败持积极态度。',
    year: '2023年作文',
    frequency: 'HIGH',
    confusion: [{ word: 'negative', diff: 'negative 意为消极的' }]
  },
  {
    id: '27',
    spelling: 'provide',
    phonetic: '/prə\u02c8va\u026ad/',
    partOfSpeech: 'v.',
    meaning: '提供',
    example: 'The school provided us with free lunch.',
    exampleTrans: '学校为我们提供免费午餐。',
    year: '2019年完形填空',
    frequency: 'HIGH',
    collocations: ['provide sb with sth (提供某人某物)', 'provide sth for sb (提供某物给某人)']
  },
  {
    id: '28',
    spelling: 'recommend',
    phonetic: '/\u02ccrek\u0259\u02c8mend/',
    partOfSpeech: 'v.',
    meaning: '推荐；建议',
    example: 'I recommend this book to all students.',
    exampleTrans: '我向所有学生推荐这本书。',
    year: '2022年作文',
    frequency: 'HIGH',
    collocations: ['recommend doing (建议做某事)']
  },
  {
    id: '29',
    spelling: 'replace',
    phonetic: '/r\u026a\u02c8ple\u026as/',
    partOfSpeech: 'v.',
    meaning: '取代；替换',
    example: 'Robots will replace humans in some jobs.',
    exampleTrans: '机器人在某些工作中将取代人类。',
    year: '2021年完形填空',
    frequency: 'HIGH',
    collocations: ['replace A with B (用B替换A)']
  },
  {
    id: '30',
    spelling: 'unique',
    phonetic: '/ju\u02c8ni\u02d0k/',
    partOfSpeech: 'adj.',
    meaning: '独特的',
    example: 'Everyone has a unique fingerprint.',
    exampleTrans: '每个人都有独特的指纹。',
    year: '2019年阅读理解',
    frequency: 'HIGH',
    collocations: ['unique to (\u2026特有的)']
  }
];

export const MOCK_QUIZ: QuizQuestion[] = [
  { id: 'q1', wordId: '1', type: QuestionType.MEANING_MATCH, question: 'adapt', options: ['适应', '收养', '放弃', '通过'], correctAnswer: '适应', explanation: 'adapt 意为适应；adopt 意为收养/采纳。' },
  { id: 'q2', wordId: '1', type: QuestionType.SPELLING, question: '适应 v. /əˈdæpt/', correctAnswer: 'adapt', explanation: 'ad(朝向) + apt(适合) = adapt' },
  { id: 'q3', wordId: '2', type: QuestionType.COLLOCATION, question: 'The new policy will ______ the disabled.', options: ['benefit', 'harm', 'ignore', 'punish'], correctAnswer: 'benefit', explanation: '根据句意“新政策将惠及残疾人”，benefit 意为有益于。' },
  { id: 'q4', wordId: '3', type: QuestionType.CONFUSION, question: 'The car is very ______ to run because it uses little gas.', options: ['economical', 'economic', 'economy', 'economics'], correctAnswer: 'economical', explanation: 'economic 意为“经济的（与贸易工业相关）”，economical 意为“节约的”。句意为省油，故选 economical。' },
  { id: 'q5', wordId: '4', type: QuestionType.COLLOCATION, question: 'It is important to ______ a healthy diet.', options: ['maintain', 'remain', 'contain', 'obtain'], correctAnswer: 'maintain', explanation: 'maintain a diet 为固定搭配，意为“保持饮食习惯”。' },
  { id: 'q6', wordId: '5', type: QuestionType.MEANING_MATCH, question: 'opportunity', options: ['机会', '操作', '反对', '选择'], correctAnswer: '机会', explanation: 'opportunity 意为机会，chance 的同义词。' },
  { id: 'q7', wordId: '6', type: QuestionType.SPELLING, question: '效率高的 adj. /ɪˈfɪʃnt/', correctAnswer: 'efficient', explanation: '注意后缀 -cient 的拼写。' },
  { id: 'q8', wordId: '7', type: QuestionType.MEANING_MATCH, question: 'consume', options: ['消耗', '假设', '简历', '包含'], correctAnswer: '消耗', explanation: 'consume 意为消耗、消费。assume 假设，resume 简历，contain 包含。' },
  { id: 'q9', wordId: '13', type: QuestionType.COLLOCATION, question: 'Bad weather ______ us from starting our trip.', options: ['prevented', 'protected', 'presented', 'prepared'], correctAnswer: 'prevented', explanation: 'prevent sb from doing sth 是固定搭配，意为“阻止某人做某事”。' },
  { id: 'q10', wordId: '14', type: QuestionType.SPELLING, question: '必不可少的 adj. /ɪˈsenʃl/', correctAnswer: 'essential', explanation: 'essential = necessary, vital.' },
  { id: 'q16', wordId: '16', type: QuestionType.CONFUSION, question: 'The noise outside ______ my sleep.', options: ['affected', 'effected', 'offered', 'afforded'], correctAnswer: 'affected', explanation: 'affect 是动词“影响”，effect 是名词“效果”。此处缺动词，故选 affected。' },
  { id: 'q18', wordId: '18', type: QuestionType.MEANING_MATCH, question: 'claim', options: ['声称', '攀登', '鼓掌', '责备'], correctAnswer: '声称', explanation: 'claim 声称；climb 攀登；clap 鼓掌；blame 责备。' },
  { id: 'q21', wordId: '21', type: QuestionType.CONFUSION, question: 'He speaks English very ______.', options: ['fluently', 'frequently', 'finally', 'friendly'], correctAnswer: 'fluently', explanation: 'fluently 流利地；frequently 频繁地。修饰说语言，应用 fluently。' },
  { id: 'q27', wordId: '27', type: QuestionType.COLLOCATION, question: 'The hotel ______ guests with free Wi-Fi.', options: ['provides', 'offers', 'gives', 'shows'], correctAnswer: 'provides', explanation: 'provide sb with sth 是固定搭配。offer/give 接双宾语 offer sb sth。' }
];

export const MOCK_TENSES: Tense[] = [
  {
    id: 't_present_perfect',
    name: '现在完成时 (Present Perfect)',
    description: '表示动作发生在过去，但对现在有影响；或动作从过去持续到现在。',
    structure: 'have/has + done',
    keywords: ['since', 'for', 'already', 'yet', 'so far', 'up to now'],
    mnemonic: 'since/for连，动作已完成，影响到现在',
    examples: [
      {
        en: 'I have lived here for ten years.',
        cn: '我住在这里已经十年了。',
        note: 'for + 时间段，表示持续',
        year: '2020'
      }
    ],
    detailedStructures: [
      {
        subject: "第一/二人称/复数 (I/You/We/They)",
        affirmative: "S + have done",
        affirmativeExample: "I have finished the work. (2022 完形)",
        negative: "S + haven't done",
        negativeExample: "We haven't met before. (2021 单选)",
        question: "Have + S + done?",
        questionExample: "Have you seen him? (2020 听力)"
      },
      {
        subject: "第三人称单数 (He/She/It)",
        affirmative: "S + has done",
        affirmativeExample: "She has gone to Beijing. (2023 阅读)",
        negative: "S + hasn't done",
        negativeExample: "He hasn't arrived yet. (2019 改错)",
        question: "Has + S + done?",
        questionExample: "Has it stopped raining? (2021 单选)"
      }
    ],
    scenarios: [
      {
        name: "动作发生在过去但强调对现在的影响",
        correctExample: "I have lost my key. (So I can't enter the room now.)",
        wrongExample: "I lost my key. (Just a past fact)",
        wrongReason: "如果强调结果导致现在进不去房间，应用现在完成时。"
      }
    ],
    commonErrors: [
      {
        point: "短暂性动词与一段时间连用",
        wrong: "He has died for 3 years.",
        correct: "He has been dead for 3 years.",
        tip: "die是瞬间动词，不能与for/since连用，需改为延续性状态 be dead。"
      }
    ],
    exercises: []
  },
  {
    id: 't_simple_past',
    name: '一般过去时 (Simple Past)',
    description: '表示过去某个时间发生的动作或状态，与现在无关。',
    structure: 'did / was / were',
    keywords: ['yesterday', 'last night', 'in 2010', 'ago', 'just now'],
    mnemonic: '过去时间点，动作已结束，与现在无关',
    examples: [
      {
        en: 'He left specifically because he was angry.',
        cn: '他离开纯粹是因为生气。',
        note: '描述过去发生的具体动作',
        year: '2019'
      }
    ],
    detailedStructures: [
      {
        subject: "所有人都 (All Persons)",
        affirmative: "S + V-ed (was/were)",
        affirmativeExample: "I worked in a shop last year. (2020 完形)",
        negative: "S + didn't + V-base",
        negativeExample: "I didn't finish the task yesterday. (2021 改错)",
        question: "Did + S + V-base?",
        questionExample: "Did I forget to bring the book? (2019 单选)"
      }
    ],
    scenarios: [
      {
        name: "叙述过去发生的连贯事件",
        correctExample: "He woke up, washed his face and had breakfast. (2022 阅读)",
        wrongExample: "He wakes up, washed his face...",
        wrongReason: "叙述过去故事时，时态要前后一致，统一用过去时。"
      }
    ],
    commonErrors: [
      {
        point: "助动词did后忘还原动词原形",
        wrong: "Did he went to school?",
        correct: "Did he go to school?",
        tip: "Did已经是过去式标记，后面的动词必须恢复原形。"
      }
    ],
    exercises: []
  },
  {
    id: 't_present_continuous',
    name: '现在进行时 (Present Continuous)',
    description: '表示说话时正在进行的动作，或现阶段一直在进行的动作。',
    structure: 'am/is/are + doing',
    keywords: ['now', 'at present', 'at the moment', 'look', 'listen'],
    mnemonic: 'be加doing，此刻正在做',
    examples: [
       { en: 'Look! The bus is coming.', cn: '看！公交车来了。', note: 'Look 是标志词', year: '2019 单选' }
    ],
    detailedStructures: [
       {
         subject: "I",
         affirmative: "I am doing",
         affirmativeExample: "I am reading now.",
         negative: "I am not doing",
         negativeExample: "I am not sleeping.",
         question: "Am I doing?",
         questionExample: "Am I dreaming?"
       },
       {
         subject: "He/She/It",
         affirmative: "S + is doing",
         affirmativeExample: "He is running.",
         negative: "S + is not doing",
         negativeExample: "It is not raining.",
         question: "Is + S + doing?",
         questionExample: "Is she working?"
       }
    ],
    scenarios: [
       {
         name: "动作正在进行",
         correctExample: "Don't make noise. The baby is sleeping.",
         wrongExample: "The baby sleeps.",
         wrongReason: "语境暗示'此刻'，需用进行时。"
       }
    ],
    commonErrors: [
       {
         point: "漏掉be动词",
         wrong: "He swimming.",
         correct: "He is swimming.",
         tip: "进行时结构必须包含be动词。"
       }
    ],
    exercises: []
  },
  {
    id: 't_simple_present',
    name: '一般现在时 (Simple Present)',
    description: '表示经常性、习惯性的动作，客观真理或状态。',
    structure: 'do/does',
    keywords: ['always', 'usually', 'often', 'sometimes', 'every day'],
    mnemonic: '经常反复做，客观真理存',
    examples: [
       { en: 'The sun rises in the east.', cn: '太阳从东方升起。', note: '客观真理', year: '2020 阅读' }
    ],
    detailedStructures: [
       {
         subject: "He/She/It",
         affirmative: "S + V-s/es",
         affirmativeExample: "He walks to school.",
         negative: "S + doesn't + V-base",
         negativeExample: "She doesn't like apples.",
         question: "Does + S + V-base?",
         questionExample: "Does it work?"
       }
    ],
    scenarios: [
       {
         name: "习惯性动作",
         correctExample: "I usually get up at 6.",
         wrongExample: "I am getting up at 6.",
         wrongReason: "习惯性动作不用进行时。"
       }
    ],
    commonErrors: [
       {
         point: "第三人称单数忘记加s",
         wrong: "He go to school.",
         correct: "He goes to school.",
         tip: "三单主语后的动词必须变化。"
       }
    ],
    exercises: []
  },
  {
    id: 't_simple_future',
    name: '一般将来时 (Simple Future)',
    description: '表示将来某个时间要发生的动作或状态。',
    structure: 'will / be going to + do',
    keywords: ['tomorrow', 'next week', 'in the future', 'soon'],
    mnemonic: '将来要发生，will来帮忙',
    examples: [
       { en: 'I will help you with your homework.', cn: '我会帮你做作业。', note: '表示意愿', year: '2022 单选' }
    ],
    detailedStructures: [
       {
         subject: "All",
         affirmative: "S + will do",
         affirmativeExample: "We will win.",
         negative: "S + won't do",
         negativeExample: "He won't come.",
         question: "Will + S + do?",
         questionExample: "Will you go?"
       }
    ],
    scenarios: [
       {
         name: "预测未来",
         correctExample: "It will rain tomorrow.",
         wrongExample: "It rains tomorrow.",
         wrongReason: "单纯预测未来用will。"
       }
    ],
    commonErrors: [
       {
         point: "will后用动词过去式",
         wrong: "I will went there.",
         correct: "I will go there.",
         tip: "助动词will后永远跟动词原形。"
       }
    ],
    exercises: []
  },
  {
    id: 't_past_perfect',
    name: '过去完成时 (Past Perfect)',
    description: '表示在过去某一时间或动作之前已经发生或完成的动作（过去的过去）。',
    structure: 'had + done',
    keywords: ['by the end of', 'before', 'by the time'],
    mnemonic: '过去的过去，had done标记',
    examples: [
       { en: 'By the time I got to the station, the train had left.', cn: '我到车站时，火车已经开走了。', note: 'got是过去，left是过去的过去', year: '2021 完形' }
    ],
    detailedStructures: [
       {
         subject: "All",
         affirmative: "S + had done",
         affirmativeExample: "He had already eaten.",
         negative: "S + hadn't done",
         negativeExample: "I hadn't seen her.",
         question: "Had + S + done?",
         questionExample: "Had they finished?"
       }
    ],
    scenarios: [
       {
         name: "By the time + 过去时",
         correctExample: "By the time he came, we had finished dinner.",
         wrongExample: "By the time he came, we finished dinner.",
         wrongReason: "By the time接过去时，主句必须用过去完成时。"
       }
    ],
    commonErrors: [
       {
         point: "混淆现在完成时和过去完成时",
         wrong: "I had finished my homework (now).",
         correct: "I have finished my homework.",
         tip: "如果没有明确的'过去的时间'作为参照，通常用现在完成时。"
       }
    ],
    exercises: []
  }
];

export const MOCK_TOPICS: EssayTopic[] = [
  {
    id: 'topic1',
    title: 'A Letter of Complaint (投诉信)',
    category: 'APPLICATION',
    subCategory: '书信',
    year: '2023',
    requirement: 'Write a letter to complain about the poor service in the canteen.',
    keywords: ['service', 'improve', 'disappointed', 'quality', 'measure'],
    template: {
      basic: `Dear Sir/Madam,\n\nI am writing to complain about [Problem]. \n\nI hope you can take measures to solve it.\n\nYours sincerely,\nLi Hua`,
      advanced: `Dear Sir/Madam,\n\nI am a student of this university. I am writing to express my dissatisfaction regarding [Problem].\n\nTo be specific, [Detail 1]. Furthermore, [Detail 2].\n\nI would appreciate it if you could look into this matter and take immediate measures to improve the situation.\n\nYours sincerely,\nLi Hua`
    }
  },
  {
    id: 'topic2',
    title: 'My View on Online Learning',
    category: 'ESSAY',
    subCategory: '观点类',
    year: '2022',
    requirement: 'Describe the pros and cons of online learning.',
    keywords: ['convenient', 'flexible', 'communication', 'distract'],
    template: {
      basic: `Nowadays, online learning is popular. \n\nOn one hand, it is convenient. On the other hand, it lacks communication.\n\nIn my opinion, we should make good use of it.`,
      advanced: `With the development of technology, online learning has become a prevailing trend.\n\nFirst of all, [Advantage]. However, every coin has two sides. [Disadvantage].\n\nIn conclusion, we should balance online learning and traditional classes.`
    }
  },
  {
    id: 'topic3',
    title: 'A Letter of Application (求职信)',
    category: 'APPLICATION',
    subCategory: '书信',
    year: '2021',
    requirement: 'Write a letter to apply for the volunteer post.',
    keywords: ['apply for', 'qualified', 'experience', 'enthusiasm'],
    template: {
      basic: `Dear Sir/Madam,\n\nI learned that you need a volunteer. I want to apply for it.\n\nI am good at English and I am helpful.\n\nI look forward to your reply.\n\nYours,\nLi Hua`,
      advanced: `Dear Sir/Madam,\n\nI am writing to apply for the position of volunteer which was advertised recently.\n\nI believe I am qualified for the post because I have rich experience in [Field].\n\nI would appreciate the opportunity to have an interview.\n\nYours sincerely,\nLi Hua`
    }
  }
];