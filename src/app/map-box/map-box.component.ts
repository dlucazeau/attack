import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { AttackService } from '../attack.service';
import { SecuConstants } from '../secu.constants';

@Component({
    selector: 'app-map-box',
    templateUrl: './map-box.component.html',
    styleUrls: [
        './map-box.component.scss'
    ]
})
export class attackComponent implements OnInit
{
    options: any;

    constructor(private attackService: AttackService) { }

    ngOnInit ()
    {
        const map: L.Map = L
            .map('map-attack')
            .setView(L.latLng(SecuConstants.HqLat, SecuConstants.HqLng), 2);

        map.zoomControl.remove();
        map.dragging.disable();
        map.fitBounds([
            [75, -160],
            [-35, 180]
        ]);

        map.whenReady(() => this.attackService.connect(map));

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                minZoom: SecuConstants.ZoomLevel,
                maxZoom: SecuConstants.ZoomLevel,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
            })
            .addTo(map);

        setTimeout(() => this.attackService.disconnect(), 60000);
    }
}
