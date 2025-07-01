export interface MarkerInfo {
  id?: number,
  coordinate: Coordinate;
  title: string;
  description: string | undefined;
  isFavorite?: boolean;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}
