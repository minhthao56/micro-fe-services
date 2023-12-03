export type ParamsAddress = {
  lat: string;
  long: string;
  formattedAddress: string;
  displayName: string;
};


export type Pagination = {
  page: number;
  rowsPerPage?: number;
  mode: "refreshing" | "loading" | "loadMore";
}

export type ModeFetch = "refreshing" | "loading" | "loadMore" | "done";