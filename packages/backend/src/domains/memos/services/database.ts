import { Database } from "@hocuspocus/extension-database";
import { Context } from '@/middlewares/Context';
import { Memo } from '../models/Memo.model';

export const getDatabaseExtension = (context: Omit<Context, 'editorServer'>) => {
  const memoRepository = context.db.getTreeRepository(Memo);

  return new Database({
    fetch: async ({ documentName }) => {
      const memo = await memoRepository.findOneBy({ id: documentName }).catch(() => null);
      if (!memo?.content) return null;

      const result = Buffer.from(memo.content, 'base64');
      return result;
    },
    store: async ({ documentName, state }) => {
      context.logger.d('store', documentName, state);
      await memoRepository.update({ id: documentName }, {
        content: Buffer.from(state).toString('base64'),
      });
    },
  });
};
