import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userForm:FormGroup;
  userObject: User = {
    name: "",
    email: "",
    password: ""
  }

  constructor(
    private FormBuilder:FormBuilder,
    private http: HttpClient,
    private router:Router,
    private userService: UserService
  ){}

  ngOnInit(){
    this.userForm = this.FormBuilder.group({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    })
  }

  submit():void{
    let user = this.userForm.getRawValue();

    if(user.name == "" || user.email == "" || user.password == ""){
      Swal.fire(
        "Erro",
        "Por favor, preencha todos os campos!",
        "error"
      )
    } else if (user.password !== user.confirmPassword){
      Swal.fire(
        "Erro",
        "Senha não confere com a confirmação de senha!",
        "error"
      )
    } else {
      this.userObject.name = user.name;
      this.userObject.email = user.email;
      this.userObject.password = user.password;
      this.userService.registerUser(this.userObject).subscribe((res)=>{
        Swal.fire(
          "Sucess",
          "Sua conta foi criada com sucesso!",
          "success");
        this.router.navigate(['/auth/login']);
      }, (err)=>{
        Swal.fire("Error", err.error.error, "error")
      })
    }
  }
}
