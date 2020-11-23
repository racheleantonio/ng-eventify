import { SharedModule } from "../../shared/shared.module";
import { CustomerService } from "../../customer.service";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { categories } from "src/app/shared/constants";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  customer: CustomerService;

  categories = categories;

  constructor(private c: CustomerService, public app: SharedModule) {
    this.customer = this.c;
  }

  ngOnInit() {}
}
