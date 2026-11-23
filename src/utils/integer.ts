/*
 * Copyright 2026 Raymond Lam
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Convert a BigInt to a nonnegative safe integer.
 *
 * @param value - BigInt value to convert.
 * @param description - Human-readable option name used in error messages.
 * @returns The value as a JavaScript safe integer.
 * @throws Error if the value is negative or outside the safe-integer range.
 */
export const safeInteger = (value: bigint, description: string): number => {
  const converted = Number(value);
  if (!Number.isSafeInteger(converted) || BigInt(converted) !== value || converted < 0) {
    throw new Error(`${description} must be a nonnegative safe integer, got ${value}`);
  }
  return converted;
};
