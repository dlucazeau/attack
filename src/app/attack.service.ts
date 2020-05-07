import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import * as L from 'leaflet';

import { AttackWss, Attack } from './attack';
import { SecuConstants } from './secu.constants';

@Injectable({
    providedIn: 'root'
})
export class AttackService
{
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
                tap((a: Attack) =>
                {
                    const srcCoord = L.latLng(a.src_geo.lat, a.src_geo.lng);

                    L.circleMarker(srcCoord, { radius: 1, color: a.color }).addTo(this.map);
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
        const dstCoord = L.latLng(SecuConstants.HqLat, SecuConstants.HqLng);
        // const point1 = this.map.latLngToLayerPoint(dstCoord); // , SecuConstants.ZoomLevel));
        // const point2 = this.map.project(dstCoord, SecuConstants.ZoomLevel);
        // const latLng1 = this.map.layerPointToLatLng(point1);
        // const latLng2 = this.map.unproject(point2, SecuConstants.ZoomLevel);

        // console.debug({dst: dstCoord});

        // console.debug({ p2: point2, l2: latLng2});

        L.circleMarker(dstCoord, { radius: 2, color: '#000000' }).addTo(this.map);
    }

    private

    /**
     * @param x1 {number} Latitude en radians
     * @param y1 {number} Longitude en radians
     * @param bend {boolean} pour courber au-dessus ou en dessous
     */
    private calcMidPoint (x1: number, y1: number, bend: boolean)
    {
        const min: number = 2.5;  // min = 1
        const max: number = 7.5; // max = 7
        const arcIntensity: number = parseFloat((Math.random() * (max - min) + min).toFixed(2));

        let x2 = SecuConstants.HqLng,
            y2 = SecuConstants.HqLat;

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

        const radian: number = Math.atan(-((y2 - y1) / (x2 - x1)));
        const r: number = Math.sqrt(x2 - x1) + Math.sqrt(y2 - y1);
        const m1: number = (x1 + x2) / 2;
        const m2: number = (y1 + y2) / 2;

        let a: number;
        let b: number;
        if (bend === true)
        {
            a = Math.floor(m1 - r * arcIntensity * Math.sin(radian));
            b = Math.floor(m2 - r * arcIntensity * Math.cos(radian));
        } else
        {
            a = Math.floor(m1 + r * arcIntensity * Math.sin(radian));
            b = Math.floor(m2 + r * arcIntensity * Math.cos(radian));
        }

        return { x: a, y: b };
    }
}
