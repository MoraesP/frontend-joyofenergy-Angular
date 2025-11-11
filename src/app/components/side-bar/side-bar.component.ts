import { KeyValue, CommonModule, KeyValuePipe } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { ApiService } from "src/app/shared/services/api.service";

@Component({
  selector: "app-side-bar",
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.scss"],
})
export class SideBarComponent implements OnInit, OnDestroy {
  energyConsumptionMap = new Map<string, string>([
    ["⚡️ 1.4kW", "Power draw"],
    ["☀️️ 5.8kW", "Solar power production"],
    ["🔌️ 4.4kW", "Fed into grid"],
  ]);

  devicesMap = new Map<string, string>();

  loading = false;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDevicesData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDevicesData(): void {
    this.loading = true;

    this.apiService
      .getDevicesData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (devices) => {
          this.devicesMap = new Map(
            devices.map((device) => [device.name, device.consumption])
          );
          this.loading = false;
        },
        error: (error) => {
          console.error("Erro ao carregar dispositivos:", error);
          this.loading = false;
        },
      });
  }

  asIsOrder(
    _a: KeyValue<string, string>,
    _b: KeyValue<string, string>
  ): number {
    return 0;
  }
}
