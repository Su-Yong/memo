import { EntitySchema } from 'typeorm';

const modelList: EntitySchema<any>[] = [];

export const registerModel: ClassDecorator = (target) => {
  modelList.push(target as any);
};

export const getModelList = () => modelList;
