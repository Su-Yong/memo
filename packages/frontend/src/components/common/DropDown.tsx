import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cx } from '../../utils/className';

export interface DropDownItem {
  id: string;
  name: string;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
}
export interface DropDownProps<T extends DropDownItem> {
  data: T[];
  children?: React.ReactNode;

  onClick?: (item: T) => void;
}

const DropDown = <T extends DropDownItem>({
  data,
  onClick,
  children,
}: DropDownProps<T>) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        {children}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="ease-out duration-100"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100"
        leave="ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 -translate-y-4"
      >
        <Menu.Items
          className={`
            absolute right-0 mt-2
            z-10
            min-w-[120px] origin-top-right rounded-lg bg-white dark:bg-black shadow-xl
          `}
        >
          {data.map((item) => (
            <Menu.Item key={item.id}>
              {({ active }) => (
                <button
                  className={cx(
                    'w-full flex justify-start items-center gap-2 rounded-md px-3 py-2 text-base',
                    'transition-colors duration-200 text-black dark:text-white',
                    active && 'bg-gray-200 dark:bg-gray-800',
                    !active && 'bg-gray-100 dark:bg-gray-900',
                    item.className,
                  )}
                  onClick={() => onClick?.(item)}
                >
                  <i className="material-symbols-outlined icon text-base">
                    {item.icon}
                  </i>
                  {item.name}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropDown;
