import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PicturesModule } from './pictures/pictures.module';
import { AuthModule  } from './auth/auth.module';

const routes: Routes = [
  { path:'', pathMatch:'full', redirectTo:'' },
  { path:'',
    loadChildren: () => import('./pictures/pictures.module').then(m => m.PicturesModule)},
    {path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
