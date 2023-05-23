import { Transition, Dialog as BaseDialog } from '@headlessui/react';
import { Fragment } from 'react';
import { cl } from '../../utils/className';

export interface DialogButton {
  type?: 'positive' | 'negative' | 'default';
  name: string;
  icon?: string;
  onClick?: () => void;
}
export interface DialogProps {
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
  onClose: (value: boolean) => void;
  buttons?: DialogButton[];
}
const Dialog = ({
  title,
  children,
  open,
  onClose,
  buttons,
}: DialogProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <BaseDialog onClose={onClose} className={'relative z-10'}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0 -translate-y-4"
            >
              <BaseDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-5 text-left align-middle transition-all">
                <BaseDialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </BaseDialog.Title>
                <BaseDialog.Description>
                  {children}
                </BaseDialog.Description>
                {buttons && (
                  <div className={'flex flex-row justify-end items-center gap-2'}>
                    {
                      buttons?.map((button) => (
                        <button
                          className={cl({
                            'btn-primary': button.type === 'positive',
                            'btn-error': button.type === 'negative',
                            'btn-text': (button.type ?? 'default') === 'default',
                            'font-normal': (button.type ?? 'default') === 'default',
                          })}
                          onClick={button.onClick}
                        >
                          {button.icon && (
                            <i className={'material-symbols-outlined icon flex'}>
                              {button.icon}
                            </i>
                          )}
                          {button.name}
                        </button>
                      ))
                    }
                  </div>
                )}
              </BaseDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </BaseDialog>
    </Transition>
  );
};

export default Dialog;
