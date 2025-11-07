import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { Data } from "src/app/shared/models/dataModel";
import { ApiService } from "src/app/shared/services/api.service";
import { renderChart } from "../../shared/utils/chart";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  chartData: Data[] = [];

  loading = false;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadChartData(): void {
    this.loading = true;

    this.apiService
      .getChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.chartData = data;
          this.createChart(data);
          this.loading = false;
        },
        error: (error) => {
          console.error("Erro ao carregar dados do gráfico:", error);
          this.loading = false;
        },
      });
  }

  private createChart(data: Data[]): void {
    try {
      const containerId = "chart";
      setTimeout(() => {
        renderChart(containerId, data);
      }, 100);
    } catch (error) {
      console.error("Erro ao criar o gráfico:", error);
    }
  }

  refreshData(): void {
    this.loadChartData();
  }
}
