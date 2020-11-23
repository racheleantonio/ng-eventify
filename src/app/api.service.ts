import { EventsResponse } from "./models/EventsResponse";
import { Response } from "./models/Response";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EventBuy } from "./models/EventBuy";
import { EventAmount } from "./models/EventAmount";
import { NeedAuthGuard } from "./auth.guard";
import { CustomerService } from "./customer.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { of } from "rxjs";
import { Event } from "./models/Event";
import { MOCK_EVENTS, MOCK_EVENTS_AMOUNT } from "./shared/mock-data";
import { LoginResultModelOrganizer } from "./models/LoginResultModelOrganizer";
import { shouldCallLifecycleInitHook } from "@angular/core/src/view";
import { LoginResultModelUser } from "./models/LoginResultModelUser";
import { UserNeedAuthGuard } from "./user.auth.guard";
import { unsupported } from "@angular/compiler/src/render3/view/util";
import { BASE_URL } from "./shared/constants";

const httpOption = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private userAuth: UserNeedAuthGuard,
    private auth: NeedAuthGuard,
    private customer: CustomerService
  ) {}

  createEvent(event: Event) {
    event.phone = this.customer.getPhone();
    event.owner_name = this.customer.getUser();
    event.remaining_posts = event.total_posts;

    console.log(event);
    return this.http
      .post<Event[]>(
        BASE_URL + "organizer/insert",
        {
          token: this.customer.getToken(),
          event: event,
          loginId: this.customer.getId(),
        },
        httpOption
      )
      .subscribe((r) => {
        this.customer.events = r;
      });
  }

  editEvent(event: Event) {
    event.remaining_posts = event.total_posts;
    event.opening = new Date(event.opening);
    event.ending = new Date(event.ending);

    console.log(event);
    return this.http
      .post<Event[]>(
        BASE_URL + "organizer/modifyEvent",
        {
          token: this.customer.getToken(),
          event: event,
          loginId: this.customer.getId(),
        },
        httpOption
      )
      .subscribe((r) => {
        this.snackBar.open(r.toString(), "", {
          duration: 1000,
        });
        this.customer.events = r;
      });
  }

  deleteEvent(id: string) {
    return this.http
      .post<Response>(
        BASE_URL + "organizer/delete",
        {
          token: this.customer.getToken(),
          eventId: id,
          loginId: this.customer.getId(),
        },
        httpOption
      )
      .subscribe((r) => {
        console.log("delete event successfully completed", r);
        if (r.message == "Success") {
          this.customer.events = this.customer.events.filter(
            (obj) => obj.id !== id
          );
        } else {
          this.snackBar.open(r.message, "", {
            duration: 1000,
          });
        }
      });
  }

  sendMail(message: string, eventId: string) {
    return this.http
      .post<Response>(
        BASE_URL + "organizer/sendEmail",
        {
          token: this.customer.getToken(),
          eventId: eventId,
          loginId: this.customer.getId(),
          message: message,
        },
        httpOption
      )
      .subscribe((r) => {
        this.snackBar.open(r.message, "", {
          duration: 1000,
        });
      });
  }

  logoutOrganizer() {
    console.log("login organizer");

    this.http
      .post(BASE_URL + "organizer/logout", {
        token: this.customer.getToken(),
        loginId: this.customer.getId(),
      })
      .subscribe();
    this.auth.logout();
    this.customer.logout();
  }

  loginOrganizer(
    email: string,
    password: string
  ): Observable<LoginResultModelOrganizer> {
    console.log("login organizer");
    //Mocking response
    return of({
      loginId: 2,
      token: "string",
      email: "organizer@email.com",
      message: "string",
      username: "Roberto",
      phone: "011-112233",
    });
    return this.http.post<LoginResultModelOrganizer>(
      BASE_URL + "organizer/login",
      {
        email: email,
        password: password,
      }
    );
  }

  signinOrganizer(
    email: string,
    password: string,
    username: string,
    phone: string
  ): Observable<LoginResultModelOrganizer> {
    console.log("Signin", username);
    //Mocking response
    return of({
      loginId: 2,
      token: "string",
      email: "organizer@email.com",
      message: "string",
      username: "Roberto",
      phone: "011-112233",
    });
    return this.http.post<LoginResultModelOrganizer>(
      BASE_URL + "organizer/register",
      {
        email: email,
        password: password,
        username: username,
        phone: phone,
      }
    );
  }

  getOwnedEvents() {
    this.http
      .post<Event[]>(BASE_URL + "organizer/getOwnedEvents", {
        token: this.customer.getToken(),
        loginId: this.customer.getId(),
      })
      .subscribe((r) => {
        console.log(r);
        if (r == undefined || r == null || r.length == undefined) {
          this.snackBar.open("", "", {
            duration: 1000,
          });
          console.log("quaa");

          this.customer.events = [];
          console.log("quiii");
        } else {
          this.customer.events = r;
          console.log(this.customer.getToken());
          console.log("quaa");
        }
        console.log(this.customer.events);
      });
  }
  /*
  ++++++++++++++++++++++++++++++++++
  There are the method for the user 
  ++++++++++++++++++++++++++++++++++
  */
  logoutUser() {
    this.http
      .post(BASE_URL + "user/logout", {
        token: this.customer.getToken(),
        loginId: this.customer.getId(),
      })
      .subscribe();
    this.userAuth.logout();
    this.customer.logout();
  }

  loginUser(email: string, password: string): Observable<LoginResultModelUser> {
    console.log("login user");
    //Mocking response
    return of({
      loginId: 1,
      token: "string",
      message: "string",
      name: "Antonio",
      surname: "Rachele",
      email: "antonio.rachele@email.com",
    });
    return this.http.post<LoginResultModelUser>(BASE_URL + "user/login", {
      email: email,
      password: password,
    });
  }

  signinUser(
    email: string,
    password: string,
    name: string,
    surname: string
  ): Observable<LoginResultModelUser> {
    //Mocking response
    return of({
      loginId: 1,
      token: "string",
      message: "string",
      name: "Antonio",
      surname: "Rachele",
      email: "antonio.rachele@email.com",
    });
    return this.http.post<LoginResultModelUser>(BASE_URL + "user/register", {
      email: email,
      password: password,
      name: name,
      surname: surname,
    });
  }

  getEvents(): Observable<Event[]> {
    //Mocking response
    return of(MOCK_EVENTS);
    //
    return this.http.post<Event[]>(BASE_URL + "user/getEvents", {
      token: this.customer.getToken(),
      loginId: this.customer.getId(),
    });

    // this.http.post < Event[] > (BASE_URL + "organizer/getOwnedEvents", {
    //   token: this.customer.getToken(),
    //   loginId: this.customer.getId()
    // }).subscribe(r => {
    //   this.customer.events = r;
    // });
  }

  getCustomEvents(): Observable<Event[]> {
    //Mocking response
    return of(MOCK_EVENTS);
    //
    return this.http.post<Event[]>(BASE_URL + "user/getCustomEvents", {
      token: this.customer.getToken(),
      loginId: this.customer.getId(),
      latitude: this.customer.latitude,
      longitude: this.customer.longitude,
      rangeTime: this.customer.rangeTime,
      rangeDistance: this.customer.rangeDistance,
    });

    // this.http.post < Event[] > (BASE_URL + "organizer/getOwnedEvents", {
    //   token: this.customer.getToken(),
    //   loginId: this.customer.getId()
    // }).subscribe(r => {
    //   this.customer.events = r;
    // });
  }

  addToCart(e: Event) {
    this.http
      .post<Event[]>(BASE_URL + "user/add", {
        token: this.customer.getToken(),
        loginId: this.customer.getId(),
        timestamp: new Date(),
        eventId: e.id,
      })
      .subscribe((r) => {
        console.log("addtocart done", r);
      });
  }

  removeFromCart(e: Event) {
    this.http
      .post<Event[]>(BASE_URL + "user/remove", {
        token: this.customer.getToken(),
        loginId: this.customer.getId(),
        timestamp: new Date(),
        eventId: e.id,
      })
      .subscribe((r) => {
        console.log(r);
      });
  }

  buy(events: EventAmount[]) {
    var list: EventBuy[] = [];
    events.forEach((e) => {
      list.push(new EventBuy(e));
    });
    console.log(list);
    //Mocking response
    return of({ message: "Success" });
    //
    return this.http.post<Response>(BASE_URL + "user/buy", {
      token: this.customer.getToken(),
      loginId: this.customer.getId(),
      timestamp: new Date(),
      tickets: list,
    });
  }

  getCart() {
    //Mocking response
    return of(MOCK_EVENTS_AMOUNT);
    //
    return this.http.post<EventAmount[]>(BASE_URL + "user/getCart", {
      token: this.customer.getToken(),
      loginId: this.customer.getId(),
    });
  }

  getTickets() {
    console.log(this.customer.getToken());
    console.log(this.customer.getId());
    //Mocking response
    return of(MOCK_EVENTS_AMOUNT);
    //
    return this.http.post<EventAmount[]>(BASE_URL + "user/getTickets", {
      token: this.customer.getToken(),
      loginId: this.customer.getId(),
    });
  }
}
