import { Injectable } from '@angular/core';

@Injectable()
export class MapService
{
    constructor()
    {
    }

    // getMarkers (): FirebaseListObservable<any>
    // {
    //     return this.db.list('/markers');
    // }

    // createMarker (data: GeoJson)
    // {
    //     return this.db.list('/markers')
    //         .push(data);
    // }

    // removeMarker ($key: string)
    // {
    //     return this.db.object('/markers/' + $key).remove();
    // }
}
