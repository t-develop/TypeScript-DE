//import TestFunctions from "./TestFunctions";
//import Population from "./Population";
'use strict';
var Population = /** @class */ (function () {
    function Population(var_size, init_value, init_CR, init_SF, init_popNum, init_lower, init_upper) {
        this.variable = []; // 設計変数
        this.evaluationValue = 99999999; // 評価値
        this.cr = 0; // 交差率
        this.scallingFactor = 0; // スケーリングファクターF
        this.popNumber = 0; // 個体番号
        this.generation = 0;
        this.lowerBound = 0; // 解空間の下限値
        this.upperBound = 0; // 解空間の上限値
        this.variable = new Array(var_size);
        this.evaluationValue = init_value;
        this.cr = init_CR;
        this.scallingFactor = init_SF;
        this.popNumber = init_popNum;
        this.lowerBound = init_lower;
        this.upperBound = init_upper;
    }
    return Population;
}());
var TestFunctions = /** @class */ (function () {
    function TestFunctions() {
    }
    /**
     * Rastrign
    variable: Array<number> : number  */
    TestFunctions.prototype.Rastrign = function (variable) {
        var sum = 0;
        variable.forEach(function (variable) {
            sum += Math.pow(variable, 2) - 10 * Math.cos(2 * Math.PI * variable);
        });
        return 10 * variable.length + sum;
    };
    /**
     * Schwefel
    variable: Array<number> : number  */
    TestFunctions.prototype.Schwefel = function (variable) {
        return 0;
    };
    return TestFunctions;
}());
function DifferentialEvolution(init_popSize, init_varSIze, init_generation) {
    var popSize = init_popSize;
    var varSize = init_varSIze;
    var maxGeneration = init_generation;
    var TF = new TestFunctions();
    var firstBest = 0.0;
    var population = []; // 母集団
    var childPopulation = []; // 子個体母集団
    var bestIndividual = new Population(varSize, 99999999, 0.5, 0.5, -1, -5.12, 5.12); // ベスト解
    // 母集団の生成
    for (var i = 0; i < popSize; i++) {
        population.push(new Population(varSize, 99999999, 0.5, 0.5, i, -5.12, 5.12));
        childPopulation.push(new Population(varSize, 99999999, 0.5, 0.5, i, -5.12, 5.12));
    }
    // 母集団の初期化
    for (var pop = 0; pop < popSize; pop++) {
        // 各個体の設計変数を初期化
        for (var varNum = 0; varNum < varSize; varNum++) {
            population[pop].variable[varNum] = getRandomArbitrary(-5.2, 5.2);
        }
        // 評価
        population[pop].evaluationValue = TF.Rastrign(population[pop].variable);
        // ベスト個体の保存
        bestIndividual = population[getBestPopulationNumber(population)];
        firstBest = bestIndividual.evaluationValue;
    }
    // 世代数分ループ
    for (var generation = 0; generation < maxGeneration; generation++) {
        // 母集団のループ
        /*for (let popNum = 0; popNum < popSize; popNum++) {
          population[popNum].generation++;  // 世代数の更新
    
          let cross_varNUm = getIntegerRandomNumber(0, varSize + 1);  // 交差する変数の選択
    
          // 交叉のための個体番号を取得
          let r1 = getIntegerRandomNumber(0, popSize);
          let r2 = getIntegerRandomNumber(0, popSize);
          let r3 = getIntegerRandomNumber(0, popSize);
          while (r1 === r2 || r2 === r3 || r3 === r1) {
            r1 = getIntegerRandomNumber(0, popSize);
            r2 = getIntegerRandomNumber(0, popSize);
            r3 = getIntegerRandomNumber(0, popSize);
          }
    
          childPopulation[popNum].variable = population[popNum].variable;  // 親個体の変数を引継ぎ
    
          // 交叉による変数の変更
          for (let varNum = 0; varNum < population[popNum].variable.length - 1; varNum++) {
            if (varNum === cross_varNUm || population[popNum].cr > getRandomArbitrary(0, 1)) {
              childPopulation[popNum].variable[varNum] = population[r1].variable[varNum] + population[popNum].scallingFactor * (population[r2].variable[varNum] - population[r3].variable[varNum]);
              if (childPopulation[population[popNum].popNumber].variable[varNum] < population[popNum].lowerBound) {
                childPopulation[popNum].variable[varNum] = population[popNum].lowerBound;
              }
              if (childPopulation[popNum].variable[varNum] > population[popNum].upperBound) {
                childPopulation[popNum].variable[varNum] = population[popNum].upperBound;
              }
            }
          }
          // 評価
          childPopulation[popNum].evaluationValue = TF.Rastrign(childPopulation[popNum].variable);
        }
    
        // 母集団の解更新
        for (let popNum = 0; popNum < popSize; popNum++) {
          if (childPopulation[popNum].evaluationValue < population[popNum].evaluationValue) {
            population[popNum] = childPopulation[popNum];
          }
        }
    
        // ベスト個体の保存
        let bestPopNumber = getBestPopulationNumber(population);
        if (bestIndividual.evaluationValue > population[bestPopNumber].evaluationValue) {
          console.log('indiv.evaluation:' + String(population[bestPopNumber].evaluationValue) + ' bestIndiv.evaluation:' + String(bestIndividual.evaluationValue));
          bestIndividual = population[bestPopNumber];
        }
    */
        CreateChildren(population, childPopulation, TF, UpdatePopulation(population, childPopulation, UpdateBest(population, bestIndividual)));
        //console.log('Best Individual Number : ' + String(getBestPopulationNumber(population)));
        //console.log('Generation : ' + String(bestIndividual.generation) + ' Best value : ' + String(bestIndividual.evaluationValue));
    }
    var output = document.getElementById('.result');
    //output.valueAsNumber = bestIndividual.evaluationValue;
    //output.innerHTML = String(bestIndividual.evaluationValue);
    console.log('first best : ' + String(firstBest));
    console.log('Final best value : ' + String(bestIndividual.evaluationValue));
}
function CreateChildren(population, childPopulation, TF, callback) {
    // 母集団のループ
    var popSize = population.length;
    var varSize = population[0].variable.length;
    for (var popNum = 0; popNum < popSize; popNum++) {
        population[popNum].generation++; // 世代数の更新
        var cross_varNUm = getIntegerRandomNumber(0, varSize + 1); // 交差する変数の選択
        // 交叉のための個体番号を取得
        var r1 = getIntegerRandomNumber(0, popSize);
        var r2 = getIntegerRandomNumber(0, popSize);
        var r3 = getIntegerRandomNumber(0, popSize);
        while (r1 === r2 || r2 === r3 || r3 === r1) {
            r1 = getIntegerRandomNumber(0, popSize);
            r2 = getIntegerRandomNumber(0, popSize);
            r3 = getIntegerRandomNumber(0, popSize);
        }
        childPopulation[popNum].variable = population[popNum].variable; // 親個体の変数を引継ぎ
        // 交叉による変数の変更
        for (var varNum = 0; varNum < population[popNum].variable.length - 1; varNum++) {
            if (varNum === cross_varNUm || population[popNum].cr > getRandomArbitrary(0, 1)) {
                childPopulation[popNum].variable[varNum] = population[r1].variable[varNum] + population[popNum].scallingFactor * (population[r2].variable[varNum] - population[r3].variable[varNum]);
                if (childPopulation[population[popNum].popNumber].variable[varNum] < population[popNum].lowerBound) {
                    childPopulation[popNum].variable[varNum] = population[popNum].lowerBound;
                }
                if (childPopulation[popNum].variable[varNum] > population[popNum].upperBound) {
                    childPopulation[popNum].variable[varNum] = population[popNum].upperBound;
                }
            }
        }
        // 評価
        childPopulation[popNum].evaluationValue = TF.Rastrign(childPopulation[popNum].variable);
    }
    callback();
}
function UpdatePopulation(population, childPopulation, callback) {
    // 母集団の解更新
    for (var popNum = 0; popNum < population.length; popNum++) {
        if (childPopulation[popNum].evaluationValue < population[popNum].evaluationValue) {
            population[popNum] = childPopulation[popNum];
        }
    }
    callback();
}
function UpdateBest(population, bestIndividual) {
    // ベスト個体の保存
    var bestPopNumber = getBestPopulationNumber(population);
    if (bestIndividual.evaluationValue > population[bestPopNumber].evaluationValue) {
        console.log('indiv.evaluation:' + String(population[bestPopNumber].evaluationValue) + ' bestIndiv.evaluation:' + String(bestIndividual.evaluationValue));
        bestIndividual = population[bestPopNumber];
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getIntegerRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getBestPopulationNumber(population) {
    var bestPopNumber = 0;
    for (var popNum = 1; popNum < population.length; popNum++) {
        if (population[bestPopNumber].evaluationValue > population[popNum].evaluationValue) {
            bestPopNumber = popNum;
        }
    }
    return bestPopNumber;
}
function main() {
    var numOfPopulation = document.getElementById(".population");
    var numOfVariable = document.getElementById('.variable');
    var numOfGeneration = document.getElementById('.generation');
    var populationSize = Number(numOfPopulation);
    var variableSize = Number(numOfVariable);
    var maxGeneration = Number(numOfGeneration);
    //alert(populationSize);
    DifferentialEvolution(100, 10, 100);
}
