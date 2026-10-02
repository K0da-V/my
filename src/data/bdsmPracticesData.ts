import { BdsmPracticeDefinition } from '../types';

export const BDSM_PRACTICES_CATALOG: BdsmPracticeDefinition[] = [
  {
    id: 'shibari',
    name: 'Shibari / Kinbaku (Arte das Cordas Japonesas)',
    category: 'Contenção & Cordas',
    shortMeaning: 'Arte secular japonesa de amarrações eróticas e estéticas com cordas de juta ou cânhamo.',
    detailedMeaning:
      'Prática que combina estética visual, geometria corporal, imobilização consensual e conexão meditativa. Envolve a aplicação de nós e nós de fricção para criar padrões harmônicos sobre o corpo, podendo incluir suspensões parciais ou totais e estados profundos de relaxamento e transe (subspace / ropespace).',
    safetyGuidelines:
      'Exige tesoura corta-cordas com ponta arredondada sempre ao alcance, verificação contínua de pulso, cor e formigamento nas extremidades, e conhecimento da anatomia dos nervos radial e ciático.',
  },
  {
    id: 'rigger',
    name: 'Rigger (Amarrador / Guia de Cordas)',
    category: 'Contenção & Cordas',
    shortMeaning: 'Pessoa responsável por conduzir, planejar e executar a amarração estética ou contenção com cordas.',
    detailedMeaning:
      'No Shibari, o Rigger assume a liderança técnica e o cuidado integral do parceiro amarrado (Rope Bunny). Além de dominar nós e vetores de tensão, cabe ao Rigger calibrar a respiração, a postura, o conforto articular e a segurança física de quem está sendo amarrado.',
    safetyGuidelines:
      'Nunca amarrar sob efeito de álcool, treinar previamente em estruturas estáveis e garantir consentimento informado prévio para cada manobra.',
  },
  {
    id: 'rope_bunny',
    name: 'Rope Bunny / Nawa-ko (Pessoa Amarrada)',
    category: 'Contenção & Cordas',
    shortMeaning: 'Pessoa que se entrega à imobilização estética e sensorial das cordas.',
    detailedMeaning:
      'Participante que busca a sensação de aconchego, contenção, vulnerabilidade e estética proporcionada pelas cordas. Frequentemente vivencia o "ropespace", uma sensação de leveza ou transe corporal gerada pela confiança irrestrita no Rigger.',
    safetyGuidelines:
      'Sinalizar imediatamente qualquer dormência, queimação nervosa ou desconforto articular; manter a palavra de segurança sempre ativa.',
  },
  {
    id: 'dominante',
    name: 'Dominante (Top / Dom / Domme)',
    category: 'Dinâmicas de Poder',
    shortMeaning: 'Pessoa que assume a liderança, iniciativa, controle e condução consensual da cena.',
    detailedMeaning:
      'Em uma dinâmica D/s, o Dominante estabelece regras, guia a intensidade das ações e assume a responsabilidade pela integridade, satisfação e limites acordados com o Submisso. A verdadeira dominância é baseada em empatia, paciência e firmeza ética, nunca em imposição arbitrária.',
    safetyGuidelines:
      'Dominância exige responsabilidade redobrada: verificar constantemente o estado do parceiro e encerrar a cena de imediato ao sinal da palavra de segurança.',
  },
  {
    id: 'submisso',
    name: 'Submisso(a) (Bottom / Sub)',
    category: 'Dinâmicas de Poder',
    shortMeaning: 'Pessoa que escolhe voluntariamente entregar o controle e obedecer ao comando do parceiro.',
    detailedMeaning:
      'A submissão voluntária é um ato de profunda confiança e poder pessoal. O submisso encontra prazer e alívio psicológico ao abdicar de decisões rotineiras, obedecer a instruções claras e servir aos desejos combinados da dinâmica.',
    safetyGuidelines:
      'O submisso detém o poder supremo de interromper a sessão com a palavra de segurança (Safe Word) a qualquer segundo, sem necessidade de justificativa.',
  },
  {
    id: 'switch',
    name: 'Switch (Versátil em Papéis)',
    category: 'Dinâmicas de Poder',
    shortMeaning: 'Pessoa flexível que transita entre liderar (dominar) e se entregar (submeter) conforme a química da cena.',
    detailedMeaning:
      'Indivíduo com afinidade pelas duas extremidades da dinâmica de poder. Um Switch pode atuar como Dominante com determinados parceiros e como Submisso com outros, ou alternar papéis na mesma relação conforme o momento e o clima estabelecido.',
    safetyGuidelines:
      'Definir com clareza qual papel está em vigor antes de cada sessão para evitar confusões de expectativa durante a interação.',
  },
  {
    id: 'sadista',
    name: 'Sadista Consensual (S)',
    category: 'Estímulos Sensoriais & Dor',
    shortMeaning: 'Pessoa que obtém prazer e estímulo ao infligir dor física ou psicológica controlada e consentida.',
    detailedMeaning:
      'No BDSM seguro, o sadismo consensual é uma forma refinada de canalizar estímulos de dor (como palmadas, calor ou beliscões) sabendo que o parceiro deseja e autorizou essa experiência. O sadista ético busca levar o outro ao êxtase através da endorfina, nunca causando danos permanentes.',
    safetyGuidelines:
      'Calibrar a força progressivamente, evitar regiões vitais (rins, coluna, pescoço) e priorizar áreas carnosas (glúteos, coxas).',
  },
  {
    id: 'masoquista',
    name: 'Masoquista Consensual (M)',
    category: 'Estímulos Sensoriais & Dor',
    shortMeaning: 'Pessoa que transforma sensações de dor física consensual ou punição erótica em prazer e liberação de endorfina.',
    detailedMeaning:
      'Masoquistas buscam a catarse física e mental gerada por estímulos intensos. Sob dor controlada, o cérebro libera grandes descargas de endorfina e dopamina, provocando o chamado "subspace" — um estado de tranquilidade, êxtase e transcendência corporal.',
    safetyGuidelines:
      'Conhecer seus próprios limites corporais reais, hidratar-se antes da sessão e comunicar alterações súbitas de pressão ou tontura.',
  },
  {
    id: 'impact_play',
    name: 'Impact Play (Jogo de Impacto Consensual)',
    category: 'Estímulos Sensoriais & Dor',
    shortMeaning: 'Prática de estímulo físico rítmico utilizando instrumentos como palmatórias, chicotes, floggers ou varas.',
    detailedMeaning:
      'Técnica que explora o impacto cinético sobre a pele. Cada instrumento possui uma característica: floggers de camurça proporcionam calor superficial e massagem intensa; palmatórias produzem impacto muscular profundo (*thud*); chitas ou canes produzem picadas agudas (*sting*).',
    safetyGuidelines:
      'Jamais golpear sobre a coluna vertebral, articulações, rins ou cabeça. Aquecer a pele previamente com toques leves.',
  },
  {
    id: 'spanking',
    name: 'Spanking (Palmadas Eróticas)',
    category: 'Estímulos Sensoriais & Dor',
    shortMeaning: 'Aplicação de palmadas com a mão aberta sobre os glúteos em contexto lúdico ou de disciplina erótica.',
    detailedMeaning:
      'Uma das práticas mais acessíveis e populares do BDSM. Pode ter tom afetuoso, erotizado ou encenar uma disciplina consensual de "mau comportamento", estimulando a circulação sanguínea na região pélvica e aumentando a sensibilidade erógena.',
    safetyGuidelines:
      'Utilizar a palma da mão relaxada, alternando as bochechas dos glúteos para distribuir o calor e permitir pausas de respiração.',
  },
  {
    id: 'sensory_deprivation',
    name: 'Privação Sensorial (Sensory Deprivation)',
    category: 'Contenção & Cordas',
    shortMeaning: 'Isolamento de um ou mais sentidos (visão, audição, tato) para amplificar a sensibilidade restante.',
    detailedMeaning:
      'Ao utilizar vendas de cetim ou couro nos olhos, fones com ruído branco e mordaças suaves, a pessoa perde a referência visual e temporal. O menor toque na pele, um sussurro no ouvido ou uma gota de cera passam a ser sentidos com intensidade decuplicada.',
    safetyGuidelines:
      'Avisar verbalmente antes de toques inesperados muito fortes para evitar sobressaltos cardíacos ou crises de pânico.',
  },
  {
    id: 'wax_play',
    name: 'Wax Play (Jogo com Cera Quente)',
    category: 'Estímulos Sensoriais & Dor',
    shortMeaning: 'Gotejamento de cera de velas de baixa fusão sobre o corpo para provocar sensações térmicas.',
    detailedMeaning:
      'Prática sensorial refinada onde a cera líquida morna entra em contato com a pele e solidifica quase instantaneamente. Combina o contraste térmico agudo com a beleza visual das gotas coloridas e o aroma relaxante.',
    safetyGuidelines:
      'UTILIZAR APENAS velas específicas de parafina de baixa temperatura de fusão (soja ou cera especial BDSM). NUNCA usar velas convencionais domésticas de parafina dura (risco de queimaduras de 2º grau).',
  },
  {
    id: 'praise_kink',
    name: 'Praise Kink (Estímulo por Elogio & Validação)',
    category: 'Psicológico & Verbal',
    shortMeaning: 'Excitação e prazer decorrentes de palavras de aprovação, carinho, validação e elogios intensos.',
    detailedMeaning:
      'O oposto da humilhação: aqui o indivíduo atinge alto grau de prazer ao ouvir termos como "bom garoto/boa garota", "você foi perfeito(a)", "olha como você é obediente e incrível". Gera um acolhimento emocional profundo dentro da dinâmica de poder.',
    safetyGuidelines:
      'Identificar previamente quais elogios ou termos de afeto ressoam melhor com a sensibilidade do parceiro.',
  },
  {
    id: 'degradation',
    name: 'Humilhação Verbal & Degradação Consensual',
    category: 'Psicológico & Verbal',
    shortMeaning: 'Uso de vocabulário provocativo, xingamentos erotizados ou desvalorização estritamente combinada na cena.',
    detailedMeaning:
      'Algumas pessoas encontram alívio psicológico e desinibição sexual ao serem tratadas de maneira crua e desrespeitosa durante o ato erótico. Funciona como uma purgação do ego e exige enorme cumplicidade prévia.',
    safetyGuidelines:
      'Rigorosamente demarcada por "palavras gatilho proibidas" (traumas passados, peso, família, raça). O Aftercare imediato com carinho e reforço positivo é obrigatório.',
  },
  {
    id: 'primal_play',
    name: 'Primal Play (Jogo Selvagem & Instintivo)',
    category: 'Dinâmicas de Poder',
    shortMeaning: 'Expressão visceral e animalesca envolvendo mordidas leves, arranhões, luta corporal e grunhidos.',
    detailedMeaning:
      'Prática que desconecta do intelecto e conecta com os instintos ancestrais de caça e presa. Dois parceiros se desafiam corporalmente em um combate lúdico onde a dominância é conquistada através de força física combinada e paixão bruta.',
    safetyGuidelines:
      'Manter unhas lixadas, ter cuidado com a área da garganta e artérias carótidas, e manter tapetes ou colchões macios.',
  },
  {
    id: 'pet_play',
    name: 'Pet Play (Jogo de Animal de Estimação)',
    category: 'Psicológico & Verbal',
    shortMeaning: 'Roleplay onde um participante encena o papel de um animal dócil (gato, cão, cavalo) sob tutela carinhosa.',
    detailedMeaning:
      'Dinâmica psicológica que envolve o uso de adereços como orelhas, coleiras, caudas e brincadeiras no chão. Proporciona um escape da vida adulta, entrando em um estado lúdico, inocente e focado em cuidados, afagos e petiscos.',
    safetyGuidelines:
      'Respeitar a ergonomia dos joelhos e punhos utilizando almofadas ou joelheiras caso o parceiro fique de quatro por períodos longos.',
  },
  {
    id: 'voyeurismo',
    name: 'Voyeurismo Consensual',
    category: 'Exibição & Fetiche',
    shortMeaning: 'Prazer e excitação obtidos ao observar atos eróticos, nudez ou intimidade autorizada de terceiros.',
    detailedMeaning:
      'No meio liberal e BDSM ético, o voyeurismo consensual ocorre com permissão expressa de quem está sendo observado (como em festas privadas, cabines ou com casais liberais que gostam de plateia).',
    safetyGuidelines:
      'Jamais gravar, fotografar ou tocar em quem está em cena sem consentimento formal prévio.',
  },
  {
    id: 'exibicionismo',
    name: 'Exibicionismo Consensual',
    category: 'Exibição & Fetiche',
    shortMeaning: 'Prazer em ser visto, contemplado ou admirado durante a nudez ou práticas íntimas por espectadores consensuais.',
    detailedMeaning:
      'O prazer nasce da sensação de ser o centro das atenções, do estímulo do olhar do outro e da superação de tabus corporais, praticado em espaços reservados para adultos (como clubes, quartos de hotel ou salas privativas).',
    safetyGuidelines:
      'Garantir que todos os espectadores presentes tenham mais de 18 anos e estejam em ambiente privado com consentimento mútuo.',
  },
  {
    id: 'chastity',
    name: 'Castidade Erótica (Chastity Play)',
    category: 'Dinâmicas de Poder',
    shortMeaning: 'Renúncia voluntária do orgasmo e contenção dos genitais sob chave guardada pelo Dominante (Keyholder).',
    detailedMeaning:
      'Prática onde a pessoa utiliza um dispositivo de castidade, transferindo a posse da chave e o controle de quando poderá ter prazer ou orgasmo para seu parceiro dominante. Fomenta a expectativa e o foco contínuo na dinâmica.',
    safetyGuidelines:
      'Higiene impecável diária, dispositivos anatômicos de silicone ou aço cirúrgico adequados e posse de chave reserva de emergência.',
  },
  {
    id: 'aftercare',
    name: 'Aftercare (Cuidados e Acolhimento Pós-Sessão)',
    category: 'Dinâmicas de Poder',
    shortMeaning: 'Etapa fundamental de suporte físico e emocional imediatamente após o término de qualquer cena BDSM.',
    detailedMeaning:
      'Durante uma cena de BDSM, há uma explosão hormonal gigantesca (endorfina, adrenalina). Após o término, o corpo sofre uma queda brusca (drop). O Aftercare envolve cobrir o parceiro com mantas, oferecer água e chocolate, abraçar, reafirmar o valor e conversar com carinho.',
    safetyGuidelines:
      'O Aftercare NÃO é opcional: é uma obrigação ética de todo praticante para prevenir o "sub drop" (crise depressiva ou ansiosa pós-cena).',
  },
];

