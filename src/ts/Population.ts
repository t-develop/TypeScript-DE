import IPopulation from "./IPopulation";

/*
母集団を形成するための個体を定義
最低限必要な要素はIPopulationを実装する形で定義し、
独自で必要な要素をここで定義する
*/
export default class Population implements IPopulation {
  variable: Array<number> = [];  // 設計変数
  evaluationValue: number = 99999999;  // 評価値
  cr: number = 0;  // 交差率
  scallingFactor: number = 0;  // スケーリングファクターF
  popNumber: number = 0;  // 個体番号
  generation: number = 0;
  lowerBound: number = 0;  // 解空間の下限値
  upperBound: number = 0;  // 解空間の上限値

  constructor(var_size: number, init_value: number, init_CR: number, init_SF: number, init_popNum: number, init_lower: number, init_upper: number) {
    this.variable = new Array(var_size);
    this.evaluationValue = init_value;
    this.cr = init_CR;
    this.scallingFactor = init_SF;
    this.popNumber = init_popNum;
    this.lowerBound = init_lower;
    this.upperBound = init_upper;
  }
}