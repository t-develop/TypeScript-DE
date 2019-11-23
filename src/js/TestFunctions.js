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
export default TestFunctions;
