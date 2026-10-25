import { useCallback, useEffect, useSyncExternalStore } from "react";
import apiClient from "@/services/http";

/** 项目后端的分类/标签记录 */
export interface ProjectTerm {
  id: number;
  name: string;
}

/** 编辑器术语面板使用的术语结构 */
export interface EditorTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  count: number;
}

export type TermSlug = "category" | "post_tag";

interface TermAdapter {
  list(slug: TermSlug): Promise<ProjectTerm[]>;
  create(slug: TermSlug, name: string): Promise<ProjectTerm>;
}

const LIST_PATH: Record<TermSlug, string> = {
  category: "/category",
  post_tag: "/tag",
};

const CREATE_PATH: Record<TermSlug, string> = {
  category: "/admin/category",
  post_tag: "/admin/tag",
};

const goTermAdapter: TermAdapter = {
  list(slug) {
    return apiClient.get<unknown, ProjectTerm[]>(LIST_PATH[slug]);
  },
  create(slug, name) {
    return apiClient.post<unknown, ProjectTerm>(CREATE_PATH[slug], { name });
  },
};

let activeAdapter: TermAdapter | null = null;

/** 启动接入后端的编辑器时启用项目术语数据源；示例页不安装时继续使用 mock */
export function installProjectTermAdapter() {
  activeAdapter = goTermAdapter;
}

export function getProjectTermAdapter() {
  return activeAdapter;
}

function toEditorTerm(term: ProjectTerm, slug: TermSlug): EditorTerm {
  return {
    id: term.id,
    name: term.name,
    slug: term.name,
    taxonomy: slug,
    parent: 0,
    count: 0,
  };
}

export interface TermState {
  terms: EditorTerm[];
  loading: boolean;
  loaded: boolean;
}

const EMPTY_STATE: TermState = { terms: [], loading: false, loaded: false };
const states = new Map<TermSlug, TermState>();
const pending = new Map<TermSlug, Promise<TermState>>();
const listeners = new Map<TermSlug, Set<() => void>>();

function snapshot(slug: TermSlug): TermState {
  return states.get(slug) ?? EMPTY_STATE;
}

function publish(slug: TermSlug, state: TermState) {
  states.set(slug, state);
  listeners.get(slug)?.forEach((listener) => listener());
}

function subscribe(slug: TermSlug, listener: () => void) {
  let set = listeners.get(slug);
  if (!set) {
    set = new Set();
    listeners.set(slug, set);
  }
  set.add(listener);
  return () => {
    set.delete(listener);
  };
}

/** 订阅术语列表；未安装项目数据源时返回 null，由调用方回退到 core-data */
export function useProjectTerms(slug: TermSlug): TermState | null {
  const enabled = activeAdapter !== null;
  const subscribeToSlug = useCallback(
    (listener: () => void) => (enabled ? subscribe(slug, listener) : () => {}),
    [enabled, slug],
  );
  const state = useSyncExternalStore(
    subscribeToSlug,
    () => snapshot(slug),
    () => EMPTY_STATE,
  );

  useEffect(() => {
    if (!enabled) return;
    load(slug).catch(() => {
      // 加载失败时保持空列表，用户仍可在面板内重试创建
    });
  }, [enabled, slug]);

  return enabled ? state : null;
}

function load(slug: TermSlug): Promise<TermState> {
  const cached = states.get(slug);
  if (cached?.loaded) return Promise.resolve(cached);
  const existing = pending.get(slug);
  if (existing) return existing;
  const adapter = activeAdapter;
  if (!adapter) return Promise.resolve(snapshot(slug));

  publish(slug, { ...snapshot(slug), loading: true });
  const request = adapter
    .list(slug)
    .then((items) => {
      const state = {
        terms: items.map((item) => toEditorTerm(item, slug)),
        loading: false,
        loaded: true,
      };
      publish(slug, state);
      return state;
    })
    .catch((error: unknown) => {
      publish(slug, { ...snapshot(slug), loading: false });
      throw error;
    })
    .finally(() => {
      pending.delete(slug);
    });
  pending.set(slug, request);
  return request;
}

/** 读取术语列表，首次调用时加载并缓存 */
export function searchProjectTerms(
  slug: TermSlug,
  search: string,
): Promise<EditorTerm[]> {
  return load(slug).then((state) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return state.terms;
    return state.terms.filter((term) =>
      term.name.toLowerCase().includes(keyword),
    );
  });
}

/** 创建术语；后端同名时会返回已有记录 */
export async function createProjectTerm(
  slug: TermSlug,
  name: string,
): Promise<EditorTerm> {
  const adapter = activeAdapter;
  if (!adapter) {
    throw new Error("术语数据源尚未初始化");
  }
  const term = toEditorTerm(await adapter.create(slug, name.trim()), slug);
  const state = snapshot(slug);
  if (!state.terms.some((item) => item.id === term.id)) {
    publish(slug, { ...state, terms: [...state.terms, term] });
  }
  return term;
}
