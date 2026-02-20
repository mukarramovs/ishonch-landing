const ISHONCH_STORES = [
    {
        "region": "Farg'ona",
        "name": "Uchko'prik",
        "address": "Fargʻona viloyati, Uchkoʻprik tumani, Navroʻz shoh koʻchasi",
        "target": "Uchkoʻprik umani IIB roʻparasida",
        "link": "https://g.page/ISHONCH?share"
    },
    {
        "region": "Farg'ona",
        "name": "Besharik",
        "address": "Farg‘ona viloyati, Beshariq tumani, Oltin vodiy ko‘chasi",
        "target": "Beshariq tuman poliklinikasi ro‘parasida",
        "link": "https://goo.gl/maps/fQFuwwUbfEyMYad17"
    },
    {
        "region": "Farg'ona",
        "name": "Qo'qon",
        "address": "Fargʻona viloyati, Qoʻqon shahar, Turkiston koʻchasi, 2-E uy",
        "target": "Qoʻqon shahar MRO yonida",
        "link": "https://goo.gl/maps/Ktjh5SRRrjYpncds7"
    },
    {
        "region": "Farg'ona",
        "name": "Bag'dod",
        "address": "Fargʻona viloyati, Bagʻdod shaxarchasi, Qoʻshchinor koʻchasi, 22-uy",
        "target": "Bogʻdod tumani avtoshoxbekat roʻparasida",
        "link": "https://goo.gl/maps/jsJ3xy97kAoAEJsx6"
    },
    {
        "region": "Farg'ona",
        "name": "Yaypan",
        "address": "Farg‘ona viloyati, O‘zbekiston tumani, Yaypan shaxarchasi, Turkiston ko‘chasi, 177-uy",
        "target": "Istirohat bog‘i ro‘parasida",
        "link": "https://goo.gl/maps/vm9zQ1ZJoSHrEoQ8A"
    },
    {
        "region": "Farg'ona",
        "name": "Farg\\ona",
        "address": "Fargʻona viloyati, Fargʻona shahar, Alisher Navoiy koʻchasi, 3-A uy",
        "target": "ATB “Asaka bank” va ATB «Agrobank» yonida",
        "link": "https://goo.gl/maps/a1hb1VpLKdm87vQV9"
    },
    {
        "region": "Farg'ona",
        "name": "Quva",
        "address": "Fargʻona viloyati, Quva tumani, Ahmad Yassaviy koʻchasi",
        "target": "Quva tumani markaziy avtoshoxbekati roʻparasida",
        "link": "https://goo.gl/maps/SmgYg3KqSRSMEodTA"
    },
    {
        "region": "Farg'ona",
        "name": "Toshloq",
        "address": "Fargʻona viloyati, Toshloq tumani, A.Navoiy koʻchasi",
        "target": "Tuman hokimligi roʻparasida",
        "link": "https://goo.gl/maps/jPMSSFqhBrDfYW839"
    },
    {
        "region": "Toshkent",
        "name": "Dangara",
        "address": "Dang‘ara tumani, Navbahor MFY, Toshkent ko‘chasi 160-uy",
        "target": "Xalq banki binosi yonida",
        "link": "https://maps.app.goo.gl/CnciPKA8MTSfZwpi9"
    },
    {
        "region": "Farg'ona",
        "name": "Farg'ona SUM",
        "address": "Farg‘ona shahri, Mustaqillik ko‘chasi, 13-uy",
        "target": "Markaziy univermag (SUM) binosi",
        "link": "https://maps.app.goo.gl/wSvMZjjnbM9QJyLSA"
    },
    {
        "region": "Namangan",
        "name": "Namangan",
        "address": "Namangan viloyati, Namangan shahar, Gʻalaba koʻchasi, 1-uy",
        "target": "Yashil bozor yonida, Eski \"Farangiz\" toʻyxonasi oʻrnida",
        "link": "https://goo.gl/maps/DwgtTmiDNt4uEM8B7"
    },
    {
        "region": "Namangan",
        "name": "Namangan 2",
        "address": "Namangan shahri, A.Navoiy koʻchasi, 1/6-uy",
        "target": "Ipak yoʻli banki oldida",
        "link": "https://goo.gl/maps/XzDFNtDuEcaoYyEE9"
    },
    {
        "region": "Namangan",
        "name": "Chust",
        "address": "Namangan viloyati, Chust tumani, Chustiy koʻchasi,",
        "target": "Tuman gaz ta'minot binosi va tumanlararo Sud idorasi roʻparasida",
        "link": "https://goo.gl/maps/DBcze9dPVCNwea4T7"
    },
    {
        "region": "Namangan",
        "name": "Mingbuloq",
        "address": "Namangan viloyati, Mingbuloq tumani, Jomashuy shaharchasi, E Oʻrmonov koʻchasi, 1-uy",
        "target": "Yangi Sherdor binosi",
        "link": "https://goo.gl/maps/2cpTdg8wUURkRPiAA"
    },
    {
        "region": "Namangan",
        "name": "yangiqo'rg'on",
        "address": "Namangan viloyati, Yangiqoʻrgʻon tumani, Yangi Beshbuloq MFY, Namangan koʻchasi 5-uy",
        "target": "Yangiqoʻrgʻon tumani Istirohat bogʻi roʻparasida",
        "link": "https://goo.gl/maps/oQWWSgDpVVJXxPas8"
    },
    {
        "region": "Namangan",
        "name": "Chortoq",
        "address": "Namangan viloyati, Chortoq shahri, Istiqlol koʻchasi, 39-uy",
        "target": "Temir yoʻl vokzali yonida",
        "link": "https://goo.gl/maps/M7cVL2Bn4FBNyaiA7"
    },
    {
        "region": "Namangan",
        "name": "Uchqo'rg'on",
        "address": "Namangan viloyati, Uchqoʻrgʻon tumani, Ulugʻbek MFY, Doʻstlik koʻchasi",
        "target": "Uchqoʻrgʻon tumani Xokimiyat binosi roʻparasida",
        "link": "https://goo.gl/maps/8zAHEm1T7BnogwCN9"
    },
    {
        "region": "Namangan",
        "name": "Uychi",
        "address": "Namangan viloyati, Uychi tumani, Bogʻ MFY, Amir Temur koʻchasi, 3-uy",
        "target": "Tuman madaniyat saroyi roʻparasida",
        "link": "https://goo.gl/maps/9UB8kHsAgJ1XXwY8A"
    },
    {
        "region": "Namangan",
        "name": "Pop",
        "address": "Mustakillik MFY, ulisa Aybeka, Pap, Pop tumaini",
        "target": "Pop tuman FHDYo binosi roʻparasida. (Avtovokzal yonida)",
        "link": "https://goo.gl/maps/fkf4zMHAcWpfwUJB8"
    },
    {
        "region": "Namangan",
        "name": "Kosonsoy",
        "address": "Namangan viloyati, Kosonsoy shahar, A.Navoiy nomli MFY, Xalqlar do‘stligi ko‘chasi, 7-uy",
        "target": "Kosonsoy shahar hokimligi binosi ro‘parasida",
        "link": "https://maps.app.goo.gl/xhkuzqTWXFXA3iqf6"
    },
    {
        "region": "Namangan",
        "name": "Toshbuloq",
        "address": "Namangan viloyati, Namangan tumani, Toshbuloq shaharchasi, Mustaqillik 5 yilligi ko’chasi",
        "target": "Eski avtoshoxbekat o’rni, Mikrokreditbank ro’parasida.",
        "link": "https://maps.app.goo.gl/B1aMYqUtLaoLvy7N9"
    },
    {
        "region": "Andijon",
        "name": "Xo'jaobod",
        "address": "Andijon viloyati, Xo‘jaobod tumani, Jome MFY Milliy yuksalish ko‘chasi.",
        "target": "Tuman Jomeʼ masjidi ro‘parasida",
        "link": "https://maps.app.goo.gl/36FsfGZWo3VgJwJF6"
    },
    {
        "region": "Andijon",
        "name": "Baliqchi",
        "address": "Andijon viloyati, Baliqchi tumani, Baliqchi-shox koʻchasi",
        "target": "Agrobank Baliqchi filiali roʻparasida",
        "link": "https://goo.gl/maps/AsaxkYxzbTZBq3jz6"
    },
    {
        "region": "Andijon",
        "name": "Izboskan",
        "address": "Andijon viloyati, Izboskan tumani, Poytugʻ shahri, Naqshband koʻchasi, 17-uy",
        "target": "Makro supermarketi yonida",
        "link": "https://goo.gl/maps/qRbUyfVN3aTW2gQB7"
    },
    {
        "region": "Andijon",
        "name": "Andijon",
        "address": "Andijon shahri, Amir Temur shoh koʻchasi, 7-B uy",
        "target": "Andijon viloyati davlat kadastri boshqrmasi yonida",
        "link": "https://goo.gl/maps/c5UQdBZ7cSrRC1jz8"
    },
    {
        "region": "Andijon",
        "name": "Oltinko'l",
        "address": "Andijon viloyati, Oltinkoʻl tumani, Markaz QFY, Chinobod qoʻchasi 6-uy",
        "target": "Tuman IIB boʻlimi yonida",
        "link": "https://goo.gl/maps/vdjhxPTiqSRHMyv56"
    },
    {
        "region": "Andijon",
        "name": "Andijon mini",
        "address": "Andijon shahar, Qoʻshariq dahasi.",
        "target": "Klara Setkin bozorchasi yonida",
        "link": "https://goo.gl/maps/mjr5U5ivMurhtbMGA"
    },
    {
        "region": "Andijon",
        "name": "Andijon 2",
        "address": "Andijon shahar, Oʻzbekiston koʻchasi 1-uy",
        "target": "Hamkorbank Nodirabegim filiali roʻparasida",
        "link": "https://goo.gl/maps/Ek5rDtXP2MPUA12F8"
    },
    {
        "region": "Andijon",
        "name": "Shaxrixon",
        "address": "Andijon viloyati, Shahrixon tumani, Shahrixonlik MFY, A.Temur ko‘chasi",
        "target": "Shahrixon Beruniy bog‘i yonida",
        "link": "https://maps.app.goo.gl/dZRZP7rDPQTY9qLPA"
    },
    {
        "region": "Andijon",
        "name": "Andijon-Klinika",
        "address": "Andijon viloyati, Andijon shahri, Shifokor MFY, Boburshoh ko‘chasi, 76-uy.",
        "target": "Andijon shahar shifoxonasi ro‘parasida.",
        "link": "https://maps.app.goo.gl/bJnLwtnRTiizmm1u9"
    },
    {
        "region": "Andijon",
        "name": "Asaka",
        "address": "Asaka tumani, Baraka MFY, Umid ko'chasi",
        "target": "FVB (pojarniy) binosi ro'parsida",
        "link": "https://maps.app.goo.gl/cWpL8S1bcLPfiSQ28"
    },
    {
        "region": "Andijon",
        "name": "Qo'ng'ontepa",
        "address": "Andijon viloyati, Qoʻrgʻontepa tumani, Andijon koʻchasi, 50-uy",
        "target": "Qoʻrgʻontepa tuman xokimligi roʻparasida",
        "link": "https://goo.gl/maps/NdCdBSAPSm4RtRp6A"
    },
    {
        "region": "Andijon",
        "name": "Buloqboshi",
        "address": "Andijon viloyati, Buloqboshi tumani, Mirzakalon-Islomiy koʻchasi, 55-uy",
        "target": "Tuman ichki ishlar boʻlimi yonida",
        "link": "https://goo.gl/maps/Ss944jGzJ4fWwfVp7"
    },
    {
        "region": "Andijon",
        "name": "Marxamat",
        "address": "Andijon viloyati, Marhamat tumani, Navroʻz MFY, Mustaqillik koʻchasi",
        "target": "Marhamat tekstili yaqinida",
        "link": "https://goo.gl/maps/BGTePFsokqnuP5bH8"
    },
    {
        "region": "Andijon",
        "name": "Paxtaobod",
        "address": "Andijon viloyati, Paxtaobod tumani, Bobur MFY, Amir Temur koʻchasi",
        "target": "Paxtaobod tumani hokimiyati yonida",
        "link": "https://goo.gl/maps/ocStv7oWD8EZdJtv9"
    },
    {
        "region": "Andijon",
        "name": "Jalaquduq",
        "address": "Andijon viloyati, Jalaquduq tumani, Bozorboshi MFY, Navoi koʻchasi",
        "target": "Tuman davlat xavsizlik xizmati idorasi yonida",
        "link": "https://goo.gl/maps/Fqu6GWo9KZiW8CLV7"
    },
    {
        "region": "Andijon",
        "name": "Xonobod mini",
        "address": "Xonobod shahri",
        "target": "Xonobod shahar hokimiyati yonida.",
        "link": "https://goo.gl/maps/AFc7EQrYQZXbYrFM7"
    },
    {
        "region": "Toshkent",
        "name": "Yangiyo'l",
        "address": "Toshkent viloyati, Yangiyoʻl tumani, Samarqand koʻchasi, 250-uy",
        "target": "Xamkorbank Yangiyoʻl filiali yonida",
        "link": "https://g.page/ishonch-479?share"
    },
    {
        "region": "Toshkent",
        "name": "Chirchiq mini",
        "address": "Toshkent viloyati Chirchiq shahar Po'lat Yusupov ko'chasi 20-uy",
        "target": "Chirchiq kasb hunar litseyi",
        "link": "https://maps.app.goo.gl/yjNqHRPrLsiFTv7D6"
    },
    {
        "region": "Toshkent",
        "name": "Chiqchiq",
        "address": "Chirchiq shahar, Navruz MFY 36-mahalla, Zakovat koʻchasi.",
        "target": "Markaziy Jome masjidi roʻparasida.",
        "link": "https://goo.gl/maps/cqqnc4EQ2KN3STWP8"
    },
    {
        "region": "Toshkent",
        "name": "Keles",
        "address": "Toshkent viloyati, Toshkent tumani, Fayziobod MFY, Keles Yoʻli koʻchasi",
        "target": "Ichki Ishlar binosi yoki Havas doʻkoni yonida",
        "link": "https://goo.gl/maps/fYY3dvrmNDBB2dov5"
    },
    {
        "region": "Toshkent",
        "name": "G'azalkent",
        "address": "Toshkent viloyati, Boʻstonliq tumani, Gʻazalkent shaharchasi, Turkiston koʻchasi, 193-uy (sobiq univermag binosi)",
        "target": "Xotira maydoni roʻparasida",
        "link": "https://goo.gl/maps/MmD1ztewHZDhZ37o7"
    },
    {
        "region": "Toshkent",
        "name": "Yuqori Chirchiq",
        "address": "Toshkent viloyati, Yuqori Chirchiq tumani, Mustaqillik koʻchasi",
        "target": "Havas doʻkoni roʻparasida",
        "link": "https://goo.gl/maps/UMXKn8RgYKs3M8bg9"
    },
    {
        "region": "Toshkent",
        "name": "Quyi chirchiq",
        "address": "Quyi Chirchiq tumani, Mirobod MFY, Bibixonim koʻchasi, 2-uy",
        "target": "Sherzod kafesi oldida",
        "link": "https://goo.gl/maps/yHVYZyseVZAkN4ci9"
    },
    {
        "region": "Toshkent",
        "name": "Zangiota",
        "address": "Toshkent viloyati, Zangiota tumani, Zangiota qishlogʻi, Oʻrta MFY, A.Temur koʻchasi",
        "target": "Zangiota ziyoratgohi roʻparasida",
        "link": "https://goo.gl/maps/Ae7ZhFEDbnzmTeTA9"
    },
    {
        "region": "Toshkent",
        "name": "Parkent",
        "address": "Toshkent viloyati, Parkent tumani, Oybek MFY, A.Navoiy ko’chasi 18-A uy",
        "target": "Havas do‘koni yonida",
        "link": "https://goo.gl/maps/51y7nFHxRSeEZ9Ds8"
    },
    {
        "region": "Toshkent",
        "name": "Oqqo'rg'on",
        "address": "Toshkent viloyati, Oqqoʻrgʻon tumani, Birlik MFY, Oxunboboev koʻchasi",
        "target": "Agrobank roʻparasida",
        "link": "https://goo.gl/maps/19UxSX7179ADcUBP7"
    },
    {
        "region": "Toshkent",
        "name": "Qibray",
        "address": "Qibray tumani, Zebiniso MFY, Zebiniso koʻchasi, 1B-uy.",
        "target": "Qibray hokimiyati binosi yonida",
        "link": "https://goo.gl/maps/22koDHP8bP72aS5K7"
    },
    {
        "region": "Toshkent",
        "name": "Angren",
        "address": "Toshkent viloyati, Angren shahri, Chikrizova koʻchasi",
        "target": "Xalq ta'limi boshqarmasi (Gorono) yonida",
        "link": "https://goo.gl/maps/NRsnFG1fBEPRpYSp7"
    },
    {
        "region": "Toshkent",
        "name": "Bo'ka",
        "address": "Toshkent viloyati, Boʻka tumani, Yangi Hayot MFY, Markaziy koʻchasi, 35-uy",
        "target": "Boʻka markaziy shoh bekati yonida.",
        "link": "https://goo.gl/maps/zYZfgqZYhaXgix4m9"
    },
    {
        "region": "Toshkent",
        "name": "Olmaliq",
        "address": "Toshkent viloyati, Olmaliq shahri, A.Temur koʻchasi",
        "target": "Yoshlar parki roʻparasida, Metallurg san'at saroyi yaqinida",
        "link": "https://goo.gl/maps/FvvCmef9x62AT4gS8"
    },
    {
        "region": "Toshkent",
        "name": "Piskent",
        "address": "Toshkent viloyati, Piskent tumani, Moʻminobod MFY, Amir Temur koʻchasi, 306-uy",
        "target": "Havas doʻkoni yonida",
        "link": "https://goo.gl/maps/QqszydXVAL5CUueD7"
    },
    {
        "region": "Toshkent",
        "name": "Zafar",
        "address": "Toshkent viloyati, Bekobod tumani, Zafar ShFY, Toshkent ko‘chasi.",
        "target": "Navro‘z Milliy Taomlari yonida, oldingi Prizma do'koni.",
        "link": "https://maps.app.goo.gl/HtneinCJuzeKYXiE8"
    },
    {
        "region": "Toshkent",
        "name": "Bekobod",
        "address": "Toshkent viloyati, Bekobod shahri, O‘zbekiston MFY, Sirdaryo ko‘chasi, 609-uy.",
        "target": "Evos ro‘parasida yoki shahar Dehqon bozori yonida, oldingi Prizma do'koni.",
        "link": "https://maps.app.goo.gl/c9AMFjtYyupVDKnA7"
    },
    {
        "region": "Xorazm",
        "name": "Urganch",
        "address": "Urganch shahri, Fayozov koʻchasi, 1-A uy.",
        "target": "Xorazm Non yonida",
        "link": "https://goo.gl/maps/39di2aky2P7BitYU6"
    },
    {
        "region": "Xorazm",
        "name": "Xiva",
        "address": "Xiva shahri, Mevaston mahallasi, Feruz koʻchasi",
        "target": "Ipoteka bank yonida",
        "link": "https://goo.gl/maps/daiisMQtCHf4Pox27"
    },
    {
        "region": "Xorazm",
        "name": "Gurlan",
        "address": "Gurlan tumani, Mustaqillik koʻchasi, 65-uy",
        "target": "buyum bozori roʻparasida",
        "link": "https://goo.gl/maps/tVE4uDbwVcHHtSgS6"
    },
    {
        "region": "Xorazm",
        "name": "Beruniy",
        "address": "Qoraqalpogʻiston Respublikasi, Beruniy tumani, Xorazm MFY, Kat koʻchasi.",
        "target": "Agrobank roʻparasida.",
        "link": "https://goo.gl/maps/DUVvRT6ZB3vq5crw7"
    },
    {
        "region": "Xorazm",
        "name": "Xonka",
        "address": "Xonqa tumani, Xalqlar doʻstligi koʻchasi",
        "target": "Xonqa tuman Pochtasi boʻlimi roʻparasida",
        "link": "https://goo.gl/maps/s1U8g8GbkGUMA3uXA"
    },
    {
        "region": "Xorazm",
        "name": "Bog'ot",
        "address": "Bogʻot tumani, Beruniy MFY, A.Navoiy koʻchasi, 2 uy",
        "target": "Bogʻot tuman Xalq ta'limi boʻlimi roʻparasida",
        "link": "https://goo.gl/maps/NHYBiH24EsRpJqKVA"
    },
    {
        "region": "Xorazm",
        "name": "Xazorasp",
        "address": "Hazorasp tumani, Sulaymon qal'asi, Oʻzbekiston koʻchasi, 1-uy (sobiq univermag binosi)",
        "target": "Hazorasp Dehqon bozori roʻparasida",
        "link": "https://goo.gl/maps/dvdWEjvaDMwPb6xu5"
    },
    {
        "region": "Xorazm",
        "name": "Shovot",
        "address": "Xorazm viloyati, Shovot tumani, Komiljon Otaniyozov koʻchasi",
        "target": "Tuman tibbiyot birlashmasi roʻparasida",
        "link": "https://goo.gl/maps/8RgFSttWL8SW8g8VA"
    },
    {
        "region": "Qoraqalpog'iston",
        "name": "To'rtko'l",
        "address": "Qoraqalpogʻiston Respublikasi, Toʻrtkoʻl tumani, Tortkoʻl MFY, Zamondosh koʻchasi, 1S-uy",
        "target": "Infinbank mini filiali yonida",
        "link": "https://goo.gl/maps/V3B2kxxFVEMzPBws5"
    },
    {
        "region": "Qoraqalpog'iston",
        "name": "Amudaryo",
        "address": "Qoraqalpog‘iston respublikasi, Amudaryo tumani, Navoiy MFY, Madaniyat shoh ko‘chasi, 1-uy",
        "target": "Tuman madaniyat uyi yonida",
        "link": "https://goo.gl/maps/6wSHa4sXjyfnFxrm8"
    },
    {
        "region": "Qoraqalpog'iston",
        "name": "Nukus",
        "address": "Qoraqalpog’iston Respublikasi, Nukus shahar, Ernazar Alakoz ko’chasi 60-uy",
        "target": "Mega Nukus Savdo Markazi yonida",
        "link": "https://goo.gl/maps/4zNrXWeXUM2fnATJ7"
    },
    {
        "region": "Qoraqalpog'iston",
        "name": "Xo'jayli",
        "address": "Qoraqalpog’iston Respublikasi, Xo’jayli tumani, Obod MFY, Xo’jayli ko’chasi",
        "target": "Royal to’yxona va restorani yonida",
        "link": "https://maps.app.goo.gl/nmqecjhueCFDr9f66"
    },
    {
        "region": "Qoraqalpog'iston",
        "name": "Qo'ng'iroq",
        "address": "Qoraqalpog‘iston Respublikasi, Qo‘ng‘irot tumani, Tolegen Aybergenov ko‘chasi",
        "target": "Qo‘ng‘irot Mega Park yonida",
        "link": "https://maps.app.goo.gl/cb8MnbjqqcLSpRRZA"
    },
    {
        "region": "Qoraqalpog'iston",
        "name": "Chimboy",
        "address": "Qoraqalpog'iston respublikasi, Chimboy tumani, Jipek Joli MFY, Ibrayim Yusupov ko'chasi, 17-uy",
        "target": "Tuman Davlat soliq qo'mitasi ro'parasida",
        "link": "https://maps.app.goo.gl/TcVrWe7ytBRwSiq6A"
    },
    {
        "region": "Qashqadaryo",
        "name": "Qarshi",
        "address": "Qarshi shahri, Xoʻja hiyol MFY, Qarlugʻbogʻot koʻchasi",
        "target": "Yangibozor koʻchasida",
        "link": "https://goo.gl/maps/6sdkSLsYwzj6SytD7"
    },
    {
        "region": "Qashqadaryo",
        "name": "Shaxrisabz",
        "address": "Shahrisabz shahri, Ipak yoʻli koʻchasi, 112-uy",
        "target": "Yangibozor roʻparasida",
        "link": "https://goo.gl/maps/iFUyskcUX6BknD8Y6"
    },
    {
        "region": "Qashqadaryo",
        "name": "Koson",
        "address": "Qashqadaryo viloyati Koson tumani Mugʻjagul MFY Koʻxna qalʼa koʻchasi 100 uy",
        "target": "Koson Markaziy Koʻxna qalʼa buyum bozori, Eski Fayziobod toyxonasi",
        "link": "https://maps.app.goo.gl/uzLHr5oYHKX96JHP6"
    },
    {
        "region": "Qashqadaryo",
        "name": "G'uzor",
        "address": "Qashqadaryo viloyati, Gʻuzor tumani, Obod MFY, Mustaqillik koʻchasi.",
        "target": "Agrobank yonida.",
        "link": "https://goo.gl/maps/fEF1DcEoYPDU3QTCA"
    },
    {
        "region": "Qashqadaryo",
        "name": "Chiroqchi",
        "address": "Qashqadaryo viloyati, Chiroqchi tumani, Mustaqillik koʻchasi, 13-uy",
        "target": "Tuman hokimiyati binosi yaqinida",
        "link": "https://maps.app.goo.gl/eNURLhfwF1riszFX7"
    },
    {
        "region": "Qashqadaryo",
        "name": "Kasbi",
        "address": "Qashqadaryo viloyati, Kasbi tumani, Muglon MFY, 8-uy",
        "target": "Tuman hokimyati yaqinida",
        "link": "https://goo.gl/maps/h5Jyzxn8ZT4Md2f17"
    },
    {
        "region": "Qashqadaryo",
        "name": "Beshkent",
        "address": "Qashqadaryo viloyati, Qarshi tumani, Beshkent shahri, Amir Temur shoh ko’chasi",
        "target": "Tuman hokimyati binosi ro’parasida",
        "link": "https://goo.gl/maps/fgkbFrcdf6cSWeTw9"
    },
    {
        "region": "Qashqadaryo",
        "name": "Yakkabog'",
        "address": "Qashqadaryo viloyati, Yakkabog’ tumani, Yangiobod MFY, Amir Temur ko’chasi, 34-uy",
        "target": "Tuman hokimiyati binosi yonida",
        "link": "https://goo.gl/maps/ppD2od7RHM8Q41REA"
    },
    {
        "region": "Samarqand",
        "name": "Urgut",
        "address": "Urgut tumani, Urgut shaharchasi, Navbogʻ MFY",
        "target": "Olmos ota toʻyxonasi yaqinida",
        "link": "https://goo.gl/maps/vhHhvNWpGMTaJwue6"
    },
    {
        "region": "Samarqand",
        "name": "Ishtixon",
        "address": "Samarqand viloyati, Ishtixon tumani, Ishtixon koʻchasi",
        "target": "Ishtixon tuman xokimiyati yonida",
        "link": "https://goo.gl/maps/JoNJXEmEGSys4Qsh9"
    },
    {
        "region": "Samarqand",
        "name": "Samarqand",
        "address": "Samarqand shahar, A.Temur koʻchasi 152-uy.",
        "target": "Davlat xizmatlar markazi yonida.",
        "link": "https://goo.gl/maps/vGujYt19EWRobeg66"
    },
    {
        "region": "Samarqand",
        "name": "Kattaqo'rg'on",
        "address": "Kattaqoʻrgʻon tumani, Kadan qoʻrgʻoni, Mustaqillik koʻchasi, 14-uy",
        "target": "Lola maishiy xizmatlar uyi yonida",
        "link": "https://goo.gl/maps/Vdga2GrXohXX7b9d6"
    },
    {
        "region": "Samarqand",
        "name": "Jomboy",
        "address": "Samarqand viloyati, Jomboy tumani, Gʻalakapa koʻchasi",
        "target": "Dehqon bozori yonida",
        "link": "https://goo.gl/maps/TSoCB72xGZfGdDrR9"
    },
    {
        "region": "Samarqand",
        "name": "Narpay",
        "address": "Narpay tumani, Alisher Navoiy MFY, Imom Buxoriy koʻchasi, 14-uy",
        "target": "Narpay tumani soliq inspeksiyasi",
        "link": "https://goo.gl/maps/sGWh3f3ay4wdSVtUA"
    },
    {
        "region": "Samarqand",
        "name": "Nurobod",
        "address": "Nurobod tumani, Nurobod shahar, Gulzor koʻchasi",
        "target": "Eski koʻkat bozori yonida",
        "link": "https://goo.gl/maps/ReTbASrzrksSs6a57"
    },
    {
        "region": "Samarqand",
        "name": "Qo'shrabod",
        "address": "Samarqand viloyati, Qoʻshrabot tumani, Qurolos MFY, Bobur koʻchasi, 31-uy",
        "target": "Davlat Xizmatlari Markazi yonida",
        "link": "https://goo.gl/maps/DUKVz4Qv2LDGAfJZ6)"
    },
    {
        "region": "Samarqand",
        "name": "Bulung'ur",
        "address": "Samarqand viloyati, Bulungʻur tumani, Bulungʻur shahar, Yoshlik koʻchasi, 1-uy",
        "target": "Ichki ishlar binosi ro‘parasida",
        "link": "https://goo.gl/maps/SAw4msNxiLZCPcu86"
    },
    {
        "region": "Samarqand",
        "name": "Oqdaryo",
        "address": "Samarqand viloyati, Oqdaryo tumani, Loyish shaharchasi, Navro‘z mahallasi, Amir Temur ko‘chasi",
        "target": "Tuman hokimiyati yonida",
        "link": "https://maps.app.goo.gl/fEV4HwK7pn4DeYxXA"
    },
    {
        "region": "Samarqand",
        "name": "Pastdarg'on",
        "address": "Pastdarg‘om tumani, Juma shaharchasi, Sazogon MFY, S.Urdoshev ko‘chasi",
        "target": "Xalq banki filiali yonida",
        "link": "https://maps.app.goo.gl/mvVCae91u1gYhEDe6"
    },
    {
        "region": "Samarqand",
        "name": "Payariq",
        "address": "Payariq tumani, Chelak shaharchasi, Bunyodkor MFY, Sh.Rashidov ko‘chasi 158-uy",
        "target": "Yoshlar bog‘i ro‘parasi",
        "link": "https://maps.app.goo.gl/6MSxNP2JokQYmJAd6"
    },
    {
        "region": "Buxoro",
        "name": "Buxoro",
        "address": "Buxoro shahar, Xavzi Nav koʻchasi, 21-uy",
        "target": "Jannat toʻyxonasi yonida",
        "link": "https://goo.gl/maps/xggMRAzuVzSVFHS77"
    },
    {
        "region": "Buxoro",
        "name": "Vobkent",
        "address": "Vobkent tumani, Imom Buxoriy koʻchasi",
        "target": "Tuman dehqon bozori yonida",
        "link": "https://goo.gl/maps/2ev7v3K1S4e85sHz9"
    },
    {
        "region": "Buxoro",
        "name": "Romiton",
        "address": "Romitan tumani, Alisher Navoiy nomli MFY",
        "target": "Dehqon bozori roʻparasida",
        "link": "https://goo.gl/maps/yLnXHduu2RP3dpNX8"
    },
    {
        "region": "Buxoro",
        "name": "Qorako'l",
        "address": "Buxoro viloyati, Qorakoʻl tumani, Paxtakor MFY, Ulugʻbek koʻchasi, 120-uy",
        "target": "Maroqand restorani binosi",
        "link": "https://goo.gl/maps/dFd5WfqBojtcF6MJ7"
    },
    {
        "region": "Buxoro",
        "name": "Jondor",
        "address": "Buxoro viloyati, Jondor tumani, Navgadi MFY, Mahmud Tarobiy koʻchasi",
        "target": "Jondor tumani yangi dehqon bozori yaqinida.",
        "link": "https://goo.gl/maps/j8u3DkikwfTFh4xS6"
    },
    {
        "region": "Buxoro",
        "name": "Peshku",
        "address": "Buxoro viloyati, Peshku tumani, Yangi bozor MFY, Ibn Sino koʻchasi, 1-uy",
        "target": "«Porloq kelajak yulduzchalari» NTM yonida (Dehqon Bozori roʻparasida)",
        "link": "https://goo.gl/maps/DHVDpW4NRHA82Jzz5"
    },
    {
        "region": "Buxoro",
        "name": "Galaosiyo",
        "address": "Buxoro viloyati, Buxoro tumani, Galaosiyo shahri, Do‘stlik MFY, Buyuk Ipak yo‘li",
        "target": "Buxoro tuman hokimligi yonida",
        "link": "https://goo.gl/maps/T386HetCL2jpaMCp8"
    },
    {
        "region": "Buxoro",
        "name": "Kogon",
        "address": "Kogon shahri, Do’stlik ko’chasi",
        "target": "Qishloq Qurilish Bank binosi yonida",
        "link": "https://goo.gl/maps/X42tHAKk2dkMqFPH9"
    },
    {
        "region": "Buxoro",
        "name": "Olot",
        "address": "Olot tumani, Olot Shahri, Bunyodkor MFY, Shifokor ko'chasi",
        "target": "Musiqa va San'at maktabi yonida",
        "link": "https://goo.gl/maps/9UP3d3VS6Yto2H1z9"
    },
    {
        "region": "Sirdaryo",
        "name": "Guliston",
        "address": "Guliston shahri, Oʻzbekiston koʻchasi",
        "target": "«Saxovat» Gipermarketi",
        "link": "https://goo.gl/maps/Y1RtKL4PjzizP5Ec9"
    },
    {
        "region": "Jizzax",
        "name": "Jizzax",
        "address": "Jizzax shahri, Sh. Rashidov koʻchasi",
        "target": "Korzinka supermarketi roʻparasida",
        "link": "https://goo.gl/maps/iX92hiuaJQckDL387"
    },
    {
        "region": "Sirdaryo",
        "name": "Sirdaryo",
        "address": "Sirdaryo viloyati, Sirdaryo shahri, Oʻzbekiston koʻchasi (sobiq univermag binosi)",
        "target": "Ped.kollej roʻparasida",
        "link": "https://goo.gl/maps/BzkhZNVM6KgiumCQ7"
    },
    {
        "region": "Jizzax",
        "name": "G'allaorol",
        "address": "G'allaorol tumani, Do'stlik MFY ga qarashli Mustaqillik ko'chasi",
        "target": "Mikro kredit banki ro'parasida",
        "link": "https://maps.app.goo.gl/jhbKUDq9Fyuxo8Nf7"
    },
    {
        "region": "Jizzax",
        "name": "Yangier",
        "address": "Sirdaryo viloyati, Yangier shahri, Jome MFY, Paxtakor koʻchasi",
        "target": "124-avtobaza va Yangier shahar dehqon bozori yaqinida.",
        "link": "https://goo.gl/maps/ThoC9YRNsxnu82ji6"
    },
    {
        "region": "Jizzax",
        "name": "Paxtakor",
        "address": "Jizzax viloyati, Paxtakor tumani, Oltinkoʻl MFY, Sobir Rahimov koʻchasi",
        "target": "Kiyim-kechak bozori orqasida",
        "link": "https://goo.gl/maps/cYRF1xgCPwAsPrTf9"
    },
    {
        "region": "Jizzax",
        "name": "Zomin",
        "address": "Jizzax viloyati, Zomin shahri. Qo‘rg‘on MFY",
        "target": "Korzinka do‘koni yonida, oldingi Prizma do'koni.",
        "link": "https://maps.app.goo.gl/kDDyDp7hBRrJXF7K8"
    },
    {
        "region": "Sirdaryo",
        "name": "Boyovut",
        "address": "Boyovut tumani, Ijodkor mahallasi, Tinchlik Shoh ko'chasi 39-uy",
        "target": "Guldasta kafe ro'parasida",
        "link": "https://maps.app.goo.gl/3dfcoBeiAaN7H77S7"
    },
    {
        "region": "Jizzax",
        "name": "Baxmal",
        "address": "Manzil: Baxmal tumani, Oʻsmat shaharchasi, Mustaqillik ko‘chasi",
        "target": "Novqa turargohi yonida",
        "link": "https://maps.app.goo.gl/CVFMPKrTyQ3yhuD7A"
    },
    {
        "region": "Surxondaryo",
        "name": "Denov",
        "address": "Denov tumani, Nurli manzil MFY, Sh.Rashidov kuchasi, 273-A uy",
        "target": "Denov tumani hokimiyati va Trastbank yaqinida",
        "link": "https://goo.gl/maps/Yr7379QVxSnhWbog7"
    },
    {
        "region": "Surxondaryo",
        "name": "Oltinsoy",
        "address": "Surxondaryo viloyati,  Oltinsoy tumani, Bo‘ston shaharchasi, Y. Oxunboboyev ko‘chasi, 109-uy",
        "target": "Davlat kadastr agentligi",
        "link": "https://goo.gl/maps/rVSoBsxCuqWZmGGN6"
    },
    {
        "region": "Surxondaryo",
        "name": "Sherobod",
        "address": "Surxondaryo viloyati, Sherobod tumani, Katta Hayot MFY, Mustaqillik ko’chasi",
        "target": "Agrobank ro’parasida",
        "link": "https://maps.app.goo.gl/zkVwfBcrgvttR1MRA"
    },
    {
        "region": "Surxondaryo",
        "name": "Jarqo'rg'on",
        "address": "Surxondaryo viloyati, Jarqo’rg’on tumani, Surxon sohili MFY, O’zbekiston ko’chasi, 3-a uy",
        "target": "Sanoat Qurilish Bank filiali yonida",
        "link": "https://maps.app.goo.gl/bAZzbrDSWRqYMGhq5"
    },
    {
        "region": "Surxondaryo",
        "name": "Sho'rchi",
        "address": "Surxondaryo viloyati, Sho’rchi tumani, Bobur MFY, Mustaqillik ko’chasi.",
        "target": "Sho’rchi tuman bozori ro'parasida.",
        "link": "https://maps.app.goo.gl/rYNfcnYJrctWAdcB6"
    },
    {
        "region": "Surxondaryo",
        "name": "Angor",
        "address": "Angor tumani, Navro‘z mahallasi, at-Termiziy ko‘chasi, 42-A uy",
        "target": "Angor tuman hokimlik binosi yonida",
        "link": "https://maps.app.goo.gl/87jGrWyLCtDK4yMv9"
    },
    {
        "region": "Navoiy",
        "name": "Zarafshon",
        "address": "Navoiy viloyati, Zarafshon shahar, sanoat hududi",
        "target": "Markaziy bozor yaqinida",
        "link": "https://goo.gl/maps/LbGcMvjmSwuixveR9"
    },
    {
        "region": "Navoiy",
        "name": "Navoiy",
        "address": "Navoiy shahar Islom Karimov (Eski xalqlar doʻstligi) koʻchasi 7-uy.",
        "target": "Markaziy universal doʻkon (SUM) ichida.",
        "link": "https://goo.gl/maps/UrtN6cGokXMFn1zw5"
    },
    {
        "region": "Navoiy",
        "name": "Uchquduq",
        "address": "Uchquduq tumani, Mustaqillik MFY",
        "target": "Uchquduq avtovokzali yaqinida",
        "link": "https://goo.gl/maps/WCBZgBXuKvJfQ4ZG9"
    },
    {
        "region": "Buxoro",
        "name": "Shofirkon",
        "address": "Buxoro viloyati, Shofirkon tumani, Xoʻja Orif MFY, M.Ashrafiy koʻchasi, 4-uy",
        "target": "Madaniyat va Istirohat bogʻi yonida",
        "link": "https://goo.gl/maps/Mo8YFYJyNE9NkaZ26"
    },
    {
        "region": "Navoiy",
        "name": "Qiziltepa",
        "address": "Navoiy viloyati, Qiziltepa tumani, Oʻzbekiston shoh koʻchasi",
        "target": "Qiziltepa Dehqon Bozori roʻparasida",
        "link": "https://goo.gl/maps/UtMhS4nHsPkjgSFx8"
    },
    {
        "region": "Buxoro",
        "name": "G'ijduvon",
        "address": "Buxoro viloyati, Gʻijduvon tumani, 21-asr shoh koʻchasi",
        "target": "Gʻijduvon Dehqon bozori yonida",
        "link": "https://goo.gl/maps/7GJF8veexh76dpWh6"
    },
    {
        "region": "Navoiy",
        "name": "Nurota",
        "address": "Navoiy viloyati, Nurota tumani, Sharof Rashidov ko‘chasi",
        "target": "Tuman kinoteatri yonida",
        "link": "https://goo.gl/maps/4nFkt4MAYoRuz3RL9"
    },
    {
        "region": "Navoiy",
        "name": "Navbaxor",
        "address": "Navoiy viloyati, Navbahor tumani, Kelachi MFY, Markaziy Beshrabot ko'cha, 1Dehqon bozori ro'parasida",
        "target": "Dehqon bozori ro'parasida",
        "link": "https://goo.gl/maps/v682ekVKMeWASAyD6"
    },
    {
        "region": "Boshqa",
        "name": "ITOGO",
        "address": "",
        "target": "",
        "link": ""
    }
];
