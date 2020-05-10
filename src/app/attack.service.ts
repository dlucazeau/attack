import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import * as L from 'leaflet';

import { AttackWss, Attack } from './attack';
import { SecuConstants } from './secu.constants';

@Injectable({
    providedIn: 'root'
})
export class AttackService
{
    private static dstCoord: L.LatLng = L.latLng(SecuConstants.HqLat, SecuConstants.HqLng);
    private dstPoint: L.Point;
    private myWebSocket: WebSocketSubject<AttackWss>;
    private sub: Subscription;
    private map: L.Map;

    constructor()
    {
        this.myWebSocket = webSocket('wss://preview.antemeta.net/api/security/websocket?showAll=true');
    }

    connect (m: L.Map)
    {
        this.map = m;
        this.pinDestination();

        this.sub = this.myWebSocket
            .pipe(
                map(Attack.mapperFromWss),
                take(10),
                tap((a: Attack) =>
                {
                    const srcCoord: L.LatLng = L.latLng(a.src_geo.lat, a.src_geo.lng);
                    // const srcPoint = this.map.project(srcCoord, SecuConstants.ZoomLevel);

                    L.circleMarker(srcCoord, { radius: 2, color: a.color }).addTo(this.map);
                    this.drawBezierPath(srcCoord, AttackService.dstCoord, a.color, a.src_port % 2 === 0);
                })
            )
            .subscribe();
    }

    disconnect ()
    {
        this.sub.unsubscribe();
    }

    private pinDestination ()
    {
        // const point1 = this.map.latLngToLayerPoint(AttackService.dstCoord);
        // const latLng1 = this.map.layerPointToLatLng(point1);

        // Meilleure solution
        this.dstPoint = this.map.project(AttackService.dstCoord, SecuConstants.ZoomLevel);
        // const latLng2: L.LatLng = this.map.unproject(this.dstPoint, SecuConstants.ZoomLevel);

        console.debug({ dst: AttackService.dstCoord });

        // console.debug({ p1: point1, l1: latLng1, p2: point2, l2: latLng2});

        L.circleMarker(AttackService.dstCoord, { radius: 2, color: '#000000' }).addTo(this.map);
    }

    private drawBezierPath (srcCoord: L.LatLng, dstCoord: L.LatLng, color: string, bend: boolean): void
    {
        const ctrlCoord = this.getControlLatLng(srcCoord, dstCoord, bend);

        L.circleMarker(ctrlCoord, { radius: 5, color: '#ff0000' }).addTo(this.map);
        const p: L.Point[] = [
            this.map.project(srcCoord, SecuConstants.ZoomLevel),
            this.map.project(ctrlCoord, SecuConstants.ZoomLevel),
            this.map.project(dstCoord, SecuConstants.ZoomLevel)
        ];
        console.debug(p);
        const latLngs: L.LatLng[] = [];
        const nb = 10;
        const epsilon = 1 / nb;

        for (let idx = 0; idx <= nb; idx++)
        {
            const t = idx * epsilon;
            // const x = (1 - t) * (1 - t) * p[0].x + 2 * (1 - t) * t * p[1].x + t * t * p[2].x;
            const x = this.computeInterpolation(t, p[0].x, p[1].x, p[2].x);
            // const y = (1 - t) * (1 - t) * p[0].y + 2 * (1 - t) * t * p[1].y + t * t * p[2].y;
            const y = this.computeInterpolation(t, p[0].y, p[1].y, p[2].y);

            latLngs.push(this.map.unproject(L.point(x, y), SecuConstants.ZoomLevel));
        }

        L.polyline(latLngs, { color: color }).addTo(this.map);
    }

    private computeInterpolation (t: number, v0: number, v1: number, v2: number): number
    {
        return (1 - t) * (1 - t) * v0 + 2 * (1 - t) * t * v1 + t * t * v2;
    }

    // private drawBezierPath (srcCoord: L.LatLng, dstCoord: L.LatLng, color: string, bend: boolean): void
    // {
    //     const ctrlCoord = this.getControlLatLng(srcCoord, dstCoord, bend);

    //     L.circleMarker(ctrlCoord, { radius: 5, color: '#ff0000' }).addTo(this.map);
    //     const p: L.LatLng[] = [
    //         srcCoord,
    //         ctrlCoord,
    //         dstCoord
    //     ];
    //     const latLngs: L.LatLng[] = [];
    //     // const nbPoints = 4

    //     for (let idx = 1; idx < 4; idx++)
    //     {
    //         const t = idx + 0.25;

    //         const lng = (1 - t) * (1 - t) * p[0].lng + 2 * (1 - t) * t * p[1].lng + t * t * p[2].lng;
    //         const lat = (1 - t) * (1 - t) * p[0].lat + 2 * (1 - t) * t * p[1].lat + t * t * p[2].lat;

    //         latLngs.push(L.latLng(lat, lng));
    //     }

    //     L.polyline(latLngs, { color: color }).addTo(this.map);
    // }

    /**
     * @param srcLatLng {L.LatLng} coordonnées de la source de l'attaque
     * @param dstLatLng {L.LatLng} coordonnées de la cible de l'attaque
     * @param bend {boolean} pour courber au-dessus ou en dessous
     */
    private getControlLatLng (srcLatLng: L.LatLng, dstLatLng: L.LatLng, bend: boolean): L.LatLng
    {
        let x1: number = srcLatLng.lng,
            y1: number = srcLatLng.lat,
            x2: number = dstLatLng.lng,
            y2: number = dstLatLng.lat;

        if (y2 < y1 && x2 < x1)
        {
            const tmpx = x2;
            const tmpy = y2;

            x2 = x1;
            y2 = y1;
            x1 = tmpx;
            y1 = tmpy;
        } else if (y2 < y1)
        {
            const tmpy = y1;

            y1 = y2;
            y2 = tmpy;
        } else if (x2 < x1)
        {
            const tmpx = x1;

            x1 = x2;
            x2 = tmpx;
        }

        const min: number = 2.5,
            max: number = 7.5,
            arcIntensity: number = parseFloat((Math.random() * (max - min) + min).toFixed(2)),
            radian: number = Math.atan(-((y2 - y1) / (x2 - x1))),
            r: number = Math.sqrt(x2 - x1) + Math.sqrt(y2 - y1),
            m1: number = (x1 + x2) / 2,
            m2: number = (y1 + y2) / 2;

        let lng: number,
            lat: number;
        if (bend === true)
        {
            lng = Math.floor(m1 - r * arcIntensity * Math.sin(radian));
            lat = Math.floor(m2 - r * arcIntensity * Math.cos(radian));
        } else
        {
            lng = Math.floor(m1 + r * arcIntensity * Math.sin(radian));
            lat = Math.floor(m2 + r * arcIntensity * Math.cos(radian));
        }

        return L.latLng(lat, lng);
    }
}
