import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {

  constructor() { }

  writeCsv(data: any[], filename: string) {
    const csvContent = this.convertToCsv(data);
    this.downloadCsv(csvContent, filename);
  }

  private convertToCsv(data: any[]): string {
    const csv = Papa.unparse(data);
    return csv;
  }

  private downloadCsv(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

}
