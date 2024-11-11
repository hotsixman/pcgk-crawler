import { SearchPokemonCardType, type EnergyCardType, type GoodsName, type MonType, type OrderRule, type PokemonCardType, type SpecialAbility, type TrainersCardType } from "./const.js";

//검색
export type TextSearchParam = 'all' | 'cardname' | 'cardtext';

export interface PokemonSearchOption {
    limit: number;
    goodsName: GoodsName;
    cardType?: SearchPokemonCardType[];
    cardMonType?: (MonType | 'all')[];
    specialAbility?: SpecialAbility[];
    weakness?: (MonType | 'all')[];
    resistance?: (MonType | 'all')[];
    techErg?: (MonType | 'all')[];
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

export interface TrainersSearchOption {
    limit: number;
    goodsName: GoodsName;
    orderRule: OrderRule;
    order: 'DESC' | 'ASC';
    cardType?: TrainersCardType[];
}

export interface EnergySearchOption {
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
    cardNum: 'string';
    featureImage: 'string'
}

//카드
export interface CardBase {
    name: string;
    type: 'pokemon' | 'trainers' | 'energy';
    detailedType: (PokemonCardType | TrainersCardType | EnergyCardType)[];
    goods: string;
    order: number;
    illustrator: string | null;
    regulation: string | null;
    rareGrade: string | null;
    cardNum: string;
    featureImage: string;
}
export interface PokemonCard extends CardBase {
    hp: number;
    type: 'pokemon';
    detailedType: PokemonCardType[];
    monType: MonType[];
    weakness: WeakResi | null;
    resistance: WeakResi | null;
    retreat: number;
    tech: Tech[];
}
export interface WeakResi {
    type: MonType;
    value: string;
}
export interface Tech {
    energy: MonType[];
    name: string;
    damage: string | null;
    effect: string | null;
}

export interface TrainersCard extends CardBase {
    type: 'trainers';
    detailedType: TrainersCardType[];
    effect: string;
}

interface EnergyCardBase extends CardBase {
    type: 'energy';
    detailedType: EnergyCardType[];
}
export interface SpecialEnergyCard extends EnergyCardBase{
    detailedType: ['특수 에너지'];
    effect: string;
}
export interface BasicEnergyCard extends EnergyCardBase{
    detailedType: ['기본 에너지'];
    energyType: MonType;
}
export type EnergyCard = SpecialEnergyCard | BasicEnergyCard;

export type Card = PokemonCard | TrainersCard | EnergyCard;