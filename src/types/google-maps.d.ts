
// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setMapTypeId(mapTypeId: string): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      panBy(x: number, y: number): void;
      getBounds(): LatLngBounds;
      getCenter(): LatLng;
      getZoom(): number;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
      setAnimation(animation: any): void;
      setIcon(icon: string | Icon | Symbol): void;
      setTitle(title: string): void;
      getPosition(): LatLng;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toString(): string;
      toJSON(): LatLngLiteral;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      contains(latLng: LatLng | LatLngLiteral): boolean;
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toString(): string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      gestureHandling?: string;
      clickableIcons?: boolean;
      scrollwheel?: boolean;
      styles?: MapTypeStyle[];
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers: MapTypeStyler[];
    }

    interface MapTypeStyler {
      [key: string]: string | number | boolean;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      label?: string | MarkerLabel;
      draggable?: boolean;
      animation?: any;
      visible?: boolean;
      zIndex?: number;
    }

    interface Icon {
      url?: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
      path?: string;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      scale?: number;
    }

    interface Symbol {
      path: string | SymbolPath;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      scale?: number;
    }

    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
      FORWARD_OPEN_ARROW = 2,
      BACKWARD_CLOSED_ARROW = 3,
      BACKWARD_OPEN_ARROW = 4
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
    }

    namespace event {
      function addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      function addDomListener(instance: Element, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
      function removeListener(listener: MapsEventListener): void;
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace MapTypeId {
      const ROADMAP: string;
      const SATELLITE: string;
      const HYBRID: string;
      const TERRAIN: string;
    }

    namespace Animation {
      const DROP: number;
      const BOUNCE: number;
    }

    interface InfoWindowOptions {
      content?: string | Element;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
      pixelOffset?: Size;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
      close(): void;
      setContent(content: string | Element): void;
      setPosition(position: LatLng | LatLngLiteral): void;
    }

    class ControlPosition {
      static TOP_LEFT: number;
      static TOP_CENTER: number;
      static TOP_RIGHT: number;
      static LEFT_TOP: number;
      static LEFT_CENTER: number;
      static LEFT_BOTTOM: number;
      static BOTTOM_LEFT: number;
      static BOTTOM_CENTER: number;
      static BOTTOM_RIGHT: number;
      static RIGHT_TOP: number;
      static RIGHT_CENTER: number;
      static RIGHT_BOTTOM: number;
    }
  }
}

