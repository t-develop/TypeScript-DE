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
  const numOfPopulation: HTMLInputElement = <HTMLInputElement>document.getElementById("population");
  const numOfVariable: HTMLInputElement = <HTMLInputElement>document.getElementById('variable');
  const numOfGeneration: HTMLInputElement = <HTMLInputElement>document.getElementById('generation');
  let populationSize = Number(numOfPopulation.value);
  let variableSize = Number(numOfVariable.value);
  let maxGeneration = Number(numOfGeneration.value);

  DifferentialEvolution(populationSize, variableSize, maxGeneration);
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

  await ResetTableRow();

  // 母集団の初期化
  population = Initialization(popSize, varSize, cr, scallingFactor, lowerBound, upperBound);
  childPopulation = Initialization(popSize, varSize, cr, scallingFactor, lowerBound, upperBound);
  // 評価
  population = PopulationEvaluation(population, TF);

  // ベスト個体の保存
  bestIndivArray.push(UpdateBest(population));
  firstBest = bestIndivArray[0].evaluationValue;

  childPopulation = DeepCopyObject(population);

  await Optimization(population, childPopulation, bestIndivArray, TF, maxGeneration);
  let output = <HTMLOutputElement>document.getElementById('result');
  output.innerHTML = String(bestIndivArray[bestIndivArray.length - 1].evaluationValue);
  console.log('first best value : ' + String(firstBest));
  console.log('Final best value : ' + String(bestIndivArray[bestIndivArray.length - 1].evaluationValue));
}

async function Optimization(population: Array<Population>, childPopulation: Array<Population>, bestIndivArray: Array<Population>, TF: TestFunctions, maxGeneration: number) {
  // 世代数分ループ
  for (let generation = 1; generation < maxGeneration; generation++) {

    childPopulation = CreateChildren(population, childPopulation);  // 子個体集団の生成
    childPopulation = PopulationEvaluation(childPopulation, TF);  // 評価
    population = UpdatePopulation(population, childPopulation);  // 母集団の更新
    bestIndivArray.push(UpdateBest(population));  // ベスト解の更新
    console.log('generation : ' + generation);
    await AddTableRow(generation, bestIndivArray[bestIndivArray.length - 1].evaluationValue);
  }
}

async function ResetTableRow() {
  let table: HTMLTableElement = <HTMLTableElement>document.getElementById('table1');  //表のオブジェクトを取得
  let row_num = table.rows.length;    //表の行数を取得
  while (table.rows[1]) {
    table.deleteRow(1);
  }
}
async function AddTableRow(generation: number, bestEval: number) {
  let table: HTMLTableElement = <HTMLTableElement>document.getElementById('table1');  //表のオブジェクトを取得

  let row = table.insertRow(-1);  //行末に行(tr要素)を追加

  let cell1 = row.insertCell(0);  //セル(td要素)の追加
  let cell2 = row.insertCell(1);

  cell1.innerHTML = String(generation);   //セルにデータを挿入する
  cell2.innerHTML = String(bestEval);
}

function Initialization(popSize: number, varSize: number, cr: number, scallingFactor: number, lowerBound: number, upperBound: number): Array<Population> {
  let population: Array<Population> = [];
  for (let pop = 0; pop < popSize; pop++) {

    population.push(new Population(varSize, 99999999, cr, scallingFactor, pop, lowerBound, upperBound));

    // 各個体の設計変数を初期化
    for (let varNum = 0; varNum < population[pop].variable.length; varNum++) {
      population[pop].variable[varNum] = GetRandomArbitrary(lowerBound, upperBound);
    }
  }
  return population;
}

function CreateChildren(population: Array<Population>, childPopulation: Array<Population>): Array<Population> {
  let popSize = population.length;
  let varSize = population[0].variable.length;
  let tmpChild = DeepCopyObject(childPopulation);

  for (let pop = 0; pop < childPopulation.length; pop++) {
    tmpChild[pop].variable = DeepCopy(childPopulation[pop].variable);
  }

  // 母集団のループ
  for (let popNum = 0; popNum < popSize; popNum++) {
    population[popNum].generation++;  // 世代数の更新

    let cross_varNum = GetIntegerRandomNumber(0, varSize + 1);  // 交差する変数の選択

    // 交叉のための個体番号を取得
    let rNum = SelectPopulationNumber(popSize);

    // 交叉による変数の変更
    tmpChild[popNum].variable = DeepCopy(population[popNum].variable);  // 親個体の変数を引継ぎ
    tmpChild[popNum].variable = CrossOver(population, tmpChild, popNum, cross_varNum, rNum);
  }
  return DeepCopyObject(tmpChild);
}

function SelectPopulationNumber(popSize: number): Array<number> {
  let rNum = [0, 0, 0];
  // 交叉のための個体番号を取得
  rNum[0] = GetIntegerRandomNumber(0, popSize);
  rNum[1] = GetIntegerRandomNumber(0, popSize);
  rNum[2] = GetIntegerRandomNumber(0, popSize);
  while (rNum[0] === rNum[1] || rNum[1] === rNum[2] || rNum[2] === rNum[0]) {
    rNum[0] = GetIntegerRandomNumber(0, popSize);
    rNum[1] = GetIntegerRandomNumber(0, popSize);
    rNum[2] = GetIntegerRandomNumber(0, popSize);
  }
  return rNum;
}

function CrossOver(population: Array<Population>, childPopulation: Array<Population>, popNum: number, cross_varNum: number, rNum: Array<number>): Array<number> {
  let variable = DeepCopy(childPopulation[popNum].variable);

  // 交叉による変数の変更
  for (let varNum = 0; varNum < population[popNum].variable.length; varNum++) {
    if (varNum === cross_varNum || population[popNum].cr > GetRandomArbitrary(0, 1)) {

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
  return DeepCopy(variable);
}

function PopulationEvaluation(population: Array<Population>, TF: TestFunctions): Array<Population> {
  let tmpPopulation = DeepCopyObject(population);

  tmpPopulation.forEach(population => {
    // 評価
    population.evaluationValue = TF.Rastrign(population.variable);
  });
  return DeepCopyObject(tmpPopulation);
}

// 母集団の解更新
function UpdatePopulation(population: Array<Population>, childPopulation: Array<Population>): Array<Population> {
  let tmpPopulation = DeepCopyObject(population);

  for (let popNum = 0; popNum < population.length; popNum++) {
    if (childPopulation[popNum].evaluationValue < population[popNum].evaluationValue) {
      tmpPopulation[popNum] = childPopulation[popNum];
    }
  }
  return DeepCopyObject(tmpPopulation);
}

// ベスト個体の保存
function UpdateBest(population: Array<Population>): Population {
  let bestPopNumber = GetBestPopulationNumber(population);
  console.log('best num : ' + bestPopNumber);
  console.log('best : ' + population[bestPopNumber].evaluationValue);
  return population[bestPopNumber];
}

// ベスト解の番号を取得
function GetBestPopulationNumber(population: Array<Population>): number {
  let bestPopNumber = 0;
  for (let popNum = 1; popNum < population.length; popNum++) {
    if (population[popNum].evaluationValue < population[bestPopNumber].evaluationValue) {
      bestPopNumber = popNum;
    }
  }
  return bestPopNumber;
}

function GetRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function GetIntegerRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function DeepCopy(array: Array<number>): Array<number> {
  return JSON.parse(JSON.stringify(array));
}

function DeepCopyObject(arrayObject: Array<Population>): Array<Population> {
  return JSON.parse(JSON.stringify(arrayObject));
}