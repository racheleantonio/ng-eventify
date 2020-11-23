import { CartService } from "../cart.service";
import { ApiService } from "../api.service";
import { NgModule } from "@angular/core";
import { CustomerService } from "../customer.service";
import { CATEGORY_IMAGES_PATH } from "./constants";

@NgModule({
  providers: [ApiService, CustomerService, CartService],
})
export class SharedModule {
  public getCategoryImagePath = (category: string): string =>
    CATEGORY_IMAGES_PATH + category.toLowerCase() + ".png";
  public title = "Eventify";
}
