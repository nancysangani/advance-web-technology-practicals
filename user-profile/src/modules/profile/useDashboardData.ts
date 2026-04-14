import { useCallback, useEffect, useState } from "react";
import type { Activity, DashboardData } from "./types";

export interface InsightMeta {
  target: string;
  source: "profile" | "posts" | "todos";
}

export interface DashboardUserOption {
  id: number;
  label: string;
}

export type DynamicDashboardData = DashboardData<string, InsightMeta>;

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  company?: {
    title?: string;
    department?: string;
  };
  address?: {
    city?: string;
    state?: string;
  };
  email?: string;
}

interface DummyPost {
  id: number;
  title: string;
  tags: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
}

interface DummyTodo {
  id: number;
  todo: string;
  completed: boolean;
}

interface PostsResponse {
  posts: DummyPost[];
}

interface TodosResponse {
  todos: DummyTodo[];
}

interface UsersResponse {
  users: DummyUser[];
}

interface HookState {
  data: DynamicDashboardData | null;
  isLoading: boolean;
  error: string | null;
}

interface UserOptionsState {
  users: DashboardUserOption[];
  isLoading: boolean;
  error: string | null;
}

const BASE_URL = "https://dummyjson.com";

function toStatus(completed: boolean): Activity["status"] {
  return completed ? "completed" : "in-progress";
}

function mapToDashboardData(
  user: DummyUser,
  posts: DummyPost[],
  todos: DummyTodo[],
): DynamicDashboardData {
  const fullName = `${user.firstName} ${user.lastName}`;
  const likesTotal = posts.reduce(
    (sum, post) => sum + (post.reactions?.likes ?? 0),
    0,
  );
  const dislikesTotal = posts.reduce(
    (sum, post) => sum + (post.reactions?.dislikes ?? 0),
    0,
  );
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const completion = Math.max(
    45,
    Math.min(
      98,
      Math.round(
        55 +
          (completedTodos / Math.max(todos.length, 1)) * 30 +
          Math.min(posts.length, 5) * 3,
      ),
    ),
  );

  const tags = Array.from(
    new Set(posts.flatMap((post) => post.tags).filter((tag) => Boolean(tag))),
  ).slice(0, 6);

  const activities: Activity[] = todos.slice(0, 5).map((todo, index) => {
    const sourcePost = posts[index % Math.max(posts.length, 1)];
    const summaryTag = sourcePost?.tags[0] ?? "general";

    return {
      id: `todo_${todo.id}`,
      title: todo.todo,
      summary: `Related focus: ${summaryTag}. Synced from task stream.`,
      time: `${index + 1}h ago`,
      status: toStatus(todo.completed),
    };
  });

  return {
    profile: {
      id: `u_${user.id}`,
      fullName,
      role: user.company?.title ?? "Product Specialist",
      location: `${user.address?.city ?? "Unknown City"}, ${user.address?.state ?? "Unknown State"}`,
      bio: `${fullName} balances delivery speed with quality and observability in production workflows.`,
      avatarUrl: user.image,
      completion,
      tags: tags.length > 0 ? tags : ["product", "delivery", "quality"],
    },
    insights: [
      {
        id: "insight_engagement",
        label: "Engagement Score",
        value: `${Math.min(99, 70 + Math.round(likesTotal / Math.max(posts.length, 1)))} / 100`,
        delta: Number(
          (
            (likesTotal / Math.max(dislikesTotal + likesTotal, 1)) * 12 -
            3
          ).toFixed(1),
        ),
        meta: { target: "82+", source: "posts" },
      },
      {
        id: "insight_task_completion",
        label: "Task Completion",
        value: `${completedTodos}/${todos.length}`,
        delta: Number(
          ((completedTodos / Math.max(todos.length, 1)) * 10 - 2).toFixed(1),
        ),
        meta: { target: "80%+", source: "todos" },
      },
      {
        id: "insight_reaction_avg",
        label: "Avg Likes per Post",
        value: Number((likesTotal / Math.max(posts.length, 1)).toFixed(1)),
        delta: Number(
          (6 - dislikesTotal / Math.max(posts.length, 1)).toFixed(1),
        ),
        meta: {
          target: "5.0+",
          source: "profile",
        },
      },
    ],
    activities,
  };
}

async function requestJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function useDashboardData(userId = 1) {
  const [state, setState] = useState<HookState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(() => {
    const controller = new AbortController();

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    Promise.all([
      requestJson<DummyUser>(`${BASE_URL}/users/${userId}`, controller.signal),
      requestJson<PostsResponse>(
        `${BASE_URL}/posts/user/${userId}?limit=6`,
        controller.signal,
      ),
      requestJson<TodosResponse>(
        `${BASE_URL}/todos/user/${userId}?limit=8`,
        controller.signal,
      ),
    ])
      .then(([user, postsResponse, todosResponse]) => {
        const mapped = mapToDashboardData(
          user,
          postsResponse.posts,
          todosResponse.todos,
        );
        setState({ data: mapped, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          data: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load dashboard data.",
        });
      });

    return () => controller.abort();
  }, [userId]);

  useEffect(() => {
    const abort = fetchData();
    return abort;
  }, [fetchData]);

  return {
    ...state,
    refresh: fetchData,
  };
}

export function useDashboardUsers(limit = 10) {
  const [state, setState] = useState<UserOptionsState>({
    users: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    requestJson<UsersResponse>(
      `${BASE_URL}/users?limit=${limit}&select=id,firstName,lastName`,
      controller.signal,
    )
      .then((response) => {
        const users = response.users.map((user) => ({
          id: user.id,
          label: `${user.firstName} ${user.lastName}`,
        }));

        setState({ users, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setState({
          users: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load user options.",
        });
      });

    return () => controller.abort();
  }, [limit]);

  return state;
}
