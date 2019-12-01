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
    DifferentialEvolution(100, 10, 20);
}
function DifferentialEvolution(init_popSize, init_varSIze, init_generation) {
    return __awaiter(this, void 0, void 0, function () {
        var popSize, varSize, maxGeneration, TF, firstBest, population, childPopulation, bestIndivArray, i, generation, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    popSize = init_popSize;
                    varSize = init_varSIze;
                    maxGeneration = init_generation;
                    TF = new TestFunctions();
                    firstBest = 0.0;
                    population = [];
                    childPopulation = [];
                    bestIndivArray = [];
                    // 母集団の生成
                    for (i = 0; i < popSize; i++) {
                        population.push(new Population(varSize, 99999999, 0.5, 0.5, i, -5.12, 5.12));
                        childPopulation.push(new Population(varSize, 99999999, 0.5, 0.5, i, -5.12, 5.12));
                    }
                    // 母集団の初期化
                    return [4 /*yield*/, Initialization(population, population[0].lowerBound, population[0].upperBound)];
                case 1:
                    // 母集団の初期化
                    _a.sent();
                    // 評価
                    return [4 /*yield*/, Evaluation(population, TF)];
                case 2:
                    // 評価
                    _a.sent();
                    // ベスト個体の保存
                    return [4 /*yield*/, UpdateBest(population, bestIndivArray)];
                case 3:
                    // ベスト個体の保存
                    _a.sent();
                    firstBest = bestIndivArray[0].evaluationValue;
                    generation = 0;
                    _a.label = 4;
                case 4:
                    if (!(generation < maxGeneration)) return [3 /*break*/, 10];
                    return [4 /*yield*/, CreateChildren(population, childPopulation, TF)];
                case 5:
                    _a.sent(); // 子個体集団の生成
                    return [4 /*yield*/, Evaluation(childPopulation, TF)];
                case 6:
                    _a.sent(); // 評価
                    return [4 /*yield*/, UpdatePopulation(population, childPopulation)];
                case 7:
                    _a.sent(); // 母集団の更新
                    return [4 /*yield*/, UpdateBest(population, bestIndivArray)];
                case 8:
                    _a.sent(); // ベスト解の更新
                    _a.label = 9;
                case 9:
                    generation++;
                    return [3 /*break*/, 4];
                case 10:
                    output = document.getElementById('.result');
                    console.log('first best : ' + String(firstBest));
                    console.log('Final best value : ' + String(bestIndivArray[bestIndivArray.length - 1].evaluationValue));
                    return [2 /*return*/];
            }
        });
    });
}
function Initialization(population, lowerBound, upperBound) {
    return __awaiter(this, void 0, void 0, function () {
        var pop, varNum;
        return __generator(this, function (_a) {
            for (pop = 0; pop < population.length; pop++) {
                // 各個体の設計変数を初期化
                for (varNum = 0; varNum < population[pop].variable.length; varNum++) {
                    population[pop].variable[varNum] = getRandomArbitrary(lowerBound, upperBound);
                }
            }
            return [2 /*return*/];
        });
    });
}
function CreateChildren(population, childPopulation, TF) {
    return __awaiter(this, void 0, void 0, function () {
        var popSize, varSize, r1, r2, r3, popNum, cross_varNum;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    popSize = population.length;
                    varSize = population[0].variable.length;
                    r1 = 0;
                    r2 = 0;
                    r3 = 0;
                    popNum = 0;
                    _a.label = 1;
                case 1:
                    if (!(popNum < popSize)) return [3 /*break*/, 5];
                    population[popNum].generation++; // 世代数の更新
                    cross_varNum = getIntegerRandomNumber(0, varSize + 1);
                    // 交叉のための個体番号を取得
                    return [4 /*yield*/, SelectPopulationNumber(r1, r2, r3, popSize)];
                case 2:
                    // 交叉のための個体番号を取得
                    _a.sent();
                    childPopulation[popNum].variable = population[popNum].variable; // 親個体の変数を引継ぎ
                    console.log('pop ' + popNum + ' var : ' + population[popNum].variable);
                    console.log('chi ' + popNum + ' var : ' + childPopulation[popNum].variable);
                    // 交叉による変数の変更
                    return [4 /*yield*/, CrossOver(population, childPopulation, popNum, cross_varNum, r1, r2, r3)];
                case 3:
                    // 交叉による変数の変更
                    _a.sent();
                    _a.label = 4;
                case 4:
                    popNum++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function SelectPopulationNumber(r1, r2, r3, popSize) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // 交叉のための個体番号を取得
            r1 = getIntegerRandomNumber(0, popSize);
            r2 = getIntegerRandomNumber(0, popSize);
            r3 = getIntegerRandomNumber(0, popSize);
            while (r1 === r2 || r2 === r3 || r3 === r1) {
                r1 = getIntegerRandomNumber(0, popSize);
                r2 = getIntegerRandomNumber(0, popSize);
                r3 = getIntegerRandomNumber(0, popSize);
            }
            return [2 /*return*/];
        });
    });
}
function CrossOver(population, childPopulation, popNum, cross_varNum, r1, r2, r3) {
    return __awaiter(this, void 0, void 0, function () {
        var varNum;
        return __generator(this, function (_a) {
            // 交叉による変数の変更
            for (varNum = 0; varNum < population[popNum].variable.length - 1; varNum++) {
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
            return [2 /*return*/];
        });
    });
}
function Evaluation(population, TF) {
    return __awaiter(this, void 0, void 0, function () {
        var childNum;
        return __generator(this, function (_a) {
            for (childNum = 0; childNum < population.length; childNum++) {
                // 評価
                population[childNum].evaluationValue = TF.Rastrign(population[childNum].variable);
            }
            return [2 /*return*/];
        });
    });
}
function UpdatePopulation(population, childPopulation) {
    return __awaiter(this, void 0, void 0, function () {
        var popNum;
        return __generator(this, function (_a) {
            // 母集団の解更新
            for (popNum = 0; popNum < population.length; popNum++) {
                if (childPopulation[popNum].evaluationValue < population[popNum].evaluationValue) {
                    population[popNum] = childPopulation[popNum];
                }
            }
            return [2 /*return*/];
        });
    });
}
function UpdateBest(population, bestIndivArray) {
    return __awaiter(this, void 0, void 0, function () {
        var bestPopNumber;
        return __generator(this, function (_a) {
            bestPopNumber = getBestPopulationNumber(population);
            bestIndivArray.push(population[bestPopNumber]);
            return [2 /*return*/];
        });
    });
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
