/*
母集団を形成するための個体を定義
最低限必要な要素はIPopulationを実装する形で定義し、
独自で必要な要素をここで定義する
*/
var Population = /** @class */ (function () {
    function Population(var_size, init_value, init_CR, init_SF, init_popNum) {
        this.variable = []; // 設計変数
        this.evaluationValue = 0; // 評価値
        this.cr = 0; // 交差率
        this.scallingFactor = 0; // スケーリングファクターF
        this.popNumber = 0; // 個体番号
        this.generation = 0;
        this.variable = new Array(var_size);
        this.evaluationValue = init_value;
        this.cr = init_CR;
        this.scallingFactor = init_SF;
        this.popNumber = init_popNum;
    }
    return Population;
}());
export default Population;
