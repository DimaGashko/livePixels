/**
 * Возвращает массив делителей числа n
 * @param n обрабатываемое число (ожидается, что число целое)
 * @param e допустимая погрешность (допустимая остача от деления) 
 * (для абсолютной точности - 0 (по умолчанию))
 */
export default function getDivs(n: number, e: number = 0): number[] {
   if (n === 0) return [];
   else if (n === 1) return [1];
   else if (n < 0) n = -n;

   const lim = Math.sqrt(n);
   const divs = [1, n];

   for (let d = 2; d < lim; d++) {
      if (n % d <= e) continue;

      divs.push(d);
      divs.push(n / d);
   }

   if (n % lim <= e) {
      divs.push(lim);
   }

   return divs;
}

/** Объект кэша используемый функцией getDivs */
const cache: {[n: number]: number[]} = {};

/**
 * Обертка над функцией getDivs добавляющая кеширование результатов
 * (у большинства чисел количество делителей в пределах 2-50)
 * @param n обрабатываемое число
 * @param e допустимая погрешность (допустимая остача от деления)
 */
export function getDivs_withCache(n: number, e: number = 0): number[] { 
   if (n in cache) { 
      return cache[n];
   }

   const res = getDivs(n, e);
   cache[n] = res;

   return res;
}