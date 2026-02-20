/**
 * ISHONCH Store Coordinates Mapping
 * Maps store names to their approximate lat/lng coordinates.
 * These coordinates represent city/district centers.
 */
const STORE_COORDS = {
    // === Farg'ona ===
    "Uchko'prik": [40.5253, 71.0308],
    "Besharik": [40.4369, 70.5714],
    "Qo'qon": [40.5286, 70.9425],
    "Bag'dod": [40.4500, 70.8500],
    "Yaypan": [40.3833, 71.0667],
    "Farg\\ona": [40.3838, 71.7893],
    "Quva": [40.5222, 71.9386],
    "Toshloq": [40.5167, 71.5833],
    "Farg'ona SUM": [40.3750, 71.7850],
    "Dangara": [40.5750, 70.9167],

    // === Namangan ===
    "Namangan": [40.9983, 71.6726],
    "Namangan 2": [41.0010, 71.6690],
    "Chust": [41.0000, 71.2333],
    "Mingbuloq": [40.7667, 71.1333],
    "yangiqo'rg'on": [41.0333, 71.7167],
    "Chortoq": [41.0667, 71.8167],
    "Uchqo'rg'on": [41.1167, 71.0333],
    "Uychi": [41.0833, 71.9167],
    "Pop": [40.8833, 71.1000],
    "Kosonsoy": [41.2500, 71.5500],
    "Toshbuloq": [40.9667, 71.6000],

    // === Andijon ===
    "Xo'jaobod": [40.6167, 72.0667],
    "Baliqchi": [40.8167, 72.3500],
    "Izboskan": [40.9167, 72.2333],
    "Andijon": [40.7833, 72.3444],
    "Oltinko'l": [40.6333, 72.2167],
    "Andijon mini": [40.7700, 72.3300],
    "Andijon 2": [40.7900, 72.3500],
    "Shaxrixon": [40.7167, 72.0500],
    "Andijon-Klinika": [40.7750, 72.3400],
    "Asaka": [40.6333, 72.2333],
    "Qo'ng'ontepa": [40.7333, 72.1000],
    "Buloqboshi": [40.6167, 72.3833],
    "Marxamat": [40.7667, 72.1667],
    "Paxtaobod": [40.8500, 72.1333],
    "Jalaquduq": [40.9500, 72.1167],
    "Xonobod mini": [40.8000, 72.5000],

    // === Toshkent viloyati ===
    "Yangiyo'l": [41.1117, 69.0461],
    "Chirchiq mini": [41.4689, 69.5828],
    "Chiqchiq": [41.4750, 69.5900],
    "Keles": [41.2000, 69.2167],
    "G'azalkent": [41.5500, 69.7667],
    "Yuqori Chirchiq": [41.5667, 69.8000],
    "Quyi chirchiq": [41.2833, 69.3167],
    "Zangiota": [41.1667, 69.1333],
    "Parkent": [41.2833, 69.6667],
    "Oqqo'rg'on": [40.8167, 68.7667],
    "Qibray": [41.3833, 69.3833],
    "Angren": [41.0167, 70.1333],
    "Bo'ka": [40.8167, 68.9000],
    "Olmaliq": [40.8500, 69.6000],
    "Piskent": [40.9000, 69.3500],
    "Zafar": [40.5833, 68.8833],
    "Bekobod": [40.2208, 68.6194],

    // === Xorazm ===
    "Urganch": [41.5500, 60.6333],
    "Xiva": [41.3833, 60.6333],
    "Gurlan": [41.5833, 60.7500],
    "Beruniy": [41.6833, 60.7500],
    "Xonka": [41.5167, 60.8167],
    "Bog'ot": [41.4833, 60.9000],
    "Xazorasp": [41.3167, 61.0667],
    "Shovot": [41.6667, 60.7333],

    // === Qoraqalpog'iston ===
    "To'rtko'l": [41.5500, 60.6000],
    "Amudaryo": [41.6667, 60.9333],
    "Nukus": [42.4611, 59.6022],
    "Xo'jayli": [42.4000, 59.4333],
    "Qo'ng'iroq": [42.0833, 58.7000],
    "Chimboy": [42.9333, 59.7833],

    // === Qashqadaryo ===
    "Qarshi": [38.8600, 65.7983],
    "Shaxrisabz": [39.0500, 66.8333],
    "Koson": [38.9167, 65.5500],
    "G'uzor": [38.6167, 66.2333],
    "Chiroqchi": [39.0333, 66.5667],
    "Kasbi": [38.9500, 65.4333],
    "Beshkent": [38.8000, 65.8500],
    "Yakkabog'": [39.0833, 66.7333],

    // === Samarqand ===
    "Urgut": [39.3500, 67.2500],
    "Ishtixon": [39.7167, 66.5167],
    "Samarqand": [39.6542, 66.9597],
    "Kattaqo'rg'on": [39.8972, 66.2561],
    "Jomboy": [39.7167, 67.1833],
    "Narpay": [39.8833, 66.4333],
    "Nurobod": [39.5667, 67.0000],
    "Qo'shrabod": [39.7333, 66.1333],
    "Bulung'ur": [39.7500, 67.2667],
    "Oqdaryo": [39.5667, 66.9500],
    "Pastdarg'on": [39.5667, 66.7000],
    "Payariq": [39.7667, 67.1500],

    // === Buxoro ===
    "Buxoro": [39.7747, 64.4286],
    "Vobkent": [40.0167, 64.5167],
    "Romiton": [39.9167, 64.3833],
    "Qorako'l": [39.5000, 63.8500],
    "Jondor": [39.7167, 64.1833],
    "Peshku": [39.1333, 64.0500],
    "Galaosiyo": [39.8333, 64.5000],
    "Kogon": [39.7167, 64.5500],
    "Olot": [39.7667, 63.5833],
    "Shofirkon": [40.1167, 64.5000],
    "G'ijduvon": [40.1000, 64.6833],

    // === Sirdaryo ===
    "Guliston": [40.4892, 68.7842],
    "Sirdaryo": [40.4000, 68.6500],
    "Boyovut": [40.3667, 68.5000],

    // === Jizzax ===
    "Jizzax": [40.1158, 67.8422],
    "G'allaorol": [40.3167, 67.6000],
    "Yangier": [40.4333, 68.8333],
    "Paxtakor": [40.3167, 67.4500],
    "Zomin": [39.9500, 68.3833],
    "Baxmal": [39.9833, 68.1500],

    // === Surxondaryo ===
    "Denov": [38.2667, 67.8833],
    "Oltinsoy": [38.5500, 67.7000],
    "Sherobod": [37.6500, 67.0000],
    "Jarqo'rg'on": [37.5000, 67.4167],
    "Sho'rchi": [38.1167, 67.8000],
    "Angor": [37.6000, 67.5333],

    // === Navoiy ===
    "Zarafshon": [41.5833, 64.1833],
    "Navoiy": [40.1033, 65.3792],
    "Uchquduq": [42.1500, 63.5500],
    "Qiziltepa": [40.0333, 65.0833],
    "Nurota": [40.5600, 65.6900],
    "Navbaxor": [40.3333, 64.9167],

    // === ITOGO (skip) ===
    "ITOGO": [41.3, 64.5]
};

// Enrich ISHONCH_STORES with coordinates
if (typeof ISHONCH_STORES !== 'undefined') {
    ISHONCH_STORES.forEach(store => {
        const coords = STORE_COORDS[store.name];
        if (coords) {
            store.lat = coords[0];
            store.lng = coords[1];
        }
    });
}
