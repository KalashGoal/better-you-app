import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ArrowRight, Menu, Brain, Activity, MessageSquare, Quote, RefreshCw, Volume2, Sparkles, X, Terminal, Zap, BookOpen, Layers } from 'lucide-react';

/* =========================================
   GLOBAL CONFIG
   ========================================= */
const apiKey = ""; 

/* =========================================
   DATA: DON'T SAY 'VERY' DICTIONARY (OFFLINE)
   ========================================= */
const VERY_DATA = {
  "accurate": { word: "Exact", type: "Adj", uk: "/ɪɡˈzakt/", us: "/ɪɡˈzækt/", def: "Not approximated in any way; precise.", ety: "Latin 'exactus' (perfected).", examples: ["The description was exact in every detail.", "We need exact figures for the report."] },
  "afraid": { word: "Terrified", type: "Adj", uk: "/ˈter.ə.faɪd/", us: "/ˈter.ə.faɪd/", def: "Extremely afraid or fearful.", ety: "Latin 'terrificare' (frighten).", examples: ["She was terrified of the dark.", "The terrified child hid under the bed."] },
  "angry": { word: "Furious", type: "Adj", uk: "/ˈfjʊə.ri.əs/", us: "/ˈfjʊr.i.əs/", def: "Extremely angry.", ety: "Latin 'furiosus' (full of rage).", examples: ["He was furious about the damage to his car.", "She sent a furious email to the manager."] },
  "bad": { word: "Atrocious", type: "Adj", uk: "/əˈtrəʊ.ʃəs/", us: "/əˈtroʊ.ʃəs/", def: "Of a very poor quality; extremely bad or unpleasant.", ety: "Latin 'atrox' (cruel).", examples: ["The weather has been atrocious.", "His spelling is atrocious."] },
  "beautiful": { word: "Exquisite", type: "Adj", uk: "/ɪkˈskwɪz.ɪt/", us: "/ɪkˈskwɪz.ɪt/", def: "Extremely beautiful and, typically, delicate.", ety: "Latin 'exquirere' (search out).", examples: ["She wore an exquisite diamond necklace.", "The garden was exquisite in the moonlight."] },
  "big": { word: "Colossal", type: "Adj", uk: "/kəˈlɒs.əl/", us: "/kəˈlɑː.səl/", def: "Extremely large.", ety: "Greek 'kolossos' (gigantic statue).", examples: ["It was a colossal waste of time.", "The decision was a colossal mistake."] },
  "boring": { word: "Tedious", type: "Adj", uk: "/ˈtiː.di.əs/", us: "/ˈtiː.di.əs/", def: "Too long, slow, or dull: tiresome or monotonous.", ety: "Latin 'taedium' (weariness).", examples: ["The journey was tedious and uncomfortable.", "Filling out forms is a tedious task."] },
  "bright": { word: "Luminous", type: "Adj", uk: "/ˈluː.mɪ.nəs/", us: "/ˈluː.mə.nəs/", def: "Full of or shedding light; bright or shining.", ety: "Latin 'lumen' (light).", examples: ["The library was luminous with sunlight.", "Her large eyes were luminous."] },
  "busy": { word: "Swamped", type: "Adj", uk: "/swɒmpt/", us: "/swɑːmpt/", def: "Overwhelmed with an excessive amount of something.", ety: " Germanic origin related to 'sump'.", examples: ["I am swamped with work this week.", "The department was swamped with calls."] },
  "calm": { word: "Serene", type: "Adj", uk: "/səˈriːn/", us: "/səˈriːn/", def: "Calm, peaceful, and untroubled.", ety: "Latin 'serenus' (clear, fair).", examples: ["Her face was serene and smiling.", "He remained serene in the midst of chaos."] },
  "careful": { word: "Meticulous", type: "Adj", uk: "/məˈtɪk.jə.ləs/", us: "/məˈtɪk.jə.ləs/", def: "Showing great attention to detail; very careful and precise.", ety: "Latin 'meticulosus' (fearful).", examples: ["He was meticulous about his appearance.", "The trip involved meticulous planning."] },
  "clean": { word: "Immaculate", type: "Adj", uk: "/ɪˈmæk.jə.lət/", us: "/ɪˈmæk.jə.lət/", def: "Perfectly clean, neat, or tidy.", ety: "Latin 'immaculatus' (unspotted).", examples: ["She wore an immaculate white suit.", "The house was always immaculate."] },
  "clear": { word: "Obvious", type: "Adj", uk: "/ˈɒb.vi.əs/", us: "/ˈɑːb.vi.əs/", def: "Easily perceived or understood; clear, self-evident, or apparent.", ety: "Latin 'obvius' (in the way).", examples: ["It was obvious that he was lying.", "The solution seems obvious now."] },
  "cold": { word: "Frigid", type: "Adj", uk: "/ˈfrɪdʒ.ɪd/", us: "/ˈfrɪdʒ.ɪd/", def: "Very cold in temperature.", ety: "Latin 'frigidus' (cold).", examples: ["The frigid air stung my face.", "They swam in the frigid water."] },
  "colorful": { word: "Vibrant", type: "Adj", uk: "/ˈvaɪ.brənt/", us: "/ˈvaɪ.brənt/", def: "Full of energy and enthusiasm.", ety: "Latin 'vibrare' (shake).", examples: ["The city is vibrant and cosmopolitan.", "She has a vibrant personality."] },
  "confused": { word: "Perplexed", type: "Adj", uk: "/pəˈplekst/", us: "/pɚˈplekst/", def: "Completely baffled; very puzzled.", ety: "Latin 'perplexus' (entangled).", examples: ["She looked at him with a perplexed expression.", "The students were perplexed by the question."] },
  "creative": { word: "Innovative", type: "Adj", uk: "/ˈɪn.ə.və.tɪv/", us: "/ˈɪn.ə.veɪ.tɪv/", def: "Featuring new methods; advanced and original.", ety: "Latin 'innovare' (renew).", examples: ["There will be a prize for the most innovative design.", "An innovative approach to learning."] },
  "cute": { word: "Adorable", type: "Adj", uk: "/əˈdɔː.rə.bəl/", us: "/əˈdɔːr.ə.bəl/", def: "Inspiring great affection; delightful; charming.", ety: "Latin 'adorare' (worship).", examples: ["They have an adorable puppy.", "She looked adorable in that dress."] },
  "dangerous": { word: "Perilous", type: "Adj", uk: "/ˈper.əl.əs/", us: "/ˈper.əl.əs/", def: "Full of danger or risk.", ety: "Latin 'periculum' (danger).", examples: ["A perilous journey across the mountains.", "The economy is in a perilous state."] },
  "dirty": { word: "Filthy", type: "Adj", uk: "/ˈfɪl.θi/", us: "/ˈfɪl.θi/", def: "Disgustingly dirty.", ety: "Old English 'fylth' (foulness).", examples: ["The room was filthy.", "Get your filthy feet off the sofa!"] },
  "dull": { word: "Lackluster", type: "Adj", uk: "/ˈlækˌlʌs.tər/", us: "/ˈlækˌlʌs.tɚ/", def: "Lacking in vitality, force, or conviction; uninspired.", ety: "Hybrid: Lack + Luster.", examples: ["No excuses were made for the lackluster performance.", "The market has been lackluster."] },
  "eager": { word: "Keen", type: "Adj", uk: "/kiːn/", us: "/kiːn/", def: "Having or showing eagerness or enthusiasm.", ety: "Old English 'cene' (bold).", examples: ["She is a keen gardener.", "He was keen to help."] },
  "easy": { word: "Effortless", type: "Adj", uk: "/ˈef.ət.ləs/", us: "/ˈef.ɚt.ləs/", def: "Requiring no physical or mental exertion.", ety: "French 'esforz'.", examples: ["She danced with effortless grace.", "The transition was effortless."] },
  "expensive": { word: "Exorbitant", type: "Adj", uk: "/ɪɡˈzɔː.bɪ.tənt/", us: "/ɪɡˈzɔːr.bə.tənt/", def: "(of a price or amount charged) unreasonably high.", ety: "Latin 'exorbitare' (go out of the track).", examples: ["The bill for dinner was exorbitant.", "They charge exorbitant rates."] },
  "fast": { word: "Rapid", type: "Adj", uk: "/ˈræp.ɪd/", us: "/ˈræp.ɪd/", def: "Happening in a short time or at a fast pace.", ety: "Latin 'rapidus' (seizing).", examples: ["A rapid decline in sales.", "She made a rapid recovery."] },
  "funny": { word: "Hilarious", type: "Adj", uk: "/hɪˈleə.ri.əs/", us: "/hɪˈler.i.əs/", def: "Extremely amusing.", ety: "Greek 'hilaros' (cheerful).", examples: ["The movie was hilarious.", "We had a hilarious time."] },
  "good": { word: "Exceptional", type: "Adj", uk: "/ɪkˈsep.ʃən.əl/", us: "/ɪkˈsep.ʃən.əl/", def: "Unusually good; outstanding.", ety: "Latin 'exceptio'.", examples: ["At the age of five he showed exceptional talent.", "The food was exceptional."] },
  "great": { word: "Magnificent", type: "Adj", uk: "/mæɡˈnɪf.ɪ.sənt/", us: "/mæɡˈnɪf.ə.sənt/", def: "Impressively beautiful, elaborate, or extravagant.", ety: "Latin 'magnificus'.", examples: ["A magnificent view of the mountains.", "She looked magnificent."] },
  "happy": { word: "Ecstatic", type: "Adj", uk: "/ɪkˈstæt.ɪk/", us: "/ekˈstæt.ɪk/", def: "Feeling or expressing overwhelming happiness.", ety: "Greek 'ekstatikos'.", examples: ["She was ecstatic about her new job.", "Ecstatic fans filled the stadium."] },
  "hard": { word: "Arduous", type: "Adj", uk: "/ˈɑː.dju.əs/", us: "/ˈɑːr.dʒu.əs/", def: "Involving or requiring strenuous effort; difficult and tiring.", ety: "Latin 'arduus' (steep).", examples: ["An arduous journey.", "The work was arduous."] },
  "hot": { word: "Scorching", type: "Adj", uk: "/ˈskɔː.tʃɪŋ/", us: "/ˈskɔːr.tʃɪŋ/", def: "Very hot.", ety: "Old Norse 'skorpna' (shrivel).", examples: ["It was a scorching summer day.", "The scorching sun beat down."] },
  "hungry": { word: "Ravenous", type: "Adj", uk: "/ˈræv.ən.əs/", us: "/ˈræv.ən.əs/", def: "Extremely hungry.", ety: "Old French 'ravineux'.", examples: ["I'm ravenous - where's lunch?", "Growing boys have ravenous appetites."] },
  "hurt": { word: "Battered", type: "Adj", uk: "/ˈbæt.əd/", us: "/ˈbæt.ɚd/", def: "Injured by repeated blows or punishment.", ety: "Old French 'batre'.", examples: ["He felt battered and bruised.", "The battered old car."] },
  "important": { word: "Crucial", type: "Adj", uk: "/ˈkruː.ʃəl/", us: "/ˈkruː.ʃəl/", def: "Decisive or critical, especially in the success or failure of something.", ety: "Latin 'crux' (cross).", examples: ["Negotiations were at a crucial stage.", "It is crucial that we arrive on time."] },
  "intelligent": { word: "Brilliant", type: "Adj", uk: "/ˈbrɪl.jənt/", us: "/ˈbrɪl.jənt/", def: "Exceptionally clever or talented.", ety: "French 'briller' (shine).", examples: ["He is a brilliant scientist.", "A brilliant idea."] },
  "interesting": { word: "Captivating", type: "Adj", uk: "/ˈkæp.tɪ.veɪ.tɪŋ/", us: "/ˈkæp.tə.veɪ.tɪŋ/", def: "Capable of attracting and holding interest; charming.", ety: "Latin 'captivare' (take).", examples: ["A captivating story.", "She has a captivating smile."] },
  "lazy": { word: "Indolent", type: "Adj", uk: "/ˈɪn.dəl.ənt/", us: "/ˈɪn.dəl.ənt/", def: "Wanting to avoid activity or exertion; lazy.", ety: "Latin 'in-' (not) + 'dolere' (suffer pain).", examples: ["They were indolent and addicted to a life of pleasure.", "An indolent wave of the hand."] },
  "loud": { word: "Deafening", type: "Adj", uk: "/ˈdef.ən.ɪŋ/", us: "/ˈdef.ən.ɪŋ/", def: "(of a noise) so loud as to make it impossible to hear anything else.", ety: "Old English 'deaf'.", examples: ["The music was deafening.", "A deafening silence."] },
  "mean": { word: "Malicious", type: "Adj", uk: "/məˈlɪʃ.əs/", us: "/məˈlɪʃ.əs/", def: "Characterized by malice; intending or intended to do harm.", ety: "Latin 'malitia'.", examples: ["Malicious gossip.", "He took malicious pleasure in her mistake."] },
  "messy": { word: "Chaotic", type: "Adj", uk: "/keɪˈɒt.ɪk/", us: "/keɪˈɑː.t̬ɪk/", def: "In a state of complete confusion and disorder.", ety: "Greek 'khaos'.", examples: ["The traffic was chaotic.", "A chaotic desk."] },
  "nice": { word: "Benevolent", type: "Adj", uk: "/bəˈnev.əl.ənt/", us: "/bəˈnev.əl.ənt/", def: "Well meaning and kindly.", ety: "Latin 'bene' (well) + 'volens' (wishing).", examples: ["A benevolent smile.", "A benevolent fund."] },
  "often": { word: "Frequently", type: "Adv", uk: "/ˈfriː.kwənt.li/", us: "/ˈfriː.kwənt.li/", def: "Regularly or habitually; often.", ety: "Latin 'frequens'.", examples: ["They frequently go abroad.", "He frequently forgets his keys."] },
  "old": { word: "Ancient", type: "Adj", uk: "/ˈeɪn.ʃənt/", us: "/ˈeɪn.ʃənt/", def: "Belonging to the very distant past and no longer in existence.", ety: "Latin 'ante' (before).", examples: ["Ancient civilizations.", "An ancient forest."] },
  "open": { word: "Transparent", type: "Adj", uk: "/trænsˈpær.ənt/", us: "/trænsˈper.ənt/", def: "Easy to perceive or detect.", ety: "Latin 'transparere'.", examples: ["His motives were transparent.", "Transparent operations."] },
  "perfect": { word: "Flawless", type: "Adj", uk: "/ˈflɔː.ləs/", us: "/ˈflɑː.ləs/", def: "Without any blemishes or imperfections; perfect.", ety: "Middle English 'flau'.", examples: ["Her skin was flawless.", "A flawless performance."] },
  "poor": { word: "Destitute", type: "Adj", uk: "/ˈdes.tɪ.tʃuːt/", us: "/ˈdes.tə.tuːt/", def: "Without the basic necessities of life.", ety: "Latin 'destitutus' (abandoned).", examples: ["The charity cares for destitute children.", "He died destitute."] },
  "pretty": { word: "Gorgeous", type: "Adj", uk: "/ˈɡɔː.dʒəs/", us: "/ˈɡɔːr.dʒəs/", def: "Beautiful; very attractive.", ety: "Old French 'gorgias' (fine, elegant).", examples: ["What a gorgeous day!", "You look gorgeous."] },
  "quick": { word: "Swift", type: "Adj", uk: "/swɪft/", us: "/swɪft/", def: "Happening quickly or promptly.", ety: "Old English 'swift'.", examples: ["A swift recovery.", "Swift action is required."] },
  "quiet": { word: "Silent", type: "Adj", uk: "/ˈsaɪ.lənt/", us: "/ˈsaɪ.lənt/", def: "Not making or accompanied by any sound.", ety: "Latin 'silere'.", examples: ["The room was silent.", "He remained silent."] },
  "rich": { word: "Affluent", type: "Adj", uk: "/ˈæf.lu.ənt/", us: "/ˈæf.lu.ənt/", def: "(especially of a group or area) having a great deal of money; wealthy.", ety: "Latin 'affluere' (flow towards).", examples: ["The affluent societies of the west.", "An affluent neighborhood."] },
  "sad": { word: "Sorrowful", type: "Adj", uk: "/ˈsɒr.əʊ.fəl/", us: "/ˈsɔːr.oʊ.fəl/", def: "Feeling or showing grief.", ety: "Old English 'sorg'.", examples: ["With a sorrowful sigh.", "Sorrowful eyes."] },
  "scared": { word: "Petrified", type: "Adj", uk: "/ˈpet.rə.faɪd/", us: "/ˈpet.rə.faɪd/", def: "So frightened that one is unable to move; terrified.", ety: "Greek 'petra' (rock).", examples: ["She was petrified of snakes.", "He stood petrified with fear."] },
  "shiny": { word: "Gleaming", type: "Adj", uk: "/ˈɡliː.mɪŋ/", us: "/ˈɡliː.mɪŋ/", def: "Shining brightly, especially with reflected light.", ety: "Old English 'glæm'.", examples: ["A gleaming new car.", "Gleaming white teeth."] },
  "short": { word: "Brief", type: "Adj", uk: "/briːf/", us: "/briːf/", def: "Of short duration.", ety: "Latin 'brevis'.", examples: ["A brief visit.", "Keep it brief."] },
  "shy": { word: "Timid", type: "Adj", uk: "/ˈtɪm.ɪd/", us: "/ˈtɪm.ɪd/", def: "Showing a lack of courage or confidence; easily frightened.", ety: "Latin 'timere' (to fear).", examples: ["A timid voice.", "He was too timid to ask."] },
  "simple": { word: "Elementary", type: "Adj", uk: "/ˌel.ɪˈmen.tər.i/", us: "/ˌel.əˈmen.t̬ɚ.i/", def: "Relating to the basic elements or first principles of a subject.", ety: "Latin 'elementum'.", examples: ["Elementary mistakes.", "It's elementary, my dear Watson."] },
  "slow": { word: "Sluggish", type: "Adj", uk: "/ˈslʌɡ.ɪʃ/", us: "/ˈslʌɡ.ɪʃ/", def: "Slow-moving or inactive.", ety: "Middle English 'slugge' (lazy person).", examples: ["A sluggish economy.", "He felt heavy and sluggish."] },
  "small": { word: "Minuscule", type: "Adj", uk: "/ˈmɪn.ə.skjuːl/", us: "/ˈmɪn.ə.skjuːl/", def: "Extremely small; tiny.", ety: "Latin 'minusculus'.", examples: ["All she gave him was a minuscule piece of cake.", "The print was minuscule."] },
  "smart": { word: "Astute", type: "Adj", uk: "/əˈstjuːt/", us: "/əˈstuːt/", def: "Having or showing an ability to accurately assess situations and turn this to one's advantage.", ety: "Latin 'astus' (craft).", examples: ["An astute businessman.", "An astute observation."] },
  "strong": { word: "Robust", type: "Adj", uk: "/rəʊˈbʌst/", us: "/roʊˈbʌst/", def: "Strong and healthy; vigorous.", ety: "Latin 'robustus' (firm/hard).", examples: ["A robust defense.", "Robust health."] },
  "stupid": { word: "Idiotic", type: "Adj", uk: "/ˌɪd.iˈɒt.ɪk/", us: "/ˌɪd.iˈɑː.t̬ɪk/", def: "Very stupid.", ety: "Greek 'idiōtēs'.", examples: ["An idiotic question.", "Stop being idiotic."] },
  "sure": { word: "Certain", type: "Adj", uk: "/ˈsɜː.tən/", us: "/ˈsɝː.tən/", def: "Known for sure; established beyond doubt.", ety: "Latin 'certus'.", examples: ["I am certain of it.", "A certain fact."] },
  "sweet": { word: "Cherished", type: "Adj", uk: "/ˈtʃer.ɪʃt/", us: "/ˈtʃer.ɪʃt/", def: "Protect and care for (someone) lovingly.", ety: "French 'cherir'.", examples: ["A cherished memory.", "She is a cherished friend."] },
  "tall": { word: "Towering", type: "Adj", uk: "/ˈtaʊə.rɪŋ/", us: "/ˈtaʊ.ɚ.ɪŋ/", def: "Extremely tall, especially in comparison with the surroundings.", ety: "Old English 'torr'.", examples: ["Towering cliffs.", "A towering intellect."] },
  "tasty": { word: "Delicious", type: "Adj", uk: "/dɪˈlɪʃ.əs/", us: "/dɪˈlɪʃ.əs/", def: "Highly pleasant to the taste.", ety: "Latin 'delicere' (lure).", examples: ["A delicious meal.", "It smells delicious."] },
  "thin": { word: "Gaunt", type: "Adj", uk: "/ɡɔːnt/", us: "/ɡɑːnt/", def: "(of a person) lean and haggard, especially because of suffering, hunger, or age.", ety: "Unknown origin.", examples: ["A gaunt face.", "He looked gaunt and exhausted."] },
  "tired": { word: "Exhausted", type: "Adj", uk: "/ɪɡˈzɔː.stɪd/", us: "/ɪɡˈzɑː.stɪd/", def: "Drained of one's physical or mental resources; very tired.", ety: "Latin 'exhaurire' (drain out).", examples: ["I was absolutely exhausted.", "An exhausted runner."] },
  "ugly": { word: "Hideous", type: "Adj", uk: "/ˈhɪd.i.əs/", us: "/ˈhɪd.i.əs/", def: "Ugly or disgusting to look at.", ety: "Anglo-Norman French 'hidous'.", examples: ["A hideous monster.", "The furniture was hideous."] },
  "valuable": { word: "Precious", type: "Adj", uk: "/ˈpreʃ.əs/", us: "/ˈpreʃ.əs/", def: "Of great value; not to be wasted or treated carelessly.", ety: "Latin 'pretiosus'.", examples: ["Precious moments.", "Water is a precious resource."] },
  "weak": { word: "Frail", type: "Adj", uk: "/freɪl/", us: "/freɪl/", def: "(of a person) weak and delicate.", ety: "Latin 'fragilis'.", examples: ["His frail hands.", "She looked frail and vulnerable."] },
  "wet": { word: "Soaked", type: "Adj", uk: "/səʊkt/", us: "/soʊkt/", def: "Extremely wet; saturated.", ety: "Old English 'socian'.", examples: ["I got soaked in the rain.", "His shirt was soaked with sweat."] },
  "willing": { word: "Eager", type: "Adj", uk: "/ˈiː.ɡər/", us: "/ˈiː.ɡɚ/", def: "(of a person) wanting to do or have something very much.", ety: "Latin 'acer' (sharp).", examples: ["Eager to learn.", "Eager beaver."] },
  "worried": { word: "Distressed", type: "Adj", uk: "/dɪˈstrest/", us: "/dɪˈstrest/", def: "Suffering from anxiety, sorrow, or pain.", ety: "Latin 'distringere' (stretch apart).", examples: ["She was too distressed to speak.", "A distressed family."] }
};

