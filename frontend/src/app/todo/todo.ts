import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

type Filter = 'all' | 'active' | 'done';

const STORAGE_KEY = 'todo-app.todos';

@Component({
  selector: 'app-todo',
  imports: [FormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
})
export class Todo {
  protected readonly newTitle = signal('');
  protected readonly filter = signal<Filter>('all');
  protected readonly todos = signal<TodoItem[]>(this.loadTodos());

  protected readonly filteredTodos = computed(() => {
    const todos = this.todos();
    switch (this.filter()) {
      case 'active':
        return todos.filter((t) => !t.done);
      case 'done':
        return todos.filter((t) => t.done);
      default:
        return todos;
    }
  });

  protected readonly remainingCount = computed(
    () => this.todos().filter((t) => !t.done).length,
  );

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos()));
    });
  }

  protected addTodo(): void {
    const title = this.newTitle().trim();
    if (!title) {
      return;
    }
    this.todos.update((todos) => [
      ...todos,
      { id: Date.now(), title, done: false },
    ]);
    this.newTitle.set('');
  }

  protected toggleTodo(id: number): void {
    this.todos.update((todos) =>
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  protected removeTodo(id: number): void {
    this.todos.update((todos) => todos.filter((t) => t.id !== id));
  }

  protected clearCompleted(): void {
    this.todos.update((todos) => todos.filter((t) => !t.done));
  }

  protected setFilter(filter: Filter): void {
    this.filter.set(filter);
  }

  private loadTodos(): TodoItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TodoItem[]) : [];
    } catch {
      return [];
    }
  }
}
