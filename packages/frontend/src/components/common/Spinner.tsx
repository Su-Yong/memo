import { HTMLAttributes, useMemo } from 'react';
import { cx } from '../../utils/className';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  strokeWidth?: number;
}
const Spinner = ({
  strokeWidth = 2,
  ...props
}: SpinnerProps): JSX.Element => {
  const path = useMemo(() => {
    const width = strokeWidth / 2;

    return `M 12 ${width} A ${12 - width} ${12 - width} 0 1 1 ${width} 12`;
  }, [strokeWidth]);
  const dashLength = useMemo(() => 57.5 - strokeWidth * 2.5, [strokeWidth]);

  return (
    <div {...props} className={cx('flex justify-center items-center', props.className)}>
      <svg
        viewBox={'0 0 24 24'}
        xmlns={'http://www.w3.org/2000/svg'}
        className={'animate-spin duration-[1400ms]'}
        style={{
          width: props.style?.width,
          height: props.style?.height,
        }}
      >
        <path
          d={path}
          className={'spinner-shape'}
          style={{
            '--stroke-width': strokeWidth,
            '--dash-length': dashLength,
          }}
        />
      </svg>
    </div>
  )
};

export default Spinner;
