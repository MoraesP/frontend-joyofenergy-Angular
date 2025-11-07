import { Component, OnInit } from "@angular/core";
import { Data } from "src/app/shared/models/dataModel";
import { renderChart } from "../../shared/utils/chart";
import {
  getReadings,
  groupByDay,
  sortByTime,
} from "../../shared/utils/reading";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  chartData: Data[] = [];

  constructor() {}

  ngOnInit(): void {
    this.createChart();
  }

  async createChart(): Promise<void> {
    try {
      const containerId = "chart";
      this.chartData = await getReadings();
      const processedData = sortByTime(groupByDay(this.chartData)).slice(-30);
      renderChart(containerId, processedData);
    } catch (error) {
      console.error("Erro ao criar o gráfico:", error);
    }
  }
}
