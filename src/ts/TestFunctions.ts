export default class TestFunctions {

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
   * DoublePower
  variable: Array<number> : number  */
  public DoublePower(variable: Array<number>): number {
    let sum: number = 0;
    variable.forEach(variable => {
      sum += Math.pow(Math.pow(variable, 2), 2);
    })
    return sum;
  }
}