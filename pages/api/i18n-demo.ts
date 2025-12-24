import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API 国际化示例
 * 根据请求的 lang 参数返回不同语言的响应
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lang = 'zh' } = req.query;

  // 定义多语言错误消息
  const messages: Record<string, Record<string, string>> = {
    zh: {
      success: '操作成功',
      error: '操作失败',
      unauthorized: '未授权',
      notFound: '未找到资源',
    },
    en: {
      success: 'Operation successful',
      error: 'Operation failed',
      unauthorized: 'Unauthorized',
      notFound: 'Resource not found',
    },
    fr: {
      success: 'Opération réussie',
      error: 'Opération échouée',
      unauthorized: 'Non autorisé',
      notFound: 'Ressource introuvable',
    },
  };

  const langMessages = messages[lang as string] || messages.zh;

  // 模拟业务逻辑
  const { action } = req.query;

  if (action === 'success') {
    return res.status(200).json({ message: langMessages.success });
  }

  if (action === 'notfound') {
    return res.status(404).json({ error: langMessages.notFound });
  }

  return res.status(200).json({ message: langMessages.success });
}

