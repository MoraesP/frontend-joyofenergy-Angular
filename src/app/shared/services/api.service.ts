import { Injectable } from "@angular/core";
import { Observable, delay, from, of } from "rxjs";
import { Data } from "../models/dataModel";
import { getReadings, groupByDay, sortByTime } from "../utils/reading";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor() {}

  getEnergyReadings(length: number = 1200): Observable<Data[]> {
    return from(getReadings(length)).pipe(delay(500));
  }

  getProcessedEnergyData(length: number = 1200): Observable<Data[]> {
    return from(
      getReadings(length).then((readings) => {
        const groupedData = groupByDay(readings);
        return sortByTime(groupedData);
      })
    ).pipe(delay(300));
  }

  getChartData(): Observable<Data[]> {
    return from(
      getReadings(1200).then((readings) => {
        const processedData = sortByTime(groupByDay(readings));
        return processedData.slice(-30);
      })
    ).pipe(delay(400));
  }

  getEnergyStats(): Observable<{
    totalConsumption: number;
    averageDaily: number;
    peakConsumption: number;
    lastUpdate: Date;
  }> {
    return from(
      getReadings(30).then((readings) => {
        const values = readings.map((r) => r.value);
        const total = values.reduce((sum, val) => sum + val, 0);
        const average = total / values.length;
        const peak = Math.max(...values);

        return {
          totalConsumption: Number(total.toFixed(2)),
          averageDaily: Number(average.toFixed(2)),
          peakConsumption: Number(peak.toFixed(2)),
          lastUpdate: new Date(),
        };
      })
    ).pipe(delay(200));
  }

  getDevicesData(): Observable<
    Array<{ name: string; consumption: string; status: string }>
  > {
    const devicesData = [
      { name: "Air conditioner", consumption: "0.3093kW", status: "active" },
      { name: "Wi-Fi router", consumption: "0.0033kW", status: "active" },
      { name: "Humidifier", consumption: "0.0518kW", status: "active" },
      { name: "Smart TV", consumption: "0.1276kW", status: "standby" },
      { name: "Diffuser", consumption: "0.0078kW", status: "active" },
      { name: "Refrigerator", consumption: "0.0923kW", status: "active" },
    ];
    return of(devicesData).pipe(delay(250));
  }
}
