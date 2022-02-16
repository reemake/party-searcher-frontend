import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output} from '@angular/core';
import {Feature, Map, View} from 'ol';
import {Coordinate} from 'ol/coordinate';
import {defaults as DefaultControls, ScaleLine} from 'ol/control';
import proj4 from 'proj4';
import Projection from 'ol/proj/Projection';
import {register} from 'ol/proj/proj4';
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
    proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
    register(proj4);
    this.projection = GetProjection('EPSG:3857');
    this.projection.setExtent(this.extent);
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
    console.log("UPDATE POINTS ON MAP!!!!!" + JSON.stringify(events));
    let features: Array<any> = events.map(event => {
      let feature: any = new Feature({
        geometry: new Point(fromLonLat([event.location.lon, event.location.lat])),
      });

      feature.setStyle(new Style({
        image: new Icon(({
          crossOrigin: 'anonymous',
          src: 'assets/img/mapImages/landmark.png',
          imgSize: [2700, 3000]
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
  }


  /**
   * ОПРЕДЕЛИТЬ ГРАНИЦЫ КАРТЫ, КОТОРУЮ В ДАННЫЙ МОМЕНТ ВИДИТ ПОЛЬЗОВАТЕЛЬ.
   */
  private setMapBounds(): void {
    let extent: number[] | undefined = this.map?.getView().calculateExtent(this.map.getSize())
    if (extent != undefined) {
      let edgePoints: number[] = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
      this.mapBoundingBox = [[edgePoints[0], edgePoints[1]], [edgePoints[2], edgePoints[1]], [edgePoints[2], edgePoints[3]], [edgePoints[0], edgePoints[3]]];
      console.log(this.mapBoundingBox);
    }
  }


  private setUserLocation(): void {

    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Got position", position.coords);
      this.center = [position.coords.longitude, position.coords.latitude];
      this.userLocation = [position.coords.longitude, position.coords.latitude];
      if (this.map !== undefined)
        this.map.getView().setCenter(transform([this.center[0], this.center[1]], 'EPSG:4326', 'EPSG:3857'));
    }, () => {
    }, {enableHighAccuracy: true});
  }
}

