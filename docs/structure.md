```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── tables/           # Страницы с таблицами
│   │       ├── users/
│   │       ├── products/
│   │       └── orders/
│   └── api/                  # API роуты
│
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   ├── Table/           # Базовый компонент таблицы
│   │   │   ├── Table.tsx
│   │   │   ├── TableHeader.tsx
│   │   │   ├── TableBody.tsx
│   │   │   ├── TablePagination.tsx
│   │   │   └── TableSearch.tsx
│   │   └── other UI components...
│   │
│   ├── tables/              # Компоненты таблиц
│   │   ├── UsersTable/
│   │   │   ├── UsersTable.tsx
│   │   │   ├── columns.tsx      # Конфигурация колонок
│   │   │   └── filters.tsx      # Фильтры таблицы
│   │   ├── ProductsTable/
│   │   └── OrdersTable/
│   │
│   └── other components...
│
├── services/               # Сервисы для работы с API
│   ├── api/               # Базовая настройка API
│   │   ├── axios.ts      # Настройка axios
│   │   └── endpoints.ts  # Список эндпоинтов
│   │
│   ├── tables/           # Сервисы для каждой таблицы
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   │
│   └── types/            # Типы для данных с API
│       ├── users.ts
│       ├── products.ts
│       └── orders.ts
│
├── hooks/                # Хуки для работы с данными
│   └── tables/
│       ├── useTable.ts   # Общий хук для таблиц
│       ├── useUsers.ts
│       ├── useProducts.ts
│       └── useOrders.ts
│
├── lib/                 # Утилиты
│   ├── constants/
│   │   └── tables.ts    # Константы для таблиц
│   └── utils/
│       ├── api.ts       # Утилиты для работы с API
│       └── table.ts     # Утилиты для таблиц
│
└── config/
    └── api.ts          # Конфигурация API

```

### Пример реализации компонентов:

```typescript
// services/api/endpoints.ts
export const API_ENDPOINTS = {
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users/create",
    UPDATE: "/api/users/update",
    DELETE: "/api/users/delete",
  },
  PRODUCTS: {
    LIST: "/api/products",
    // ...другие эндпоинты
  },
  // ...другие группы эндпоинтов
};

// services/tables/users.ts
import { axiosInstance } from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import type { User, UserFilters } from "../types/users";

export const UserService = {
  getUsers: async (filters: UserFilters) => {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST, { params: filters });
    return response.data;
  },
  // другие методы...
};

// hooks/tables/useUsers.ts
import { useState, useEffect } from "react";
import { UserService } from "@/services/tables/users";
import type { User, UserFilters } from "@/services/types/users";

export const useUsers = (initialFilters: UserFilters) => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getUsers(filters);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return { data, loading, filters, setFilters, refetch: fetchUsers };
};

// components/tables/UsersTable/UsersTable.tsx
import { Table } from "@/components/ui/Table";
import { useUsers } from "@/hooks/tables/useUsers";
import { columns } from "./columns";
import { Filters } from "./filters";

export const UsersTable = () => {
  const { data, loading, filters, setFilters } = useUsers({ page: 1, limit: 10 });

  return (
    <div>
      <Filters filters={filters} onChange={setFilters} />
      <Table
        data={data}
        columns={columns}
        loading={loading}
        pagination={{
          total: data.total,
          current: filters.page,
          onChange: page => setFilters({ ...filters, page }),
        }}
      />
    </div>
  );
};
```

Основные преимущества:

1. Четкое разделение логики:

   - Компоненты отвечают только за отображение
   - Сервисы работают с API
   - Хуки управляют состоянием

2. Переиспользование кода:

   - Базовый компонент Table
   - Общие хуки и утилиты
   - Типизированные сервисы

3. Масштабируемость:

   - Легко добавлять новые таблицы
   - Простое управление эндпоинтами
   - Централизованная обработка ошибок

4. Удобство поддержки:
   - Изолированные компоненты
   - Типизация данных
   - Единый стиль работы с API

Хотите, чтобы я показал более детальный пример реализации какого-то конкретного компонента или сервиса?
