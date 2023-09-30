import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/shared/models/post';
import { User } from 'src/app/shared/models/user';
import { UserId } from 'src/app/shared/models/user-id';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  images: any = null;
  @Input() post: Post | undefined;
  postForm: FormGroup;

  constructor (
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private userService: UserService){
    this.postForm = this.fb.group({
      description: ['', Validators.required],
      user_id: [0, Validators.required]
    });
  }

  ngOnInit(){

  }

  selectImage(event: any){
  if (event.target.files.length > 0) {
    const imageType = event.target.files[0].type;
    console.log(this.images)
    if(imageType == "image/png" || imageType == "image/jpg" || imageType == "image/jpeg"){
      const file = event.target.files[0];
      this.images = file;
  } else {
    Swal.fire("", "Faça upload apenas de imagens PNG, JPG ou JPEG!", "error");
    this.images = null;
  }
  }
  }

  onSubmit(){
    const formData = this.postForm.value;

    if(formData.description > 50){
      Swal.fire("", "Descrição muito longa!", "error")
    } else if(formData.description <= 0){
      Swal.fire("", "Escreva alguma coisa na descrição!", "error")
    } else if(this.images == null){
      Swal.fire("", "Selecione alguma imagem válida!", "error")
    } else{
      this.userService.getUserId().subscribe(
        (response: UserId) =>{
          formData.user_id = response.id;
          this.postService.createPost(formData).subscribe(
            (response: Post)=>{
              const imageFormData = new FormData();
              imageFormData.append('file', this.images);
              this.postService.uploadImage(imageFormData, Number(response.id)).subscribe(
                (res)=>{
                  Swal.fire("success", "Success", "success");
                  this.router.navigate(['/']);
                  console.log(res);
                }, (err)=>{
                  Swal.fire("err", "Error", "error");
                  console.log(err);
                }
              )
            }, (err)=>{
              Swal.fire("error", "Error", "error");
              console.log(err);
            }
          )
        }, (err)=>{
          if(err.error.error == "Unauthorized"){
            this.router.navigate(['/auth/login'])
          } else {
            Swal.fire('error', 'Something wrong happened!', 'error')
            this.router.navigate(['/auth/login'])
          }
        }
      )
    }
  }
}
