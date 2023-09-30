import { Component } from '@angular/core';
import { Post } from 'src/app/shared/models/post';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { UserId } from 'src/app/shared/models/user-id';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  userOwnsPost:Boolean = false;
  post: Post;

  constructor(private route: ActivatedRoute, private postService: PostService,
    private router: Router, private userService: UserService) {}

  ngOnInit(){
    this.loadPost();
  }

  loadPost(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPostById(id).subscribe(
      (response: Post)=>{
        this.post = response;
        this.userService.getUserId().subscribe(
          (response: UserId)=>{
            if(response.id == this.post.user_id){
              this.userOwnsPost = true;
            } else {
              this.userOwnsPost = false;
            }
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

  deletePost(){
    Swal.fire({
      title: 'Do you really want to delete your post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(Number(this.post.id)).subscribe(
          ()=>{
            this.router.navigate(['/']);
            Swal.fire(
            'Deleted!',
            'Your post was deleted.',
            'success'
            )}, (err)=>{
            Swal.fire('error', 'Something wrong happened!', 'error')
          }
        )
      }
    })
  }
}
