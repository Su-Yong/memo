import { useEffect, useMemo, useRef, useState } from 'react';
import Dialog from './Dialog';
import { AxiosError } from 'axios';

interface ErrorDialogProps {
  error?: unknown | undefined | null;
  title?: string;
  message?: string;
}
const ErrorDialog = ({ error, title, message }: ErrorDialogProps) => {
  const lastError = useRef(error);

  const [open, setOpen] = useState(!!error);

  const formattedMessage = useMemo(() => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message ?? error.message ?? '문제를 파악하고 있습니다';
    }

    return `${error}`;
  }, [error]);

  useEffect(() => {
    if (lastError.current !== error) setOpen(true);
  }, [error]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      title={title ?? '오류가 발생하였습니다'}
      buttons={[
        {
          name: '닫기',
          onClick: () => setOpen(false),
        },
      ]}
    >
      {message ?? formattedMessage}
    </Dialog>
  );
};

export default ErrorDialog;