export interface BdsmQuizQuestion {
  id: number;
  category: string;
  question: string;
  description: string;
  options: {
    label: string;
    points: Record<string, number>; // maps practiceId to points (1-5)
  }[];
}

export const BDSM_QUIZ_QUESTIONS: BdsmQuizQuestion[] = [
  {
    id: 1,
    category: 'Dinâmica de Poder & Controle',
    question: 'Durante um momento íntimo, como você se sente em relação a estar no comando das regras e ações?',
    description: 'Avalia a sua predisposição natural para liderar, orientar ou entregar as decisões.',
    options: [
      {
        label: 'Adoro ter o controle absoluto, decidir as posições, ritmos e dar instruções claras.',
        points: { dominante: 5, rigger: 4, sadista: 3, submisso: 0 },
      },
      {
        label: 'Prefiro que a outra pessoa assuma a liderança e eu possa relaxar e apenas obedecer.',
        points: { submisso: 5, rope_bunny: 4, dominante: 0 },
      },
      {
        label: 'Gosto de alternar dependendo do dia, do parceiro e da química do momento.',
        points: { switch: 5, dominante: 3, submisso: 3 },
      },
      {
        label: 'Prefiro uma relação de completa igualdade horizontal, sem dinâmica de comando explícito.',
        points: { dominante: 1, submisso: 1, switch: 1 },
      },
    ],
  },
  {
    id: 2,
    category: 'Contenção, Cordas & Shibari',
    question: 'Qual é a sua relação com a ideia de amarrações corporais estéticas ou imobilização com cordas?',
    description: 'Mede o interesse pela arte tradicional do Shibari/Kinbaku tanto como amarrador quanto como amarrado.',
    options: [
      {
        label: 'Fascinado(a) por amarrar! Adoro aprender os nós, criar desenhos estéticos e cuidar de quem está preso.',
        points: { rigger: 5, shibari: 5, dominante: 3 },
      },
      {
        label: 'Amo ser amarrado(a)! A sensação das cordas apertando a pele e a perda de movimento me trazem calma profunda.',
        points: { rope_bunny: 5, shibari: 5, submisso: 4 },
      },
      {
        label: 'Gosto dos dois lados: aprender a fazer nós em alguém e também curtir a sensação de ser contido(a).',
        points: { shibari: 5, rigger: 4, rope_bunny: 4, switch: 4 },
      },
      {
        label: 'Tenho curiosidade ou prefiro apenas amarrações muito simples e rápidas com fitas ou lenços.',
        points: { shibari: 2, sensory_deprivation: 3 },
      },
    ],
  },
  {
    id: 3,
    category: 'Sensações Físicas & Estímulos de Impacto',
    question: 'Como você reage a estímulos corporais como palmadas vigorosas, floggers ou chicotinhos consensuais?',
    description: 'Investiga afinidade com Impact Play, Spanking e a troca de endorfina por dor controlada.',
    options: [
      {
        label: 'Adoro aplicar o impacto, ouvir o som, observar as marcas temporárias e o calor subindo na pele do outro.',
        points: { sadista: 5, impact_play: 5, spanking: 4, dominante: 3 },
      },
      {
        label: 'Amo receber! O calor e a ardência do impacto liberam uma sensação intensa de alívio e prazer no meu corpo.',
        points: { masoquista: 5, impact_play: 5, spanking: 5, submisso: 3 },
      },
      {
        label: 'Aprecio apenas palmadas leves com a mão (spanking carinhoso), sem instrumentos pesados.',
        points: { spanking: 4, impact_play: 2, masoquista: 2 },
      },
      {
        label: 'Não gosto de dor nem de impacto físico de nenhuma espécie.',
        points: { sadista: 0, masoquista: 0, impact_play: 0, spanking: 0 },
      },
    ],
  },
  {
    id: 4,
    category: 'Privação Sensorial & Jogos Térmicos',
    question: 'Estar vendado(a), sem conseguir enxergar nada enquanto recebe toques, penas ou cera morna é algo que:',
    description: 'Avalia o interesse por Sensory Deprivation e Wax Play (jogos de sensibilidade extrema).',
    options: [
      {
        label: 'Me excita intensamente! A perda da visão faz com que cada arrepio e cada gota de cera morna sejam mágicos.',
        points: { sensory_deprivation: 5, wax_play: 5, submisso: 4, masoquista: 3 },
      },
      {
        label: 'Adoro conduzir a cena: vendar o parceiro, sussurrar e gotejar cera especial mantendo a expectativa no ápice.',
        points: { sensory_deprivation: 5, wax_play: 5, dominante: 4, sadista: 3 },
      },
      {
        label: 'Curto a venda nos olhos para relaxar, mas tenho receio de cera ou calor sobre a pele.',
        points: { sensory_deprivation: 4, wax_play: 1 },
      },
      {
        label: 'Fico desconfortável sem enxergar o que está acontecendo.',
        points: { sensory_deprivation: 0, wax_play: 0 },
      },
    ],
  },
  {
    id: 5,
    category: 'Aspectos Psicológicos & Verbalização',
    question: 'Na parte verbal, que tipo de estímulo desperta mais a sua mente?',
    description: 'Compara a afinidade entre Praise Kink (elogios e aprovação) versus Degradação/Humilhação consentida.',
    options: [
      {
        label: 'Elogios calorosos e aprovação constante ("bom garoto/garota", "você foi impecável").',
        points: { praise_kink: 5, submisso: 4 },
      },
      {
        label: 'Vocabulário cru, provocativo e desinibido que me faça sentir inteiramente dominado(a).',
        points: { degradation: 5, submisso: 3, masoquista: 3 },
      },
      {
        label: 'Gosto de ser quem elogia, guia e valida verbalmente a entrega do parceiro com autoridade amorosa.',
        points: { praise_kink: 5, dominante: 4 },
      },
      {
        label: 'Prefiro silêncio ou conversas românticas convencionais sem foco em dinâmicas verbais.',
        points: { praise_kink: 1, degradation: 0 },
      },
    ],
  },
  {
    id: 6,
    category: 'Luta Corporal & Instintos Primitivos',
    question: 'Morder, arranhar levemente, rosnar e lutar de forma brincalhona no chão como predador e presa atrai você?',
    description: 'Avalia afinidade com a energia selvagem do Primal Play e a submissão lúdica do Pet Play.',
    options: [
      {
        label: 'Totalmente! Amo a sensação de combate lúdico corpo a corpo, morder e sentir uma energia quase animal.',
        points: { primal_play: 5, switch: 3 },
      },
      {
        label: 'Curto a estética fofa e dócil de usar orelhinhas ou coleira, receber carinho e brincar como um pet.',
        points: { pet_play: 5, submisso: 4 },
      },
      {
        label: 'Gosto de ser o cuidador/tutor (owner) de um parceiro que gosta de brincar de pet.',
        points: { pet_play: 5, dominante: 4 },
      },
      {
        label: 'Não tenho afinidade com encenações animalescas ou lutas corporais.',
        points: { primal_play: 0, pet_play: 0 },
      },
    ],
  },
  {
    id: 7,
    category: 'Exibição & Contemplação',
    question: 'Como você se sente sobre ser observado(a) por terceiros ou observar outras pessoas em momentos eróticos em locais apropriados?',
    description: 'Identifica traços de Voyeurismo e Exibicionismo consensual.',
    options: [
      {
        label: 'Amo a ideia de me exibir, ser admirado(a) e saber que meu prazer está sendo assistido com consentimento.',
        points: { exibicionismo: 5, dominante: 2 },
      },
      {
        label: 'Tenho muito prazer em contemplar outras pessoas em momentos íntimos e sensuais.',
        points: { voyeurismo: 5 },
      },
      {
        label: 'Gosto de ambos: adoro tanto assistir quanto me apresentar quando o ambiente é seguro.',
        points: { voyeurismo: 4, exibicionismo: 4 },
      },
      {
        label: 'Gosto de privacidade estrita a dois, sem qualquer plateia ou contemplação externa.',
        points: { voyeurismo: 0, exibicionismo: 0 },
      },
    ],
  },
  {
    id: 8,
    category: 'Controle de Prazer & Pós-Cena',
    question: 'Sobre o controle do orgasmo e os momentos imediatamente após o término de uma sessão:',
    description: 'Avalia a importância da Castidade erótica (Chastity) e a indispensabilidade do Aftercare.',
    options: [
      {
        label: 'O Aftercare é sagrado para mim: preciso de abraços, água e carinho imediato para relaxar após a adrenalina.',
        points: { aftercare: 5, submisso: 3, dominante: 3 },
      },
      {
        label: 'Amo controlar o momento exato em que meu parceiro pode gozar, aplicando jogos de negação e castidade.',
        points: { chastity: 5, dominante: 5, sadista: 3 },
      },
      {
        label: 'Amo ter meu orgasmo controlado pelo parceiro, ficando sob suspense e expectativas por horas.',
        points: { chastity: 5, submisso: 5, masoquista: 3 },
      },
      {
        label: 'Prefiro que o prazer aconteça espontaneamente sem jogos de controle ou dispositivos de bloqueio.',
        points: { aftercare: 4, chastity: 0 },
      },
    ],
  },
];
