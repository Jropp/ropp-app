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

  type FlightSearchMetadata = {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_flights_url: string;
    raw_html_file: string;
    prettify_html_file: string;
    total_time_taken: number;
  };

  type FlightSearchParameters = {
    engine: string;
    hl: string;
    gl: string;
    departure_id: string;
    arrival_id: string;
    outbound_date: string;
    return_date: string;
    currency: string;
  };

  type Airport = {
    name: string;
    id: string;
    time: string;
  };

  type Flight = {
    departure_airport: Airport;
    arrival_airport: Airport;
    duration: number;
    airplane: string;
    airline: string;
    airline_logo: string;
    travel_class: string;
    flight_number: string;
    ticket_also_sold_by?: string[];
    legroom: string;
    extensions: string[];
    often_delayed_by_over_30_min?: boolean;
  };

  type FlightLayover = {
    duration: number;
    name: string;
    id: string;
  };

  type CarbonEmissions = {
    this_flight: number;
    typical_for_this_route: number;
    difference_percent: number;
  };

  type FlightOption = {
    flights: Flight[];
    layovers: Layover[];
    total_duration: number;
    carbon_emissions: CarbonEmissions;
    price: number;
    type: string;
    airline_logo: string;
    extensions: string[];
    departure_token: string;
  };

  type FlightSearchResponse = {
    search_metadata: FlightSearchMetadata;
    search_parameters: FlightSearchParameters;
    best_flights: FlightOption[];
    other_flights: FlightOption[];
  };

  type FlightSearchParams = {
    engine: string;
    departure_id: string;
    arrival_id: string;
    outbound_date: string;
    return_date: string;
    currency: string;
    max_price?: string;
    hl: string;
    type?: string;
    travel_class?: string;
    adults?: string;
    children?: string;
    stops?: string;
    api_key: string;
  };
}

export {};
