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

  constructor(var_size: number, init_value: number, init_CR: number, init_SF: number, init_popNum: number) {
    this.variable = new Array(var_size);
    this.evaluationValue = init_value;
    this.cr = init_CR;
    this.scallingFactor = init_SF;
    this.popNumber = init_popNum;
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

function DifferentialEvolution(init_popSize: number, init_varSIze: number, init_generation: number) {
  let popSize = init_popSize;
  let varSize = init_varSIze;
  let maxGeneration = init_generation;
  let TF = new TestFunctions();

  let population: Array<Population> = [];  // 母集団
  let childPopulation: Array<Population> = [];  // 子個体母集団
  let bestIndividual: Population = new Population(varSize, 99999999, 0.5, 0.5, -1);  // ベスト解

  // 母集団の生成
  for (let i = 0; i < popSize; i++) {
    population.push(new Population(varSize, 99999999, 0.5, 0.5, i));
    childPopulation.push(new Population(varSize, 99999999, 0.5, 0.5, i));
  }

  // 母集団の初期化
  for (let pop = 0; pop < popSize; pop++) {
    // 各個体の設計変数を初期化
    for (let vari = 0; vari < varSize; vari++) {
      population[pop].variable[vari] = getRandomArbitrary(-5.2, 5.2);
    }
    // 評価
    population[pop].evaluationValue = TF.Rastrign(population[pop].variable);

    // ベスト個体の保存
    bestIndividual = population[getBestPopulationNumber(population)];
  }

  // 世代数分ループ
  for (let generation = 0; generation < maxGeneration; generation++) {
    // 母集団のループ
    population.forEach(indiv => {
      indiv.generation++;  // 世代数の更新

      // 子個体の生成
      let cross_varNUm = getRandomArbitrary(0, varSize + 1);  // 交差する変数の選択
      let rand = getRandomArbitrary(0, 1);  // 交叉率

      // 交叉のための個体番号を取得
      let r1 = getRandomArbitrary(0, popSize + 1);
      let r2 = getRandomArbitrary(0, popSize + 1);
      let r3 = getRandomArbitrary(0, popSize + 1);
      while (r1 === r2 || r2 === r3 || r3 === r1) {
        r1 = getRandomArbitrary(0, popSize + 1);
        r2 = getRandomArbitrary(0, popSize + 1);
        r3 = getRandomArbitrary(0, popSize + 1);
      }

      childPopulation[indiv.popNumber].variable = indiv.variable;  // 親個体の変数を引継ぎ

      // 交叉による変数の変更
      for (let varNum = 0; varNum < indiv.variable.length; varNum++) {
        if (varNum == cross_varNUm || indiv.cr > rand) {
          childPopulation[indiv.popNumber].variable[varNum] = population[r1].variable[varNum] + indiv.scallingFactor * (population[r2].variable[varNum] - population[r3].variable[varNum]);
        }
      }
      // 評価
      childPopulation[indiv.popNumber].evaluationValue = TF.Rastrign(childPopulation[indiv.popNumber].variable);
    });

    // 母集団の解更新
    population.forEach(indiv => {
      if (childPopulation[indiv.popNumber].evaluationValue < indiv.evaluationValue) {
        indiv = childPopulation[indiv.popNumber];
      }
    });
    // ベスト個体の保存
    bestIndividual = population[getBestPopulationNumber(population)]
    alert(String(bestIndividual.evaluationValue));
  }
  let output = <HTMLInputElement>document.getElementById('.result');
  //output.valueAsNumber = bestIndividual.evaluationValue;
  //output.innerHTML = String(bestIndividual.evaluationValue);
  alert(String(bestIndividual.evaluationValue));
}

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
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

function main(): void {
  const numOfPopulation = document.getElementById(".population");
  const numOfVariable = document.getElementById('.variable');
  const numOfGeneration = document.getElementById('.generation');
  let populationSize = Number(numOfPopulation);
  let variableSize = Number(numOfVariable);
  let maxGeneration = Number(numOfGeneration);
  //alert(populationSize);
  DifferentialEvolution(100, 10, 10);
}