/* =========================================
   DATA: VOCAB SLIDER EMOTIONS
   ========================================= */
const EMOTIONS_DATA = [
  { id: 'happy', label: 'Happy', color: '#FBBF24', levels: [{ word: 'Content', definition: 'Peacefully happy and satisfied.' }, { word: 'Pleased', definition: 'Feeling satisfaction and enjoyment.' }, { word: 'Cheerful', definition: 'Noticeably happy and optimistic.' }, { word: 'Joyful', definition: 'Feeling, expressing, or causing great pleasure.' }, { word: 'Delighted', definition: 'Feeling or showing great pleasure.' }, { word: 'Elated', definition: 'Ecstatically happy and full of excitement.' }, { word: 'Euphoric', definition: 'Intense, overwhelming excitement.' }, { word: 'Ecstatic', definition: 'Overwhelming happiness or joyful excitement.' }] },
  { id: 'sad', label: 'Sad', color: '#60A5FA', levels: [{ word: 'Down', definition: 'Unhappy; low in spirits.' }, { word: 'Blue', definition: 'Melancholic or depressed.' }, { word: 'Upset', definition: 'Unhappy, disappointed, or worried.' }, { word: 'Unhappy', definition: 'Not happy; sad.' }, { word: 'Gloomy', definition: 'Feeling distressed or pessimistic.' }, { word: 'Miserable', definition: 'Wretchedly unhappy or uncomfortable.' }, { word: 'Despondent', definition: 'In low spirits from loss of hope.' }, { word: 'Desolate', definition: 'Feeling extreme unhappiness or loneliness.' }] },
  { id: 'angry', label: 'Angry', color: '#EF4444', levels: [{ word: 'Annoyed', definition: 'Slightly angry; irritated.' }, { word: 'Cross', definition: 'Annoyed or irritated.' }, { word: 'Frustrated', definition: 'Feeling distress from an inability to change something.' }, { word: 'Mad', definition: 'Very angry.' }, { word: 'Angry', definition: 'Feeling or showing strong annoyance or hostility.' }, { word: 'Furious', definition: 'Extremely angry.' }, { word: 'Livid', definition: 'Furiously angry.' }, { word: 'Enraged', definition: 'Filled with consuming, uncontrollable anger.' }] },
  { id: 'anxious', label: 'Anxious', color: '#A78BFA', levels: [{ word: 'Worried', definition: 'Anxious or troubled about actual or potential problems.' }, { word: 'Nervous', definition: 'Easily agitated or alarmed.' }, { word: 'Uneasy', definition: 'Causing or feeling anxiety; troubled.' }, { word: 'Tense', definition: 'Unable to relax because of nervousness.' }, { word: 'Anxious', definition: 'Experiencing worry, unease, or nervousness.' }, { word: 'Distressed', definition: 'Suffering from extreme anxiety, sorrow, or pain.' }, { word: 'Panicked', definition: 'Feeling uncontrollable fear or anxiety.' }] },
  { id: 'calm', label: 'Calm', color: '#34D399', levels: [{ word: 'Mellow', definition: 'Pleasantly smooth or soft; free from harshness.' }, { word: 'Relaxed', definition: 'Free from tension and anxiety.' }, { word: 'Calm', definition: 'Not showing or feeling nervousness, anger, or other emotions.' }, { word: 'Peaceful', definition: 'Free from disturbance; tranquil.' }, { word: 'Serene', definition: 'Calm, peaceful, and untroubled.' }, { word: 'Tranquil', definition: 'Free from disturbance; calm.' }, { word: 'Blissful', definition: 'Extremely happy; full of joy and complete peace.' }, { word: 'Zen', definition: 'Relaxed and not worrying about things.' }] },
  { id: 'inspired', label: 'Inspired', color: '#F472B6', levels: [{ word: 'Curious', definition: 'Eager to know or learn something.' }, { word: 'Interested', definition: 'Showing curiosity or concern.' }, { word: 'Motivated', definition: 'Stimulated to do something; enthusiastic.' }, { word: 'Eager', definition: 'Wanting to do or have something very much.' }, { word: 'Inspired', definition: 'Filled with the urge or ability to do something creative.' }, { word: 'Driven', definition: 'Operated, moved, or controlled by a specified force.' }, { word: 'Visionary', definition: 'Thinking about or planning the future with imagination.' }] },
  { id: 'exhausted', label: 'Exhausted', color: '#9CA3AF', levels: [{ word: 'Sleepy', definition: 'Ready to fall asleep.' }, { word: 'Tired', definition: 'In need of sleep or rest.' }, { word: 'Weary', definition: 'Feeling tiredness from excessive exertion.' }, { word: 'Drained', definition: 'Deprived of strength or vitality.' }, { word: 'Exhausted', definition: 'Drained of one\'s physical or mental resources.' }, { word: 'Spent', definition: 'Having no power or energy left.' }, { word: 'Burnt Out', definition: 'Physical or mental collapse caused by overwork.' }] },
  { id: 'confident', label: 'Confident', color: '#F59E0B', levels: [{ word: 'Sure', definition: 'Confident in what one thinks or knows.' }, { word: 'Secure', definition: 'Fixed or fastened so as not to give way.' }, { word: 'Confident', definition: 'Feeling or showing confidence in oneself.' }, { word: 'Bold', definition: 'Showing an ability to take risks; courageous.' }, { word: 'Daring', definition: 'Adventurous or audaciously bold.' }, { word: 'Fearless', definition: 'Lacking fear.' }, { word: 'Unstoppable', definition: 'Impossible to stop or prevent.' }] },
  { id: 'lonely', label: 'Lonely', color: '#6366F1', levels: [{ word: 'Alone', definition: 'Having no one else present.' }, { word: 'Solitary', definition: 'Done or existing alone.' }, { word: 'Lonely', definition: 'Sad because one has no friends or company.' }, { word: 'Isolated', definition: 'Far away from other places or people.' }, { word: 'Left Out', definition: 'Not included in an activity or group.' }, { word: 'Abandoned', definition: 'Having been deserted or cast off.' }, { word: 'Forsaken', definition: 'Abandoned or deserted.' }] },
  { id: 'hopeful', label: 'Hopeful', color: '#2DD4BF', levels: [{ word: 'Wishing', definition: 'Feeling or expressing a strong desire.' }, { word: 'Dreaming', definition: 'Contemplating the possibility of doing something.' }, { word: 'Hopeful', definition: 'Feeling or inspiring optimism about a future event.' }, { word: 'Optimistic', definition: 'Hopeful and confident about the future.' }, { word: 'Excited', definition: 'Very enthusiastic and eager.' }, { word: 'Idealistic', definition: 'Aiming for perfection.' }] },
  { id: 'guilty', label: 'Guilty', color: '#78716C', levels: [{ word: 'Sorry', definition: 'Feeling distress or sympathy for someone else\'s misfortune.' }, { word: 'Bad', definition: 'Feeling guilty or regretful.' }, { word: 'Regretful', definition: 'Feeling or showing sorrow or remorse.' }, { word: 'Ashamed', definition: 'Embarrassed or guilty because of one\'s actions.' }, { word: 'Guilty', definition: 'Responsible for a specified wrongdoing.' }, { word: 'Remorseful', definition: 'Filled with deep regret or guilt.' }] },
  { id: 'proud', label: 'Proud', color: '#EAB308', levels: [{ word: 'Glad', definition: 'Pleased; delighted.' }, { word: 'Satisfied', definition: 'Contented; pleased.' }, { word: 'Proud', definition: 'Feeling deep pleasure as a result of achievements.' }, { word: 'Honored', definition: 'Regarded with great respect.' }, { word: 'Triumphant', definition: 'Having won a battle or contest; victorious.' }, { word: 'Glorious', definition: 'Having, worthy of, or bringing fame.' }] },
  { id: 'compassionate', label: 'Compassionate', color: '#FB7185', levels: [{ word: 'Nice', definition: 'Pleasant; agreeable; satisfactory.' }, { word: 'Kind', definition: 'Friendly, generous, and considerate.' }, { word: 'Caring', definition: 'Displaying kindness and concern for others.' }, { word: 'Sympathetic', definition: 'Feeling, showing, or expressing sympathy.' }, { word: 'Empathetic', definition: 'Understanding and sharing the feelings of another.' }, { word: 'Selfless', definition: 'Concerned more with the needs of others than one\'s own.' }] },
  { id: 'afraid', label: 'Afraid', color: '#4B5563', levels: [{ word: 'Nervous', definition: 'Easily agitated or alarmed.' }, { word: 'Worried', definition: 'Anxious or troubled.' }, { word: 'Scared', definition: 'Fearful; frightened.' }, { word: 'Afraid', definition: 'Feeling fear or anxiety.' }, { word: 'Terrified', definition: 'Cause to feel extreme fear.' }, { word: 'Petrified', definition: 'So frightened that one is unable to move.' }, { word: 'Horrified', definition: 'Filled with horror; extremely shocked.' }] },
  { id: 'jealous', label: 'Jealous', color: '#10B981', levels: [{ word: 'Envious', definition: 'Feeling or showing envy.' }, { word: 'Bitter', definition: 'Feeling deep anger or pain.' }, { word: 'Jealous', definition: 'Feeling envy of someone or their achievements.' }, { word: 'Covetous', definition: 'Having or showing a great desire to possess something belonging to someone else.' }, { word: 'Resentful', definition: 'Feeling bitterness at having been treated unfairly.' }, { word: 'Possessive', definition: 'Demanding someone\'s total attention and love.' }] },
  { id: 'surprised', label: 'Surprised', color: '#F97316', levels: [{ word: 'Startled', definition: 'Feeling sudden shock or alarm.' }, { word: 'Surprised', definition: 'Feeling or showing surprise.' }, { word: 'Shocked', definition: 'Cause (someone) to feel surprised and upset.' }, { word: 'Amazed', definition: 'Greatly surprised; astonished.' }, { word: 'Stunned', definition: 'Astonished or shocked so that one is temporarily unable to react.' }, { word: 'Mind-blown', definition: 'Extremely impressed or overwhelmed.' }] },
  { id: 'disgusted', label: 'Disgusted', color: '#84CC16', levels: [{ word: 'Displeased', definition: 'Feeling or showing annoyance and displeasure.' }, { word: 'Grossed Out', definition: 'Feeling distinct disgust.' }, { word: 'Disgusted', definition: 'Feeling or expressing revulsion or strong disapproval.' }, { word: 'Repulsed', definition: 'Cause to feel intense distaste and aversion.' }, { word: 'Sickened', definition: 'Make (someone) feel sick or disgusted.' }] },
  { id: 'confused', label: 'Confused', color: '#8B5CF6', levels: [{ word: 'Uncertain', definition: 'Not able to be relied on; not known or definite.' }, { word: 'Lost', definition: 'Unable to find one\'s way; not knowing what to do.' }, { word: 'Confused', definition: 'Unable to think clearly; bewildered.' }, { word: 'Puzzled', definition: 'Unable to understand; perplexed.' }, { word: 'Baffled', definition: 'Totally bewilder or perplex.' }] },
  { id: 'bored', label: 'Bored', color: '#6B7280', levels: [{ word: 'Dull', definition: 'Lacking interest or excitement.' }, { word: 'Uninterested', definition: 'Not interested in or concerned about something.' }, { word: 'Bored', definition: 'Feeling weary and restless through lack of interest.' }, { word: 'Tired of', definition: 'Bored with or annoyed by something.' }, { word: 'Apathetic', definition: 'Showing or feeling no interest, enthusiasm, or concern.' }] },
  { id: 'adoring', label: 'Adoring', color: '#EC4899', levels: [{ word: 'Fond', definition: 'Having an affection or liking for.' }, { word: 'Caring', definition: 'Displaying kindness and concern for others.' }, { word: 'Loving', definition: 'Feeling or showing love or great care.' }, { word: 'Adoring', definition: 'Loving and admiring someone very much.' }, { word: 'Passionate', definition: 'Showing or caused by strong feelings.' }, { word: 'Devoted', definition: 'Very loving or loyal.' }] },
  { id: 'grateful', label: 'Grateful', color: '#D97706', levels: [{ word: 'Thankful', definition: 'Pleased and relieved.' }, { word: 'Appreciative', definition: 'Feeling or showing gratitude or pleasure.' }, { word: 'Grateful', definition: 'Feeling or showing an appreciation of kindness.' }, { word: 'Touched', definition: 'Feeling gratitude or sympathy.' }, { word: 'Indebted', definition: 'Owing gratitude for a service or favor.' }, { word: 'Beholden', definition: 'Owing thanks or having a duty to someone.' }, { word: 'Overwhelmed', definition: 'Moved deeply by kindness or generosity.' }] },
  { id: 'embarrassed', label: 'Embarrassed', color: '#BE185D', levels: [{ word: 'Awkward', definition: 'Causing or feeling embarrassment or inconvenience.' }, { word: 'Self-conscious', definition: 'Feeling undue awareness of oneself.' }, { word: 'Sheepish', definition: 'Showing embarrassment from shame or a lack of self-confidence.' }, { word: 'Embarrassed', definition: 'Feeling or showing shame or awkwardness.' }, { word: 'Ashamed', definition: 'Embarrassed or guilty because of one\'s actions.' }, { word: 'Mortified', definition: 'Causing someone to feel deeply ashamed or humiliated.' }, { word: 'Humiliated', definition: 'Make (someone) feel ashamed and foolish.' }] },
  { id: 'disappointed', label: 'Disappointed', color: '#475569', levels: [{ word: 'Let down', definition: 'Failed to support or help someone as they had hoped.' }, { word: 'Unsatisfied', definition: 'Not satisfied or happy with something.' }, { word: 'Disappointed', definition: 'Sad or displeased because someone or something has failed to fulfill one\'s hopes.' }, { word: 'Disheartened', definition: 'Having lost determination or confidence.' }, { word: 'Disillusioned', definition: 'Disappointed in someone or something that one discovers to be less good than one had believed.' }, { word: 'Crushed', definition: 'Deformed, pulverized, or forced inwards by compression.' }] },
  { id: 'skeptical', label: 'Skeptical', color: '#7C3AED', levels: [{ word: 'Hesitant', definition: 'Tentative, unsure, or slow in acting or speaking.' }, { word: 'Dubious', definition: 'Hesitating or doubting.' }, { word: 'Skeptical', definition: 'Not easily convinced; having doubts or reservations.' }, { word: 'Suspicious', definition: 'Having or showing a cautious distrust of someone or something.' }, { word: 'Distrustful', definition: 'Feeling or showing no trust in someone or something.' }, { word: 'Cynical', definition: 'Believing that people are motivated by self-interest.' }] },
  { id: 'relieved', label: 'Relieved', color: '#0EA5E9', levels: [{ word: 'Eased', definition: 'Lessened in severity or intensity.' }, { word: 'Calmer', definition: 'Not showing or feeling nervousness, anger, or other emotions.' }, { word: 'Reassured', definition: 'Say or do something to remove the doubts and fears of someone.' }, { word: 'Relieved', definition: 'No longer feeling distressed or anxious.' }, { word: 'Unburdened', definition: 'Relieve someone of a burden or responsibility.' }, { word: 'Liberated', definition: 'Free from social conventions or traditional ideas.' }] }
];

