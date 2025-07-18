import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface LoadingAnimationProps {
  /** 加载动画大小 */
  size?: number;
  /** 加载动画颜色 */
  color?: string;
  /** 额外的CSS类名 */
  className?: string;
  /** 是否为内联模式（不占据整行空间） */
  inline?: boolean;
  /** 加载文本 */
  text?: string;
}

/**
 * 通用加载动画组件
 * 使用lucide-react的Loader2图标实现旋转动画
 */
export function LoadingAnimation({
  size = 24,
  color = 'currentColor',
  className = '',
  inline = false,
  text,
}: LoadingAnimationProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        inline ? 'inline-flex' : 'flex-col w-full',
        className
      )}
    >
      <Loader2
        size={size}
        color={color}
        className="animate-spin"
        aria-label="Loading"
      />
      {text && (
        <span
          className={cn(
            'ml-2 text-sm text-muted-foreground',
            inline ? '' : 'mt-2'
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * 页面级全屏加载组件
 */
export function FullPageLoading({
  size = 48,
  color = 'primary',
  text = 'Loading...',
}: Omit<LoadingAnimationProps, 'inline'>) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <LoadingAnimation size={size} color={color} text={text} />
    </div>
  );
}