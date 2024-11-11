import axios from "axios";
import type { PokemonSearchOption, SearchData, TextSearchParam, TrainersSearchOption, EnergySearchOption } from "./types.js";
import { orderRuleToOrderBy, parseSearchData } from "./util.js";

export async function textSearch(text: string, param: TextSearchParam, limit: number): Promise<SearchData | null> {
    const data = new FormData();
    data.append('action', 'search_text_cards');
    data.append('search_text', text);
    data.append('search_params', param);
    data.append('limit', limit.toString());

    const response = await axios({
        method: 'post',
        url: 'https://pokemoncard.co.kr/v2/ajax2_dev2',
        headers: {
            'host': 'pokemoncard.co.kr',
            'origin': 'https://pokemoncard.co.kr',
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://pokemoncard.co.kr/cards",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        data
    });

    if (!response.data) return null;

    return parseSearchData(response.data);
}

export async function pokemonSearch(option: PokemonSearchOption): Promise<SearchData | null> {
    const data = new FormData();
    data.append('action', 'get_more_cards');
    data.append('GoodsName', option.goodsName);
    data.append('orderby', orderRuleToOrderBy(option.orderRule));
    data.append('order', option.order);
    data.append('limit', option.limit.toString());
    data.append('CardTypeNum', '1');
    data.append('CardType', option?.cardType?.join(',') ?? '');
    data.append('CardMonType', option?.cardMonType?.join(',') ?? '');
    data.append('ability_label1', option?.specialAbility?.join(',') ?? '');
    data.append('Weakness', option?.weakness?.join(',') ?? '');
    data.append('Resistance', option?.resistance?.join(',') ?? '');
    data.append('TechErg', option?.techErg?.join(',') ?? '');
    data.append('hp', `${option.hp?.min ?? 0},${option.hp?.min ?? 340}`);
    data.append('retreat', `${option.retreat?.min ?? 0},${option.retreat?.min ?? 5}`);

    const response = await axios({
        method: 'post',
        url: 'https://pokemoncard.co.kr/v2/ajax2_dev2',
        headers: {
            'host': 'pokemoncard.co.kr',
            'origin': 'https://pokemoncard.co.kr',
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://pokemoncard.co.kr/cards",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        data
    });

    if (!response.data) return null;

    return parseSearchData(response.data);
}

export async function trainersSearch(option: TrainersSearchOption) {
    const data = new FormData();
    data.append('action', 'get_more_cards');
    data.append('GoodsName', option.goodsName);
    data.append('orderby', orderRuleToOrderBy(option.orderRule));
    data.append('order', option.order);
    data.append('limit', option.limit.toString());
    data.append('CardTypeNum', '2');
    data.append('CardType', option?.cardType?.join(',') ?? '');

    const response = await axios({
        method: 'post',
        url: 'https://pokemoncard.co.kr/v2/ajax2_dev2',
        headers: {
            'host': 'pokemoncard.co.kr',
            'origin': 'https://pokemoncard.co.kr',
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://pokemoncard.co.kr/cards",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        data
    });

    if (!response.data) return null;

    return parseSearchData(response.data);
}

export async function energySearch(option: EnergySearchOption) {
    const data = new FormData();
    data.append('action', 'get_more_cards');
    data.append('GoodsName', option.goodsName);
    data.append('orderby', orderRuleToOrderBy(option.orderRule));
    data.append('order', option.order);
    data.append('limit', option.limit.toString());
    data.append('CardTypeNum', '3');
    data.append('CardType', option?.cardType?.join(',') ?? '');

    const response = await axios({
        method: 'post',
        url: 'https://pokemoncard.co.kr/v2/ajax2_dev2',
        headers: {
            'host': 'pokemoncard.co.kr',
            'origin': 'https://pokemoncard.co.kr',
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://pokemoncard.co.kr/cards",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        data
    });

    if (!response.data) return null;

    return parseSearchData(response.data);
}


function sleep(ms: number) {
    return new Promise((res) => {
        setTimeout(res, ms)
    })
}