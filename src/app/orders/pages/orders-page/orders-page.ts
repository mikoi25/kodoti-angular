import { Component, inject } from '@angular/core';
import { authService } from '../../../auth/services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-orders-page',
  styleUrl: './orders-page.css',
  templateUrl: './orders-page.html',
})
export class OrdersPage {

  public authService = inject(authService)
  public customDate:Date =new Date();
}
