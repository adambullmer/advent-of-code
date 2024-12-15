/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */
export * from "./grid.js";

export function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export function reduce(numerator: number, denominator: number): [number, number] {
  const d = gcd(numerator, denominator);
  return [numerator / d, denominator / d];
}

export function decimalToFraction(decimal: number) {
  if (decimal === Math.floor(decimal)) {
    return { numerator: decimal, denominator: 1 };
  }

  const decimalString = decimal.toString();
  const decimalPlaces = decimalString.split(".")[1].length;
  const denominator = 10 ** decimalPlaces;
  const numerator = decimal * denominator;
  const divisor = gcd(numerator, denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}
