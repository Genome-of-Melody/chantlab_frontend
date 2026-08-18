import {EventEmitter, Injectable, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import CONFIG from '../config.json';
import { AuthService } from './auth.service';

export interface PersistedSettings {
  alignment?: { distanceMatrixUseAbsoluteDistances?: boolean };
  dashboard?: { useGrayscale?: boolean };
  networkGraph?: {
    closestNeighborLinkOnly?: boolean;
    linkMaximumDistanceThreshold?: number;
  };
  phylogeny?: { mrbayesGenerations?: number };
}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  @Output() settingsChangedEvent = new EventEmitter();

  constructor(
    public alignmentSettingsService: AlignmentSettingsService,
    public dashboardSettingsService: DashboardSettingsService,
    public networkGraphSettingsService: NetworkGraphSettingsService,
    public phylogenySettingsService: PhylogenySettingsService,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadFromServer();
      } else {
        this.resetToDefaults();
      }
    });
  }

  toPayload(): PersistedSettings {
    return {
      alignment: {
        distanceMatrixUseAbsoluteDistances:
          this.alignmentSettingsService.distanceMatrixUseAbsoluteDistances
      },
      dashboard: {
        useGrayscale: this.dashboardSettingsService.useGrayscale
      },
      networkGraph: {
        closestNeighborLinkOnly: this.networkGraphSettingsService.closestNeighborLinkOnly,
        linkMaximumDistanceThreshold: this.networkGraphSettingsService.linkMaximumDistanceThreshold
      },
      phylogeny: {
        mrbayesGenerations: this.phylogenySettingsService.mrbayesGenerations
      }
    };
  }

  applyPayload(payload: PersistedSettings): void {
    if (!payload) {
      return;
    }
    if (payload.alignment?.distanceMatrixUseAbsoluteDistances !== undefined) {
      this.alignmentSettingsService.distanceMatrixUseAbsoluteDistances =
        payload.alignment.distanceMatrixUseAbsoluteDistances;
    }
    if (payload.dashboard?.useGrayscale !== undefined) {
      this.dashboardSettingsService.useGrayscale = payload.dashboard.useGrayscale;
    }
    if (payload.networkGraph?.closestNeighborLinkOnly !== undefined) {
      this.networkGraphSettingsService.closestNeighborLinkOnly =
        payload.networkGraph.closestNeighborLinkOnly;
    }
    if (payload.networkGraph?.linkMaximumDistanceThreshold !== undefined) {
      this.networkGraphSettingsService.linkMaximumDistanceThreshold =
        payload.networkGraph.linkMaximumDistanceThreshold;
    }
    if (payload.phylogeny?.mrbayesGenerations !== undefined) {
      this.phylogenySettingsService.mrbayesGenerations =
        payload.phylogeny.mrbayesGenerations;
    }
    this.settingsChangedEvent.emit();
  }

  resetToDefaults(): void {
    this.alignmentSettingsService.distanceMatrixUseAbsoluteDistances = false;
    this.dashboardSettingsService.useGrayscale = false;
    this.networkGraphSettingsService.closestNeighborLinkOnly = false;
    this.networkGraphSettingsService.linkMaximumDistanceThreshold = 0.5;
    this.phylogenySettingsService.mrbayesGenerations = 4000;
  }

  loadFromServer(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.http.get<{ settings: PersistedSettings }>(`${CONFIG['BACKEND_URL']}/settings/`)
      .subscribe(response => this.applyPayload(response.settings || {}));
  }

  saveToServer(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.http.put(`${CONFIG['BACKEND_URL']}/settings/`, { settings: this.toPayload() })
      .subscribe();
  }
}


@Injectable({
  providedIn: 'root'
})
export class AlignmentSettingsService {
  constructor() { }

  distanceMatrixUseAbsoluteDistances = false;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardSettingsService {
  constructor() { }

  useGrayscale = false;
}


@Injectable({
  providedIn: 'root'
})
export class NetworkGraphSettingsService {
  constructor() { }

  closestNeighborLinkOnly = false;
  linkMaximumDistanceThreshold = 0.5;
}


@Injectable({
  providedIn: 'root'
})
export class PhylogenySettingsService {
  constructor() { }

  mrbayesGenerations = 4000;
}
