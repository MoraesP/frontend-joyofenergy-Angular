import { Injectable } from "@angular/core";
import { Observable, delay, from, of } from "rxjs";
import { Data } from "../models/dataModel";
import { getReadings, groupByDay, sortByTime } from "../utils/reading";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor() {}

  getChartData(): Observable<Data[]> {
    return from(
      getReadings(1200).then((readings) => {
        const processedData = sortByTime(groupByDay(readings));
        return processedData.slice(-30);
      })
    ).pipe(delay(400));
  }

  getDevicesData(): Observable<Array<{ name: string; consumption: string }>> {
    const devicesData = [
      { name: "Air conditioner", consumption: "0.3093kW" },
      { name: "Wi-Fi router", consumption: "0.0033kW" },
      { name: "Humidifier", consumption: "0.0518kW" },
      { name: "Smart TV", consumption: "0.1276kW" },
      { name: "Diffuser", consumption: "0.0078kW" },
      { name: "Refrigerator", consumption: "0.0923kW" },
    ];
    return of(devicesData).pipe(delay(250));
  }
}
