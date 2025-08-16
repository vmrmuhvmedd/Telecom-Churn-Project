import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ICustomer } from '../../shared/models/icustomer';
import { CustomerService } from '../../core/services/customer/customer.service';
import { CommonModule } from '@angular/common';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit, AfterViewInit {
  customers: ICustomer[] = [];

  activeCustomers = 0;
  churnedCustomers = 0;
  churnRate = 0;
  arpu = 0;
  avgTenure = 0;
  femaleCount = 0;
  maleCount = 0;
  NC = 0;
  DetaC = 0;
  REV = 0;


  @ViewChild('churnChart') churnChartRef!: ElementRef<HTMLCanvasElement>;
  churnChart!: Chart;
  @ViewChild('paymentChartRef') paymentChartRef!: ElementRef<HTMLCanvasElement>;
  paymentChart!: Chart;
  @ViewChild('techSupportChartRef') techSupportChartRef!: ElementRef<HTMLCanvasElement>;
  techSupportChart!: Chart
  @ViewChild('revenueChartRef') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  revenueChart!: Chart
  @ViewChild('churnInternetChartRef') churnInternetChartRef!: ElementRef<HTMLCanvasElement>;
  churnInternetChart!: Chart

  constructor(
    private _customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  ngAfterViewInit(): void {

  }

  getAllCustomers(): void {
    this._customerService.getAllCustomers().subscribe({
      next: (data: ICustomer[]) => {
        this.customers = data;
        this.calculateStats();
        this.loadChart();
        this.loadPaymentChart();
        this.loadTechSupportChart();
        this.loadRevenueChart();
        this.loadChurnInternetChart();
      },
      error: (err) => {
        console.error('Error loading customers:', err);
      }
    });
  }


  calculateStats(): void {
    const total = this.customers.length;

    this.activeCustomers = this.customers.filter(c => c.Churn === "No").length;
    this.churnedCustomers = this.customers.filter(c => c.Churn === "Yes").length;
    this.churnRate = total > 0 ? (this.churnedCustomers / total) * 100 : 0;

    const activeCustomersList = this.customers.filter(c => c.Churn === "No");
    const totalRevenueActive = activeCustomersList.reduce((sum, c) => sum + (c.MonthlyCharges || 0), 0);
    this.arpu = activeCustomersList.length > 0 ? totalRevenueActive / activeCustomersList.length : 0;

    const churnedTenures = this.customers.filter(c => c.Churn === "Yes").map(c => c.tenure || 0);
    this.avgTenure = churnedTenures.length > 0
      ? churnedTenures.reduce((sum, t) => sum + t, 0) / churnedTenures.length
      : 0;

    this.femaleCount = this.customers.filter(c => c.gender === "Female").length;
    this.maleCount = this.customers.filter(c => c.gender === "Male").length;

    const newCustomersList = this.customers.filter(c => c.tenure <= 1 && c.Churn === "No");
    this.NC = newCustomersList.length;

    this.DetaC = this.NC - this.churnedCustomers;

    const newRevenue = newCustomersList.reduce((sum, c) => sum + (c.MonthlyCharges || 0), 0);
    const lostRevenue = this.customers
      .filter(c => c.Churn === "Yes")
      .reduce((sum, c) => sum + (c.MonthlyCharges || 0), 0);

    this.REV = newRevenue - lostRevenue;
  }

  loadChart() {
    const groups = ['<= 6 Months', '<= 12 Months', '> 12 Months'];

    const dataValues = groups.map(group => {

      const groupCustomers = this.customers.filter(c => c.Tenure_Group === group);
      const totalCount = groupCustomers.length;

      const churnedCustomers = groupCustomers.filter(c => c.Churn === "Yes");
      const churnCount = churnedCustomers.length;

      const churnRate = totalCount === 0 ? 0 : (churnCount / totalCount) * 100;

      console.log(`Group: ${group} | Total: ${totalCount} | Churned: ${churnCount} | Churn Rate: ${churnRate.toFixed(1)}%`);

      return churnRate;
    });

    const colors = ['#111f3f'];

    this.churnChart = new Chart(this.churnChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: groups,
        datasets: [{
          label: 'Churn Rate (%)',
          data: dataValues,
          backgroundColor: colors,
          barThickness: 60,
          maxBarThickness: 60,
          minBarLength: 2,
          borderRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            callbacks: { label: (context) => `${context.parsed.y.toFixed(1)}%` }
          }
        },
        scales: {
          y: { beginAtZero: true, max: 60, title: { display: true, text: 'Churn Rate (%)' } },
          x: { ticks: { font: { size: 14 } } }
        }
      }
    });


  }

  loadPaymentChart() {
    const paymentMethods = [
      'Bank transfer (automatic)',
      'Credit card (automatic)',
      'Electronic check',
      'Mailed check'
    ];

    const churnYesData = paymentMethods.map(method =>
      this.customers.filter(c => c.PaymentMethod === method && c.Churn === "Yes").length
    );

    const churnNoData = paymentMethods.map(method =>
      this.customers.filter(c => c.PaymentMethod === method && c.Churn === "No").length
    );

    const colors = ['#4d659cff', '#111f3f'];

    this.paymentChart = new Chart(this.paymentChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: paymentMethods,
        datasets: [
          {
            label: 'Churn = Yes',
            data: churnYesData,
            backgroundColor: colors[0]
          },
          {
            label: 'Churn = No',
            data: churnNoData,
            backgroundColor: colors[1]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: {
            stacked: false
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Number of Customers' }
          }
        }
      }
    });
  }

  loadTechSupportChart() {
    const tenures = Array.from(new Set(this.customers.map(c => c.tenure))).sort((a, b) => a - b);

    const techSupportCounts = tenures.map(t =>
      this.customers.filter(c => c.tenure === t && c.TechSupport === "Yes").length
    );

    const colors = '#111f3f';

    this.techSupportChart = new Chart(this.techSupportChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: tenures,
        datasets: [{
          label: 'Tech Support Count',
          data: techSupportCounts,
          borderColor: colors,
          backgroundColor: colors,
          fill: false,
          tension: 0.2,
        }]
      },

      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: {
            title: { display: true, text: 'Tenure (Months)' }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Number of Customers with Tech Support' }
          }
        }
      }
    });
  }

  loadRevenueChart() {
    const contracts = ['Month-to-month', 'One year', 'Two year'];

    const totalMonthlyCharges = contracts.map(contract =>
      this.customers
        .filter(c => c.Contract === contract)
        .reduce((sum, c) => sum + (Number(c.MonthlyCharges) || 0), 0)
    );

    const colors = ['#4d659cff'];

    this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: contracts,
        datasets: [
          {
            label: '',
            data: totalMonthlyCharges,
            backgroundColor: colors,
            barThickness: 20,
            maxBarThickness: 35,
            categoryPercentage: 0.6,
            barPercentage: 0.8
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            anchor: 'start',
            align: 'end',
            color: '#000000ff',
            formatter: (value: number, context) => {
              return `${context.chart.data.labels![context.dataIndex]}: $${value.toFixed(2)}`;
            },
            font: { size: 12 }
          }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      },
      plugins: [ChartDataLabels]
    });
  }


  loadChurnInternetChart() {
    const services = ['DSL', 'Fiber optic', 'No'];

    const churnCounts = services.map(service =>
      this.customers.filter(c => c.InternetService === service && c.Churn === "Yes").length
    );

    const colors = ['#111f3f', '#4d659cff', '#406dd8ff'];

    this.churnInternetChart = new Chart(this.churnInternetChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: services,
        datasets: [
          {
            label: 'Churn Count',
            data: churnCounts,
            backgroundColor: colors,
            barThickness: 20,
            maxBarThickness: 30,
            categoryPercentage: 0.5,
            barPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: 'white',
            formatter: (value: number) => value.toString(),
            font: { weight: 'bold', size: 14 }
          }
        },
        scales: {
          x: { title: { display: false, text: 'Internet Service' } },
          y: { beginAtZero: true }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

}
