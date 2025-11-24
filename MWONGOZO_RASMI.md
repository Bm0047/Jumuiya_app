MWONGOZO RASMI WA UENDESHAJI WA APP: JUMUIYA YA MARIA MAGDALENA WA PAZZI (PAROKIA YA BUNJU)

Lengo la Hati: Kufafanua Majukumu, Kanuni za Kikanoni, na Taratibu za Uendeshaji wa App ya Jumuiya kwa kuzingatia muundo wa KKKT.

MUHTASARI WA VIONGOZI NA WAJIBU WA KIKANONI 🧩

Majukumu yanawekwa wazi ili kudhibiti Ufikiaji na Uwajibikaji wa data, chini ya usimamizi wa Paroko.

| Nafasi | Wajibu Mkuu wa Kikanisa | Upatikanaji wa App (Firestore Role) |
|--------|-------------------------|-----------------------------------|
| Padri Kiongozi/Paroko | Mamlaka ya mwisho ya kiroho na kiutawala (Canon Law 532). Huwajibika kwa data yote ya Parokia. | Spiritual Custodian / Full Oversight |
| Mwenyekiti wa Jumuiya | Usimamizi wa mfumo, uidhinishaji wa access, na kuripoti kwa Baraza la Parokia. | Leader Access (Full Read/Write/Delete) |
| Katibu wa Jumuiya | Usimamizi wa Daftari la Mahudhurio na Ratiba (Mzunguko wa Kitanda/Kateshismo). | Read/Write (Attendance, Rota) |
| Mweka Hazina | Usimamizi wa Mali (Vifaa vya Misa/Kitanda) na matoleo ya kifedha (Sadaka/Matoleo). | Read/Write (Assets, Loans) |
| Mwanajumuiya | Kupokea matangazo ya Padri, kuona Ratiba ya Kitanda, na kuandaa nyumba yao. | Read Only |

SEHEMU A: MISINGI YA UTAWALA NA USAFIRISHAJI (GOVERNANCE & MIGRATION)

Lengo: Kuanzisha muundo imara wa uongozi na kuhakikisha usafi wa data unaoendana na Daftari la Parokia.

| Kazi Kuu | Mahitaji ya Kiutawala na Kiufundi | Kanuni za Kanisa |
|----------|----------------------------------|------------------|
| A1. Kuanzisha Uongozi & Uidhinishaji | Viongozi wote husajiliwa na Mwenyekiti wa Jumuiya. Uidhinishaji wa Viongozi na Kanuni za Matumizi lazima ziridhiwe na Padri Kiongozi wa Parokia. | Uwajibikaji wa Mali za Kanisa (Canon 1284) unazingatiwa katika matumizi ya mfumo. |
| A2. Uhakiki wa Data (Validation) | Protocol: Data ya Wanachama (majina, Kitanda) lazima ilingane na Daftari Rasmi la Parokia (kama lipo). Hakikisha hakuna majina yanayojirudia. | Data inakusanywa kwa ajili ya Kazi ya Kichungaji tu (Pastoral Care). |
| A3. Mpango wa Nakala Hifadhi (Backup Plan) | Nakala Hifadhi (Backup) za data zote muhimu huhifadhiwa kama .xlsx au .csv kwenye hifadhi salama ambayo Padri Kiongozi anaweza kuifikia kwa urahisi (Mfano: Hifadhi ya Parokia). | - |

SEHEMU B: UTARATIBU WA WIKI NA MAHUDHURIO (WEEKLY OPERATIONAL FLOW)

Lengo: Kurahisisha utaratibu wa sala za Kitanda na Mawasiliano.

| Kazi Kuu | Utaratibu wa Uendeshaji | Matokeo ya Kichungaji |
|----------|-------------------------|----------------------|
| B1. Ratiba ya Mzunguko wa Kitanda | Katibu anaingiza Ratiba mpya: Jina la Mwenyeji, Tarehe (kama Timestamp), Anwani, na Kiungo cha Ramani (MapLink) kwa ajili ya sala/masomo ya Kateshismo. | Huhakikisha mawasiliano bora (Communio) na wanajumuiya. |
| B2. Mawasiliano ya Kiimani | Kiongozi anatumia "SMS Generator" ya App kuunda ujumbe unaoanza kwa salamu za kiimani, kisha kupeleka maelezo ya kieneo na kiungo cha ramani. | Huondoa makosa ya kiutawala na kusambaza habari kwa heshima na upendo wa Kikristo. |
| B3. Mahudhurio ya Kidijitali | Katibu anarekodi Mahudhurio. Data ya Mahudhurio ni muhimu kwa takwimu za Parokia/Jimboni (kuhusu ushiriki wa Walei). | Inatoa data muhimu kwa Padri kufuatilia ushiriki wa jumuiya na wale wanaohitaji huduma za kichungaji. |
| B4. Utaratibu wa Hali ya Mtandao (Offline Fallback) | Ikiwa hakuna mtandao, Viongozi wanatumia Offline Log Sheets (Karatasi Maalum) kusaini Mahudhurio na Matoleo. Data inaingizwa kwenye App mara mtandao unapopatikana. | Huhakikisha Utendaji wa Kikanisa hauzuilwi na teknolojia. |
| B5. Ukaguzi wa Data wa Wiki | Kila Jumapili jioni, Katibu/Mwenyekiti anakagua rekodi zote (Mahudhurio na Mali) kisha anakabidhi muhtasari kwa Baraza la Walei au Kamati husika. | - |

