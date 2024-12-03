import i18n, { TOptions } from "i18next";

export const tSafe = (
  key: string,
  defaultValue: string = "",
  options?: TOptions<Record<string, unknown>>
): string => {
  const translation = i18n.t(key, options);
  return translation !== key ? translation : defaultValue;
};
