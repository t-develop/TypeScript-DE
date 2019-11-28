//import TestFunctions from "./TestFunctions";
//import Population from "./Population";
'use strict';

import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

interface IPopulation {
  variable: Array<number>;
  evaluationValue: number;
}

class Population implements IPopulation {
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

class TestFunctions {

  /** 
   * Rastrign
  variable: Array<number> : number  */
  public Rastrign(variable: Array<number>): number {
    let sum: number = 0;
    variable.forEach(variable => {
      sum += Math.pow(variable, 2) - 10 * Math.cos(2 * Math.PI * variable);
    });
    return 10 * variable.length + sum;
  }

  /**
   * Schwefel
  variable: Array<number> : number  */
  public Schwefel(variable: Array<number>): number {
    return 0;
  }
}

function main(): void{
  $(".optimization").click(function(){

    // 入力値の取得
    const populationElement: HTMLInputElement = <HTMLInputElement>document.getElementById('.population');
    const variableElement: HTMLInputElement = <HTMLInputElement>document.getElementById('.variable');
    const generationElement: HTMLInputElement = <HTMLInputElement>document.getElementById('.generation');
    let populationSize = populationElement.valueAsNumber;
    let variableSize = variableElement.valueAsNumber;
    let maxGeneration = generationElement.valueAsNumber;
  
    // 差分進化の実行
    DifferentialEvolution(populationSize, variableSize, maxGeneration);
  });
}

async function DifferentialEvolution(init_popSize: number, init_varSIze: number, init_generation: number) {
  let popSize = init_popSize;
  let varSize = init_varSIze;
  let maxGeneration = init_generation;
  let TF = new TestFunctions();
  let firstBest: number = 0.0;

  let population: Array<Population> = [];  // 母集団
  let childPopulation: Array<Population> = [];  // 子個体母集団
  let bestIndividual: Population = new Population(varSize, 99999999, 0.5, 0.5, -1, -5.12, 5.12);  // ベスト解

  // 母集団の生成
  for (let i = 0; i < popSize; i++) {
    population.push(new Population(varSize, 99999999, 0.5, 0.5, i, -5.12, 5.12));
    childPopulation.push(new Population(varSize, 99999999, 0.5, 0.5, i, -5.12, 5.12));
  }

  // 母集団の初期化
  for (let pop = 0; pop < popSize; pop++) {
    // 各個体の設計変数を初期化
    for (let varNum = 0; varNum < varSize; varNum++) {
      population[pop].variable[varNum] = getRandomArbitrary(-5.2, 5.2);
    }
    // 評価
    population[pop].evaluationValue = TF.Rastrign(population[pop].variable);

    // ベスト個体の保存
    bestIndividual = population[getBestPopulationNumber(population)];
    firstBest = bestIndividual.evaluationValue;
  }

  // 世代数分ループ
  for (let generation = 0; generation < maxGeneration; generation++) {

    await CreateChildren(population, childPopulation, TF);  // 子個体集団の生成
    await Evaluation(childPopulation, TF);  // 評価
    await UpdatePopulation(population, childPopulation);  // 母集団の更新
    await UpdateBest(population, bestIndividual);  // ベスト解の更新
      
    
    //console.log('Best Individual Number : ' + String(getBestPopulationNumber(population)));
    //console.log('Generation : ' + String(bestIndividual.generation) + ' Best value : ' + String(bestIndividual.evaluationValue));
  }
  let output = <HTMLInputElement>document.getElementById('.result');
  //output.valueAsNumber = bestIndividual.evaluationValue;
  //output.innerHTML = String(bestIndividual.evaluationValue);
  console.log('first best : ' + String(firstBest));
  console.log('Final best value : ' + String(bestIndividual.evaluationValue));
}


async function CreateChildren(population: Array<Population>, childPopulation: Array<Population>, TF: TestFunctions) {
  
  let popSize = population.length;
  let varSize = population[0].variable.length;
  let r1 = 0;
  let r2 = 0;
  let r3 = 0;

  // 母集団のループ
  for (let popNum = 0; popNum < popSize; popNum++) {
    population[popNum].generation++;  // 世代数の更新

    let cross_varNum = getIntegerRandomNumber(0, varSize + 1);  // 交差する変数の選択

    // 交叉のための個体番号を取得
    await SelectPopulationNumber(r1, r2, r3, popSize);

    childPopulation[popNum].variable = population[popNum].variable;  // 親個体の変数を引継ぎ

    // 交叉による変数の変更
    await CrossOver(population, childPopulation, popNum, cross_varNum, r1, r2, r3);
  }
}

async function SelectPopulationNumber(r1: number, r2: number, r3: number, popSize: number) {
    // 交叉のための個体番号を取得
    r1 = getIntegerRandomNumber(0, popSize);
    r2 = getIntegerRandomNumber(0, popSize);
    r3 = getIntegerRandomNumber(0, popSize);
    while (r1 === r2 || r2 === r3 || r3 === r1) {
      r1 = getIntegerRandomNumber(0, popSize);
      r2 = getIntegerRandomNumber(0, popSize);
      r3 = getIntegerRandomNumber(0, popSize);
    }
}

async function CrossOver(population: Array<Population>, childPopulation: Array<Population>, popNum: number, cross_varNum: number, r1: number, r2: number, r3: number) {
   // 交叉による変数の変更
   for (let varNum = 0; varNum < population[popNum].variable.length - 1; varNum++) {
    if (varNum === cross_varNum || population[popNum].cr > getRandomArbitrary(0, 1)) {
      childPopulation[popNum].variable[varNum] = population[r1].variable[varNum] + population[popNum].scallingFactor * (population[r2].variable[varNum] - population[r3].variable[varNum]);
      if (childPopulation[population[popNum].popNumber].variable[varNum] < population[popNum].lowerBound) {
        childPopulation[popNum].variable[varNum] = population[popNum].lowerBound;
      }
      if (childPopulation[popNum].variable[varNum] > population[popNum].upperBound) {
        childPopulation[popNum].variable[varNum] = population[popNum].upperBound;
      }
    }
  }
}

async function Evaluation(childPopulation: Array<Population>, TF: TestFunctions) {
  for(let childNum = 0; childNum < childPopulation.length; childNum++)
  {
    // 評価
    childPopulation[childNum].evaluationValue = TF.Rastrign(childPopulation[childNum].variable);
  }
}

async function UpdatePopulation(population: Array<Population>, childPopulation: Array<Population>) {
  // 母集団の解更新
  for (let popNum = 0; popNum < population.length; popNum++) {
    if (childPopulation[popNum].evaluationValue < population[popNum].evaluationValue) {
      population[popNum] = childPopulation[popNum];
    }
  }
}

async function UpdateBest(population: Array<Population>, bestIndividual: Population) {
  // ベスト個体の保存
  let bestPopNumber = getBestPopulationNumber(population);
  if (bestIndividual.evaluationValue > population[bestPopNumber].evaluationValue) {
    console.log('indiv.evaluation:' + String(population[bestPopNumber].evaluationValue) + ' bestIndiv.evaluation:' + String(bestIndividual.evaluationValue));
    bestIndividual = population[bestPopNumber];
  }
}

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getIntegerRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getBestPopulationNumber(population: Array<Population>): number {
  let bestPopNumber: number = 0;
  for (let popNum = 1; popNum < population.length; popNum++) {
    if (population[bestPopNumber].evaluationValue > population[popNum].evaluationValue) {
      bestPopNumber = popNum;
    }
  }
  return bestPopNumber;
}