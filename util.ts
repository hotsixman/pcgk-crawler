import type { OrderRule, TrainersCardType } from "./const.js";
import type { SearchData, SearchResultData } from "./types.js";

export function orderRuleToOrderBy(orderRule: OrderRule){
    if(orderRule === "Date"){
        return 'order_num';
    }
    else{
        return orderRule;
    }
}

export function trainersCardTypeToCardType(type: TrainersCardType){
    if(type === "서포트"){
        return '서포'
    }
    else{
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

    return e as SearchData;
}

/*
export function parseCard(body: string) {
    const $ = load(body);

    const name: string = $('.card-hp.title').text().trim();
    const level: number | null = $('.card-hp.level').text() ? Number($('.card-hp.level').text()) : null;

    const HP = Number($('.hp_num').text().replace(/^HP([0-9]*)$/, '$1'));

    const types: string[] = Array.from($('.card-hp').find('img')).map(e => $(e).attr('title') as string)
}
*/