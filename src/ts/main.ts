//import TestFunctions from "./TestFunctions";
//import Population from "./Population";

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

function main(): void {
  const numOfPopulation = document.getElementById(".population");
  const numOfVariable = document.getElementById('.variable');
  const numOfGeneration = document.getElementById('.generation');
  let populationSize = Number(numOfPopulation);
  let variableSize = Number(numOfVariable);
  let maxGeneration = Number(numOfGeneration);
  //alert(populationSize);
  DifferentialEvolution(100, 10, 100);
}

async function DifferentialEvolution(init_popSize: number, init_varSIze: number, init_generation: number) {
  let popSize = init_popSize;
  let varSize = init_varSIze;
  let maxGeneration = init_generation;
  let TF = new TestFunctions();
  let firstBest: number = 0.0;
  let cr = 0.8;
  let scallingFactor = 0.5;
  let lowerBound = -5.2;
  let upperBound = 5.2;

  let population: Array<Population> = [];  // 母集団
  let childPopulation: Array<Population> = [];  // 子個体母集団
  let bestIndivArray: Array<Population> = [];

  // 母集団の初期化
  population = Initialization(popSize, varSize, cr, scallingFactor, lowerBound, upperBound);
  childPopulation = Initialization(popSize, varSize, cr, scallingFactor, lowerBound, upperBound);
  // 評価
  population = PopulationEvaluation(population, TF);

  // ベスト個体の保存
  bestIndivArray.push(UpdateBest(population));
  firstBest = bestIndivArray[0].evaluationValue;
  //childPopulation = population.concat();
  for (let pop = 0; pop < population.length; pop++) {
    childPopulation[pop].variable = population[pop].variable.concat();
  }

  // 世代数分ループ
  for (let generation = 1; generation < maxGeneration; generation++) {
    childPopulation = CreateChildren(population, childPopulation);  // 子個体集団の生成
    childPopulation = PopulationEvaluation(childPopulation, TF);  // 評価
    population = JSON.parse(JSON.stringify(UpdatePopulation(population, childPopulation)));  // 母集団の更新
    bestIndivArray.push(UpdateBest(population));  // ベスト解の更新
    console.log('generation : ' + generation);
  }
  let output = <HTMLInputElement>document.getElementById('.result');
  console.log('first best : ' + String(firstBest));
  console.log('Final best value : ' + String(bestIndivArray[bestIndivArray.length - 1].evaluationValue));
}

function Initialization(popSize: number, varSize: number, cr: number, scallingFactor: number, lowerBound: number, upperBound: number): Array<Population> {
  let population: Array<Population> = [];
  for (let pop = 0; pop < popSize; pop++) {

    population.push(new Population(varSize, 99999999, cr, scallingFactor, pop, lowerBound, upperBound));

    // 各個体の設計変数を初期化
    for (let varNum = 0; varNum < population[pop].variable.length; varNum++) {
      population[pop].variable[varNum] = getRandomArbitrary(lowerBound, upperBound);
    }
  }
  return population;
}

function CreateChildren(population: Array<Population>, childPopulation: Array<Population>): Array<Population> {
  let popSize = population.length;
  let varSize = population[0].variable.length;
  let tmpChild = childPopulation.concat();
  for (let pop = 0; pop < childPopulation.length; pop++) {
    tmpChild[pop].variable = childPopulation[pop].variable.concat();
  }

  // 母集団のループ
  for (let popNum = 0; popNum < popSize; popNum++) {
    population[popNum].generation++;  // 世代数の更新

    let cross_varNum = getIntegerRandomNumber(0, varSize + 1);  // 交差する変数の選択

    // 交叉のための個体番号を取得
    let rNum = SelectPopulationNumber(popSize);

    // 交叉による変数の変更
    tmpChild[popNum].variable = population[popNum].variable.concat();  // 親個体の変数を引継ぎ
    tmpChild[popNum].variable = CrossOver(population, tmpChild, popNum, cross_varNum, rNum);
  }
  return tmpChild;
}

function SelectPopulationNumber(popSize: number): Array<number> {
  let rNum = [0, 0, 0];
  // 交叉のための個体番号を取得
  rNum[0] = getIntegerRandomNumber(0, popSize);
  rNum[1] = getIntegerRandomNumber(0, popSize);
  rNum[2] = getIntegerRandomNumber(0, popSize);
  while (rNum[0] === rNum[1] || rNum[1] === rNum[2] || rNum[2] === rNum[0]) {
    rNum[0] = getIntegerRandomNumber(0, popSize);
    rNum[1] = getIntegerRandomNumber(0, popSize);
    rNum[2] = getIntegerRandomNumber(0, popSize);
  }
  return rNum;
}

function CrossOver(population: Array<Population>, childPopulation: Array<Population>, popNum: number, cross_varNum: number, rNum: Array<number>): Array<number> {
  let variable = childPopulation[popNum].variable.concat();
  variable = JSON.parse(JSON.stringify(childPopulation[popNum].variable));

  // 交叉による変数の変更
  for (let varNum = 0; varNum < population[popNum].variable.length; varNum++) {
    if (varNum === cross_varNum || population[popNum].cr > getRandomArbitrary(0, 1)) {

      variable[varNum] = population[rNum[0]].variable[varNum] + population[popNum].scallingFactor * (population[rNum[1]].variable[varNum] - population[rNum[2]].variable[varNum]);

      // 上下限値の修正
      if (variable[varNum] < population[popNum].lowerBound) {
        variable[varNum] = population[popNum].lowerBound;
      }
      if (variable[varNum] > population[popNum].upperBound) {
        variable[varNum] = population[popNum].upperBound;
      }
    }
  }
  return variable;
}

function PopulationEvaluation(population: Array<Population>, TF: TestFunctions): Array<Population> {
  let tmpPopulation = population.concat();
  tmpPopulation.forEach(population => {
    // 評価
    population.evaluationValue = TF.Rastrign(population.variable);
  });
  return tmpPopulation;
}

function UpdatePopulation(population: Array<Population>, childPopulation: Array<Population>): Array<Population> {
  // 母集団の解更新
  let tmpPopulation = population.concat();
  for (let popNum = 0; popNum < population.length; popNum++) {
    if (childPopulation[popNum].evaluationValue < population[popNum].evaluationValue) {
      tmpPopulation[popNum] = childPopulation[popNum];
    }
  }
  return tmpPopulation;
}

function UpdateBest(population: Array<Population>): Population {
  // ベスト個体の保存
  let bestPopNumber = getBestPopulationNumber(population);
  console.log('best num : ' + bestPopNumber);
  console.log('best : ' + population[bestPopNumber].evaluationValue);
  return population[bestPopNumber];
}

function getBestPopulationNumber(population: Array<Population>): number {
  let bestPopNumber = 0;
  for (let popNum = 1; popNum < population.length; popNum++) {
    if (population[popNum].evaluationValue < population[bestPopNumber].evaluationValue) {
      bestPopNumber = popNum;
    }
  }
  return bestPopNumber;
}

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getIntegerRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}