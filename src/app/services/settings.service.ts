import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  @Output() settingsChangedEvent = new EventEmitter();

  constructor(
    public alignmentSettingsService: AlignmentSettingsService,
    public dashboardSettingsService: DashboardSettingsService
  ) { }

}


@Injectable({
  providedIn: 'root'
})
export class AlignmentSettingsService {
  constructor() { }

  useTextSeparators = true;
  distanceMatrixUseAbsoluteDistances = false;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardSettingsService {
  constructor() { }

  useGrayscale = false;
}
