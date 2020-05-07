import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { attackComponent } from './map-box/map-box.component';

@NgModule({
    declarations: [
        AppComponent,
        attackComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LeafletModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
