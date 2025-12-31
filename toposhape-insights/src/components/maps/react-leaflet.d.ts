// Type declaration overrides for react-leaflet compatibility with React 18
// react-leaflet v5 expects React 19, but we're using React 18
// This file provides compatible type declarations

declare module 'react-leaflet' {
    import { ReactNode } from 'react';
    import * as L from 'leaflet';

    export interface MapContainerProps {
        center?: L.LatLngExpression;
        zoom?: number;
        children?: ReactNode;
        style?: React.CSSProperties;
        className?: string;
        [key: string]: any;
    }

    export interface TileLayerProps {
        url?: string;
        attribution?: string;
        [key: string]: any;
    }

    export interface CircleMarkerProps {
        center: L.LatLngExpression;
        radius?: number;
        pathOptions?: L.PathOptions;
        children?: ReactNode;
        [key: string]: any;
    }

    export interface CircleProps {
        center: L.LatLngExpression;
        radius?: number;
        pathOptions?: L.PathOptions;
        children?: ReactNode;
        [key: string]: any;
    }

    export interface PolylineProps {
        positions: L.LatLngExpression[];
        pathOptions?: L.PathOptions;
        [key: string]: any;
    }

    export interface GeoJSONProps {
        data: any;
        pointToLayer?: (feature: any, latlng: L.LatLng) => L.Layer;
        onEachFeature?: (feature: any, layer: L.Layer) => void;
        [key: string]: any;
    }

    export const MapContainer: React.FC<MapContainerProps>;
    export const TileLayer: React.FC<TileLayerProps>;
    export const CircleMarker: React.FC<CircleMarkerProps>;
    export const Circle: React.FC<CircleProps>;
    export const Polyline: React.FC<PolylineProps>;
    export const GeoJSON: React.FC<GeoJSONProps>;
    export const Popup: React.FC<{ children?: ReactNode }>;
}
