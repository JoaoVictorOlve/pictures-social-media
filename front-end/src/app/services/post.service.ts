import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../shared/models/post';
import { HttpClient } from '@angular/common/http';
import { PostListResponse } from '../shared/models/post-list-response';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly apiUrl = "http://localhost:3000/api/post"

  constructor(private http: HttpClient) { }

  getApiUrl():string{
    return this.apiUrl;
  }

  getPostList(limit: number, offset: number): Observable<PostListResponse> {
    const params = { limit: limit.toString(), offset: offset.toString() };
    return this.http.get<PostListResponse>(`${this.apiUrl}`, { params,
    withCredentials:true });
  }

  getPostById(id : number): Observable<Post>{
    return this.http.get<Post>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    })
  }

  createPost(post: Post): Observable<any>{
    return this.http.post(`${this.apiUrl}`, post, {
      withCredentials: true
    });
  }

  uploadImage(formData: FormData, post_id:Number): Observable<any>{
    return this.http.post(`${this.apiUrl}/upload/${post_id}`, formData, {
      withCredentials:true
    });
  }

  updatePost(id: number, post:Post): Observable<Post>{
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, post)
  }

  deletePost(id:number):Observable<any>{
    return this.http.delete<Post>(`${this.apiUrl}/${id}`, {
      withCredentials:true
    })
  }

}
