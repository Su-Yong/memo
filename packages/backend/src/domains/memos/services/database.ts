import { Database } from "@hocuspocus/extension-database";
import { Context } from '@/middlewares/Context';
import { MemoDAO } from '../models/Memo.model';

export const getDatabaseExtension = (context: Omit<Context, 'editorServer'>) => {
  const memoRepository = context.db.getTreeRepository(MemoDAO);

  return new Database({
    fetch: async ({ documentName }) => {
      const memo = await memoRepository.findOneBy({ id: documentName }).catch(() => null);

      return memo?.content ?? null;
    },
    store: async ({ documentName, state }) => {
      await memoRepository.update({ id: documentName }, {
        content: state,
      });
    },
  });
};
