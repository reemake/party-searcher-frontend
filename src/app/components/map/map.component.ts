import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output} from '@angular/core';
import {Feature, Map as MyMap, View} from 'ol';
import {Coordinate} from 'ol/coordinate';
import {Control, defaults as DefaultControls, ScaleLine} from 'ol/control';
import Projection from 'ol/proj/Projection';
import {fromLonLat, get as GetProjection, transform, transformExtent} from 'ol/proj'
import {Extent} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {EventService} from "../../services/event.service";
import {Event} from "../../entity/Event/Event";
import {Point} from "ol/geom";
import {Icon, Style} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  /**
   * границы карты, которую в данный момент видит пользователь.Начиная с левой нижней и  далее против часовой стрелки
   */
  mapBoundingBox: Array<Coordinate> = [[]];
  map: MyMap | undefined;
  @Output() selectEvents: EventEmitter<Array<Event>> = new EventEmitter<Array<Event>>();

  _events: Event[] = [];

  public get events(): Event[] {
    return this._events;
  }

  @Input()
  public set events(events: Event[]) {
    this._events = events;
    this.updateEventsOnMap(this._events);
  }

  @Output() mapChanged: EventEmitter<Array<Coordinate>> = new EventEmitter<Array<Coordinate>>();
  @Output() mapReady = new EventEmitter<MyMap>();
  @Output() changeLocation = new EventEmitter<number[]>();
  @Output() callSearch = new EventEmitter<boolean>();
  @Input() center: Coordinate | undefined;
  @Input() zoom: number | undefined;
  view: View | undefined;
  projection: Projection | undefined;
  extent: Extent = [-20026376.39, -20048966.10, 20026376.39, 20048966.10];
  /**
   * [Lon,Lat] // https://cdn.britannica.com/04/64904-050-D2054D06/cutaway-drawing-latitude-place-longitude-sizes-angles.jpg
   * @private
   */
  private userLocation: Coordinate = [54, 54];
  private clickedLocation: number[] = [];
  private eventsMap: Map<Feature<any>, Event[]> = new Map<Feature<any>, Event[]>();
  private previousEventsMarkersLayer: VectorLayer<any> = new VectorLayer({});
  private previousCurrentUserLocationICON: VectorLayer<any> = new VectorLayer<any>();
  private previousClickedLocationICON: VectorLayer<any> = new VectorLayer<any>();

  constructor(private zone: NgZone, private cd: ChangeDetectorRef, private mapService: EventService) {
  }

  ngAfterViewInit(): void {
    if (!this.map) {
      this.zone.run(() => {
        this.initMap();
        this.setHandlers();
      });
    }
    setTimeout(() => this.mapReady.emit(this.map));
    this.setUserLocation();
    this.view?.on('change:center', () => {
      this.setMapBounds();
    });


  }

  public addLocationMarker(points: number[]): void {
    console.log("MARKER " + points);
    points = transform(points, 'EPSG:4326', 'EPSG:3857')
    let feature: any = new Feature({
      geometry: new Point(fromLonLat(points, 'EPSG:4326'))
    });


    feature.setStyle(new Style({
      image: new Icon(({
        crossOrigin: 'anonymous',
        src: '../assets/img/mapImages/clicked-locationICON.png'
      }))
    }));

    this.map?.removeLayer(this.previousClickedLocationICON);

    let vectorSource: VectorSource<any> = new VectorSource({
      features: [feature]
    });
    this.previousClickedLocationICON = new VectorLayer<any>({
      source: vectorSource
    });

    this.map?.addLayer(this.previousClickedLocationICON);
  }

  private initMap(): void {
    this.projection = GetProjection('EPSG:3857');
    this.view = new View({
      center: this.center,
      zoom: this.zoom,
      projection: this.projection,
    });
    this.map = new MyMap({
      layers: [new TileLayer({
        source: new OSM({})
      })],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({})
      ])
    });

    let buttonElement: any = document.createElement('button');
    buttonElement.innerHTML = ' <img alt="определить локацию" src="./assets/img/mapImages/getLocation.png"/>';
    buttonElement.addEventListener('click', () => {
      this.setUserLocation();
    })
    let control = new Control({element: buttonElement});
    this.map.addControl(control);

    let buttonSearchElement: any = document.createElement('button');
    buttonSearchElement.innerHTML = ' <img alt="поиск" src="./assets/img/mapImages/search-btn.png"/>';
    buttonSearchElement.addEventListener('click', () => {
      this.callSearch.emit(true);
    })
    let searchControl = new Control({element: buttonSearchElement});
    this.map.addControl(searchControl);
  }

  private setHandlers(): void {
    this.map?.on('click', (evt) => {
      var lonlat = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
      var lon = lonlat[0];
      var lat = lonlat[1];

      this.addLocationMarker(lonlat);

      this.changeLocation.emit([lon, lat]);

      let arr: Array<Event> = [];
      this.previousEventsMarkersLayer.getFeatures(evt.pixel).then(value => {
        value.forEach(e => {
          if (this.eventsMap.get(e) !== undefined) {
            this.eventsMap.get(e)?.map(e => {
              arr.push(e);
            })
          }
        })
        if (arr.length > 0)
          this.selectEvents.emit(arr);
      });

    })
  }

  /**
   * ОПРЕДЕЛИТЬ ГРАНИЦЫ КАРТЫ, КОТОРУЮ В ДАННЫЙ МОМЕНТ ВИДИТ ПОЛЬЗОВАТЕЛЬ.
   */
  private setMapBounds(): void {
    let extent: number[] | undefined = this.map?.getView().calculateExtent(this.map.getSize())
    if (extent != undefined) {
      let edgePoints: number[] = transformExtent(extent, 'EPSG:3857', 'EPSG:3857');
      this.mapBoundingBox = [[edgePoints[0], edgePoints[1]], [edgePoints[2], edgePoints[1]], [edgePoints[2], edgePoints[3]], [edgePoints[0], edgePoints[3]]];
//      console.log(this.mapBoundingBox);
    }
  }

  private updateEventsOnMap(events: Array<Event>): void {
    let features: Array<any> = events.map(event => {
      if (event.location) {
        let feature: any = new Feature({
          geometry: new Point(fromLonLat([event.location.location.coordinates[0], event.location.location.coordinates[1]], 'EPSG:3857')),
          event: event
        });


        feature.setStyle(new Style({
          image: new Icon(({
            crossOrigin: 'anonymous',
            src: '../assets/img/mapImages/landmark.png',
            imgSize: [27, 30]
          }))
        }));

        if (this.eventsMap.get(feature) === undefined) {
          let arr: Array<Event> = new Array<Event>(event);
          this.eventsMap.set(feature, arr);
        } else {
          this.eventsMap.get(feature)?.push(event);
        }
        return feature;
      }
    });

    this.map?.removeLayer(this.previousEventsMarkersLayer);

    let vectorSource: VectorSource<any> = new VectorSource({
      features: features
    });
    this.previousEventsMarkersLayer = new VectorLayer<any>({
      source: vectorSource
    });

    this.map?.addLayer(this.previousEventsMarkersLayer);
  }

  private setUserLocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = [position.coords.longitude, position.coords.latitude];
      this.userLocation = [position.coords.longitude, position.coords.latitude];
      if (this.map !== undefined)
        this.map.getView().setCenter(transform([this.center[0], this.center[1]], 'EPSG:4326', 'EPSG:3857'));

      this.printLocationMarker();

      this.changeLocation.emit(this.userLocation);
    }, () => {
    }, {enableHighAccuracy: true});
  }

  private printLocationMarker(): void {
    let feature: any = new Feature({
      geometry: new Point(transform([this.userLocation[0], this.userLocation[1]], 'EPSG:4326', 'EPSG:3857'))
    });


    feature.setStyle(new Style({
      image: new Icon(({
        crossOrigin: 'anonymous',
        src: '../assets/img/mapImages/currentPosition.png'
      }))
    }));

    this.map?.removeLayer(this.previousCurrentUserLocationICON);

    let vectorSource: VectorSource<any> = new VectorSource({
      features: [feature]
    });
    this.previousCurrentUserLocationICON = new VectorLayer<any>({
      source: vectorSource
    });

    this.map?.addLayer(this.previousCurrentUserLocationICON);
  }


}

