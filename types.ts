import { type EnergyCardType, type GoodsName, type MonType, type OrderRule, type PokemonCardType, type SpecialAbility, type TrainersCardType } from "./const.js";

export type TextSearchParam = 'all' | 'cardname' | 'cardtext';

export interface PokemonSearchOption {
    limit: number;
    goodsName: GoodsName;
    cardType?: PokemonCardType[];
    cardMonType?: (MonType & 'all')[];
    specialAbility?: SpecialAbility[];
    weakness?: (MonType & 'all')[];
    resistance?: (MonType & 'all')[];
    techErg?: (MonType & 'all')[];
    hp?: {
        min?: number;
        max?: number;
    };
    retreat?: {
        min?: number;
        max?: number;
    }
    orderRule: OrderRule;
    order: 'DESC' | 'ASC';
}

export interface TrainersSearchOption{
    limit: number;
    goodsName: GoodsName;
    orderRule: OrderRule;
    order: 'DESC' | 'ASC';
    cardType?: TrainersCardType[];
}

export interface EnergySearchOption{
    limit: number;
    goodsName: GoodsName;
    orderRule: OrderRule;
    order: 'DESC' | 'ASC';
    cardType?: EnergyCardType[];
}

export interface SearchData {
    status: boolean;
    count: number;
    limit: number;
    msg: string;
    result: SearchResultData[]
}
export interface SearchResultData {
    'CardNum': 'string';
    feature_image: 'string'
}