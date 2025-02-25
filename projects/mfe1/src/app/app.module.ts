import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FlightsModule } from './flights/flights.module';
import { APP_ROUTES } from './app.routes';
import { WebSocketService } from 'projects/shell/websocket.service';
import { FormsModule } from '@angular/forms';
import { FlightsSearchComponent } from './flights/flights-search/flights-search.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    HomeComponent,
    AppComponent,
  ],
  providers: [WebSocketService],
  bootstrap: [
      AppComponent
  ],
})
export class AppModule { }
