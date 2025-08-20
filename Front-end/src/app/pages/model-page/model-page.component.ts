import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IChurnRequest, IChurnResponse } from '../../shared/models/ichurnRequest';
import { PredictionService } from '../../core/services/prediction/prediction.service';
import { CommonModule } from '@angular/common';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-model-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './model-page.component.html',
  styleUrl: './model-page.component.css'
})
export class ModelPageComponent {
  predictionForm: FormGroup;
  response?: IChurnResponse;
  loading = false;

  @ViewChild('probChart') probChart!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  constructor(
    private fb: FormBuilder,
    private _predictionService: PredictionService
  ) {
    this.predictionForm = this.fb.group({
      tenure: [1, [Validators.required, Validators.min(0)]],
      MonthlyCharges: [0, [Validators.required, Validators.min(0)]],
      TotalCharges: [0, [Validators.required, Validators.min(0)]],
      InternetService: ['DSL', Validators.required],
      OnlineSecurity: ['No', Validators.required],
      OnlineBackup: ['Yes', Validators.required],
      TechSupport: ['No', Validators.required],
      Contract: ['Month-to-month', Validators.required],
      PaymentMethod: ['Electronic check', Validators.required]
    });
  }

  onSubmit() {
    if (this.predictionForm.invalid) return;

    this.loading = true;
    const data: IChurnRequest = this.predictionForm.value;

    this._predictionService.predict(data).subscribe({
      next: (res: IChurnResponse) => {
        this.response = res;
        this.loading = false;

        setTimeout(() => {
          this.renderChart(res.probability);
        }, 0);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  renderChart(prob: number) {
    if (!this.probChart) return;
    const ctx = this.probChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    if (prob > 0.5) {
      gradient.addColorStop(0, '#ff4d4d');
      gradient.addColorStop(1, '#b30000');
    } else {
      gradient.addColorStop(0, '#4caf50');
      gradient.addColorStop(1, '#1b5e20');
    }

    const centerText = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { width, height } = chart;
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = `${(height / 7).toFixed(0)}px Arial`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = prob > 0.5 ? '#b30000' : '#1b5e20';
        ctx.textAlign = 'center';
        ctx.fillText(`${(prob * 100).toFixed(1)}%`, width / 2, height / 1.15);
        ctx.restore();
      }
    };

    const shadowPlugin = {
      id: 'shadowPlugin',
      beforeDraw: (chart: any) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
      },
      afterDraw: (chart: any) => {
        chart.ctx.restore();
      }
    };

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Churn Probability', 'Remaining'],
        datasets: [{
          data: [prob * 100, 100 - prob * 100],
          backgroundColor: [gradient, '#f0f0f0'],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        cutout: '70%',
        rotation: -90,
        circumference: 180,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.parsed.toFixed(2)}%`
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutCubic'
        }
      },
      plugins: [centerText, shadowPlugin]
    });
  }
}
