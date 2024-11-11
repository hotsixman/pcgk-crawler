import { parse } from "node-html-parser";
import { ENERGY_CARD_TYPE, EnergyCardType, MON_TYPE, MonType, POKEMON_CARD_TYPE, PokemonCardType, TRAINERS_CARD_TYPE, type OrderRule, type TrainersCardType } from "./const.js";
import type { BasicEnergyCard, Card, CardBase, EnergyCard, PokemonCard, SearchData, SearchResultData, SpecialEnergyCard, Tech, TrainersCard, WeakResi } from "./types.js";
import axios from "axios";

export function orderRuleToOrderBy(orderRule: OrderRule) {
    if (orderRule === "Date") {
        return 'order_num';
    }
    else {
        return orderRule;
    }
}

export function trainersCardTypeToCardType(type: TrainersCardType) {
    if (type === "서포트") {
        return '서포'
    }
    else {
        return type;
    }
}

export function parseSearchData(e: any) {
    if (e.result && !Array.isArray(e.result)) {
        const resultArr: SearchResultData[] = [];
        Object.keys(e.result).forEach(key => {
            resultArr[parseInt(key) - 1] = e.result[key]
        })
        e.result = resultArr;
    }

    const resultArr: SearchResultData[] = [];
    e.result.forEach((e: any) => {
        resultArr.push({
            cardNum: e['CardNum'],
            featureImage: e['feature_image']
        })
    })

    e.result = resultArr;

    return e as SearchData;
}

export async function getCard(cardNum: string): Promise<Card | null> {
    try {
        const response = await axios({
            method: 'get',
            url: `https://pokemoncard.co.kr/cards/detail/${cardNum}`,
            responseType: 'text'
        });

        return parseCard(response.data, cardNum);
    }
    catch {
        return null;
    }
}

