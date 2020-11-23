import { Event } from "../../models/Event";
import { Component, OnInit, Input } from "@angular/core";
import { CartService } from "../../cart.service";
import { categoriesColors } from "../../shared/constants";
import { SharedModule } from "../../shared/shared.module";

import {
  trigger,
  transition,
  query,
  stagger,
  animate,
  style,
  state,
} from "@angular/animations";
@Component({
  selector: "event-thumbnail",
  templateUrl: "./event-thumbnail.component.html",
  styleUrls: ["../../../bootstrap.css", "./event-thumbnail.component.scss"],
  animations: [
    trigger("cardsAnimation", [
      transition("* => *", [
        query(
          "mat-card",
          style({
            transform: "translateX(-100%)",
          }),
          {
            optional: true,
          }
        ),
        query(
          "mat-card",
          stagger("100ms", [
            animate(
              "600ms",
              style({
                transform: "translateX(0)",
              })
            ),
          ]),
          {
            optional: true,
          }
        ),
      ]),
    ]),

    trigger("myAwesomeAnimation", [
      state(
        "small",
        style({
          transform: "rotateZ(360deg)",
        })
      ),
      state(
        "large",
        style({
          transform: "rotateZ(180deg)",
        })
      ),
      transition("* => *", animate("500ms ease-in")),
    ]),
  ],
})
export class eventThumbnailComponent implements OnInit {
  @Input() event: Event;

  detailViewActive: boolean;

  constructor(public app: SharedModule, private cartService: CartService) {}

  ngOnInit() {
    this.detailViewActive = false;
  }

  oneventClick() {
    this.detailViewActive = !this.detailViewActive;
  }

  onAddToCart() {
    this.cartService.addeventToCart(this.event);
  }
  //copied from events list
  getStyle(category) {
    return categoriesColors[category].primary;
  }

  rotatearrow(id: number) {
    this.state[id] = this.state[id] === "small" ? "large" : "small";
  }

  state: string[] = [];

  selectedEvent: Event;

  onSelect(event: Event): void {
    this.selectedEvent = event;
  }

  setShareLink(string: string): void {
    string = "";
  }
}