SEHEMU C: USIMAMIZI WA MALI NA USALAMA (ASSET INVENTORY & SECURITY)

Lengo: Kulinda mali za Kanisa na data ya waamini.

| Kazi Kuu | Suluhisho la App na Kanuni za Usalama | Mamlaka ya Kikanoni |
|----------|--------------------------------------|---------------------|
| C1. Ufuatiliaji wa Mali na Matoleo | Mweka Hazina anasajili na kusasisha hali ya Mali (Mfano: Viti, Vitabu vya Sala). Pia anahifadhi taarifa za mikopo na urejeshaji. | Mali zote hizi (Assets) ni Mali ya Kanisa na lazima zisimamiwe kwa uangalifu (Canon 1254). |
| C2. Ulinzi wa Data & Kanuni za Nenosiri | Kanuni: Viongozi hutumia nenosiri lenye nguvu. Kisheria: Mfumo unatumia principle of minimal data collection na unazingatia Sheria ya Ulinzi wa Data (Data Protection Act, 2022 ya Tanzania). | - |
| C3. Ufuatiliaji wa Matukio (Audit Logs) | Firebase inarekodi kila kitendo cha Leader kwenye activity_logs collection ili kutoa uwazi na uthibitisho wa utendaji wa kikanisa. | Inasaidia katika uwajibikaji wa kiutawala mbele ya Paroko na Kamati. |
| C4. Utaratibu wa Kurejesha Access (Recovery) | Mwenyekiti ndiye anayeanzisha hatua za recovery, lakini uidhinishaji wa mwisho wa kutoa access credentials mpya lazima utoke kwa Padri Kiongozi. | - |

SEHEME D: KURIPOTI NA MAADILI (REPORTING & ETHICS)

Lengo: Kukuza maadili ya utunzaji wa data kwa kuzingatia mafundisho ya Kanisa.

| Kazi Kuu | Utaratibu wa Kimkakati |
|----------|-------------------------|
| D1. Ripoti na Uchambuzi wa Data | Kila mwisho wa mwezi, Mwenyekiti anatoa ripoti rasmi (Mfano: "Attendance Trends", "Loaned Assets Summary"). Ripoti huwasilishwa kwa Baraza la Walei na nakala hupelekwa kwa Padri. |
| D2. Kanuni za Usiri (Privacy Policy) | Data za wanachama ni siri ya Kichungaji na hazitashirikiwa nje ya App bila ruhusa. Viongozi wanakubali kutotumia data hiyo kwa faida ya kibinafsi au biashara. |
| D3. Kanuni za Uadilifu (Ethical Use) | Hakuna kiongozi anayeruhusiwa kubadilisha data kwa lengo la kudanganya (kuficha mahudhurio au mikopo). Kila mabadiliko huonekana kwenye activity_logs. |
| D4. Utunzaji wa Data (Retention Policy) | Data za wanajumuiya waliohamia Parokia nyingine huwekwa "archived" baada ya miezi 6, si kufutwa moja kwa moja. Hii inalinda Historia ya Jumuiya/Parokia. |

SEHEME E: USIMAMIZI WA MATENGENEZO (MAINTENANCE & CONTINUITY PLAN) 🧰

Lengo: Kuhakikisha mfumo unaendelea kufanya kazi kwa ufanisi na ulinzi wa kiufundi.

| Kazi Kuu | Utaratibu wa Matengenezo |
|----------|-------------------------|
| E1. Mpango wa Matengenezo wa Robo Mwaka | Kila miezi 3, Technical Custodian (akishirikiana na Kamati ya Walei) anapitia Firebase Security Rules, anathibitisha backups zipo salama, na anapima performance ya App. |
| E2. Mtu wa Teknolojia (Technical Custodian) | Mtu mmoja anateuliwa kusimamia Firebase Console, App updates (kama kuna bug au version mpya), na kutatua matatizo ya kiufundi. Anaripoti kwa Mwenyekiti na Padri. |
| E3. Mpango wa Dharura (Contingency Plan) | Ikitokea App haipatikani, mfumo wa Offline Log Sheets unatumika moja kwa moja. Hii inahakikisha kazi ya uinjilishaji na sala inaendelea bila usumbufu. |

MUHTASARI WA HATUA ZA MWISHO KABLA YA UZINDUZI (FINAL CHECKLIST) 🗂️

Hii ndiyo orodha ya mwisho ya Kamati Kuu kabla ya Uzinduzi Rasmi, kwa kushauriana na Padri:

| Kazi | Hali (Imekamilika?) |
|------|-------------------|
| Data zote zimehakikiwa, zinalingana na Daftari la Parokia, na zipo salama (Backup). | ☐ |
| Viongozi wote wamesajiliwa na Padri Kiongozi ameridhia roles zao. | ☐ |
| Firebase Security Rules zimepimwa kikamilifu kwa ajili ya ulinzi wa data ya waamini. | ☐ |
| Mafunzo ya viongozi yamekamilika na wamekubali Kanuni za Maadili ya Kichungaji. | ☐ |
| App imejaribiwa (pilot testing) kwa wiki 2 na matatizo yote yamerekebishwa. | ☐ |
| Ripoti ya kwanza ya Mahudhurio na Mali imetolewa kama jaribio. | ☐ |
| Technical Custodian ametajwa rasmi na amepewa access credentials salama. | ☐ |