export function parseCard(body: string, cardNum: string): Card | null {
    const doc = parse(body);

    const detailedType = getDetailedCardtype(doc.querySelector('.pokemon-info')?.textContent?.split(':')?.[1] ?? null);
    if (!detailedType) return null;
    const cardType = getCardType(detailedType[0]);
    if (!cardType) return null;

    // card base
    const name = doc.querySelector('.card-hp.title')?.textContent?.trim();
    const goods = doc.querySelector('.pre_info_wrap > img')?.getAttribute('src')?.split('/').at(-1)?.split('.')[0];
    const order = Number(doc.querySelector('.p_num')?.textContent?.split('/')?.[0]?.trim()) || null;
    const regulation = doc.querySelectorAll('.pre_info_wrap > img')?.[1]?.getAttribute('src')?.split('/')?.at(-1)?.split('.')?.[0] ?? null;
    const illustrator = doc.querySelector('.illustrator')?.textContent?.split('\n')?.at(-1) ?? null;
    const rareGrade = doc.querySelector('.p_num > span')?.textContent?.trim() || null;
    const featureImage = doc.querySelector('.feature_image')?.getAttribute('src') ?? '';
    if (!goods || !name || !order) return null;
    const cardBase: CardBase = {
        name,
        type: cardType,
        detailedType,
        goods,
        order,
        regulation,
        illustrator,
        rareGrade,
        cardNum,
        featureImage
    };

    switch (cardBase.type) {
        case ('energy'): {
            switch (cardBase.detailedType[0] as EnergyCardType) {
                case ('기본 에너지'): {
                    const energyType = cardBase.name.replace('기본', '').replace('에너지', '').trim() as MonType;
                    if (!(MON_TYPE.includes(energyType))) {
                        return null;
                    }
                    const card: BasicEnergyCard = {
                        ...cardBase,
                        energyType,
                        type: 'energy',
                        detailedType: ['기본 에너지']
                    }
                    return card;
                }
                case ('특수 에너지'): {
                    const card: SpecialEnergyCard = {
                        ...cardBase,
                        type: 'energy',
                        detailedType: ['특수 에너지'],
                        effect: doc.querySelector('.pokemon-abilities > .ability:not(.mgt0)')?.textContent?.trim() ?? ''
                    }
                    return card;
                }
            }
        }
        case ('pokemon'): {
            const hp = Number(doc.querySelector('.hp_num')?.textContent?.replace('HP', '')?.trim()) ?? 0;
            const monType = Array.from(doc.querySelectorAll('.card-hp > img.type_b')).map(e => e.getAttribute('title') ?? null)?.filter(e => e !== null) as MonType[];

            const stats = doc.querySelectorAll('.pokemon-stats .stat');
            if (stats[0]?.querySelector('span')) {
                var weakness: WeakResi | null = {
                    type: stats[0]?.querySelector('img')?.getAttribute('title') as MonType,
                    value: stats[0]?.querySelector('span')?.textContent?.trim() ?? ''
                }
            }
            else {
                var weakness: WeakResi | null = null;
            }
            if (stats[1]?.querySelector('span')) {
                var resistance: WeakResi | null = {
                    type: stats[1]?.querySelector('img')?.getAttribute('title') as MonType,
                    value: stats[1]?.querySelector('span')?.textContent?.trim() ?? ''
                }
            }
            else {
                var resistance: WeakResi | null = null;
            }
            const retreat = stats[2]?.querySelectorAll('div.card-energies > img').length ?? 0;

            //기술
            const tech: Tech[] = Array.from(doc.querySelectorAll('.pokemon-abilities > .ability')).map(e => {
                const parentArea = e.querySelector('.area-parent');
                if (!parentArea) return null;

                const name = parentArea.querySelector('span.skil_name')?.textContent?.trim() ?? '';
                const energy = Array.from(parentArea.querySelectorAll(':scope > img')).map(el => el.getAttribute('title')) as MonType[];
                const damage = parentArea.querySelector('span.plus')?.textContent?.trim() || null;
                const effect = parentArea.querySelector(':scope + p')?.textContent?.trim() ?? null;

                const t: Tech = {
                    name,
                    energy,
                    damage,
                    effect
                }

                return t;
            }).filter(e => e !== null)

            const card: PokemonCard = {
                ...cardBase,
                type: 'pokemon',
                detailedType: (detailedType as PokemonCardType[]),
                hp,
                monType,
                weakness,
                resistance,
                retreat,
                tech
            };

            return card;
        }
        case ('trainers'): {
            const card: TrainersCard = {
                ...cardBase,
                type: 'trainers',
                detailedType: (detailedType as TrainersCardType[]),
                effect: doc.querySelector('.ability.mgt0')?.textContent?.trim() ?? ''
            };

            return card;
        }
        default: {
            return null;
        }
    }
}

function getDetailedCardtype(text: string | null): CardBase['detailedType'] | null {
    if (!text) return null;

    const detailedType: CardBase['detailedType'] = [];

    text.split('|').map(t => t.trim()).forEach(t => {
        if(t === "기본 포켓몬 ex"){
            detailedType.push("기본");
            detailedType.push("포켓몬 ex")
        }
        else if(t === "기본 포켓몬"){
            detailedType.push("기본")
        }
        else if(t === "1진화 포켓몬"){
            detailedType.push("1진화")
        }
        else if(t === "2진화 포켓몬"){
            detailedType.push("2진화")
        }
        else if(t === "M진화 포켓몬"){
            detailedType.push("M진화")
        }
        else if(t.startsWith("프리즘스타")){
            detailedType.push("프리즘스타")
        }
        else if(t === "BREAK진화 포켓몬"){
            detailedType.push("BREAK진화")
        }
        /*
        else if(t === "V진화"){
            detailedType.push("포켓몬 V", "1진화")
        }
        */
        else{
            detailedType.push(t as CardBase['detailedType'][number])
        }
    })

    return detailedType;
}

export function getCardType(type: string): Card['type'] | null {
    //@ts-expect-error
    if (POKEMON_CARD_TYPE.includes(type)) {
        return 'pokemon';
    }
    //@ts-expect-error
    else if (TRAINERS_CARD_TYPE.includes(type)) {
        return 'trainers';
    }
    //@ts-expect-error
    else if (ENERGY_CARD_TYPE.includes(type)) {
        return 'energy';
    }

    return null;
}