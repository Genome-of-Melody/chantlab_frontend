import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChantFetchComponent } from './components/chant-fetch/chant-fetch.component';
import { DashboardComponent } from './components/visualization/dashboard/dashboard.component';
import { ChantListWrapperComponent } from './components/chant-list-wrapper/chant-list-wrapper.component';
import { DataUploadComponent } from './components/data-upload/data-upload.component';
import { SettingsComponent } from './components/settings/settings.component';
import {AlignedPageComponent} from './components/aligned-page/aligned-page.component';
import {AlignmentManagerComponent} from './components/alignment-manager/alignment-manager.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { PhylogenyPageComponent } from './components/phylogeny-page/phylogeny-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'chants', pathMatch: 'full' },
  { path: 'chants', component: ChantListWrapperComponent },
  { path: 'chants/:id', component: ChantFetchComponent },
  // { path: 'align', component: AlignedComponent },
  { path: 'align/:name', component: AlignedPageComponent },
  { path: 'align', component: AlignedPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'upload', component: DataUploadComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'alignment-manager', component: AlignmentManagerComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutPageComponent },
  { path: 'phylogeny', component: PhylogenyPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
