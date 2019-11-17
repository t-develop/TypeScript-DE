"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestFunctions = require("./TestFunctions");
var Population = require("./Population");
function DifferentialEvolution(init_popSize, init_varSIze) {
    var popSize = init_popSize;
    var varSize = init_varSIze;
    var TF = new TestFunctions.TestFunctions();
    var population = []; // 母集団
    var childPopulation = []; // 子個体母集団
    var bestIndividual = new Population.Population(10, 0, 0.5, 0.5, -1); // ベスト解
    // 母集団の生成
    for (var i = 0; i < popSize; i++) {
        population.push(new Population.Population(10, 0, 0.5, 0.5, i));
        childPopulation.push(new Population.Population(10, 0, 0.5, 0.5, i));
    }
    // 母集団の初期化
    for (var pop = 0; pop < popSize; pop++) {
        // 各個体の設計変数を初期化
        for (var vari = 0; vari < varSize; vari++) {
            population[pop].variable[vari] = getRandomArbitrary(-5.2, 5.2);
        }
        // 評価
        population[pop].evaluationValue = TF.Rastrign(population[pop].variable);
        // ベスト個体の保存
        bestIndividual = population[getMin_Eval_ValuePop_Number(population)];
    }
    // 世代数分ループ
    for (var generation = 0; generation < 100; generation++) {
        // 母集団のループ
        population.forEach(function (indiv) {
            indiv.generation++; // 世代数の更新
            // 子個体の生成
            var cross_varNUm = getRandomArbitrary(0, varSize + 1); // 交差する変数の選択
            var rand = getRandomArbitrary(0, 1); // 交叉率
            // 交叉のための個体番号を取得
            var r1 = getRandomArbitrary(0, popSize + 1);
            var r2 = getRandomArbitrary(0, popSize + 1);
            var r3 = getRandomArbitrary(0, popSize + 1);
            while (r1 === r2 && r2 === r3 && r3 === r1) {
                r1 = getRandomArbitrary(0, popSize + 1);
                r2 = getRandomArbitrary(0, popSize + 1);
                r3 = getRandomArbitrary(0, popSize + 1);
            }
            childPopulation[indiv.popNumber].variable = indiv.variable; // 親個体の変数を引継ぎ
            // 交叉による変数の変更
            for (var varNum = 0; varNum < indiv.variable.length; varNum++) {
                if (varNum == cross_varNUm || indiv.cr > rand) {
                    childPopulation[indiv.popNumber].variable[varNum] = population[r1].variable[varNum] + indiv.scallingFactor * (population[r2].variable[varNum] - population[r3].variable[varNum]);
                }
            }
            // 評価
            childPopulation[indiv.popNumber].evaluationValue = TF.Rastrign(childPopulation[indiv.popNumber].variable);
        });
        // 母集団の解更新
        population.forEach(function (indiv) {
            if (childPopulation[indiv.popNumber].evaluationValue < indiv.evaluationValue) {
                indiv = childPopulation[indiv.popNumber];
            }
        });
        // ベスト個体の保存
        bestIndividual = population[getMin_Eval_ValuePop_Number(population)];
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getMin_Eval_ValuePop_Number(population) {
    var bestPopNumber = 0;
    for (var popNum = 1; popNum < population.length; popNum++) {
        if (population[bestPopNumber].evaluationValue > population[popNum].evaluationValue) {
            bestPopNumber = popNum;
        }
    }
    return bestPopNumber;
}
