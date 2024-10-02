import { ResolveFn } from '@angular/router';
import {User} from "../../model/user";
import {inject} from "@angular/core";
import {Observable, of} from "rxjs";
import {UserService} from "../../services/user/user.service";

export const userResolver: ResolveFn<User | null> = (route, state) => {
  const service = inject(UserService);
  if (route.params && route.params['email']) {
    return new Observable<User | null>((observer) => {
      service.loadUserByLogin(route.params['email']).subscribe({
        next: (value) => {
          observer.next(value);
          observer.complete();
        },
        error: (err) => {
          console.error(err);
        }
      })
    })
  }
  return of(null);
};
