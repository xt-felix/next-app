/**
 * 后台管理页面
 * 路由：/admin
 * 知识点：
 * 1. JWT Token 存储与使用
 * 2. 受保护的页面（需要管理员权限）
 * 3. CRUD 操作（增删改查）
 * 4. 图片上传（Base64）
 * 5. 表单验证
 * 6. 乐观更新 UI
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
}

interface ApiResponse {
  code: number;
  message?: string;
  data?: any;
}

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/shop/login');
      return;
    }
    setToken(storedToken);
    fetchProducts(storedToken);
  }, [router]);

  // 获取商品列表
  const fetchProducts = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/products?limit=100');
      const json: ApiResponse = await res.json();
      if (json.code === 0 && json.data) {
        setProducts(json.data.items);
      }
    } catch (e) {
      alert('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 上传图片
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/v1/upload/image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ image: base64, filename: file.name }),
          });
          const json: ApiResponse = await res.json();
          if (json.code === 0 && json.data?.url) {
            resolve(json.data.url);
          } else {
            reject(new Error(json.message || '上传失败'));
          }
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 基础校验
    if (!formData.name || !formData.price) {
      alert('请填写商品名称和价格');
      return;
    }

    try {
      setUploading(true);

      // 如果有选择图片，先上传
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // 准备数据
      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || undefined,
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        image: imageUrl || undefined,
      };

      // 发送请求
      const url = '/api/v1/products/manage';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...data, id: editingId } : data;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json: ApiResponse = await res.json();

      if (json.code === 0) {
        alert(json.message || '操作成功');
        // 重新加载列表
        await fetchProducts(token);
        // 重置表单
        resetForm();
      } else {
        alert(json.message || '操作失败');
      }
    } catch (e: any) {
      alert(e.message || '操作失败');
    } finally {
      setUploading(false);
    }
  };

  // 删除商品
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个商品吗？')) return;

    try {
      const res = await fetch(`/api/v1/products/manage?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json: ApiResponse = await res.json();

      if (json.code === 0) {
        alert(json.message || '删除成功');
        await fetchProducts(token);
      } else {
        alert(json.message || '删除失败');
      }
    } catch (e) {
      alert('删除失败');
    }
  };

  // 编辑商品
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      stock: product.stock?.toString() || '',
      image: product.image || '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  // 重置表单
  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', stock: '', image: '' });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/shop/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">商品管理后台</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/shop')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                返回商城
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 添加商品按钮 */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? '取消' : '+ 添加商品'}
          </button>
        </div>

        {/* 添加/编辑表单 */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingId ? '编辑商品' : '添加商品'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    商品名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    价格 *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  库存
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  商品图片
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {(formData.image || imageFile) && (
                  <div className="mt-2 relative w-32 h-32">
                    <Image
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                      alt="预览"
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {uploading ? '处理中...' : editingId ? '保存修改' : '添加商品'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 商品列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  图片
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  价格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  库存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                          unoptimized
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ¥{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.stock || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
