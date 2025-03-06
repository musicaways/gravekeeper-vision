
/**
 * Utility functions for generating the map interaction script
 */

/**
 * Extracts the function body from a function toString() result
 * This helps us reuse TypeScript functions in our injected script
 */
export function extractFunctionBody(func: Function): string {
  // Split by opening brace, take everything after it, then remove the last brace
  const funcStr = func.toString();
  const bodyStart = funcStr.indexOf('{') + 1;
  const bodyEnd = funcStr.lastIndexOf('}');
  return funcStr.substring(bodyStart, bodyEnd).trim();
}

/**
 * Formats a function for inclusion in the generated script
 * @param name The function name
 * @param func The function to extract the body from
 */
export function formatScriptFunction(name: string, func: Function): string {
  return `
  function ${name}(${getFunctionParams(func)}) {
    ${extractFunctionBody(func)}
  }
  `;
}

/**
 * Gets the parameter list from a function
 */
function getFunctionParams(func: Function): string {
  const funcStr = func.toString();
  const paramStart = funcStr.indexOf('(') + 1;
  const paramEnd = funcStr.indexOf(')');
  return funcStr.substring(paramStart, paramEnd);
}
