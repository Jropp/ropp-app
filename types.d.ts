declare global {
  type User = {
    id: number;
    name: string;
    email: string;
  };

  type AppEvents = {
    GLOBALS_UPDATED: "app:globals-updated";
    HASH_CHANGE: "app:hashchange";
    ROUTE_CHANGE: "app:routechange";
    URL_UPDATED: "URL_UPDATED";
    PAGE_LOAD: "load";
    TOAST: "toast-fired";
    SET_BACK_ARROW: "set-back-arrow";
  };

  type Todo = {
    id: number;
    text: string;
    completed: boolean;
  };

  type Person = {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: number;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    createdAt?: number;
    updatedAt?: number;
  };

  type Conversation = {
    id: number;
    personId: number;
    content: string;
    tags: string;
    createdAt: number;
    updatedAt: number;
  };

  type Paths = Record<string, string>;

  type Route = {
    id?: string;
    path?: string;
    pathRegexp?: RegExp;
    componentPath?: string;
    componentName?: string;
    isPublic?: boolean;
    showNav?: boolean;
    showHeader?: boolean;
    showHeaderQuickNav?: boolean;
    showBackArrow?: boolean;
    permissions?: any;
    children?: Record<string, Route>;
    backArrowLocation?: Route["path"];
  };

  type NewRouteContext = {
    params: ContextParams;
    path: string;
  };

  type RouteContainerComponent = HTMLElement & {
    routeEnter?: (arg0: RouteEnterArgs) => void;
    onGlobalsUpdate?: (arg0: any) => void;
    disconnectGlobals?: () => void;
  };

  type PermissionCheck = (arg0: PermissionParams) => Route | null;

  type PermissionParams = {
    sessionUser: SessionUser;
  };

  type RouteContext = {
    canonicalPath: string;
    hash: string;
    init: boolean;
    page: object;
    params: ContextParams;
    path: string;
    pathname: string;
    querystring: string;
    routePath: string;
    state: object;
    title: string;
  };

  type OptionalParams = {
    email?: string;
  };

  type RouteEnterArgs = {
    nextView: Route;
    context: RouteContext;
  };

  type ContextParams = OptionalParams & Record<string, any>;
}

export {};
