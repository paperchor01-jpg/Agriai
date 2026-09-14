/**
 * AgriAI Multilingual Localization Service
 * Supports 11 Indian Languages: English, Hindi, Punjabi, Marathi, Bengali, Tamil, Telugu, Kannada, Gujarati, Malayalam, Odia
 */

export type SupportedLanguage =
  | 'en' // English
  | 'hi' // हिन्दी (Hindi)
  | 'pa' // ਪੰਜਾਬੀ (Punjabi)
  | 'mr' // मराठी (Marathi)
  | 'bn' // বাংলা (Bengali)
  | 'ta' // தமிழ் (Tamil)
  | 'te' // తెలుగు (Telugu)
  | 'kn' // ಕನ್ನಡ (Kannada)
  | 'gu' // ગુજરાતી (Gujarati)
  | 'ml' // മലയാളം (Malayalam)
  | 'or'; // ଓଡ଼ିଆ (Odia)

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

const DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    pa: 'ਡੈਸ਼ਬੋਰਡ',
    mr: 'डॅशबोर्ड',
    bn: 'ড্যাশবোর্ড',
    ta: 'முகப்பு',
    te: 'డ్యాష్‌బోర్డ్',
    kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    gu: 'ડૅશબોર્ડ',
    ml: 'ഡാഷ്‌ബോർഡ്',
    or: 'ଡ୍ୟାସବୋର୍ଡ',
  },
  'nav.my_farms': {
    en: 'My Farms',
    hi: 'मेरे खेत',
    pa: 'ਮੇਰੇ ਖੇਤ',
    mr: 'माझी शेती',
    bn: 'আমার খামার',
    ta: 'என் பண்ணைகள்',
    te: 'நா పొలాలు',
    kn: 'ನನ್ನ ಜಮೀನುಗಳು',
    gu: 'મારા ખેતરો',
    ml: 'എന്റെ കൃഷിയിടങ്ങൾ',
    or: 'ମୋର କ୍ଷେତ',
  },
  'nav.crop_hub': {
    en: 'Crop Hub',
    hi: 'फसल केंद्र',
    pa: 'ਫਸਲ ਕੇਂਦਰ',
    mr: 'पीक केंद्र',
    bn: 'ফসল কেন্দ্র',
    ta: 'பயிர் மையம்',
    te: 'పంట కేంద్రం',
    kn: 'ಬೆಳೆ ಕೇಂದ್ರ',
    gu: 'પાક કેન્દ્ર',
    ml: 'വിള കേന്ദ്രം',
    or: 'ଫସଲ କେନ୍ଦ୍ର',
  },
  'nav.crop_doctor': {
    en: 'AI Crop Doctor',
    hi: 'एआई फसल डॉक्टर',
    pa: 'ਏਆਈ ਫਸਲ ਡਾਕਟਰ',
    mr: 'एआय पीक डॉक्टर',
    bn: 'এআই ফসল ডাক্তার',
    ta: 'AI பயிர் மருத்துவர்',
    te: 'AI పంట డాక్టర్',
    kn: 'AI ಬೆಳೆ ವೈದ್ಯ',
    gu: 'AI પાક ડૉક્ટર',
    ml: 'AI വിള ഡോക്ടർ',
    or: 'AI ଫସଲ ଡାକ୍ତର',
  },
  'nav.weather': {
    en: 'Weather',
    hi: 'मौसम',
    pa: 'ਮੌਸਮ',
    mr: 'हवामान',
    bn: 'আবহাওয়া',
    ta: 'வானிலை',
    te: 'వాతావరణం',
    kn: 'ಹವಾಮಾನ',
    gu: 'હવામાન',
    ml: 'കാലാവസ്ഥ',
    or: 'ପାଣିପାଗ',
  },
  'nav.advisory': {
    en: 'Advisory',
    hi: 'कृषि सलाह',
    pa: 'ਖੇਤੀ ਸਲਾਹ',
    mr: 'शेती सल्ला',
    bn: 'কৃষি পরামর্শ',
    ta: 'ஆலோசனை',
    te: 'వ్యవసాయ సలహా',
    kn: 'ಕೃಷಿ ಸಲಹೆ',
    gu: 'ખેતી સલાહ',
    ml: 'കാർഷിക നിർദ്ദേശം',
    or: 'କୃଷି ପରାମର୍ଶ',
  },
  'nav.alerts': {
    en: 'Alerts',
    hi: 'सूचनाएं व चेतावनियां',
    pa: 'ਚੇਤਾਵਨੀਆਂ',
    mr: 'सूचना व इशारे',
    bn: 'সতর্কবার্তা',
    ta: 'எச்சரிக்கைகள்',
    te: 'హెచ్చరికలు',
    kn: 'ಎಚ್ಚರಿಕೆಗಳು',
    gu: 'ચેતવણીઓ',
    ml: 'മുന്നറിയിപ്പുകൾ',
    or: 'ଚେତାବନୀ',
  },
  'nav.analytics': {
    en: 'Analytics',
    hi: 'विश्लेषण',
    pa: 'ਵਿਸ਼ਲੇਸ਼ਣ',
    mr: 'विश्लेषण',
    bn: 'বিশ্লেষণ',
    ta: 'பகுப்பாய்வு',
    te: 'విశ్లేషణ',
    kn: 'ವಿಶ್ಲೇಷಣೆ',
    gu: 'વિશ્લેષણ',
    ml: 'വിശകലനം',
    or: 'ବିଶ୍ଳେଷଣ',
  },
  'nav.yield': {
    en: 'Yield Prediction',
    hi: 'उपज अनुमान',
    pa: 'ਉਪਜ ਅਨੁਮਾਨ',
    mr: 'उत्पादन अंदाज',
    bn: 'ফলন পূর্বাভাস',
    ta: 'விளைச்சல் கணிப்பு',
    te: 'దిగుబడి అంచనా',
    kn: 'ಇಳುವರಿ ಅಂದಾಜು',
    gu: 'ઉત્પાદન અંદાજ',
    ml: 'വിളവ് പ്രവചനം',
    or: 'ଅମଳ ଅନୁମାନ',
  },
  'nav.impact': {
    en: 'Impact & Evidence',
    hi: 'प्रभाव व परिणाम',
    pa: 'ਪ੍ਰਭਾਵ ਅਤੇ ਨਤੀਜੇ',
    mr: 'प्रभाव व पुरावे',
    bn: 'প্রভাব ও প্রমাণ',
    ta: 'தாக்கம் & சான்றுகள்',
    te: 'ప్రభావం & సాక్ష్యాలు',
    kn: 'ಪರಿಣಾಮ ಮತ್ತು ಪುರಾವೆ',
    gu: 'અસર અને પુરાવા',
    ml: 'സ്വാധീനവും തെളിവുകളും',
    or: 'ପ୍ରଭାବ ଓ ପ୍ରମାଣ',
  },
  'nav.profile': {
    en: 'Farmer Profile',
    hi: 'किसान प्रोफ़ाइल',
    pa: 'ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ',
    mr: 'शेतकरी प्रोफाइल',
    bn: 'কৃষক প্রোফাইল',
    ta: 'விவசாயி சுயவிவரம்',
    te: 'రైతు ప్రొఫైల్',
    kn: 'ರೈತ ಪ್ರೊಫೈಲ್',
    gu: 'ખેડૂત પ્રોફાઇલ',
    ml: 'കർഷക പ്രൊഫൈൽ',
    or: 'କୃଷକ ପ୍ରୋଫାଇଲ୍',
  },
  'today.title': {
    en: 'What Should I Do Today?',
    hi: 'आज मुझे क्या करना चाहिए?',
    pa: 'ਅੱਜ ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
    mr: 'आज मी काय करावे?',
    bn: 'আজ আমার কী করা উচিত?',
    ta: 'இன்று நான் என்ன செய்ய வேண்டும்?',
    te: 'ఈరోజు నేను ఏమి చేయాలి?',
    kn: 'ಇಂದು ನಾನು ಏನು ಮಾಡಬೇಕು?',
    gu: 'આજે મારે શું કરવું જોઈએ?',
    ml: 'ഇന്ന് ഞാൻ എന്താണ് ചെയ്യേണ്ടത്?',
    or: 'ଆଜି ମୁଁ କଣ କରିବା ଉଚିତ୍?',
  },
  'today.subtitle': {
    en: 'Actionable, priority recommendations based on real crop stage, soil, and weather.',
    hi: 'वास्तविक फसल अवस्था, मिट्टी और मौसम के आधार पर प्राथमिकता-वार कार्य।',
    pa: 'ਅਸਲ ਫਸਲ ਦੇ ਪੜਾਅ, ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਦੇ ਆਧਾਰ ਤੇ ਤਰਜੀਹੀ ਕਾਰਵਾਈਆਂ।',
    mr: 'वास्तविक पीक स्थिती, माती आणि हवामानावर आधारित प्राधान्य कृती.',
    bn: 'প্রকৃত ফসলের অবস্থা, মাটি এবং আবহাওয়ার উপর ভিত্তি করে করণীয় কাজ।',
    ta: 'உண்மையான பயிர் நிலை, மண் மற்றும் வானிலை அடிப்படையிலான பணிகள்.',
    te: 'వాస్తవ పంట దశ, నేల మరియు వాతావరణం ఆధారంగా ప్రాధాన్యతా చర్యలు.',
    kn: 'ನೈಜ ಬೆಳೆ ಹಂತ, ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ಆಧರಿತ ಆದ್ಯತೆಯ ಕ್ರಮಗಳು.',
    gu: 'વાસ્તવિક પાકની સ્થિતિ, જમીન અને હવામાન આધારિત પ્રાથમિકતાના પગલાં.',
    ml: 'യഥാർത്ഥ വിള ഘട്ടം, മണ്ണ്, കാലാവസ്ഥ എന്നിവയെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവർത്തനങ്ങൾ.',
    or: 'ବାସ୍ତବିକ ଫସଲ ଅବସ୍ଥା, ମାଟି ଏବଂ ପାଣିପାଗ ଉପରେ ଆଧାରିତ କାର୍ଯ୍ୟ।',
  },
  'common.loading': {
    en: 'Loading farm intelligence...',
    hi: 'कृषि डेटा लोड हो रहा है...',
    pa: 'ਖੇਤੀ ਡਾਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    mr: 'शेती माहिती लोड होत आहे...',
    bn: 'তথ্য লোড হচ্ছে...',
    ta: 'ஏற்றுகிறது...',
    te: 'లోడ్ అవుతోంది...',
    kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    gu: 'લોડ થઈ રહ્યું છે...',
    ml: 'ലോഡ് ചെയ്യുന്നു...',
    or: 'ଲୋଡ୍ ହେଉଛି...',
  },
  'common.no_farm': {
    en: 'No farms added yet. Please add your farm to see personalized recommendations.',
    hi: 'अभी तक कोई खेत नहीं जोड़ा गया है। व्यक्तिगत सलाह देखने के लिए अपना खेत जोड़ें।',
    pa: 'ਕੋਈ ਖੇਤ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਨਿੱਜੀ ਸਲਾਹ ਲਈ ਆਪਣਾ ਖੇਤ ਸ਼ਾਮਲ ਕਰੋ।',
    mr: 'अद्याप कोणतेही शेत जोडलेले नाही. वैयक्तिक सल्ल्यासाठी कृपया आपले शेत जोडा.',
    bn: 'এখনও কোনো খামার যুক্ত করা হয়নি। ব্যক্তিগত পরামর্শের জন্য আপনার খামার যোগ করুন।',
    ta: 'இன்னும் பண்ணைகள் சேர்க்கப்படவில்லை. பரிந்துரைகளுக்கு உங்கள் பண்ணையைச் சேர்க்கவும்.',
    te: 'ఇంకా పొలాలు జోడించబడలేదు. సిఫార్సుల కోసం మీ పొలాన్ని జోడించండి.',
    kn: 'ಇನ್ನೂ ಯಾವುದೇ ಜಮೀನು ಸೇರಿಸಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜಮೀನನ್ನು ಸೇರಿಸಿ.',
    gu: 'હજુ સુધી કોઈ ખેતર ઉમેર્યું નથી. ભલામણો માટે કૃપા કરીને તમારું ખેતર ઉમેરો.',
    ml: 'കൃഷിയിടങ്ങൾ ചേർത്തിട്ടില്ല. നിർദ്ദേശങ്ങൾക്കായി നിങ്ങളുടെ കൃഷിയിടം ചേർക്കുക.',
    or: 'କୌଣସି କ୍ଷେତ ଯୋଡ଼ା ଯାଇନାହିଁ। ଦୟାକରି ଆପଣଙ୍କ କ୍ଷେତ ଯୋଡ଼ନ୍ତୁ।',
  },
  'common.select_farm': {
    en: 'Select Farm',
    hi: 'खेत चुनें',
    pa: 'ਖੇਤ ਚੁਣੋ',
    mr: 'शेत निवडा',
    bn: 'খামার নির্বাচন করুন',
    ta: 'பண்ணையைத் தேர்ந்தெடுக்கவும்',
    te: 'పొలాన్ని ఎంచుకోండి',
    kn: 'ಜಮೀನು ಆಯ್ಕೆಮಾಡಿ',
    gu: 'ખેતર પસંદ કરો',
    ml: 'കൃഷിയിടം തിരഞ്ഞെടുക്കുക',
    or: 'କ୍ଷେତ ବାଛନ୍ତୁ',
  },
  'common.talk_agriai': {
    en: 'Talk to AgriAI',
    hi: 'एग्रीएआई से बात करें',
    pa: 'AgriAI ਨਾਲ ਗੱਲ ਕਰੋ',
    mr: 'AgriAI शी बोला',
    bn: 'AgriAI এর সাথে কথা বলুন',
    ta: 'AgriAI உடன் பேசுங்கள்',
    te: 'AgriAI తో మాట్లాడండి',
    kn: 'AgriAI ಜೊತೆ ಮಾತನಾಡಿ',
    gu: 'AgriAI સાથે વાત કરો',
    ml: 'AgriAI യോട് സംസാരിക്കുക',
    or: 'AgriAI ସହ କଥା ହୁଅନ୍ତୁ',
  },
  'common.listening': {
    en: 'Listening... Speak in your language',
    hi: 'सुन रहे हैं... अपनी भाषा में बोलें',
    pa: 'ਸੁਣ ਰਹੇ ਹਾਂ... ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲੋ',
    mr: 'ऐकत आहोत... तुमच्या भाषेत बोला',
    bn: 'শুনছি... আপনার ভাষায় কথা বলুন',
    ta: 'கேட்கிறது... உங்கள் மொழியில் பேசுங்கள்',
    te: 'వింటున్నాము... మీ భాషలో మాట్లాడండి',
    kn: 'ಕೇಳುತ್ತಿದ್ದೇವೆ... ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ',
    gu: 'સાંભળી રહ્યા છીએ... તમારી ભાષામાં બોલો',
    ml: 'കേൾക്കുന്നു... നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കുക',
    or: 'ଶୁଣୁଛୁ... ଆପଣଙ୍କ ଭାଷାରେ କୁହନ୍ତୁ',
  },
  'common.disclaimer_real': {
    en: 'Measured from verified farm parameters',
    hi: 'सत्यापित खेत मापदंडों से मापा गया',
    pa: 'ਪ੍ਰਮਾਣਿਤ ਖੇਤ ਮਾਪਦੰਡਾਂ ਤੋਂ ਮਾਪਿਆ ਗਿਆ',
    mr: 'सत्यापित शेती घटकांवरून मोजले',
    bn: 'যাচাইকৃত পরামিতি থেকে পরিমাপিত',
    ta: 'சரிபார்க்கப்பட்ட பண்ணை அளவுருக்களிலிருந்து அளவிடப்பட்டது',
    te: 'ధృవీకరించబడిన పొలం పారామితుల నుండి కొలవబడింది',
    kn: 'ಪರಿಶೀಲಿಸಿದ ನಿಯತಾಂಕಗಳಿಂದ ಅಳೆಯಲಾಗಿದೆ',
    gu: 'ચકાસાયેલ ખેતર પરિમાણો પરથી માપેલ',
    ml: 'സ്ഥിരീകരിച്ച ഫാം പാരാമീറ്ററുകളിൽ നിന്ന് അളന്നു',
    or: 'ଯାଞ୍ଚ ହୋଇଥିବା କ୍ଷେତ ପାରାମିଟରରୁ ମାପ କରାଯାଇଛି',
  },
  'common.disclaimer_estimated': {
    en: 'Estimated based on regional agro-climatic model',
    hi: 'क्षेत्रीय कृषि-जलवायु मॉडल के आधार पर अनुमानित',
    pa: 'ਖੇਤਰੀ ਖੇਤੀ-ਜਲਵਾਯੂ ਮਾਡਲ ਦੇ ਆਧਾਰ ਤੇ ਅਨੁਮਾਨਿਤ',
    mr: 'प्रादेशिक कृषी-हवामान मॉडेलवर आधारित अंदाजित',
    bn: 'আঞ্চলিক কৃষি-জলবায়ু মডেলের ভিত্তিতে আনুমানিক',
    ta: 'பிராந்திய வேளாண் காலநிலை மாதிரியின் அடிப்படையில் மதிப்பிடப்பட்டது',
    te: 'ప్రాంతీయ వ్యవసాయ-వాతావరణ నమూనా ఆధారంగా అంచనా వేయబడింది',
    kn: 'ಪ್ರಾದೇಶಿಕ ಕೃಷಿ-ಹವಾಮಾನ ಮಾದರಿಯ ಆಧಾರದ ಮೇಲೆ ಅಂದಾಜಿಸಲಾಗಿದೆ',
    gu: 'પ્રાદેશિક કૃષિ-આબોહવા મોડેલ પર આધારિત અંદાજિત',
    ml: 'പ്രാദേശിക കാർഷിക-കാലാവസ്ഥാ മാതൃക അടിസ്ഥാനമാക്കി കണക്കാക്കിയത്',
    or: 'ଆଞ୍ଚଳିକ କୃଷି-ଜଳବାୟୁ ମଡେଲ ଉପରେ ଆଧାରିତ ଅନୁମାନିତ',
  },
};

export const i18nService = {
  getLanguages(): LanguageOption[] {
    return SUPPORTED_LANGUAGES;
  },

  getCurrentLanguage(): SupportedLanguage {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('agriai_preferred_language') as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
    return 'en';
  },

  setLanguage(code: SupportedLanguage): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agriai_preferred_language', code);
      window.dispatchEvent(new CustomEvent('agriai_language_changed', { detail: code }));
    }
  },

  t(key: string, lang?: SupportedLanguage): string {
    const currentLang = lang || this.getCurrentLanguage();
    if (DICTIONARY[key] && DICTIONARY[key][currentLang]) {
      return DICTIONARY[key][currentLang];
    }
    if (DICTIONARY[key] && DICTIONARY[key]['en']) {
      return DICTIONARY[key]['en'];
    }
    return key;
  },
};
