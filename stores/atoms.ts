import { atom } from 'recoil';

/**
 * Recoil 原子化状态
 * 
 * Recoil 的特点：
 * 1. 原子化设计，状态可以组合
 * 2. 按需订阅，性能优秀
 * 3. 支持异步状态和副作用
 * 4. 适合复杂组件树
 */

// 计数器原子
export const counterAtom = atom<number>({
  key: 'counter',
  default: 0,
});

// 用户信息原子
export const userAtom = atom<{
  name: string;
  role: string;
}>({
  key: 'user',
  default: {
    name: '',
    role: '',
  },
});

