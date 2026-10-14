import { Component, inject } from '@angular/core';
import { BRAND, NAV_ITEMS } from '../../core/content';
import { Icon } from '../../shared/icon';
import { Logo } from '../../shared/logo/logo';
import { ScrollService } from '../../shared/scroll.service';

@Component({
  selector: 'tt-footer',
  imports: [Icon, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly scroll = inject(ScrollService);

  protected readonly brand = BRAND;
  protected readonly links = NAV_ITEMS.filter((item) =>
    ['servicios', 'proyectos', 'nosotros', 'contacto'].includes(item.id),
  );
  protected readonly year = new Date().getFullYear();

  protected navigate(event: Event, id: string): void {
    event.preventDefault();
    this.scroll.scrollTo(id);
  }
}
