import { getTodos } from '../actions';
import { DeleteButton } from './DeleteButton';
import { ToggleButton } from './ToggleButton';

/**
 * 待办事项列表组件（服务端组件）
 * 演示：RSC + Server Actions 的协作
 */
export default async function TodoList() {
  const todos = await getTodos();

  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        暂无待办事项，快来添加一个吧！
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 border rounded-lg">
      {todos.map(todo => (
        <li
          key={todo.id}
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <ToggleButton id={todo.id} completed={todo.completed} />
            <span
              className={`flex-1 ${
                todo.completed
                  ? 'line-through text-gray-400'
                  : 'text-gray-900'
              }`}
            >
              {todo.title}
            </span>
          </div>
          <DeleteButton id={todo.id} />
        </li>
      ))}
    </ul>
  );
}
