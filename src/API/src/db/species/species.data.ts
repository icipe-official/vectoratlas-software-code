import * as crypto from 'crypto';

export const speciesList = [
  'species', 'gambiae complex', 'arabiensis', 'coluzzii_gambiae_m form',
  'gambiae_s form_m form', 'gambiae_s form', 'melas', 'merus',
  'quadriannulatus', 'nili complex', 'carnevalei', 'nili', 'funestus complex',
  'funestus', 'funestus-like', 'amharicus', 'ardensis', 'argenteolobatus',
  'aruni', 'austenii', 'azaniae', 'azevedoi', 'barberellus', 'berghei',
  'bervoetsi', 'brohieri', 'brucei', 'brumpti', 'brunnipes', 'buxtoni',
  'bwambae', 'caliginosus', 'cameroni', 'caroni', 'carteri', 'christyi',
  'cinctus', 'cinereus', 'comorensis', 'concolor', 'confusus',
  'coustani complex', 'coustani', 'cristipalpis', 'crypticus',
  'culicifacies complex', 'culicifacies', 'cydippis', 'dancalicus', 'daudi',
  'deemingi', 'demeilloni', 'distinctus', 'domicola', 'dthali', 'dualaensis',
  'dureni', 'eouzani', 'erepens', 'erythraeus', 'ethiopicus', 'faini',
  'flavicosta', 'fontenillei', 'fontinalis', 'freetownensis', 'fuscicolor',
  'fuscivenosus', 'gabonensis', 'garnhami', 'gibbinsi', 'grassei', 'grenieri',
  'griveaudi', 'hamoni', 'hancocki', 'hargreavesi', 'harperi', 'hervyi',
  'hughi', 'implexus', 'jebudensis', 'keniensis', 'kingi', 'kosiensis',
  'lacani', 'leesoni', 'letabensis', 'listeri', 'lloreti', 'longipalpis',
  'lounibosi', 'lovettae', 'machardyi', 'maculipalpis', 'maliensis',
  'marshallii complex', 'marshallii', 'mascarensis', 'millecampsi', 'milloti',
  'mortiauxi', 'moucheti', 'mousinhoi', 'multicolor', 'multicinctus', 'murphyi',
  'namibiensis', 'natalensis', 'njombiensis', 'notleyi', 'obscurus', 'okuensis',
  'ovengensis', 'paludis', 'parensis', 'pauliani', 'pharoensis', 'pretoriensis',
  'radama', 'rageaui', 'ranci', 'rhodesiensis', 'rivulorum complex',
  'rivulorum', 'rivulorum-like', 'rodhaini', 'roubaudi', 'ruarinus', 'rufipes',
  'salbaii', 'schwetzi', 'seretsei', 'sergentii', 'seydeli', 'smithii',
  'somalicus', 'squamosus', 'stephensi', 'swahilicus', 'symesi', 'tchekedii',
  'tenebrosus', 'theileri', 'turkhudi', 'vaneedeni', 'vanhoofi', 'vernus',
  'vinckei', 'walravensi', 'wellcomei', 'wilsoni', 'ziemanni',
];

export const SPECIES_COLOR_MAP: Record<string, string> = {
  arabiensis: '#252676',
  'coluzzii_gambiae_m form': '#badadd',
  funestus: '#47a2f7',
  'gambiae_s form': '#521986',
  'gambiae_s form_m form': '#065668',
  melas: '#f6568b',
  merus: '#34350e',
  moucheti: '#dc58ea',
  nili: '#88698d',
  coustani: '#8a1341',
  'coustani complex': '#29081a',
  'funestus complex': '#7f20ac',
  'gambiae complex': '#e3d769',
  hybrid_coluzzii_melas: '#513886',
  'hybrid_funestus_rivulorum-like': '#fea53b',
  hybrid_gambiae_melas: '#074d65',
  leesoni: '#f8a0b1',
  marshallii: '#3eeaef',
  'marshallii complex': '#ed0f26',
  multicolor: '#0d032f',
  'nili complex': '#a93705',
  ovengensis: '#83b0d8',
  paludis: '#76480d',
  parensis: '#ae79e0',
  pharoensis: '#7220f6',
  rivulorum: '#e0ae95',
  'rivulorum complex': '#643176',
  sergentii: '#e96b22',
  stephensi: '#90089c',
  theileri: '#d6bcf5',
  vaneedeni: '#84241a',
  wellcomei: '#e586fe',
  ziemanni: '#5d4030',
};

export const GENERIC_GREEN = '#038543';

// ------------------------------------------------------------------
// AUTOMATED DATA BUILDER
// ------------------------------------------------------------------

// Helper function to turn raw database keys into better UI labels
const formatDisplayName = (rawSpecies: string): string => {
  // Handle specific messy legacy strings
  const specificMappings: Record<string, string> = {
    'coluzzii_gambiae_m form': 'Anopheles coluzzii (M form)',
    'gambiae_s form_m form': 'An. gambiae (S form/M form)',
    'gambiae_s form': 'Anopheles gambiae (S form)',
    'hybrid_coluzzii_melas': 'An. coluzzii / An. melas Hybrid',
    'hybrid_funestus_rivulorum-like': 'An. funestus / rivulorum-like Hybrid',
    'hybrid_gambiae_melas': 'An. gambiae / An. melas Hybrid',
    'species': 'Anopheles sp.',
  };

  if (specificMappings[rawSpecies]) return specificMappings[rawSpecies];

  
  return `Anopheles ${rawSpecies}`;
};


export const RECORDED_SPECIES_DATA = speciesList.map((speciesKey) => {
 
  const mappedColor = SPECIES_COLOR_MAP[speciesKey];
  
  return {
    id: crypto.randomUUID(),
    species: speciesKey,
    display_name: formatDisplayName(speciesKey),
   
    category: mappedColor ? 'Primary' : 'Secondary',
    
    color: mappedColor || GENERIC_GREEN,
  };
});