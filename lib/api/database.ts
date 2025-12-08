/**
 * 数据库模拟（内存存储）
 * 知识点：数据访问层（DAO）的设计模式
 * 说明：生产环境应替换为真实数据库（如 Prisma、TypeORM）
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  username: string;
  password: string; // 生产环境应加密存储
  role: 'user' | 'admin';
  email?: string;
  createdAt: Date;
}

// 模拟数据库
class Database {
  private products: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 7999,
      description: '最新款 iPhone，配备 A17 Pro 芯片',
      image: 'https://picsum.photos/seed/iphone/400/300',
      stock: 50,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: 'MacBook Pro 16',
      price: 19999,
      description: '强大的专业笔记本，M3 Max 芯片',
      image: 'https://picsum.photos/seed/macbook/400/300',
      stock: 30,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      price: 1899,
      description: '主动降噪无线耳机',
      image: 'https://picsum.photos/seed/airpods/400/300',
      stock: 100,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];

  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123', // 实际应用需加密
      role: 'admin',
      email: 'admin@example.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      role: 'user',
      email: 'user@example.com',
      createdAt: new Date('2024-01-01'),
    },
  ];

  private nextProductId = 4;
  private nextUserId = 3;

  // ========== 商品相关操作 ==========

  getAllProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductsPaginated(page: number, limit: number): { items: Product[]; total: number } {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      items: this.products.slice(start, end),
      total: this.products.length,
    };
  }

  createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const product: Product = {
      ...data,
      id: this.nextProductId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  updateProduct(id: number, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Product | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.products[index];
  }

  deleteProduct(id: number): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  searchProducts(keyword: string): Product[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerKeyword) ||
        p.description?.toLowerCase().includes(lowerKeyword)
    );
  }

  // ========== 用户相关操作 ==========

  getUserByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }

  getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(data: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      ...data,
      id: this.nextUserId++,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}

// 单例模式，全局共享数据库实例
export const db = new Database();
