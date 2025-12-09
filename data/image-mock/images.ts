/**
 * 图片数据模拟
 * 用于演示 API Routes
 */

export interface ImageData {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadTime: string;
  url: string;
  uploader: string;
}

// 模拟图片数据库
let imagesDB: ImageData[] = [
  {
    id: '1',
    filename: 'sample-1.jpg',
    originalName: '风景照片.jpg',
    size: 1024000,
    mimeType: 'image/jpeg',
    uploadTime: new Date(Date.now() - 86400000).toISOString(),
    url: '/uploads/sample-1.jpg',
    uploader: 'admin',
  },
  {
    id: '2',
    filename: 'sample-2.png',
    originalName: '截图.png',
    size: 512000,
    mimeType: 'image/png',
    uploadTime: new Date(Date.now() - 43200000).toISOString(),
    url: '/uploads/sample-2.png',
    uploader: 'user',
  },
];

/**
 * 获取所有图片
 */
export function getAllImages(): ImageData[] {
  return imagesDB.sort((a, b) =>
    new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
  );
}

/**
 * 添加图片
 */
export function addImage(imageData: Omit<ImageData, 'id'>): ImageData {
  const newImage: ImageData = {
    id: Date.now().toString(),
    ...imageData,
  };

  imagesDB.push(newImage);
  return newImage;
}

/**
 * 根据ID获取图片
 */
export function getImageById(id: string): ImageData | undefined {
  return imagesDB.find(img => img.id === id);
}

/**
 * 删除图片
 */
export function deleteImage(id: string): boolean {
  const index = imagesDB.findIndex(img => img.id === id);
  if (index !== -1) {
    imagesDB.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
