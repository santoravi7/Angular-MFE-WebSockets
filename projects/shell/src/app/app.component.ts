import { getManifest, Manifest } from '@angular-architects/module-federation';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomManifest, CustomRemoteConfig } from './utils/config';
import { buildRoutes } from './utils/routes';
import { AuthService } from 'auth';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'projects/shell/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit  {

  remotes: CustomRemoteConfig[] = [];

  liveUsers: number = 0;
  subscription!: Subscription;

  constructor(
    private router: Router, private AuthService: AuthService, private webSocketService: WebSocketService) {
      this.AuthService.login('Santo');
  }

  async ngOnInit(): Promise<void> {
    const manifest = getManifest<CustomManifest>();
    
    // Hint: Move this to an APP_INITIALIZER 
    //  to avoid issues with deep linking
    const routes = buildRoutes(manifest);
    this.router.resetConfig(routes);

    this.remotes = Object.values(manifest);

    this.subscription = this.webSocketService.getLiveUsers().subscribe(count => {
      this.liveUsers = count;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

