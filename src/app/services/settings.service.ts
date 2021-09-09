import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

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
}


@Injectable({
  providedIn: 'root'
})
export class DashboardSettingsService {
  constructor() { }

  useGrayscale = false;
}
