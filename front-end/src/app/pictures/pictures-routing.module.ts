import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path:'', component: HomeComponent},
  { path: 'post/:id', component: DetailComponent},
  { path:'create', component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PicturesRoutingModule { }
