"use strict";
//import TestFunctions from "./TestFunctions";
//import Population from "./Population";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
function DifferentialEvolution(init_popSize, init_varSIze, init_generation) {
    return __awaiter(this, void 0, void 0, function () {
        var popSize, varSize, maxGeneration, TF, firstBest, cr, scallingFactor, lowerBound, upperBound, population, childPopulation, bestIndivArray, pop, generation, output;
        return __generator(this, function (_a) {
            popSize = init_popSize;
            varSize = init_varSIze;
            maxGeneration = init_generation;
            TF = new TestFunctions();
            firstBest = 0.0;
            cr = 0.8;
            scallingFactor = 0.5;
            lowerBound = -5.2;
            upperBound = 5.2;
            population = [];
            childPopulation = [];
            bestIndivArray = [];
            // 母集団の初期化
            population = Initialization(popSize, varSize, cr, scallingFactor, lowerBound, upperBound);
            childPopulation = Initialization(popSize, varSize, cr, scallingFactor, lowerBound, upperBound);
            // 評価
            population = PopulationEvaluation(population, TF);
            // ベスト個体の保存
            bestIndivArray.push(UpdateBest(population));
            firstBest = bestIndivArray[0].evaluationValue;
            //childPopulation = population.concat();
            for (pop = 0; pop < population.length; pop++) {
                childPopulation[pop].variable = population[pop].variable.concat();
            }
            // 世代数分ループ
            for (generation = 1; generation < maxGeneration; generation++) {
                childPopulation = CreateChildren(population, childPopulation); // 子個体集団の生成
                childPopulation = PopulationEvaluation(childPopulation, TF); // 評価
                population = JSON.parse(JSON.stringify(UpdatePopulation(population, childPopulation))); // 母集団の更新
                bestIndivArray.push(UpdateBest(population)); // ベスト解の更新
                console.log('generation : ' + generation);
            }
            output = document.getElementById('.result');
            console.log('first best : ' + String(firstBest));
            console.log('Final best value : ' + String(bestIndivArray[bestIndivArray.length - 1].evaluationValue));
            return [2 /*return*/];
        });
    });
}
function Initialization(popSize, varSize, cr, scallingFactor, lowerBound, upperBound) {
    var population = [];
    for (var pop = 0; pop < popSize; pop++) {
        population.push(new Population(varSize, 99999999, cr, scallingFactor, pop, lowerBound, upperBound));
        // 各個体の設計変数を初期化
        for (var varNum = 0; varNum < population[pop].variable.length; varNum++) {
            population[pop].variable[varNum] = getRandomArbitrary(lowerBound, upperBound);
        }
    }
    return population;
}
function CreateChildren(population, childPopulation) {
    var popSize = population.length;
    var varSize = population[0].variable.length;
    var tmpChild = childPopulation.concat();
    for (var pop = 0; pop < childPopulation.length; pop++) {
        tmpChild[pop].variable = childPopulation[pop].variable.concat();
    }
    // 母集団のループ
    for (var popNum = 0; popNum < popSize; popNum++) {
        population[popNum].generation++; // 世代数の更新
        var cross_varNum = getIntegerRandomNumber(0, varSize + 1); // 交差する変数の選択
        // 交叉のための個体番号を取得
        var rNum = SelectPopulationNumber(popSize);
        // 交叉による変数の変更
        tmpChild[popNum].variable = population[popNum].variable.concat(); // 親個体の変数を引継ぎ
        tmpChild[popNum].variable = CrossOver(population, tmpChild, popNum, cross_varNum, rNum);
    }
    return tmpChild;
}
function SelectPopulationNumber(popSize) {
    var rNum = [0, 0, 0];
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
function CrossOver(population, childPopulation, popNum, cross_varNum, rNum) {
    var variable = childPopulation[popNum].variable.concat();
    variable = JSON.parse(JSON.stringify(childPopulation[popNum].variable));
    // 交叉による変数の変更
    for (var varNum = 0; varNum < population[popNum].variable.length; varNum++) {
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
function PopulationEvaluation(population, TF) {
    var tmpPopulation = population.concat();
    tmpPopulation.forEach(function (population) {
        // 評価
        population.evaluationValue = TF.Rastrign(population.variable);
    });
    return tmpPopulation;
}
function UpdatePopulation(population, childPopulation) {
    // 母集団の解更新
    var tmpPopulation = population.concat();
    for (var popNum = 0; popNum < population.length; popNum++) {
        if (childPopulation[popNum].evaluationValue < population[popNum].evaluationValue) {
            tmpPopulation[popNum] = childPopulation[popNum];
        }
    }
    return tmpPopulation;
}
function UpdateBest(population) {
    // ベスト個体の保存
    var bestPopNumber = getBestPopulationNumber(population);
    console.log('best num : ' + bestPopNumber);
    console.log('best : ' + population[bestPopNumber].evaluationValue);
    return population[bestPopNumber];
}
function getBestPopulationNumber(population) {
    var bestPopNumber = 0;
    for (var popNum = 1; popNum < population.length; popNum++) {
        if (population[popNum].evaluationValue < population[bestPopNumber].evaluationValue) {
            bestPopNumber = popNum;
        }
    }
    return bestPopNumber;
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getIntegerRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