const SYNONYM_MAP_VOCAB = {
  'good': { id: 'happy', intensity: 0 }, 'fine': { id: 'happy', intensity: 0 },
  'great': { id: 'happy', intensity: 2 }, 'very good': { id: 'happy', intensity: 4 },
  'bad': { id: 'sad', intensity: 2 }, 'terrible': { id: 'sad', intensity: 5 },
  // ... (Full map logic is handled via searching EMOTIONS_DATA directly in main code)
};

/* =========================================
   UTILITY: ADVANCED EXAMPLE GENERATOR
   ========================================= */
const TEMPLATE_SETS = {
    positive: ["A <span class='italic underline'>{w}</span> smile spread across her face.", "The news put me in a <span class='italic underline'>{w}</span> mood.", "He was <span class='italic underline'>{w}</span> to finally achieve his goal.", "It was a truly <span class='italic underline'>{w}</span> moment.", "She felt <span class='italic underline'>{w}</span> deep down.", "There was a <span class='italic underline'>{w}</span> atmosphere in the room.", "His voice was <span class='italic underline'>{w}</span> and warm.", "I feel <span class='italic underline'>{w}</span> for their success.", "A <span class='italic underline'>{w}</span> sense of peace.", "She looked absolutely <span class='italic underline'>{w}</span>."],
    negative: ["A <span class='italic underline'>{w}</span> silence descended.", "He let out a <span class='italic underline'>{w}</span> sigh.", "She cast a <span class='italic underline'>{w}</span> glance.", "I felt completely <span class='italic underline'>{w}</span>.", "The atmosphere was heavy and <span class='italic underline'>{w}</span>.", "His eyes looked <span class='italic underline'>{w}</span>.", "It was a <span class='italic underline'>{w}</span> realization.", "She whispered a <span class='italic underline'>{w}</span> confession.", "My heart felt <span class='italic underline'>{w}</span>.", "He was visibly <span class='italic underline'>{w}</span>."],
    fear: ["She looked <span class='italic underline'>{w}</span>, as if seeing a ghost.", "A <span class='italic underline'>{w}</span> shiver ran down my spine.", "I felt a <span class='italic underline'>{w}</span> urge to leave.", "Her voice was <span class='italic underline'>{w}</span>.", "The <span class='italic underline'>{w}</span> reality hit me.", "He was <span class='italic underline'>{w}</span> about the decision.", "Feeling <span class='italic underline'>{w}</span> inside.", "A <span class='italic underline'>{w}</span> feeling settled in.", "I was <span class='italic underline'>{w}</span> by the noise.", "She felt <span class='italic underline'>{w}</span>."],
    hostile: ["He shot a <span class='italic underline'>{w}</span> look.", "Her tone was <span class='italic underline'>{w}</span>.", "I felt <span class='italic underline'>{w}</span> just thinking about it.", "A <span class='italic underline'>{w}</span> rage bubbled up.", "She made a <span class='italic underline'>{w}</span> remark.", "His face was <span class='italic underline'>{w}</span>.", "The injustice left me <span class='italic underline'>{w}</span>.", "A <span class='italic underline'>{w}</span> outburst.", "She felt <span class='italic underline'>{w}</span> of them.", "The smell was <span class='italic underline'>{w}</span>."],
    surprise: ["She looked <span class='italic underline'>{w}</span>.", "I was completely <span class='italic underline'>{w}</span>.", "A <span class='italic underline'>{w}</span> gasp.", "He stood there, <span class='italic underline'>{w}</span>.", "A <span class='italic underline'>{w}</span> turn of events.", "My jaw dropped in a <span class='italic underline'>{w}</span> way.", "They were <span class='italic underline'>{w}</span> to find it.", "He blinked, <span class='italic underline'>{w}</span>."]
};

