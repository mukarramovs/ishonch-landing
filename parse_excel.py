import pandas as pd
import json

df = pd.read_excel('Do\'kon manzillari_Xududlar_bo\'yicha.xlsx')

stores = []

def clean(val):
    if pd.isna(val): return ""
    return str(val).strip()

def get_region(address, name):
    text = (address + " " + name).lower()
    if 'toshkent' in text or 'chirchiq' in text or 'angren' in text or 'bekobod' in text or 'olmaliq' in text or 'zangiota' in text or 'parkent' in text or 'qibray' in text or 'bo\'ka' in text or 'piskent' in text or 'g\'azalkent' in text or 'keles' in text or 'oqqo\'rg\'on' in text or 'zafar' in text: return 'Toshkent'
    if 'fargʻona' in text or 'farg\'ona' in text or 'farg‘ona' in text or 'qo\'qon' in text or 'qoʻqon' in text or 'marg\'ilon' in text or 'dangara' in text or 'uchko\'prik' in text or 'besharik' in text or 'bag\'dod' in text or 'yaypan' in text or 'quva' in text or 'toshloq' in text: return 'Farg\'ona'
    if 'namangan' in text or 'chust' in text or 'chortoq' in text or 'kosonsoy' in text or 'mingbuloq' in text or 'yangiqo\'rg\'on' in text or 'uchqo\'rg\'on' in text or 'uychi' in text or 'pop' in text or 'toshbuloq' in text: return 'Namangan'
    if 'andijon' in text or 'asaka' in text or 'shaxrixon' in text or 'xonobod' in text or 'xo\'jaobod' in text or 'baliqchi' in text or 'izboskan' in text or 'oltinko\'l' in text or 'qo\'ng\'ontepa' in text or 'buloqboshi' in text or 'marxamat' in text or 'paxtaobod' in text or 'jalaquduq' in text: return 'Andijon'
    if 'xorazm' in text or 'urganch' in text or 'xiva' in text or 'hazorasp' in text or 'gurlan' in text or 'xazorasp' in text or 'shovot' in text or 'xonka' in text or 'bog\'ot' in text: return 'Xorazm'
    if 'qoraqal' in text or 'nukus' in text or 'beruniy' in text or 'to\'rtko\'l' in text or 'toʻrtkoʻl' in text or 'amudaryo' in text or 'xo\'jayli' in text or 'qo\'ng\'iroq' in text or 'qo\'ng\'irot' in text or 'chimboy' in text: return 'Qoraqalpog\'iston'
    if 'qashqadar' in text or 'qarshi' in text or 'shaxrisabz' in text or 'g\'uzor' in text or 'kasbi' in text or 'yakkabog\'' in text or 'koson' in text or 'chiroqchi' in text or 'beshkent' in text: return 'Qashqadaryo'
    if 'surxondar' in text or 'termiz' in text or 'denov' in text or 'sherobod' in text or 'bolt' in text or 'jarqo\'rg\'on' in text or 'sho\'rchi' in text or 'angor' in text or 'oltinsoy' in text: return 'Surxondaryo'
    if 'samarqand' in text or 'urgut' in text or 'kattaqo\'rg\'on' in text or 'jomboy' in text or 'nurobod' in text or 'ishtixon' in text or 'narpay' in text or 'qo\'shrabod' in text or 'bulung\'ur' in text or 'oqdaryo' in text or 'pastdarg\'on' in text or 'payariq' in text: return 'Samarqand'
    if 'buxoro' in text or 'vobkent' in text or 'qorako\'l' in text or 'jondor' in text or 'kogon' in text or 'olot' in text or 'romiton' in text or 'peshku' in text or 'galaosiyo' in text: return 'Buxoro'
    if 'navoiy' in text or 'zarafshon' in text or 'uchquduq' in text: return 'Navoiy'
    if 'jizzax' in text or 'g\'allaorol' in text or 'paxtakor' in text or 'zomin' in text or 'baxmal' in text: return 'Jizzax'
    if 'sirdar' in text or 'guliston' in text or 'yangier' in text or 'boyovut' in text: return 'Sirdaryo'
    return 'Boshqa'

for index, row in df.iterrows():
    if index == 0: continue
    filial = clean(row.get('Unnamed: 2'))
    manzil = clean(row.get('Unnamed: 3'))
    moljal = clean(row.get('Unnamed: 4'))
    link = clean(row.get('Unnamed: 5'))
    
    if not filial and not manzil:
        continue
        
    if "region" in filial.lower() or filial == "1":
        continue
        
    stores.append({
        "region": get_region(manzil, filial),
        "name": filial,
        "address": manzil,
        "target": moljal,
        "link": link
    })

with open('stores_data.js', 'w', encoding='utf-8') as f:
    f.write("const ISHONCH_STORES = ")
    json.dump(stores, f, ensure_ascii=False, indent=4)
    f.write(";\n")
print(f"Exported {len(stores)} stores.")
