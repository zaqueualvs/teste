import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserPage} from "../../model/user-page";
import {Category} from "../../model/category";
import {PublicUser} from "../../model/public-user";

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private readonly API_URL = '/api/public';

  constructor(private http: HttpClient) {
  }

  listAllCategories() {
    console.log(`${this.API_URL}/categories`)
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  listAllUsers(page = 0, pageSize = 8) {
    return this.http.get<UserPage>(`${this.API_URL}/users`, {params: {page, pageSize}});
  }
  findUserById(id: number) {
    return this.http.get<PublicUser>(`${this.API_URL}/users/${id}`);
  }

  listUsersByCategory(category: Category, page = 0, pageSize = 8) {
    return this.http.get<UserPage>(`${this.API_URL}/users/category/${category.id}`, {params: {page, pageSize}});
  }
}