const EMOTION_CATEGORIES = {
    happy: 'positive', inspired: 'positive', confident: 'positive', hopeful: 'positive', proud: 'positive', compassionate: 'positive', adoring: 'positive', grateful: 'positive', relieved: 'positive', calm: 'positive',
    sad: 'negative', lonely: 'negative', guilty: 'negative', disappointed: 'negative', bored: 'negative', exhausted: 'negative',
    afraid: 'fear', anxious: 'fear', skeptical: 'fear', confused: 'fear', embarrassed: 'fear',
    angry: 'hostile', jealous: 'hostile', disgusted: 'hostile', surprised: 'surprise'
};

const getExampleSentences = (word, emotionId) => {
  const w = word.toLowerCase();
  const category = EMOTION_CATEGORIES[emotionId] || 'positive'; 
  const templates = TEMPLATE_SETS[category];
  const seed = w.length + w.charCodeAt(0); 
  const selected = [];
  // Ensure we pick 5 distinct templates deterministically based on the word
  for(let i=0; i<5; i++) {
     const idx = (seed + i * 2) % templates.length;
     selected.push(templates[idx].replace('{w}', w));
  }
  return selected;
};

/* =========================================
   SUB-COMPONENT: PLACEHOLDER PAGE
   ========================================= */
const PlaceholderPage = ({ title, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
    className="w-full h-full flex flex-col items-center justify-center min-h-[60vh] text-center"
  >
    <div className={`p-6 rounded-full bg-gray-900/50 mb-6 ${color}`}>
        <Icon size={64} strokeWidth={1} />
    </div>
    <h2 className="text-4xl font-serif text-white mb-4">{title}</h2>
    <p className="text-gray-500 max-w-md">This module is currently under active development. <br/>Check back soon for the v1.0 release.</p>
    <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}/>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}/>
    </div>
  </motion.div>
);

