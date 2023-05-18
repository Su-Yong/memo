import { O } from 'ts-toolbelt';

export interface Config {
  server: {
    port: number;
    host: string;
  }
}

export const defaultConfig: Config = {
  server: {
    port: 4672, // ChatGPT(GPT-4, Browsing)의 추천을 받아 정해졌습니다
    host: 'localhost',
  },
};

export const mergeConfig = (...configs: O.Partial<Config, 'deep'>[]) => {
  const result = { ...defaultConfig };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const override = (source: any, target: any) => {
    Object.entries(target).forEach(([key, value]) => {
      if (value == undefined) return;

      if (typeof value === 'object' && !Array.isArray(value)) {
        override(source[key], value);
      } else {
        source[key] = value;
      }
    });

  };

  configs.forEach((config) => {
    override(result, config);
  });

  return result;
};
