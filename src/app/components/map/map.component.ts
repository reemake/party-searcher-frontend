import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output} from '@angular/core';
import {Feature, Map, View} from 'ol';
import {Coordinate} from 'ol/coordinate';
import {defaults as DefaultControls, ScaleLine} from 'ol/control';
import Projection from 'ol/proj/Projection';
import {fromLonLat, get as GetProjection, transform, transformExtent} from 'ol/proj'
import {Extent} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {EventService} from "../../services/event.service";
import {Event} from "../../entity/Event/Event";
import {asyncScheduler, Observable, scheduled} from "rxjs";
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
  map: Map | undefined;
  private eventsArray: Array<Event> = new Array<Event>();

  @Input() events: Observable<Event[]> = scheduled([], asyncScheduler);
  @Output() mapChanged: EventEmitter<Array<Coordinate>> = new EventEmitter<Array<Coordinate>>();
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

  @Output() mapReady = new EventEmitter<Map>();
  private previousLayer: VectorLayer<any> = new VectorLayer({});

  constructor(private zone: NgZone, private cd: ChangeDetectorRef, private mapService: EventService) {
  }

  ngAfterViewInit(): void {
    if (!this.map) {
      this.zone.runOutsideAngular(() => this.initMap());
    }
    setTimeout(() => this.mapReady.emit(this.map));
    this.setUserLocation();
    this.view?.on('change:center', () => {
      this.setMapBounds();
    });
  }

  private initMap(): void {
    this.projection = GetProjection('EPSG:3857');
    this.view = new View({
      center: this.center,
      zoom: this.zoom,
      projection: this.projection,
    });
    this.map = new Map({
      layers: [new TileLayer({
        source: new OSM({})
      })],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({})
      ])
    });
    this.events.subscribe(events => this.updateEventsOnMap(events));

  }

  private updateEventsOnMap(events: Array<Event>): void {

    this.eventsArray = events;
    let features: Array<any> = events.map(event => {
      let feature: any = new Feature({
        geometry: new Point(fromLonLat([event.location.lon, event.location.lat], 'EPSG:3857'))
      });

      feature.setStyle(new Style({
        image: new Icon(({
          crossOrigin: 'anonymous',
          src: '../assets/img/mapImages/landmark.png',
          imgSize: [27, 30]
        }))
      }));

      return feature;
    });

    this.map?.removeLayer(this.previousLayer);

    let vectorSource: VectorSource<any> = new VectorSource({
      features: features
    });
    this.previousLayer = new VectorLayer<any>({
      source: vectorSource
    });

    this.map?.addLayer(this.previousLayer);


    this.map?.on("click", (evt: any) => {
      let lonlat = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
      let lon = lonlat[0];
      let lat = lonlat[1];
      let coordinate = fromLonLat([lon, lat]);
      console.log(coordinate);
      this.eventsArray.map(e => {
        let coor = fromLonLat([e.location.lon, e.location.lat]);
        console.log("evets coord " + coor);
        e.location.lon = coor[0];
        e.location.lat = coor[1];
        return e;
      })
        .filter(e => {
          this.checkPointInCycle(e.location.lon, e.location.lat, lon, lat);
        })
        .forEach(e => {
          console.log("you click on" + e);
        })
    });
  }


  private checkPointInCycle(x: number, y: number, x1: number, y1: number): boolean {
    let R: number = 10000;
    return (Math.pow(x - x1, 2) + Math.pow(y - y1, 2)) <= R * R;
  }


  /**
   * ОПРЕДЕЛИТЬ ГРАНИЦЫ КАРТЫ, КОТОРУЮ В ДАННЫЙ МОМЕНТ ВИДИТ ПОЛЬЗОВАТЕЛЬ.
   */
  private setMapBounds(): void {
    let extent: number[] | undefined = this.map?.getView().calculateExtent(this.map.getSize())
    if (extent != undefined) {
      let edgePoints: number[] = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
      this.mapBoundingBox = [[edgePoints[0], edgePoints[1]], [edgePoints[2], edgePoints[1]], [edgePoints[2], edgePoints[3]], [edgePoints[0], edgePoints[3]]];
//      console.log(this.mapBoundingBox);
    }
  }


  private setUserLocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = [position.coords.longitude, position.coords.latitude];
      this.userLocation = [position.coords.longitude, position.coords.latitude];
      if (this.map !== undefined)
        this.map.getView().setCenter(transform([this.center[0], this.center[1]], 'EPSG:4326', 'EPSG:3857'));
    }, () => {
    }, {enableHighAccuracy: true});
  }
}