/* =========================================
   SUB-COMPONENT: DON'T SAY VERY TOOL
   ========================================= */
const TypewriterText = ({ text, className = "", onStart }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === 0 && text && onStart) onStart();
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, onStart]);

  useEffect(() => { setDisplayText(''); setCurrentIndex(0); }, [text]);
  return <span className={className}>{displayText}</span>;
};

const DontSayVeryTool = ({ onBack }) => {
  const [adjective, setAdjective] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const getSuggestion = () => {
    if (!adjective.trim() || isLoading) return;
    setIsLoading(true);
    
    setTimeout(() => {
        const key = adjective.toLowerCase().trim();
        const result = VERY_DATA[key];
        
        if (result) {
            setSuggestion(result.word.toLowerCase());
            setData(result);
        } else {
            setSuggestion("Searching..."); 
            setData(null);
            setTimeout(() => {
                setSuggestion("Unknown");
                setData({
                    word: "Unknown",
                    type: "Adj",
                    uk: "---",
                    us: "---",
                    def: "Word not found in offline database.",
                    ety: "N/A",
                    examples: ["Try a common adjective like 'good', 'bad', 'happy'."]
                });
            }, 500);
        }
        setIsLoading(false);
    }, 600); // Simulate processing time
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-20 px-6">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,_#4f46e510_0%,_transparent_60%)]" />
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-24 left-6 md:left-10 text-gray-500 hover:text-white transition-colors flex items-center gap-2 group z-20"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm uppercase tracking-widest font-medium">Back</span>
      </button>

      <div className="w-full max-w-3xl space-y-12 relative z-10 mt-8">
        <div className={`flex flex-col items-center justify-center transition-transform duration-500 ease-out ${isTyping ? '-translate-y-4' : 'translate-y-0'}`}>
             <div className="flex flex-col items-center gap-2 mb-1">
                <span className="text-4xl md:text-5xl font-sans font-light text-gray-500 italic tracking-wider">very</span>
             </div>
             <div className="relative flex items-baseline gap-4 mt-4">
                <input
                  type="text"
                  value={adjective}
                  onChange={(e) => { setAdjective(e.target.value); setSuggestion(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && getSuggestion()}
                  placeholder="good"
                  className="bg-transparent border-b-2 border-gray-700 text-center text-5xl md:text-6xl font-serif text-white outline-none w-64 pb-2 focus:border-indigo-500 transition-colors placeholder:text-gray-800"
                  disabled={isLoading}
                />
                <button
                    onClick={() => adjective && getSuggestion()}
                    disabled={!adjective || isLoading}
                    className="absolute -right-12 top-4 p-2 text-gray-500 hover:text-indigo-400 disabled:opacity-30 transition-colors"
                >
                    <Search size={32} />
                </button>
             </div>
        </div>

        {isLoading && (
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '0s'}}/>
                    <span className="w-3 h-3 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}/>
                    <span className="w-3 h-3 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}/>
                </div>
                <span className="text-gray-600 font-sans font-light italic">Searching...</span>
            </div>
        )}

        {suggestion && !isLoading && data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center space-y-8">
                <div className="text-center space-y-4">
                     <h2 className="text-6xl md:text-8xl font-serif text-white tracking-tight relative inline-block">
                        <TypewriterText text={suggestion} onStart={() => setIsTyping(true)} />
                        <span className="absolute -top-6 -right-16 text-xs font-sans font-medium text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider">{data.type}</span>
                     </h2>
                     <div className="flex justify-center gap-6 text-gray-400 font-sans text-sm tracking-wider">
                        {data.uk && <span className="flex items-center gap-2"><span className="text-gray-600 uppercase text-xs">UK</span> <span className="text-white font-medium">{data.uk}</span></span>}
                        <span className="text-gray-700">|</span>
                        {data.us && <span className="flex items-center gap-2"><span className="text-gray-600 uppercase text-xs">US</span> <span className="text-white font-medium">{data.us}</span></span>}
                     </div>
                </div>

                <div className="flex gap-4">
                    <button className="p-3 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors border border-gray-800"><Volume2 size={20} /></button>
                    <button onClick={() => getSuggestion(true)} className="p-3 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors border border-gray-800"><RefreshCw size={20} /></button>
                </div>

                <div className="w-full space-y-6">
                    {/* Definition Block */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 relative group overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-indigo-500/30">
                        <div className="absolute top-4 right-4 opacity-20 text-indigo-500 group-hover:text-indigo-400 group-hover:opacity-60 transition-all duration-300">
                            <Zap size={24} />
                        </div>
                        <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-sans font-semibold group-hover:text-indigo-400 transition-colors">Definition</h4>
                        <p className="text-xl text-gray-300 italic leading-relaxed font-serif">"{data.def}"</p>
                    </div>

                    {/* Etymology Block - Full Width */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 relative group overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-indigo-500/30">
                        <div className="absolute top-4 right-4 opacity-20 text-indigo-500 group-hover:text-indigo-400 group-hover:opacity-60 transition-all duration-300">
                            <BookOpen size={24} />
                        </div>
                        <h4 className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-sans font-semibold flex items-center gap-2 group-hover:text-indigo-300 transition-colors">
                            Etymology
                        </h4>
                        <p className="text-sm text-gray-400 font-sans leading-relaxed opacity-80 border-l-2 border-indigo-900 pl-3 group-hover:border-indigo-500 transition-colors">
                            {data.ety}
                        </p>
                    </div>
                </div>

                {data.examples.length > 0 && (
                     <div className="w-full space-y-3">
                        <div className="text-center text-xs uppercase tracking-widest text-gray-600 mb-4 font-sans font-semibold">Contextual Usage</div>
                        {data.examples.map((ex, i) => (
                             <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 transition-all duration-300 group">
                                <p className="text-base text-gray-300 font-serif" dangerouslySetInnerHTML={{ __html: `"${ex.replace(new RegExp(`\\b${suggestion}\\b`, 'gi'), `<span class="text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">${suggestion}</span>`)}"` }} />
                             </div>
                        ))}
                     </div>
                )}
            </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/* =========================================
   SUB-COMPONENT: VOCAB SLIDER TOOL
   ========================================= */
const VocabSliderTool = ({ onBack }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [intensity, setIntensity] = useState(3);
  
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const lowerTerm = searchTerm.toLowerCase();
    const results = [];
    Object.keys(SYNONYM_MAP_VOCAB).forEach(key => { // Use basic map for quick lookup or extend if needed
        if (key.includes(lowerTerm) || lowerTerm.includes(key)) {
            const match = SYNONYM_MAP_VOCAB[key];
            const emotionData = EMOTIONS_DATA.find(e => e.id === match.id);
            if (emotionData) {
                 results.push({ type: 'synonym', id: `syn-${key}`, label: key.charAt(0).toUpperCase() + key.slice(1), subLabel: `Maps to ${emotionData.label}`, emotionData: emotionData, targetIndex: match.intensity });
            }
        }
    });
    EMOTIONS_DATA.forEach(emotion => {
      if (emotion.label.toLowerCase().includes(lowerTerm)) {
        const defaultIdx = Math.floor(emotion.levels.length / 2);
        results.push({ type: 'category', id: emotion.id, label: emotion.label, subLabel: 'Emotion', emotionData: emotion, defaultIndex: defaultIdx });
      }
    });
    EMOTIONS_DATA.forEach(emotion => {
      emotion.levels.forEach((level, index) => {
        if (level.word.toLowerCase().includes(lowerTerm)) {
          if (!results.some(r => r.type === 'category' && r.label === emotion.label && level.word === emotion.label)) {
             results.push({ type: 'word', id: `${emotion.id}-${index}`, label: level.word, subLabel: emotion.label, emotionData: emotion, targetIndex: index });
          }
        }
      });
    });
    return results;
  }, [searchTerm]);

  const handleSelect = (result) => {
    setSelectedEmotion(result.emotionData);
    if (result.type === 'word' || result.type === 'synonym') setIntensity(result.targetIndex);
    else setIntensity(result.defaultIndex);
    setSearchTerm('');
    setIsFocused(false);
  };

  const handleReset = () => { setSelectedEmotion(null); setSearchTerm(''); };
  const handleSuggestedClick = (emotion) => { setSelectedEmotion(emotion); setIntensity(Math.floor(emotion.levels.length / 2)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const suggestedEmotions = useMemo(() => { if (!selectedEmotion) return []; return EMOTIONS_DATA.filter(e => e.id !== selectedEmotion.id).sort(() => 0.5 - Math.random()).slice(0, 5); }, [selectedEmotion]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full min-h-screen flex flex-col pb-20 pt-10">
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000" style={{ background: selectedEmotion ? `radial-gradient(circle at 50% 30%, ${selectedEmotion.color}15 0%, transparent 70%)` : 'transparent' }} />
      <style>{`input[type=range]{-webkit-appearance:none;width:100%;background:transparent}input[type=range]:focus{outline:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:32px;width:32px;border-radius:50%;background:#000;border:3px solid white;cursor:grab;margin-top:-10px;box-shadow:0 4px 12px rgba(0,0,0,.5);transition:transform .2s cubic-bezier(.4,0,.2,1),box-shadow .2s ease}input[type=range]::-webkit-slider-thumb:active{transform:scale(1.15);cursor:grabbing;box-shadow:0 0 0 8px rgba(255,255,255,.1)}input[type=range]::-moz-range-thumb{height:32px;width:32px;border-radius:50%;background:#000;border:3px solid white;cursor:grab;transition:transform .2s ease}input[type=range]::-moz-range-thumb:active{transform:scale(1.15);cursor:grabbing}input[type=range]::-webkit-slider-runnable-track{width:100%;height:12px;cursor:pointer;border-radius:999px}`}</style>
      <motion.div layout transition={{ type: 'spring', stiffness: 100, damping: 20 }} className={`w-full flex justify-center ${selectedEmotion ? 'items-start pt-0' : 'items-center flex-1 -mt-32'}`}>
        <div className={`relative w-full transition-all duration-700 ${selectedEmotion ? 'max-w-md' : 'max-w-xl'}`}>
          {!selectedEmotion && <motion.label initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="block text-center text-gray-500 text-sm uppercase tracking-[0.3em] mb-6">Emotional Vocabulary</motion.label>}
          <div className="relative group z-50">
            <input type="text" value={selectedEmotion ? selectedEmotion.label : searchTerm} onChange={(e) => { setSearchTerm(e.target.value); if (selectedEmotion) handleReset(); }} onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 200)} placeholder="How are you feeling?" className={`w-full bg-transparent border-b outline-none text-center font-serif transition-all duration-500 placeholder:text-gray-700 ${selectedEmotion ? 'text-2xl py-2 border-gray-800 text-gray-400' : 'text-4xl md:text-5xl py-4 border-gray-700 focus:border-white text-white'}`} />
            {!selectedEmotion && !searchTerm && <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"><Search size={24} /></div>}
          </div>
          <AnimatePresence>
            {searchTerm && !selectedEmotion && (
              <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: 10, height: 0 }} className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                {searchResults.length > 0 ? searchResults.map((result, idx) => (
                    <button key={`${result.id}-${idx}`} onClick={() => handleSelect(result)} className="w-full text-left px-6 py-4 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-gray-900/50 last:border-0">
                      <div className="flex flex-col"><span className="text-lg font-serif text-gray-200 group-hover:text-white transition-colors">{result.label}</span><span className="text-xs text-gray-500 uppercase tracking-wider group-hover:text-gray-400">{result.subLabel}</span></div>
                      <span className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: result.emotionData.color }} />
                    </button>
                  )) : <div className="p-6 text-center text-gray-600">No matches found.</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        {selectedEmotion && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-12 w-full max-w-3xl mx-auto">
            <div className="flex flex-col items-center w-full gap-6 mb-12">
              <div className="relative text-center min-h-[5rem] flex items-center justify-center">
                <AnimatePresence mode="wait"><motion.h1 key={selectedEmotion.levels[intensity].word} initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }} transition={{ duration: 0.5, ease: "easeOut" }} className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight relative z-10" style={{ textShadow: `0 0 40px ${selectedEmotion.color}40` }}>{selectedEmotion.levels[intensity].word}</motion.h1></AnimatePresence>
              </div>
              <div className="relative text-center min-h-[3rem] max-w-lg px-4 flex items-center justify-center">
                <AnimatePresence mode="wait"><motion.p key={`def-${selectedEmotion.levels[intensity].word}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">{selectedEmotion.levels[intensity].definition}</motion.p></AnimatePresence>
              </div>
            </div>
            <div className="w-full px-4 md:px-0 mb-20">
              <div className="relative w-full h-16 flex items-center">
                <div className="absolute left-0 right-0 h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800/50"><motion.div className="h-full w-full opacity-90" style={{ background: `linear-gradient(90deg, ${selectedEmotion.color}10 0%, ${selectedEmotion.color} ${(intensity / (selectedEmotion.levels.length - 1)) * 100}%, transparent ${(intensity / (selectedEmotion.levels.length - 1)) * 100}%)`, boxShadow: `0 0 20px ${selectedEmotion.color}30` }} /></div>
                <input type="range" min={0} max={selectedEmotion.levels.length - 1} step={1} value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="relative z-10 w-full opacity-100" />
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-[16px]">{selectedEmotion.levels.map((_, idx) => <div key={idx} className={`w-1 h-1 rounded-full transition-all duration-300 ${idx <= intensity ? 'bg-white opacity-100 scale-150' : 'bg-gray-700 opacity-40'}`} />)}</div>
              </div>
              <div className="flex justify-between -mt-2 text-xs tracking-[0.2em] text-gray-600 uppercase font-medium"><span>Subtle</span><span>Intense</span></div>
            </div>
            <div className="w-full max-w-2xl mb-24">
               <div className="text-xs uppercase tracking-widest text-gray-500 mb-6 text-center border-b border-gray-900 pb-4">Usage in Context</div>
               <div className="space-y-4 perspective-1000">
                <AnimatePresence mode="wait"><motion.div key={selectedEmotion.levels[intensity].word} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.5, staggerChildren: 0.05 }} className="flex flex-col gap-4">{getExampleSentences(selectedEmotion.levels[intensity].word, selectedEmotion.id).map((sentence, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative bg-[#0e0e0e] border border-gray-800 rounded-xl p-6 text-gray-300 font-serif text-lg text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-gray-700 hover:text-gray-100">
                        <span dangerouslySetInnerHTML={{ __html: sentence }} />
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `inset 0 0 25px ${selectedEmotion.color}20` }} />
                    </motion.div>
                ))}</motion.div></AnimatePresence>
               </div>
            </div>
            <div className="w-full pt-10 border-t border-gray-900">
                <div className="text-center text-xs uppercase tracking-widest text-gray-600 mb-8">Explore Related Emotions</div>
                <div className="flex flex-wrap justify-center gap-4">{suggestedEmotions.map(emotion => (<button key={emotion.id} onClick={() => handleSuggestedClick(emotion)} className="px-6 py-3 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800 transition-all duration-300 flex items-center justify-center text-center gap-2 group flex-shrink-0 min-w-[120px]"><span>{emotion.label}</span><ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" /></button>))}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* =========================================
   SUB-COMPONENT: HOME PAGE (A BETTER YOU)
   ========================================= */
const HomePage = ({ onNavigate }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-10 pb-20"
        >
            <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
                {/* HERO SECTION - REDUCED SIZE & SPACING */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center mb-4 relative">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-white mb-2 leading-[1] mix-blend-screen relative z-10">
                        A BETTER YOU.
                    </h1>
                </motion.div>

                {/* PRISM OBJECT - CLOSER TO TEXT */}
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 1, type: "spring" }}
                    className="mb-4 relative flex items-center justify-center w-full"
                >
                    <div style={{ transform: 'scale(0.5)' }}>
                        <div className="scene">
                            <div className="prism">
                                <div className="facet" style={{transform: 'rotateY(0deg) translateZ(40px)'}}></div>
                                <div className="facet" style={{transform: 'rotateY(60deg) translateZ(40px)'}}></div>
                                <div className="facet" style={{transform: 'rotateY(120deg) translateZ(40px)'}}></div>
                                <div className="facet" style={{transform: 'rotateY(180deg) translateZ(40px)'}}></div>
                                <div className="facet" style={{transform: 'rotateY(240deg) translateZ(40px)'}}></div>
                                <div className="facet" style={{transform: 'rotateY(300deg) translateZ(40px)'}}></div>
                                <div className="void"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* SUBTEXT - CLOSER TO OBJECT */}
                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="text-gray-400 font-serif text-lg md:text-xl tracking-tight max-w-lg mx-auto leading-relaxed text-center mb-12 italic opacity-80">
                    Refine your inner signal. A minimalist ecosystem for clarity, growth, and intentionality.
                </motion.p>

                {/* VARIOUS TOOLS HEADER */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.25 }} className="w-full text-left mb-4 border-b border-gray-800 pb-2">
                    <span className="text-xs font-sans font-semibold tracking-widest text-gray-500 uppercase">Various Tools</span>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} className="w-full flex flex-col gap-6">
                    <button onClick={() => onNavigate('vocab')} className="group relative w-full h-28 bg-[#0a0a0a] border border-gray-800 rounded-xl flex items-center px-8 gap-6 hover:border-amber-500/50 hover:bg-gray-900/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-amber-900/10 overflow-hidden">
                         <div className="p-4 bg-gray-900 rounded-full text-amber-500/80 group-hover:text-amber-400 transition-colors">
                             <MessageSquare size={28} strokeWidth={1.5} />
                         </div>
                         <div className="flex-1 text-left space-y-1">
                             <h3 className="text-xl font-serif text-gray-200 group-hover:text-white transition-colors">Vocab Slider</h3>
                             <p className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-400">Precision in emotional expression</p>
                         </div>
                         <ArrowRight size={20} className="text-gray-700 group-hover:text-amber-400 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </button>

                    <button onClick={() => onNavigate('very')} className="group relative w-full h-28 bg-[#0a0a0a] border border-gray-800 rounded-xl flex items-center px-8 gap-6 hover:border-cyan-500/50 hover:bg-gray-900/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-cyan-900/10 overflow-hidden">
                         <div className="p-4 bg-gray-900 rounded-full text-cyan-500/80 group-hover:text-cyan-400 transition-colors">
                             <Activity size={28} strokeWidth={1.5} />
                         </div>
                         <div className="flex-1 text-left space-y-1">
                             <h3 className="text-xl font-serif text-gray-200 group-hover:text-white transition-colors">Don't Say 'Very'</h3>
                             <p className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-400">Expand your descriptive power</p>
                         </div>
                         <div className="hidden md:flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-900/50 group-hover:bg-cyan-500 transition-colors" />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-900/50 group-hover:bg-cyan-500 transition-colors delay-75" />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-900/50 group-hover:bg-cyan-500 transition-colors delay-150" />
                         </div>
                    </button>

                     <button onClick={() => onNavigate('principles')} className="group relative w-full h-28 bg-[#0a0a0a] border border-gray-800 rounded-xl flex items-center px-8 gap-6 hover:border-emerald-500/50 hover:bg-gray-900/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-900/10 overflow-hidden">
                         <div className="p-4 bg-gray-900 rounded-full text-emerald-500/80 group-hover:text-emerald-400 transition-colors">
                             <Brain size={28} strokeWidth={1.5} />
                         </div>
                         <div className="flex-1 text-left space-y-1">
                             <h3 className="text-xl font-serif text-gray-200 group-hover:text-white transition-colors">First Principles</h3>
                             <p className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-400">Deconstruct complex problems</p>
                         </div>
                         <span className="text-[10px] bg-gray-900 text-gray-500 px-2 py-1 rounded uppercase tracking-wider group-hover:bg-emerald-900/20 group-hover:text-emerald-400 transition-colors">Coming Soon</span>
                    </button>

                    <button onClick={() => onNavigate('quotes')} className="group relative w-full h-28 bg-[#0a0a0a] border border-gray-800 rounded-xl flex items-center px-8 gap-6 hover:border-rose-500/50 hover:bg-gray-900/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-rose-900/10 overflow-hidden">
                         <div className="p-4 bg-gray-900 rounded-full text-rose-500/80 group-hover:text-rose-400 transition-colors">
                             <Quote size={28} strokeWidth={1.5} />
                         </div>
                         <div className="flex-1 text-left space-y-1">
                             <h3 className="text-xl font-serif text-gray-200 group-hover:text-white transition-colors">Good Quotes</h3>
                             <p className="text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-400">Curated wisdom for clarity</p>
                         </div>
                         <span className="text-[10px] bg-gray-900 text-gray-500 px-2 py-1 rounded uppercase tracking-wider group-hover:bg-rose-900/20 group-hover:text-rose-400 transition-colors">Coming Soon</span>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* =========================================
   MAIN APP SHELL
   ========================================= */
export default function App() {
  const [currentView, setCurrentView] = useState('home');

  // VIEW MAPPING FOR GLASS NAV
  const views = ['home', 'vocab', 'very', 'principles', 'quotes'];
  const activeIndex = views.indexOf(currentView);

  return (
    <div className="min-h-screen bg-[#313131] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden relative container">
      {/* GLOBAL CSS FOR NEW BACKGROUND & PRISM & GLASS NAV */}
      <style>{`
        /* --- Background Animation --- */
        .container {
          background-color: #0b0b0d; /* Matching dark aesthetic */
          background-image: radial-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 0);
          background-size: 40px 40px;
          animation: moveBackground 60s linear infinite alternate;
        }
        @keyframes moveBackground {
          0% { background-position: 0px 0px; }
          25% { background-position: 20px 0px; }
          50% { background-position: 20px 20px; }
          75% { background-position: 0px 20px; }
          100% { background-position: 0px 0px; }
        }

        /* --- Prism Object CSS --- */
        .scene { width: 320px; height: 320px; perspective: 900px; }
        .prism { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; animation: rotate 20s linear infinite; }
        .facet {
          position: absolute; inset: 0; border-radius: 18px;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.15), rgba(255, 200, 120, 0.15), rgba(120, 180, 255, 0.15));
          backdrop-filter: blur(2px); transform-origin: center;
          clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%);
          box-shadow: inset 0 0 30px rgba(255,255,255,0.15), 0 0 40px rgba(120,180,255,0.15);
        }
        .void { position: absolute; inset: 25%; border-radius: 50%; background: radial-gradient(circle, #000 60%, transparent 70%); transform: translateZ(1px); }
        @keyframes rotate { from { transform: rotateX(18deg) rotateY(0deg); } to { transform: rotateX(18deg) rotateY(360deg); } }

        /* --- Glass Radio Nav --- */
        .glass-nav-container {
            display: flex; position: relative; background: rgba(255, 255, 255, 0.08); /* Increased opacity 10% */
            border-radius: 999px; backdrop-filter: blur(16px);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.3); /* Stronger border */
            padding: 4px; width: fit-content; margin: 0 auto;
        }
        .glass-nav-item {
            position: relative; z-index: 2; padding: 12px 24px; cursor: pointer;
            font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
            color: #999; transition: color 0.3s; border-radius: 999px; min-width: 120px; text-align: center;
        }
        .glass-nav-item.active { color: #fff; }
        .glass-nav-item:hover { color: #ccc; }
        .glass-glider {
            position: absolute; top: 4px; bottom: 4px; left: 4px;
            background: rgba(255, 255, 255, 0.18); border-radius: 999px; z-index: 1;
            transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            width: 120px; /* Approximate width of item */
            box-shadow: 0 0 15px rgba(255,255,255,0.15);
        }
      `}</style>

      {/* FLOATING HEADER (Bottom on desktop for ergonomics, Top on mobile) */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="glass-nav-container pointer-events-auto">
              <div 
                  className="glass-glider" 
                  style={{ transform: `translateX(${activeIndex * 100}%)`, width: '120px' }} // Dynamic Slide
              />
              {views.map((view) => (
                  <div 
                    key={view}
                    className={`glass-nav-item ${currentView === view ? 'active' : ''}`}
                    onClick={() => setCurrentView(view)}
                    style={{ width: '120px' }} // Fixed width for alignment with calculation
                  >
                      {view === 'very' ? 'Don\'t' : view.charAt(0).toUpperCase() + view.slice(1)}
                  </div>
              ))}
          </div>
      </div>

      <div className="min-h-screen">
          <AnimatePresence mode="wait">
              {currentView === 'home' && <HomePage key="home" onNavigate={setCurrentView} />}
              {currentView === 'vocab' && <VocabSliderTool key="vocab" onBack={() => setCurrentView('home')} />}
              {currentView === 'very' && <DontSayVeryTool key="very" onBack={() => setCurrentView('home')} />}
              {currentView === 'principles' && <PlaceholderPage key="principles" title="First Principles" icon={Brain} color="text-emerald-400" />}
              {currentView === 'quotes' && <PlaceholderPage key="quotes" title="Good Quotes" icon={Quote} color="text-rose-400" />}
          </AnimatePresence>
      </div>

      <footer className="fixed bottom-2 right-4 text-[10px] text-gray-700 uppercase tracking-widest pointer-events-none hidden md:block">
          System v2.0
      </footer>
    </div>
  );
}
