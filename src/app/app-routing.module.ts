import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChantFetchComponent } from './components/chant-fetch/chant-fetch.component';
import { DashboardComponent } from './components/visualization/dashboard/dashboard.component';
import { ChantListWrapperComponent } from './components/chant-list-wrapper/chant-list-wrapper.component';
import { DataUploadComponent } from './components/data-upload/data-upload.component';
import { SettingsComponent } from './components/settings/settings.component';
import {AlignedPageComponent} from './components/aligned-page/aligned-page.component';
import {AlignmentManagerComponent} from './components/alignment-manager/alignment-manager.component';
import { HelpPageComponent } from './components/help-page/help-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'chants', pathMatch: 'full' },
  { path: 'chants', component: ChantListWrapperComponent },
  { path: 'chants/:id', component: ChantFetchComponent },
  // { path: 'align', component: AlignedComponent },
  { path: 'align/:name', component: AlignedPageComponent },
  { path: 'align', component: AlignedPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'upload', component: DataUploadComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'alignment-manager', component: AlignmentManagerComponent },
  { path: 'help', component: HelpPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
