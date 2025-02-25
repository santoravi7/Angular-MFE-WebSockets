import {Component, ViewChild, ViewContainerRef, Inject, Injector, ComponentFactoryResolver, OnInit} from '@angular/core';
import { AuthService } from 'auth';

@Component({
  selector: 'app-bookings-search',
  templateUrl: './bookings-search.component.html',
  styleUrls: ['./bookings-search.component.css']
})
export class BookingsSearchComponent {

  @ViewChild('vc', { read: ViewContainerRef, static: true })
  viewContainer!: ViewContainerRef;
  user:string;

  constructor(
    @Inject(Injector) private injector: Injector,
    @Inject(ComponentFactoryResolver) private cfr:ComponentFactoryResolver, authService:AuthService) {
      this.user=authService.user;
     }

  search() {
    alert('Not implemented for this demo!');
  }

  async terms() {
    const comp = await import('../lazy/lazy.component').then(m => m.LazyComponent);

    const factory = this.cfr.resolveComponentFactory(comp);
    this.viewContainer.createComponent(factory, undefined, this.injector);
  }


}
