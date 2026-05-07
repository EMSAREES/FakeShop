import {
  Component, OnInit, signal, computed,
  AfterViewInit, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ProductService } from '../../products/product.service';
import { CartService } from '../../cart/cart.service';
import { Auth } from '../../../core/services/auth.service';
import { Product } from '../../../shared/models/product.interface';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

// Registra todos los módulos de Chart.js (scales, controllers, etc.)
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, LoadingSpinnerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {

  // Referencias a los canvas del HTML para crear las gráficas
  @ViewChild('catChartRef') catChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priceChartRef') priceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ratingChartRef') ratingChartRef!: ElementRef<HTMLCanvasElement>;

  readonly products  = signal<Product[]>([]);
  readonly loading   = signal(false);

  // KPIs calculados de los datos reales
  readonly totalProducts   = computed(() => this.products().length);
  readonly avgPrice        = computed(() => {
    const p = this.products();
    return p.length ? p.reduce((s, x) => s + x.price, 0) / p.length : 0;
  });
  readonly maxPrice        = computed(() =>
    this.products().length ? Math.max(...this.products().map(p => p.price)) : 0
  );
  readonly avgRating       = computed(() => {
    const p = this.products();
    return p.length ? p.reduce((s, x) => s + x.rating.rate, 0) / p.length : 0;
  });
  readonly categoryCounts  = computed(() => {
    const map: Record<string, number> = {};
    this.products().forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  });
  readonly topRated = computed(() =>
    [...this.products()].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 5)
  );

  // Instancias de Chart para destruirlas en ngOnDestroy
  private charts: Chart[] = [];

  constructor(
    private readonly productService: ProductService,
    readonly cartService: CartService,
    readonly authService: Auth
  ) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
        // Pequeño delay para que los ViewChild estén listos en el DOM
        setTimeout(() => this.buildCharts(), 100);
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // IMPORTANTE: destruir los charts evita memory leaks
    this.charts.forEach(c => c.destroy());
  }

  private buildCharts(): void {
    this.buildCategoryChart();
    this.buildPriceChart();
    this.buildRatingChart();
  }

  private buildCategoryChart(): void {
    const counts = this.categoryCounts();
    const labels = Object.keys(counts);
    const data   = Object.values(counts);
    const colors = ['#185FA5', '#3B6D11', '#854F0B', '#993556'];

    const chart = new Chart(this.catChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 3,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw} productos`
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildPriceChart(): void {
    // Agrupa productos en rangos de precio
    const ranges = { '$0–$50': 0, '$50–$100': 0, '$100–$200': 0, '$200+': 0 };
    this.products().forEach(p => {
      if (p.price < 50)       ranges['$0–$50']++;
      else if (p.price < 100) ranges['$50–$100']++;
      else if (p.price < 200) ranges['$100–$200']++;
      else                    ranges['$200+']++;
    });

    const chart = new Chart(this.priceChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(ranges),
        datasets: [{
          label: 'Productos',
          data: Object.values(ranges),
          backgroundColor: '#B5D4F4',
          borderColor: '#185FA5',
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#888', font: { size: 12 } } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#888', font: { size: 12 }, stepSize: 2 }, beginAtZero: true }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildRatingChart(): void {
    // Top 5 productos por rating
    const top = this.topRated();
    const labels = top.map(p => p.title.substring(0, 18) + '...');
    const data   = top.map(p => p.rating.rate);

    const chart = new Chart(this.ratingChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Rating',
          data,
          backgroundColor: '#C0DD97',
          borderColor: '#3B6D11',
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y', // Barras horizontales
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            min: 0, max: 5,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#888', font: { size: 12 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#555', font: { size: 11 } }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  // Expone keys del objeto para usar en el template
  objectKeys(obj: Record<string, number>): string[] {
    return Object.keys(obj);
  }

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      'electronics':      '#185FA5',
      'jewelery':         '#3B6D11',
      "men's clothing":   '#854F0B',
      "women's clothing": '#993556'
    };
    return map[category] ?? '#888';
  }
}
