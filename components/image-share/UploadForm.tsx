/**
 * 图片上传表单组件
 */
'use client';

import { useState } from 'react';
import styles from '@/styles/image-share/UploadForm.module.css';

interface UploadFormProps {
  token: string;
  onUploadSuccess: () => void;
}

export default function UploadForm({ token, onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 生成预览
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage('请选择图片');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ 上传成功！');
        setFile(null);
        setPreview('');
        onUploadSuccess();

        // 重置表单
        const form = e.target as HTMLFormElement;
        form.reset();
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (err) {
      setMessage('❌ 上传失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>📤 上传图片</h2>

      {message && (
        <div className={message.startsWith('✅') ? styles.success : styles.error}>
          {message}
        </div>
      )}

      <div className={styles.uploadArea}>
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <label htmlFor="file" className={styles.fileLabel}>
          {preview ? (
            <img src={preview} alt="预览" className={styles.preview} />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.icon}>📷</span>
              <span>点击选择图片</span>
              <span className={styles.hint}>支持 jpg、png、gif、webp，最大 5MB</span>
            </div>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !file}
        className={styles.button}
      >
        {loading ? '上传中...' : '上传'}
      </button>
    </form>
  );
}
