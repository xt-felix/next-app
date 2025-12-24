import React from 'react';

interface SpacingProps {
  size?: number | string;
  flex?: boolean;
  direction?: 'row' | 'column';
  gap?: number | string;
  children?: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

/**
 * Spacing 组件用于替代 CSS flex 布局
 * 满足用户 "flex布局不要写css样式，直接使用Spcing组件" 的需求
 */
export const Spacing: React.FC<SpacingProps> = ({
  size,
  flex = false,
  direction = 'column',
  gap,
  children,
  className = '',
  align = 'stretch',
  justify = 'start',
}) => {
  const style: React.CSSProperties = {};

  if (size) {
    if (direction === 'row') style.width = size;
    else style.height = size;
  }

  if (flex) {
    style.display = 'flex';
    style.flexDirection = direction;
    if (gap) style.gap = typeof gap === 'number' ? `${gap}px` : gap;
    
    // 映射对齐属性
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      baseline: 'baseline',
      stretch: 'stretch',
    };
    
    const justifyMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };

    style.alignItems = alignMap[align];
    style.justifyContent = justifyMap[justify];
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default Spacing;

